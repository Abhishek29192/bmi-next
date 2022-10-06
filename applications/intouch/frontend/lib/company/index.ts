import { gql } from "@apollo/client";

export const CONTACT_DETAILS_COLLECTION_FRAGMENT = gql`
  fragment ContactDetailsCollectionFragment on ContactDetailsCollection {
    items {
      fullName
      subHeading
      email
      phoneNumber
    }
  }
`;

export const COMPANY_DETAILS_FRAGMENT = gql`
  fragment CompanyDetailsFragment on Company {
    name
    businessType
    logo
    aboutUs
    tradingAddress {
      id
      ...AddressLinesFragment
      # These are required for the Alert banner
      coordinates {
        x
        y
      }
    }
    ownerFullname
    ownerPhone
    ownerEmail
    phone
    publicEmail
    website
    facebook
    linkedIn
  }
`;

export const CompanyRegisteredDetailsFragment = gql`
  fragment CompanyRegisteredDetailsFragment on Company {
    name
    referenceNumber
    registeredAddress {
      id
      ...AddressLinesFragment
    }
    taxNumber
    tier
    companyOperationsByCompany {
      nodes {
        id
        operation
      }
    }
  }
`;

export const COMPANY_PAGE_DETAILS_FRAGMENT = gql`
  fragment CompanyPageDetailsFragment on Company {
    id
    ...CompanyDetailsFragment
    ...CompanyRegisteredDetailsFragment
    ...CompanyAdminsFragment
    ...CompanyCertifications
    ...CompanyDocumentsFragment
    status
    isProfileComplete
  }
`;

export const GET_COMPANIES_BY_MARKET = gql`
  query GetCompaniesByMarket($marketId: Int!, $tag: String!) {
    companies(condition: { marketId: $marketId }) {
      nodes {
        ...CompanyPageDetailsFragment
        updatedAt
      }
    }
    contactDetailsCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      ...ContactDetailsCollectionFragment
    }
  }
`;

export const GET_COMPANY_PAGE = gql`
  query GetCompany($companyId: Int!, $tag: String!) {
    company(id: $companyId) {
      ...CompanyPageDetailsFragment
    }
    contactDetailsCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      ...ContactDetailsCollectionFragment
    }
  }
`;

export const GET_OPERATION_TYPE_COLLECTION = gql`
  query GetOperationTypeCollection($tag: String!) {
    operationTypeCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      items {
        type
        displayName
      }
    }
  }
`;
