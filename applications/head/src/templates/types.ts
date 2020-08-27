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
  title: string;
  showSignUpBanner?: boolean;
  hero?: HeroData;
  slug?: string;
};
