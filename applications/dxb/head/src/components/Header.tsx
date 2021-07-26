import React, { useContext } from "react";
import { graphql, Link } from "gatsby";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button, { ButtonProps } from "@bmi/button";
import HeaderComponent from "@bmi/header";
import HidePrint from "@bmi/hide-print";
import { Tab, TabProps } from "@material-ui/core";
import withGTM from "../utils/google-tag-manager";
import Image from "../components/Image";
import { iconMap } from "./Icon";
import {
  Data as LinkData,
  NavigationData,
  NavigationItem,
  getCTA
} from "./Link";
import { SiteContext } from "./Site";

const getPromoSection = (promo, countryCode, getMicroCopy) => {
  const cta = getCTA(promo, countryCode, getMicroCopy("page.linkLabel"));

  return [
    {
      label: promo.title,
      image: <Image data={promo.featuredMedia} />
    },
    { label: promo.title, isHeading: true },
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
            footer: promos
              .map((promo) => getPromoSection(promo, countryCode, getMicroCopy))
              .flat()
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
        let lastItem = result[result.length - 1];
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
          to: `/${countryCode}/${linkedPage.path}`,
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

const Header = ({
  navigationData,
  utilitiesData,
  countryCode,
  activeLabel,
  isOnSearchPage
}: {
  navigationData: NavigationData;
  utilitiesData: NavigationData;
  countryCode: string;
  activeLabel?: string;
  isOnSearchPage?: boolean;
}) => {
  if (!navigationData || !utilitiesData) {
    return null;
  }

  const { getMicroCopy } = useContext(SiteContext);
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

  return (
    <HidePrint
      component={() => (
        <HeaderComponent
          utilities={utilities}
          navigation={navigation}
          logoAction={{
            model: "routerLink",
            linkComponent: Link,
            to: `/${countryCode}/`
          }}
          logoLabel={getMicroCopy("global.logoLabel")}
          activeNavLabel={activeLabel}
          closeLabel={getMicroCopy("global.close")}
          tabComponent={(props: TabProps) => (
            <GTMNavigationTab gtm={{ id: "nav-main-menu" }} {...props} />
          )}
          searchButtonComponent={(props: ButtonProps) => (
            <GTMSearchButton gtm={{ id: "search1" }} {...props} />
          )}
          navigationButtonComponent={(props: ButtonProps) => (
            <GTMNavigationButton
              gtm={{
                id: "nav-main-menu",
                // @ts-ignore This is getting messy
                action: props.action ? props.action.to : undefined
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
          searchAction={`/${countryCode}/search`}
          searchLabel={getMicroCopy("search.label")}
          searchPlaceholder={getMicroCopy("search.placeholder.header")}
          searchTitle={getMicroCopy("search.title")}
          openLabel={getMicroCopy("menu.open")}
          mainMenuTitleLabel={getMicroCopy("menu.mainTitle")}
          mainMenuDefaultLabel={getMicroCopy("menu.mainDefault")}
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
`;
