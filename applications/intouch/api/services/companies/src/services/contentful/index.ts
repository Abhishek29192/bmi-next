import { fetch } from "cross-fetch";

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
  | "TEAM_JOINED";

export const getGuarantee = async (id: string) => {
  const variables = { id: id };
  const query = `
query guarantee($id:String!) {
  guaranteeType(id:$id) {
    sys {
      id
    }
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
        name
        minimumUploads
      }
    }
    guaranteeTemplatesCollection {
      items {
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
        terms{
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
    }
  }
}`;

  return contentfulHandler(query, variables);
};

export const getEvidenceCategory = async (id: string) => {
  const query = `
query EvidenceCategory($id: String!) {
  evidenceCategory(id: $id) {
    name
    minimumUploads
  }
}`;

  const variables = { id: id };
  return contentfulHandler(query, variables);
};

export const messageTemplate = async (event: EventMessage) => {
  const query = `
  query messageTemplateCollection($event: String!) {
    messageTemplateCollection(where: { event: $event }) {
      items {
        subject
        emailBody
      }
    }
  }`;

  return contentfulHandler(query, { event });
};

const contentfulHandler = async (query: string, variables: Object) => {
  const {
    CONTENTFUL_API_HOST,
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_TOKEN
  } = process.env;

  const CONTENTFUL_SERVICE = `${CONTENTFUL_API_HOST}/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

  const fetchResult = await fetch(CONTENTFUL_SERVICE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CONTENTFUL_TOKEN}`
    },
    body: JSON.stringify({ query, variables })
  });
  return fetchResult.json();
};
