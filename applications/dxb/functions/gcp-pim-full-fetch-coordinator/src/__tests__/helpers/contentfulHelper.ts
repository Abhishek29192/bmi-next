import { EntryCollection } from "contentful";

export const createContentfulResponse = <T>(
  contentfulResponse?: Partial<EntryCollection<T>>
): EntryCollection<T> => ({
  total: 1756,
  skip: 0,
  limit: 0,
  items: [],
  stringifySafe: jest.fn(),
  toPlainObject: jest.fn(),
  ...contentfulResponse
});
