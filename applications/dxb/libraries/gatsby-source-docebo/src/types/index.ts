import type {
  Catalogue,
  Category,
  Certification,
  Course as DoceboCourse,
  Session
} from "@bmi/docebo-types";

export type Course = Omit<DoceboCourse, "category"> & {
  categoryName: string;
  sessions: Session[];
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
