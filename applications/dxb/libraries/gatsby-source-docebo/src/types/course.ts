export type BackgroundImage = {
  url: string;
  aspect_ratio: string;
};

export type Course = {
  id_course: number;
  name: string;
  uidCourse: string;
  description: string;
  date_last_updated: string;
  course_type: string;
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
  max_attempts: number;
  is_affiliate: boolean;
  partner_fileds: string;
  affiliate_price: string;
  partner_data: PartnerData;
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

export type CourseSessions = {
  id_session: number;
  attendance_type: CourseSessionAttendanceType;
  migrated_webinar_session_id: number;
  uid_session: string;
  name: string;
  slug_name: string;
  description: string;
  start_date: string;
  end_date: string;
  last_subscription_date: string;
  min_enroll: number;
  max_enroll: number;
  is_instructor: boolean;
  is_session_instructor: boolean;
  is_event_instructor: boolean;
  enrolled: Enrolled[];
  instructors: Instructors[];
  dates: CourseDates[];
  locations: Locations[];
  additional_fields: CourseAdditionalFields[];
};

export type CourseSessionAttendanceType =
  | "onsite"
  | "online"
  | "flexible"
  | "blended";

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

export type Learningplans = {
  id: number;
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

export type SelfUnenrollmentSettings = {
  self_unenrollment_settings: boolean;
  allow_self_unenrollment_from_session: boolean;
  allow_self_unenrollment_from_completed_course: boolean;
  allow_change_session: boolean;
};

export type PartnerData = {
  id: number;
  referral_id: string;
  name: string;
  description: string;
  logo: string;
  city: string;
  country: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  discount: string;
  affiliate_code: string;
  enable_affiliate: string;
  catalog_visible: string;
  course_visible: string;
  active: string;
  updated_at: string;
  updated_by: string;
  logo_full_path: string;
};
