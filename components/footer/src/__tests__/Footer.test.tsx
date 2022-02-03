import React from "react";
import mediaQuery from "css-mediaquery";
import { render } from "@testing-library/react";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import YouTubeIcon from "@material-ui/icons/YouTube";
import Footer from "../";
import BmiIcon from "../svgs/BMI.svg";

const createMatchMedia = (width?: unknown) => {
  return (query: string): MediaQueryList =>
    ({
      matches: mediaQuery.match(query, { width }),
      addListener: () => {},
      removeListener: () => {}
    } as unknown as MediaQueryList);
};

const mainNavigation = [
  {
    label: "Get in touch",
    menu: [
      {
        icon: PhoneIcon,
        label: "+44 (0) 1234567890",
        action: {
          model: "htmlLink" as const,
          href: "tel:+4401234567890"
        }
      },
      {
        icon: MailIcon,
        label: "info@bmigroup.com",
        action: {
          model: "htmlLink" as const,
          href: "mailto:info@bmigroup.com"
        }
      },
      {
        icon: FacebookIcon,
        label: "Facebook",
        isLabelHidden: true,
        action: {
          model: "htmlLink" as const,
          href: "https://facebook.com/bmigroup"
        }
      },
      {
        icon: LinkedInIcon,
        label: "LinkedIn",
        isLabelHidden: true,
        action: {
          model: "htmlLink" as const,
          href: "https://linkedin.com/bmigroup"
        }
      },
      {
        icon: YouTubeIcon,
        label: "Youtube",
        isLabelHidden: true,
        action: {
          model: "htmlLink" as const,
          href: "https://youtube.com/bmigroup"
        }
      }
    ]
  },
  {
    label: "About BMI",
    menu: [
      {
        label: "Our Story"
      },
      {
        label: "Our Brands"
      },
      {
        label: "Diversity"
      },
      {
        label: "BMI's CSR Statement"
      }
    ]
  },
  {
    label: "Partner program",
    menu: [
      {
        label: "BMI RoofPro"
      },
      {
        label: "Team Icopal"
      },
      {
        label: "Training"
      },
      {
        label: "Brand Central"
      }
    ]
  },
  {
    label: "Careers",
    menu: [
      {
        label: "Career Development"
      },
      {
        label: "Diversity"
      }
    ]
  }
];

const secondaryNavigation = [
  {
    label: "Legal"
  },
  {
    label: "Imprint"
  },
  {
    label: "UK Tax Strategy"
  },
  {
    label: "UK Modern Slavery Act"
  },
  {
    label: "Cookie Policy"
  },
  {
    label: "Priority Notice"
  },
  {
    label: "Sitemap"
  }
];

describe("Footer component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Footer
        mainNavigation={mainNavigation}
        secondaryNavigation={secondaryNavigation}
        logo={BmiIcon}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders in a bigger breakpoint", () => {
    window.matchMedia = createMatchMedia(1280);

    const { container } = render(
      <Footer
        mainNavigation={mainNavigation}
        secondaryNavigation={secondaryNavigation}
        logo={BmiIcon}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
