import { DoceboCourse } from "../../types/pim";

export const createCourse = (course?: Partial<DoceboCourse>): DoceboCourse => ({
  description: "<p>Test course description</p>",
  id_course: 1,
  img_url: "",
  slug_name: "test-course",
  name: "Test course",
  ...course
});

export default createCourse;
