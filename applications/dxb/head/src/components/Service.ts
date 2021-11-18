import { graphql } from "gatsby";
import { RoofProLevel } from "@bmi/company-details";

export type ServiceType = RooferTypesEnum | BranchTypesEnum | MerchantTypesEnum;

export enum RooferTypesEnum {
  PITCHED_ROOF = "Pitched roof",
  FLAT_ROOF = "Flat roof",
  PITCHED_ROOF_BITUMEN_ROOFS = "Pitched roof - Bitumen roofs",
  PITCHED_ROOF_TILE_ROOFS = "Pitched roof - Tile roofs",
  PITCHED_ROOF_ROOF_COATERS = "Pitched roof - Roof coaters"
}

export const rooferTypes = [
  RooferTypesEnum.PITCHED_ROOF,
  RooferTypesEnum.FLAT_ROOF,
  RooferTypesEnum.PITCHED_ROOF_BITUMEN_ROOFS,
  RooferTypesEnum.PITCHED_ROOF_TILE_ROOFS,
  RooferTypesEnum.PITCHED_ROOF_ROOF_COATERS,
  RooferTypesEnum.PITCHED_ROOF_ROOF_COATERS
];

export enum BranchTypesEnum {
  HEADQUARTERS = "Headquarters",
  COUNTRY_OFFICES = "Country offices",
  MANUFACTURING_AND_EXPORT = "Manufacturing and export",
  TECHNICAL_CENTRE_BMI_ACADEMY = "Technical centre & BMI academy"
}

export const branchTypes = [
  BranchTypesEnum.HEADQUARTERS,
  BranchTypesEnum.COUNTRY_OFFICES,
  BranchTypesEnum.MANUFACTURING_AND_EXPORT,
  BranchTypesEnum.TECHNICAL_CENTRE_BMI_ACADEMY
];

export enum MerchantTypesEnum {
  BMI_REDLAND_PITCHED_ROOF_SYSTEMS = "BMI Redland Pitched roof systems",
  BMI_ICOPAL_FLAT_ROOF_SYSTEMS = "BMI Icopal Flat roof Systems",
  DEPOTS_DE_PROXIMITE_SIPLAST = "Dépôts de proximité Siplast",
  DISTRIBUTEURS_SIPLAST = "Distributeurs Siplast",
  DISTRIBUTEURS_MONIER = "Distributeurs Monier",
  FLACHDACHSYSTEME = "Flachdachsysteme",
  STEILDACHSYSTEME = "Steildachsysteme",
  BAUWERKSABDICHTUNG = "Bauwerksabdichtung",
  VERKEHRSBAUWERKE = "Verkehrsbauwerke",
  VERARBEITER = "Verarbeiter",
  TOPDACH_PARTNER = "TopDach Partner",
  DACHDECKER_7 = "7° Dachdecker",
  HANDLER = "Händler"
}

export const merchantTypes = [
  MerchantTypesEnum.BMI_REDLAND_PITCHED_ROOF_SYSTEMS,
  MerchantTypesEnum.BMI_ICOPAL_FLAT_ROOF_SYSTEMS,
  MerchantTypesEnum.DEPOTS_DE_PROXIMITE_SIPLAST,
  MerchantTypesEnum.DISTRIBUTEURS_SIPLAST,
  MerchantTypesEnum.DISTRIBUTEURS_MONIER,
  MerchantTypesEnum.DISTRIBUTEURS_MONIER,
  MerchantTypesEnum.FLACHDACHSYSTEME,
  MerchantTypesEnum.STEILDACHSYSTEME,
  MerchantTypesEnum.BAUWERKSABDICHTUNG,
  MerchantTypesEnum.VERKEHRSBAUWERKE,
  MerchantTypesEnum.VERARBEITER,
  MerchantTypesEnum.TOPDACH_PARTNER,
  MerchantTypesEnum.DACHDECKER_7,
  MerchantTypesEnum.HANDLER
];

export enum EntryTypeEnum {
  ROOFER_TYPE = "Roofer",
  BRANCH_TYPE = "Branch",
  MERCHANT_TYPE = "Merchant"
}

export enum ServiceTypesPrefixesEnum {
  Roofer = "findARoofer",
  Branch = "findABranch",
  Merchant = "findAMerchant"
}

export enum ServiceTypesEnum {
  type = "Roofer",
  branchType = "Branch",
  merchantType = "Merchant"
}

export const serviceTypesByEntity = (entityType: EntryTypeEnum) => {
  switch (entityType) {
    case EntryTypeEnum.ROOFER_TYPE:
      return rooferTypes;
    case EntryTypeEnum.BRANCH_TYPE:
      return branchTypes;
    case EntryTypeEnum.MERCHANT_TYPE:
      return merchantTypes;
    default:
      return [];
  }
};

export type Data = {
  __typename: "ContentfulService";
  id: string;
  entryType: EntryTypeEnum;
  name: string;
  location: {
    lat: number;
    lon: number;
  };
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  fax: string | null;
  type: RooferTypesEnum[] | null;
  branchType: BranchTypesEnum[] | null;
  merchantType: MerchantTypesEnum[] | null;
  certification: RoofProLevel | null;
  summary: string | null;
};

export const query = graphql`
  fragment ServiceFragment on ContentfulService {
    __typename
    id
    entryType
    name
    location {
      lat
      lon
    }
    address
    phone
    email
    website
    fax
    type
    branchType
    merchantType
    certification
    summary
  }
`;
