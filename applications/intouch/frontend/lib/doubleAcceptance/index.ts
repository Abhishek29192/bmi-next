import { gql } from "@apollo/client";

export const doubleAcceptanceFragment = gql`
  fragment DoubleAcceptanceFragment on DoubleAcceptance {
    id
    tempToken
    expiryDate
    guaranteeId
    acceptanceDate
  }
`;

export const getDoubleAcceptanceByValidTempToken = gql`
  mutation getDoubleAcceptanceByValidTempToken(
    $input: GetDoubleAcceptanceByValidTempTokenInput!
  ) {
    getDoubleAcceptanceByValidTempToken(input: $input) {
      id
      tempToken
      expiryDate
      guaranteeId
      acceptanceDate
      maximumValidityYears
      technology
      languageCode
      coverage
    }
  }
`;

export const updateDoubleAcceptance = gql`
  mutation updateDoubleAcceptance($input: UpdateDoubleAcceptanceInput!) {
    updateDoubleAcceptance(input: $input) {
      doubleAcceptance {
        ...DoubleAcceptanceFragment
      }
    }
  }
  ${doubleAcceptanceFragment}
`;

export const releaseGuaranteePdf = gql`
  mutation releaseGuaranteePdf($input: ReleaseGuaranteePdfInput!) {
    releaseGuaranteePdf(input: $input) {
      messageId
    }
  }
`;
