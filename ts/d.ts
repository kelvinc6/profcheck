const FUZZY_CONST_UBC = 0.6;
const FUZZY_CONST_UOFT = 0.8;

const RMP_TEACHER_BASE_URL: string = 'https://www.ratemyprofessors.com/ShowRatings.jsp?tid='
const RMP_ADD_TEACHER_URL:string = 'https://www.ratemyprofessors.com/AddTeacher.jsp'

interface RMPRequest {
  name:string
  schoolIds: SchoolId[]
}

interface RMPResponse {
  success: boolean;
  error?: Error;
  numFound: number;
  start: number;
  docs: Array<RMPTeacherData>;
}

interface RMPTeacherData {
  averageratingscore_rf: number;
  pk_id: number;
  total_number_of_ratings_i: number;
  schoolid_s: string;
  teacherfirstname_t: string;
  teacherlastname_t: string;
}

interface Typos {
  [key: string]: string;
}

enum SchoolId {
  UBC = 1413,
  UBC_OKANAGAN = 5436,
  UofT = 12184,
  UofT_ST_GEORGE = 1484,
  UofT_MISSISSAUGA = 4928,
  UofT_SCARBOROUGH = 4919
}

enum School {
  UBC,
  UofT
}


