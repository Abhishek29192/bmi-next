import type { Course } from "@bmi/gatsby-source-docebo";
import type { Data as BreadcrumbsData } from "../../components/Breadcrumbs";

export type TrainingDetailsCourseType = Pick<
  Course,
  | "code"
  | "id_course"
  | "slug_name"
  | "name"
  | "course_type"
  | "categoryName"
  | "sessions"
  | "description"
  | "img_url"
  | "price"
> & {
  breadcrumbs: BreadcrumbsData;
};
