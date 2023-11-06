import type { MetaLinkProps } from "contentful-management";

const createMetaLinkProps = (
  metaLinkProps?: Partial<MetaLinkProps>
): MetaLinkProps => ({
  type: "Link",
  linkType: "Entity",
  id: "sys-link-id",
  ...metaLinkProps
});

export default createMetaLinkProps;
