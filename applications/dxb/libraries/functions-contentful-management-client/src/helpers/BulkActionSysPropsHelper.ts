import createLink from "./LinkHelper";
import type {
  BulkActionStatus,
  BulkActionSysProps
} from "contentful-management/dist/typings/entities/bulk-action";

const createBulkActionSysProps = (
  bulkActionSysProps?: Partial<BulkActionSysProps>
): BulkActionSysProps => ({
  id: "bulk-action-sys-props-id",
  type: "BulkAction",
  status: "created" as BulkActionStatus, // Typings are broken in contentful-management
  space: createLink<"Space">(),
  environment: createLink<"Environment">(),
  createdBy: createLink<"User">(),
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(1).toISOString(),
  ...bulkActionSysProps
});

export default createBulkActionSysProps;
