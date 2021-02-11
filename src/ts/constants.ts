const FUZZY_CONST_UBC = 0.6;
const FUZZY_CONST_UOFT = 0.8;

const RMP_TEACHER_BASE_URL: URL = new URL(
  "https://www.ratemyprofessors.com/ShowRatings.jsp"
);

RMP_TEACHER_BASE_URL.searchParams.set('tid', '');

const RMP_ADD_TEACHER_URL: URL = new URL(
  "https://www.ratemyprofessors.com/AddTeacher.jsp"
);

const RMP_QUERY_BASE_URL: URL = new URL('https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/');
RMP_QUERY_BASE_URL.searchParams.set('spellcheck', 'false')
RMP_QUERY_BASE_URL.searchParams.set('wt','json');
RMP_QUERY_BASE_URL.searchParams.set('qf','teacherfirstname_t teacherlastname_t');
RMP_QUERY_BASE_URL.searchParams.set('fl','pk_id teacherfirstname_t teacherlastname_t total_number_of_ratings_i averageratingscore_rf schoolid_s teacherdepartment_s schoolname_s averageeasyscore_rf');
RMP_QUERY_BASE_URL.searchParams.set('mm','2');

const TYPOS_URL: string = "https://insidiousdata.github.io/data/typos.json";

enum School {
  UBC,
  UofT,
}

enum SchoolId {
  UBC = 1413,
  UBC_OKANAGAN = 5436,
  UofT = 12184,
  UofT_ST_GEORGE = 1484,
  UofT_MISSISSAUGA = 4928,
  UofT_SCARBOROUGH = 4919,
}

export {
  FUZZY_CONST_UBC,
  FUZZY_CONST_UOFT,
  RMP_ADD_TEACHER_URL,
  RMP_TEACHER_BASE_URL,
  RMP_QUERY_BASE_URL,
  TYPOS_URL,
  School,
  SchoolId,
};
