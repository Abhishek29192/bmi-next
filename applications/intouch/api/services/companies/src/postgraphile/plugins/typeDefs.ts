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
    sys: ContentfulSys!
    name: String
    description: String
    minimumUploads: Int
    referenceCode: String
  }

  type ContentfulGuaranteeTemplate {
    coverage: String
    languageCode: String
    languageDescriptor: String
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
    titleLine1: String
    titleLine2: String
    roofType: String
  }
  type ContentfulGuaranteeTemplatesCollection {
    items: [ContentfulGuaranteeTemplate]
  }
  type ContentfulEvidenceCategoryCollection {
    items: [ContentfulEvidenceCategory]
  }

  type ContentfulGuaranteeType {
    sys: ContentfulSys!
    displayName: String
    technology: ContentfulTechnologyType
    coverage: ContentfulGuaranteeCoverageType
    guaranteeReferenceCode: String
    name: String
    signature: ContentfulAsset
    maximumValidityYears: Int
    tiersAvailable: [ContentfulTiers]
    ranking: Int
    evidenceCategoriesCollection: ContentfulEvidenceCategoryCollection
    guaranteeTemplatesCollection: ContentfulGuaranteeTemplatesCollection
  }

  type ContentfulSys {
    id: String!
  }

  type PublishOutput {
    messageId: String
  }
  extend type Company {
    certifications: [Technology]
  }
  extend type Guarantee {
    guaranteeType: ContentfulGuaranteeType
  }
  extend type EvidenceItem {
    customEvidenceCategory: ContentfulEvidenceCategory
  }
  extend type Account {
    formattedRole: String
    signedPhotoUrl: String
  }

  enum GuaranteeEventType {
    SUBMIT_SOLUTION
    ASSIGN_SOLUTION
    REASSIGN_SOLUTION
    UNASSIGN_SOLUTION
    APPROVE_SOLUTION
    REJECT_SOLUTION
  }
  extend input UpdateGuaranteeInput {
    guaranteeEventType: GuaranteeEventType
  }
  extend input GuaranteeInput {
    guaranteeTypeCoverage: ContentfulGuaranteeCoverageType
  }

  extend input AccountInput {
    marketCode: String
  }
  scalar Upload

  extend input AccountPatch {
    photoUpload: Upload
    shouldRemovePhoto: Boolean
  }

  extend input CompanyPatch {
    logoUpload: Upload
    shouldRemoveLogo: Boolean
  }

  input PublishInput {
    title: String
    text: String
    html: String
    email: String
  }

  input InviteInput {
    emails: [String!]!
    firstName: String
    lastName: String
    personalNote: String
  }

  input InvitationComplete {
    company_id: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  input BulkImportInput {
    files: [Upload!]!
    dryRun: Boolean
  }

  type ImportError {
    ref: String
    message: String
  }

  type ImportOutput {
    systemsToUpdate: [System!]
    systemsToInsert: [System!]
    productsToUpdate: [Product!]
    productsToInsert: [Product!]
    errorSystemsToUpdate: [ImportError!]
    errorSystemsToInsert: [ImportError!]
    errorProductsToUpdate: [ImportError!]
    errorProductsToInsert: [ImportError!]
    errorSystemMembersInsert: [ImportError!]
  }

  extend input EvidenceItemInput {
    attachmentUpload: Upload
  }

  extend type Mutation {
    resetPassword: String
    publishMessage(input: PublishInput!): Publish
    createGuaranteePdf(id: Int!): PublishOutput
    invite(input: InviteInput!): [Invitation]
    completeInvitation(companyId: Int!): Account
    bulkImport(input: BulkImportInput!): ImportOutput
  }
`;
