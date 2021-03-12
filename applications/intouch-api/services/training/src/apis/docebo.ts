import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

import {
  ITokenInfo,
  IUserCreateInput,
  IGroupCreateInput,
  ISession,
  ITrainingUser
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

  async getSSOUrl() {
    return `${this.baseURL}/learn/home;type=oauth2_response;reenter_cc=0;access_token=${this.context.token};expires_in=3600;token_type=Bearer`;
  }

  async getUser(id: Number) {
    const { data } = await this.get(`/manage/v1/user/${id}`);
    return data;
  }
  async getEnrollmentByUserId(userId: Number) {
    const { data } = await this.get(`/learn/v1/enrollments?id_user=${userId}`);
    return data;
  }
  async getCourse(id: Number) {
    const { data } = await this.get(`/learn/v1/courses/${id}`);
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
  async getBranches() {
    return this.get(`/manage/v1/orgchart?page_size=50`);
  }
  async createGroup(input: IGroupCreateInput) {
    const body = {
      ...input
    };
    const { data } = await this.post(`/manage/v1/group`, body);
    return data;
  }

  async getTraining() {
    return { name: "Docebo Training" };
  }
  async getTrainingUser(): Promise<ITrainingUser> {
    //TODO:Maybe We can cache session info.
    const { data } = await this.get<ISession>(`/manage/v1/user/session`);

    return {
      id: data.id,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      user_level: data.user_level
    };
  }
}
