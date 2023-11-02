import { EntityMetaSysProps } from "contentful-management/dist/typings/common-types";
import createMetaLinkProps from "./MetaLinkPropsHelper";

const createEntityMetaSysProps = (
  entityMetaSysProps?: Partial<EntityMetaSysProps>
): EntityMetaSysProps => ({
  type: "Entity",
  space: { sys: createMetaLinkProps({ linkType: "Space" }) },
  contentType: { sys: createMetaLinkProps({ linkType: "ContentType" }) },
  environment: { sys: createMetaLinkProps({ linkType: "Environment" }) },
  id: "entity-meta-sys-id",
  version: 1,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(1).toISOString(),
  ...entityMetaSysProps
});

export default createEntityMetaSysProps;
