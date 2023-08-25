import { Link } from "contentful-management";

const createLink = <T extends string = "LinkType">(
  link?: Partial<Link<T>>
): Link<T> => ({
  sys: {
    type: "Link",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- Need to give it a value, but for type reasons, we need to allow for T
    linkType: "LinkType",
    id: "link-id"
  },
  ...link
});

export default createLink;
