import type { EntryCollection, EntrySkeletonType } from "contentful";

const createResponse = <T extends EntrySkeletonType>(
  contentfulResponse?: Partial<EntryCollection<T>>
): EntryCollection<T> => ({
  total: 1000,
  skip: 0,
  limit: 0,
  items: [],
  ...contentfulResponse
});

export default createResponse;
