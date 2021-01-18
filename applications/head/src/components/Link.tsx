import { graphql, Link } from "gatsby";
import { ClickableAction } from "@bmi/clickable";
import { IconName } from "./Icon";
import { Data as PageInfoData } from "./PageInfo";
import { Data as PromoData } from "./Promo";

const checkUrlAction = (url: string): boolean => {
  const actionUrls = ["mailto:", "tel:", "callto:"];

  return actionUrls.some((actionUrl) => url.startsWith(actionUrl));
};

export const getClickableActionFromUrl = (
  linkedPage?: LinkData["linkedPage"],
  url?: LinkData["url"],
  countryCode?: string,
  assetUrl?: string
): ClickableAction | undefined => {
  if (!countryCode && !assetUrl) {
    return;
  }

  if (linkedPage && "slug" in linkedPage) {
    return {
      model: "routerLink",
      to: `/${countryCode}/${linkedPage.slug}`.replace(/\/+/gi, "/"),
      linkComponent: Link
    };
  }

  if (url) {
    const externalUrl = {
      // NOTE: External links should always open in a new tab.
      target: "_blank",
      rel: "noopener noreferrer"
    };

    return {
      model: "htmlLink",
      href: url,
      ...(checkUrlAction(url) ? {} : externalUrl)
    };
  }

  if (assetUrl) {
    return {
      model: "download",
      href: assetUrl
    };
  }
};

export const getCTA = (
  data:
    | Pick<PromoData, "__typename" | "cta">
    | Pick<PageInfoData, "__typename" | "slug">,
  countryCode: string,
  linkLabel?: string
) => {
  if (data.__typename === "ContentfulPromo") {
    if (!data.cta) {
      return null;
    }

    const { label, linkedPage, url, asset } = data.cta;

    return {
      action: getClickableActionFromUrl(
        linkedPage,
        url,
        countryCode,
        asset?.file?.url
      ),
      label: label
    };
  }

  const { slug } = data;

  return {
    action: getClickableActionFromUrl({ slug }, null, countryCode),
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
  type?: "External" | "Internal" | "Asset";
  linkedPage: {
    // NOTE: null is for Homepage type
    slug: string | null;
  } | null;
  asset?: {
    file: {
      url: string | null;
    };
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
    type
    linkedPage {
      ... on ContentfulHomePage {
        slug
      }
      ... on ContentfulPage {
        slug
      }
    }
    asset {
      ... on ContentfulAsset {
        file {
          ... on ContentfulAssetFile {
            url
          }
        }
      }
    }
  }
`;
