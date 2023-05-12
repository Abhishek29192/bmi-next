import createContentfulDate from "./contentfulDateHelper";
import type { EntrySys } from "contentful";

const createEntrySys = (entrySys?: Partial<EntrySys>): EntrySys => ({
  type: "Entry",
  id: "entry-id",
  createdAt: createContentfulDate(0),
  updatedAt: createContentfulDate(1),
  locale: "en-US",
  revision: 0,
  space: {
    sys: { type: "Link", linkType: "Space", id: "space-id" }
  },
  environment: {
    sys: { type: "Link", linkType: "Environment", id: "master" }
  },
  contentType: {
    sys: { type: "Link", linkType: "ContentType", id: "content-type-id" }
  },
  ...entrySys
});

export default createEntrySys;
