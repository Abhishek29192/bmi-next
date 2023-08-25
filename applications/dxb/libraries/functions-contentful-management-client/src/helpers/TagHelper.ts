import { jest } from "@jest/globals";
import createTagSysProps from "./TagSysPropsHelper";
import type { Tag } from "contentful-management";

const createTag = (tag?: Partial<Tag>): Tag => ({
  sys: createTagSysProps(),
  name: "tag name",
  update: jest.fn<Tag["update"]>(),
  delete: jest.fn<Tag["delete"]>(),
  toPlainObject: jest.fn<Tag["toPlainObject"]>(),
  ...tag
});

export default createTag;
