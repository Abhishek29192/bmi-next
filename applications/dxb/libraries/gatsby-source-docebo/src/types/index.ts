import type {
  BackgroundImage,
  Course,
  CourseAdditionalFields,
  CourseCategory,
  CourseDates,
  CourseSessions,
  CourseSessionAttendanceType,
  Enrolled,
  PartnerData
} from "./course";
import type { Category } from "./category";
import type { Catalogue } from "./catalogue";
import type { Certification } from "./certification";
import type { Sort } from "./sort";

export type { Catalogue, CatalogueSubItem, CatalogueData } from "./catalogue";
export type { Category } from "./category";
export type { Certification } from "./certification";
export type {
  BackgroundImage,
  Course,
  CourseAdditionalFields,
  CourseCategory,
  CourseDates,
  CourseSessions,
  CourseSessionAttendanceType,
  Enrolled,
  PartnerData
};

export type Auth = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
};

export type NodeBuilderInput =
  | {
      type: typeof NODE_TYPES.Courses;
      data: Course;
    }
  | {
      type: typeof NODE_TYPES.Categories;
      data: Category;
    }
  | {
      type: typeof NODE_TYPES.Catalogues;
      data: Catalogue;
    }
  | {
      type: typeof NODE_TYPES.Certifications;
      data: Certification;
    };

export interface DoceboData<T> {
  data: {
    count: number;
    has_more_data: boolean;
    current_page: number;
    current_page_size: number;
    total_page_count: number;
    total_count: number;
    sort: Sort[];
    items: T[];
  };
}

export interface DoceboApiServiceParams {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
}

export type StringOrUndefined = string | undefined;

export const NODE_TYPES = {
  Categories: "DoceboCategories",
  Courses: "DoceboCourses",
  Catalogues: "DoceboCatalogues",
  Certifications: "DoceboCertifications"
} as const;
