import type { Entry } from "contentful-management";

const createEntry = (): Partial<Entry> => ({
  sys: {
    space: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: "123456"
      }
    },
    id: "qwerty",
    type: "Entry",
    createdAt: "2022-03-10T14:30:26.308Z",
    updatedAt: "2022-04-20T10:09:55.815Z",
    environment: {
      sys: {
        id: "master",
        type: "Link",
        linkType: "Environment"
      }
    },
    publishedVersion: 1,
    publishedAt: "2022-03-10T14:39:01.851Z",
    firstPublishedAt: "2022-03-10T14:39:01.851Z",
    createdBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "1234sdfg"
      }
    },
    updatedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "3355sdfhgh"
      }
    },
    publishedCounter: 1,
    version: 3,
    publishedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "234545645asdfgh"
      }
    },
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "page"
      }
    },
    automationTags: []
  }
});

export default createEntry;
