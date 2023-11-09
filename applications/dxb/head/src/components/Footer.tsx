import {
  Button,
  ButtonProps,
  Footer,
  FooterMenuItem,
  HidePrint
} from "@bmi-digital/components";
import BmiIcon from "@bmi-digital/components/logo/Bmi";
import { graphql } from "gatsby";
import React from "react";
import { microCopy } from "@bmi/microcopies";
import { useConfig } from "../contexts/ConfigProvider";
import withGTM from "../utils/google-tag-manager";
import Icon from "./Icon";
import {
  Data as LinkData,
  NavigationData,
  getClickableActionFromUrl
} from "./Link";
import { useSiteContext } from "./Site";

const parseNavigation = (
  navigationItems: NavigationData["links"],
  countryCode: string
): FooterMenuItem[] => {
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
      icon: iconName && <Icon name={iconName} />,
      isLabelHidden,
      action: getClickableActionFromUrl(
        linkedPage,
        url,
        countryCode,
        undefined,
        label
      )
    };
  });
};

type Props = {
  mainNavigation: NavigationData | null;
  secondaryNavigation: NavigationData | null;
};

const BmiFooter = ({ mainNavigation, secondaryNavigation }: Props) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const { isSpaEnabled } = useConfig();
  const main = isSpaEnabled
    ? []
    : parseNavigation(mainNavigation?.links || [], countryCode);
  const secondary = parseNavigation(
    secondaryNavigation?.links || [],
    countryCode
  );
  const secondaryWithSitemap = [
    ...secondary,
    {
      label: getMicroCopy(microCopy.GLOBAL_SITEMAP),
      action: getClickableActionFromUrl(
        { path: "sitemap" },
        null,
        countryCode,
        undefined,
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
        logo={<BmiIcon />}
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
