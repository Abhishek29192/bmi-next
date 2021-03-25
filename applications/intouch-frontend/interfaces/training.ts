export type TrainingData = {
  training: TrainingInfo;
};
export type TrainingInfo = {
  name: string;
  url: string;
  user: TrainingUser;
};
export type TrainingUser = {
  id?: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  user_level?: string;
  enrollment?: Enrollment;
};
export type Enrollment = {
  count?: number;
  has_more_data?: Boolean;
  cursor?: string;
  current_page?: number;
  current_page_size?: number;
  total_page_count?: number;
  total_count?: number;

  items?: EnrollmentItems[];
};
export type EnrollmentItems = {
  id?: number;
  user_id?: number;

  username?: string;
  name?: string;
  description?: string;
  type?: string;
  status?: string;
  lang_code?: string;
  code?: string;
  image_url?: string;
  url?: string;
};
export type PageQueryOptions = {
  paginate?: PaginateOptions;
};
export type PaginateOptions = {
  page?: number;
  page_size?: number;
};
