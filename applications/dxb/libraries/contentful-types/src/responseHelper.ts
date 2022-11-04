import { EntryCollection } from "contentful";

const createResponse = <T>(
  contentfulResponse?: Partial<EntryCollection<T>>
): EntryCollection<T> => ({
  total: 1000,
  skip: 0,
  limit: 0,
  items: [],
  stringifySafe: function () {
    return JSON.stringify(this);
  },
  toPlainObject: function () {
    const { stringifySafe, toPlainObject, ...plainObject } = this;
    return plainObject;
  },
  ...contentfulResponse
});

export default createResponse;
