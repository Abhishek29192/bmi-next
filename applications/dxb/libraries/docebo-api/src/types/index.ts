import type { ExtendedCourse, Sort } from "@bmi/docebo-types";

export type Auth = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
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

export type GetCourseByIdResponseType = {
  data: ExtendedCourse;
  version: "1.0.0";
  permissions: string[];
  _links: string[];
};
