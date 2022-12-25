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
 * Rate My Professors GraphQL endpoint URL
 * @constant
 * @type {URL}
 */
const RMP_QUERY_BASE_URL: URL = new URL('https://www.ratemyprofessors.com/graphql');

enum SchoolId {
  UBC = "U2Nob29sLTE0MTM=",
  UBC_OKANAGAN = "U2Nob29sLTU0MzY=",
}

export {
  AUTH_TOKEN,
  RMP_TEACHER_BASE_URL,
  RMP_QUERY_BASE_URL,
  SchoolId,
};
