import createBreadcrumbItem from "./BreadcrumbItemHelper";
import type {
  TrainingDetailsCourseType as Course,
  Session
} from "../../templates/trainingDetailsPage/types";

export const createTraining = (trainingData: Partial<Course> = {}): Course => ({
  id_course: 1,
  name: "Test course",
  categoryName: "Pitched",
  code: "IT_TEST_01",
  course_type: "classroom",
  description: "<p>Test Course Description</p>",
  img_url: "https://fake-image.jpg",
  price: "0",
  slug_name: "italian-test-course",
  sessions: [],
  currencySymbol: "€",
  breadcrumbs: [createBreadcrumbItem()],
  ...trainingData
});

export const createSession = (session: Partial<Session> = {}): Session => ({
  id: 1,
  code: "code",
  name: "Test course session",
  date_start: 1709132786572,
  date_end: 1709132786572,
  ...session
});
