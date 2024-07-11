import { SourceType } from "../../../../components/types/FormSectionTypes";
import createContentfulRichText from "./ContentfulRichText";
import { createContentfulNonRecursiveLink } from "./ContentfulLinkHelper";
import type { ContentfulFormSection } from "../FormSection";

const createContentfulFormSectionData = (
  contentfulFormSectionData?: Partial<ContentfulFormSection>
): ContentfulFormSection => ({
  __typename: "Form",
  showTitle: true,
  recipients: "recipients@email.com",
  inputs: [
    {
      name: "first-name",
      type: "text",
      label: "First name",
      width: "half",
      required: true
    },
    {
      name: "second-names",
      type: "text",
      label: "Second name",
      width: "half",
      required: true
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      width: "half",
      required: true
    }
  ],
  submitText: "Submit text",
  successRedirect: createContentfulNonRecursiveLink(),
  description: createContentfulRichText(),
  source: SourceType.Contentful,
  ...contentfulFormSectionData
});

export default createContentfulFormSectionData;
