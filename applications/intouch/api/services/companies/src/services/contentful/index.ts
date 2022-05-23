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
  | "TEAM_JOINED";

export const getGuaranteeTypeCollection = async (
  client,
  guaranteeReferenceCode: string
) => {
  const variables = { guaranteeReferenceCode };
  const query = `
  query guaranteeTypes($guaranteeReferenceCode: String!) {
    guaranteeTypeCollection(
      limit: 1
      where: { guaranteeReferenceCode: $guaranteeReferenceCode }
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

export const getEvidenceCategory = async (client, referenceCode: string) => {
  const query = `
  query EvidenceCategory($referenceCode: String!) {
    evidenceCategoryCollection(
    limit: 1
    where: { referenceCode: $referenceCode }
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

  const variables = { referenceCode: referenceCode };
  return client(query, variables);
};

export const getGuaranteeTemplates = async (
  client,
  technology: string,
  coverage: string,
  language: string
) => {
  const query = `
   query getGuaranteeTemplates(
    $technology: String!
    $coverage: String!
    $language: String
  ) {
    guaranteeTemplateCollection(
      where: {
        coverage: $coverage
        technology: $technology
        languageCode: $language
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

  const variables = { technology, coverage, language };
  return client(query, variables);
};

export const messageTemplate = async (client, event: EventMessage) => {
  const query = `
  query messageTemplateCollection($event: String!) {
    messageTemplateCollection(where: { event: $event }) {
      items {
        subject
        emailBody
        notificationBody
        format
      }
    }
  }`;

  return client(query, { event });
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
  mailBody
  filenamePrefix
  titleLine1
  titleLine2
  roofType
}

`;

export const tierBenefit = async (client, tier: Tier): Promise<TierBenefit> => {
  const query = `
  query tierBenefitCollection($tier: String!) {
    tierBenefitCollection(limit: 1, where: { tier: $tier }) {
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
  } = await client(query, { tier });

  return data.tierBenefitCollection.items[0];
};
