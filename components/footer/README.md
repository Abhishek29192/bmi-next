Footer is a component that can be split in three different sections: Newsletter, Main Navigation, and Secondary Navigation.

```jsx
import InputBanner from "@bmi/input-banner";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";
import FacebookIcon from "@bmi/icon/src/svgs/Facebook.svg";
import LinkedInIcon from "@bmi/icon/src/svgs/LinkedIn.svg";
import YouTubeIcon from "@bmi/icon/src/svgs/YouTube.svg";
import BmiIcon from "./src/svgs/BMI.svg";

const mainNavigation = [
  {
    label: "Get in touch",
    menu: [
      {
        icon: PhoneIcon,
        label: "+44 (0) 1234567890",
        url: "tel:+4401234567890"
      },
      {
        icon: MailIcon,
        label: "info@bmigroup.com",
        url: "mailto:info@bmigroup.com"
      },
      {
        icon: FacebookIcon,
        label: "Facebook",
        isLabelHidden: true,
        url: "https://facebook.com/bmigroup"
      },
      {
        icon: LinkedInIcon,
        label: "LinkedIn",
        isLabelHidden: true,
        url: "https://linkedin.com/bmigroup"
      },
      {
        icon: YouTubeIcon,
        label: "Youtube",
        isLabelHidden: true,
        url: "https://youtube.com/bmigroup"
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

<>
  <InputBanner
    title="Sign up for our newsletter"
    description="Get the very latest roofing news, tips, product information and innovations directly from BMI straight to your inbox."
    inputLabel="Email address"
    inputCallToAction="Sign up"
  />
  <Footer
    mainNavigation={mainNavigation}
    secondaryNavigation={secondaryNavigation}
    logo={BmiIcon}
  />
</>;
```