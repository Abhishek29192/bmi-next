import type {
  Catalogue,
  Category,
  Certification,
  Course,
  ExtendedCourse,
  Session,
  SessionsData
} from "@bmi/docebo-types";
import type {
  Auth,
  DoceboApiServiceParams,
  DoceboData,
  GetCourseByIdResponseType,
  GetCurrencyResponse,
  StringOrUndefined
} from "./types";

export const PAGE_SIZE = 50;

export class DoceboApiService {
  apiUrl: StringOrUndefined = undefined;
  clientId: StringOrUndefined = undefined;
  clientSecret: StringOrUndefined = undefined;
  username: StringOrUndefined = undefined;
  password: StringOrUndefined = undefined;
  accessToken: StringOrUndefined = undefined;

  constructor(params: DoceboApiServiceParams) {
    this.apiUrl = params.apiUrl;
    this.clientId = params.clientId;
    this.clientSecret = params.clientSecret;
    this.username = params.username;
    this.password = params.password;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const response = await fetch(`${this.apiUrl}oauth2/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "password",
        scope: "api",
        username: this.username,
        password: this.password
      })
    });

    const data: Auth = await response.json();
    this.accessToken = data.access_token;
    return data.access_token;
  }

  async fetchSessions({
    course_id,
    page = 1
  }: {
    course_id: number;
    page?: number;
  }): Promise<Session[]> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `${this.apiUrl}course/v1/courses/${course_id}/sessions?page=${page}&page_size=${PAGE_SIZE}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const { data, name }: SessionsData = await response.json();
    if (name) {
      return [];
    }

    const { items, has_more_data } = data;
    const sessions = has_more_data
      ? [...items, ...(await this.fetchSessions({ course_id, page: page + 1 }))]
      : items;

    return sessions;
  }

  async fetchCourses({
    page = 1,
    pageSize = PAGE_SIZE,
    ignoreNextPage = true
  }: {
    page?: number;
    pageSize?: number;
    ignoreNextPage?: boolean;
  }): Promise<Course[]> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `${this.apiUrl}learn/v1/courses?page=${page}&page_size=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const { data }: DoceboData<Course> = await response.json();

    //prevents other pages from being fetched if "page" property has been passed
    return !ignoreNextPage && data.has_more_data
      ? [...data.items, ...(await this.fetchCourses({ page: page + 1 }))]
      : data.items;
  }

  async fetchCategories({ page = 1 }: { page?: number }): Promise<Category[]> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `${this.apiUrl}learn/v1/categories?page=${page}&page_size=${PAGE_SIZE}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const { data }: DoceboData<Category> = await response.json();

    return data.has_more_data
      ? [...data.items, ...(await this.fetchCategories({ page: page + 1 }))]
      : data.items;
  }

  async fetchCatalogues({
    page = 1,
    catalogueIds
  }: {
    page?: number;
    catalogueIds?: number[];
  }): Promise<Catalogue[]> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `${this.apiUrl}learn/v1/catalog?page=${page}&page_size=${PAGE_SIZE}&show_item_list=1&items_per_catalog=99`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const { data }: DoceboData<Catalogue> = await response.json();
    const catalogues = catalogueIds?.length
      ? data.items.filter(({ catalogue_id }) =>
          catalogueIds.includes(catalogue_id)
        )
      : data.items;

    return data.has_more_data
      ? [
          ...catalogues,
          ...(await this.fetchCatalogues({ page: page + 1, catalogueIds }))
        ]
      : catalogues;
  }

  async fetchCertifications({
    page = 1
  }: {
    page?: number;
  }): Promise<Certification[]> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `${this.apiUrl}learn/v1/certification?page=${page}&page_size=${PAGE_SIZE}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const { data }: DoceboData<Certification> = await response.json();
    return data.has_more_data
      ? [...data.items, ...(await this.fetchCertifications({ page: page + 1 }))]
      : data.items;
  }

  async getCourseById(courseId: number): Promise<ExtendedCourse> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${this.apiUrl}learn/v1/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { data }: GetCourseByIdResponseType = await response.json();
    return data;
  }

  async getCurrency(): Promise<GetCurrencyResponse["data"]> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `${this.apiUrl}ecommerce/v1/ecommerce/settings`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const { data }: GetCurrencyResponse = await response.json();
    return data;
  }
}
