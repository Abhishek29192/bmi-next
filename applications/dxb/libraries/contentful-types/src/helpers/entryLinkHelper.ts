import type { Link } from "contentful";

const createEntryLink = (
  entryLink?: Partial<Link<"Entry">>
): Link<"Entry"> => ({
  type: "Link",
  linkType: "Entry",
  id: "entry-link-id",
  ...entryLink
});

export default createEntryLink;
