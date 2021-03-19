import { ClickableAction } from "@bmi/clickable";
import { graphql, Link } from "gatsby";
import { pushToDataLayer } from "../utils/google-tag-manager";
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
  assetUrl?: string,
  label?: string
): ClickableAction | undefined => {
  if (assetUrl) {
    const dataGtm = { id: "cta-click1", action: assetUrl, label };

    return {
      model: "download",
      href: assetUrl,
      // @ts-ignore data-gtm is not defined but a general html attribute
      "data-gtm": JSON.stringify(dataGtm),
      onClick: () => pushToDataLayer(dataGtm)
    };
  }

  if (!countryCode) {
    return;
  }

  if (linkedPage && "path" in linkedPage) {
    const to = `/${countryCode}/${linkedPage.path}`.replace(/\/+/gi, "/");
    const dataGtm = { id: "cta-click1", action: to, label };

    return {
      model: "routerLink",
      to,
      linkComponent: Link,
      // @ts-ignore data-gtm is not defined but a general html attribute
      "data-gtm": JSON.stringify(dataGtm),
      onClick: () => pushToDataLayer(dataGtm)
    };
  }

  if (url) {
    const externalUrl = {
      // NOTE: External links should always open in a new tab.
      target: "_blank",
      rel: "noopener noreferrer"
    };
    const dataGtm = { id: "cta-click1", action: url, label };

    return {
      model: "htmlLink",
      href: url,
      ...(checkUrlAction(url) ? {} : externalUrl),
      // @ts-ignore data-gtm is not defined but a general html attribute
      "data-gtm": JSON.stringify(dataGtm),
      onClick: () => pushToDataLayer(dataGtm)
    };
  }
};

export const getCTA = (
  data:
    | Pick<PromoData, "__typename" | "cta">
    | Pick<PageInfoData, "__typename" | "path">,
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
        asset?.file?.url,
        label
      ),
      label: label
    };
  }

  const { path } = data;

  return {
    action: getClickableActionFromUrl(
      { path },
      null,
      countryCode,
      null,
      linkLabel
    ),
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
    path: string | null;
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
  promos?: PromoData[] | null;
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
        path
      }
      ... on ContentfulPage {
        path
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
