import Button, { ButtonProps } from "@bmi-digital/components/button";
import Footer, {
  MenuItem,
  BMI as BmiIcon
} from "@bmi-digital/components/footer";
import HidePrint from "@bmi-digital/components/hide-print";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import { microCopy } from "../constants/microCopies";
import { iconMap } from "./Icon";
import {
  getClickableActionFromUrl,
  Data as LinkData,
  NavigationData
} from "./Link";
import { useSiteContext } from "./Site";

const parseNavigation = (
  navigationItems: NavigationData["links"],
  countryCode: string
): MenuItem[] => {
  if (!navigationItems) {
    return [];
  }
  return navigationItems.map((navigationItem) => {
    if ("links" in navigationItem && navigationItem.links) {
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
      // eslint-disable-next-line security/detect-object-injection
      icon: iconName ? iconMap[iconName] : undefined,
      isLabelHidden,
      action: getClickableActionFromUrl(
        linkedPage,
        url,
        countryCode,
        null,
        label
      )
    };
  });
};

type Props = {
  mainNavigation: NavigationData;
  secondaryNavigation: NavigationData;
};

const BmiFooter = ({ mainNavigation, secondaryNavigation }: Props) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const main = parseNavigation(mainNavigation?.links, countryCode);
  const secondary = parseNavigation(secondaryNavigation?.links, countryCode);
  const secondaryWithSitemap = [
    ...secondary,
    {
      label: getMicroCopy(microCopy.GLOBAL_SITEMAP),
      action: getClickableActionFromUrl(
        { path: "sitemap" },
        null,
        countryCode,
        null,
        getMicroCopy(microCopy.GLOBAL_SITEMAP)
      )
    }
  ];

  const GTMButton = withGTM<ButtonProps>(Button, {
    label: "children"
  });

  return (
    <HidePrint>
      <Footer
        buttonComponent={(props: ButtonProps) => (
          <GTMButton
            gtm={{
              id: "nav-footer1",
              label: props.accessibilityLabel
                ? props.accessibilityLabel
                : undefined
            }}
            {...props}
          />
        )}
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
