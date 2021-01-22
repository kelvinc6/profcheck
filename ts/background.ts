const FUZZY_CONST_UBC = 0.6;
const FUZZY_CONST_UOFT = 0.8;

chrome.runtime.onInstalled.addListener(function () {
  updateTypos();
  chrome.alarms.create("updateTypos", {
    periodInMinutes: 30,
  });
});

chrome.alarms.onAlarm.addListener(() => updateTypos());

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  const school = req.school;
  const instructorName = req.instructorName;
  const isUBCO = req.isUBCO;

  switch (school) {
    case "UBC":
      //Get stored typos for checking, then call getInfo
      chrome.storage.local.get("typos", (storage) =>
        getFormattedInstructorInfo(
          school,
          instructorName,
          isUBCO,
          storage.typos
        ).then((res) => sendResponse(res))
      );
      return true;
    case "UofT":
      getFormattedInstructorInfo(
        school,
        instructorName,
        false,
        {}
      ).then((res) => sendResponse(res));
      return true;
  }
});

interface RMPData {
  isSuccessful: boolean;
  numFound: number;
  avgRatingScore: number;
  numRatings: number;
  link: string;
}

interface Typos {
  [key: string]: string;
}

async function getFormattedInstructorInfo(
  school: string,
  instructorName: string,
  isUBCO: boolean,
  typos: Typos
): Promise<RMPData> {
  instructorName = typoCheck(school, instructorName, typos);

  const url: string = queryURLConstructor(school, instructorName, isUBCO);
  const json = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      return {};
    });

  if (json.response.numFound != 0) {
    const professorData = json.response.docs[0];
    const PROF_LINK = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorData.pk_id}`;
    return {
      isSuccessful: true,
      numFound: json.response.numFound,
      avgRatingScore: professorData.averageratingscore_rf,
      numRatings: professorData.total_number_of_ratings_i,
      link: PROF_LINK,
    };
  } else {
    return {
      isSuccessful: false,
      numFound: json.response.numFound,
      avgRatingScore: 0,
      numRatings: 0,
      link: "https://www.ratemyprofessors.com/AddTeacher.jsp",
    };
  }
}

/**
 * Formats instructor name for use in search query
 * @param {string} instructorName
 */
function queryConstructor(school: string, instructorName: string) {
  switch (school) {
    case "UBC":
      instructorName = splitName(instructorName).toString();
      return instructorName
        .replace(/,/g, `~${FUZZY_CONST_UBC}%20`)
        .concat(`~${FUZZY_CONST_UBC}`)
        .toLowerCase();
    case "UofT":
      return (
        "teacherfirstname_t:" +
        instructorName
          .trim()
          .toLowerCase()
          .replace(" ", "*%20AND%20teacherlastname_t:")
          .concat(`~${FUZZY_CONST_UOFT}`)
      );
  }
}

/**
 * Returns name array of a name with hyphenated names split and appended to the array
 * @param {string} instructorName
 * @returns {string[]}
 */
function splitName(instructorName: string) {
  var nameArray = instructorName.split(/[\s,]+/);
  nameArray.forEach((name) => {
    if (name.includes("-")) {
      const hyphenSplitArray = name.split("-");
      nameArray = nameArray.concat(hyphenSplitArray);
    }
  });
  return nameArray;
}

function queryURLConstructor(
  school: string,
  instructorName: string,
  isUBCO: boolean
): string {
  switch (school) {
    case "UBC":
      var query = queryConstructor(school, instructorName);
      const schoolID = isUBCO ? "5436" : "1413";
      const databaseURL = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?spellcheck=false&fq=schoolid_s:${schoolID}&wt=json&qf=teacherfirstname_t+teacherlastname_t&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf&q=${query}&mm=2`;
      return databaseURL;
    case "UofT":
      var query = queryConstructor(school, instructorName);
      const url = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?spellcheck=false&fq=schoolid_s:1484%20OR%20schoolid_s:4928%20OR%20schoolid_s:4919%20OR%20schoolid_s:12184&wt=json&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf&q=${query}`;
      return url;
    default:
      return "";
  }
}

/**
 * Check's a name against an set of key-value pairs consisting of an
 * incorrect spelling and the correct spelling, and returns the correct
 * spelling if found
 * @param {string} instructorName
 * @param {Object.<string,string>} typos
 */
function typoCheck(
  school: string,
  instructorName: string,
  typos: Typos
): string {
  return typos.hasOwnProperty(instructorName)
    ? typos[instructorName]
    : instructorName;
}

/**
 * Updates the typos.json file in Chrome's local storage from remote GitHub repository
 */
function updateTypos() {
  fetch("https://insidiousdata.github.io/data/typos.json")
    .then((res) => res.json())
    .then((typos) => {
      chrome.storage.local.set({ typos }, function () {
        console.log("Typos updated!");
      });
    })
    .catch((error) =>
      chrome.storage.local.set({ typos: {} }, function () {
        console.log("Could not update typos!");
      })
    );
}
