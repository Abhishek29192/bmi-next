import axios, { AxiosInstance } from "axios";
import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

import {
  ITokenInfo,
  IUserCreateInput,
  IGroupCreateInput,
  ISession,
  ITrainingUser,
  IPageQueryOptions,
  IPaginateOptions,
  QueryStringParams
} from "../type";
import { createToken } from "../util/JwtUtil";

const { DOCEBO_API_URL } = process.env;

const getTokenPayload = async (username) => {
  const payload = {
    iss: process.env.DOCEBO_API_CLIENT_ID,
    sub: username,
    aud: DOCEBO_API_URL.replace(/^https?:\/\//, ""),
    iat: Date.now(),
    exp: Date.now() + 30 * 60 * 1000
  };
  const jwtToken = await createToken(payload);
  const body = {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwtToken
  };

  return body;
};

export const loginToDocebo = async (username) => {
  const body = await getTokenPayload(username);
  return axios.post(`${DOCEBO_API_URL}/oauth2/token`, body);
};

export default class Docebo extends RESTDataSource<ITokenInfo> {
  private axiosInstance: AxiosInstance;

  constructor() {
    super();
    this.baseURL = DOCEBO_API_URL;
    this.axiosInstance = axios.create({
      baseURL: DOCEBO_API_URL
    });
  }
  willSendRequest(request: RequestOptions) {
    request.headers.set("Authorization", `Bearer ${this.context?.token || ""}`);
  }

  async getTokenByUserInfo() {
    const body = {
      grant_type: "password",
      client_id: process.env.DOCEBO_API_CLIENT_ID,
      client_secret: process.env.DOCEBO_API_CLIENT_SECRET,
      username: process.env.DOCEBO_API_USERNAME,
      password: process.env.DOCEBO_API_PASSWORD
    };
    return this.axiosInstance.post(`/oauth2/token`, body);
  }

  async getTokenByJWTPayload(username: string) {
    const body = await getTokenPayload(username);
    const { data } = await this.axiosInstance.post(`/oauth2/token`, body);

    return data;
  }

  async getSSOUrl(path = "/learn/mycourses") {
    return `${this.baseURL}${path};type=oauth2_response;access_token=${this.context.token};expires_in=3600;token_type=Bearer;scope=api`;
  }

  async createSSOUrl(username: string, path = "/learn/mycourses") {
    const token = await this.getTokenByJWTPayload(username);
    return `${this.baseURL}${path};type=oauth2_response;access_token=${token.access_token};expires_in=${token.expires_in};token_type=${token.token_type};scope=${token.scope}`;
  }

  async getUser(id: number) {
    const { data } = await this.axiosInstance.get(`/manage/v1/user/${id}`);
    return data;
  }
  async getEnrollmentByUserId(userId: number, options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);
    //TODO:Add filter criteria;
    //updated_from: Filters all the courses that have been updated after a certain date/time
    const { data } = await this.axiosInstance.get(
      `/learn/v1/enrollments?id_user=${userId}&${queryString}`
    );
    return data;
  }
  async getCourse(id: number) {
    const { data } = await this.axiosInstance.get(`/learn/v1/courses/${id}`);
    return data;
  }
  async getCourses(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    //TODO:Add filter criteria;
    //updated_from: Filters all the courses that have been updated after a certain date/time
    //updated_to: Filters all the courses that have been updated before a certain date/time

    const { data } = await this.axiosInstance.get(
      `/learn/v1/courses?${queryString}`
    );
    return data;
  }
  async getSession() {
    const { data } = await this.axiosInstance.get(`/manage/v1/user/session`);
    return data;
  }
  async checkUserValidatiy(userId?: string, email?: string) {
    const mapQuery = [];
    if (userId) mapQuery.push({ name: "userid", value: userId });
    if (email) mapQuery.push({ name: "email", value: email });

    const query = `${mapQuery.map((e) => `${e.name}=${e.value}`).join("&")}`;

    const { data } = await this.axiosInstance.get(
      `/manage/v1/user/check_validity?${query}`
    );
    return data;
  }
  async createUser(input: IUserCreateInput) {
    const select_orgchart = input.select_orgchart
      ? { [`${input.select_orgchart.branch_id}`]: 1 }
      : {};
    const body = {
      ...input,
      password_retype: input.password,
      select_orgchart: select_orgchart
    };
    const { data } = await this.axiosInstance.post(`/manage/v1/user`, body);
    return data;
  }
  async getBranches(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    return this.axiosInstance.get(`/manage/v1/orgchart?${queryString}`);
  }
  async createGroup(input: IGroupCreateInput) {
    const body = {
      ...input
    };
    const { data } = await this.axiosInstance.post(`/manage/v1/group`, body);
    return data;
  }

  async getCertifications(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    const { data } = await this.axiosInstance.get(
      `/learn/v1/certification?${queryString}`
    );
    return data;
  }

  async getCatalogues(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    //show_item_list: Get sub_items (course list)
    const { data } = await this.axiosInstance.get(
      ` /learn/v1/catalog?show_item_list=1&${queryString}`
    );
    return data;
  }
  async getCategories(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    return this.axiosInstance.get(`/learn/v1/categories?${queryString}`);
  }

  //List of enrollments for current branch and children
  async getEnrollmentsReport(branchId: number, options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    const { data } = await this.axiosInstance.get(
      `/report/v1/branch_dashboard_enrollment/${branchId}?${queryString}`
    );
    return data;
  }

  async getReportDetail(reportId: number, dateFrom?: string, count?: number) {
    const mapQuery = [];
    //The start timestamp used to additionally filter report rows (in yyyy-MM-dd HH:mm:ss).
    if (dateFrom) mapQuery.push({ name: "dateFrom", value: dateFrom });
    //The number of records to return per each call
    if (count) mapQuery.push({ name: "count", value: count });

    const query = `${mapQuery.map((e) => `${e.name}=${e.value}`).join("&")}`;

    const { data: { rows = [] } = {} } = await this.axiosInstance.get(
      `/report/v1/report/${reportId}/data?${query}`
    );
    return rows;
  }

  //List user certifications from a report
  async getCertificationsReport() {
    const reportId = 7;
    const rows = await this.getReportDetail(reportId);

    const items = rows.map((item) => ({
      user_idUser: item["user.idUser"],
      user_userid: item["user.userid"],
      user_email: item["user.email"],
      certification_title: item["certification.title"],
      certification_code: item["certification.code"],
      certification_description: item["certification.description"],
      certification_expiration: item["certification.expiration"],
      enrollment_issued_on: item["enrollment.issued_on"],
      enrollment_to_renew_in: item["enrollment.to_renew_in"],
      enrollment_activity_name: item["enrollment.activity_name"],
      enrollment_activity_type: item["enrollment.activity_type"]
    }));
    return { items: items };
  }

  async getTraining() {
    return { name: "Docebo Training" };
  }
  async getTrainingUser(): Promise<ITrainingUser> {
    //TODO:Maybe We can cache session info.
    const { data } = await this.get<ISession>(`/manage/v1/user/session`);
    return data;
  }
}
const buildUrlQueryString = (options: IPageQueryOptions): string => {
  const params = {
    ...getPaginationQueryParams(options?.paginate)
  };
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
};

const getPaginationQueryParams = (
  paginate: IPaginateOptions = {}
): QueryStringParams => {
  const params = {} as QueryStringParams;

  paginate.page = paginate?.page === undefined ? 1 : paginate?.page;
  paginate.page_size =
    paginate?.page_size === undefined ? 200 : paginate?.page_size;

  Object.entries(paginate).map(([key, value]) => (params[`${key}`] = value));
  return params;
};
