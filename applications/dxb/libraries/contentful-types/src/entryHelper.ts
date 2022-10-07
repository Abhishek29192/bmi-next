import { Entry } from "contentful";
import createSys from "./sysHelper";

export const createFullyPopulatedEntry = <T>(
  entry?: Partial<Entry<T>>
): Entry<T> => ({
  sys: createSys(),
  fields: {} as T,
  metadata: { tags: [] },
  toPlainObject: function () {
    const { toPlainObject, update, ...plainObject } = this;
    return plainObject;
  },
  update: async function () {
    return this;
  },
  ...entry
});

const createEntry = <T>(entry?: Partial<Entry<T>>): Entry<T> => ({
  sys: createSys(),
  fields: {} as T,
  metadata: { tags: [] },
  toPlainObject: function () {
    const { toPlainObject, update, ...plainObject } = this;
    return plainObject;
  },
  update: async function () {
    return this;
  },
  ...entry
});

export default createEntry;
