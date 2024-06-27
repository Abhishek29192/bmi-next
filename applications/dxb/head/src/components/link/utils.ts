import { Link as GatsbyLink } from "gatsby";
import { getPathWithCountryCode } from "../../utils/path";
import { DataTypeEnum } from "./types";
import type { Data } from "./types";
import type { AnchorLinkActionProps } from "@bmi-digital/components/anchor-link";
import type { ButtonActionProps } from "@bmi-digital/components/button";
import type { Data as PageInfoData } from "../PageInfo";
import type { Data as PromoData } from "../Promo";

export const getCTA = (
  data: Pick<PromoData, "cta"> | Pick<PageInfoData, "path">,
  countryCode: string,
  linkLabel?: string
): AnchorLinkActionProps | null => {
  if ("cta" in data) {
    if (!data.cta) {
      return null;
    }

    return toAnchorLinkActionProps(data.cta, countryCode);
  }

  const { path } = data;
  if (!path) {
    return null;
  }

  const to = getPathWithCountryCode(countryCode, path).replace(/\/+/gi, "/");
  return {
    to: to,
    component: GatsbyLink,
    gtm: { id: "cta-click1", action: to, label: linkLabel }
  };
};

const internalHosts = process.env.GATSBY_INTERNAL_HOSTS?.split(",") || [
  "www.bmigroup.com"
];

export const isExternalUrl = (url: string): boolean => {
  try {
    const linkUrl = new URL(url);
    return !internalHosts.includes(linkUrl.host);
  } catch (e) {
    return false;
  }
};

const checkUrlAction = (url: string): boolean => {
  const actionUrls = ["mailto:", "tel:", "callto:"];
  return actionUrls.some((actionUrl) => url.startsWith(actionUrl));
};
export const toAnchorLinkActionProps = (
  link: Data,
  countryCode?: string
): AnchorLinkActionProps => {
  if (link.asset?.file?.url) {
    return {
      href: link.asset.file.url,
      download: true,
      external: true,
      gtm: {
        id: "cta-click1",
        action: link.asset.file.url,
        label: link.label
      }
    };
  }

  if (link.linkedPage?.path) {
    const to = getPathWithCountryCode(
      countryCode,
      link.linkedPage.path
    ).replace(/\/+/gi, "/");
    return {
      component: GatsbyLink,
      to,
      gtm: { id: "cta-click1", action: to, label: link.label }
    };
  }

  // TODO: DXB-7055 link.url _should_ be populated, but as any link can be used, it may not be
  return {
    href: link.url ?? undefined,
    external:
      (!!link.url && !checkUrlAction(link.url) && isExternalUrl(link.url)) ||
      undefined,
    gtm: { id: "cta-click1", action: link.url ?? undefined, label: link.label }
  };
};

export const toButtonActionProps = (
  link: Data,
  countryCode?: string,
  onClick?: ButtonActionProps["onClick"]
): ButtonActionProps => {
  if (link.type === DataTypeEnum.Visualiser) {
    return {
      onClick,
      gtm: {
        id: "cta-visualiser1",
        action: "visualiser",
        label: link.label
      }
    };
  }

  if (link.type === DataTypeEnum.Calculator) {
    return {
      onClick,
      gtm: {
        id: "cta-calculator1",
        action: "calculator",
        label: link.label
      }
    };
  }

  if (link.type === DataTypeEnum.Dialog) {
    return {
      onClick,
      gtm: { id: "cta-click1", action: link.type, label: link.label }
    };
  }

  return toAnchorLinkActionProps(link, countryCode);
};
