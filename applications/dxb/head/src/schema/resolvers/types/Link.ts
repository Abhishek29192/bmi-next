import type { Data as LinkData } from "../../../components/link/types";
import type { ParentPage } from "./Common";
import type { ContentfulFormSection } from "./FormSection";

export type ContentfulLink = Omit<
  LinkData,
  "linkedPage" | "dialogContent" | "id"
> & {
  sys: {
    id: string;
  };
  linkedPage: {
    __typename: string;
    sys: {
      id: string;
    };
    title: string;
    slug: string;
    parentPage: ParentPage | null;
  } | null;
  dialogContent: ContentfulFormSection | null;
};
