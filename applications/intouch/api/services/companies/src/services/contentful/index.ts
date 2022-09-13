import {
  Tier,
  TierBenefit,
  TierBenefitCollection
} from "@bmi/intouch-api-types";

export type EventMessage =
  | "COMPANY_MEMBER_REMOVED"
  | "COMPANY_REGISTERED"
  | "MEMBER_INVITED"
  | "NEWUSER_INVITED"
  | "NOTE_ADDED"
  | "PROFILE_REMINDER"
  | "ROLE_ASSIGNED"
  | "ACCOUNT_ACTIVATED"
  | "TIER_ASSIGNED"
  | "REQUEST_AUTOMATICALLY_APPROVED"
  | "REQUEST_REJECTED"
  | "REQUEST_APPROVED"
  | "REQUEST_SUBMITTED"
  | "TEAM_JOINED"
  | "ANNUAL_INSPECTION1"
  | "DOUBLE_ACCEPTANCE";

export const getGuaranteeTypeCollection = async (
  client,
  guaranteeReferenceCode: string,
  tag: string
) => {
  const variables = { guaranteeReferenceCode, tag };
  const query = `
  query guaranteeTypes($guaranteeReferenceCode: String!, $tag: String!) {
    guaranteeTypeCollection(
      limit: 1
      where: {
        guaranteeReferenceCode: $guaranteeReferenceCode 
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        } 
      }
    ) {
      total
      items {
        sys {
          id
        }
        guaranteeReferenceCode
        name
        displayName
        technology
        coverage
        signature {
          fileName
          url
        }
        tiersAvailable
        evidenceCategoriesCollection {
          items {
            sys {
              id
            }
            referenceCode
            name
            minimumUploads
            description {
              json
            }
          }
        }
      }
    }
  }
`;

  return client(query, variables);
};

export const getEvidenceCategory = async (
  client,
  referenceCode: string,
  tag: string
) => {
  const query = `
  query EvidenceCategory($referenceCode: String!, $tag: String!) {
    evidenceCategoryCollection(
    limit: 1
    where: { 
      referenceCode: $referenceCode
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
      name
      minimumUploads
    }
  }
}`;

  const variables = { referenceCode: referenceCode, tag };
  return client(query, variables);
};

export const getGuaranteeTemplates = async (
  client,
  technology: string,
  coverage: string,
  language: string,
  tag: string
) => {
  const query = `
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
      total
      items {
        ...GuaranteeTemplateDetailFragment
      }
    }
  }
  ${GUARANTEE_TEMPLATE_DETAIL_FRAGMENT}
  `;

  const variables = { technology, coverage, language, tag };
  return client(query, variables);
};

export const messageTemplate = async (client, event: EventMessage, tag) => {
  const query = `
  query messageTemplateCollection($event: String!, $tag: String!) {
    messageTemplateCollection(
      where: { 
        event: $event
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        } 
      }
    ) {
      items {
        subject
        emailBody
        notificationBody
        format
      }
    }
  }`;

  return client(query, { event, tag });
};

export const GUARANTEE_TEMPLATE_DETAIL_FRAGMENT = `
fragment GuaranteeTemplateDetailFragment on GuaranteeTemplate {
  displayName
  technology
  coverage
  languageCode
  languageDescriptor
  approvalMessage {
    event
    format
    subject
    notificationBody
    emailBody
  }
  rejectionMessage {
    event
    format
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

export const tierBenefit = async (
  client,
  tier: Tier,
  tag
): Promise<TierBenefit> => {
  const query = `
  query tierBenefitCollection($tier: String!, $tag: String!) {
    tierBenefitCollection(
      limit: 1, 
      where: { 
        tier: $tier
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
        name
        tier
        guaranteeValidityOffsetYears
        shortDescription
      }
    }
  }`;

  const {
    data
  }: {
    data: {
      tierBenefitCollection: TierBenefitCollection;
    };
  } = await client(query, { tier, tag });

  return data.tierBenefitCollection.items[0];
};
