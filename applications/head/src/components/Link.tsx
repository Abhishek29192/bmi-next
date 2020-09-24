import { graphql, Link } from "gatsby";
import { ClickableAction } from "@bmi/clickable";

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

export type LinkData = {
  __typename: "ContentfulLink";
  id: string;
  label: string;
  icon: string | null;
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
    id
    label
    icon
    isLabelHidden
    url
    linkedPage {
      ... on ContentfulSimplePage {
        slug
      }
      ... on ContentfulContactUsPage {
        slug
      }
    }
  }
`;
