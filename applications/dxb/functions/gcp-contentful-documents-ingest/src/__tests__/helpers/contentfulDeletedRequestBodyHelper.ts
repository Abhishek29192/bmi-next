import { createEntrySys } from "@bmi/contentful-types";
import { DeletedEntry } from "../../types";

const createDeletedRequestBody = (
  contentfulDeletedEntry?: Partial<DeletedEntry>
): DeletedEntry => ({
  sys: {
    ...createEntrySys(),
    type: "DeletedEntry",
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "document"
      }
    },
    ...contentfulDeletedEntry?.sys
  },
  metadata: {
    tags: [],
    ...contentfulDeletedEntry?.metadata
  }
});

export default createDeletedRequestBody;
