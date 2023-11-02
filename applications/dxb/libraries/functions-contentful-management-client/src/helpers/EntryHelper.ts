import { jest } from "@jest/globals";
import createEntryMetaSysProps from "./EntryMetaSysPropsHelper";
import type { Entry } from "contentful-management";

const createEntry = (entry?: Partial<Entry>): Entry => ({
  sys: createEntryMetaSysProps(),
  fields: {},
  toPlainObject: jest.fn<Entry["toPlainObject"]>(),
  update: jest.fn<Entry["update"]>(),
  patch: jest.fn<Entry["patch"]>(),
  delete: jest.fn<Entry["delete"]>(),
  publish: jest.fn<Entry["publish"]>(),
  unpublish: jest.fn<Entry["unpublish"]>(),
  archive: jest.fn<Entry["archive"]>(),
  unarchive: jest.fn<Entry["unarchive"]>(),
  getSnapshots: jest.fn<Entry["getSnapshots"]>(),
  getSnapshot: jest.fn<Entry["getSnapshot"]>(),
  createComment: jest.fn<Entry["createComment"]>(),
  getComments: jest.fn<Entry["getComments"]>(),
  getComment: jest.fn<Entry["getComment"]>(),
  createTask: jest.fn<Entry["createTask"]>(),
  getTasks: jest.fn<Entry["getTasks"]>(),
  getTask: jest.fn<Entry["getTask"]>(),
  isPublished: jest.fn<Entry["isPublished"]>(),
  isUpdated: jest.fn<Entry["isUpdated"]>(),
  isDraft: jest.fn<Entry["isDraft"]>(),
  isArchived: jest.fn<Entry["isArchived"]>(),
  references: jest.fn<Entry["references"]>(),
  ...entry
});

export default createEntry;
