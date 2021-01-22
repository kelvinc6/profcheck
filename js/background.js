/**
 * Represents degree of fuzziness used in the search query
 * @constant {number}
 */
const FUZZY_CONST = 0.6;

/**
 * Gets the current up-to-date typos.json file from GitHub on installation
 * @listens onInstalled
 */
chrome.runtime.onInstalled.addListener(function () {
  updateTypos();
  chrome.alarms.create("updateTypos", {
    periodInMinutes: 30,
  });
});

/**
 * Updates the local typos.json
 * @listens onAlarm
 */
chrome.alarms.onAlarm.addListener((alarm) => updateTypos());

/**
 * Listens for message from content script with instructor name
 * @listens onMessage
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const instructorName = request.instructorName;
  const isUBCO = request.isUBCO;

  //Get stored typos for checking, then call getInfo
  chrome.storage.local.get("typos", (storage) =>
    getFormattedInstructorInfo(
      instructorName,
      isUBCO,
      storage.typos
    ).then((res) => sendResponse(res))
  );
  return true;
});

/**
 * The formatted result of a search to RMP's database
 * @typedef {Object} RMPData
 * @property {boolean} isSuccessful - Whether the query was sucessful in returning a result
 * @property {number} avgRatingScore - Rating out of 5
 * @property {number} numRatings - Number of ratings
 * @property {string} link - Link to RMP page
 */

/**
 * Get the Rate My Professor's data of a instructor at UBC after typo checking
 * @param {string} instructorName - Instructor name in format of UBC's SSC
 * @param {boolean} isUBCO
 * @param {Object.<string, string>} typos
 * @returns {Promise<{isSuccessful: boolean, averageRatingScore: number, numRatings: number, link: string}>}
 */
async function getFormattedInstructorInfo(instructorName, isUBCO, typos) {
  instructorName = typoCheck(instructorName, typos);
  const url = queryConstructor(instructorName, isUBCO);
  const responseJson = await fetch(url).then((res) => res.json());

  //We always take the first result
  if (responseJson.response.numFound != 0) {
    const professorData = responseJson.response.docs[0];
    const PROF_LINK = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorData.pk_id}`;
    return {
      isSuccessful: true,
      avgRatingScore: professorData.averageratingscore_rf,
      numRatings: professorData.total_number_of_ratings_i,
      link: PROF_LINK,
    };
  } else {
    return {
      isSuccessful: false,
      avgRatingScore: null,
      numRatings: null,
      link: "https://www.ratemyprofessors.com/AddTeacher.jsp",
    };
  }
}

/**
 * Formats instructor name for use in search query
 * @param {string} instructorName
 */
function formatName(instructorName) {
  instructorName = splitName(instructorName).toString();
  return instructorName
    .replace(/,/g, `~${FUZZY_CONST}%20`)
    .concat(`~${FUZZY_CONST}`)
    .toLowerCase();
}

/**
 * Returns name array of a name with hyphenated names split and appended to the array
 * @param {string} instructorName
 * @returns {string[]}
 */
function splitName(instructorName) {
  var nameArray = instructorName.split(/[\s,]+/);
  for (i = 0; i < nameArray.length; i++) {
    const name = nameArray[i];
    if (name.includes("-")) {
      const hyphenSplitArray = name.split("-");
      nameArray = nameArray.concat(hyphenSplitArray);
    }
  }
  return nameArray;
}

/**
 * Constructs a fuzzy search query of first and last name
 * to Rate My Professor's database
 * @param {string} instructorName
 * @param {boolean} isUBCO
 */
function queryConstructor(instructorName, isUBCO) {
  instructorName = formatName(instructorName);
  const schoolID = isUBCO ? "5436" : "1413";
  const databaseURL = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?spellcheck=false&fq=schoolid_s:${schoolID}&wt=json&qf=teacherfirstname_t+teacherlastname_t&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf&q=${instructorName}&mm=2`;

  return databaseURL;
}

/**
 * Check's a name against an set of key-value pairs consisting of an
 * incorrect spelling and the correct spelling, and returns the correct
 * spelling if found
 * @param {string} instructorName
 * @param {Object.<string,string>} typos
 */
function typoCheck(instructorName, typos) {
  const hasTypo = typos.hasOwnProperty(instructorName);
  return hasTypo ? typos[instructorName] : instructorName;
}

/**
 * Updates the typos.json file in Chrome's local storage from remote GitHub repository
 */
function updateTypos() {
  fetch("https://insidiousdata.github.io/data/typos.json")
    .then((res) => res.json())
    .then((typos) =>
      chrome.storage.local.set({ typos }, function () {
        console.log("Typos updated!");
      })
    )
    .catch((error) =>
      chrome.storage.local.set({ typos: {} }, function () {
        console.log("Could not update typos!");
      })
    );
}
