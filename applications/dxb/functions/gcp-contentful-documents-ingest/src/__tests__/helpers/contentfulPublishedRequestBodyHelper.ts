import { createEntry, createSys } from "@bmi/contentful-types";
import { Entry } from "contentful";
import { ContentfulDocument } from "../../types";
import createContentfulDocument from "./contentfulDocumentHelper";

const createPublishedRequestBody = (
  contentfulRequestBody?: Partial<Entry<ContentfulDocument>>
): Entry<ContentfulDocument> => ({
  ...createEntry({
    sys: createSys({
      type: "Entry",
      contentType: {
        sys: {
          type: "Link",
          linkType: "ContentType",
          id: "document"
        }
      }
    }),
    fields: createContentfulDocument()
  }),
  ...contentfulRequestBody
});

export default createPublishedRequestBody;
