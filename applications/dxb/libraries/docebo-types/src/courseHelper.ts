import { Course, Session } from "./types";

export const createCourse = (course: Partial<Course> = {}): Course => ({
  id_course: 1,
  start_date: "1693586500594",
  end_date: "1768156200000",
  date_last_updated: "1693586500594",
  can_rate: false,
  can_self_unenroll: false,
  category: {
    id: 2,
    name: "Pitched"
  },
  code: "IT_TEST_01",
  course_type: "classroom",
  credits: 0,
  current_rating: 0,
  is_affiliate: false,
  is_new: "0",
  description: "<p>Test Course Description</p>",
  duration: 0,
  enrollment_policy: 2,
  image: "",
  img_url: "",
  is_opened: "1",
  language: "italian",
  language_label: "Italian",
  name: "Italian Test Course",
  price: "0",
  rating_option: "only_completed",
  selling: false,
  slug_name: "italian-test-course",
  uidCourse: "I-KVOYX1",
  available_seats: [],
  ...course
});

export const createSession = (session?: Partial<Session>): Session => ({
  code: "Test code",
  date_end: "2025-10-10 16:00:00",
  date_start: "2023-10-10 07:00:00",
  id: 1,
  name: "Test course session",
  hours: "8:45",
  events: "1",
  events_with_sync_failed: "0",
  instructors: "0",
  instructors_emails_number: 0,
  waiting: "0",
  enrolled: "2",
  max_enroll: "30",
  created_by: "13194",
  uid_session: "BJVR10V",
  externally_managed: false,
  additional_fields: [
    {
      id: "5",
      name: "Description for Certificate",
      value: "",
      mandatory: false,
      type: "textarea"
    }
  ],
  attendance_details: {
    onsite: 1,
    online: 0,
    flexible: 0
  },
  location: {
    id: 3,
    name: "BMI Academy DK",
    address: "BMI Academy Holger Danske Vej 23C 8960 Randers SØ",
    count: 1
  },
  attendance_type: "onsite",
  ...session
});
