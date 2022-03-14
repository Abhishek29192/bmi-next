import createEntrySys from "./entrySysHelper";
import createForm, { createFullyPopulatedForm } from "./formHelper";
import type { TypeSignupBlock } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedSignupBlock = (
  contentfulSignupBlock?: EntryPartial<TypeSignupBlock<undefined, "en-US">>
): TypeSignupBlock<undefined, "en-US"> => {
  const signupBlock = createSignupBlock(contentfulSignupBlock);
  return {
    ...signupBlock,
    fields: {
      ...signupBlock.fields,
      title: "signup block title",
      description: "signup block description",
      signupDialogContent: createFullyPopulatedForm(),
      ...contentfulSignupBlock?.fields
    }
  };
};

const createSignupBlock = (
  contentfulSignupBlock?: EntryPartial<TypeSignupBlock<undefined, "en-US">>
): TypeSignupBlock<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "signupBlock"
      }
    },
    ...contentfulSignupBlock?.sys
  },
  metadata: {
    tags: [],
    ...contentfulSignupBlock?.metadata
  },
  fields: {
    signupLabel: "signup block label",
    signupDialogContent: createForm(),
    ...contentfulSignupBlock?.fields
  }
});

export default createSignupBlock;
