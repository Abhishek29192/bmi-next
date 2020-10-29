import React from "react";
import { graphql, Link } from "gatsby";
import { LinkData, NavigationData, NavigationItem } from "./Link";
import HeaderComponent from "@bmi/header";
import HidePrint from "@bmi/hide-print";
import Icon from "./Icon";

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
      let iconLabel;
      let action;

      const {
        label,
        isLabelHidden,
        icon: iconName,
        linkedPage,
        url
      } = item as LinkData;

      if (isLabelHidden && iconName) {
        iconLabel = <Icon name={iconName} />;
      }
      if (!isLabelHidden && iconName) {
        iconLabel = [
          <Icon key={`icon-${iconName}`} name={iconName} />,
          <b key={`label-${iconName}`}>{label}</b>
        ];
      }

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
        label: iconLabel || label,
        isLabelHidden,
        action
      });
    }
  }, []);
};

const Header = ({
  navigationData,
  utilitiesData,
  countryCode
}: {
  navigationData: NavigationData;
  utilitiesData: NavigationData;
  countryCode: string;
}) => {
  if (!navigationData || !utilitiesData) {
    return null;
  }
  const utilities = parseNavigation(utilitiesData.links, countryCode);
  const navigation = parseNavigation(navigationData.links, countryCode);

  return (
    <HidePrint>
      <HeaderComponent
        utilities={utilities}
        navigation={navigation}
        logoAction={{
          model: "routerLink",
          linkComponent: Link,
          to: `/${countryCode}/`
        }}
      />
    </HidePrint>
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
