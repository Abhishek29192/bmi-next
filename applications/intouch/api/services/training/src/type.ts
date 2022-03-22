import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import { Docebo } from "./apis";

export type ITokenInfo = {
  token: string;
};

export interface IDataSources extends DataSources<ITokenInfo> {
  doceboApi: Docebo;
}

export interface IContext {
  token: string;
  dataSources?: IDataSources;
}

export interface ISelectOrgchart {
  [branchId: string]: string;
}
export interface ISelectManager {
  [managerId: string]: string;
}
export interface IUserCreateInput {
  userid: string;
  email: string;
  password: string;
  privacy?: string;
  firstname: string;
  lastname: string;
  force_change?: number;
  level?: number;
  language?: string;
  expiration?: string;
  email_validation_status?: number;
  valid?: number;
  date_format?: string;
  timezone?: string;
  role?: number;
  send_notification_email?: boolean;
  can_manage_subordinates?: boolean;
  select_orgchart: ISelectOrgchart;
}
export interface IUserUpdateInput {
  userid: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  force_change?: number;
  level?: number;
  language?: string;
  expiration?: string;
  email_validation_status?: number;
  date_format?: string;
  timezone?: string;
  role?: number;
  manager?: ISelectManager;
  can_manage_subordinates?: boolean;
  select_orgchart: ISelectOrgchart;
  country?: number;
}
export interface IMessage {
  id: string;
  message: string;
}

export interface IUserCreateResponse {
  success: boolean;
  user_id: number;
  message: [IMessage];
}

export interface IUserUpdateResponse {
  success: boolean;
  updated_id: number;
  message: [IMessage];
}

export interface IRulesList {
  condition_value: string;
  condition_type: string;
  id_field_common: number;
}

export interface IGroupCreateInput {
  name: string;
  description: string;
  assign_rules?: number;
  rules_logic?: string;
  assign_existing_users?: boolean;
  rules_list?: [IRulesList];
  id_users?: [number];
}

export interface ITrainingUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  user_level: string;
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
