import Button from "@bmi-digital/components/button";
import { useIsClient } from "@bmi-digital/components/hooks";
import HeaderComponent from "@bmi-digital/components/header";
import HidePrint from "@bmi-digital/components/hide-print";
import IconButton from "@bmi-digital/components/icon-button";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import { RegionCode } from "@bmi-digital/components/language-selection";
import { microCopy } from "@bmi/microcopies";
import { graphql, Link, withPrefix } from "gatsby";
import React, { useMemo } from "react";
import AuthService from "../auth/service";
import Image from "../components/Image";
import { useConfig } from "../contexts/ConfigProvider";
import { useBasketContext } from "../contexts/SampleBasketContext";
import useAuth from "../hooks/useAuth";
import { constructUrlWithPrevPage } from "../templates/myAccountPage/utils";
import { checkIfActiveLabelInParentNode } from "../utils/breadcrumbUtils";
import { pushToDataLayer, useGTM } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { stringifyToObject } from "../utils/createActionLabelForAnalytics";
import Icon from "./Icon";
import RichText from "./RichText";
import SampleBasketDialog from "./SampleBasketDialog";
import { Data as SiteData, useSiteContext } from "./Site";
import { getCTA } from "./link/utils";
import type { RichTextData } from "./RichText";
import type { IconButtonProps } from "@bmi-digital/components/icon-button";
import type { ButtonProps } from "@bmi-digital/components/button";
import type { Data as PageInfoData } from "./PageInfo";
import type {
  Data as LinkData,
  NavigationData,
  NavigationItem
} from "./link/types";
import type { GetMicroCopy } from "./MicroCopy";
import type { NavigationList } from "@bmi-digital/components/navigation";
import type { Data as PromoData } from "./Promo";

type ParseNavigationProps = {
  navigationItems: (NavigationData | NavigationItem | LinkData)[];
  countryCode: string;
  getMicroCopy: GetMicroCopy;
  isClient?: boolean;
};

type GetPromoSectionProps = {
  promo: PromoData;
  countryCode: SiteData["countryCode"];
  getMicroCopy: GetMicroCopy;
};

const getPromoSection = (props: GetPromoSectionProps) => {
  const { promo, countryCode, getMicroCopy } = props;
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
    ...(cta ? [{ label: promo.cta.label || promo.name, action: cta }] : [])
  ];
};

const parseNavigation = ({
  navigationItems,
  countryCode,
  getMicroCopy,
  isClient
}: ParseNavigationProps): NavigationList[] => {
  if (!navigationItems || navigationItems.length === 0) {
    return [];
  }

  return navigationItems.reduce((result, { __typename, ...item }) => {
    if (__typename === "ContentfulNavigation") {
      const { label, links, link, promos } = item as NavigationData;

      const navItem = {
        label,
        menu: parseNavigation({
          navigationItems: link ? [link, ...links] : links,
          countryCode,
          getMicroCopy,
          isClient
        }),
        ...(promos &&
          promos.length && {
            footer: promos.flatMap((promo) =>
              getPromoSection({ promo, countryCode, getMicroCopy })
            )
          }),
        gtm: {
          id: "nav-main-menu",
          label: label
        }
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
          to: getPathWithCountryCode(countryCode, linkedPage.path),
          component: Link
        };
      } else if (url) {
        const href =
          isClient && url.includes(process.env.GATSBY_INTOUCH_ORIGIN)
            ? constructUrlWithPrevPage(url)
            : url;
        action = {
          href
        };
      }

      return result.concat({
        label,
        ...(iconName && { icon: <Icon name={iconName} /> }),
        isLabelHidden,
        action,
        gtm: {
          id: "nav-main-menu",
          label: label,
          action: stringifyToObject(action?.to) || action?.href
        }
      });
    }

    return result;
  }, []);
};

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
  const { isClient } = useIsClient();

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
        .reduce<(typeof languages)[0]["menu"]>(
          (acc, { menu }) => acc.concat(menu),
          []
        )
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

  const utilities = parseNavigation({
    navigationItems: utilitiesData.links,
    countryCode,
    getMicroCopy,
    isClient
  });

  if (isLoginEnabled) {
    if (isLoggedIn && profile) {
      utilities.push(
        {
          label: getMicroCopy(microCopy.MY_ACCOUNT_LABEL),
          action: {
            to: getPathWithCountryCode(countryCode, accountPage?.slug),
            component: Link,
            "data-testid": "my-acc"
          }
        },
        {
          label: getMicroCopy(microCopy.LOG_OUT_LABEL_BTN),
          action: {
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
          onClick: () => {
            AuthService.login();
          },
          "data-testid": "login"
        }
      });
    }
  }

  const navigation = parseNavigation({
    navigationItems: navigationData.links,
    countryCode,
    getMicroCopy,
    isClient
  });

  const basketUrl =
    sampleBasketLink &&
    getPathWithCountryCode(countryCode, sampleBasketLink.slug);

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
            component: Link,
            to: getPathWithCountryCode(countryCode, "")
          }}
          logoLabel={getMicroCopy(microCopy.GLOBAL_LOGO_LABEL)}
          activeNavLabel={newActiveLabel}
          closeLabel={getMicroCopy(microCopy.GLOBAL_CLOSE)}
          searchGtm={{
            id: "search1",
            label: getMicroCopy(microCopy.SEARCH_LABEL)
          }}
          navUtilityLinkButton={(props: ButtonProps) => (
            <Button
              gtm={{
                id: "nav-top-utilities-bar",
                action: stringifyToObject(props.to) || props.href,
                label: React.Children.toArray(props.children).join("")
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
                    basketUrl={basketUrl}
                    maximumSamples={maximumSamples}
                    {...props}
                  />
                )
              : null
          }
          navigationButtonComponent={(props: ButtonProps) => (
            <Button
              gtm={{
                id: "nav-main-menu",
                action: stringifyToObject(props.to),
                label:
                  typeof props.children !== "string"
                    ? props.accessibilityLabel
                    : undefined
              }}
              {...props}
            />
          )}
          promoButtonComponent={({ startIcon, ...props }: ButtonProps) => (
            <Button
              {...props}
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              className="Button"
              style={{ marginLeft: 16, marginBottom: 15 }}
            />
          )}
          closeButtonComponent={(props: IconButtonProps) => (
            <IconButton
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
