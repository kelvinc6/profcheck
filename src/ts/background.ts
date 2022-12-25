import { GraphQLClient } from "graphql-request";
import { SchoolId, AUTH_TOKEN, RMP_QUERY_BASE_URL } from "./constants";
import { RMPRequest, ITeacherFromSearch } from "./types";
import { searchTeacherQuery } from './queries';

/**
 * Create listener for content script message
 */
chrome.runtime.onMessage.addListener(function (
  req: RMPRequest,
  sender,
  sendResponse
) {
  const schoolId: SchoolId = req.schoolId;
  let name: string = req.name.split(",")[0] // Only search by last name;
  searchTeacher(name, schoolId).then(res => sendResponse(res));
  return true;
});

async function searchTeacher(name: string, schoolID: string): Promise<ITeacherFromSearch[]> {
  const client = new GraphQLClient(RMP_QUERY_BASE_URL.toString(), {
    headers: {
      authorization: `Basic ${AUTH_TOKEN}`
    },
    fetch // Pass in a custom fetch function for MV3
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