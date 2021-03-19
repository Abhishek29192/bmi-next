import { gql } from "apollo-server";

export default gql`
  type Last {
    href: String
  }
  type First {
    href: String
  }
  type Goto {
    href: String
  }
  type Self {
    href: String
  }
  type Links {
    last: Last
    first: First
    goto: Goto
    self: Self
  }
  type Sort {
    sort_attr: String
    sort_dir: String
  }
  type Outdated {
    total_users: Int
    already_marked: Boolean
  }
  type Dates {
    date: String
    name: String
    time_begin: String
    time_end: String
    timezone: String
    id_location: Int
    id_classroom: Int
    attendance_status: String
  }
  type EnrolledSessions {
    id: Int
    name: String
    description: String
    other_info: String
    date_begin: String
    date_end: String
    min_enrollments: Int
    max_enrollments: Int
    score_base: Int
    tool: String
    status: String
    dates: [Dates]
  }
  type EnrollmentSubscription {
    subscribed: Boolean
    is_active: Boolean
  }
  type EnrollmentItems {
    id: Int
    user_id: Int
    subscribed_by: Int
    date_last_updated: String
    username: String
    name: String
    slug: String
    complete_percent: Int
    description: String
    type: String
    status: String
    location_name: String
    webinar_tool: String
    session_date_begin: String
    session_time_begin: String
    session_timezone: String
    lang_code: String
    code: String
    uidCourse: String
    course_begin_date: String
    enroll_begin_date: String
    enroll_date_of_enrollment: String
    enroll_end_date: String
    course_complete_date: String
    total_time: Int
    score: Int
    image_url: String
    url: String
    rating_option: String
    rating: Int
    is_new: Boolean
    can_enter: Boolean
    can_enter_reason: String
    duration: Int
    level: String
    courses_count: Int
    soft_deadline: Boolean
    course_end_date: String
    hidden: Boolean
    outdated: Outdated
    enrolled_sessions: [EnrolledSessions]
    subscription: [EnrollmentSubscription]
    course: Course
  }
  type Enrollment {
    count: Int
    has_more_data: Boolean
    cursor: String
    current_page: Int
    current_page_size: Int
    total_page_count: Int
    total_count: Int
    actions: [String]
    sort: [Sort]
    items: [EnrollmentItems]
  }
`;
