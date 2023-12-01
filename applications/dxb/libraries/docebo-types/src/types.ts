export type Catalogue = {
  catalogue_id: number;
  catalogue_name: string;
  catalogue_description: string;
  catalogue_code: string;
  catalogue_sort_attr: string;
  catalogue_sort_dir: string;
  number_items: number;
  items_count: string;
  sub_items: CatalogueSubItem[];
};

export type CatalogueSubItem = {
  item_id: string;
  item_type: string;
  item_code: string;
  item_name: string;
  item_slug: string;
  item_description: string;
  item_category: string;
  item_language: string;
  item_language_label: string;
  item_thumbnail: string;
  item_price: string;
  item_rating_option: string;
  item_rating: number;
  is_new: boolean;
  item_visibility: string;
  item_policy: string;
  item_can_enroll: string;
  is_opened: string;
  access_status: number;
  price_status: number;
  affiliate_price: string;
  is_affiliate: boolean;
  course_type: string;
  duration: string;
  is_user_enrolled: string;
  is_user_subscribed: number;
  item_language_code: string;
  waiting: boolean;
};

export type Category = {
  id: number;
  code: string;
  title: string;
  title_parent: string;
  has_child: boolean;
  lev: number;
  iLeft: number;
  iRight: number;
  icon: string;
};

export type Certification = {
  id_cert: number;
  title: string;
  description: string;
  duration: string;
  allow_same_item: "0" | "1";
  duration_unit: string;
  code: string;
};

export type CourseType = "classroom" | "elearning" | "webinar";

export interface SessionAdditionalField {
  id: string;
  name: string;
  value: string;
  mandatory: boolean;
  type: string;
}

export interface Session {
  id: number;
  code: string;
  name: string;
  date_start: string;
  date_end: string;
  hours: string;
  events: string;
  events_with_sync_failed: string;
  instructors: string;
  instructors_emails_number: number;
  waiting: string;
  enrolled: string;
  max_enroll: string;
  created_by: string;
  uid_session: string;
  externally_managed: boolean;
  additional_fields: Array<SessionAdditionalField>;
  attendance_details: {
    onsite: number;
    online: number;
    flexible: number;
  };
  location: {
    id: number;
    name: string;
    address: string;
    count: number;
  };
  attendance_type: string;
}

export interface SessionsData {
  data: {
    items: Session[];
    count: number;
    has_more_data: boolean;
    current_page: number;
    current_page_size: number;
    total_page_count: number;
    total_count: number;
  };
  name?: string;
  version?: string;
}

export type Course = {
  id_course: number;
  name: string;
  uidCourse: string;
  description: string;
  date_last_updated: string;
  course_type: CourseType;
  selling: boolean;
  code: string;
  slug_name: string;
  image: string;
  duration: number;
  language: string;
  language_label: string;
  price: string;
  is_new: string;
  is_opened: string;
  rating_option: string;
  current_rating: number;
  credits: number;
  img_url: string;
  can_rate: boolean;
  can_self_unenroll: boolean;
  start_date: string;
  end_date: string;
  enrollment_policy: number;
  is_affiliate: boolean;
  available_seats: { [seatId: string]: number | null }[];
  category: CourseCategory;
};

export type Enrolled = {
  is_enrolled: boolean;
  count_enrolled: boolean;
  count_instructor: number;
  count_instructor_waitlist: number;
  count_tutor: number;
  count_tutor_waitlist: number;
  count_learner: number;
  count_learner_waitlist: number;
  waiting_list: boolean;
  status: string;
  evaluation_type: string;
};

export type CourseAdditionalFields = {
  id: number;
  title: string;
  type: string;
  visible_to_user: string;
  settings: string;
  value: string;
};

export type CourseCategory = {
  id: number;
  name: string;
};

export type CourseDates = {
  date: string;
  name: string;
  description: string;
  start_hour: string;
  end_hour: string;
  id_location: number;
  id_classroom: number;
  classroom_name: string;
  webinar_tool: string;
  timezone: string;
  gmt: string;
  duration: number;
  effective_duration: number;
  id_date: number;
  collaboration_tool: string;
  is_instructor: boolean;
  instructors: Instructors[];
};

export type Instructors = {
  username: string;
  instructor_id: number;
  firstname: string;
  lastname: string;
  avatar_url: string;
};

export type Locations = {
  id_location: number;
  name: string;
  address: string;
  id_country: number;
  name_country: string;
  telephone: string;
  email: string;
  reaching_info: string;
  accommodation: string;
  iso_code_country: string;
  id_zone: number;
  other_info: string;
};

export type Sort = {
  sort_attr: string;
  sort_dir: string;
};

export type CourseAdditionalField = {
  id: string;
  title: string;
  type: string;
  visible_to_user: "0" | "1";
  settings: string;
  mandatory: boolean;
  value: string | null;
};

export type CourseNetwork = { type: string; url: string; description: string };

export type CourseTree = {
  id: string;
  resource_id: string;
  name: string;
  id_scorm_item: string;
  id_aicc_item: string;
  slug_name: string;
  description: string;
  type: string;
  thumbnail: string;
  duration: number;
  status: string;
  locked: string;
  is_folder: boolean;
  short_description: string;
  children: any[];
  mobile_unsupported: boolean;
  tags: string[];
  params: string;
  params_inherited: string;
  is_end_object: boolean;
};

export type FlatLos = {
  id: string;
  title: string;
  lev: string;
  iLeft: string;
  iRight: string;
  items: {
    id: string;
    title: string;
    description: string;
    type: string;
  }[];
  items_count: number;
};

export type ExtendedCourse = {
  id: number;
  name: string;
  code: string;
  uidCourse: string;
  provider: number;
  slug_name: string;
  description: string;
  short_description: string;
  credits: string;
  lang_code: string;
  lang_label: string;
  type: CourseType;
  is_published: boolean;
  status: string;
  status_identifier: string | null;
  certificate_url: string;
  instructors: Instructors[];
  rating_option: string;
  current_rating: number;
  is_rated: boolean;
  ratings_count: number;
  has_autoplay: boolean;
  course_date_start: string | null;
  course_date_end: string | null;
  enrollment_date_start: string | null;
  enrollment_date_end: string | null;
  last_completed_object: string | null;
  chapter_sequence: string[];
  tree: CourseTree[];
  duration: number;
  price: number;
  background_image: {
    url: string | null;
    aspect_ratio: string;
  };
  thumbnail: string;
  flat_los: FlatLos[];
  additional_fields: CourseAdditionalField[];
  enter_status: {
    status: string;
    price: string;
  };
  can_self_unenroll: boolean;
  can_self_enroll: boolean;
  can_session_change: boolean;
  can_session_self_unenroll: boolean;
  deeplink: boolean;
  demo_file_type: string;
  level: number | null;
  shopify_product_meaningful_id: string | null;
  learningplans: { id: number }[];
  on_sale: boolean;
  has_overview: boolean;
  show_toc: boolean;
  show_lightbox_nav: boolean;
  social_settings: { networks: CourseNetwork[] }[];
  html_page_css: string;
  final_score: number | null;
  available_seats: number[] | null;
  allow_overbooking: "0" | "1";
  can_enter: boolean;
  can_rate: boolean;
  enrolled: {
    is_enrolled: boolean;
  };
  can_manage_course: boolean;
  in_soft_deadline: boolean;
  waiting_list: number;
  category: CourseCategory;
  enrollment_policy: number;
  max_attempts: null;
  skills: { title: string }[];
  self_unenrollment_settings: {
    allow_self_unenrollment_from_course: boolean;
    allow_self_unenrollment_from_completed_course: boolean;
  };
  is_self_enrollment_available: boolean;
  course_thumbnail: {
    id: number;
    filename: string;
    original_filename: string;
    created_on: number;
    created_by: {
      id: number;
      firstname: string;
      lastname: string;
      username: string;
    };
    url: string;
    filesize: number;
    height: number;
    width: number;
    used_by_count: number;
    actions: string[];
    params: {
      width: number;
      height: number;
      filesize: number;
    };
    name: string;
  };
  is_affiliate: boolean;
  max_attempts_reached: boolean;
};
