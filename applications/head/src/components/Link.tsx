import { graphql, Link } from "gatsby";
import { ClickableAction } from "@bmi/clickable";
import { IconName } from "./Icon";
import { Data as PageInfoData } from "./PageInfo";

export const getClickableActionFromUrl = (
  linkedPage: LinkData["linkedPage"],
  url: LinkData["url"],
  countryCode: string
): ClickableAction | undefined => {
  if (linkedPage && "slug" in linkedPage) {
    return {
      model: "routerLink",
      to: `/${countryCode}/${linkedPage.slug}`,
      linkComponent: Link
    };
  }

  if (url) {
    return {
      model: "htmlLink",
      href: url
    };
  }

  return undefined;
};

export const getCTA = (
  data:
    | {
        __typename: "ContentfulPromo";
        cta?: LinkData;
      }
    | Pick<PageInfoData, "__typename" | "slug">,
  countryCode: string,
  linkLabel?: string
) => {
  if (data.__typename === "ContentfulPromo") {
    if (!data.cta) {
      return null;
    }

    const { label, linkedPage, url } = data.cta;

    return {
      action: getClickableActionFromUrl(linkedPage, url, countryCode),
      label: label
    };
  }

  const { slug } = data;

  return {
    action: getClickableActionFromUrl({ slug: slug }, null, countryCode),
    // TODO: Use microcopy here
    label: linkLabel
  };
};

export type LinkData = {
  __typename: "ContentfulLink";
  id: string;
  label: string;
  icon: IconName | null;
  isLabelHidden: boolean | null;
  url: string | null;
  linkedPage: {
    // NOTE: null is for Homepage type
    slug: string | null;
  } | null;
};

export type NavigationItem = {
  __typename: "ContentfulNavigationItem";
  type: "Heading" | "Separator";
  value: string;
};

export type NavigationData = {
  __typename: "ContentfulNavigation";
  label: string | null;
  link: LinkData | null;
  links: (NavigationData | NavigationItem | LinkData)[];
};

export const query = graphql`
  fragment LinkFragment on ContentfulLink {
    __typename
    id
    label
    icon
    isLabelHidden
    url
    linkedPage {
      ... on ContentfulPage {
        slug
      }
    }
  }
`;
