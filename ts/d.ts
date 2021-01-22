interface RMPRequest {
  name: string;
  schoolIds: SchoolId[];
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
  teacherdepartment_s: string;
  total_number_of_ratings_i: number;
  schoolid_s: string;
  teacherfirstname_t: string;
  teacherlastname_t: string;
}

interface Typos {
  [key: string]: string;
}