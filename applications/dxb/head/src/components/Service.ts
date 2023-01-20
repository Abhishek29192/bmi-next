import { RoofProLevel } from "@bmi-digital/components";
import { graphql } from "gatsby";
import { Data as ContentfulImageData } from "./Image";
import { Data as ServiceType } from "./ServiceType";

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

export type ServiceTypeFilter = Record<string, boolean>;

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
  websiteLinkAsLabel: boolean | null;
  fax: string | null;
  companyLogo: ContentfulImageData | null;
  serviceTypes: ServiceType[] | null;
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
    websiteLinkAsLabel
    companyLogo {
      ...ImageCardFragment
    }
    fax
    serviceTypes {
      ...ServiceTypeFragment
    }
    certification
    summary
  }
`;
