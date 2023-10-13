import { ExtendedCourse } from "./types";

export const createExtendedCourse = (
  courseData: Partial<ExtendedCourse> = {}
): ExtendedCourse => ({
  id: 298,
  name: "Course name",
  code: "course-code",
  uidCourse: "E-D19XD0",
  provider: 0,
  slug_name: "test-course",
  description: "<p>Course description</p>",
  short_description: "",
  credits: "0.00",
  lang_code: "english",
  lang_label: "English",
  type: "elearning",
  is_published: true,
  status: "non_subscribed",
  status_identifier: null,
  certificate_url: "",
  instructors: [],
  rating_option: "only_completed",
  current_rating: 0,
  is_rated: false,
  ratings_count: 0,
  has_autoplay: false,
  course_date_start: null,
  course_date_end: "2023-09-13 23:59:59",
  enrollment_date_start: null,
  enrollment_date_end: null,
  last_completed_object: null,
  chapter_sequence: [],
  tree: [],
  duration: 0,
  price: 0,
  background_image: {
    url: null,
    aspect_ratio: "tile"
  },
  thumbnail: "https://fake-image.png",
  flat_los: [],
  additional_fields: [],
  enter_status: {
    status: "locked",
    price: ""
  },
  can_self_unenroll: false,
  can_self_enroll: true,
  can_session_change: false,
  can_session_self_unenroll: false,
  deeplink: false,
  demo_file_type: "",
  level: null,
  shopify_product_meaningful_id: null,
  learningplans: [],
  on_sale: false,
  has_overview: false,
  show_toc: true,
  show_lightbox_nav: false,
  social_settings: [],
  final_score: null,
  available_seats: null,
  allow_overbooking: "0",
  can_enter: true,
  can_rate: false,
  html_page_css: "",
  enrolled: {
    is_enrolled: false
  },
  can_manage_course: true,
  in_soft_deadline: false,
  waiting_list: 0,
  category: {
    id: 3,
    name: "Flat"
  },
  enrollment_policy: 2,
  max_attempts: null,
  skills: [],
  self_unenrollment_settings: {
    allow_self_unenrollment_from_course: false,
    allow_self_unenrollment_from_completed_course: true
  },
  is_self_enrollment_available: true,
  course_thumbnail: {
    id: 362,
    filename: "null-2021-07-27-11-14-06.jpeg",
    original_filename: "null-2021-07-27-11-14-06.jpeg",
    created_on: 1627384473,
    created_by: {
      id: 13970,
      firstname: "Kim",
      lastname: "Nobay",
      username: "kim@digital-detox.co.uk"
    },
    url: "https://fake-image.png",
    filesize: 393523,
    height: 400,
    width: 800,
    used_by_count: 3,
    actions: ["edit", "usage", "copy_to_multidomain", "download", "delete"],
    params: {
      width: 800,
      height: 400,
      filesize: 393523
    },
    name: "null-2021-07-27-11-14-06.jpeg"
  },
  is_affiliate: false,
  max_attempts_reached: false,
  ...courseData
});
