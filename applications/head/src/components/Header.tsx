import React from "react";
import { graphql, Link } from "gatsby";
import { NavigationData } from "./Link";
import HeaderComponent from "@bmi/header";
import Icon from "./Icon";

const parseNavigation = (navigationItems) => {
  return navigationItems.reduce(
    (
      result,
      {
        label,
        links,
        icon: iconName,
        isLabelHidden,
        linkedPage,
        url,
        type,
        __typename,
        value
      }
    ) => {
      let iconLabel;
      if (isLabelHidden && iconName) {
        iconLabel = <Icon name={iconName} />;
      }
      if (!isLabelHidden && iconName) {
        iconLabel = [<Icon key={`icon-${iconName}`} name={iconName} />, label];
      }

      const isHeading =
        __typename === "ContentfulNavigationItem" && type === "Heading";
      const isSeparator =
        __typename === "ContentfulNavigationItem" && type === "Separator";

      if (isSeparator) {
        if (result.length === 0) {
          return result;
        }
        let lastItem = result[result.length - 1];
        result[result.length - 1] = { ...lastItem, hasSeparator: true };
        return result;
      }

      let action;
      if (linkedPage) {
        action = {
          model: "routerLink",
          // TODO: use countryCode from context instead of /no
          to: `/no/${linkedPage.slug}`,
          linkComponent: Link
        };
      } else if (url) {
        action = {
          model: "htmlLink",
          href: url
        };
      }

      return result.concat({
        label: iconLabel || label || value,
        isLabelHidden,
        action,
        isHeading,
        menu: links ? parseNavigation(links) : undefined
      });
    },
    []
  );
};

const Header = ({
  navigationData,
  utilitiesData
}: {
  navigationData: NavigationData;
  utilitiesData: NavigationData;
}) => {
  if (!navigationData || !utilitiesData) {
    return null;
  }
  const utilities = parseNavigation(utilitiesData.links);
  const navigation = parseNavigation(navigationData.links);

  return <HeaderComponent utilities={utilities} navigation={navigation} />;
};

export default Header;

export const query = graphql`
  fragment HeaderNavigationFragment on ContentfulNavigation {
    label
    links {
      ... on ContentfulLink {
        ...LinkFragment
      }
      ... on ContentfulNavigation {
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
                label
                links {
                  ... on ContentfulLink {
                    ...LinkFragment
                  }
                  ... on ContentfulNavigation {
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
