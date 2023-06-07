import createEntrySys from "./entrySysHelper";
import { createFullyPopulatedLink } from "./linkHelper";
import createRichText from "./richTextHelper";
import type { TypeForm } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedForm = (
  contentfulForm?: EntryPartial<TypeForm<undefined, "en-US">>
): TypeForm<undefined, "en-US"> => {
  const form = createForm(contentfulForm);
  return {
    ...form,
    fields: {
      showTitle: true,
      description: createRichText(),
      recipients: "test@test.com",
      inputs: {},
      submitText: "form submit text",
      successRedirect: createFullyPopulatedLink(),
      hubSpotFormGuid: "hubspot-form-guid",
      emailSubjectFormat: "form email subject format",
      ...form.fields
    }
  };
};

const createForm = (
  contentfulForm?: EntryPartial<TypeForm<undefined, "en-US">>
): TypeForm<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "form"
      }
    },
    ...contentfulForm?.sys
  },
  metadata: {
    tags: [],
    ...contentfulForm?.metadata
  },
  fields: {
    name: "form name",
    title: "form title",
    source: "Contentful",
    ...contentfulForm?.fields
  }
});

export default createForm;
