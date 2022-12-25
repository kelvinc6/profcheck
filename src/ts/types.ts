import { SchoolId } from "./constants";

/**
 * Content script request
 */
export interface RMPRequest {
  name: string;
  schoolId: SchoolId;
}

interface ISchoolFromSearch {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface ITeacherFromSearch {
  id: string;
  firstName: string;
  lastName: string;
  avgDifficulty: number;
  avgRating: number;
  numRatings: number;
  department: string;
  school: ISchoolFromSearch;
  legacyId: number;
  error?: any[]
}