import { createEntry, createSys } from "@bmi/contentful-types";
import { Entry } from "contentful";
import { ContentfulDocument } from "../../types";

const createDeletedRequestBody = (
  contentfulRequestBody?: Partial<Entry<ContentfulDocument>>
): Entry<ContentfulDocument> => ({
  ...createEntry({
    sys: createSys({
      type: "DeletedEntry",
      contentType: {
        sys: {
          type: "Link",
          linkType: "ContentType",
          id: "document"
        }
      }
    })
  }),
  ...contentfulRequestBody
});

export default createDeletedRequestBody;
