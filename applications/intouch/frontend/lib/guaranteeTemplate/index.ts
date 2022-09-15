import { gql } from "@apollo/client";

export const GuaranteeTemplateDetailFragment = gql`
  fragment GuaranteeTemplateDetailFragment on GuaranteeTemplate {
    displayName
    technology
    coverage
    languageCode
    languageDescriptor
    approvalMessage {
      event
      #format
      subject
      notificationBody
      emailBody
    }
    rejectionMessage {
      event
      #format
      subject
      notificationBody
      emailBody
    }
    logo {
      title
      url
    }
    maintenanceTemplate {
      fileName
      url
    }
    terms {
      fileName
      url
    }
    guaranteeScope
    signatory
    headingGuarantee
    headingScope
    headingProducts
    headingBeneficiary
    headingBuildingOwnerName
    headingBuildingAddress
    headingRoofArea
    headingRoofType
    headingContractor
    headingContractorName
    headingContractorId
    headingStartDate
    headingGuaranteeId
    headingValidity
    headingExpiry
    footer
    mailSubject
    mailBody
    filenamePrefix
    titleLine1
    titleLine2
    roofType
    onerousConditionsSummary
    onerousConditionsText {
      json
    }
  }
`;

export const getGuaranteeTemplates = gql`
  query getGuaranteeTemplates(
    $technology: String!
    $coverage: String!
    $language: String
    $tag: String!
  ) {
    guaranteeTemplateCollection(
      where: {
        coverage: $coverage
        technology: $technology
        languageCode: $language
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      items {
        sys {
          id
        }
        ...GuaranteeTemplateDetailFragment
      }
    }
  }
`;
