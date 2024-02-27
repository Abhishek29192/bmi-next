import Button, { ButtonProps } from "@bmi-digital/components/button";
import HeaderComponent from "@bmi-digital/components/header";
import HidePrint from "@bmi-digital/components/hide-print";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import { RegionCode } from "@bmi-digital/components/language-selection";
import { TabProps } from "@bmi-digital/components/tabs";
import { microCopy } from "@bmi/microcopies";
import Tab from "@mui/material/Tab";
import { Link, graphql, withPrefix } from "gatsby";
import React, { useMemo } from "react";
import AuthService from "../auth/service";
import Image from "../components/Image";
import { useConfig } from "../contexts/ConfigProvider";
import { useBasketContext } from "../contexts/SampleBasketContext";
import useAuth from "../hooks/useAuth";
import { checkIfActiveLabelInParentNode } from "../utils/breadcrumbUtils";
import withGTM, { pushToDataLayer, useGTM } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import Icon from "./Icon";
import {
  Data as LinkData,
  NavigationData,
  NavigationItem,
  getCTA
} from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import RichText, { RichTextData } from "./RichText";
import SampleBasketDialog from "./SampleBasketDialog";
import { useSiteContext } from "./Site";
import type { GetMicroCopy } from "./MicroCopy";

const getPromoSection = (promo, countryCode, getMicroCopy) => {
  const cta = getCTA(
    promo,
    countryCode,
    getMicroCopy(microCopy.PAGE_LINK_LABEL)
  );

  return [
    {
      label: promo.title || promo.name,
      image: promo.featuredMedia ? (
        <Image {...promo.featuredMedia} />
      ) : undefined
    },
    { label: promo.title || promo.name, isHeading: true },
    ...(promo.subtitle ? [{ label: promo.subtitle, isParagraph: true }] : []),
    ...(cta ? [cta] : [])
  ];
};

const parseNavigation = (
  navigationItems: (NavigationData | NavigationItem | LinkData)[],
  countryCode: string,
  getMicroCopy: GetMicroCopy
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
        ...(iconName && { icon: <Icon name={iconName} /> }),
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
  countryNavigationIntroduction,
  regions,
  sampleBasketLink,
  maximumSamples,
  lastNavigationLabel,
  disableSearch
}: {
  navigationData: NavigationData | null;
  utilitiesData: NavigationData | null;
  countryCode: string;
  activeLabel?: string;
  countryNavigationIntroduction?: RichTextData | null;
  regions: Region[];
  sampleBasketLink?: PageInfoData;
  maximumSamples: number | null;
  lastNavigationLabel?: string;
  disableSearch?: boolean;
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

  const { getMicroCopy, accountPage } = useSiteContext();
  const {
    isGatsbyDisabledElasticSearch,
    isSampleOrderingEnabled,
    isLoginEnabled
  } = useConfig();
  const {
    basketState: { products: productsInBasket }
  } = useBasketContext();

  const { isLoggedIn, profile } = useAuth();

  if (!navigationData || !utilitiesData) {
    return null;
  }

  const utilities = parseNavigation(
    utilitiesData.links,
    countryCode,
    getMicroCopy
  );

  if (isLoginEnabled) {
    if (isLoggedIn && profile) {
      utilities.push(
        {
          label: getMicroCopy(microCopy.MY_ACCOUNT_LABEL),
          action: {
            model: "routerLink",
            to: getPathWithCountryCode(countryCode, accountPage?.slug),
            linkComponent: Link,
            "data-testid": "my-acc"
          }
        },
        {
          label: getMicroCopy(microCopy.LOG_OUT_LABEL_BTN),
          action: {
            model: "default",
            onClick: () => {
              AuthService.logout();
            },
            "data-testid": "logout"
          }
        }
      );
    } else {
      utilities.push({
        label: getMicroCopy(microCopy.LOG_IN_LABEL_BTN),
        action: {
          model: "default",
          onClick: () => {
            AuthService.login();
          },
          "data-testid": "login"
        }
      });
    }
  }

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
          disableSearch={isGatsbyDisabledElasticSearch || disableSearch}
          languages={languages}
          language={language}
          languageLabel={getMicroCopy(microCopy.MENU_LANGUAGE)}
          languageIntroduction={
            <RichText
              hasNoBottomMargin
              document={countryNavigationIntroduction}
            />
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
          shoppingCartCount={productsInBasket.length}
          basketLabel={getMicroCopy(microCopy.BASKET_LABEL)}
          sampleBasketDialog={
            isSampleOrderingEnabled && sampleBasketLink?.sections?.[0]?.title
              ? (props: { toggleCart: () => void }) => (
                  <SampleBasketDialog
                    title={sampleBasketLink.sections[0].title}
                    basketAction={basketCta?.action}
                    maximumSamples={maximumSamples}
                    {...props}
                  />
                )
              : null
          }
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
              style={{ marginLeft: 16, marginBottom: 15 }}
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
            ...PromoHeaderFragment
            ...PageInfoHeaderFragment
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
