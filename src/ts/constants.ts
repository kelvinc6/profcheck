const AUTH_TOKEN = 'dGVzdDp0ZXN0';

/**
 * Rate My Professors teacher page base URL
 * SET 'tid' (teacher id) SEARCH PARAMETER FIELD BEFORE USING
 * @constant 
 * @type {URL}
 */
const RMP_TEACHER_BASE_URL: URL = new URL(
  "https://www.ratemyprofessors.com/ShowRatings.jsp"
);

/**
 * Rate My Professors add teacher URL
 * @constant
 * @type {URL}
 */
const RMP_ADD_TEACHER_URL: URL = new URL(
  "https://www.ratemyprofessors.com/AddTeacher.jsp"
);

/**
 * Rate My Professors GraphQL endpoint URL
 * @constant
 * @type {URL}
 */
const RMP_QUERY_BASE_URL: URL = new URL('https://www.ratemyprofessors.com/graphql');

enum School {
  UBC,
  UofT,
}

enum SchoolId {
  UBC = "U2Nob29sLTE0MTM=",
  UBC_OKANAGAN = "U2Nob29sLTU0MzY=",
  UofT = "U2Nob29sLTEyMTg0",
  UofT_ST_GEORGE = "U2Nob29sLTE0ODQ=",
  UofT_MISSISSAUGA = "U2Nob29sLTQ5Mjg=",
  UofT_SCARBOROUGH = "U2Nob29sLTQ5MTk=",
}

export {
  AUTH_TOKEN,
  RMP_ADD_TEACHER_URL,
  RMP_TEACHER_BASE_URL,
  RMP_QUERY_BASE_URL,
  School,
  SchoolId,
};
