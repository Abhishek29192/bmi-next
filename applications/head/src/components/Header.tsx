import React, { useContext } from "react";
import { graphql, Link } from "gatsby";
import { LinkData, NavigationData, NavigationItem } from "./Link";
import HeaderComponent from "@bmi/header";
import HidePrint from "@bmi/hide-print";
import { iconMap } from "./Icon";
import _ from "lodash";
import { NavigationList } from "components/navigation/src";
import { SiteContext } from "./Site";

const parseNavigation = (
  navigationItems: (NavigationData | NavigationItem | LinkData)[],
  countryCode: string
) => {
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
          to: `/${countryCode}/${linkedPage.slug}`,
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

const findMatchingSlug = (
  navigationArray: ReadonlyArray<any>,
  path: string,
  maxDepth: number = 10
): boolean => {
  if (maxDepth == 0) {
    return false;
  }
  return navigationArray.some((item) => {
    if (_.isArray(item)) {
      return findMatchingSlug(item, path, maxDepth - 1);
    }
    if (_.isPlainObject(item)) {
      if (item.action && item.action.to === path) {
        return true;
      } else {
        return findMatchingSlug(Object.values(item), path, maxDepth - 1);
      }
    }
  });
};

const findParentLabel = (
  navigation: NavigationList[],
  path: string
): string | undefined => {
  return navigation.find((navItem) => {
    return findMatchingSlug(Object.values(navItem), path);
  })?.label;
};

const Header = ({
  navigationData,
  utilitiesData,
  countryCode,
  slug
}: {
  navigationData: NavigationData;
  utilitiesData: NavigationData;
  countryCode: string;
  slug?: string;
}) => {
  if (!navigationData || !utilitiesData) {
    return null;
  }

  const { getMicroCopy } = useContext(SiteContext);
  const utilities = parseNavigation(utilitiesData.links, countryCode);
  const navigation = parseNavigation(navigationData.links, countryCode);

  const parentLabel =
    slug && findParentLabel(navigation, `/${countryCode}/${slug}`);

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
          activeNavLabel={parentLabel}
          closeLabel={getMicroCopy("global.close")}
          searchLabel={getMicroCopy("search.label")}
          searchPlaceholder={getMicroCopy("search.placeholder")}
          openLabel={getMicroCopy("menu.open")}
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
