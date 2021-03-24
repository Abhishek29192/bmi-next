import { gql } from "apollo-server";

export default gql`
  extend type Query {
    course(id: Int!): Course
    courses(options: PageQueryOptions): CoursesData
  }

  type CourseCategory {
    id: Int
    name: String
  }
  type Tree {
    id: String
    resource_id: String
    name: String
    id_scorm_item: String
    id_aicc_item: String
    slug_name: String
    description: String
    type: String
    thumbnail: String
    duration: Int
    status: String
    locked: String
    is_folder: Boolean
    short_description: String
    mobile_unsupported: Boolean
    params: String
    params_inherited: String
    is_end_object: Boolean
    tags: [String]
  }
  type Locations {
    id_location: Int
    name: String
    address: String
    id_country: Int
    name_country: String
    telephone: String
    email: String
    reaching_info: String
    accommodation: String
    iso_code_country: String
    id_zone: Int
    other_info: String
  }
  type CourseDates {
    date: String
    name: String
    description: String
    start_hour: String
    end_hour: String
    id_location: Int
    id_classroom: Int
    classroom_name: String
    webinar_tool: String
    timezone: String
    gmt: String
    duration: Int
    effective_duration: Int
    id_date: Int
    collaboration_tool: String
    is_instructor: Boolean
    instructors: [Instructors]
  }
  type Enrolled {
    is_enrolled: Boolean
    count_enrolled: Boolean
    count_instructor: Int
    count_instructor_waitlist: Int
    count_tutor: Int
    count_tutor_waitlist: Int
    count_learner: Int
    count_learner_waitlist: Int
    waiting_list: Boolean
    status: String
    evaluation_type: String
  }
  type CourseSessions {
    id_session: Int
    uid_session: String
    name: String
    slug_name: String
    description: String
    start_date: String
    end_date: String
    last_subscription_date: String
    min_enroll: Int
    max_enroll: Int
    is_instructor: Boolean
    additional_fields: [CourseAdditionalFields]
    locations: [Locations]
    dates: [CourseDates]
    instructors: [Instructors]
    enrolled: [Enrolled]
  }
  type Networks {
    type: String
    url: String
    description: String
  }
  type SocialSettings {
    networks: [Networks]
  }
  type AvailableSeats {
    allow_overbooking: Int
    level: Int
    can_enter: Boolean
    affiliate_price: String
    enrollment_policy: Int
    max_attempts: Int
    waiting_list: Int
    has_esignature_enabled: Boolean
    esignature_status: String
    esignature_title: String
    esignature_description: String
    min_session_to_pass: Int
    max_session_to_pass: Int
    has_session_completion_rule: Boolean
    ics_url: String
    category: [CourseCategory]
    tree: [Tree]
    sessions: [CourseSessions]
    social_settings: SocialSettings
  }
  type Params {
    width: Int
    height: Int
    filesize: Int
  }
  type CourseThumbnail {
    id: Int
    name: String
    url: String
    used_by: Int
    actions: [String]
    params: Params
  }

  type CourseAdditionalFields {
    id: Int
    title: String
    type: String
    visible_to_user: String
    settings: String
    value: String
  }
  type BackgroundImage {
    url: String
    aspect_ratio: String
  }
  type Instructors {
    username: String
    instructor_id: Int
    firstname: String
    lastname: String
    avatar_url: String
  }
  type Learningplans {
    id: Int
  }
  type SelfUnenrollmentSettings {
    self_unenrollment_settings: Boolean
    allow_self_unenrollment_from_session: Boolean
    allow_self_unenrollment_from_completed_course: Boolean
    allow_change_session: Boolean
  }
  type PartnerData {
    id: Int
    referral_id: String
    name: String
    description: String
    logo: String
    city: String
    country: String
    state: String
    address: String
    phone: String
    email: String
    website: String
    discount: String
    affiliate_code: String
    enable_affiliate: String
    catalog_visible: String
    course_visible: String
    active: String
    updated_at: String
    updated_by: String
    logo_full_path: String
  }
  type EnterStatus {
    status: String
    price: Int
    sessions: [CourseSessions]
  }
  type Course {
    id: Int
    name: String
    code: String
    uidCourse: String
    provider: Int
    slug_name: String
    description: String
    credits: Int
    lang_code: String
    type: String
    status: String
    is_published: Boolean
    can_self_unenroll: Boolean
    can_self_enroll: Boolean
    can_session_change: Boolean
    certificate_url: String
    has_overview: Boolean
    show_toc: Boolean
    show_lightbox_nav: Boolean
    level: String
    shopify_product_meaningful_id: String
    in_soft_deadline: Boolean
    demo_file_type: String
    can_manage_course: Boolean
    is_affiliate: Boolean
    partner_fileds: String
    max_attempts_reached: Boolean
    on_sale: Boolean
    rating_option: String
    can_rate: Boolean
    current_rating: Int
    has_autoplay: Boolean
    deadline: String
    completion_date: String
    last_played_object: Int
    last_completed_object: Int
    thumbnail: String
    demo_file: String
    deeplink: String
    final_score: Int
    available_seats: [AvailableSeats]
    chapter_sequence: [String]
    permissions: [String]
    course_thumbnail: CourseThumbnail
    additional_fields: [CourseAdditionalFields]
    background_image: BackgroundImage
    instructors: [Instructors]
    learningplans: [Learningplans]
    enrolled: Enrolled
    self_unenrollment_settings: SelfUnenrollmentSettings
    partner_data: PartnerData
    enter_status: EnterStatus
  }

  type Courses {
    id_course: Int
    name: String
    uidCourse: String
    description: String
    date_last_updated: String
    course_type: String
    selling: Boolean
    code: String
    slug_name: String
    image: String
    duration: Int
    language: String
    language_label: String
    price: String
    is_new: String
    is_opened: String
    rating_option: String
    current_rating: Int
    credits: Int
    img_url: String
    can_rate: Boolean
    can_self_unenroll: Boolean
    start_date: String
    end_date: String
    enrollment_policy: Int
    max_attempts: Int
    is_affiliate: Boolean
    partner_fileds: String
    affiliate_price: String
    partner_data: PartnerData
    available_seats: AvailableSeats
    category: CourseCategory
  }

  type CoursesData {
    count: Int
    has_more_data: Boolean
    current_page: Int
    current_page_size: Int
    total_page_count: Int
    total_count: Int
    sort: [Sort]
    items: [Courses]
  }
`;
