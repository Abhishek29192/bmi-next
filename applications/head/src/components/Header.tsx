import React from "react";
import { graphql, Link } from "gatsby";
import Arrow from "@bmi/icon/src/svgs/Arrow.svg";
import AeroDek from "@bmi/logo/svgs/AeroDek.svg";
import Icopal from "@bmi/logo/svgs/Icopal.svg";
import Monier from "@bmi/logo/svgs/Monier.svg";
import Monarplan from "@bmi/logo/svgs/Monarplan.svg";
import Zanda from "@bmi/logo/svgs/Zanda.svg";
import { NavigationData } from "../templates/types";
import HeaderComponent from "@bmi/header";

const IconMap = {
  AeroDek: <AeroDek />,
  Monier: <Monier />,
  Monarplan: <Monarplan />,
  Arrow: <Arrow />,
  Zanda: <Zanda />,
  Icopal: <Icopal />
};

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
        iconLabel = IconMap[iconName] || <Arrow />;
      }
      if (!isLabelHidden && iconName) {
        iconLabel = [IconMap[iconName] || <Arrow />, label];
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
          to: linkedPage.slug,
          linkComponent: Link
        };
      }
      if (url) {
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
  fragment PartialLinkFragment on ContentfulLink {
    id
    label
    icon
    isLabelHidden
    url
    linkedPage {
      slug
    }
  }
  fragment HeaderNavigationFragment on ContentfulNavigation {
    label
    links {
      ... on ContentfulLink {
        ...PartialLinkFragment
      }
      ... on ContentfulNavigation {
        label
        links {
          ... on ContentfulNavigationItem {
            type
            value
          }
          ... on ContentfulLink {
            ...PartialLinkFragment
          }
          ... on ContentfulNavigation {
            label
            links {
              ... on ContentfulNavigationItem {
                type
                value
              }
              ... on ContentfulLink {
                ...PartialLinkFragment
              }
              ... on ContentfulNavigation {
                label
                links {
                  ... on ContentfulLink {
                    ...PartialLinkFragment
                  }
                  ... on ContentfulNavigation {
                    label
                    links {
                      ... on ContentfulLink {
                        ...PartialLinkFragment
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
        id
        label
        isLabelHidden
        url
        linkedPage {
          slug
        }
      }
    }
  }
`;
