import React from "react";
import Footer from "@bmi/footer";
import { ClickableAction } from "@bmi/clickable";
import { graphql, Link } from "gatsby";
import BmiIcon from "@bmi/footer/src/svgs/BMI.svg";
import { NavigationData } from "../templates/types";
import { IconMap } from "./Icon";

const getClickableActionFromUrl = (
  page,
  url,
  countryCode
): ClickableAction | void => {
  if (page && page.slug) {
    return {
      model: "routerLink",
      to: `/${countryCode}/${page.slug}`,
      linkComponent: Link
    };
  }

  if (url) {
    return {
      model: "htmlLink",
      href: url
    };
  }
};

const parseNavigation = (navigationItems, countryCode) => {
  return navigationItems.map(
    ({ label, links, icon: iconName, isLabelHidden, linkedPage, url }) => {
      return {
        label,
        icon: iconName ? IconMap[iconName] : undefined,
        isLabelHidden,
        action: getClickableActionFromUrl(linkedPage, url, countryCode),
        menu: links ? parseNavigation(links, countryCode) : undefined
      };
    }
  );
};

type Props = {
  mainNavigation: NavigationData;
  secondaryNavigation: NavigationData;
  countryCode: string;
};

const BmiFooter = ({
  mainNavigation,
  secondaryNavigation,
  countryCode
}: Props) => {
  const main = parseNavigation(mainNavigation.links, countryCode);
  const secondary = parseNavigation(secondaryNavigation.links, countryCode);

  return (
    <Footer
      mainNavigation={main}
      secondaryNavigation={secondary}
      logo={BmiIcon}
    />
  );
};

export default BmiFooter;

export const query = graphql`
  fragment FooterMainNavigationFragment on ContentfulNavigation {
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
  fragment FooterSecondaryNavigationFragment on ContentfulNavigation {
    label
    links {
      ... on ContentfulLink {
        ...LinkFragment
      }
    }
  }
`;
