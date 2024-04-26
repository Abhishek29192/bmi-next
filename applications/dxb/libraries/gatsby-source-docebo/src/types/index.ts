import type {
  Catalogue,
  Category,
  CategoryType,
  Certification,
  Course as DoceboCourse,
  Session as DoceboSession
} from "@bmi/docebo-types";

export type Session = Omit<DoceboSession, "date_start" | "date_end"> & {
  date_start?: number;
  date_end?: number;
};

export type Course = Omit<DoceboCourse, "category"> & {
  categoryName: CategoryType;
  sessions: Session[];
  currency: string;
  currencySymbol: string;
};

export type NodeBuilderInput =
  | {
      type: typeof NODE_TYPES.Courses;
      data: Course;
    }
  | {
      type: typeof NODE_TYPES.Categories;
      data: Category;
    }
  | {
      type: typeof NODE_TYPES.Catalogues;
      data: Catalogue;
    }
  | {
      type: typeof NODE_TYPES.Certifications;
      data: Certification;
    };

export const NODE_TYPES = {
  Categories: "DoceboCategories",
  Courses: "DoceboCourses",
  Catalogues: "DoceboCatalogues",
  Certifications: "DoceboCertifications"
} as const;
