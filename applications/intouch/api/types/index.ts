export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: any;
  _Any: any;
  /**
   * Used to represent a set of fields. Grammatically, a field set is a
   * selection set minus the braces.
   */
  _FieldSet: any;
};

/** An InTouch account */
export type Account = Node & {
  __typename?: "Account";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** ek */
  status?: Maybe<AccountStatus>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  role?: Maybe<Role>;
  /** The mail address associated with the account */
  email?: Maybe<Scalars["String"]>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: Maybe<Scalars["String"]>;
  /** First name */
  firstName?: Maybe<Scalars["String"]>;
  /** Last name */
  lastName?: Maybe<Scalars["String"]>;
  /** When the account was created */
  created?: Maybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: Maybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** Reads and enables pagination through a set of `Certification`. */
  certificationsByDoceboUserId: CertificationsConnection;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMembersConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByRequestorAccountId: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByResponsibleInstallerAccountId: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByReviewerAccountId: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Invitation`. */
  invitationsBySenderAccountId: InvitationsConnection;
  /** Reads and enables pagination through a set of `Note`. */
  authoredNotes: NotesConnection;
  /** Reads and enables pagination through a set of `Notification`. */
  notifications: NotificationsConnection;
  /** Reads and enables pagination through a set of `ProjectMember`. */
  projectMembers: ProjectMembersConnection;
};

/** An InTouch account */
export type AccountCertificationsByDoceboUserIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CertificationsOrderBy>>;
  condition?: Maybe<CertificationCondition>;
};

/** An InTouch account */
export type AccountCompanyMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
  condition?: Maybe<CompanyMemberCondition>;
};

/** An InTouch account */
export type AccountGuaranteesByRequestorAccountIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

/** An InTouch account */
export type AccountGuaranteesByResponsibleInstallerAccountIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

/** An InTouch account */
export type AccountGuaranteesByReviewerAccountIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

/** An InTouch account */
export type AccountInvitationsBySenderAccountIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
  condition?: Maybe<InvitationCondition>;
};

/** An InTouch account */
export type AccountAuthoredNotesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotesOrderBy>>;
  condition?: Maybe<NoteCondition>;
};

/** An InTouch account */
export type AccountNotificationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
};

/** An InTouch account */
export type AccountProjectMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectMembersOrderBy>>;
  condition?: Maybe<ProjectMemberCondition>;
};

/** A condition to be used against `Account` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AccountCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `doceboUserId` field. */
  doceboUserId?: Maybe<Scalars["Int"]>;
};

/** Represents an update to a `Account`. Fields that are set will be updated. */
export type AccountPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** ek */
  status?: Maybe<AccountStatus>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  role?: Maybe<Role>;
  /** The mail address associated with the account */
  email?: Maybe<Scalars["String"]>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: Maybe<Scalars["String"]>;
  /** First name */
  firstName?: Maybe<Scalars["String"]>;
  /** Last name */
  lastName?: Maybe<Scalars["String"]>;
  /** When the account was created */
  created?: Maybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: Maybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

export enum AccountStatus {
  New = "NEW",
  Active = "ACTIVE",
  Suspended = "SUSPENDED"
}

/** A connection to a list of `Account` values. */
export type AccountsConnection = {
  __typename?: "AccountsConnection";
  /** A list of `Account` objects. */
  nodes: Array<Account>;
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: Array<AccountsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Account` edge in the connection. */
export type AccountsEdge = {
  __typename?: "AccountsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Account` at the end of the edge. */
  node: Account;
};

/** Methods to use when ordering `Account`. */
export enum AccountsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  MarketIdAsc = "MARKET_ID_ASC",
  MarketIdDesc = "MARKET_ID_DESC",
  DoceboUserIdAsc = "DOCEBO_USER_ID_ASC",
  DoceboUserIdDesc = "DOCEBO_USER_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** A generic address */
export type Address = Node & {
  __typename?: "Address";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  addressType?: Maybe<AddressType>;
  /** First line of this address */
  firstLine?: Maybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: Maybe<Scalars["String"]>;
  /** The postal town */
  town?: Maybe<Scalars["String"]>;
  /** The country for this address */
  country?: Maybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Project` that is related to this `Address`. */
  project?: Maybe<Project>;
  /** Reads a single `Company` that is related to this `Address`. */
  company?: Maybe<Company>;
};

/** A condition to be used against `Address` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AddressCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Address` */
export type AddressInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  addressType?: Maybe<AddressType>;
  /** First line of this address */
  firstLine?: Maybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: Maybe<Scalars["String"]>;
  /** The postal town */
  town?: Maybe<Scalars["String"]>;
  /** The country for this address */
  country?: Maybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Address`. Fields that are set will be updated. */
export type AddressPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  addressType?: Maybe<AddressType>;
  /** First line of this address */
  firstLine?: Maybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: Maybe<Scalars["String"]>;
  /** The postal town */
  town?: Maybe<Scalars["String"]>;
  /** The country for this address */
  country?: Maybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

export enum AddressType {
  Registered = "REGISTERED",
  Trading = "TRADING",
  BuildingOwner = "BUILDING_OWNER",
  Site = "SITE"
}

/** A connection to a list of `Address` values. */
export type AddressesConnection = {
  __typename?: "AddressesConnection";
  /** A list of `Address` objects. */
  nodes: Array<Address>;
  /** A list of edges which contains the `Address` and cursor to aid in pagination. */
  edges: Array<AddressesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Address` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Address` edge in the connection. */
export type AddressesEdge = {
  __typename?: "AddressesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Address` at the end of the edge. */
  node: Address;
};

/** Methods to use when ordering `Address`. */
export enum AddressesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  ProjectIdAsc = "PROJECT_ID_ASC",
  ProjectIdDesc = "PROJECT_ID_DESC",
  CompanyIdAsc = "COMPANY_ID_ASC",
  CompanyIdDesc = "COMPANY_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum BusinessType {
  Contractor = "CONTRACTOR",
  Architect = "ARCHITECT",
  Merchant = "MERCHANT",
  CorpDeveloper = "CORP_DEVELOPER"
}

/** A company that has been registered in InTouch */
export type Certification = Node & {
  __typename?: "Certification";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  doceboUserId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** The name of the certification according to Docebo */
  name?: Maybe<Scalars["String"]>;
  /** The last day that this certification is valid */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Certification`. */
  doceboUser?: Maybe<Account>;
};

/**
 * A condition to be used against `Certification` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CertificationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `doceboUserId` field. */
  doceboUserId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Certification` */
export type CertificationInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  doceboUserId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** The name of the certification according to Docebo */
  name?: Maybe<Scalars["String"]>;
  /** The last day that this certification is valid */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Certification`. Fields that are set will be updated. */
export type CertificationPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  doceboUserId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** The name of the certification according to Docebo */
  name?: Maybe<Scalars["String"]>;
  /** The last day that this certification is valid */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Certification` values. */
export type CertificationsConnection = {
  __typename?: "CertificationsConnection";
  /** A list of `Certification` objects. */
  nodes: Array<Certification>;
  /** A list of edges which contains the `Certification` and cursor to aid in pagination. */
  edges: Array<CertificationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Certification` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Certification` edge in the connection. */
export type CertificationsEdge = {
  __typename?: "CertificationsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Certification` at the end of the edge. */
  node: Certification;
};

/** Methods to use when ordering `Certification`. */
export enum CertificationsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  DoceboUserIdAsc = "DOCEBO_USER_ID_ASC",
  DoceboUserIdDesc = "DOCEBO_USER_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** A connection to a list of `Company` values. */
export type CompaniesConnection = {
  __typename?: "CompaniesConnection";
  /** A list of `Company` objects. */
  nodes: Array<Company>;
  /** A list of edges which contains the `Company` and cursor to aid in pagination. */
  edges: Array<CompaniesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Company` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Company` edge in the connection. */
export type CompaniesEdge = {
  __typename?: "CompaniesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Company` at the end of the edge. */
  node: Company;
};

/** Methods to use when ordering `Company`. */
export enum CompaniesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  MarketIdAsc = "MARKET_ID_ASC",
  MarketIdDesc = "MARKET_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** A company that has been registered in InTouch */
export type Company = Node & {
  __typename?: "Company";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** the name of the owner of the Company */
  ownerFullname?: Maybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: Maybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: Maybe<Scalars["String"]>;
  /** ek */
  businessType?: Maybe<BusinessType>;
  /** ek */
  tier?: Maybe<Tier>;
  /** ek */
  status?: Maybe<CompanyStatus>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: Maybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: Maybe<Scalars["Datetime"]>;
  /** The Group ID of the company in Docebo */
  doceboGroupId?: Maybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: Maybe<Scalars["String"]>;
  /** The Tax number in that number, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** They Companys public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** The companys GoogleMap address */
  coordinates?: Maybe<Point>;
  /** A bit of blurb to appear in Find a contractor */
  aboutUs?: Maybe<Scalars["String"]>;
  /** The email address that they can be contacted with by the public assuming they are listed. */
  publicEmail?: Maybe<Scalars["String"]>;
  /** The Company website URL */
  website?: Maybe<Scalars["String"]>;
  /** The Company facebook website */
  facebook?: Maybe<Scalars["String"]>;
  /** Their Company LinkedIn page URL */
  linkedIn?: Maybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: Maybe<Scalars["String"]>;
  /** A reference to the logo */
  logo?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** Reads and enables pagination through a set of `Address`. */
  addresses: AddressesConnection;
  /** Reads and enables pagination through a set of `CompanyDocument`. */
  companyDocuments: CompanyDocumentsConnection;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMembersConnection;
  /** Reads and enables pagination through a set of `CompanyOperation`. */
  companyOperationsByCompany: CompanyOperationsConnection;
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations: InvitationsConnection;
  /** Reads and enables pagination through a set of `Project`. */
  projects: ProjectsConnection;
};

/** A company that has been registered in InTouch */
export type CompanyAddressesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AddressesOrderBy>>;
  condition?: Maybe<AddressCondition>;
};

/** A company that has been registered in InTouch */
export type CompanyCompanyDocumentsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyDocumentsOrderBy>>;
  condition?: Maybe<CompanyDocumentCondition>;
};

/** A company that has been registered in InTouch */
export type CompanyCompanyMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
  condition?: Maybe<CompanyMemberCondition>;
};

/** A company that has been registered in InTouch */
export type CompanyCompanyOperationsByCompanyArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyOperationsOrderBy>>;
  condition?: Maybe<CompanyOperationCondition>;
};

/** A company that has been registered in InTouch */
export type CompanyInvitationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
  condition?: Maybe<InvitationCondition>;
};

/** A company that has been registered in InTouch */
export type CompanyProjectsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
  condition?: Maybe<ProjectCondition>;
};

/** A condition to be used against `Company` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CompanyCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: Maybe<Scalars["Int"]>;
};

/** A document uploaded by the Company to InTouch that appears on their Company Profile, for example an insurance certificate */
export type CompanyDocument = Node & {
  __typename?: "CompanyDocument";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
};

/**
 * A condition to be used against `CompanyDocument` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanyDocumentCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CompanyDocument` */
export type CompanyDocumentInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CompanyDocument`. Fields that are set will be updated. */
export type CompanyDocumentPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CompanyDocument` values. */
export type CompanyDocumentsConnection = {
  __typename?: "CompanyDocumentsConnection";
  /** A list of `CompanyDocument` objects. */
  nodes: Array<CompanyDocument>;
  /** A list of edges which contains the `CompanyDocument` and cursor to aid in pagination. */
  edges: Array<CompanyDocumentsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CompanyDocument` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CompanyDocument` edge in the connection. */
export type CompanyDocumentsEdge = {
  __typename?: "CompanyDocumentsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CompanyDocument` at the end of the edge. */
  node: CompanyDocument;
};

/** Methods to use when ordering `CompanyDocument`. */
export enum CompanyDocumentsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CompanyIdAsc = "COMPANY_ID_ASC",
  CompanyIdDesc = "COMPANY_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** An input for mutations affecting `Company` */
export type CompanyInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** the name of the owner of the Company */
  ownerFullname?: Maybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: Maybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: Maybe<Scalars["String"]>;
  /** ek */
  businessType?: Maybe<BusinessType>;
  /** ek */
  tier?: Maybe<Tier>;
  /** ek */
  status?: Maybe<CompanyStatus>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: Maybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: Maybe<Scalars["Datetime"]>;
  /** The Group ID of the company in Docebo */
  doceboGroupId?: Maybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: Maybe<Scalars["String"]>;
  /** The Tax number in that number, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** They Companys public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** The companys GoogleMap address */
  coordinates?: Maybe<PointInput>;
  /** A bit of blurb to appear in Find a contractor */
  aboutUs?: Maybe<Scalars["String"]>;
  /** The email address that they can be contacted with by the public assuming they are listed. */
  publicEmail?: Maybe<Scalars["String"]>;
  /** The Company website URL */
  website?: Maybe<Scalars["String"]>;
  /** The Company facebook website */
  facebook?: Maybe<Scalars["String"]>;
  /** Their Company LinkedIn page URL */
  linkedIn?: Maybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: Maybe<Scalars["String"]>;
  /** A reference to the logo */
  logo?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection between a user and a company */
export type CompanyMember = Node & {
  __typename?: "CompanyMember";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
};

/**
 * A condition to be used against `CompanyMember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanyMemberCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CompanyMember` */
export type CompanyMemberInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CompanyMember`. Fields that are set will be updated. */
export type CompanyMemberPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CompanyMember` values. */
export type CompanyMembersConnection = {
  __typename?: "CompanyMembersConnection";
  /** A list of `CompanyMember` objects. */
  nodes: Array<CompanyMember>;
  /** A list of edges which contains the `CompanyMember` and cursor to aid in pagination. */
  edges: Array<CompanyMembersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CompanyMember` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CompanyMember` edge in the connection. */
export type CompanyMembersEdge = {
  __typename?: "CompanyMembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CompanyMember` at the end of the edge. */
  node: CompanyMember;
};

/** Methods to use when ordering `CompanyMember`. */
export enum CompanyMembersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  MarketIdAsc = "MARKET_ID_ASC",
  MarketIdDesc = "MARKET_ID_DESC",
  AccountIdAsc = "ACCOUNT_ID_ASC",
  AccountIdDesc = "ACCOUNT_ID_DESC",
  CompanyIdAsc = "COMPANY_ID_ASC",
  CompanyIdDesc = "COMPANY_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** The assignment of an operation type to a Company by the Market Admin.  A Company can be assigned multiple types from the allowed enums list.  The operation types that a Company has are sent to Find a Roofer. */
export type CompanyOperation = Node & {
  __typename?: "CompanyOperation";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  company?: Maybe<Scalars["Int"]>;
  /** ek */
  operation?: Maybe<Operation>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Company` that is related to this `CompanyOperation`. */
  companyByCompany?: Maybe<Company>;
};

/**
 * A condition to be used against `CompanyOperation` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanyOperationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `company` field. */
  company?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CompanyOperation` */
export type CompanyOperationInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
  /** ek */
  operation?: Maybe<Operation>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CompanyOperation`. Fields that are set will be updated. */
export type CompanyOperationPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
  /** ek */
  operation?: Maybe<Operation>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CompanyOperation` values. */
export type CompanyOperationsConnection = {
  __typename?: "CompanyOperationsConnection";
  /** A list of `CompanyOperation` objects. */
  nodes: Array<CompanyOperation>;
  /** A list of edges which contains the `CompanyOperation` and cursor to aid in pagination. */
  edges: Array<CompanyOperationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CompanyOperation` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CompanyOperation` edge in the connection. */
export type CompanyOperationsEdge = {
  __typename?: "CompanyOperationsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CompanyOperation` at the end of the edge. */
  node: CompanyOperation;
};

/** Methods to use when ordering `CompanyOperation`. */
export enum CompanyOperationsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CompanyAsc = "COMPANY_ASC",
  CompanyDesc = "COMPANY_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** Represents an update to a `Company`. Fields that are set will be updated. */
export type CompanyPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** the name of the owner of the Company */
  ownerFullname?: Maybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: Maybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: Maybe<Scalars["String"]>;
  /** ek */
  businessType?: Maybe<BusinessType>;
  /** ek */
  tier?: Maybe<Tier>;
  /** ek */
  status?: Maybe<CompanyStatus>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: Maybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: Maybe<Scalars["Datetime"]>;
  /** The Group ID of the company in Docebo */
  doceboGroupId?: Maybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: Maybe<Scalars["String"]>;
  /** The Tax number in that number, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** They Companys public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** The companys GoogleMap address */
  coordinates?: Maybe<PointInput>;
  /** A bit of blurb to appear in Find a contractor */
  aboutUs?: Maybe<Scalars["String"]>;
  /** The email address that they can be contacted with by the public assuming they are listed. */
  publicEmail?: Maybe<Scalars["String"]>;
  /** The Company website URL */
  website?: Maybe<Scalars["String"]>;
  /** The Company facebook website */
  facebook?: Maybe<Scalars["String"]>;
  /** Their Company LinkedIn page URL */
  linkedIn?: Maybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: Maybe<Scalars["String"]>;
  /** A reference to the logo */
  logo?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

export enum CompanyStatus {
  New = "NEW",
  Active = "ACTIVE",
  Deactivated = "DEACTIVATED"
}

export type ContentfulAsset = {
  __typename?: "ContentfulAsset";
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  contentType?: Maybe<Scalars["String"]>;
  fileName?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

export type ContentfulEvidenceCategory = {
  __typename?: "ContentfulEvidenceCategory";
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  minimumUploads?: Maybe<Scalars["Int"]>;
};

export enum ContentfulGuaranteeCoverageType {
  Product = "PRODUCT",
  System = "SYSTEM",
  Solution = "SOLUTION"
}

export type ContentfulGuaranteeTemplate = {
  __typename?: "ContentfulGuaranteeTemplate";
  approvalMessage?: Maybe<ContentfulMessage>;
  rejectionMessage?: Maybe<ContentfulMessage>;
  terms?: Maybe<ContentfulAsset>;
  maintenanceTemplate?: Maybe<ContentfulAsset>;
  logo?: Maybe<ContentfulAsset>;
  guaranteeScope?: Maybe<Scalars["String"]>;
  signatory?: Maybe<Scalars["String"]>;
  headingGuarantee?: Maybe<Scalars["String"]>;
  headingScope?: Maybe<Scalars["String"]>;
  headingProducts?: Maybe<Scalars["String"]>;
  headingBeneficiary?: Maybe<Scalars["String"]>;
  headingBuildingOwnerName?: Maybe<Scalars["String"]>;
  headingBuildingAddress?: Maybe<Scalars["String"]>;
  headingRoofArea?: Maybe<Scalars["String"]>;
  headingRoofType?: Maybe<Scalars["String"]>;
  headingContractor?: Maybe<Scalars["String"]>;
  headingContractorName?: Maybe<Scalars["String"]>;
  headingContractorId?: Maybe<Scalars["String"]>;
  headingStartDate?: Maybe<Scalars["String"]>;
  headingGuaranteeId?: Maybe<Scalars["String"]>;
  headingValidity?: Maybe<Scalars["String"]>;
  headingExpiry?: Maybe<Scalars["String"]>;
  footer?: Maybe<Scalars["String"]>;
  mailBody?: Maybe<Scalars["String"]>;
  filenamePrefix?: Maybe<Scalars["String"]>;
  lockupLine1?: Maybe<Scalars["String"]>;
  lockupLine2?: Maybe<Scalars["String"]>;
  roofType?: Maybe<Scalars["String"]>;
};

export type ContentfulGuaranteeTemplatesCollection = {
  __typename?: "ContentfulGuaranteeTemplatesCollection";
  items?: Maybe<Array<Maybe<ContentfulGuaranteeTemplate>>>;
};

export type ContentfulGuaranteeType = {
  __typename?: "ContentfulGuaranteeType";
  displayName?: Maybe<Scalars["String"]>;
  technology?: Maybe<ContentfulTechnologyType>;
  coverage?: Maybe<ContentfulGuaranteeCoverageType>;
  name?: Maybe<Scalars["String"]>;
  signature?: Maybe<ContentfulAsset>;
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  tiersAvailable?: Maybe<ContentfulTiers>;
  ranking?: Maybe<Scalars["Int"]>;
  evidenceCategories?: Maybe<ContentfulEvidenceCategory>;
  guaranteeTemplatesCollection?: Maybe<ContentfulGuaranteeTemplatesCollection>;
};

export type ContentfulMessage = {
  __typename?: "ContentfulMessage";
  event?: Maybe<ContentfulMessageEventType>;
  format?: Maybe<ContentfulMessageFormat>;
  subject?: Maybe<Scalars["String"]>;
  notificationBody?: Maybe<Scalars["String"]>;
  emailBody?: Maybe<Scalars["String"]>;
};

export enum ContentfulMessageEventType {
  MemberInvited = "MEMBER_INVITED",
  NewuserInvited = "NEWUSER_INVITED",
  ProfileReminder = "PROFILE_REMINDER",
  AdminInvited = "ADMIN_INVITED",
  RoleAssigned = "ROLE_ASSIGNED",
  OwnerInvited = "OWNER_INVITED",
  RegistrationCongrats = "REGISTRATION_CONGRATS",
  RegistrationActivated = "REGISTRATION_ACTIVATED",
  TeamJoined = "TEAM_JOINED",
  CertificationExpired = "CERTIFICATION_EXPIRED",
  TierAssigned = "TIER_ASSIGNED",
  RequestRejected = "REQUEST_REJECTED",
  RequestApproved = "REQUEST_APPROVED"
}

export enum ContentfulMessageFormat {
  Email = "EMAIL",
  Notification = "NOTIFICATION"
}

export enum ContentfulTechnologyType {
  Flat = "FLAT",
  Pitched = "PITCHED",
  Other = "OTHER"
}

export enum ContentfulTiers {
  T1 = "T1",
  T2 = "T2",
  T3 = "T3",
  T4 = "T4"
}

/** All input for the `createAccount` mutation. */
export type CreateAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  marketCode?: Maybe<Scalars["String"]>;
  role?: Maybe<Role>;
};

/** The output of our `createAccount` mutation. */
export type CreateAccountPayload = {
  __typename?: "CreateAccountPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  account?: Maybe<Account>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
};

/** The output of our `createAccount` mutation. */
export type CreateAccountPayloadAccountEdgeArgs = {
  orderBy?: Maybe<Array<AccountsOrderBy>>;
};

/** All input for the create `Address` mutation. */
export type CreateAddressInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Address` to be created by this mutation. */
  address: AddressInput;
};

/** The output of our create `Address` mutation. */
export type CreateAddressPayload = {
  __typename?: "CreateAddressPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Address` that was created by this mutation. */
  address?: Maybe<Address>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Project` that is related to this `Address`. */
  project?: Maybe<Project>;
  /** Reads a single `Company` that is related to this `Address`. */
  company?: Maybe<Company>;
  /** An edge for our `Address`. May be used by Relay 1. */
  addressEdge?: Maybe<AddressesEdge>;
};

/** The output of our create `Address` mutation. */
export type CreateAddressPayloadAddressEdgeArgs = {
  orderBy?: Maybe<Array<AddressesOrderBy>>;
};

/** All input for the create `Certification` mutation. */
export type CreateCertificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Certification` to be created by this mutation. */
  certification: CertificationInput;
};

/** The output of our create `Certification` mutation. */
export type CreateCertificationPayload = {
  __typename?: "CreateCertificationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Certification` that was created by this mutation. */
  certification?: Maybe<Certification>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Certification`. */
  doceboUser?: Maybe<Account>;
  /** An edge for our `Certification`. May be used by Relay 1. */
  certificationEdge?: Maybe<CertificationsEdge>;
};

/** The output of our create `Certification` mutation. */
export type CreateCertificationPayloadCertificationEdgeArgs = {
  orderBy?: Maybe<Array<CertificationsOrderBy>>;
};

/** All input for the create `CompanyDocument` mutation. */
export type CreateCompanyDocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyDocument` to be created by this mutation. */
  companyDocument: CompanyDocumentInput;
};

/** The output of our create `CompanyDocument` mutation. */
export type CreateCompanyDocumentPayload = {
  __typename?: "CreateCompanyDocumentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyDocument` that was created by this mutation. */
  companyDocument?: Maybe<CompanyDocument>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
  /** An edge for our `CompanyDocument`. May be used by Relay 1. */
  companyDocumentEdge?: Maybe<CompanyDocumentsEdge>;
};

/** The output of our create `CompanyDocument` mutation. */
export type CreateCompanyDocumentPayloadCompanyDocumentEdgeArgs = {
  orderBy?: Maybe<Array<CompanyDocumentsOrderBy>>;
};

/** All input for the create `Company` mutation. */
export type CreateCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Company` to be created by this mutation. */
  company: CompanyInput;
};

/** All input for the create `CompanyMember` mutation. */
export type CreateCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyMember` to be created by this mutation. */
  companyMember: CompanyMemberInput;
};

/** The output of our create `CompanyMember` mutation. */
export type CreateCompanyMemberPayload = {
  __typename?: "CreateCompanyMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyMember` that was created by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMembersEdge>;
};

/** The output of our create `CompanyMember` mutation. */
export type CreateCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
};

/** All input for the create `CompanyOperation` mutation. */
export type CreateCompanyOperationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyOperation` to be created by this mutation. */
  companyOperation: CompanyOperationInput;
};

/** The output of our create `CompanyOperation` mutation. */
export type CreateCompanyOperationPayload = {
  __typename?: "CreateCompanyOperationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyOperation` that was created by this mutation. */
  companyOperation?: Maybe<CompanyOperation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `CompanyOperation`. */
  companyByCompany?: Maybe<Company>;
  /** An edge for our `CompanyOperation`. May be used by Relay 1. */
  companyOperationEdge?: Maybe<CompanyOperationsEdge>;
};

/** The output of our create `CompanyOperation` mutation. */
export type CreateCompanyOperationPayloadCompanyOperationEdgeArgs = {
  orderBy?: Maybe<Array<CompanyOperationsOrderBy>>;
};

/** The output of our create `Company` mutation. */
export type CreateCompanyPayload = {
  __typename?: "CreateCompanyPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Company` that was created by this mutation. */
  company?: Maybe<Company>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
};

/** The output of our create `Company` mutation. */
export type CreateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
};

/** All input for the create `EvidenceItem` mutation. */
export type CreateEvidenceItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `EvidenceItem` to be created by this mutation. */
  evidenceItem: EvidenceItemInput;
};

/** The output of our create `EvidenceItem` mutation. */
export type CreateEvidenceItemPayload = {
  __typename?: "CreateEvidenceItemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `EvidenceItem` that was created by this mutation. */
  evidenceItem?: Maybe<EvidenceItem>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Guarantee` that is related to this `EvidenceItem`. */
  guarantee?: Maybe<Guarantee>;
  /** An edge for our `EvidenceItem`. May be used by Relay 1. */
  evidenceItemEdge?: Maybe<EvidenceItemsEdge>;
};

/** The output of our create `EvidenceItem` mutation. */
export type CreateEvidenceItemPayloadEvidenceItemEdgeArgs = {
  orderBy?: Maybe<Array<EvidenceItemsOrderBy>>;
};

/** All input for the create `Guarantee` mutation. */
export type CreateGuaranteeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Guarantee` to be created by this mutation. */
  guarantee: GuaranteeInput;
};

/** The output of our create `Guarantee` mutation. */
export type CreateGuaranteePayload = {
  __typename?: "CreateGuaranteePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Guarantee` that was created by this mutation. */
  guarantee?: Maybe<Guarantee>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  responsibleInstallerAccount?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  system?: Maybe<System>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
};

/** The output of our create `Guarantee` mutation. */
export type CreateGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
};

/** All input for the create `GuaranteedProduct` mutation. */
export type CreateGuaranteedProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `GuaranteedProduct` to be created by this mutation. */
  guaranteedProduct: GuaranteedProductInput;
};

/** The output of our create `GuaranteedProduct` mutation. */
export type CreateGuaranteedProductPayload = {
  __typename?: "CreateGuaranteedProductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `GuaranteedProduct` that was created by this mutation. */
  guaranteedProduct?: Maybe<GuaranteedProduct>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Product` that is related to this `GuaranteedProduct`. */
  product?: Maybe<Product>;
  /** Reads a single `Guarantee` that is related to this `GuaranteedProduct`. */
  guarantee?: Maybe<Guarantee>;
  /** An edge for our `GuaranteedProduct`. May be used by Relay 1. */
  guaranteedProductEdge?: Maybe<GuaranteedProductsEdge>;
};

/** The output of our create `GuaranteedProduct` mutation. */
export type CreateGuaranteedProductPayloadGuaranteedProductEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteedProductsOrderBy>>;
};

/** All input for the create `Invitation` mutation. */
export type CreateInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Invitation` to be created by this mutation. */
  invitation: InvitationInput;
};

/** The output of our create `Invitation` mutation. */
export type CreateInvitationPayload = {
  __typename?: "CreateInvitationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Invitation` that was created by this mutation. */
  invitation?: Maybe<Invitation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Invitation`. */
  senderAccount?: Maybe<Account>;
  /** Reads a single `Company` that is related to this `Invitation`. */
  company?: Maybe<Company>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationsEdge>;
};

/** The output of our create `Invitation` mutation. */
export type CreateInvitationPayloadInvitationEdgeArgs = {
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
};

/** All input for the create `Market` mutation. */
export type CreateMarketInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Market` to be created by this mutation. */
  market: MarketInput;
};

/** The output of our create `Market` mutation. */
export type CreateMarketPayload = {
  __typename?: "CreateMarketPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Market` that was created by this mutation. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Market`. May be used by Relay 1. */
  marketEdge?: Maybe<MarketsEdge>;
};

/** The output of our create `Market` mutation. */
export type CreateMarketPayloadMarketEdgeArgs = {
  orderBy?: Maybe<Array<MarketsOrderBy>>;
};

/** All input for the create `Note` mutation. */
export type CreateNoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Note` to be created by this mutation. */
  note: NoteInput;
};

/** The output of our create `Note` mutation. */
export type CreateNotePayload = {
  __typename?: "CreateNotePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Note` that was created by this mutation. */
  note?: Maybe<Note>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Note`. */
  author?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Note`. */
  project?: Maybe<Project>;
  /** An edge for our `Note`. May be used by Relay 1. */
  noteEdge?: Maybe<NotesEdge>;
};

/** The output of our create `Note` mutation. */
export type CreateNotePayloadNoteEdgeArgs = {
  orderBy?: Maybe<Array<NotesOrderBy>>;
};

/** All input for the create `Notification` mutation. */
export type CreateNotificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Notification` to be created by this mutation. */
  notification: NotificationInput;
};

/** The output of our create `Notification` mutation. */
export type CreateNotificationPayload = {
  __typename?: "CreateNotificationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Notification` that was created by this mutation. */
  notification?: Maybe<Notification>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Notification`. */
  account?: Maybe<Account>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
};

/** The output of our create `Notification` mutation. */
export type CreateNotificationPayloadNotificationEdgeArgs = {
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
};

/** All input for the create `Product` mutation. */
export type CreateProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Product` to be created by this mutation. */
  product: ProductInput;
};

/** The output of our create `Product` mutation. */
export type CreateProductPayload = {
  __typename?: "CreateProductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Product` that was created by this mutation. */
  product?: Maybe<Product>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductsEdge>;
};

/** The output of our create `Product` mutation. */
export type CreateProductPayloadProductEdgeArgs = {
  orderBy?: Maybe<Array<ProductsOrderBy>>;
};

/** All input for the create `Project` mutation. */
export type CreateProjectInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Project` to be created by this mutation. */
  project: ProjectInput;
};

/** All input for the create `ProjectMember` mutation. */
export type CreateProjectMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `ProjectMember` to be created by this mutation. */
  projectMember: ProjectMemberInput;
};

/** The output of our create `ProjectMember` mutation. */
export type CreateProjectMemberPayload = {
  __typename?: "CreateProjectMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `ProjectMember` that was created by this mutation. */
  projectMember?: Maybe<ProjectMember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Project` that is related to this `ProjectMember`. */
  project?: Maybe<Project>;
  /** Reads a single `Account` that is related to this `ProjectMember`. */
  account?: Maybe<Account>;
  /** An edge for our `ProjectMember`. May be used by Relay 1. */
  projectMemberEdge?: Maybe<ProjectMembersEdge>;
};

/** The output of our create `ProjectMember` mutation. */
export type CreateProjectMemberPayloadProjectMemberEdgeArgs = {
  orderBy?: Maybe<Array<ProjectMembersOrderBy>>;
};

/** The output of our create `Project` mutation. */
export type CreateProjectPayload = {
  __typename?: "CreateProjectPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Project` that was created by this mutation. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectsEdge>;
};

/** The output of our create `Project` mutation. */
export type CreateProjectPayloadProjectEdgeArgs = {
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
};

/** All input for the create `System` mutation. */
export type CreateSystemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `System` to be created by this mutation. */
  system: SystemInput;
};

/** All input for the create `SystemMember` mutation. */
export type CreateSystemMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `SystemMember` to be created by this mutation. */
  systemMember: SystemMemberInput;
};

/** The output of our create `SystemMember` mutation. */
export type CreateSystemMemberPayload = {
  __typename?: "CreateSystemMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `SystemMember` that was created by this mutation. */
  systemMember?: Maybe<SystemMember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `System` that is related to this `SystemMember`. */
  system?: Maybe<System>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  product?: Maybe<Product>;
  /** An edge for our `SystemMember`. May be used by Relay 1. */
  systemMemberEdge?: Maybe<SystemMembersEdge>;
};

/** The output of our create `SystemMember` mutation. */
export type CreateSystemMemberPayloadSystemMemberEdgeArgs = {
  orderBy?: Maybe<Array<SystemMembersOrderBy>>;
};

/** The output of our create `System` mutation. */
export type CreateSystemPayload = {
  __typename?: "CreateSystemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `System` that was created by this mutation. */
  system?: Maybe<System>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** An edge for our `System`. May be used by Relay 1. */
  systemEdge?: Maybe<SystemsEdge>;
};

/** The output of our create `System` mutation. */
export type CreateSystemPayloadSystemEdgeArgs = {
  orderBy?: Maybe<Array<SystemsOrderBy>>;
};

/** All input for the `deleteAccountByDoceboUserId` mutation. */
export type DeleteAccountByDoceboUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** User account in Docebo */
  doceboUserId: Scalars["Int"];
};

/** All input for the `deleteAccountByNodeId` mutation. */
export type DeleteAccountByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Account` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteAccount` mutation. */
export type DeleteAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayload = {
  __typename?: "DeleteAccountPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Account` that was deleted by this mutation. */
  account?: Maybe<Account>;
  deletedAccountNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayloadAccountEdgeArgs = {
  orderBy?: Maybe<Array<AccountsOrderBy>>;
};

/** All input for the `deleteAddressByNodeId` mutation. */
export type DeleteAddressByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Address` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteAddress` mutation. */
export type DeleteAddressInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Address` mutation. */
export type DeleteAddressPayload = {
  __typename?: "DeleteAddressPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Address` that was deleted by this mutation. */
  address?: Maybe<Address>;
  deletedAddressNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Project` that is related to this `Address`. */
  project?: Maybe<Project>;
  /** Reads a single `Company` that is related to this `Address`. */
  company?: Maybe<Company>;
  /** An edge for our `Address`. May be used by Relay 1. */
  addressEdge?: Maybe<AddressesEdge>;
};

/** The output of our delete `Address` mutation. */
export type DeleteAddressPayloadAddressEdgeArgs = {
  orderBy?: Maybe<Array<AddressesOrderBy>>;
};

/** All input for the `deleteCertificationByNodeId` mutation. */
export type DeleteCertificationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Certification` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCertification` mutation. */
export type DeleteCertificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Certification` mutation. */
export type DeleteCertificationPayload = {
  __typename?: "DeleteCertificationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Certification` that was deleted by this mutation. */
  certification?: Maybe<Certification>;
  deletedCertificationNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Certification`. */
  doceboUser?: Maybe<Account>;
  /** An edge for our `Certification`. May be used by Relay 1. */
  certificationEdge?: Maybe<CertificationsEdge>;
};

/** The output of our delete `Certification` mutation. */
export type DeleteCertificationPayloadCertificationEdgeArgs = {
  orderBy?: Maybe<Array<CertificationsOrderBy>>;
};

/** All input for the `deleteCompanyByNodeId` mutation. */
export type DeleteCompanyByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Company` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanyDocumentByNodeId` mutation. */
export type DeleteCompanyDocumentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyDocument` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanyDocument` mutation. */
export type DeleteCompanyDocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CompanyDocument` mutation. */
export type DeleteCompanyDocumentPayload = {
  __typename?: "DeleteCompanyDocumentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyDocument` that was deleted by this mutation. */
  companyDocument?: Maybe<CompanyDocument>;
  deletedCompanyDocumentNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
  /** An edge for our `CompanyDocument`. May be used by Relay 1. */
  companyDocumentEdge?: Maybe<CompanyDocumentsEdge>;
};

/** The output of our delete `CompanyDocument` mutation. */
export type DeleteCompanyDocumentPayloadCompanyDocumentEdgeArgs = {
  orderBy?: Maybe<Array<CompanyDocumentsOrderBy>>;
};

/** All input for the `deleteCompany` mutation. */
export type DeleteCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `deleteCompanyMemberByNodeId` mutation. */
export type DeleteCompanyMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanyMember` mutation. */
export type DeleteCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CompanyMember` mutation. */
export type DeleteCompanyMemberPayload = {
  __typename?: "DeleteCompanyMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyMember` that was deleted by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  deletedCompanyMemberNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMembersEdge>;
};

/** The output of our delete `CompanyMember` mutation. */
export type DeleteCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
};

/** All input for the `deleteCompanyOperationByNodeId` mutation. */
export type DeleteCompanyOperationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyOperation` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanyOperation` mutation. */
export type DeleteCompanyOperationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CompanyOperation` mutation. */
export type DeleteCompanyOperationPayload = {
  __typename?: "DeleteCompanyOperationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyOperation` that was deleted by this mutation. */
  companyOperation?: Maybe<CompanyOperation>;
  deletedCompanyOperationNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `CompanyOperation`. */
  companyByCompany?: Maybe<Company>;
  /** An edge for our `CompanyOperation`. May be used by Relay 1. */
  companyOperationEdge?: Maybe<CompanyOperationsEdge>;
};

/** The output of our delete `CompanyOperation` mutation. */
export type DeleteCompanyOperationPayloadCompanyOperationEdgeArgs = {
  orderBy?: Maybe<Array<CompanyOperationsOrderBy>>;
};

/** The output of our delete `Company` mutation. */
export type DeleteCompanyPayload = {
  __typename?: "DeleteCompanyPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Company` that was deleted by this mutation. */
  company?: Maybe<Company>;
  deletedCompanyNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
};

/** The output of our delete `Company` mutation. */
export type DeleteCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
};

/** All input for the `deleteEvidenceItemByNodeId` mutation. */
export type DeleteEvidenceItemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `EvidenceItem` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteEvidenceItem` mutation. */
export type DeleteEvidenceItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `EvidenceItem` mutation. */
export type DeleteEvidenceItemPayload = {
  __typename?: "DeleteEvidenceItemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `EvidenceItem` that was deleted by this mutation. */
  evidenceItem?: Maybe<EvidenceItem>;
  deletedEvidenceItemNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Guarantee` that is related to this `EvidenceItem`. */
  guarantee?: Maybe<Guarantee>;
  /** An edge for our `EvidenceItem`. May be used by Relay 1. */
  evidenceItemEdge?: Maybe<EvidenceItemsEdge>;
};

/** The output of our delete `EvidenceItem` mutation. */
export type DeleteEvidenceItemPayloadEvidenceItemEdgeArgs = {
  orderBy?: Maybe<Array<EvidenceItemsOrderBy>>;
};

/** All input for the `deleteGuaranteeByNodeId` mutation. */
export type DeleteGuaranteeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Guarantee` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteGuarantee` mutation. */
export type DeleteGuaranteeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key - starts at 6100 */
  id: Scalars["Int"];
};

/** The output of our delete `Guarantee` mutation. */
export type DeleteGuaranteePayload = {
  __typename?: "DeleteGuaranteePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Guarantee` that was deleted by this mutation. */
  guarantee?: Maybe<Guarantee>;
  deletedGuaranteeNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  responsibleInstallerAccount?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  system?: Maybe<System>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
};

/** The output of our delete `Guarantee` mutation. */
export type DeleteGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
};

/** All input for the `deleteGuaranteedProductByNodeId` mutation. */
export type DeleteGuaranteedProductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `GuaranteedProduct` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteGuaranteedProduct` mutation. */
export type DeleteGuaranteedProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `GuaranteedProduct` mutation. */
export type DeleteGuaranteedProductPayload = {
  __typename?: "DeleteGuaranteedProductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `GuaranteedProduct` that was deleted by this mutation. */
  guaranteedProduct?: Maybe<GuaranteedProduct>;
  deletedGuaranteedProductNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Product` that is related to this `GuaranteedProduct`. */
  product?: Maybe<Product>;
  /** Reads a single `Guarantee` that is related to this `GuaranteedProduct`. */
  guarantee?: Maybe<Guarantee>;
  /** An edge for our `GuaranteedProduct`. May be used by Relay 1. */
  guaranteedProductEdge?: Maybe<GuaranteedProductsEdge>;
};

/** The output of our delete `GuaranteedProduct` mutation. */
export type DeleteGuaranteedProductPayloadGuaranteedProductEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteedProductsOrderBy>>;
};

/** All input for the `deleteInvitationByNodeId` mutation. */
export type DeleteInvitationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Invitation` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteInvitation` mutation. */
export type DeleteInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Invitation` mutation. */
export type DeleteInvitationPayload = {
  __typename?: "DeleteInvitationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Invitation` that was deleted by this mutation. */
  invitation?: Maybe<Invitation>;
  deletedInvitationNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Invitation`. */
  senderAccount?: Maybe<Account>;
  /** Reads a single `Company` that is related to this `Invitation`. */
  company?: Maybe<Company>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationsEdge>;
};

/** The output of our delete `Invitation` mutation. */
export type DeleteInvitationPayloadInvitationEdgeArgs = {
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
};

/** All input for the `deleteMarketByNodeId` mutation. */
export type DeleteMarketByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Market` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteMarket` mutation. */
export type DeleteMarketInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Market` mutation. */
export type DeleteMarketPayload = {
  __typename?: "DeleteMarketPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Market` that was deleted by this mutation. */
  market?: Maybe<Market>;
  deletedMarketNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Market`. May be used by Relay 1. */
  marketEdge?: Maybe<MarketsEdge>;
};

/** The output of our delete `Market` mutation. */
export type DeleteMarketPayloadMarketEdgeArgs = {
  orderBy?: Maybe<Array<MarketsOrderBy>>;
};

/** All input for the `deleteNoteByNodeId` mutation. */
export type DeleteNoteByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Note` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteNote` mutation. */
export type DeleteNoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Note` mutation. */
export type DeleteNotePayload = {
  __typename?: "DeleteNotePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Note` that was deleted by this mutation. */
  note?: Maybe<Note>;
  deletedNoteNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Note`. */
  author?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Note`. */
  project?: Maybe<Project>;
  /** An edge for our `Note`. May be used by Relay 1. */
  noteEdge?: Maybe<NotesEdge>;
};

/** The output of our delete `Note` mutation. */
export type DeleteNotePayloadNoteEdgeArgs = {
  orderBy?: Maybe<Array<NotesOrderBy>>;
};

/** All input for the `deleteNotificationByNodeId` mutation. */
export type DeleteNotificationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Notification` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteNotification` mutation. */
export type DeleteNotificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Notification` mutation. */
export type DeleteNotificationPayload = {
  __typename?: "DeleteNotificationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Notification` that was deleted by this mutation. */
  notification?: Maybe<Notification>;
  deletedNotificationNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Notification`. */
  account?: Maybe<Account>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
};

/** The output of our delete `Notification` mutation. */
export type DeleteNotificationPayloadNotificationEdgeArgs = {
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
};

/** All input for the `deleteProductByNodeId` mutation. */
export type DeleteProductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Product` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteProduct` mutation. */
export type DeleteProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Product` mutation. */
export type DeleteProductPayload = {
  __typename?: "DeleteProductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Product` that was deleted by this mutation. */
  product?: Maybe<Product>;
  deletedProductNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductsEdge>;
};

/** The output of our delete `Product` mutation. */
export type DeleteProductPayloadProductEdgeArgs = {
  orderBy?: Maybe<Array<ProductsOrderBy>>;
};

/** All input for the `deleteProjectByNodeId` mutation. */
export type DeleteProjectByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Project` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteProject` mutation. */
export type DeleteProjectInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `deleteProjectMemberByNodeId` mutation. */
export type DeleteProjectMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `ProjectMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteProjectMember` mutation. */
export type DeleteProjectMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `ProjectMember` mutation. */
export type DeleteProjectMemberPayload = {
  __typename?: "DeleteProjectMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `ProjectMember` that was deleted by this mutation. */
  projectMember?: Maybe<ProjectMember>;
  deletedProjectMemberNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Project` that is related to this `ProjectMember`. */
  project?: Maybe<Project>;
  /** Reads a single `Account` that is related to this `ProjectMember`. */
  account?: Maybe<Account>;
  /** An edge for our `ProjectMember`. May be used by Relay 1. */
  projectMemberEdge?: Maybe<ProjectMembersEdge>;
};

/** The output of our delete `ProjectMember` mutation. */
export type DeleteProjectMemberPayloadProjectMemberEdgeArgs = {
  orderBy?: Maybe<Array<ProjectMembersOrderBy>>;
};

/** The output of our delete `Project` mutation. */
export type DeleteProjectPayload = {
  __typename?: "DeleteProjectPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Project` that was deleted by this mutation. */
  project?: Maybe<Project>;
  deletedProjectNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectsEdge>;
};

/** The output of our delete `Project` mutation. */
export type DeleteProjectPayloadProjectEdgeArgs = {
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
};

/** All input for the `deleteSystemByNodeId` mutation. */
export type DeleteSystemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `System` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteSystem` mutation. */
export type DeleteSystemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `deleteSystemMemberByNodeId` mutation. */
export type DeleteSystemMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `SystemMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteSystemMember` mutation. */
export type DeleteSystemMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `SystemMember` mutation. */
export type DeleteSystemMemberPayload = {
  __typename?: "DeleteSystemMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `SystemMember` that was deleted by this mutation. */
  systemMember?: Maybe<SystemMember>;
  deletedSystemMemberNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `System` that is related to this `SystemMember`. */
  system?: Maybe<System>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  product?: Maybe<Product>;
  /** An edge for our `SystemMember`. May be used by Relay 1. */
  systemMemberEdge?: Maybe<SystemMembersEdge>;
};

/** The output of our delete `SystemMember` mutation. */
export type DeleteSystemMemberPayloadSystemMemberEdgeArgs = {
  orderBy?: Maybe<Array<SystemMembersOrderBy>>;
};

/** The output of our delete `System` mutation. */
export type DeleteSystemPayload = {
  __typename?: "DeleteSystemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `System` that was deleted by this mutation. */
  system?: Maybe<System>;
  deletedSystemNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** An edge for our `System`. May be used by Relay 1. */
  systemEdge?: Maybe<SystemsEdge>;
};

/** The output of our delete `System` mutation. */
export type DeleteSystemPayloadSystemEdgeArgs = {
  orderBy?: Maybe<Array<SystemsOrderBy>>;
};

/** An item of evidence for a guarantee */
export type EvidenceItem = Node & {
  __typename?: "EvidenceItem";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** a reference to the evidenceCategory sys id in Contentful */
  evidenceCategoryId?: Maybe<Scalars["String"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. Photo of the evidence */
  attachment?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Guarantee` that is related to this `EvidenceItem`. */
  guarantee?: Maybe<Guarantee>;
};

/**
 * A condition to be used against `EvidenceItem` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EvidenceItemCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `guaranteeId` field. */
  guaranteeId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `EvidenceItem` */
export type EvidenceItemInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** a reference to the evidenceCategory sys id in Contentful */
  evidenceCategoryId?: Maybe<Scalars["String"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. Photo of the evidence */
  attachment?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `EvidenceItem`. Fields that are set will be updated. */
export type EvidenceItemPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** a reference to the evidenceCategory sys id in Contentful */
  evidenceCategoryId?: Maybe<Scalars["String"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. Photo of the evidence */
  attachment?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `EvidenceItem` values. */
export type EvidenceItemsConnection = {
  __typename?: "EvidenceItemsConnection";
  /** A list of `EvidenceItem` objects. */
  nodes: Array<EvidenceItem>;
  /** A list of edges which contains the `EvidenceItem` and cursor to aid in pagination. */
  edges: Array<EvidenceItemsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EvidenceItem` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `EvidenceItem` edge in the connection. */
export type EvidenceItemsEdge = {
  __typename?: "EvidenceItemsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `EvidenceItem` at the end of the edge. */
  node: EvidenceItem;
};

/** Methods to use when ordering `EvidenceItem`. */
export enum EvidenceItemsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  GuaranteeIdAsc = "GUARANTEE_ID_ASC",
  GuaranteeIdDesc = "GUARANTEE_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** Starts life as request for a gurantee and becomes an actual issued guarantee */
export type Guarantee = Node & {
  __typename?: "Guarantee";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key - starts at 6100 */
  id: Scalars["Int"];
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  pdf?: Maybe<Scalars["String"]>;
  /** fk */
  requestorAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  responsibleInstallerAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTypeId?: Maybe<Scalars["String"]>;
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTemplateId?: Maybe<Scalars["String"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually. */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** When the guarantee will expire.  This is calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier. */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Request Id. */
  issueNumber?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  responsibleInstallerAccount?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  system?: Maybe<System>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** Reads and enables pagination through a set of `EvidenceItem`. */
  evidenceItems: EvidenceItemsConnection;
  /** Reads and enables pagination through a set of `GuaranteedProduct`. */
  guaranteedProducts: GuaranteedProductsConnection;
  guaranteeType?: Maybe<ContentfulGuaranteeType>;
};

/** Starts life as request for a gurantee and becomes an actual issued guarantee */
export type GuaranteeEvidenceItemsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<EvidenceItemsOrderBy>>;
  condition?: Maybe<EvidenceItemCondition>;
};

/** Starts life as request for a gurantee and becomes an actual issued guarantee */
export type GuaranteeGuaranteedProductsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteedProductsOrderBy>>;
  condition?: Maybe<GuaranteedProductCondition>;
};

/**
 * A condition to be used against `Guarantee` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GuaranteeCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `requestorAccountId` field. */
  requestorAccountId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `responsibleInstallerAccountId` field. */
  responsibleInstallerAccountId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `systemId` field. */
  systemId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `reviewerAccountId` field. */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Guarantee` */
export type GuaranteeInput = {
  /** Primary key - starts at 6100 */
  id?: Maybe<Scalars["Int"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  pdf?: Maybe<Scalars["String"]>;
  /** fk */
  requestorAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  responsibleInstallerAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTypeId?: Maybe<Scalars["String"]>;
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTemplateId?: Maybe<Scalars["String"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually. */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** When the guarantee will expire.  This is calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier. */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Request Id. */
  issueNumber?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Guarantee`. Fields that are set will be updated. */
export type GuaranteePatch = {
  /** Primary key - starts at 6100 */
  id?: Maybe<Scalars["Int"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  pdf?: Maybe<Scalars["String"]>;
  /** fk */
  requestorAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  responsibleInstallerAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTypeId?: Maybe<Scalars["String"]>;
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTemplateId?: Maybe<Scalars["String"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually. */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** When the guarantee will expire.  This is calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier. */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Request Id. */
  issueNumber?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A mapping of Products to Guarantees.  Needed because uou can have more than one Product per Product Guarantee. */
export type GuaranteedProduct = Node & {
  __typename?: "GuaranteedProduct";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  productId?: Maybe<Scalars["Int"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Product` that is related to this `GuaranteedProduct`. */
  product?: Maybe<Product>;
  /** Reads a single `Guarantee` that is related to this `GuaranteedProduct`. */
  guarantee?: Maybe<Guarantee>;
};

/**
 * A condition to be used against `GuaranteedProduct` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type GuaranteedProductCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `productId` field. */
  productId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `guaranteeId` field. */
  guaranteeId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `GuaranteedProduct` */
export type GuaranteedProductInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  productId?: Maybe<Scalars["Int"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `GuaranteedProduct`. Fields that are set will be updated. */
export type GuaranteedProductPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  productId?: Maybe<Scalars["Int"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `GuaranteedProduct` values. */
export type GuaranteedProductsConnection = {
  __typename?: "GuaranteedProductsConnection";
  /** A list of `GuaranteedProduct` objects. */
  nodes: Array<GuaranteedProduct>;
  /** A list of edges which contains the `GuaranteedProduct` and cursor to aid in pagination. */
  edges: Array<GuaranteedProductsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GuaranteedProduct` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `GuaranteedProduct` edge in the connection. */
export type GuaranteedProductsEdge = {
  __typename?: "GuaranteedProductsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `GuaranteedProduct` at the end of the edge. */
  node: GuaranteedProduct;
};

/** Methods to use when ordering `GuaranteedProduct`. */
export enum GuaranteedProductsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  GuaranteeIdAsc = "GUARANTEE_ID_ASC",
  GuaranteeIdDesc = "GUARANTEE_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** A connection to a list of `Guarantee` values. */
export type GuaranteesConnection = {
  __typename?: "GuaranteesConnection";
  /** A list of `Guarantee` objects. */
  nodes: Array<Guarantee>;
  /** A list of edges which contains the `Guarantee` and cursor to aid in pagination. */
  edges: Array<GuaranteesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Guarantee` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Guarantee` edge in the connection. */
export type GuaranteesEdge = {
  __typename?: "GuaranteesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Guarantee` at the end of the edge. */
  node: Guarantee;
};

/** Methods to use when ordering `Guarantee`. */
export enum GuaranteesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  RequestorAccountIdAsc = "REQUESTOR_ACCOUNT_ID_ASC",
  RequestorAccountIdDesc = "REQUESTOR_ACCOUNT_ID_DESC",
  ResponsibleInstallerAccountIdAsc = "RESPONSIBLE_INSTALLER_ACCOUNT_ID_ASC",
  ResponsibleInstallerAccountIdDesc = "RESPONSIBLE_INSTALLER_ACCOUNT_ID_DESC",
  ProjectIdAsc = "PROJECT_ID_ASC",
  ProjectIdDesc = "PROJECT_ID_DESC",
  SystemIdAsc = "SYSTEM_ID_ASC",
  SystemIdDesc = "SYSTEM_ID_DESC",
  ReviewerAccountIdAsc = "REVIEWER_ACCOUNT_ID_ASC",
  ReviewerAccountIdDesc = "REVIEWER_ACCOUNT_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** An invitation to join InTouch */
export type Invitation = Node & {
  __typename?: "Invitation";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  senderAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  status?: Maybe<InvitationStatus>;
  /** An email address */
  invitee?: Maybe<Scalars["String"]>;
  /** An optional note that can be included in the invitation by the sender */
  personalNote?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Invitation`. */
  senderAccount?: Maybe<Account>;
  /** Reads a single `Company` that is related to this `Invitation`. */
  company?: Maybe<Company>;
};

/**
 * A condition to be used against `Invitation` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type InvitationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `senderAccountId` field. */
  senderAccountId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Invitation` */
export type InvitationInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  senderAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  status?: Maybe<InvitationStatus>;
  /** An email address */
  invitee?: Maybe<Scalars["String"]>;
  /** An optional note that can be included in the invitation by the sender */
  personalNote?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Invitation`. Fields that are set will be updated. */
export type InvitationPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  senderAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  status?: Maybe<InvitationStatus>;
  /** An email address */
  invitee?: Maybe<Scalars["String"]>;
  /** An optional note that can be included in the invitation by the sender */
  personalNote?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

export enum InvitationStatus {
  New = "NEW",
  Accepted = "ACCEPTED",
  Cancelled = "CANCELLED"
}

/** A connection to a list of `Invitation` values. */
export type InvitationsConnection = {
  __typename?: "InvitationsConnection";
  /** A list of `Invitation` objects. */
  nodes: Array<Invitation>;
  /** A list of edges which contains the `Invitation` and cursor to aid in pagination. */
  edges: Array<InvitationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Invitation` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Invitation` edge in the connection. */
export type InvitationsEdge = {
  __typename?: "InvitationsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Invitation` at the end of the edge. */
  node: Invitation;
};

/** Methods to use when ordering `Invitation`. */
export enum InvitationsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  SenderAccountIdAsc = "SENDER_ACCOUNT_ID_ASC",
  SenderAccountIdDesc = "SENDER_ACCOUNT_ID_DESC",
  CompanyIdAsc = "COMPANY_ID_ASC",
  CompanyIdDesc = "COMPANY_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** A connection to a list of `Int` values. */
export type IsPartOfProjectConnection = {
  __typename?: "IsPartOfProjectConnection";
  /** A list of `Int` objects. */
  nodes: Array<Maybe<Scalars["Int"]>>;
  /** A list of edges which contains the `Int` and cursor to aid in pagination. */
  edges: Array<IsPartOfProjectEdge>;
  /** The count of *all* `Int` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Int` edge in the connection. */
export type IsPartOfProjectEdge = {
  __typename?: "IsPartOfProjectEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Int` at the end of the edge. */
  node?: Maybe<Scalars["Int"]>;
};

export enum Language {
  Da = "DA",
  No = "NO",
  En = "EN",
  Sv = "SV",
  Pt = "PT",
  De = "DE",
  Nl = "NL",
  Sk = "SK",
  Fr = "FR",
  Pl = "PL",
  Es = "ES",
  Fi = "FI"
}

/** A country that BMI operates in */
export type Market = Node & {
  __typename?: "Market";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** ek */
  language?: Maybe<Language>;
  /** the country code used for example as the subdomain */
  domain?: Maybe<Scalars["String"]>;
  /** The space in Contenful */
  cmsSpaceId?: Maybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: Maybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: Maybe<Scalars["String"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: Maybe<Scalars["String"]>;
  /** The default branch in Docebo that installers go into */
  doceboInstallersBranchId?: Maybe<Scalars["String"]>;
  /** The branch in Docebo that company admins go into */
  doceboCompanyAdminBranchId?: Maybe<Scalars["String"]>;
  /** The default catalogue for the market.  All users in the market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: Maybe<Scalars["String"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /** Whether the market supports Projects.  If so then the Project section is available.  Tier 0 can then be configured to support Guarantees in non-Roopro countries.  In Roofpro countries various Tier configurations become possible. */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: Maybe<Scalars["String"]>;
  /** The coordinates of the middle of the country on a map */
  geoMiddle?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads and enables pagination through a set of `Account`. */
  accounts: AccountsConnection;
  /** Reads and enables pagination through a set of `Company`. */
  companies: CompaniesConnection;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMembersConnection;
  /** Reads and enables pagination through a set of `Product`. */
  products: ProductsConnection;
  /** Reads and enables pagination through a set of `System`. */
  systems: SystemsConnection;
};

/** A country that BMI operates in */
export type MarketAccountsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AccountsOrderBy>>;
  condition?: Maybe<AccountCondition>;
};

/** A country that BMI operates in */
export type MarketCompaniesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
  condition?: Maybe<CompanyCondition>;
};

/** A country that BMI operates in */
export type MarketCompanyMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
  condition?: Maybe<CompanyMemberCondition>;
};

/** A country that BMI operates in */
export type MarketProductsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProductsOrderBy>>;
  condition?: Maybe<ProductCondition>;
};

/** A country that BMI operates in */
export type MarketSystemsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<SystemsOrderBy>>;
  condition?: Maybe<SystemCondition>;
};

/** A condition to be used against `Market` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MarketCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Market` */
export type MarketInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** ek */
  language?: Maybe<Language>;
  /** the country code used for example as the subdomain */
  domain?: Maybe<Scalars["String"]>;
  /** The space in Contenful */
  cmsSpaceId?: Maybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: Maybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: Maybe<Scalars["String"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: Maybe<Scalars["String"]>;
  /** The default branch in Docebo that installers go into */
  doceboInstallersBranchId?: Maybe<Scalars["String"]>;
  /** The branch in Docebo that company admins go into */
  doceboCompanyAdminBranchId?: Maybe<Scalars["String"]>;
  /** The default catalogue for the market.  All users in the market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: Maybe<Scalars["String"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /** Whether the market supports Projects.  If so then the Project section is available.  Tier 0 can then be configured to support Guarantees in non-Roopro countries.  In Roofpro countries various Tier configurations become possible. */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: Maybe<Scalars["String"]>;
  /** The coordinates of the middle of the country on a map */
  geoMiddle?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Market`. Fields that are set will be updated. */
export type MarketPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** ek */
  language?: Maybe<Language>;
  /** the country code used for example as the subdomain */
  domain?: Maybe<Scalars["String"]>;
  /** The space in Contenful */
  cmsSpaceId?: Maybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: Maybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: Maybe<Scalars["String"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: Maybe<Scalars["String"]>;
  /** The default branch in Docebo that installers go into */
  doceboInstallersBranchId?: Maybe<Scalars["String"]>;
  /** The branch in Docebo that company admins go into */
  doceboCompanyAdminBranchId?: Maybe<Scalars["String"]>;
  /** The default catalogue for the market.  All users in the market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: Maybe<Scalars["String"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /** Whether the market supports Projects.  If so then the Project section is available.  Tier 0 can then be configured to support Guarantees in non-Roopro countries.  In Roofpro countries various Tier configurations become possible. */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: Maybe<Scalars["String"]>;
  /** The coordinates of the middle of the country on a map */
  geoMiddle?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Market` values. */
export type MarketsConnection = {
  __typename?: "MarketsConnection";
  /** A list of `Market` objects. */
  nodes: Array<Market>;
  /** A list of edges which contains the `Market` and cursor to aid in pagination. */
  edges: Array<MarketsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Market` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Market` edge in the connection. */
export type MarketsEdge = {
  __typename?: "MarketsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Market` at the end of the edge. */
  node: Market;
};

/** Methods to use when ordering `Market`. */
export enum MarketsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: "Mutation";
  /** Creates a single `Address`. */
  createAddress?: Maybe<CreateAddressPayload>;
  /** Creates a single `Certification`. */
  createCertification?: Maybe<CreateCertificationPayload>;
  /** Creates a single `Company`. */
  createCompany?: Maybe<CreateCompanyPayload>;
  /** Creates a single `CompanyDocument`. */
  createCompanyDocument?: Maybe<CreateCompanyDocumentPayload>;
  /** Creates a single `CompanyMember`. */
  createCompanyMember?: Maybe<CreateCompanyMemberPayload>;
  /** Creates a single `CompanyOperation`. */
  createCompanyOperation?: Maybe<CreateCompanyOperationPayload>;
  /** Creates a single `EvidenceItem`. */
  createEvidenceItem?: Maybe<CreateEvidenceItemPayload>;
  /** Creates a single `Guarantee`. */
  createGuarantee?: Maybe<CreateGuaranteePayload>;
  /** Creates a single `GuaranteedProduct`. */
  createGuaranteedProduct?: Maybe<CreateGuaranteedProductPayload>;
  /** Creates a single `Invitation`. */
  createInvitation?: Maybe<CreateInvitationPayload>;
  /** Creates a single `Market`. */
  createMarket?: Maybe<CreateMarketPayload>;
  /** Creates a single `Note`. */
  createNote?: Maybe<CreateNotePayload>;
  /** Creates a single `Notification`. */
  createNotification?: Maybe<CreateNotificationPayload>;
  /** Creates a single `Product`. */
  createProduct?: Maybe<CreateProductPayload>;
  /** Creates a single `Project`. */
  createProject?: Maybe<CreateProjectPayload>;
  /** Creates a single `ProjectMember`. */
  createProjectMember?: Maybe<CreateProjectMemberPayload>;
  /** Creates a single `System`. */
  createSystem?: Maybe<CreateSystemPayload>;
  /** Creates a single `SystemMember`. */
  createSystemMember?: Maybe<CreateSystemMemberPayload>;
  /** Updates a single `Account` using its globally unique id and a patch. */
  updateAccountByNodeId?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccount?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountByDoceboUserId?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Address` using its globally unique id and a patch. */
  updateAddressByNodeId?: Maybe<UpdateAddressPayload>;
  /** Updates a single `Address` using a unique key and a patch. */
  updateAddress?: Maybe<UpdateAddressPayload>;
  /** Updates a single `Certification` using its globally unique id and a patch. */
  updateCertificationByNodeId?: Maybe<UpdateCertificationPayload>;
  /** Updates a single `Certification` using a unique key and a patch. */
  updateCertification?: Maybe<UpdateCertificationPayload>;
  /** Updates a single `Company` using its globally unique id and a patch. */
  updateCompanyByNodeId?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `Company` using a unique key and a patch. */
  updateCompany?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `CompanyDocument` using its globally unique id and a patch. */
  updateCompanyDocumentByNodeId?: Maybe<UpdateCompanyDocumentPayload>;
  /** Updates a single `CompanyDocument` using a unique key and a patch. */
  updateCompanyDocument?: Maybe<UpdateCompanyDocumentPayload>;
  /** Updates a single `CompanyMember` using its globally unique id and a patch. */
  updateCompanyMemberByNodeId?: Maybe<UpdateCompanyMemberPayload>;
  /** Updates a single `CompanyMember` using a unique key and a patch. */
  updateCompanyMember?: Maybe<UpdateCompanyMemberPayload>;
  /** Updates a single `CompanyOperation` using its globally unique id and a patch. */
  updateCompanyOperationByNodeId?: Maybe<UpdateCompanyOperationPayload>;
  /** Updates a single `CompanyOperation` using a unique key and a patch. */
  updateCompanyOperation?: Maybe<UpdateCompanyOperationPayload>;
  /** Updates a single `EvidenceItem` using its globally unique id and a patch. */
  updateEvidenceItemByNodeId?: Maybe<UpdateEvidenceItemPayload>;
  /** Updates a single `EvidenceItem` using a unique key and a patch. */
  updateEvidenceItem?: Maybe<UpdateEvidenceItemPayload>;
  /** Updates a single `Guarantee` using its globally unique id and a patch. */
  updateGuaranteeByNodeId?: Maybe<UpdateGuaranteePayload>;
  /** Updates a single `Guarantee` using a unique key and a patch. */
  updateGuarantee?: Maybe<UpdateGuaranteePayload>;
  /** Updates a single `GuaranteedProduct` using its globally unique id and a patch. */
  updateGuaranteedProductByNodeId?: Maybe<UpdateGuaranteedProductPayload>;
  /** Updates a single `GuaranteedProduct` using a unique key and a patch. */
  updateGuaranteedProduct?: Maybe<UpdateGuaranteedProductPayload>;
  /** Updates a single `Invitation` using its globally unique id and a patch. */
  updateInvitationByNodeId?: Maybe<UpdateInvitationPayload>;
  /** Updates a single `Invitation` using a unique key and a patch. */
  updateInvitation?: Maybe<UpdateInvitationPayload>;
  /** Updates a single `Market` using its globally unique id and a patch. */
  updateMarketByNodeId?: Maybe<UpdateMarketPayload>;
  /** Updates a single `Market` using a unique key and a patch. */
  updateMarket?: Maybe<UpdateMarketPayload>;
  /** Updates a single `Note` using its globally unique id and a patch. */
  updateNoteByNodeId?: Maybe<UpdateNotePayload>;
  /** Updates a single `Note` using a unique key and a patch. */
  updateNote?: Maybe<UpdateNotePayload>;
  /** Updates a single `Notification` using its globally unique id and a patch. */
  updateNotificationByNodeId?: Maybe<UpdateNotificationPayload>;
  /** Updates a single `Notification` using a unique key and a patch. */
  updateNotification?: Maybe<UpdateNotificationPayload>;
  /** Updates a single `Product` using its globally unique id and a patch. */
  updateProductByNodeId?: Maybe<UpdateProductPayload>;
  /** Updates a single `Product` using a unique key and a patch. */
  updateProduct?: Maybe<UpdateProductPayload>;
  /** Updates a single `Project` using its globally unique id and a patch. */
  updateProjectByNodeId?: Maybe<UpdateProjectPayload>;
  /** Updates a single `Project` using a unique key and a patch. */
  updateProject?: Maybe<UpdateProjectPayload>;
  /** Updates a single `ProjectMember` using its globally unique id and a patch. */
  updateProjectMemberByNodeId?: Maybe<UpdateProjectMemberPayload>;
  /** Updates a single `ProjectMember` using a unique key and a patch. */
  updateProjectMember?: Maybe<UpdateProjectMemberPayload>;
  /** Updates a single `System` using its globally unique id and a patch. */
  updateSystemByNodeId?: Maybe<UpdateSystemPayload>;
  /** Updates a single `System` using a unique key and a patch. */
  updateSystem?: Maybe<UpdateSystemPayload>;
  /** Updates a single `SystemMember` using its globally unique id and a patch. */
  updateSystemMemberByNodeId?: Maybe<UpdateSystemMemberPayload>;
  /** Updates a single `SystemMember` using a unique key and a patch. */
  updateSystemMember?: Maybe<UpdateSystemMemberPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccountByNodeId?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountByDoceboUserId?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Address` using its globally unique id. */
  deleteAddressByNodeId?: Maybe<DeleteAddressPayload>;
  /** Deletes a single `Address` using a unique key. */
  deleteAddress?: Maybe<DeleteAddressPayload>;
  /** Deletes a single `Certification` using its globally unique id. */
  deleteCertificationByNodeId?: Maybe<DeleteCertificationPayload>;
  /** Deletes a single `Certification` using a unique key. */
  deleteCertification?: Maybe<DeleteCertificationPayload>;
  /** Deletes a single `Company` using its globally unique id. */
  deleteCompanyByNodeId?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `Company` using a unique key. */
  deleteCompany?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `CompanyDocument` using its globally unique id. */
  deleteCompanyDocumentByNodeId?: Maybe<DeleteCompanyDocumentPayload>;
  /** Deletes a single `CompanyDocument` using a unique key. */
  deleteCompanyDocument?: Maybe<DeleteCompanyDocumentPayload>;
  /** Deletes a single `CompanyMember` using its globally unique id. */
  deleteCompanyMemberByNodeId?: Maybe<DeleteCompanyMemberPayload>;
  /** Deletes a single `CompanyMember` using a unique key. */
  deleteCompanyMember?: Maybe<DeleteCompanyMemberPayload>;
  /** Deletes a single `CompanyOperation` using its globally unique id. */
  deleteCompanyOperationByNodeId?: Maybe<DeleteCompanyOperationPayload>;
  /** Deletes a single `CompanyOperation` using a unique key. */
  deleteCompanyOperation?: Maybe<DeleteCompanyOperationPayload>;
  /** Deletes a single `EvidenceItem` using its globally unique id. */
  deleteEvidenceItemByNodeId?: Maybe<DeleteEvidenceItemPayload>;
  /** Deletes a single `EvidenceItem` using a unique key. */
  deleteEvidenceItem?: Maybe<DeleteEvidenceItemPayload>;
  /** Deletes a single `Guarantee` using its globally unique id. */
  deleteGuaranteeByNodeId?: Maybe<DeleteGuaranteePayload>;
  /** Deletes a single `Guarantee` using a unique key. */
  deleteGuarantee?: Maybe<DeleteGuaranteePayload>;
  /** Deletes a single `GuaranteedProduct` using its globally unique id. */
  deleteGuaranteedProductByNodeId?: Maybe<DeleteGuaranteedProductPayload>;
  /** Deletes a single `GuaranteedProduct` using a unique key. */
  deleteGuaranteedProduct?: Maybe<DeleteGuaranteedProductPayload>;
  /** Deletes a single `Invitation` using its globally unique id. */
  deleteInvitationByNodeId?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Invitation` using a unique key. */
  deleteInvitation?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Market` using its globally unique id. */
  deleteMarketByNodeId?: Maybe<DeleteMarketPayload>;
  /** Deletes a single `Market` using a unique key. */
  deleteMarket?: Maybe<DeleteMarketPayload>;
  /** Deletes a single `Note` using its globally unique id. */
  deleteNoteByNodeId?: Maybe<DeleteNotePayload>;
  /** Deletes a single `Note` using a unique key. */
  deleteNote?: Maybe<DeleteNotePayload>;
  /** Deletes a single `Notification` using its globally unique id. */
  deleteNotificationByNodeId?: Maybe<DeleteNotificationPayload>;
  /** Deletes a single `Notification` using a unique key. */
  deleteNotification?: Maybe<DeleteNotificationPayload>;
  /** Deletes a single `Product` using its globally unique id. */
  deleteProductByNodeId?: Maybe<DeleteProductPayload>;
  /** Deletes a single `Product` using a unique key. */
  deleteProduct?: Maybe<DeleteProductPayload>;
  /** Deletes a single `Project` using its globally unique id. */
  deleteProjectByNodeId?: Maybe<DeleteProjectPayload>;
  /** Deletes a single `Project` using a unique key. */
  deleteProject?: Maybe<DeleteProjectPayload>;
  /** Deletes a single `ProjectMember` using its globally unique id. */
  deleteProjectMemberByNodeId?: Maybe<DeleteProjectMemberPayload>;
  /** Deletes a single `ProjectMember` using a unique key. */
  deleteProjectMember?: Maybe<DeleteProjectMemberPayload>;
  /** Deletes a single `System` using its globally unique id. */
  deleteSystemByNodeId?: Maybe<DeleteSystemPayload>;
  /** Deletes a single `System` using a unique key. */
  deleteSystem?: Maybe<DeleteSystemPayload>;
  /** Deletes a single `SystemMember` using its globally unique id. */
  deleteSystemMemberByNodeId?: Maybe<DeleteSystemMemberPayload>;
  /** Deletes a single `SystemMember` using a unique key. */
  deleteSystemMember?: Maybe<DeleteSystemMemberPayload>;
  createAccount?: Maybe<CreateAccountPayload>;
  publishMessage?: Maybe<Publish>;
  createGuaranteePdf?: Maybe<PublishOutput>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAddressArgs = {
  input: CreateAddressInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCertificationArgs = {
  input: CreateCertificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCompanyDocumentArgs = {
  input: CreateCompanyDocumentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCompanyMemberArgs = {
  input: CreateCompanyMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCompanyOperationArgs = {
  input: CreateCompanyOperationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEvidenceItemArgs = {
  input: CreateEvidenceItemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGuaranteeArgs = {
  input: CreateGuaranteeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGuaranteedProductArgs = {
  input: CreateGuaranteedProductInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMarketArgs = {
  input: CreateMarketInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProductArgs = {
  input: CreateProductInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProjectMemberArgs = {
  input: CreateProjectMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSystemArgs = {
  input: CreateSystemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSystemMemberArgs = {
  input: CreateSystemMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByNodeIdArgs = {
  input: UpdateAccountByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByDoceboUserIdArgs = {
  input: UpdateAccountByDoceboUserIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAddressByNodeIdArgs = {
  input: UpdateAddressByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAddressArgs = {
  input: UpdateAddressInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCertificationByNodeIdArgs = {
  input: UpdateCertificationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCertificationArgs = {
  input: UpdateCertificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyByNodeIdArgs = {
  input: UpdateCompanyByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyDocumentByNodeIdArgs = {
  input: UpdateCompanyDocumentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyDocumentArgs = {
  input: UpdateCompanyDocumentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyMemberByNodeIdArgs = {
  input: UpdateCompanyMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyMemberArgs = {
  input: UpdateCompanyMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyOperationByNodeIdArgs = {
  input: UpdateCompanyOperationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyOperationArgs = {
  input: UpdateCompanyOperationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEvidenceItemByNodeIdArgs = {
  input: UpdateEvidenceItemByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEvidenceItemArgs = {
  input: UpdateEvidenceItemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuaranteeByNodeIdArgs = {
  input: UpdateGuaranteeByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuaranteeArgs = {
  input: UpdateGuaranteeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuaranteedProductByNodeIdArgs = {
  input: UpdateGuaranteedProductByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuaranteedProductArgs = {
  input: UpdateGuaranteedProductInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvitationByNodeIdArgs = {
  input: UpdateInvitationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvitationArgs = {
  input: UpdateInvitationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMarketByNodeIdArgs = {
  input: UpdateMarketByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMarketArgs = {
  input: UpdateMarketInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNoteByNodeIdArgs = {
  input: UpdateNoteByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNoteArgs = {
  input: UpdateNoteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNotificationByNodeIdArgs = {
  input: UpdateNotificationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNotificationArgs = {
  input: UpdateNotificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProductByNodeIdArgs = {
  input: UpdateProductByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectByNodeIdArgs = {
  input: UpdateProjectByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectMemberByNodeIdArgs = {
  input: UpdateProjectMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectMemberArgs = {
  input: UpdateProjectMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemByNodeIdArgs = {
  input: UpdateSystemByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemArgs = {
  input: UpdateSystemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemMemberByNodeIdArgs = {
  input: UpdateSystemMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemMemberArgs = {
  input: UpdateSystemMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByNodeIdArgs = {
  input: DeleteAccountByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByDoceboUserIdArgs = {
  input: DeleteAccountByDoceboUserIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAddressByNodeIdArgs = {
  input: DeleteAddressByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAddressArgs = {
  input: DeleteAddressInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCertificationByNodeIdArgs = {
  input: DeleteCertificationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCertificationArgs = {
  input: DeleteCertificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyByNodeIdArgs = {
  input: DeleteCompanyByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyArgs = {
  input: DeleteCompanyInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyDocumentByNodeIdArgs = {
  input: DeleteCompanyDocumentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyDocumentArgs = {
  input: DeleteCompanyDocumentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyMemberByNodeIdArgs = {
  input: DeleteCompanyMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyMemberArgs = {
  input: DeleteCompanyMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyOperationByNodeIdArgs = {
  input: DeleteCompanyOperationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyOperationArgs = {
  input: DeleteCompanyOperationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEvidenceItemByNodeIdArgs = {
  input: DeleteEvidenceItemByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEvidenceItemArgs = {
  input: DeleteEvidenceItemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuaranteeByNodeIdArgs = {
  input: DeleteGuaranteeByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuaranteeArgs = {
  input: DeleteGuaranteeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuaranteedProductByNodeIdArgs = {
  input: DeleteGuaranteedProductByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuaranteedProductArgs = {
  input: DeleteGuaranteedProductInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvitationByNodeIdArgs = {
  input: DeleteInvitationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvitationArgs = {
  input: DeleteInvitationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMarketByNodeIdArgs = {
  input: DeleteMarketByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMarketArgs = {
  input: DeleteMarketInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNoteByNodeIdArgs = {
  input: DeleteNoteByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNoteArgs = {
  input: DeleteNoteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNotificationByNodeIdArgs = {
  input: DeleteNotificationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNotificationArgs = {
  input: DeleteNotificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProductByNodeIdArgs = {
  input: DeleteProductByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProductArgs = {
  input: DeleteProductInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectByNodeIdArgs = {
  input: DeleteProjectByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectArgs = {
  input: DeleteProjectInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectMemberByNodeIdArgs = {
  input: DeleteProjectMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectMemberArgs = {
  input: DeleteProjectMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemByNodeIdArgs = {
  input: DeleteSystemByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemArgs = {
  input: DeleteSystemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemMemberByNodeIdArgs = {
  input: DeleteSystemMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemMemberArgs = {
  input: DeleteSystemMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishMessageArgs = {
  input: PublishInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGuaranteePdfArgs = {
  id: Scalars["Int"];
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
};

/** Usually a note added by someone at BMI who has been asked to approve a Guarantee.  It is likely to be either a short note of approval, saying something like, Approved, or Good Job, or a note of rejection, saying  something like, The photographs of the roof are not clear enough. */
export type Note = Node & {
  __typename?: "Note";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  authorId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** The body of the Note */
  body?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Note`. */
  author?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Note`. */
  project?: Maybe<Project>;
};

/** A condition to be used against `Note` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type NoteCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Note` */
export type NoteInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  authorId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** The body of the Note */
  body?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Note`. Fields that are set will be updated. */
export type NotePatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  authorId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** The body of the Note */
  body?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Note` values. */
export type NotesConnection = {
  __typename?: "NotesConnection";
  /** A list of `Note` objects. */
  nodes: Array<Note>;
  /** A list of edges which contains the `Note` and cursor to aid in pagination. */
  edges: Array<NotesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Note` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Note` edge in the connection. */
export type NotesEdge = {
  __typename?: "NotesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Note` at the end of the edge. */
  node: Note;
};

/** Methods to use when ordering `Note`. */
export enum NotesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  AuthorIdAsc = "AUTHOR_ID_ASC",
  AuthorIdDesc = "AUTHOR_ID_DESC",
  ProjectIdAsc = "PROJECT_ID_ASC",
  ProjectIdDesc = "PROJECT_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** An internal notification available to an end user */
export type Notification = Node & {
  __typename?: "Notification";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** The datetime stamp for when the message was sent */
  sendDate?: Maybe<Scalars["Datetime"]>;
  /** Whether the message still needs to be read */
  unread?: Maybe<Scalars["Boolean"]>;
  /** The body of the message */
  body?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Notification`. */
  account?: Maybe<Account>;
};

/**
 * A condition to be used against `Notification` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type NotificationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Notification` */
export type NotificationInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** The datetime stamp for when the message was sent */
  sendDate?: Maybe<Scalars["Datetime"]>;
  /** Whether the message still needs to be read */
  unread?: Maybe<Scalars["Boolean"]>;
  /** The body of the message */
  body?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Notification`. Fields that are set will be updated. */
export type NotificationPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** The datetime stamp for when the message was sent */
  sendDate?: Maybe<Scalars["Datetime"]>;
  /** Whether the message still needs to be read */
  unread?: Maybe<Scalars["Boolean"]>;
  /** The body of the message */
  body?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Notification` values. */
export type NotificationsConnection = {
  __typename?: "NotificationsConnection";
  /** A list of `Notification` objects. */
  nodes: Array<Notification>;
  /** A list of edges which contains the `Notification` and cursor to aid in pagination. */
  edges: Array<NotificationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Notification` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Notification` edge in the connection. */
export type NotificationsEdge = {
  __typename?: "NotificationsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Notification` at the end of the edge. */
  node: Notification;
};

/** Methods to use when ordering `Notification`. */
export enum NotificationsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  AccountIdAsc = "ACCOUNT_ID_ASC",
  AccountIdDesc = "ACCOUNT_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum Operation {
  Flat = "FLAT",
  Pitched = "PITCHED",
  Solar = "SOLAR"
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: "PageInfo";
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["Cursor"]>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["Cursor"]>;
};

export type Point = {
  __typename?: "Point";
  x: Scalars["Float"];
  y: Scalars["Float"];
};

export type PointInput = {
  x: Scalars["Float"];
  y: Scalars["Float"];
};

/** A product made by BMI */
export type Product = Node & {
  __typename?: "Product";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** A unique reference for the product known to BMI */
  bmiRef?: Maybe<Scalars["String"]>;
  /** The Products brand */
  brand?: Maybe<Scalars["String"]>;
  /** Short name for the product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the product is avialable when being selected or not */
  published?: Maybe<Scalars["Boolean"]>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** Reads and enables pagination through a set of `GuaranteedProduct`. */
  guaranteedProducts: GuaranteedProductsConnection;
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembers: SystemMembersConnection;
};

/** A product made by BMI */
export type ProductGuaranteedProductsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteedProductsOrderBy>>;
  condition?: Maybe<GuaranteedProductCondition>;
};

/** A product made by BMI */
export type ProductSystemMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<SystemMembersOrderBy>>;
  condition?: Maybe<SystemMemberCondition>;
};

/** A condition to be used against `Product` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProductCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Product` */
export type ProductInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** A unique reference for the product known to BMI */
  bmiRef?: Maybe<Scalars["String"]>;
  /** The Products brand */
  brand?: Maybe<Scalars["String"]>;
  /** Short name for the product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the product is avialable when being selected or not */
  published?: Maybe<Scalars["Boolean"]>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Product`. Fields that are set will be updated. */
export type ProductPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** A unique reference for the product known to BMI */
  bmiRef?: Maybe<Scalars["String"]>;
  /** The Products brand */
  brand?: Maybe<Scalars["String"]>;
  /** Short name for the product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the product is avialable when being selected or not */
  published?: Maybe<Scalars["Boolean"]>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Product` values. */
export type ProductsConnection = {
  __typename?: "ProductsConnection";
  /** A list of `Product` objects. */
  nodes: Array<Product>;
  /** A list of edges which contains the `Product` and cursor to aid in pagination. */
  edges: Array<ProductsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Product` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Product` edge in the connection. */
export type ProductsEdge = {
  __typename?: "ProductsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Product` at the end of the edge. */
  node: Product;
};

/** Methods to use when ordering `Product`. */
export enum ProductsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  MarketIdAsc = "MARKET_ID_ASC",
  MarketIdDesc = "MARKET_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type Project = Node & {
  __typename?: "Project";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** Short name for the Project */
  name?: Maybe<Scalars["String"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: Maybe<Scalars["String"]>;
  /** If this is true then the Project should have been hidden from users */
  hidden?: Maybe<Scalars["Boolean"]>;
  /** The number of square meters of roof that this project covers */
  roofArea?: Maybe<Scalars["Int"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owners Company if they have one */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project starts */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project expects to end. */
  endDate?: Maybe<Scalars["Datetime"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  /** Reads and enables pagination through a set of `Address`. */
  addresses: AddressesConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guarantees: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Note`. */
  notes: NotesConnection;
  /** Reads and enables pagination through a set of `ProjectMember`. */
  projectMembers: ProjectMembersConnection;
};

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type ProjectAddressesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AddressesOrderBy>>;
  condition?: Maybe<AddressCondition>;
};

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type ProjectGuaranteesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type ProjectNotesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotesOrderBy>>;
  condition?: Maybe<NoteCondition>;
};

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type ProjectProjectMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectMembersOrderBy>>;
  condition?: Maybe<ProjectMemberCondition>;
};

/** A condition to be used against `Project` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProjectCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Project` */
export type ProjectInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** Short name for the Project */
  name?: Maybe<Scalars["String"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: Maybe<Scalars["String"]>;
  /** If this is true then the Project should have been hidden from users */
  hidden?: Maybe<Scalars["Boolean"]>;
  /** The number of square meters of roof that this project covers */
  roofArea?: Maybe<Scalars["Int"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owners Company if they have one */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project starts */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project expects to end. */
  endDate?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection between a User and a Project. A connection between a user and a company. This relationship could be simplified as one to many at the moment, but there is already demand for a many to many relationship. */
export type ProjectMember = Node & {
  __typename?: "ProjectMember";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Project` that is related to this `ProjectMember`. */
  project?: Maybe<Project>;
  /** Reads a single `Account` that is related to this `ProjectMember`. */
  account?: Maybe<Account>;
};

/**
 * A condition to be used against `ProjectMember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ProjectMemberCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `ProjectMember` */
export type ProjectMemberInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `ProjectMember`. Fields that are set will be updated. */
export type ProjectMemberPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `ProjectMember` values. */
export type ProjectMembersConnection = {
  __typename?: "ProjectMembersConnection";
  /** A list of `ProjectMember` objects. */
  nodes: Array<ProjectMember>;
  /** A list of edges which contains the `ProjectMember` and cursor to aid in pagination. */
  edges: Array<ProjectMembersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ProjectMember` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `ProjectMember` edge in the connection. */
export type ProjectMembersEdge = {
  __typename?: "ProjectMembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `ProjectMember` at the end of the edge. */
  node: ProjectMember;
};

/** Methods to use when ordering `ProjectMember`. */
export enum ProjectMembersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  ProjectIdAsc = "PROJECT_ID_ASC",
  ProjectIdDesc = "PROJECT_ID_DESC",
  AccountIdAsc = "ACCOUNT_ID_ASC",
  AccountIdDesc = "ACCOUNT_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** Represents an update to a `Project`. Fields that are set will be updated. */
export type ProjectPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** Short name for the Project */
  name?: Maybe<Scalars["String"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: Maybe<Scalars["String"]>;
  /** If this is true then the Project should have been hidden from users */
  hidden?: Maybe<Scalars["Boolean"]>;
  /** The number of square meters of roof that this project covers */
  roofArea?: Maybe<Scalars["Int"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owners Company if they have one */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project starts */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project expects to end. */
  endDate?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Project` values. */
export type ProjectsConnection = {
  __typename?: "ProjectsConnection";
  /** A list of `Project` objects. */
  nodes: Array<Project>;
  /** A list of edges which contains the `Project` and cursor to aid in pagination. */
  edges: Array<ProjectsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Project` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Project` edge in the connection. */
export type ProjectsEdge = {
  __typename?: "ProjectsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Project` at the end of the edge. */
  node: Project;
};

/** Methods to use when ordering `Project`. */
export enum ProjectsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CompanyIdAsc = "COMPANY_ID_ASC",
  CompanyIdDesc = "COMPANY_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export type Publish = {
  __typename?: "Publish";
  title?: Maybe<Scalars["String"]>;
  text?: Maybe<Scalars["String"]>;
  html?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type PublishInput = {
  title?: Maybe<Scalars["String"]>;
  text?: Maybe<Scalars["String"]>;
  html?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type PublishOutput = {
  __typename?: "PublishOutput";
  messageId?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: "Query";
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars["ID"];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Reads and enables pagination through a set of `Account`. */
  accounts?: Maybe<AccountsConnection>;
  /** Reads and enables pagination through a set of `Address`. */
  addresses?: Maybe<AddressesConnection>;
  /** Reads and enables pagination through a set of `Certification`. */
  certifications?: Maybe<CertificationsConnection>;
  /** Reads and enables pagination through a set of `Company`. */
  companies?: Maybe<CompaniesConnection>;
  /** Reads and enables pagination through a set of `CompanyDocument`. */
  companyDocuments?: Maybe<CompanyDocumentsConnection>;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers?: Maybe<CompanyMembersConnection>;
  /** Reads and enables pagination through a set of `CompanyOperation`. */
  companyOperations?: Maybe<CompanyOperationsConnection>;
  /** Reads and enables pagination through a set of `EvidenceItem`. */
  evidenceItems?: Maybe<EvidenceItemsConnection>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guarantees?: Maybe<GuaranteesConnection>;
  /** Reads and enables pagination through a set of `GuaranteedProduct`. */
  guaranteedProducts?: Maybe<GuaranteedProductsConnection>;
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations?: Maybe<InvitationsConnection>;
  /** Reads and enables pagination through a set of `Market`. */
  markets?: Maybe<MarketsConnection>;
  /** Reads and enables pagination through a set of `Note`. */
  notes?: Maybe<NotesConnection>;
  /** Reads and enables pagination through a set of `Notification`. */
  notifications?: Maybe<NotificationsConnection>;
  /** Reads and enables pagination through a set of `Product`. */
  products?: Maybe<ProductsConnection>;
  /** Reads and enables pagination through a set of `Project`. */
  projects?: Maybe<ProjectsConnection>;
  /** Reads and enables pagination through a set of `ProjectMember`. */
  projectMembers?: Maybe<ProjectMembersConnection>;
  /** Reads and enables pagination through a set of `System`. */
  systems?: Maybe<SystemsConnection>;
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembers?: Maybe<SystemMembersConnection>;
  account?: Maybe<Account>;
  accountByDoceboUserId?: Maybe<Account>;
  address?: Maybe<Address>;
  certification?: Maybe<Certification>;
  company?: Maybe<Company>;
  companyDocument?: Maybe<CompanyDocument>;
  companyMember?: Maybe<CompanyMember>;
  companyOperation?: Maybe<CompanyOperation>;
  evidenceItem?: Maybe<EvidenceItem>;
  guarantee?: Maybe<Guarantee>;
  guaranteedProduct?: Maybe<GuaranteedProduct>;
  invitation?: Maybe<Invitation>;
  market?: Maybe<Market>;
  note?: Maybe<Note>;
  notification?: Maybe<Notification>;
  product?: Maybe<Product>;
  project?: Maybe<Project>;
  projectMember?: Maybe<ProjectMember>;
  system?: Maybe<System>;
  systemMember?: Maybe<SystemMember>;
  currentAccountEmail?: Maybe<Scalars["String"]>;
  currentAccountId?: Maybe<Scalars["Int"]>;
  currentCompany?: Maybe<Scalars["Int"]>;
  currentMarket?: Maybe<Scalars["Int"]>;
  isPartOfProject?: Maybe<IsPartOfProjectConnection>;
  isProjectEnabledByMarket?: Maybe<Scalars["Boolean"]>;
  /** Reads a single `Account` using its globally unique `ID`. */
  accountByNodeId?: Maybe<Account>;
  /** Reads a single `Address` using its globally unique `ID`. */
  addressByNodeId?: Maybe<Address>;
  /** Reads a single `Certification` using its globally unique `ID`. */
  certificationByNodeId?: Maybe<Certification>;
  /** Reads a single `Company` using its globally unique `ID`. */
  companyByNodeId?: Maybe<Company>;
  /** Reads a single `CompanyDocument` using its globally unique `ID`. */
  companyDocumentByNodeId?: Maybe<CompanyDocument>;
  /** Reads a single `CompanyMember` using its globally unique `ID`. */
  companyMemberByNodeId?: Maybe<CompanyMember>;
  /** Reads a single `CompanyOperation` using its globally unique `ID`. */
  companyOperationByNodeId?: Maybe<CompanyOperation>;
  /** Reads a single `EvidenceItem` using its globally unique `ID`. */
  evidenceItemByNodeId?: Maybe<EvidenceItem>;
  /** Reads a single `Guarantee` using its globally unique `ID`. */
  guaranteeByNodeId?: Maybe<Guarantee>;
  /** Reads a single `GuaranteedProduct` using its globally unique `ID`. */
  guaranteedProductByNodeId?: Maybe<GuaranteedProduct>;
  /** Reads a single `Invitation` using its globally unique `ID`. */
  invitationByNodeId?: Maybe<Invitation>;
  /** Reads a single `Market` using its globally unique `ID`. */
  marketByNodeId?: Maybe<Market>;
  /** Reads a single `Note` using its globally unique `ID`. */
  noteByNodeId?: Maybe<Note>;
  /** Reads a single `Notification` using its globally unique `ID`. */
  notificationByNodeId?: Maybe<Notification>;
  /** Reads a single `Product` using its globally unique `ID`. */
  productByNodeId?: Maybe<Product>;
  /** Reads a single `Project` using its globally unique `ID`. */
  projectByNodeId?: Maybe<Project>;
  /** Reads a single `ProjectMember` using its globally unique `ID`. */
  projectMemberByNodeId?: Maybe<ProjectMember>;
  /** Reads a single `System` using its globally unique `ID`. */
  systemByNodeId?: Maybe<System>;
  /** Reads a single `SystemMember` using its globally unique `ID`. */
  systemMemberByNodeId?: Maybe<SystemMember>;
  /**
   * Fetches a list of entities using their representations; used for Apollo
   * Federation.
   * @deprecated Only Apollo Federation should use this
   */
  _entities: Array<Maybe<_Entity>>;
  /**
   * Entrypoint for Apollo Federation to determine more information about
   * this service.
   * @deprecated Only Apollo Federation should use this
   */
  _service: _Service;
};

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AccountsOrderBy>>;
  condition?: Maybe<AccountCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAddressesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AddressesOrderBy>>;
  condition?: Maybe<AddressCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCertificationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CertificationsOrderBy>>;
  condition?: Maybe<CertificationCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompaniesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
  condition?: Maybe<CompanyCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyDocumentsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyDocumentsOrderBy>>;
  condition?: Maybe<CompanyDocumentCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
  condition?: Maybe<CompanyMemberCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyOperationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyOperationsOrderBy>>;
  condition?: Maybe<CompanyOperationCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceItemsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<EvidenceItemsOrderBy>>;
  condition?: Maybe<EvidenceItemCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteedProductsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteedProductsOrderBy>>;
  condition?: Maybe<GuaranteedProductCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryInvitationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
  condition?: Maybe<InvitationCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<MarketsOrderBy>>;
  condition?: Maybe<MarketCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryNotesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotesOrderBy>>;
  condition?: Maybe<NoteCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryNotificationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryProductsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProductsOrderBy>>;
  condition?: Maybe<ProductCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
  condition?: Maybe<ProjectCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectMembersOrderBy>>;
  condition?: Maybe<ProjectMemberCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<SystemsOrderBy>>;
  condition?: Maybe<SystemCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<SystemMembersOrderBy>>;
  condition?: Maybe<SystemMemberCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountByDoceboUserIdArgs = {
  doceboUserId: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryAddressArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCertificationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyDocumentArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyOperationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceItemArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteedProductArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryInvitationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNoteArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNotificationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProductArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectMemberArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemMemberArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryIsPartOfProjectArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryAddressByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCertificationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyDocumentByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyOperationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceItemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteedProductByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryInvitationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNoteByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNotificationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProductByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type Query_EntitiesArgs = {
  representations: Array<Scalars["_Any"]>;
};

export enum RequestStatus {
  New = "NEW",
  Submitted = "SUBMITTED",
  Review = "REVIEW",
  Rejected = "REJECTED",
  Approved = "APPROVED"
}

export enum Role {
  SuperAdmin = "SUPER_ADMIN",
  MarketAdmin = "MARKET_ADMIN",
  Installer = "INSTALLER",
  CompanyAdmin = "COMPANY_ADMIN"
}

/** A collection of products that can be guaranteed as a system */
export type System = Node & {
  __typename?: "System";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** A unique reference for the system known to BMI */
  bmiRef?: Maybe<Scalars["String"]>;
  /** Short name for the System */
  name?: Maybe<Scalars["String"]>;
  /** A description for the System */
  description?: Maybe<Scalars["String"]>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  /** If true this system is on that is available for users to select when applying for a system or solution guarantee */
  published?: Maybe<Scalars["Boolean"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guarantees: GuaranteesConnection;
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembers: SystemMembersConnection;
};

/** A collection of products that can be guaranteed as a system */
export type SystemGuaranteesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

/** A collection of products that can be guaranteed as a system */
export type SystemSystemMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<SystemMembersOrderBy>>;
  condition?: Maybe<SystemMemberCondition>;
};

/** A condition to be used against `System` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SystemCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `System` */
export type SystemInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** A unique reference for the system known to BMI */
  bmiRef?: Maybe<Scalars["String"]>;
  /** Short name for the System */
  name?: Maybe<Scalars["String"]>;
  /** A description for the System */
  description?: Maybe<Scalars["String"]>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  /** If true this system is on that is available for users to select when applying for a system or solution guarantee */
  published?: Maybe<Scalars["Boolean"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A system product pair */
export type SystemMember = Node & {
  __typename?: "SystemMember";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  productId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `System` that is related to this `SystemMember`. */
  system?: Maybe<System>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  product?: Maybe<Product>;
};

/**
 * A condition to be used against `SystemMember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SystemMemberCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `systemId` field. */
  systemId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `productId` field. */
  productId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `SystemMember` */
export type SystemMemberInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  productId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `SystemMember`. Fields that are set will be updated. */
export type SystemMemberPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  productId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `SystemMember` values. */
export type SystemMembersConnection = {
  __typename?: "SystemMembersConnection";
  /** A list of `SystemMember` objects. */
  nodes: Array<SystemMember>;
  /** A list of edges which contains the `SystemMember` and cursor to aid in pagination. */
  edges: Array<SystemMembersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SystemMember` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `SystemMember` edge in the connection. */
export type SystemMembersEdge = {
  __typename?: "SystemMembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `SystemMember` at the end of the edge. */
  node: SystemMember;
};

/** Methods to use when ordering `SystemMember`. */
export enum SystemMembersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  SystemIdAsc = "SYSTEM_ID_ASC",
  SystemIdDesc = "SYSTEM_ID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** Represents an update to a `System`. Fields that are set will be updated. */
export type SystemPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** A unique reference for the system known to BMI */
  bmiRef?: Maybe<Scalars["String"]>;
  /** Short name for the System */
  name?: Maybe<Scalars["String"]>;
  /** A description for the System */
  description?: Maybe<Scalars["String"]>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  /** If true this system is on that is available for users to select when applying for a system or solution guarantee */
  published?: Maybe<Scalars["Boolean"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `System` values. */
export type SystemsConnection = {
  __typename?: "SystemsConnection";
  /** A list of `System` objects. */
  nodes: Array<System>;
  /** A list of edges which contains the `System` and cursor to aid in pagination. */
  edges: Array<SystemsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `System` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `System` edge in the connection. */
export type SystemsEdge = {
  __typename?: "SystemsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `System` at the end of the edge. */
  node: System;
};

/** Methods to use when ordering `System`. */
export enum SystemsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  MarketIdAsc = "MARKET_ID_ASC",
  MarketIdDesc = "MARKET_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum Technology {
  Flat = "FLAT",
  Pitched = "PITCHED",
  Other = "OTHER"
}

export enum Tier {
  T1 = "T1",
  T2 = "T2",
  T3 = "T3",
  T4 = "T4"
}

/** All input for the `updateAccountByDoceboUserId` mutation. */
export type UpdateAccountByDoceboUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
  /** User account in Docebo */
  doceboUserId: Scalars["Int"];
};

/** All input for the `updateAccountByNodeId` mutation. */
export type UpdateAccountByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Account` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
};

/** All input for the `updateAccount` mutation. */
export type UpdateAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Account` mutation. */
export type UpdateAccountPayload = {
  __typename?: "UpdateAccountPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Account` that was updated by this mutation. */
  account?: Maybe<Account>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
};

/** The output of our update `Account` mutation. */
export type UpdateAccountPayloadAccountEdgeArgs = {
  orderBy?: Maybe<Array<AccountsOrderBy>>;
};

/** All input for the `updateAddressByNodeId` mutation. */
export type UpdateAddressByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Address` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Address` being updated. */
  patch: AddressPatch;
};

/** All input for the `updateAddress` mutation. */
export type UpdateAddressInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Address` being updated. */
  patch: AddressPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Address` mutation. */
export type UpdateAddressPayload = {
  __typename?: "UpdateAddressPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Address` that was updated by this mutation. */
  address?: Maybe<Address>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Project` that is related to this `Address`. */
  project?: Maybe<Project>;
  /** Reads a single `Company` that is related to this `Address`. */
  company?: Maybe<Company>;
  /** An edge for our `Address`. May be used by Relay 1. */
  addressEdge?: Maybe<AddressesEdge>;
};

/** The output of our update `Address` mutation. */
export type UpdateAddressPayloadAddressEdgeArgs = {
  orderBy?: Maybe<Array<AddressesOrderBy>>;
};

/** All input for the `updateCertificationByNodeId` mutation. */
export type UpdateCertificationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Certification` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Certification` being updated. */
  patch: CertificationPatch;
};

/** All input for the `updateCertification` mutation. */
export type UpdateCertificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Certification` being updated. */
  patch: CertificationPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Certification` mutation. */
export type UpdateCertificationPayload = {
  __typename?: "UpdateCertificationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Certification` that was updated by this mutation. */
  certification?: Maybe<Certification>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Certification`. */
  doceboUser?: Maybe<Account>;
  /** An edge for our `Certification`. May be used by Relay 1. */
  certificationEdge?: Maybe<CertificationsEdge>;
};

/** The output of our update `Certification` mutation. */
export type UpdateCertificationPayloadCertificationEdgeArgs = {
  orderBy?: Maybe<Array<CertificationsOrderBy>>;
};

/** All input for the `updateCompanyByNodeId` mutation. */
export type UpdateCompanyByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Company` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
};

/** All input for the `updateCompanyDocumentByNodeId` mutation. */
export type UpdateCompanyDocumentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyDocument` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CompanyDocument` being updated. */
  patch: CompanyDocumentPatch;
};

/** All input for the `updateCompanyDocument` mutation. */
export type UpdateCompanyDocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CompanyDocument` being updated. */
  patch: CompanyDocumentPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `CompanyDocument` mutation. */
export type UpdateCompanyDocumentPayload = {
  __typename?: "UpdateCompanyDocumentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyDocument` that was updated by this mutation. */
  companyDocument?: Maybe<CompanyDocument>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
  /** An edge for our `CompanyDocument`. May be used by Relay 1. */
  companyDocumentEdge?: Maybe<CompanyDocumentsEdge>;
};

/** The output of our update `CompanyDocument` mutation. */
export type UpdateCompanyDocumentPayloadCompanyDocumentEdgeArgs = {
  orderBy?: Maybe<Array<CompanyDocumentsOrderBy>>;
};

/** All input for the `updateCompany` mutation. */
export type UpdateCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `updateCompanyMemberByNodeId` mutation. */
export type UpdateCompanyMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyMember` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CompanyMember` being updated. */
  patch: CompanyMemberPatch;
};

/** All input for the `updateCompanyMember` mutation. */
export type UpdateCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CompanyMember` being updated. */
  patch: CompanyMemberPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `CompanyMember` mutation. */
export type UpdateCompanyMemberPayload = {
  __typename?: "UpdateCompanyMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyMember` that was updated by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMembersEdge>;
};

/** The output of our update `CompanyMember` mutation. */
export type UpdateCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
};

/** All input for the `updateCompanyOperationByNodeId` mutation. */
export type UpdateCompanyOperationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyOperation` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CompanyOperation` being updated. */
  patch: CompanyOperationPatch;
};

/** All input for the `updateCompanyOperation` mutation. */
export type UpdateCompanyOperationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CompanyOperation` being updated. */
  patch: CompanyOperationPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `CompanyOperation` mutation. */
export type UpdateCompanyOperationPayload = {
  __typename?: "UpdateCompanyOperationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CompanyOperation` that was updated by this mutation. */
  companyOperation?: Maybe<CompanyOperation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `CompanyOperation`. */
  companyByCompany?: Maybe<Company>;
  /** An edge for our `CompanyOperation`. May be used by Relay 1. */
  companyOperationEdge?: Maybe<CompanyOperationsEdge>;
};

/** The output of our update `CompanyOperation` mutation. */
export type UpdateCompanyOperationPayloadCompanyOperationEdgeArgs = {
  orderBy?: Maybe<Array<CompanyOperationsOrderBy>>;
};

/** The output of our update `Company` mutation. */
export type UpdateCompanyPayload = {
  __typename?: "UpdateCompanyPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Company` that was updated by this mutation. */
  company?: Maybe<Company>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
};

/** The output of our update `Company` mutation. */
export type UpdateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
};

/** All input for the `updateEvidenceItemByNodeId` mutation. */
export type UpdateEvidenceItemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `EvidenceItem` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `EvidenceItem` being updated. */
  patch: EvidenceItemPatch;
};

/** All input for the `updateEvidenceItem` mutation. */
export type UpdateEvidenceItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `EvidenceItem` being updated. */
  patch: EvidenceItemPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `EvidenceItem` mutation. */
export type UpdateEvidenceItemPayload = {
  __typename?: "UpdateEvidenceItemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `EvidenceItem` that was updated by this mutation. */
  evidenceItem?: Maybe<EvidenceItem>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Guarantee` that is related to this `EvidenceItem`. */
  guarantee?: Maybe<Guarantee>;
  /** An edge for our `EvidenceItem`. May be used by Relay 1. */
  evidenceItemEdge?: Maybe<EvidenceItemsEdge>;
};

/** The output of our update `EvidenceItem` mutation. */
export type UpdateEvidenceItemPayloadEvidenceItemEdgeArgs = {
  orderBy?: Maybe<Array<EvidenceItemsOrderBy>>;
};

/** All input for the `updateGuaranteeByNodeId` mutation. */
export type UpdateGuaranteeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Guarantee` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Guarantee` being updated. */
  patch: GuaranteePatch;
};

/** All input for the `updateGuarantee` mutation. */
export type UpdateGuaranteeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Guarantee` being updated. */
  patch: GuaranteePatch;
  /** Primary key - starts at 6100 */
  id: Scalars["Int"];
};

/** The output of our update `Guarantee` mutation. */
export type UpdateGuaranteePayload = {
  __typename?: "UpdateGuaranteePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Guarantee` that was updated by this mutation. */
  guarantee?: Maybe<Guarantee>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  responsibleInstallerAccount?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  system?: Maybe<System>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
};

/** The output of our update `Guarantee` mutation. */
export type UpdateGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
};

/** All input for the `updateGuaranteedProductByNodeId` mutation. */
export type UpdateGuaranteedProductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `GuaranteedProduct` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `GuaranteedProduct` being updated. */
  patch: GuaranteedProductPatch;
};

/** All input for the `updateGuaranteedProduct` mutation. */
export type UpdateGuaranteedProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `GuaranteedProduct` being updated. */
  patch: GuaranteedProductPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `GuaranteedProduct` mutation. */
export type UpdateGuaranteedProductPayload = {
  __typename?: "UpdateGuaranteedProductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `GuaranteedProduct` that was updated by this mutation. */
  guaranteedProduct?: Maybe<GuaranteedProduct>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Product` that is related to this `GuaranteedProduct`. */
  product?: Maybe<Product>;
  /** Reads a single `Guarantee` that is related to this `GuaranteedProduct`. */
  guarantee?: Maybe<Guarantee>;
  /** An edge for our `GuaranteedProduct`. May be used by Relay 1. */
  guaranteedProductEdge?: Maybe<GuaranteedProductsEdge>;
};

/** The output of our update `GuaranteedProduct` mutation. */
export type UpdateGuaranteedProductPayloadGuaranteedProductEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteedProductsOrderBy>>;
};

/** All input for the `updateInvitationByNodeId` mutation. */
export type UpdateInvitationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Invitation` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Invitation` being updated. */
  patch: InvitationPatch;
};

/** All input for the `updateInvitation` mutation. */
export type UpdateInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Invitation` being updated. */
  patch: InvitationPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Invitation` mutation. */
export type UpdateInvitationPayload = {
  __typename?: "UpdateInvitationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Invitation` that was updated by this mutation. */
  invitation?: Maybe<Invitation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Invitation`. */
  senderAccount?: Maybe<Account>;
  /** Reads a single `Company` that is related to this `Invitation`. */
  company?: Maybe<Company>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationsEdge>;
};

/** The output of our update `Invitation` mutation. */
export type UpdateInvitationPayloadInvitationEdgeArgs = {
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
};

/** All input for the `updateMarketByNodeId` mutation. */
export type UpdateMarketByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Market` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Market` being updated. */
  patch: MarketPatch;
};

/** All input for the `updateMarket` mutation. */
export type UpdateMarketInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Market` being updated. */
  patch: MarketPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Market` mutation. */
export type UpdateMarketPayload = {
  __typename?: "UpdateMarketPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Market` that was updated by this mutation. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Market`. May be used by Relay 1. */
  marketEdge?: Maybe<MarketsEdge>;
};

/** The output of our update `Market` mutation. */
export type UpdateMarketPayloadMarketEdgeArgs = {
  orderBy?: Maybe<Array<MarketsOrderBy>>;
};

/** All input for the `updateNoteByNodeId` mutation. */
export type UpdateNoteByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Note` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Note` being updated. */
  patch: NotePatch;
};

/** All input for the `updateNote` mutation. */
export type UpdateNoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Note` being updated. */
  patch: NotePatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Note` mutation. */
export type UpdateNotePayload = {
  __typename?: "UpdateNotePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Note` that was updated by this mutation. */
  note?: Maybe<Note>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Note`. */
  author?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Note`. */
  project?: Maybe<Project>;
  /** An edge for our `Note`. May be used by Relay 1. */
  noteEdge?: Maybe<NotesEdge>;
};

/** The output of our update `Note` mutation. */
export type UpdateNotePayloadNoteEdgeArgs = {
  orderBy?: Maybe<Array<NotesOrderBy>>;
};

/** All input for the `updateNotificationByNodeId` mutation. */
export type UpdateNotificationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Notification` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Notification` being updated. */
  patch: NotificationPatch;
};

/** All input for the `updateNotification` mutation. */
export type UpdateNotificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Notification` being updated. */
  patch: NotificationPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Notification` mutation. */
export type UpdateNotificationPayload = {
  __typename?: "UpdateNotificationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Notification` that was updated by this mutation. */
  notification?: Maybe<Notification>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Notification`. */
  account?: Maybe<Account>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
};

/** The output of our update `Notification` mutation. */
export type UpdateNotificationPayloadNotificationEdgeArgs = {
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
};

/** All input for the `updateProductByNodeId` mutation. */
export type UpdateProductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Product` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Product` being updated. */
  patch: ProductPatch;
};

/** All input for the `updateProduct` mutation. */
export type UpdateProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Product` being updated. */
  patch: ProductPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Product` mutation. */
export type UpdateProductPayload = {
  __typename?: "UpdateProductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Product` that was updated by this mutation. */
  product?: Maybe<Product>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductsEdge>;
};

/** The output of our update `Product` mutation. */
export type UpdateProductPayloadProductEdgeArgs = {
  orderBy?: Maybe<Array<ProductsOrderBy>>;
};

/** All input for the `updateProjectByNodeId` mutation. */
export type UpdateProjectByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Project` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Project` being updated. */
  patch: ProjectPatch;
};

/** All input for the `updateProject` mutation. */
export type UpdateProjectInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Project` being updated. */
  patch: ProjectPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `updateProjectMemberByNodeId` mutation. */
export type UpdateProjectMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `ProjectMember` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `ProjectMember` being updated. */
  patch: ProjectMemberPatch;
};

/** All input for the `updateProjectMember` mutation. */
export type UpdateProjectMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `ProjectMember` being updated. */
  patch: ProjectMemberPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `ProjectMember` mutation. */
export type UpdateProjectMemberPayload = {
  __typename?: "UpdateProjectMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `ProjectMember` that was updated by this mutation. */
  projectMember?: Maybe<ProjectMember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Project` that is related to this `ProjectMember`. */
  project?: Maybe<Project>;
  /** Reads a single `Account` that is related to this `ProjectMember`. */
  account?: Maybe<Account>;
  /** An edge for our `ProjectMember`. May be used by Relay 1. */
  projectMemberEdge?: Maybe<ProjectMembersEdge>;
};

/** The output of our update `ProjectMember` mutation. */
export type UpdateProjectMemberPayloadProjectMemberEdgeArgs = {
  orderBy?: Maybe<Array<ProjectMembersOrderBy>>;
};

/** The output of our update `Project` mutation. */
export type UpdateProjectPayload = {
  __typename?: "UpdateProjectPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Project` that was updated by this mutation. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectsEdge>;
};

/** The output of our update `Project` mutation. */
export type UpdateProjectPayloadProjectEdgeArgs = {
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
};

/** All input for the `updateSystemByNodeId` mutation. */
export type UpdateSystemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `System` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `System` being updated. */
  patch: SystemPatch;
};

/** All input for the `updateSystem` mutation. */
export type UpdateSystemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `System` being updated. */
  patch: SystemPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `updateSystemMemberByNodeId` mutation. */
export type UpdateSystemMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `SystemMember` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `SystemMember` being updated. */
  patch: SystemMemberPatch;
};

/** All input for the `updateSystemMember` mutation. */
export type UpdateSystemMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `SystemMember` being updated. */
  patch: SystemMemberPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `SystemMember` mutation. */
export type UpdateSystemMemberPayload = {
  __typename?: "UpdateSystemMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `SystemMember` that was updated by this mutation. */
  systemMember?: Maybe<SystemMember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `System` that is related to this `SystemMember`. */
  system?: Maybe<System>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  product?: Maybe<Product>;
  /** An edge for our `SystemMember`. May be used by Relay 1. */
  systemMemberEdge?: Maybe<SystemMembersEdge>;
};

/** The output of our update `SystemMember` mutation. */
export type UpdateSystemMemberPayloadSystemMemberEdgeArgs = {
  orderBy?: Maybe<Array<SystemMembersOrderBy>>;
};

/** The output of our update `System` mutation. */
export type UpdateSystemPayload = {
  __typename?: "UpdateSystemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `System` that was updated by this mutation. */
  system?: Maybe<System>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** An edge for our `System`. May be used by Relay 1. */
  systemEdge?: Maybe<SystemsEdge>;
};

/** The output of our update `System` mutation. */
export type UpdateSystemPayloadSystemEdgeArgs = {
  orderBy?: Maybe<Array<SystemsOrderBy>>;
};

/** A union of all federated types (those that use the @key directive). */
export type _Entity =
  | Account
  | Market
  | Company
  | Address
  | Project
  | Guarantee
  | System
  | SystemMember
  | Product
  | GuaranteedProduct
  | EvidenceItem
  | Note
  | ProjectMember
  | CompanyDocument
  | CompanyMember
  | CompanyOperation
  | Invitation
  | Certification
  | Notification;

/** Describes our federated service. */
export type _Service = {
  __typename?: "_Service";
  /**
   * The GraphQL Schema Language definiton of our endpoint including the
   * Apollo Federation directives (but not their definitions or the special
   * Apollo Federation fields).
   * @deprecated Only Apollo Federation should use this
   */
  sdl?: Maybe<Scalars["String"]>;
};
