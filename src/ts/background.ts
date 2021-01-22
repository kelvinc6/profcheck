import { SchoolId } from "./constants";
import {
  FUZZY_CONST_UBC,
  FUZZY_CONST_UOFT,
  RMP_QUERY_BASE_URL,
} from "./constants";
import { Typos, RMPResponse } from "./d";

chrome.runtime.onInstalled.addListener(function (details) {
  updateTypos();
  chrome.alarms.create("updateTypos", {
    periodInMinutes: 30,
  });
});

chrome.alarms.onAlarm.addListener(() => updateTypos());

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  const schoolIds: SchoolId[] = req.schoolIds;
  let name = req.name;

  chrome.storage.local.get("typos", (storage) => {
    const typos: Typos = storage.typos;
    name = typoCheck(name, typos);
    const query: string = queryConstructor(schoolIds[0], name);
    const url: string = urlConstructor(query, schoolIds);
    getRMPResponse(url).then((res) => sendResponse(res));
  });
  return true;
});

async function getRMPResponse(url: string): Promise<RMPResponse> {
  return fetch(url)
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
 * Creates an Apache Solr search query depending on school
 */
function queryConstructor(school: SchoolId, name: string) {
  switch (school) {
    case SchoolId.UBC_OKANAGAN:
    case SchoolId.UBC:
      name = splitName(name).toString();
      return name
        .replace(/,/g, `~${FUZZY_CONST_UBC}%20`)
        .concat(`~${FUZZY_CONST_UBC}`)
        .toLowerCase();
    case SchoolId.UofT:
    case SchoolId.UofT_ST_GEORGE:
    case SchoolId.UofT_MISSISSAUGA:
    case SchoolId.UofT_SCARBOROUGH:
      return (
        "teacherfirstname_t:" +
        name
          .trim()
          .toLowerCase()
          .replace(" ", "*%20AND%20teacherlastname_t:")
          .concat(`~${FUZZY_CONST_UOFT}`)
      );
  }
}

/**
 * Creates a Solr search URL to Rate My Professor's database
 * @param query - search query
 * @param schoolid - array of school ids' to search
 * @param mm - Solr minimum should match
 */
function urlConstructor(query: string, schoolIdArray: SchoolId[]) {
  let schoolIdFilterQuery: string = "";
  schoolIdArray.forEach((schoolId, i) => {
    schoolIdFilterQuery = schoolIdFilterQuery.concat(schoolId.toString());
    if (i < schoolIdArray.length - 1) {
      schoolIdFilterQuery = schoolIdFilterQuery.concat("%20OR%20");
    }
  });
  return (
    RMP_QUERY_BASE_URL + `&fq=schoolid_s:(${schoolIdFilterQuery})&q=${query}`
  );
}

/**
 * Check's a name against an set of key-value pairs consisting of an
 * incorrect spelling and the correct spelling, and returns the correct
 * spelling if found
 */
function typoCheck(name: string, typos: Typos): string {
  return typos.hasOwnProperty(name) ? typos[name] : name;
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

/**
 * Returns name array of a name with hyphenated names split and appended to the array
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
