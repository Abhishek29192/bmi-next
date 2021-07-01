import { ClickableAction } from "@bmi/clickable";
import Dialog from "@bmi/dialog";
import { graphql, Link as GatsbyLink } from "gatsby";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Data as SimplePageData } from "../templates/simple-page";
import { pushToDataLayer } from "../utils/google-tag-manager";
import { IconName } from "./Icon";
import { Data as PageInfoData } from "./PageInfo";
import { CalculatorContext } from "./PitchedRoofCalcualtor";
import { Data as PromoData } from "./Promo";
import { SectionData, sectionsMap } from "./Sections";
import { SiteContext } from "./Site";
import styles from "./styles/Link.module.scss";
import { VisualiserContext } from "./Visualiser";

const checkUrlAction = (url: string): boolean => {
  const actionUrls = ["mailto:", "tel:", "callto:"];
  return actionUrls.some((actionUrl) => url.startsWith(actionUrl));
};

// TODO: This whole function needs refactoring
export const getClickableActionFromUrl = (
  linkedPage?: Data["linkedPage"],
  url?: Data["url"],
  countryCode?: string,
  assetUrl?: string,
  label?: string,
  type?: Data["type"],
  onClick?: (...args: any) => void
): ClickableAction | undefined => {
  if (type === "Visualiser") {
    const dataGtm = { id: "cta-visualiser1", action: "visualiser", label };

    return {
      model: "default",
      onClick: (...args) => {
        onClick && onClick(...args);
        pushToDataLayer(dataGtm);
      },
      // @ts-ignore data-gtm is not defined but a general html attribute
      "data-gtm": JSON.stringify(dataGtm)
    };
  }

  if (type === "Calculator") {
    const dataGtm = { id: "cta-calculator1", action: "calculator", label };

    return {
      model: "default",
      onClick: (...args) => {
        onClick && onClick(...args);
        pushToDataLayer(dataGtm);
      },
      // @ts-ignore data-gtm is not defined but a general html attribute
      "data-gtm": JSON.stringify(dataGtm)
    };
  }

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
      linkComponent: GatsbyLink,
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

export type Data = {
  __typename: "ContentfulLink";
  id: string;
  label: string;
  icon: IconName | null;
  isLabelHidden: boolean | null;
  url: string | null;
  type:
    | "External"
    | "Internal"
    | "Asset"
    | "Visualiser"
    | "Calculator"
    | "Dialog"
    | null;
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

export const Link = ({
  children,
  component: Component = "a",
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
  const { countryCode } = useContext(SiteContext);
  const { open: openVisualiser } = useContext(VisualiserContext);
  const { open: openCalculator } = useContext(CalculatorContext);

  const handleOnClick = useCallback(
    (...args) => {
      onClick && onClick(...args);

      if (data?.type === "Visualiser" && openVisualiser) {
        openVisualiser(data?.parameters);
      } else if (data?.type === "Calculator" && openCalculator) {
        openCalculator(data?.parameters);
      }

      if (data?.type === "Dialog") {
        setDialogIsOpen(true);
      }
    },
    [data?.parameters, data?.type, onClick]
  );

  const action = useMemo(
    () =>
      getClickableActionFromUrl(
        data?.linkedPage,
        data?.url,
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

  const renderDialog = useMemo(() => {
    if (!data?.dialogContent) {
      return;
    }

    const Component: React.ElementType =
      sectionsMap[data.dialogContent.__typename];

    return (
      <Dialog open={dialogIsOpen} onCloseClick={handleDialogCloseClick}>
        <div className={styles["Link--dialog"]}>
          <Component data={data.dialogContent} />
        </div>
      </Dialog>
    );
  }, [data?.dialogContent, dialogIsOpen]);

  return (
    <>
      <Component action={action} onClick={handleOnClick} {...rest}>
        {children}
      </Component>
      {data?.type === "Dialog" && data?.dialogContent && renderDialog}
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
  }
  fragment LinkFragment on ContentfulLink {
    ...LinkFragmentNonRecursive
    dialogContent {
      # Potential to add more sections here.
      ...FormSectionFragmentNonRecursive
    }
  }
`;