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

const {
  DOCEBO_API_URL,
  DOCEBO_API_CLIENT_ID,
  DOCEBO_API_CLIENT_SECRET,
  DOCEBO_API_USERNAME,
  DOCEBO_API_PASSWORD
} = process.env;

export default class Docebo extends RESTDataSource<ITokenInfo> {
  constructor() {
    super();
    this.baseURL = DOCEBO_API_URL;
  }
  willSendRequest(request: RequestOptions) {
    request.headers.set("Authorization", `Bearer ${this.context.token}`);
  }

  async getTokenByUserInfo() {
    const body = {
      grant_type: "password",
      client_id: DOCEBO_API_CLIENT_ID,
      client_secret: DOCEBO_API_CLIENT_SECRET,
      username: DOCEBO_API_USERNAME,
      password: DOCEBO_API_PASSWORD
    };
    return this.post(`/oauth2/token`, body);
  }

  async getTokenByJWTPayload(username: string) {
    const payload = {
      iss: DOCEBO_API_CLIENT_ID,
      sub: username,
      aud: this.baseURL.replace(/^https?:\/\//, ""),
      iat: Date.now(),
      exp: Date.now() + 30 * 60 * 1000
    };
    const jwtToken = await createToken(payload);
    const body = {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwtToken
    };
    return this.post(`/oauth2/token`, body);
  }
  async getSSOUrl(path: string = "/learn/mycourses") {
    return `${this.baseURL}${path};type=oauth2_response;access_token=${this.context.token};expires_in=3600;token_type=Bearer;scope=api`;
  }

  async createSSOUrl(username: string, path: string = "/learn/mycourses") {
    const {
      access_token,
      expires_in,
      token_type,
      scope
    } = await this.getTokenByJWTPayload(username);
    return `${this.baseURL}${path};type=oauth2_response;access_token=${access_token};expires_in=${expires_in};token_type=${token_type};scope=${scope}`;
  }

  async getUser(id: Number) {
    const { data } = await this.get(`/manage/v1/user/${id}`);
    return data;
  }
  async getEnrollmentByUserId(userId: Number, options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);
    //TODO:Add filter criteria;
    //updated_from: Filters all the courses that have been updated after a certain date/time
    const { data } = await this.get(
      `/learn/v1/enrollments?id_user=${userId}&${queryString}`
    );
    return data;
  }
  async getCourse(id: Number) {
    const { data } = await this.get(`/learn/v1/courses/${id}`);
    return data;
  }
  async getCourses(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    //TODO:Add filter criteria;
    //updated_from: Filters all the courses that have been updated after a certain date/time
    //updated_to: Filters all the courses that have been updated before a certain date/time

    const { data } = await this.get(`/learn/v1/courses?${queryString}`);
    return data;
  }
  async getSession() {
    const { data } = await this.get(`/manage/v1/user/session`);
    return data;
  }
  async checkUserValidatiy(userId?: String, email?: String) {
    const mapQuery = [];
    if (userId) mapQuery.push({ name: "userid", value: userId });
    if (email) mapQuery.push({ name: "email", value: email });

    const query = `${mapQuery.map((e) => `${e.name}=${e.value}`).join("&")}`;

    const { data } = await this.get(`/manage/v1/user/check_validity?${query}`);
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
    const { data } = await this.post(`/manage/v1/user`, body);
    return data;
  }
  async getBranches(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    return this.get(`/manage/v1/orgchart?${queryString}`);
  }
  async createGroup(input: IGroupCreateInput) {
    const body = {
      ...input
    };
    const { data } = await this.post(`/manage/v1/group`, body);
    return data;
  }

  async getCertifications(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    const { data } = await this.get(`/learn/v1/certification?${queryString}`);
    return data;
  }

  async getCatalogues(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    //show_item_list: Get sub_items (course list)
    const { data } = await this.get(
      ` /learn/v1/catalog?show_item_list=1&${queryString}`
    );
    return data;
  }
  async getCategories(options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    return this.get(`/learn/v1/categories?${queryString}`);
  }

  //List of enrollments for current branch and children
  async getEnrollmentsReport(branchId: Number, options?: IPageQueryOptions) {
    const queryString = buildUrlQueryString(options);

    const { data } = await this.get(
      `/report/v1/branch_dashboard_enrollment/${branchId}?${queryString}`
    );
    return data;
  }

  async getReportDetail(reportId: Number, dateFrom?: String, count?: Number) {
    const mapQuery = [];
    //The start timestamp used to additionally filter report rows (in yyyy-MM-dd HH:mm:ss).
    if (dateFrom) mapQuery.push({ name: "dateFrom", value: dateFrom });
    //The number of records to return per each call
    if (count) mapQuery.push({ name: "count", value: count });

    const query = `${mapQuery.map((e) => `${e.name}=${e.value}`).join("&")}`;

    const { data: { rows = [] } = {} } = await this.get(
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
