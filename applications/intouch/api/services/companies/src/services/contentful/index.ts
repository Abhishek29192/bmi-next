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

export const getGuarantee = async (client, id: string) => {
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

  return client(query, variables);
};

export const getEvidenceCategory = async (client, id: string) => {
  const query = `
query EvidenceCategory($id: String!) {
  evidenceCategory(id: $id) {
    name
    minimumUploads
  }
}`;

  const variables = { id: id };
  return client(query, variables);
};

export const messageTemplate = async (client, event: EventMessage) => {
  const query = `
  query messageTemplateCollection($event: String!) {
    messageTemplateCollection(where: { event: $event }) {
      items {
        subject
        emailBody
      }
    }
  }`;

  return client(query, { event });
};
