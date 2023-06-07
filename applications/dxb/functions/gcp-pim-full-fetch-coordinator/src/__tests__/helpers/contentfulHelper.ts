import type { EntryCollection, EntrySkeletonType } from "contentful";

export const createContentfulResponse = <T extends EntrySkeletonType>(
  contentfulResponse?: Partial<EntryCollection<T>>
): EntryCollection<T> => ({
  total: 1756,
  skip: 0,
  limit: 0,
  items: [],
  ...contentfulResponse
});
