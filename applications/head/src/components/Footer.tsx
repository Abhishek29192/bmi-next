import React, { useContext } from "react";
import { graphql } from "gatsby";
import Footer, { MenuItem } from "@bmi/footer";
import HidePrint from "@bmi/hide-print";
import BmiIcon from "@bmi/footer/src/svgs/BMI.svg";
import { iconMap } from "./Icon";
import { getClickableActionFromUrl, NavigationData, LinkData } from "./Link";
import { SiteContext } from "./Site";

const parseNavigation = (
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
      icon: iconName ? iconMap[iconName] : undefined,
      isLabelHidden,
      action: getClickableActionFromUrl(linkedPage, url, countryCode)
    };
  });
};

type Props = {
  mainNavigation: NavigationData;
  secondaryNavigation: NavigationData;
};

const BmiFooter = ({ mainNavigation, secondaryNavigation }: Props) => {
  const { countryCode, getMicroCopy } = useContext(SiteContext);
  const main = parseNavigation(mainNavigation.links, countryCode);
  const secondary = parseNavigation(secondaryNavigation.links, countryCode);
  const secondaryWithSitemap = [
    ...secondary,
    {
      label: getMicroCopy("global.sitemap"),
      action: getClickableActionFromUrl({ slug: "sitemap" }, null, countryCode)
    }
  ];

  return (
    <HidePrint>
      <Footer
        mainNavigation={main}
        secondaryNavigation={secondaryWithSitemap}
        logo={BmiIcon}
      />
    </HidePrint>
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
