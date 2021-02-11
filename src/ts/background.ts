import { School, SchoolId, TYPOS_URL } from "./constants";
import {
  FUZZY_CONST_UBC,
  FUZZY_CONST_UOFT,
  RMP_QUERY_BASE_URL,
} from "./constants";
import { Typos, RMPResponse, RMPRequest } from "./types";

/**
 * Create a typo update alarm on installation
 */
chrome.runtime.onInstalled.addListener(() => {
  updateTypos();
  chrome.alarms.create("updateTypos", {
    periodInMinutes: 30,
  });
  chrome.alarms.onAlarm.addListener(() => updateTypos());
});

/**
 * Create listener for content script message
 */
chrome.runtime.onMessage.addListener(function (
  req: RMPRequest,
  sender,
  sendResponse
) {
  const schoolIds: SchoolId[] = req.schoolIds;
  const school: School = req.school;
  let name: string = req.name;

  chrome.storage.local.get("typos", (storage) => {
    const typos: Typos = storage.typos;
    name = typoCheck(name, typos);
    const query: string = queryConstructor(school, name);
    const url: URL = urlConstructor(query, schoolIds);
    getRMPResponse(url).then((res) => sendResponse(res));
  });
  return true;
});

/**
 * Get response JSON from RMP query url
 * @param {URL} url - query URL object
 */
async function getRMPResponse(url: URL): Promise<RMPResponse> {
  return fetch(url.toString())
    .then((res) => res.json())
    .then(
      (json): RMPResponse => {
        return {
          success: true,
          ...json.response,
        };
      }
    )
    .catch(
      (err): RMPResponse => {
        return {
          success: false,
          error: err,
          numFound: 0,
          start: 0,
          docs: [],
        };
      }
    );
}

/**
 * Create an Apache Solr query depending on school
 * @param {School} school
 * @param {string} name
 */
function queryConstructor(school: School, name: string): string {
  switch (school) {
    case School.UBC:
      name = splitName(name).toString();
      return name
        .replace(/,/g, `~${FUZZY_CONST_UBC} `)
        .concat(`~${FUZZY_CONST_UBC}`)
        .toLowerCase();
    case School.UofT:
      return (
        "teacherfirstname_t:" +
        name
          .trim()
          .toLowerCase()
          .replace(" ", "* AND teacherlastname_t:")
          .concat(`~${FUZZY_CONST_UOFT}`)
      );
  }
}

/**
 * Creates a Solr search URL to Rate My Professor's database
 * @param {string} query - search query
 * @param {SchoolId[]} schoolid - array of school ids to search
 */
function urlConstructor(query: string, schoolIdArray: SchoolId[]): URL {
  let schoolIdFilterQuery: string = "";
  schoolIdArray.forEach((schoolId, i) => {
    schoolIdFilterQuery = schoolIdFilterQuery.concat(schoolId.toString());
    if (i < schoolIdArray.length - 1) {
      schoolIdFilterQuery = schoolIdFilterQuery.concat(" OR ");
    }
  });
  RMP_QUERY_BASE_URL.searchParams.set(
    "fq",
    `schoolid_s:(${schoolIdFilterQuery})`
  );
  RMP_QUERY_BASE_URL.searchParams.set("q", query);
  return RMP_QUERY_BASE_URL;
}

/**
 * Check's a name against an set of key-value pairs consisting of an
 * incorrect spelling and the correct spelling, and returns the correct
 * spelling if found
 * @param {string} name
 * @param {Typos} typos
 */
function typoCheck(name: string, typos: Typos): string {
  return typos.hasOwnProperty(name) ? typos[name] : name;
}

/**
 * Updates the typos.json file in Chrome's local storage from remote GitHub repository
 */
function updateTypos(): void {
  fetch(TYPOS_URL)
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

/**
 * Returns name array of a name with hyphenated names split and appended to the array
 * @param {string} instructorName
 */
function splitName(instructorName: string): string[] {
  var nameArray = instructorName.split(/[\s,]+/);
  nameArray.forEach((name) => {
    if (name.includes("-")) {
      const hyphenSplitArray = name.split("-");
      nameArray = nameArray.concat(hyphenSplitArray);
    }
  });
  return nameArray;
}
