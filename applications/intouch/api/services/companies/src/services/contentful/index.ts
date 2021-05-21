import { fetch } from "cross-fetch";

const {
  CONTENTFUL_API_HOST,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_TOKEN
} = process.env;

const CONTENTFUL_SERVICE = `${CONTENTFUL_API_HOST}/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

const query = `
query guarantee($id:String!) {
  guaranteeType(id:$id) {
    name
    displayName
    technology
    coverage
    signature {
      fileName
      url
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
        lockupLine1
        lockupLine2
        roofType
      }
    }
  }
}

`;

export const getGuarantee = async (id: string) => {
  const variables = { id: id };
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
