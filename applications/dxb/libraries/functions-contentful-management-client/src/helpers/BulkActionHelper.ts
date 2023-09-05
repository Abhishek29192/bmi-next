import { jest } from "@jest/globals";
import { BulkAction } from "contentful-management";
import createBulkActionSysProps from "./BulkActionSysPropsHelper";

const createBulkAction = (bulkAction?: Partial<BulkAction>): BulkAction => ({
  sys: createBulkActionSysProps(),
  action: "publish",
  payload: {},
  get: jest.fn<BulkAction["get"]>(),
  waitProcessing: jest.fn<BulkAction["waitProcessing"]>(),
  toPlainObject: jest.fn<BulkAction["toPlainObject"]>(),
  ...bulkAction
});

export default createBulkAction;
