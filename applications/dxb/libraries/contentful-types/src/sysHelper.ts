import { Sys } from "contentful";

const createSys = (sys?: Partial<Sys>): Sys =>
  ({
    type: "Entry",
    id: "entry-id",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(1).toISOString(),
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
    ...sys
  } as Sys); // Have to force it as the typing is wrong. This should be removed after we upgrade to v10 of the Contentful client when it is released.

export default createSys;
