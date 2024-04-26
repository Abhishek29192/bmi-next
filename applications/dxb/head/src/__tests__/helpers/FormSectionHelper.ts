import { Data } from "../../components/FormSection";
import { SourceType } from "../../components/types/FormSectionTypes";

const createFormSectionData = (formSectionData?: Partial<Data>): Data => ({
  __typename: "ContentfulFormSection",
  showTitle: null,
  recipients: "recipients@email.com",
  inputs: null,
  submitText: null,
  successRedirect: null,
  source: SourceType.Contentful,
  ...formSectionData
});

export default createFormSectionData;
