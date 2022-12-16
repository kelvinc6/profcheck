import { SchoolId, School } from "./constants";

/**
 * Content script request
 */
export interface RMPRequest {
  name: string;
  school: School;
  schoolIds: SchoolId[];
}

/**
 * Background script response
 */
export interface RMPResponse {
  success: boolean;
  error?: Error;
  docs: Array<ITeacherPage>;
}

export interface ISchoolFromSearch {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface ITeacherFromSearch {
  id: string;
  firstName: string;
  lastName: string;
  school: {
    id: string;
    name: string;
  },
  avgDifficulty: number;
  avgRating: number;
  numRatings: number;
  department: string;
  legacyId: number;
}

export interface ITeacherPage {
  id: string;
  firstName: string;
  lastName: string;
  avgDifficulty: number;
  avgRating: number;
  numRatings: number;
  department: string;
  school: ISchoolFromSearch;
  legacyId: number;
}