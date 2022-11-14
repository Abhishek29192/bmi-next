import type { Asset, Entry, EntryFields } from "contentful";

export type Brand =
  | "AeroDek"
  | "Awak"
  | "Braas"
  | "Bramac"
  | "Cobert"
  | "Coverland"
  | "Esha"
  | "Everguard"
  | "Everlite"
  | "Icopal"
  | "IcopalKatto"
  | "Klober"
  | "Monarflex"
  | "Monarplan"
  | "Monier"
  | "Necoflex"
  | "Ormax"
  | "Redland"
  | "Sealoflex"
  | "Siplast"
  | "Sunscape"
  | "Vedag"
  | "Villas"
  | "Wierer"
  | "Wolfin"
  | "Zanda";

export type Document = {
  asset: Asset;
  assetType: Entry<AssetType>;
  brand?: Brand;
  description?: EntryFields.RichText;
  featuredMedia?: Entry<Image>;
  noIndex?: boolean;
  title: string;
};

export type AssetType = {
  code: string;
  description?: EntryFields.RichText;
  name: string;
  pimCode?: string;
};

export type Image = {
  altText: string;
  caption?: string;
  focalPoint?: {
    focalPoint?: {
      x: number;
      y: number;
    };
  };
  image: Asset;
  title: string;
  type?: "Decorative" | "Descriptive";
};

export type MicroCopy = any;
export type TitleWithContent = any;
export type ContactUsPage = any;
export type ProductListerPage = any;
export type Promo = any;
export type SimplePage = any;
export type Navigation = any;
export type ShareWidgetSection = any;
export type WelcomeDialogBrand =
  | "AeroDek"
  | "Awak"
  | "Braas"
  | "Bramac"
  | "Cobert"
  | "Coverland"
  | "Esha"
  | "Everguard"
  | "Everlite"
  | "Icopal"
  | "Monarflex"
  | "Monarplan"
  | "Monier"
  | "Necoflex"
  | "Ormax"
  | "Rednalnd"
  | "Sealoflex"
  | "Siplast"
  | "Sunscape"
  | "Vedag"
  | "Villas"
  | "Wiere"
  | "Wolfin"
  | "Zanda";
export type Link = any;
export type SignupBlock = any;
export type SpecificationNotesWithCta = any;

export type Resources = {
  title: string;
  microCopy: Entry<MicroCopy>[];
  pdpSidebarItems: Entry<TitleWithContent>[];
  pdpCardsTitle?: string;
  pdpCards?: Entry<ContactUsPage | ProductListerPage | Promo | SimplePage>[];
  pdpExploreBar?: Entry<Navigation>;
  pdpShareWidget?: Entry<ShareWidgetSection>;
  errorFourOFour?: Entry<Promo>;
  errorGeneral?: Entry<Promo>;
  searchPageSearchTips?: Entry<TitleWithContent>;
  searchPageSidebarItems?: Entry<TitleWithContent>;
  searchPageNextBestActions?: Entry<
    ContactUsPage | ProductListerPage | Promo | SimplePage
  >[];
  searchPageExploreBar?: Entry<Navigation>;
  welcomeDialogTitle?: string;
  welcomeDialogBrands?: WelcomeDialogBrand[];
  welcomeDialogBody?: EntryFields.RichText;
  productDocumentNameMap?: "Document name" | "Product name + asset type";
  visualiserShareWidget?: Entry<ShareWidgetSection>;
  sdpShareWidget?: Entry<ShareWidgetSection>;
  countryNavigationIntroduction: EntryFields.RichText;
  sdpLeadBlockCta?: Entry<Link>;
  sdpSidebarItems?: Entry<TitleWithContent>[];
  sdpBimDescription?: EntryFields.RichText;
  maximumSamples?: number;
  sampleBasketLink?: Entry<SimplePage>;
  keyAssetTypes?: string[];
  pdpFixingToolTitle?: string;
  pdpFixingToolDescription?: EntryFields.RichText;
  pdpSpecificationTitle?: string;
  pdpSpecificationDescription?: EntryFields.RichText;
  documentDisplayFormat: "Asset type" | "Asset name";
  pdpSignupBlock?: Entry<SignupBlock>;
  sdpSpecificationNotesCta?: Entry<SpecificationNotesWithCta>;
  ieDialogTitle?: string;
  ieDialogBody?: EntryFields.RichText;
  ieDialogActionLabel?: string;
  ieDialogActionLink?: string;
};
