import type { Course } from "../../types";

export const createCourse = (courseData: Partial<Course> = {}): Course => ({
  id_course: 1,
  start_date: "1693586500594",
  end_date: "1768156200000",
  date_last_updated: "1693586500594",
  can_rate: false,
  can_self_unenroll: false,
  categoryName: "Pitched",
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
  sessions: [],
  ...courseData
});
