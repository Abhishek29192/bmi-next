import Button, { ButtonProps } from "@bmi/button";
import HeaderComponent from "@bmi/header";
import HidePrint from "@bmi/hide-print";
import { graphql, Link } from "gatsby";
import React, { useContext } from "react";
import withGTM from "../utils/google-tag-manager";
import { iconMap } from "./Icon";
import { LinkData, NavigationData, NavigationItem } from "./Link";
import { SiteContext } from "./Site";

const parseNavigation = (
  navigationItems: (NavigationData | NavigationItem | LinkData)[],
  countryCode: string
) => {
  if (!navigationItems || navigationItems.length === 0) {
    return [];
  }

  return navigationItems.reduce((result, { __typename, ...item }) => {
    if (__typename === "ContentfulNavigation") {
      const { label, links, link } = item as NavigationData;
      return result.concat({
        label,
        menu: parseNavigation(link ? [link, ...links] : links, countryCode)
      });
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
  }, []);
};

const GTMSearchButton = withGTM<ButtonProps>(Button, {
  label: "buttonText" as "buttonText"
});
const GTMNavigationButton = withGTM<ButtonProps>(Button, {
  label: "children",
  action: "action"
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
  const utilities = parseNavigation(utilitiesData.links, countryCode);
  const navigation = parseNavigation(navigationData.links, countryCode);

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
          searchButtonComponent={(props: ButtonProps) => (
            <GTMSearchButton gtm={{ id: "search1" }} {...props} />
          )}
          navigationButtonComponent={(props: ButtonProps) => (
            <GTMNavigationButton gtm={{ id: "nav-main-menu" }} {...props} />
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
      ... on ContentfulLink {
        ...LinkFragment
      }
      ... on ContentfulNavigation {
        link {
          ...LinkFragment
        }
        label
        links {
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
                  ... on ContentfulLink {
                    ...LinkFragment
                  }
                  ... on ContentfulNavigation {
                    link {
                      ...LinkFragment
                    }
                    label
                    links {
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
      ... on ContentfulLink {
        ...LinkFragment
      }
    }
  }
`;
