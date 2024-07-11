import resolveLink from "./ContentfulLink";
import resolveRichText from "./ContentfulRichText";
import type { Data as FormSectionData } from "../../components/FormSection";
import type { ContentfulFormSection } from "./types/FormSection";

const resolveFormSection = async ({
  description,
  successRedirect,
  ...rest
}: ContentfulFormSection): Promise<FormSectionData> => ({
  ...rest,
  successRedirect: successRedirect ? await resolveLink(successRedirect) : null,
  description: description ? await resolveRichText(description) : null
});

export default resolveFormSection;
