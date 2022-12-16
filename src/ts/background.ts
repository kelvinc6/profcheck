import { GraphQLClient } from "graphql-request";
import { School, SchoolId, AUTH_TOKEN } from "./constants";
import { RMPRequest, ISchoolFromSearch, ITeacherFromSearch, ITeacherPage } from "./types";
import {autocompleteSchoolQuery, searchTeacherQuery, getTeacherQuery} from './queries';

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
  let name: string = req.name.replaceAll(',', '').replaceAll('-', ' ');

  console.log(name);
  searchTeacher(name, SchoolId.UBC).then(res => {
    const result = {
      success: true,
      error: null,
      docs: res
    }
    sendResponse(result);
  });

  return true;
});

const searchSchool = async (query: string): Promise<ISchoolFromSearch[]> => {
  const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
  headers: {
    authorization: `Basic ${AUTH_TOKEN}`
  },
  fetch
});
  const response = await client.request(autocompleteSchoolQuery, {query});

  return response.autocomplete.schools.edges.map((edge: { node: ISchoolFromSearch }) => edge.node);
};

const searchTeacher = async (name: string, schoolID: string): Promise<ITeacherFromSearch[]> => {
  const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
  headers: {
    authorization: `Basic ${AUTH_TOKEN}`
  },
  fetch
});

  const response = await client.request(searchTeacherQuery, {
    text: name,
    schoolID
  });

  if (response.newSearch.teachers === null) {
    return [];
  }

  return response.newSearch.teachers.edges.map((edge: { node: ITeacherFromSearch }) => edge.node);
};

const getTeacher = async (id: string): Promise<ITeacherPage> => {
  const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
  headers: {
    authorization: `Basic ${AUTH_TOKEN}`
  },
  fetch
});
  const response = await client.request(getTeacherQuery, {id});

  return response.node;
};

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
