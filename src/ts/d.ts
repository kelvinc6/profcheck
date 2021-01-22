import { SchoolId } from "./constants";

/**
 * Content script request
 */
interface RMPRequest {
  name: string;
  schoolIds: SchoolId[];
}

/**
 * Background script response
 */
interface RMPResponse {
  success: boolean;
  error?: Error;
  numFound: number;
  start: number;
  docs: Array<RMPTeacherData>;
}

/**
 * Rate My Professors teacher data
 */
interface RMPTeacherData {
  averageratingscore_rf: number;
  pk_id: number;
  schoolname_s: string;
  teacherdepartment_s: string;
  total_number_of_ratings_i: number;
  schoolid_s: string;
  teacherfirstname_t: string;
  teacherlastname_t: string;
}

/**
 * Represents a key-value object of typos and their corrections
 */
interface Typos {
  [key: string]: string;
}

export { RMPRequest, RMPResponse, RMPTeacherData, Typos };
