import {
  Button,
  ButtonProps,
  Header as HeaderComponent,
  HidePrint,
  TabProps,
  RegionCode
} from "@bmi-digital/components";
import Tab from "@material-ui/core/Tab";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { graphql, Link, withPrefix } from "gatsby";
import React, { useMemo } from "react";
import Image from "../components/Image";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { useBasketContext } from "../contexts/SampleBasketContext";
import withGTM, { pushToDataLayer, useGTM } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { checkIfActiveLabelInParentNode } from "../utils/breadcrumbUtils";
import { iconMap } from "./Icon";
import {
  Data as LinkData,
  getCTA,
  NavigationData,
  NavigationItem
} from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import RichText, { RichTextData } from "./RichText";
import SampleBasketDialog from "./SampleBasketDialog";
import { useSiteContext } from "./Site";

const getPromoSection = (promo, countryCode, getMicroCopy) => {
  const cta = getCTA(
    promo,
    countryCode,
    getMicroCopy(microCopy.PAGE_LINK_LABEL)
  );

  return [
    {
      label: promo.title || promo.name,
      image: <Image data={promo.featuredMedia} />
    },
    { label: promo.title || promo.name, isHeading: true },
    ...(promo.subtitle ? [{ label: promo.subtitle, isParagraph: true }] : []),
    ...(cta ? [cta] : [])
  ];
};

const parseNavigation = (
  navigationItems: (NavigationData | NavigationItem | LinkData)[],
  countryCode: string,
  getMicroCopy
) => {
  if (!navigationItems || navigationItems.length === 0) {
    return [];
  }

  return navigationItems.reduce((result, { __typename, ...item }) => {
    if (__typename === "ContentfulNavigation") {
      const { label, links, link, promos } = item as NavigationData;

      const navItem = {
        label,
        menu: parseNavigation(
          link ? [link, ...links] : links,
          countryCode,
          getMicroCopy
        ),
        ...(promos &&
          promos.length && {
            footer: promos.flatMap((promo) =>
              getPromoSection(promo, countryCode, getMicroCopy)
            )
          })
      };

      return result.concat(navItem);
    }

    if (__typename === "ContentfulNavigationItem") {
      const { value, type } = item as NavigationItem;

      if (type === "Heading") {
        return result.concat({
          label: value,
          isLabelHidden: false,
          isHeading: true
        });
      }

      if (type === "Separator") {
        if (result.length === 0) {
          return result;
        }
        const lastItem = result[result.length - 1];
        result[result.length - 1] = { ...lastItem, hasSeparator: true };
        return result;
      }
    }

    if (__typename === "ContentfulLink") {
      let action;

      const {
        label,
        isLabelHidden,
        icon: iconName,
        linkedPage,
        url
      } = item as LinkData;

      if (linkedPage) {
        action = {
          model: "routerLink",
          to: getPathWithCountryCode(countryCode, linkedPage.path),
          linkComponent: Link
        };
      } else if (url) {
        action = {
          model: "htmlLink",
          href: url
        };
      }

      return result.concat({
        label,
        // eslint-disable-next-line security/detect-object-injection
        icon: iconMap[iconName],
        isLabelHidden,
        action
      });
    }

    return result;
  }, []);
};

const GTMSearchButton = withGTM<ButtonProps>(Button, {
  label: "accessibilityLabel"
});
const GTMNavigationButton = withGTM<ButtonProps>(Button, {
  label: "children"
});
const GTMNavigationTab = withGTM<TabProps>(Tab, {
  label: "label"
});
const GTMNavigationUtilityButton = withGTM<ButtonProps>(Button, {
  label: "children"
});
const GTMCloseButton = withGTM<ButtonProps>(Button);

const onCountrySelection = (label: string, code: string) =>
  pushToDataLayer({ id: "nav-country-selector", label: label, action: code });

export type Region = {
  label: string;
  regionCode: RegionCode;
  menu: Array<{
    code: string;
    label: string;
    icon: string | null;
  }>;
};

const Header = ({
  navigationData,
  utilitiesData,
  countryCode,
  activeLabel,
  isOnSearchPage,
  countryNavigationIntroduction,
  regions,
  sampleBasketLink,
  maximumSamples,
  lastNavigationLabel
}: {
  navigationData: NavigationData;
  utilitiesData: NavigationData;
  countryCode: string;
  activeLabel?: string;
  isOnSearchPage?: boolean;
  countryNavigationIntroduction?: RichTextData | null;
  regions: Region[];
  sampleBasketLink?: PageInfoData;
  maximumSamples?: number;
  lastNavigationLabel?: string;
}) => {
  const languages = useMemo(
    () =>
      regions.map((region) => ({
        ...region,
        menu: region.menu.map((language) => ({
          ...language,
          icon: language.icon ? withPrefix(language.icon) : undefined
        }))
      })),
    [regions]
  );

  const language = useMemo(
    () =>
      languages
        .reduce((acc, { menu }) => acc.concat(menu), [])
        .find((l) => l.code === countryCode),
    [languages, countryCode]
  );

  if (!navigationData || !utilitiesData) {
    return null;
  }

  const { getMicroCopy } = useSiteContext();
  const {
    config: { isSpaEnabled, isGatsbyDisabledElasticSearch }
  } = useConfig();
  const {
    basketState: { products: productsInBasket }
  } = useBasketContext();
  const utilities = parseNavigation(
    utilitiesData.links,
    countryCode,
    getMicroCopy
  );
  const navigation = parseNavigation(
    navigationData.links,
    countryCode,
    getMicroCopy
  );

  const basketCta =
    sampleBasketLink &&
    getCTA(sampleBasketLink, countryCode, sampleBasketLink?.slug);

  const newActiveLabel =
    checkIfActiveLabelInParentNode(lastNavigationLabel, navigationData) ||
    activeLabel;
  return (
    <HidePrint
      component={() => (
        <HeaderComponent
          isSpaEnabled={isSpaEnabled}
          isGatsbyDisabledElasticSearch={isGatsbyDisabledElasticSearch}
          languages={languages}
          language={language}
          languageLabel={getMicroCopy(microCopy.MENU_LANGUAGE)}
          languageIntroduction={
            <RichText document={countryNavigationIntroduction} />
          }
          utilities={utilities}
          navigation={navigation}
          logoAction={{
            model: "routerLink",
            linkComponent: Link,
            to: getPathWithCountryCode(countryCode, "")
          }}
          logoLabel={getMicroCopy(microCopy.GLOBAL_LOGO_LABEL)}
          activeNavLabel={newActiveLabel}
          closeLabel={getMicroCopy(microCopy.GLOBAL_CLOSE)}
          tabComponent={(props: TabProps) => (
            <GTMNavigationTab gtm={{ id: "nav-main-menu" }} {...props} />
          )}
          searchButtonComponent={(props: ButtonProps) => (
            <GTMSearchButton gtm={{ id: "search1" }} {...props} />
          )}
          navUtilityLinkButton={(props: ButtonProps) => (
            <GTMNavigationUtilityButton
              gtm={{
                id: "nav-top-utilities-bar",
                action: props["action"]?.to || props["action"]?.href
              }}
              {...props}
            />
          )}
          isBasketEmpty={productsInBasket.length === 0}
          basketLabel={getMicroCopy(microCopy.BASKET_LABEL)}
          SampleBasketDialog={(props: () => void) => (
            <SampleBasketDialog
              title={sampleBasketLink?.sections?.[0]?.title}
              maximumSamples={maximumSamples}
              basketAction={basketCta?.action}
              {...props}
            />
          )}
          navigationButtonComponent={(props: ButtonProps) => (
            <GTMNavigationButton
              gtm={{
                id: "nav-main-menu",
                action: props["action"]?.["to"], // TODO: Fix this when we fix the withClickable lack of typing
                label:
                  typeof props.children !== "string"
                    ? props.accessibilityLabel
                    : undefined
              }}
              {...props}
            />
          )}
          promoButtonComponent={(props: ButtonProps) => (
            <Button
              {...props}
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              className="Button"
              style={{ marginLeft: 10, marginBottom: 15 }}
            />
          )}
          closeButtonComponent={(props: ButtonProps) => (
            <GTMCloseButton
              gtm={{
                id: "nav-country-selector",
                label: "close panel",
                action: "close panel"
              }}
              {...props}
            />
          )}
          onCountrySelection={onCountrySelection}
          useGTM={useGTM}
          searchAction={getPathWithCountryCode(countryCode, "search")}
          searchLabel={getMicroCopy(microCopy.SEARCH_LABEL)}
          searchPlaceholder={getMicroCopy(microCopy.SEARCH_PLACEHOLDER_HEADER)}
          searchTitle={getMicroCopy(microCopy.SEARCH_TITLE)}
          openLabel={getMicroCopy(microCopy.MENU_OPEN)}
          mainMenuTitleLabel={getMicroCopy(microCopy.MENU_MAIN_TITLE)}
          mainMenuDefaultLabel={getMicroCopy(microCopy.MENU_MAIN_DEFAULT)}
          isOnSearchPage={isOnSearchPage}
        />
      )}
    />
  );
};

export default Header;

export const query = graphql`
  fragment HeaderNavigationFragment on ContentfulNavigation {
    __typename
    label
    links {
      __typename
      ... on ContentfulLink {
        ...LinkFragment
      }
      ... on ContentfulNavigation {
        link {
          ...LinkFragment
        }
        label
        promos {
          ... on ContentfulPromoOrPage {
            __typename
            ...PromoFragment
            ...PageInfoFragment
          }
        }
        links {
          __typename
          ... on ContentfulNavigationItem {
            type
            value
          }
          ... on ContentfulLink {
            ...LinkFragment
          }
          ... on ContentfulNavigation {
            link {
              ...LinkFragment
            }
            label
            links {
              __typename
              ... on ContentfulNavigationItem {
                type
                value
              }
              ... on ContentfulLink {
                ...LinkFragment
              }
              ... on ContentfulNavigation {
                link {
                  ...LinkFragment
                }
                label
                links {
                  __typename
                  ... on ContentfulNavigationItem {
                    type
                    value
                  }
                  ... on ContentfulLink {
                    ...LinkFragment
                  }
                  ... on ContentfulNavigation {
                    link {
                      ...LinkFragment
                    }
                    label
                    links {
                      __typename
                      ... on ContentfulNavigationItem {
                        type
                        value
                      }
                      ... on ContentfulLink {
                        ...LinkFragment
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  fragment HeaderUtilitiesFragment on ContentfulNavigation {
    label
    links {
      __typename
      ... on ContentfulLink {
        ...LinkFragment
      }
    }
  }
  fragment HeaderLanguageFragment on ContentfulResources {
    countryNavigationIntroduction {
      ...RichTextFragment
    }
  }
  fragment RegionFragment on RegionJson {
    label
    regionCode
    menu {
      code
      label
      icon
    }
  }
`;
