import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import { Docebo } from "./apis";

export type ITokenInfo = {
  token: String;
};

export interface IDataSources extends DataSources<ITokenInfo> {
  doceboApi: Docebo;
}

export interface IContext {
  token: String;
  dataSources?: IDataSources;
}

export interface ISelectOrgchart {
  [branchId: string]: String;
}
export interface ISelectManager {
  [managerId: string]: String;
}
export interface IUserCreateInput {
  userid: string;
  email: string;
  password: string;
  privacy?: string;
  firstname: string;
  lastname: string;
  force_change?: Number;
  level?: Number;
  language?: string;
  expiration?: string;
  email_validation_status?: Number;
  valid?: Number;
  date_format?: string;
  timezone?: string;
  role?: Number;
  send_notification_email?: Boolean;
  can_manage_subordinates?: Boolean;
  select_orgchart: ISelectOrgchart;
}
export interface IUserUpdateInput {
  userid: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  force_change?: Number;
  level?: Number;
  language?: string;
  expiration?: string;
  email_validation_status?: Number;
  date_format?: string;
  timezone?: string;
  role?: Number;
  manager?: ISelectManager;
  can_manage_subordinates?: Boolean;
  select_orgchart: ISelectOrgchart;
  country?: Number;
}
export interface IMessage {
  id: String;
  message: String;
}

export interface IUserCreateResponse {
  success: Boolean;
  user_id: Number;
  message: [IMessage];
}

export interface IUserUpdateResponse {
  success: Boolean;
  updated_id: Number;
  message: [IMessage];
}

export interface IRulesList {
  condition_value: String;
  condition_type: String;
  id_field_common: Number;
}

export interface IGroupCreateInput {
  name: String;
  description: String;
  assign_rules?: Number;
  rules_logic?: String;
  assign_existing_users?: Boolean;
  rules_list?: [IRulesList];
  id_users?: [Number];
}

export interface ITrainingUser {
  id: Number;
  username: String;
  firstname: String;
  lastname: String;
  email: String;
  user_level: String;
  userInfo?: any;
  enrollment?: any;
}
export interface ISession {
  data: ITrainingUser;
}
export interface IPageQueryOptions {
  paginate?: IPaginateOptions;
}

export interface IPaginateOptions {
  page?: number;
  page_size?: number;
}
export interface SortOptions {
  field?: string;
  order?: SortOrderEnum;
}

export enum SortOrderEnum {
  Asc = "ASC",
  Desc = "DESC"
}
export type QueryStringParams = {
  [param: string]: string;
};
