Footer is a component that can be split in three different sections: Newsletter, Main Navigation, and Secondary Navigation.

```jsx
import InputBanner from "../input-banner";
import { Facebook, LinkedIn, YouTube, Phone, Mail } from "../icon";
import { BMI as BmiIcon } from "../logo";

const mainNavigation = [
  {
    label: "Get in touch",
    menu: [
      {
        icon: Phone,
        label: "+44 (0) 1234567890",
        action: {
          model: "htmlLink",
          href: "tel:+4401234567890"
        }
      },
      {
        icon: Mail,
        label: "info@bmigroup.com",
        action: {
          model: "htmlLink",
          href: "mailto:info@bmigroup.com"
        }
      },
      {
        icon: Facebook,
        label: "Facebook",
        isLabelHidden: true,
        action: {
          model: "htmlLink",
          href: "https://facebook.com/bmigroup"
        }
      },
      {
        icon: LinkedIn,
        label: "LinkedIn",
        isLabelHidden: true,
        action: {
          model: "htmlLink",
          href: "https://linkedin.com/bmigroup"
        }
      },
      {
        icon: YouTube,
        label: "Youtube",
        isLabelHidden: true,
        action: {
          model: "htmlLink",
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
