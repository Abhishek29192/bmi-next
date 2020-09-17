import { Document } from "@contentful/rich-text-types";

export type Json = {
  json: Document;
};

export type Site = {
  siteMetadata: Metadata;
};

export type Metadata = {
  title: string;
};

export type LinkData = {
  id: string;
  label: string;
  icon?: string;
  isLabelHidden?: boolean;
  url?: string;
};

export type NavigationData = {
  label?: string;
  links?: LinkData[];
};

export type SiteData = {
  countryCode: string;
  footerMainNavigation: NavigationData;
  footerSecondaryNavigation: NavigationData;
  signUpTitle: string;
  signUpDescription: {
    signUpDescription: string;
  };
  signUpInputLabel: string;
  signUpCallToAction: string;
};

export type HeroData = {
  title: string;
  subtitle?: {
    subtitle: string;
  };
  image?: {
    title: string;
    file: {
      fileName: string;
      url: string;
    };
  };
};

export type PageData = {
  hero?: HeroData;
  sections: (TabsOrAccordionSectionData | VillainSectionData)[] | null;
  showSignUpBanner?: boolean;
  slug?: string;
  title: string;
};

export type TabsOrAccordionSectionItemData = {
  title: string;
  content: { json: Document };
};

export type TabsOrAccordionSectionData = {
  __typename: string;
  backgroundColor: "pearl" | "white";
  description: string;
  items: TabsOrAccordionSectionItemData[];
  title: string;
  type: "Accordion" | "Tabs";
};

export type VillainSectionData = {
  __typename: string;
  backgroundColor: "pearl" | "white";
  title: string;
  hero: HeroData;
  isReversed: boolean;
};
