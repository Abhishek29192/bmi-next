import uniqueId from "lodash-es/uniqueId";
import { Clickable, ClickableAction } from "@bmi-digital/components";
import { Dialog } from "@bmi-digital/components";
import { graphql, Link as GatsbyLink } from "gatsby";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Data as SimplePageData } from "../templates/simplePage/components/simple-page";
import { getPathWithCountryCode } from "../utils/path";
import { IconName } from "./Icon";
import { Data as PageInfoData } from "./PageInfo";
import { CalculatorContext } from "./PitchedRoofCalcualtor";
import { Data as PromoData } from "./Promo";
import { SectionData, sectionsMap } from "./Sections";
import { useSiteContext } from "./Site";
import styles from "./styles/Link.module.scss";
import { VisualiserContext } from "./Visualiser";

const checkUrlAction = (url: string): boolean => {
  const actionUrls = ["mailto:", "tel:", "callto:"];
  return actionUrls.some((actionUrl) => url.startsWith(actionUrl));
};
export enum DataTypeEnum {
  External = "External",
  Internal = "Internal",
  Asset = "Asset",
  Visualiser = "Visualiser",
  Calculator = "Calculator",
  Dialog = "Dialog",
  HubSpotCta = "HubSpot CTA"
}

export const isExternalUrl = (url: string): boolean => {
  try {
    const linkUrl = new URL(url);
    return linkUrl.host !== window.location.host;
  } catch (e) {
    return false;
  }
};

// TODO: This whole function needs refactoring
export const getClickableActionFromUrl = (
  linkedPage?: Data["linkedPage"],
  url?: Data["url"],
  countryCode?: string,
  assetUrl?: string,
  label?: string,
  type?: Data["type"],
  onClick?: (...args: any) => void,
  gtmData?: {
    id: string;
    label: string;
    action: string;
  }
): (ClickableAction & { "data-gtm"?: string }) | undefined => {
  if (type === DataTypeEnum.Visualiser) {
    const dataGtm = gtmData || {
      id: "cta-visualiser1",
      action: "visualiser",
      label
    };

    return {
      model: "default",
      onClick,
      "data-gtm": JSON.stringify(dataGtm)
    };
  }

  if (type === DataTypeEnum.Calculator) {
    const dataGtm = gtmData || {
      id: "cta-calculator1",
      action: "calculator",
      label
    };

    return {
      model: "default",
      onClick,
      "data-gtm": JSON.stringify(dataGtm)
    };
  }

  if (type === DataTypeEnum.Dialog) {
    const dataGtm = gtmData || { id: "cta-click1", action: type, label };
    return {
      model: "default",
      onClick,
      "data-gtm": JSON.stringify(dataGtm)
    };
  }

  if (assetUrl) {
    const dataGtm = gtmData || {
      id: "cta-click1",
      action: assetUrl,
      label
    };
    return {
      model: "download",
      href: assetUrl,
      "data-gtm": JSON.stringify(dataGtm)
    };
  }

  if (!countryCode && process.env.GATSBY_DONT_USE_COUNTRY_CODE !== "true") {
    return;
  }

  if (linkedPage && "path" in linkedPage) {
    const to = getPathWithCountryCode(countryCode, linkedPage.path).replace(
      /\/+/gi,
      "/"
    );
    const dataGtm = gtmData || { id: "cta-click1", action: to, label };

    return {
      model: "routerLink",
      to,
      linkComponent: GatsbyLink,
      "data-gtm": JSON.stringify(dataGtm)
    };
  }

  if (url) {
    const externalLinkProps = {
      // NOTE: External links should always open in a new tab.
      target: "_blank",
      rel: "noopener noreferrer"
    };
    const dataGtm = gtmData || { id: "cta-click1", action: url, label };

    return {
      model: "htmlLink",
      href: url,
      ...(checkUrlAction(url) || !isExternalUrl(url) ? {} : externalLinkProps),
      "data-gtm": JSON.stringify(dataGtm)
    };
  }
};

export const getCTA = (
  data:
    | Pick<PromoData, "cta">
    | Pick<PageInfoData, "path">
    | Pick<SimplePageData, "cta">,
  countryCode: string,
  linkLabel?: string
) => {
  if ("cta" in data) {
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
  if (!path) return null;

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

// TODO: HubSpot CTA script does not work on live. This is an intermediate
// step which may be acceptable for a final solution.
export const getLinkURL = (data: Data) =>
  data?.type === "HubSpot CTA" &&
  data?.hubSpotCTAID &&
  process.env.GATSBY_HUBSPOT_ID &&
  process.env.GATSBY_HUBSPOT_CTA_URL
    ? `${process.env.GATSBY_HUBSPOT_CTA_URL}${process.env.GATSBY_HUBSPOT_ID}/${data?.hubSpotCTAID}`
    : data?.url;

export type Data = {
  __typename: "ContentfulLink";
  id: string;
  label: string;
  icon: IconName | null;
  isLabelHidden: boolean | null;
  url: string | null;
  type: DataTypeEnum | null;
  parameters: { [key: string]: any } | null;
  dialogContent: SectionData | null;
  linkedPage: {
    // NOTE: null is for Homepage type
    path: string | null;
  } | null;
  asset?: {
    file: {
      url: string | null;
    };
  } | null;
  hubSpotCTAID: string | null;
};

export type NavigationItem = {
  __typename: "ContentfulNavigationItem";
  type: "Heading" | "Separator";
  value: string;
};

export type NavigationData = {
  __typename: "ContentfulNavigation";
  label: string | null;
  link: Data | null;
  promos?: PromoData[] | null;
  links: (NavigationData | NavigationItem | Data)[];
};

export const renderDialog = (
  data: Data,
  dialogIsOpen: boolean,
  handleDialogCloseClick: () => void
) => {
  if (!data?.dialogContent) {
    return;
  }

  const sectionId = `dialog-section-${uniqueId()}`;
  const Component: React.ElementType =
    sectionsMap[data.dialogContent.__typename];

  return (
    <Dialog open={dialogIsOpen} onCloseClick={handleDialogCloseClick}>
      <div className={styles["Link--dialog"]}>
        <Component data={data.dialogContent} id={sectionId} />
      </div>
    </Dialog>
  );
};
export const Link = ({
  children,
  component: Component = Clickable,
  data,
  onClick,
  ...rest
}: typeof Component & {
  children: React.ReactNode;
  component?: React.ElementType;
  data: Data;
  onClick?: (...args: any) => void;
}) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { countryCode } = useSiteContext();
  const { open: openVisualiser } = useContext(VisualiserContext);
  const { open: openCalculator } = useContext(CalculatorContext);

  const handleOnClick = useCallback(
    (...args) => {
      onClick && onClick(...args);

      if (data?.type === "Visualiser" && openVisualiser) {
        openVisualiser(data?.parameters);
      } else if (data?.type === "Calculator" && openCalculator) {
        openCalculator(data?.parameters);
      } else if (data?.type === "Dialog") {
        setDialogIsOpen(true);
      }
    },
    [data?.parameters, data?.type, onClick]
  );

  const action = useMemo(
    () =>
      getClickableActionFromUrl(
        data?.linkedPage,
        getLinkURL(data),
        countryCode,
        data?.asset?.file?.url,
        data?.label,
        data?.type,
        handleOnClick
      ),
    [data, countryCode, handleOnClick]
  );

  const handleDialogCloseClick = useCallback(() => {
    setDialogIsOpen(false);
  }, []);

  const memoedRenderDialog = useMemo(
    () => renderDialog(data, dialogIsOpen, handleDialogCloseClick),
    [data?.dialogContent, dialogIsOpen]
  );

  return (
    <>
      <Component action={action} onClick={handleOnClick} {...rest}>
        {children}
      </Component>
      {data?.type === "Dialog" && data?.dialogContent && memoedRenderDialog}
    </>
  );
};

export default Link;

export const query = graphql`
  fragment LinkFragmentNonRecursive on ContentfulLink {
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
    parameters {
      ...VisualiserFragment
    }
    hubSpotCTAID
  }
  fragment LinkFragment on ContentfulLink {
    ...LinkFragmentNonRecursive
    dialogContent {
      # Potential to add more sections here.
      ...FormSectionFragmentNonRecursive
    }
  }
`;
