import { Image } from "../../components/types/ProductBaseTypes";

export type GalleryImageType = {
  mainSource: string;
  thumbnail: string;
  altText: string;
};

export type Category = {
  categoryType: string;
  name: string;
  image?: Image;
};

export type Feature = {
  code:
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup"
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent";
  featureValues: { value: string }[];
  name: string;
};

export type Classification = {
  code: "systemAttributes" | "measurementAttributes";
  features: Feature[];
  name: string;
};

export interface SystemDetails {
  type?: string;
  approvalStatus?: string;
  code?: string;
  assets: any[];
  name: string;
  categories: Category[];
  classifications: Classification[];
  images: Image[] | null;
  longDescription?: string;
  shortDescription?: string;
  systemBenefits?: string[];
  systemLayers?: any[];
  systemReferences?: any[];
}
