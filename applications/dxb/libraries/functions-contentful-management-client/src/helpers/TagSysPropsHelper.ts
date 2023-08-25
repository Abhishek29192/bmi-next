import createMetaLinkProps from "./MetaLinkPropsHelper";
import type { TagSysProps } from "contentful-management/dist/typings/entities/tag";

const createTagSysProps = (entrySys?: Partial<TagSysProps>): TagSysProps => ({
  type: "Tag",
  visibility: "public",
  space: { sys: createMetaLinkProps({ linkType: "Space" }) },
  environment: { sys: createMetaLinkProps({ linkType: "Environment" }) },
  id: "tag-sys-id",
  version: 1,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(1).toISOString(),
  ...entrySys
});

export default createTagSysProps;
