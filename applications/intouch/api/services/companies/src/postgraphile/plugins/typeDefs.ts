import { gql } from "graphile-utils";

export default gql`
  type Publish {
    title: String
    text: String
    html: String
    email: String
  }

  type ContentfulTerms {
    fileName: String
    url: String
  }
  type ContentfulMaintenanceTemplate {
    fileName: String
    url: String
  }

  type ContentfulLogo {
    title: String
    url: String
  }
  type GuaranteeTemplateItems {
    guaranteeScope: String
    signatory: String
    headingGuarantee: String
    headingScope: String
    headingProducts: String
    headingBeneficiary: String
    headingBuildingOwnerName: String
    headingBuildingAddress: String
    headingRoofArea: String
    headingRoofType: String
    headingContractor: String
    headingContractorName: String
    headingContractorId: String
    headingStartDate: String
    headingGuaranteeId: String
    headingValidity: String
    headingExpiry: String
    footer: String
    terms: ContentfulTerms
    maintenanceTemplate: ContentfulMaintenanceTemplate
    logo: ContentfulLogo
  }
  type GuaranteeTemplatesCollection {
    items: [GuaranteeTemplateItems]
  }
  type ContentfulSignature {
    fileName: String
    url: String
  }
  type ContentfulGuaranteeType {
    name: String
    displayName: String
    technology: String
    coverage: String
    signature: ContentfulSignature
    guaranteeTemplatesCollection: GuaranteeTemplatesCollection
  }
  type PublishOutput {
    messageId: String
  }
  extend type Guarantee {
    guaranteeType: ContentfulGuaranteeType
  }
  extend type Account {
    certifications: [Certification]
  }

  input PublishInput {
    title: String
    text: String
    html: String
    email: String
  }

  extend type Mutation {
    publishMessage(input: PublishInput!): Publish
    createGuaranteePdf(id: Int!): PublishOutput
  }
`;
