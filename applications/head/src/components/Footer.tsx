import React from "react";
import { graphql } from "gatsby";
import Footer, { MenuItem } from "@bmi/footer";
import BmiIcon from "@bmi/footer/src/svgs/BMI.svg";
import { IconMap } from "./Icon";
import { getClickableActionFromUrl, NavigationData, LinkData } from "./Link";

export const parseNavigation = (
  navigationItems: NavigationData["links"],
  countryCode: string
): MenuItem[] => {
  return navigationItems.map((navigationItem) => {
    // @ts-ignore I have on idea why, but TS does not understand narrowing the Union here.
    if (navigationItem.links) {
      const { links, label } = navigationItem as NavigationData;
      return {
        label,
        menu: parseNavigation(links, countryCode)
      };
    }

    const {
      label,
      icon: iconName,
      isLabelHidden,
      linkedPage,
      url
    } = navigationItem as LinkData;

    return {
      label,
      icon: iconName ? IconMap[iconName] : undefined,
      isLabelHidden,
      action: getClickableActionFromUrl(linkedPage, url, countryCode)
    };
  });
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
