import type { ContentfulRichText } from "./RichText";
import type { ContentfulLink } from "./Link";
import type { Data as FormSectionData } from "../../../components/FormSection";

export type ContentfulFormSection = Omit<
  FormSectionData,
  "description" | "successRedirect"
> & {
  description: ContentfulRichText | null;
  successRedirect: ContentfulLink | null;
};
