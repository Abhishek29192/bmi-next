import type { ResourceLink } from "contentful";

const createResourceLink = (
  resourceLink?: Partial<ResourceLink>
): ResourceLink => ({
  type: "ResourceLink",
  linkType: "Contentful:Entry",
  urn: "resource-link-urn",
  ...resourceLink
});

export default createResourceLink;
