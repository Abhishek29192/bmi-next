import { MainNavigationItem } from "@bmi-digital/components/dist/footer/Footer";
import Footer, {
  MenuItem as FooterMenuItem
} from "@bmi-digital/components/footer";
import HidePrint from "@bmi-digital/components/hide-print";
import { microCopy } from "@bmi/microcopies";
import { isDefined } from "@bmi/utils";
import { Link, graphql } from "gatsby";
import React from "react";
import { getPathWithCountryCode } from "../utils/path";
import Icon from "./Icon";
import { useSiteContext } from "./Site";
import { toAnchorLinkActionProps } from "./link/utils";
import type { NavigationData } from "./link/types";

const parseNavigation = (
  navigationItems: NavigationData["links"],
  countryCode: string
): FooterMenuItem[] => {
  return navigationItems
    .map<FooterMenuItem | undefined>((navigationItem) => {
      if (navigationItem.__typename === "ContentfulLink") {
        const { label, icon, isLabelHidden } = navigationItem;

        const { download, ...actionProps } = toAnchorLinkActionProps(
          navigationItem,
          countryCode
        );
        const iconProps = icon
          ? { icon: <Icon name={icon} />, isLabelHidden }
          : { icon: undefined, isLabelHidden: false };
        return {
          label,
          ...iconProps,
          ...actionProps,
          gtm: {
            id: "nav-footer1",
            action: actionProps.href || `${actionProps.to}`,
            label
          }
        };
      }
      return undefined;
    })
    .filter(isDefined);
};

type Props = {
  mainNavigation: NavigationData | null;
  secondaryNavigation: NavigationData | null;
};

const BmiFooter = ({ mainNavigation, secondaryNavigation }: Props) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const main: MainNavigationItem[] | undefined = mainNavigation?.links
    .map<MainNavigationItem | undefined>((link) => {
      if (link.__typename === "ContentfulNavigation") {
        return {
          subHeading: link.label,
          // TODO: Shouldn't really type cast this, but it will require a
          // massive change in Contentful to be more strict
          menuItems: parseNavigation(link.links, countryCode) as [
            FooterMenuItem,
            ...FooterMenuItem[]
          ]
        };
      }
      return undefined;
    })
    .filter(isDefined);

  const secondary = secondaryNavigation?.links
    ? parseNavigation(secondaryNavigation.links, countryCode)
    : [];

  const sitemapPath = getPathWithCountryCode(countryCode, "sitemap");
  const sitemapLabel = getMicroCopy(microCopy.GLOBAL_SITEMAP);

  secondary.push({
    label: sitemapLabel,
    to: sitemapPath,
    component: Link,
    gtm: {
      id: "nav-footer1",
      action: sitemapPath,
      label: sitemapLabel
    }
  });

  return (
    <HidePrint>
      <Footer
        mainNavigation={main}
        secondaryNavigation={secondary as [FooterMenuItem, ...FooterMenuItem[]]}
      />
    </HidePrint>
  );
};

export default BmiFooter;

export const query = graphql`
  fragment FooterMainNavigationFragment on ContentfulNavigation {
    label
    links {
      __typename
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
