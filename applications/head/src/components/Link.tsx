import { graphql, Link } from "gatsby";
import { ClickableAction } from "@bmi/clickable";

export const getClickableActionFromUrl = (
  linkedPage: LinkData["linkedPage"],
  url: LinkData["url"],
  countryCode: string
): ClickableAction | undefined => {
  if (linkedPage && linkedPage.slug) {
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

export type NavigationData = {
  label?: string;
  links: (NavigationData | LinkData)[];
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
