import React from "react";
import Footer from "@bmi/footer";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import YouTubeIcon from "@material-ui/icons/YouTube";
import { graphql } from "gatsby";
import BmiIcon from "@bmi/footer/src/svgs/BMI.svg";
import { NavigationData } from "../templates/types";

const IconMap = {
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  LinkedIn: LinkedInIcon
};

const parseNavigation = (navigationItems) => {
  return navigationItems.map(
    ({ label, links, icon: iconName, isLabelHidden, page, url }) => {
      return {
        label,
        icon: iconName ? IconMap[iconName] : undefined,
        isLabelHidden,
        url: page ? page.slug : url,
        menu: links ? parseNavigation(links) : undefined
      };
    }
  );
};

type Props = {
  mainNavigation: NavigationData;
  secondaryNavigation: NavigationData;
};

const BmiFooter = ({ mainNavigation, secondaryNavigation }: Props) => {
  const main = parseNavigation(mainNavigation.links);
  const secondary = parseNavigation(secondaryNavigation.links);

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
        id
        label
        icon
        isLabelHidden
      }
      ... on ContentfulNavigation {
        label
        links {
          ... on ContentfulLink {
            id
            label
            icon
            isLabelHidden
            url
          }
        }
      }
    }
  }
  fragment FooterSecondaryNavigationFragment on ContentfulNavigation {
    label
    links {
      ... on ContentfulLink {
        id
        label
        icon
        isLabelHidden
        url
      }
    }
  }
`;
