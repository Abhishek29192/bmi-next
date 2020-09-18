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
  menuNavigation: NavigationData;
  menuUtilities: NavigationData;
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

export type TitleWithContent = {
  title: string;
  content: Json;
};

export type TabsOrAccordionSectionData = {
  __typename: string;
  backgroundColor: "pearl" | "white";
  description: null | { description: string };
  items: readonly TitleWithContent[];
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

export type ContactUsPageData = PageData & {
  queriesTitle: string;
  queriesSubtitle: string;
  otherAreasTitle: string;
  otherAreas: readonly TitleWithContent[];
};
