import { gql } from "graphile-utils";

export default gql`
  type Publish {
    title: String
    text: String
    html: String
    email: String
  }

  # TODO refactor Contentful schema out of here
  # Ideal: download directly from Contentful & use their types
  type ContentfulAsset {
    title: String
    description: String
    contentType: String
    fileName: String
    url: String
  }

  enum ContentfulMessageEventType {
    MEMBER_INVITED
    NEWUSER_INVITED
    PROFILE_REMINDER
    ADMIN_INVITED
    ROLE_ASSIGNED
    OWNER_INVITED
    REGISTRATION_CONGRATS
    REGISTRATION_ACTIVATED
    TEAM_JOINED
    CERTIFICATION_EXPIRED
    TIER_ASSIGNED
    REQUEST_REJECTED
    REQUEST_APPROVED
  }

  enum ContentfulMessageFormat {
    EMAIL
    NOTIFICATION
  }

  type ContentfulMessage {
    event: ContentfulMessageEventType
    format: ContentfulMessageFormat
    subject: String
    notificationBody: String
    emailBody: String
  }

  enum ContentfulTechnologyType {
    FLAT
    PITCHED
    OTHER
  }
  enum ContentfulGuaranteeCoverageType {
    PRODUCT
    SYSTEM
    SOLUTION
  }
  enum ContentfulTiers {
    T1
    T2
    T3
    T4
  }

  type ContentfulEvidenceCategory {
    name: String
    description: String
    minimumUploads: Int
  }

  type ContentfulGuaranteeTemplate {
    approvalMessage: ContentfulMessage
    rejectionMessage: ContentfulMessage
    terms: ContentfulAsset
    maintenanceTemplate: ContentfulAsset
    logo: ContentfulAsset
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
    mailBody: String
    filenamePrefix: String
    lockupLine1: String
    lockupLine2: String
    roofType: String
  }
  type ContentfulGuaranteeTemplatesCollection {
    items: [ContentfulGuaranteeTemplate]
  }

  type ContentfulGuaranteeType {
    displayName: String
    technology: ContentfulTechnologyType
    coverage: ContentfulGuaranteeCoverageType
    name: String
    signature: ContentfulAsset
    maximumValidityYears: Int
    tiersAvailable: ContentfulTiers
    ranking: Int
    evidenceCategories: ContentfulEvidenceCategory
    guaranteeTemplatesCollection: ContentfulGuaranteeTemplatesCollection
  }

  type PublishOutput {
    messageId: String
  }
  extend type Guarantee {
    guaranteeType: ContentfulGuaranteeType
  }

  extend input AccountInput {
    marketCode: String
  }

  input PublishInput {
    title: String
    text: String
    html: String
    email: String
  }

  input InviteInput {
    email: String!
    firstName: String!
    lastName: String!
    role: Role!
  }

  input InvitationComplete {
    company_id: String
  }

  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  extend type Mutation {
    publishMessage(input: PublishInput!): Publish
    createGuaranteePdf(id: Int!): PublishOutput
    invite(input: InviteInput!): Invitation
    completeInvitation(companyId: Int!): Account
    uploadData(files: [Upload!]!): [File]
  }
`;
