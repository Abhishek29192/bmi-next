import { jest } from "@jest/globals";
import type { Collection, CollectionProp } from "contentful-management";

const createCollection = <T, TProps = CollectionProp<T>>(
  collection?: Partial<Collection<T, TProps>>
): Collection<T, TProps> => ({
  sys: {
    type: "Array"
  },
  total: 0,
  skip: 0,
  limit: 100,
  items: [],
  toPlainObject: jest.fn<Collection<T, TProps>["toPlainObject"]>(),
  ...collection
});

export default createCollection;
