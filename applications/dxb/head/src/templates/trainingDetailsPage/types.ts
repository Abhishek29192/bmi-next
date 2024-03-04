import type { Course } from "@bmi/gatsby-source-docebo";
import type { Data as BreadcrumbsData } from "../../components/Breadcrumbs";

export type Session = {
  id: number;
  code: string | null;
  name: string;
  date_start: number;
  date_end: number;
};

export type TrainingDetailsCourseType = Pick<
  Course,
  | "code"
  | "id_course"
  | "slug_name"
  | "name"
  | "course_type"
  | "categoryName"
  | "description"
  | "img_url"
  | "price"
  | "currencySymbol"
> & {
  breadcrumbs: BreadcrumbsData;
  sessions: Session[];
};
