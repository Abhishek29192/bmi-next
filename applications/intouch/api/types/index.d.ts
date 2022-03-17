export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: any;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z,
   *     compliant with the 'date-time' format outlined in section 5.6 of
   *     the RFC 3339 profile of the ISO 8601 standard for representation
   *     of dates and times using the Gregorian calendar.
   */
  DateTime: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: any;
  /** The 'Dimension' type represents dimensions as whole numeric values between `1` and `4000`. */
  Dimension: any;
  /** The 'HexColor' type represents color in `rgb:ffffff` string format. */
  HexColor: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The 'Quality' type represents quality as whole numeric values between `1` and `100`. */
  Quality: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
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
  /** Reads and enables pagination through a set of `Note`. */
  authoredNotes: NotesConnection;
  /** Reads and enables pagination through a set of `Certification`. */
  certificationsByDoceboUserId: CertificationsConnection;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMembersConnection;
  /** When the account was created */
  created?: Maybe<Scalars["Datetime"]>;
  createdAt: Scalars["Datetime"];
  /** User account in Docebo */
  doceboUserId?: Maybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: Maybe<Scalars["String"]>;
  /** The email address associated with the account */
  email: Scalars["String"];
  /** First name */
  firstName?: Maybe<Scalars["String"]>;
  formattedRole?: Maybe<Scalars["String"]>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByRequestorAccountId: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByReviewerAccountId: GuaranteesConnection;
  /** Primary key */
  id: Scalars["Int"];
  /** Reads and enables pagination through a set of `Invitation`. */
  invitationsBySenderAccountId: InvitationsConnection;
  /** Last name */
  lastName?: Maybe<Scalars["String"]>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: Maybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Reads and enables pagination through a set of `Notification`. */
  notifications: NotificationsConnection;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: Maybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  /** Reads and enables pagination through a set of `ProjectMember`. */
  projectMembers: ProjectMembersConnection;
  /** ek */
  role?: Maybe<Role>;
  signedPhotoUrl?: Maybe<Scalars["String"]>;
  /** ek */
  status?: Maybe<AccountStatus>;
  updatedAt: Scalars["Datetime"];
};

/** An InTouch account */
export type AccountAuthoredNotesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<NoteCondition>;
  filter?: InputMaybe<NoteFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
};

/** An InTouch account */
export type AccountCertificationsByDoceboUserIdArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CertificationCondition>;
  filter?: InputMaybe<CertificationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CertificationsOrderBy>>;
};

/** An InTouch account */
export type AccountCompanyMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyMemberCondition>;
  filter?: InputMaybe<CompanyMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompanyMembersOrderBy>>;
};

/** An InTouch account */
export type AccountGuaranteesByRequestorAccountIdArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<GuaranteeCondition>;
  filter?: InputMaybe<GuaranteeFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** An InTouch account */
export type AccountGuaranteesByReviewerAccountIdArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<GuaranteeCondition>;
  filter?: InputMaybe<GuaranteeFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** An InTouch account */
export type AccountInvitationsBySenderAccountIdArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<InvitationCondition>;
  filter?: InputMaybe<InvitationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};

/** An InTouch account */
export type AccountNotificationsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<NotificationCondition>;
  filter?: InputMaybe<NotificationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};

/** An InTouch account */
export type AccountProjectMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProjectMemberCondition>;
  filter?: InputMaybe<ProjectMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProjectMembersOrderBy>>;
};

/** The fields on `account` to look up the row to connect. */
export type AccountAccountDoceboUserIdKeyConnect = {
  /** User account in Docebo */
  doceboUserId: Scalars["Int"];
};

/** The fields on `account` to look up the row to delete. */
export type AccountAccountDoceboUserIdKeyDelete = {
  /** User account in Docebo */
  doceboUserId: Scalars["Int"];
};

/** The fields on `account` to look up the row to connect. */
export type AccountAccountEmailKeyConnect = {
  /** The email address associated with the account */
  email: Scalars["String"];
};

/** The fields on `account` to look up the row to delete. */
export type AccountAccountEmailKeyDelete = {
  /** The email address associated with the account */
  email: Scalars["String"];
};

/** The fields on `account` to look up the row to connect. */
export type AccountAccountPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `account` to look up the row to delete. */
export type AccountAccountPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** A condition to be used against `Account` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AccountCondition = {
  /** Checks for equality with the object’s `doceboUserId` field. */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `Account` object types. All fields are combined with a logical ‘and.’ */
export type AccountFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccountFilter>>;
  /** Filter by the object’s `doceboUserId` field. */
  doceboUserId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `email` field. */
  email?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `marketId` field. */
  marketId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<AccountFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccountFilter>>;
};

/** An input for mutations affecting `Account` */
export type AccountInput = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email: Scalars["String"];
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  marketCode?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `market` in the `AccountInput` mutation. */
export type AccountMarketIdFkeyInput = {
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDomain?: InputMaybe<MarketMarketDomainKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectById?: InputMaybe<MarketMarketPkeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<MarketNodeIdConnect>;
  /** A `MarketInput` object that will be created and connected to this object. */
  create?: InputMaybe<AccountMarketIdFkeyMarketCreateInput>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDomain?: InputMaybe<MarketMarketDomainKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteById?: InputMaybe<MarketMarketPkeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<MarketNodeIdDelete>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDoceboCatalogueId?: InputMaybe<MarketOnAccountForAccountMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDomain?: InputMaybe<MarketOnAccountForAccountMarketIdFkeyUsingMarketDomainKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateById?: InputMaybe<MarketOnAccountForAccountMarketIdFkeyUsingMarketPkeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<AccountOnAccountForAccountMarketIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `account` in the `MarketInput` mutation. */
export type AccountMarketIdFkeyInverseInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<
    Array<AccountAccountDoceboUserIdKeyConnect>
  >;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<Array<AccountAccountEmailKeyConnect>>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<Array<AccountAccountPkeyConnect>>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<AccountNodeIdConnect>>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<Array<AccountAccountDoceboUserIdKeyDelete>>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<Array<AccountAccountEmailKeyDelete>>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<AccountAccountPkeyDelete>>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<AccountNodeIdDelete>>;
  /** Flag indicating whether all other `account` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<
    Array<AccountOnAccountForAccountMarketIdFkeyUsingAccountDoceboUserIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<
    Array<AccountOnAccountForAccountMarketIdFkeyUsingAccountEmailKeyUpdate>
  >;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<AccountOnAccountForAccountMarketIdFkeyUsingAccountPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<MarketOnAccountForAccountMarketIdFkeyNodeIdUpdate>
  >;
};

/** The `market` to be created by this mutation. */
export type AccountMarketIdFkeyMarketCreateInput = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language: Language;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type AccountNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `account` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type AccountNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `account` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type AccountOnAccountForAccountMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `market` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: MarketPatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnAccountForAccountMarketIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnAccountForAccountMarketIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnAccountForAccountMarketIdFkeyUsingAccountEmailKeyUpdate = {
  /** The email address associated with the account */
  email: Scalars["String"];
  /** An object where the defined keys will be set on the `account` being updated. */
  patch: UpdateAccountOnAccountForAccountMarketIdFkeyPatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnAccountForAccountMarketIdFkeyUsingAccountPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `account` being updated. */
  patch: UpdateAccountOnAccountForAccountMarketIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type AccountOnCertificationForCertificationDoceboUserIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `certification` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `certification` being updated. */
    patch: CertificationPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnCertificationForCertificationDoceboUserIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnCertificationForCertificationDoceboUserIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnCertificationForCertificationDoceboUserIdFkeyUsingAccountEmailKeyUpdate =
  {
    /** The email address associated with the account */
    email: Scalars["String"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnCertificationForCertificationDoceboUserIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnCertificationForCertificationDoceboUserIdFkeyUsingAccountPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnCertificationForCertificationDoceboUserIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AccountOnCompanyMemberForCompanyMemberAccountIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `companyMember` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `companyMember` being updated. */
  patch: CompanyMemberPatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnCompanyMemberForCompanyMemberAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnCompanyMemberForCompanyMemberAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnCompanyMemberForCompanyMemberAccountIdFkeyUsingAccountEmailKeyUpdate =
  {
    /** The email address associated with the account */
    email: Scalars["String"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnCompanyMemberForCompanyMemberAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnCompanyMemberForCompanyMemberAccountIdFkeyUsingAccountPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnCompanyMemberForCompanyMemberAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `guarantee` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `guarantee` being updated. */
  patch: GuaranteePatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingAccountEmailKeyUpdate =
  {
    /** The email address associated with the account */
    email: Scalars["String"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingAccountPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `guarantee` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `guarantee` being updated. */
  patch: GuaranteePatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingAccountEmailKeyUpdate =
  {
    /** The email address associated with the account */
    email: Scalars["String"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingAccountPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AccountOnInvitationForInvitationSenderAccountIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `invitation` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `invitation` being updated. */
  patch: InvitationPatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnInvitationForInvitationSenderAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnInvitationForInvitationSenderAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnInvitationForInvitationSenderAccountIdFkeyUsingAccountEmailKeyUpdate =
  {
    /** The email address associated with the account */
    email: Scalars["String"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnInvitationForInvitationSenderAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnInvitationForInvitationSenderAccountIdFkeyUsingAccountPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnInvitationForInvitationSenderAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AccountOnNoteForNoteAuthorIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `note` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `note` being updated. */
  patch: NotePatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnNoteForNoteAuthorIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnNoteForNoteAuthorIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnNoteForNoteAuthorIdFkeyUsingAccountEmailKeyUpdate = {
  /** The email address associated with the account */
  email: Scalars["String"];
  /** An object where the defined keys will be set on the `account` being updated. */
  patch: UpdateAccountOnNoteForNoteAuthorIdFkeyPatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnNoteForNoteAuthorIdFkeyUsingAccountPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `account` being updated. */
  patch: UpdateAccountOnNoteForNoteAuthorIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type AccountOnNotificationForNotificationAccountIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `notification` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: NotificationPatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnNotificationForNotificationAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnNotificationForNotificationAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnNotificationForNotificationAccountIdFkeyUsingAccountEmailKeyUpdate =
  {
    /** The email address associated with the account */
    email: Scalars["String"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnNotificationForNotificationAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnNotificationForNotificationAccountIdFkeyUsingAccountPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnNotificationForNotificationAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AccountOnProjectMemberForProjectMemberAccountIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `projectMember` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `projectMember` being updated. */
  patch: ProjectMemberPatch;
};

/** The fields on `account` to look up the row to update. */
export type AccountOnProjectMemberForProjectMemberAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate =
  {
    /** User account in Docebo */
    doceboUserId: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnProjectMemberForProjectMemberAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnProjectMemberForProjectMemberAccountIdFkeyUsingAccountEmailKeyUpdate =
  {
    /** The email address associated with the account */
    email: Scalars["String"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnProjectMemberForProjectMemberAccountIdFkeyPatch;
  };

/** The fields on `account` to look up the row to update. */
export type AccountOnProjectMemberForProjectMemberAccountIdFkeyUsingAccountPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: UpdateAccountOnProjectMemberForProjectMemberAccountIdFkeyPatch;
  };

/** Represents an update to a `Account`. Fields that are set will be updated. */
export type AccountPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

export type AccountStatus = "ACTIVE" | "NEW" | "SUSPENDED";

/** A connection to a list of `Account` values. */
export type AccountsConnection = {
  __typename?: "AccountsConnection";
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: Array<AccountsEdge>;
  /** A list of `Account` objects. */
  nodes: Array<Account>;
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
export type AccountsOrderBy =
  | "DOCEBO_USER_ID_ASC"
  | "DOCEBO_USER_ID_DESC"
  | "EMAIL_ASC"
  | "EMAIL_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A generic address */
export type Address = Node & {
  __typename?: "Address";
  /** Reads and enables pagination through a set of `Company`. */
  companiesByRegisteredAddressId: CompaniesConnection;
  /** Reads and enables pagination through a set of `Company`. */
  companiesByTradingAddressId: CompaniesConnection;
  /** The coordinates on a map of the world */
  coordinates?: Maybe<Point>;
  /** The country for this address */
  country?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  /** First line of this address */
  firstLine?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** The postcode for this address */
  postcode?: Maybe<Scalars["String"]>;
  /** Reads and enables pagination through a set of `Project`. */
  projectsByBuildingOwnerAddressId: ProjectsConnection;
  /** Reads and enables pagination through a set of `Project`. */
  projectsBySiteAddressId: ProjectsConnection;
  /** The region if relevant */
  region?: Maybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: Maybe<Scalars["String"]>;
  /** The postal town */
  town?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
};

/** A generic address */
export type AddressCompaniesByRegisteredAddressIdArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyCondition>;
  filter?: InputMaybe<CompanyFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompaniesOrderBy>>;
};

/** A generic address */
export type AddressCompaniesByTradingAddressIdArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyCondition>;
  filter?: InputMaybe<CompanyFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompaniesOrderBy>>;
};

/** A generic address */
export type AddressProjectsByBuildingOwnerAddressIdArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProjectCondition>;
  filter?: InputMaybe<ProjectFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProjectsOrderBy>>;
};

/** A generic address */
export type AddressProjectsBySiteAddressIdArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProjectCondition>;
  filter?: InputMaybe<ProjectFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProjectsOrderBy>>;
};

/** The fields on `address` to look up the row to connect. */
export type AddressAddressPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `address` to look up the row to delete. */
export type AddressAddressPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** A condition to be used against `Address` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AddressCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `Address` object types. All fields are combined with a logical ‘and.’ */
export type AddressFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AddressFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<AddressFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AddressFilter>>;
};

/** An input for mutations affecting `Address` */
export type AddressInput = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type AddressNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `address` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type AddressNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `address` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type AddressOnCompanyForCompanyRegisteredAddressIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `company` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `company` being updated. */
  patch: CompanyPatch;
};

/** The fields on `address` to look up the row to update. */
export type AddressOnCompanyForCompanyRegisteredAddressIdFkeyUsingAddressPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `address` being updated. */
    patch: UpdateAddressOnCompanyForCompanyRegisteredAddressIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AddressOnCompanyForCompanyTradingAddressIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `company` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `company` being updated. */
  patch: CompanyPatch;
};

/** The fields on `address` to look up the row to update. */
export type AddressOnCompanyForCompanyTradingAddressIdFkeyUsingAddressPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `address` being updated. */
    patch: UpdateAddressOnCompanyForCompanyTradingAddressIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AddressOnProjectForProjectBuildingOwnerAddressIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `project` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `project` being updated. */
  patch: ProjectPatch;
};

/** The fields on `address` to look up the row to update. */
export type AddressOnProjectForProjectBuildingOwnerAddressIdFkeyUsingAddressPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `address` being updated. */
    patch: UpdateAddressOnProjectForProjectBuildingOwnerAddressIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type AddressOnProjectForProjectSiteAddressIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `project` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `project` being updated. */
  patch: ProjectPatch;
};

/** The fields on `address` to look up the row to update. */
export type AddressOnProjectForProjectSiteAddressIdFkeyUsingAddressPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `address` being updated. */
    patch: UpdateAddressOnProjectForProjectSiteAddressIdFkeyPatch;
  };

/** Represents an update to a `Address`. Fields that are set will be updated. */
export type AddressPatch = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Address` values. */
export type AddressesConnection = {
  __typename?: "AddressesConnection";
  /** A list of edges which contains the `Address` and cursor to aid in pagination. */
  edges: Array<AddressesEdge>;
  /** A list of `Address` objects. */
  nodes: Array<Address>;
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
export type AddressesOrderBy =
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** Represents a binary file in a space. An asset can be any file type. */
export type Asset = {
  __typename?: "Asset";
  contentType?: Maybe<Scalars["String"]>;
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars["String"]>;
  fileName?: Maybe<Scalars["String"]>;
  height?: Maybe<Scalars["Int"]>;
  linkedFrom?: Maybe<AssetLinkingCollections>;
  size?: Maybe<Scalars["Int"]>;
  sys: Sys;
  title?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["Int"]>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetContentTypeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetDescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetFileNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetHeightArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetSizeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetTitleArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetUrlArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  transform?: InputMaybe<ImageTransformOptions>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetWidthArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type AssetCollection = {
  __typename?: "AssetCollection";
  items: Array<Maybe<Asset>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type AssetFilter = {
  AND?: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  contentType?: InputMaybe<Scalars["String"]>;
  contentType_contains?: InputMaybe<Scalars["String"]>;
  contentType_exists?: InputMaybe<Scalars["Boolean"]>;
  contentType_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  contentType_not?: InputMaybe<Scalars["String"]>;
  contentType_not_contains?: InputMaybe<Scalars["String"]>;
  contentType_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars["String"]>;
  description_contains?: InputMaybe<Scalars["String"]>;
  description_exists?: InputMaybe<Scalars["Boolean"]>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  description_not?: InputMaybe<Scalars["String"]>;
  description_not_contains?: InputMaybe<Scalars["String"]>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  fileName?: InputMaybe<Scalars["String"]>;
  fileName_contains?: InputMaybe<Scalars["String"]>;
  fileName_exists?: InputMaybe<Scalars["Boolean"]>;
  fileName_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  fileName_not?: InputMaybe<Scalars["String"]>;
  fileName_not_contains?: InputMaybe<Scalars["String"]>;
  fileName_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  height?: InputMaybe<Scalars["Int"]>;
  height_exists?: InputMaybe<Scalars["Boolean"]>;
  height_gt?: InputMaybe<Scalars["Int"]>;
  height_gte?: InputMaybe<Scalars["Int"]>;
  height_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  height_lt?: InputMaybe<Scalars["Int"]>;
  height_lte?: InputMaybe<Scalars["Int"]>;
  height_not?: InputMaybe<Scalars["Int"]>;
  height_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  size?: InputMaybe<Scalars["Int"]>;
  size_exists?: InputMaybe<Scalars["Boolean"]>;
  size_gt?: InputMaybe<Scalars["Int"]>;
  size_gte?: InputMaybe<Scalars["Int"]>;
  size_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  size_lt?: InputMaybe<Scalars["Int"]>;
  size_lte?: InputMaybe<Scalars["Int"]>;
  size_not?: InputMaybe<Scalars["Int"]>;
  size_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars["String"]>;
  title_contains?: InputMaybe<Scalars["String"]>;
  title_exists?: InputMaybe<Scalars["Boolean"]>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  title_not?: InputMaybe<Scalars["String"]>;
  title_not_contains?: InputMaybe<Scalars["String"]>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  url?: InputMaybe<Scalars["String"]>;
  url_contains?: InputMaybe<Scalars["String"]>;
  url_exists?: InputMaybe<Scalars["Boolean"]>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  url_not?: InputMaybe<Scalars["String"]>;
  url_not_contains?: InputMaybe<Scalars["String"]>;
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  width?: InputMaybe<Scalars["Int"]>;
  width_exists?: InputMaybe<Scalars["Boolean"]>;
  width_gt?: InputMaybe<Scalars["Int"]>;
  width_gte?: InputMaybe<Scalars["Int"]>;
  width_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  width_lt?: InputMaybe<Scalars["Int"]>;
  width_lte?: InputMaybe<Scalars["Int"]>;
  width_not?: InputMaybe<Scalars["Int"]>;
  width_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
};

export type AssetLinkingCollections = {
  __typename?: "AssetLinkingCollections";
  carouselItemCollection?: Maybe<CarouselItemCollection>;
  entryCollection?: Maybe<EntryCollection>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
  mediaToolCollection?: Maybe<MediaToolCollection>;
  partnerBrandCollection?: Maybe<PartnerBrandCollection>;
  trainingContentCollection?: Maybe<TrainingContentCollection>;
};

export type AssetLinkingCollectionsCarouselItemCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type AssetLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type AssetLinkingCollectionsGuaranteeTemplateCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type AssetLinkingCollectionsGuaranteeTypeCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type AssetLinkingCollectionsMediaToolCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type AssetLinkingCollectionsPartnerBrandCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type AssetLinkingCollectionsTrainingContentCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type AssetOrder =
  | "contentType_ASC"
  | "contentType_DESC"
  | "fileName_ASC"
  | "fileName_DESC"
  | "height_ASC"
  | "height_DESC"
  | "size_ASC"
  | "size_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC"
  | "url_ASC"
  | "url_DESC"
  | "width_ASC"
  | "width_DESC";

export type Auth0ImportResult = {
  __typename?: "Auth0ImportResult";
  connection?: Maybe<Scalars["String"]>;
  connection_id?: Maybe<Scalars["String"]>;
  created_at?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars["Boolean"]>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars["Boolean"]>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars["Boolean"]>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars["Boolean"]>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars["Boolean"]>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars["Boolean"]>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars["Boolean"]>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars["Boolean"]>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars["Boolean"]>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars["Boolean"]>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars["Boolean"]>>;
};

export type BulkImportInput = {
  dryRun?: InputMaybe<Scalars["Boolean"]>;
  files: Array<Scalars["Upload"]>;
};

export type BusinessType =
  | "ARCHITECT"
  | "CONTRACTOR"
  | "CORP_DEVELOPER"
  | "MERCHANT";

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carousel) */
export type Carousel = Entry & {
  __typename?: "Carousel";
  audienceRole?: Maybe<Scalars["String"]>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<CarouselLinkingCollections>;
  listCollection?: Maybe<CarouselListCollection>;
  name?: Maybe<Scalars["String"]>;
  sys: Sys;
};

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carousel) */
export type CarouselAudienceRoleArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carousel) */
export type CarouselLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carousel) */
export type CarouselListCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carousel) */
export type CarouselNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type CarouselCollection = {
  __typename?: "CarouselCollection";
  items: Array<Maybe<Carousel>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type CarouselFilter = {
  AND?: InputMaybe<Array<InputMaybe<CarouselFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CarouselFilter>>>;
  audienceRole?: InputMaybe<Scalars["String"]>;
  audienceRole_contains?: InputMaybe<Scalars["String"]>;
  audienceRole_exists?: InputMaybe<Scalars["Boolean"]>;
  audienceRole_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  audienceRole_not?: InputMaybe<Scalars["String"]>;
  audienceRole_not_contains?: InputMaybe<Scalars["String"]>;
  audienceRole_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  listCollection_exists?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_exists?: InputMaybe<Scalars["Boolean"]>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItem = Entry & {
  __typename?: "CarouselItem";
  audienceTiers?: Maybe<Array<Maybe<Scalars["String"]>>>;
  body?: Maybe<Scalars["String"]>;
  contentfulMetadata: ContentfulMetadata;
  cta?: Maybe<Scalars["String"]>;
  customUrl?: Maybe<Scalars["String"]>;
  customUrlButtonText?: Maybe<Scalars["String"]>;
  header?: Maybe<Scalars["String"]>;
  image?: Maybe<Asset>;
  linkedFrom?: Maybe<CarouselItemLinkingCollections>;
  sys: Sys;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItemAudienceTiersArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItemBodyArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItemCtaArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItemCustomUrlArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItemCustomUrlButtonTextArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItemHeaderArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItemImageArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/carouselItem) */
export type CarouselItemLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type CarouselItemCollection = {
  __typename?: "CarouselItemCollection";
  items: Array<Maybe<CarouselItem>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type CarouselItemFilter = {
  AND?: InputMaybe<Array<InputMaybe<CarouselItemFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CarouselItemFilter>>>;
  audienceTiers_contains_all?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  audienceTiers_contains_none?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  audienceTiers_contains_some?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  audienceTiers_exists?: InputMaybe<Scalars["Boolean"]>;
  body?: InputMaybe<Scalars["String"]>;
  body_contains?: InputMaybe<Scalars["String"]>;
  body_exists?: InputMaybe<Scalars["Boolean"]>;
  body_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  body_not?: InputMaybe<Scalars["String"]>;
  body_not_contains?: InputMaybe<Scalars["String"]>;
  body_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  cta?: InputMaybe<Scalars["String"]>;
  cta_contains?: InputMaybe<Scalars["String"]>;
  cta_exists?: InputMaybe<Scalars["Boolean"]>;
  cta_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cta_not?: InputMaybe<Scalars["String"]>;
  cta_not_contains?: InputMaybe<Scalars["String"]>;
  cta_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  customUrl?: InputMaybe<Scalars["String"]>;
  customUrlButtonText?: InputMaybe<Scalars["String"]>;
  customUrlButtonText_contains?: InputMaybe<Scalars["String"]>;
  customUrlButtonText_exists?: InputMaybe<Scalars["Boolean"]>;
  customUrlButtonText_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  customUrlButtonText_not?: InputMaybe<Scalars["String"]>;
  customUrlButtonText_not_contains?: InputMaybe<Scalars["String"]>;
  customUrlButtonText_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  customUrl_contains?: InputMaybe<Scalars["String"]>;
  customUrl_exists?: InputMaybe<Scalars["Boolean"]>;
  customUrl_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  customUrl_not?: InputMaybe<Scalars["String"]>;
  customUrl_not_contains?: InputMaybe<Scalars["String"]>;
  customUrl_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  header?: InputMaybe<Scalars["String"]>;
  header_contains?: InputMaybe<Scalars["String"]>;
  header_exists?: InputMaybe<Scalars["Boolean"]>;
  header_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  header_not?: InputMaybe<Scalars["String"]>;
  header_not_contains?: InputMaybe<Scalars["String"]>;
  header_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  image_exists?: InputMaybe<Scalars["Boolean"]>;
  sys?: InputMaybe<SysFilter>;
};

export type CarouselItemLinkingCollections = {
  __typename?: "CarouselItemLinkingCollections";
  carouselCollection?: Maybe<CarouselCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type CarouselItemLinkingCollectionsCarouselCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type CarouselItemLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type CarouselItemOrder =
  | "cta_ASC"
  | "cta_DESC"
  | "customUrlButtonText_ASC"
  | "customUrlButtonText_DESC"
  | "customUrl_ASC"
  | "customUrl_DESC"
  | "header_ASC"
  | "header_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

export type CarouselLinkingCollections = {
  __typename?: "CarouselLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type CarouselLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type CarouselListCollection = {
  __typename?: "CarouselListCollection";
  items: Array<Maybe<CarouselItem>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type CarouselOrder =
  | "audienceRole_ASC"
  | "audienceRole_DESC"
  | "name_ASC"
  | "name_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** A company that has been registered in InTouch */
export type Certification = Node & {
  __typename?: "Certification";
  createdAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Certification`. */
  doceboUser?: Maybe<Account>;
  /** fk */
  doceboUserId?: Maybe<Scalars["Int"]>;
  /** The last day that this certification is valid */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** The name of the certification according to Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
};

/** The fields on `certification` to look up the row to connect. */
export type CertificationCertificationPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `certification` to look up the row to delete. */
export type CertificationCertificationPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/**
 * A condition to be used against `Certification` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CertificationCondition = {
  /** Checks for equality with the object’s `doceboUserId` field. */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `expiryDate` field. */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `technology` field. */
  technology?: InputMaybe<Scalars["String"]>;
};

/** The `certification` to be created by this mutation. */
export type CertificationDoceboUserIdFkeyCertificationCreateInput = {
  accountToDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The last day that this certification is valid */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** The name of the certification according to Docebo */
  name?: InputMaybe<Scalars["String"]>;
  /** technology */
  technology?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `account` in the `CertificationInput` mutation. */
export type CertificationDoceboUserIdFkeyInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<AccountAccountEmailKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<AccountAccountPkeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AccountNodeIdConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<AccountAccountEmailKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<AccountAccountPkeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AccountNodeIdDelete>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<AccountOnCertificationForCertificationDoceboUserIdFkeyUsingAccountDoceboUserIdKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<AccountOnCertificationForCertificationDoceboUserIdFkeyUsingAccountEmailKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<AccountOnCertificationForCertificationDoceboUserIdFkeyUsingAccountPkeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CertificationOnCertificationForCertificationDoceboUserIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `certification` in the `AccountInput` mutation. */
export type CertificationDoceboUserIdFkeyInverseInput = {
  /** The primary key(s) for `certification` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CertificationCertificationPkeyConnect>>;
  /** The primary key(s) for `certification` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CertificationNodeIdConnect>>;
  /** A `CertificationInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<CertificationDoceboUserIdFkeyCertificationCreateInput>
  >;
  /** The primary key(s) for `certification` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CertificationCertificationPkeyDelete>>;
  /** The primary key(s) for `certification` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CertificationNodeIdDelete>>;
  /** Flag indicating whether all other `certification` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `certification` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CertificationOnCertificationForCertificationDoceboUserIdFkeyUsingCertificationPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `certification` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AccountOnCertificationForCertificationDoceboUserIdFkeyNodeIdUpdate>
  >;
};

/** A filter to be used against `Certification` object types. All fields are combined with a logical ‘and.’ */
export type CertificationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CertificationFilter>>;
  /** Filter by the object’s `doceboUserId` field. */
  doceboUserId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `expiryDate` field. */
  expiryDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CertificationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CertificationFilter>>;
  /** Filter by the object’s `technology` field. */
  technology?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Certification` */
export type CertificationInput = {
  accountToDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** fk */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** The last day that this certification is valid */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** The name of the certification according to Docebo */
  name?: InputMaybe<Scalars["String"]>;
  /** technology */
  technology?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type CertificationNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `certification` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type CertificationNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `certification` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type CertificationOnCertificationForCertificationDoceboUserIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `account` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: AccountPatch;
  };

/** The fields on `certification` to look up the row to update. */
export type CertificationOnCertificationForCertificationDoceboUserIdFkeyUsingCertificationPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `certification` being updated. */
    patch: UpdateCertificationOnCertificationForCertificationDoceboUserIdFkeyPatch;
  };

/** Represents an update to a `Certification`. Fields that are set will be updated. */
export type CertificationPatch = {
  accountToDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** fk */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** The last day that this certification is valid */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** The name of the certification according to Docebo */
  name?: InputMaybe<Scalars["String"]>;
  /** technology */
  technology?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Certification` values. */
export type CertificationsConnection = {
  __typename?: "CertificationsConnection";
  /** A list of edges which contains the `Certification` and cursor to aid in pagination. */
  edges: Array<CertificationsEdge>;
  /** A list of `Certification` objects. */
  nodes: Array<Certification>;
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
export type CertificationsOrderBy =
  | "DOCEBO_USER_ID_ASC"
  | "DOCEBO_USER_ID_DESC"
  | "EXPIRY_DATE_ASC"
  | "EXPIRY_DATE_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "TECHNOLOGY_ASC"
  | "TECHNOLOGY_DESC";

export type CheckUserValidityPayload = {
  __typename?: "CheckUserValidityPayload";
  success?: Maybe<Scalars["String"]>;
};

/** A connection to a list of `Company` values. */
export type CompaniesConnection = {
  __typename?: "CompaniesConnection";
  /** A list of edges which contains the `Company` and cursor to aid in pagination. */
  edges: Array<CompaniesEdge>;
  /** A list of `Company` objects. */
  nodes: Array<Company>;
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
export type CompaniesOrderBy =
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "REFERENCE_NUMBER_ASC"
  | "REFERENCE_NUMBER_DESC"
  | "REGISTERED_ADDRESS_ID_ASC"
  | "REGISTERED_ADDRESS_ID_DESC"
  | "TRADING_ADDRESS_ID_ASC"
  | "TRADING_ADDRESS_ID_DESC";

/** A company that has been registered in InTouch */
export type Company = Node & {
  __typename?: "Company";
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: Maybe<Scalars["String"]>;
  /** ek */
  businessType?: Maybe<BusinessType>;
  certifications: Array<Maybe<Technology>>;
  /** Reads and enables pagination through a set of `CompanyDocument`. */
  companyDocuments: CompanyDocumentsConnection;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMembersConnection;
  /** Reads and enables pagination through a set of `CompanyOperation`. */
  companyOperationsByCompany: CompanyOperationsConnection;
  createdAt: Scalars["Datetime"];
  /** The Company facebook website */
  facebook?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations: InvitationsConnection;
  isProfileComplete: Scalars["Boolean"];
  /** Their Company LinkedIn page URL */
  linkedIn?: Maybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: Maybe<Scalars["String"]>;
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: Maybe<Scalars["String"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** the email address to contact the owner */
  ownerEmail?: Maybe<Scalars["String"]>;
  /** the name of the owner of the Company */
  ownerFullname?: Maybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: Maybe<Scalars["String"]>;
  /** The Company public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** Reads and enables pagination through a set of `Project`. */
  projects: ProjectsConnection;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: Maybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber: Scalars["Int"];
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** fk */
  registeredAddressId?: Maybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: Maybe<Scalars["String"]>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: Maybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: Maybe<Scalars["Datetime"]>;
  /** ek */
  status?: Maybe<CompanyStatus>;
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** ek */
  tier?: Maybe<Tier>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
  /** fk */
  tradingAddressId?: Maybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
  /** The Company website URL */
  website?: Maybe<Scalars["String"]>;
};

/** A company that has been registered in InTouch */
export type CompanyCompanyDocumentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyDocumentCondition>;
  filter?: InputMaybe<CompanyDocumentFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompanyDocumentsOrderBy>>;
};

/** A company that has been registered in InTouch */
export type CompanyCompanyMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyMemberCondition>;
  filter?: InputMaybe<CompanyMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompanyMembersOrderBy>>;
};

/** A company that has been registered in InTouch */
export type CompanyCompanyOperationsByCompanyArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyOperationCondition>;
  filter?: InputMaybe<CompanyOperationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompanyOperationsOrderBy>>;
};

/** A company that has been registered in InTouch */
export type CompanyInvitationsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<InvitationCondition>;
  filter?: InputMaybe<InvitationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};

/** A company that has been registered in InTouch */
export type CompanyProjectsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProjectCondition>;
  filter?: InputMaybe<ProjectFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProjectsOrderBy>>;
};

/** The fields on `company` to look up the row to connect. */
export type CompanyCompanyMarketIdNameKeyConnect = {
  /** fk */
  marketId: Scalars["Int"];
  /** The registered name of the Company */
  name: Scalars["String"];
};

/** The fields on `company` to look up the row to delete. */
export type CompanyCompanyMarketIdNameKeyDelete = {
  /** fk */
  marketId: Scalars["Int"];
  /** The registered name of the Company */
  name: Scalars["String"];
};

/** The fields on `company` to look up the row to connect. */
export type CompanyCompanyPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `company` to look up the row to delete. */
export type CompanyCompanyPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `company` to look up the row to connect. */
export type CompanyCompanyReferenceNumberKeyConnect = {
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber: Scalars["Int"];
};

/** The fields on `company` to look up the row to delete. */
export type CompanyCompanyReferenceNumberKeyDelete = {
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber: Scalars["Int"];
};

/** A condition to be used against `Company` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CompanyCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `referenceNumber` field. */
  referenceNumber?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `registeredAddressId` field. */
  registeredAddressId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `tradingAddressId` field. */
  tradingAddressId?: InputMaybe<Scalars["Int"]>;
};

/** A document uploaded by the Company to InTouch that appears on their Company Profile, for example an insurance certificate */
export type CompanyDocument = Node & {
  __typename?: "CompanyDocument";
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  /** The reference to the document */
  document?: Maybe<Scalars["String"]>;
  documentType?: Maybe<CompanyDocumentType>;
  /** Primary key */
  id: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  signedDocumentUrl?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Int"]>;
  updatedAt: Scalars["Datetime"];
};

/** The fields on `companyDocument` to look up the row to connect. */
export type CompanyDocumentCompanyDocumentPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `companyDocument` to look up the row to delete. */
export type CompanyDocumentCompanyDocumentPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The `companyDocument` to be created by this mutation. */
export type CompanyDocumentCompanyIdFkeyCompanyDocumentCreateInput = {
  attachmentUpload?: InputMaybe<Scalars["Upload"]>;
  companyToCompanyId?: InputMaybe<CompanyDocumentCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The reference to the document */
  document?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `company` in the `CompanyDocumentInput` mutation. */
export type CompanyDocumentCompanyIdFkeyInput = {
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectById?: InputMaybe<CompanyCompanyPkeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<CompanyNodeIdConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteById?: InputMaybe<CompanyCompanyPkeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<CompanyNodeIdDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyDelete>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateById?: InputMaybe<CompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyUsingCompanyPkeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByMarketIdAndName?: InputMaybe<CompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyUsingCompanyMarketIdNameKeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CompanyDocumentOnCompanyDocumentForCompanyDocumentCompanyIdFkeyNodeIdUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByReferenceNumber?: InputMaybe<CompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyUsingCompanyReferenceNumberKeyUpdate>;
};

/** Input for the nested mutation of `companyDocument` in the `CompanyInput` mutation. */
export type CompanyDocumentCompanyIdFkeyInverseInput = {
  /** The primary key(s) for `companyDocument` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CompanyDocumentCompanyDocumentPkeyConnect>>;
  /** The primary key(s) for `companyDocument` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CompanyDocumentNodeIdConnect>>;
  /** A `CompanyDocumentInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<CompanyDocumentCompanyIdFkeyCompanyDocumentCreateInput>
  >;
  /** The primary key(s) for `companyDocument` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CompanyDocumentCompanyDocumentPkeyDelete>>;
  /** The primary key(s) for `companyDocument` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CompanyDocumentNodeIdDelete>>;
  /** Flag indicating whether all other `companyDocument` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `companyDocument` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CompanyDocumentOnCompanyDocumentForCompanyDocumentCompanyIdFkeyUsingCompanyDocumentPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `companyDocument` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<CompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyNodeIdUpdate>
  >;
};

/**
 * A condition to be used against `CompanyDocument` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanyDocumentCondition = {
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `CompanyDocument` object types. All fields are combined with a logical ‘and.’ */
export type CompanyDocumentFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CompanyDocumentFilter>>;
  /** Filter by the object’s `companyId` field. */
  companyId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CompanyDocumentFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CompanyDocumentFilter>>;
};

/** An input for mutations affecting `CompanyDocument` */
export type CompanyDocumentInput = {
  attachmentUpload?: InputMaybe<Scalars["Upload"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<CompanyDocumentCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The reference to the document */
  document?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type CompanyDocumentNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `companyDocument` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type CompanyDocumentNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `companyDocument` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type CompanyDocumentOnCompanyDocumentForCompanyDocumentCompanyIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `company` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: CompanyPatch;
  };

/** The fields on `companyDocument` to look up the row to update. */
export type CompanyDocumentOnCompanyDocumentForCompanyDocumentCompanyIdFkeyUsingCompanyDocumentPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `companyDocument` being updated. */
    patch: UpdateCompanyDocumentOnCompanyDocumentForCompanyDocumentCompanyIdFkeyPatch;
  };

/** Represents an update to a `CompanyDocument`. Fields that are set will be updated. */
export type CompanyDocumentPatch = {
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<CompanyDocumentCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The reference to the document */
  document?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

export type CompanyDocumentType = "JPEG" | "JPG" | "PDF" | "PNG";

/** A connection to a list of `CompanyDocument` values. */
export type CompanyDocumentsConnection = {
  __typename?: "CompanyDocumentsConnection";
  /** A list of edges which contains the `CompanyDocument` and cursor to aid in pagination. */
  edges: Array<CompanyDocumentsEdge>;
  /** A list of `CompanyDocument` objects. */
  nodes: Array<CompanyDocument>;
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
export type CompanyDocumentsOrderBy =
  | "COMPANY_ID_ASC"
  | "COMPANY_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A filter to be used against `Company` object types. All fields are combined with a logical ‘and.’ */
export type CompanyFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CompanyFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `marketId` field. */
  marketId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CompanyFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CompanyFilter>>;
  /** Filter by the object’s `referenceNumber` field. */
  referenceNumber?: InputMaybe<IntFilter>;
  /** Filter by the object’s `registeredAddressId` field. */
  registeredAddressId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tradingAddressId` field. */
  tradingAddressId?: InputMaybe<IntFilter>;
};

/** Input for the nested mutation of `market` in the `CompanyInput` mutation. */
export type CompanyMarketIdFkeyInput = {
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDomain?: InputMaybe<MarketMarketDomainKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectById?: InputMaybe<MarketMarketPkeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<MarketNodeIdConnect>;
  /** A `MarketInput` object that will be created and connected to this object. */
  create?: InputMaybe<CompanyMarketIdFkeyMarketCreateInput>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDomain?: InputMaybe<MarketMarketDomainKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteById?: InputMaybe<MarketMarketPkeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<MarketNodeIdDelete>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDoceboCatalogueId?: InputMaybe<MarketOnCompanyForCompanyMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDomain?: InputMaybe<MarketOnCompanyForCompanyMarketIdFkeyUsingMarketDomainKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateById?: InputMaybe<MarketOnCompanyForCompanyMarketIdFkeyUsingMarketPkeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CompanyOnCompanyForCompanyMarketIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `company` in the `MarketInput` mutation. */
export type CompanyMarketIdFkeyInverseInput = {
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CompanyCompanyPkeyConnect>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByMarketIdAndName?: InputMaybe<
    Array<CompanyCompanyMarketIdNameKeyConnect>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CompanyNodeIdConnect>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByReferenceNumber?: InputMaybe<
    Array<CompanyCompanyReferenceNumberKeyConnect>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CompanyCompanyPkeyDelete>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByMarketIdAndName?: InputMaybe<
    Array<CompanyCompanyMarketIdNameKeyDelete>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CompanyNodeIdDelete>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByReferenceNumber?: InputMaybe<
    Array<CompanyCompanyReferenceNumberKeyDelete>
  >;
  /** Flag indicating whether all other `company` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CompanyOnCompanyForCompanyMarketIdFkeyUsingCompanyPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByMarketIdAndName?: InputMaybe<
    Array<CompanyOnCompanyForCompanyMarketIdFkeyUsingCompanyMarketIdNameKeyUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<MarketOnCompanyForCompanyMarketIdFkeyNodeIdUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByReferenceNumber?: InputMaybe<
    Array<CompanyOnCompanyForCompanyMarketIdFkeyUsingCompanyReferenceNumberKeyUpdate>
  >;
};

/** The `market` to be created by this mutation. */
export type CompanyMarketIdFkeyMarketCreateInput = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language: Language;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection between a user and a company */
export type CompanyMember = Node & {
  __typename?: "CompanyMember";
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /** fk */
  accountId: Scalars["Int"];
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  /** fk */
  companyId: Scalars["Int"];
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** fk */
  marketId: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  updatedAt: Scalars["Datetime"];
};

/** The `companyMember` to be created by this mutation. */
export type CompanyMemberAccountIdFkeyCompanyMemberCreateInput = {
  accountToAccountId?: InputMaybe<CompanyMemberAccountIdFkeyInput>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<CompanyMemberCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMemberMarketIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `account` in the `CompanyMemberInput` mutation. */
export type CompanyMemberAccountIdFkeyInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<AccountAccountEmailKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<AccountAccountPkeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AccountNodeIdConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<AccountAccountEmailKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<AccountAccountPkeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AccountNodeIdDelete>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<AccountOnCompanyMemberForCompanyMemberAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<AccountOnCompanyMemberForCompanyMemberAccountIdFkeyUsingAccountEmailKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<AccountOnCompanyMemberForCompanyMemberAccountIdFkeyUsingAccountPkeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `companyMember` in the `AccountInput` mutation. */
export type CompanyMemberAccountIdFkeyInverseInput = {
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CompanyMemberCompanyMemberPkeyConnect>>;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberCompanyMemberMarketIdAccountIdCompanyIdKeyConnect>
  >;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CompanyMemberNodeIdConnect>>;
  /** A `CompanyMemberInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<CompanyMemberAccountIdFkeyCompanyMemberCreateInput>
  >;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CompanyMemberCompanyMemberPkeyDelete>>;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberCompanyMemberMarketIdAccountIdCompanyIdKeyDelete>
  >;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CompanyMemberNodeIdDelete>>;
  /** Flag indicating whether all other `companyMember` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyUsingCompanyMemberPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyUsingCompanyMemberMarketIdAccountIdCompanyIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AccountOnCompanyMemberForCompanyMemberAccountIdFkeyNodeIdUpdate>
  >;
};

/** The `companyMember` to be created by this mutation. */
export type CompanyMemberCompanyIdFkeyCompanyMemberCreateInput = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<CompanyMemberAccountIdFkeyInput>;
  companyToCompanyId?: InputMaybe<CompanyMemberCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMemberMarketIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `company` in the `CompanyMemberInput` mutation. */
export type CompanyMemberCompanyIdFkeyInput = {
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectById?: InputMaybe<CompanyCompanyPkeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<CompanyNodeIdConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteById?: InputMaybe<CompanyCompanyPkeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<CompanyNodeIdDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyDelete>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateById?: InputMaybe<CompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyPkeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByMarketIdAndName?: InputMaybe<CompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyMarketIdNameKeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyNodeIdUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByReferenceNumber?: InputMaybe<CompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyReferenceNumberKeyUpdate>;
};

/** Input for the nested mutation of `companyMember` in the `CompanyInput` mutation. */
export type CompanyMemberCompanyIdFkeyInverseInput = {
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CompanyMemberCompanyMemberPkeyConnect>>;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberCompanyMemberMarketIdAccountIdCompanyIdKeyConnect>
  >;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CompanyMemberNodeIdConnect>>;
  /** A `CompanyMemberInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<CompanyMemberCompanyIdFkeyCompanyMemberCreateInput>
  >;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CompanyMemberCompanyMemberPkeyDelete>>;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberCompanyMemberMarketIdAccountIdCompanyIdKeyDelete>
  >;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CompanyMemberNodeIdDelete>>;
  /** Flag indicating whether all other `companyMember` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyMemberPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyMemberMarketIdAccountIdCompanyIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<CompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyNodeIdUpdate>
  >;
};

/** The fields on `companyMember` to look up the row to connect. */
export type CompanyMemberCompanyMemberMarketIdAccountIdCompanyIdKeyConnect = {
  /** fk */
  accountId: Scalars["Int"];
  /** fk */
  companyId: Scalars["Int"];
  /** fk */
  marketId: Scalars["Int"];
};

/** The fields on `companyMember` to look up the row to delete. */
export type CompanyMemberCompanyMemberMarketIdAccountIdCompanyIdKeyDelete = {
  /** fk */
  accountId: Scalars["Int"];
  /** fk */
  companyId: Scalars["Int"];
  /** fk */
  marketId: Scalars["Int"];
};

/** The fields on `companyMember` to look up the row to connect. */
export type CompanyMemberCompanyMemberPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `companyMember` to look up the row to delete. */
export type CompanyMemberCompanyMemberPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/**
 * A condition to be used against `CompanyMember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanyMemberCondition = {
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `CompanyMember` object types. All fields are combined with a logical ‘and.’ */
export type CompanyMemberFilter = {
  /** Filter by the object’s `accountId` field. */
  accountId?: InputMaybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CompanyMemberFilter>>;
  /** Filter by the object’s `companyId` field. */
  companyId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `marketId` field. */
  marketId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CompanyMemberFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CompanyMemberFilter>>;
};

/** An input for mutations affecting `CompanyMember` */
export type CompanyMemberInput = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<CompanyMemberAccountIdFkeyInput>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<CompanyMemberCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMemberMarketIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `companyMember` to be created by this mutation. */
export type CompanyMemberMarketIdFkeyCompanyMemberCreateInput = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<CompanyMemberAccountIdFkeyInput>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<CompanyMemberCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMemberMarketIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `market` in the `CompanyMemberInput` mutation. */
export type CompanyMemberMarketIdFkeyInput = {
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDomain?: InputMaybe<MarketMarketDomainKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectById?: InputMaybe<MarketMarketPkeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<MarketNodeIdConnect>;
  /** A `MarketInput` object that will be created and connected to this object. */
  create?: InputMaybe<CompanyMemberMarketIdFkeyMarketCreateInput>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDomain?: InputMaybe<MarketMarketDomainKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteById?: InputMaybe<MarketMarketPkeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<MarketNodeIdDelete>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDoceboCatalogueId?: InputMaybe<MarketOnCompanyMemberForCompanyMemberMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDomain?: InputMaybe<MarketOnCompanyMemberForCompanyMemberMarketIdFkeyUsingMarketDomainKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateById?: InputMaybe<MarketOnCompanyMemberForCompanyMemberMarketIdFkeyUsingMarketPkeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `companyMember` in the `MarketInput` mutation. */
export type CompanyMemberMarketIdFkeyInverseInput = {
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CompanyMemberCompanyMemberPkeyConnect>>;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberCompanyMemberMarketIdAccountIdCompanyIdKeyConnect>
  >;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CompanyMemberNodeIdConnect>>;
  /** A `CompanyMemberInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<CompanyMemberMarketIdFkeyCompanyMemberCreateInput>>;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CompanyMemberCompanyMemberPkeyDelete>>;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberCompanyMemberMarketIdAccountIdCompanyIdKeyDelete>
  >;
  /** The primary key(s) for `companyMember` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CompanyMemberNodeIdDelete>>;
  /** Flag indicating whether all other `companyMember` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyUsingCompanyMemberPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateByMarketIdAndAccountIdAndCompanyId?: InputMaybe<
    Array<CompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyUsingCompanyMemberMarketIdAccountIdCompanyIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `companyMember` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<MarketOnCompanyMemberForCompanyMemberMarketIdFkeyNodeIdUpdate>
  >;
};

/** The `market` to be created by this mutation. */
export type CompanyMemberMarketIdFkeyMarketCreateInput = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language: Language;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type CompanyMemberNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `companyMember` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type CompanyMemberNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `companyMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `account` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: AccountPatch;
  };

/** The fields on `companyMember` to look up the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyUsingCompanyMemberMarketIdAccountIdCompanyIdKeyUpdate =
  {
    /** fk */
    accountId: Scalars["Int"];
    /** fk */
    companyId: Scalars["Int"];
    /** fk */
    marketId: Scalars["Int"];
    /** An object where the defined keys will be set on the `companyMember` being updated. */
    patch: UpdateCompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyPatch;
  };

/** The fields on `companyMember` to look up the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyUsingCompanyMemberPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `companyMember` being updated. */
    patch: UpdateCompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `company` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: CompanyPatch;
  };

/** The fields on `companyMember` to look up the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyMemberMarketIdAccountIdCompanyIdKeyUpdate =
  {
    /** fk */
    accountId: Scalars["Int"];
    /** fk */
    companyId: Scalars["Int"];
    /** fk */
    marketId: Scalars["Int"];
    /** An object where the defined keys will be set on the `companyMember` being updated. */
    patch: UpdateCompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyPatch;
  };

/** The fields on `companyMember` to look up the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyMemberPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `companyMember` being updated. */
    patch: UpdateCompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `market` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: MarketPatch;
  };

/** The fields on `companyMember` to look up the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyUsingCompanyMemberMarketIdAccountIdCompanyIdKeyUpdate =
  {
    /** fk */
    accountId: Scalars["Int"];
    /** fk */
    companyId: Scalars["Int"];
    /** fk */
    marketId: Scalars["Int"];
    /** An object where the defined keys will be set on the `companyMember` being updated. */
    patch: UpdateCompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyPatch;
  };

/** The fields on `companyMember` to look up the row to update. */
export type CompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyUsingCompanyMemberPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `companyMember` being updated. */
    patch: UpdateCompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyPatch;
  };

/** Represents an update to a `CompanyMember`. Fields that are set will be updated. */
export type CompanyMemberPatch = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<CompanyMemberAccountIdFkeyInput>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<CompanyMemberCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMemberMarketIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CompanyMember` values. */
export type CompanyMembersConnection = {
  __typename?: "CompanyMembersConnection";
  /** A list of edges which contains the `CompanyMember` and cursor to aid in pagination. */
  edges: Array<CompanyMembersEdge>;
  /** A list of `CompanyMember` objects. */
  nodes: Array<CompanyMember>;
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
export type CompanyMembersOrderBy =
  | "ACCOUNT_ID_ASC"
  | "ACCOUNT_ID_DESC"
  | "COMPANY_ID_ASC"
  | "COMPANY_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** The globally unique `ID` look up for the row to connect. */
export type CompanyNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `company` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type CompanyNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `company` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type CompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `companyDocument` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `companyDocument` being updated. */
    patch: CompanyDocumentPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyUsingCompanyMarketIdNameKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** The registered name of the Company */
    name: Scalars["String"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyUsingCompanyPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyUsingCompanyReferenceNumberKeyUpdate =
  {
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyPatch;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber: Scalars["Int"];
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyOnCompanyForCompanyMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `market` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: MarketPatch;
};

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyMarketIdFkeyUsingCompanyMarketIdNameKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** The registered name of the Company */
    name: Scalars["String"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyForCompanyMarketIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyMarketIdFkeyUsingCompanyPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `company` being updated. */
  patch: UpdateCompanyOnCompanyForCompanyMarketIdFkeyPatch;
};

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyMarketIdFkeyUsingCompanyReferenceNumberKeyUpdate =
  {
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyForCompanyMarketIdFkeyPatch;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber: Scalars["Int"];
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyOnCompanyForCompanyRegisteredAddressIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `address` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `address` being updated. */
  patch: AddressPatch;
};

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyRegisteredAddressIdFkeyUsingCompanyMarketIdNameKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** The registered name of the Company */
    name: Scalars["String"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyForCompanyRegisteredAddressIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyRegisteredAddressIdFkeyUsingCompanyPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyForCompanyRegisteredAddressIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyRegisteredAddressIdFkeyUsingCompanyReferenceNumberKeyUpdate =
  {
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyForCompanyRegisteredAddressIdFkeyPatch;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber: Scalars["Int"];
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyOnCompanyForCompanyTradingAddressIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `address` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `address` being updated. */
  patch: AddressPatch;
};

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyTradingAddressIdFkeyUsingCompanyMarketIdNameKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** The registered name of the Company */
    name: Scalars["String"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyForCompanyTradingAddressIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyTradingAddressIdFkeyUsingCompanyPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyForCompanyTradingAddressIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyForCompanyTradingAddressIdFkeyUsingCompanyReferenceNumberKeyUpdate =
  {
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyForCompanyTradingAddressIdFkeyPatch;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber: Scalars["Int"];
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `companyMember` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `companyMember` being updated. */
  patch: CompanyMemberPatch;
};

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyMarketIdNameKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** The registered name of the Company */
    name: Scalars["String"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyUsingCompanyReferenceNumberKeyUpdate =
  {
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyPatch;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber: Scalars["Int"];
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyOnCompanyOperationForCompanyOperationCompanyFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `companyOperation` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `companyOperation` being updated. */
    patch: CompanyOperationPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyOperationForCompanyOperationCompanyFkeyUsingCompanyMarketIdNameKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** The registered name of the Company */
    name: Scalars["String"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyOperationForCompanyOperationCompanyFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyOperationForCompanyOperationCompanyFkeyUsingCompanyPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyOperationForCompanyOperationCompanyFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnCompanyOperationForCompanyOperationCompanyFkeyUsingCompanyReferenceNumberKeyUpdate =
  {
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnCompanyOperationForCompanyOperationCompanyFkeyPatch;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber: Scalars["Int"];
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyOnInvitationForInvitationCompanyIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `invitation` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `invitation` being updated. */
  patch: InvitationPatch;
};

/** The fields on `company` to look up the row to update. */
export type CompanyOnInvitationForInvitationCompanyIdFkeyUsingCompanyMarketIdNameKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** The registered name of the Company */
    name: Scalars["String"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnInvitationForInvitationCompanyIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnInvitationForInvitationCompanyIdFkeyUsingCompanyPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnInvitationForInvitationCompanyIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnInvitationForInvitationCompanyIdFkeyUsingCompanyReferenceNumberKeyUpdate =
  {
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnInvitationForInvitationCompanyIdFkeyPatch;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber: Scalars["Int"];
  };

/** The globally unique `ID` look up for the row to update. */
export type CompanyOnProjectForProjectCompanyIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `project` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `project` being updated. */
  patch: ProjectPatch;
};

/** The fields on `company` to look up the row to update. */
export type CompanyOnProjectForProjectCompanyIdFkeyUsingCompanyMarketIdNameKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** The registered name of the Company */
    name: Scalars["String"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnProjectForProjectCompanyIdFkeyPatch;
  };

/** The fields on `company` to look up the row to update. */
export type CompanyOnProjectForProjectCompanyIdFkeyUsingCompanyPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `company` being updated. */
  patch: UpdateCompanyOnProjectForProjectCompanyIdFkeyPatch;
};

/** The fields on `company` to look up the row to update. */
export type CompanyOnProjectForProjectCompanyIdFkeyUsingCompanyReferenceNumberKeyUpdate =
  {
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: UpdateCompanyOnProjectForProjectCompanyIdFkeyPatch;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber: Scalars["Int"];
  };

/** The assignment of an operation type to a Company by the Market Admin.  A Company can be assigned multiple types from the allowed enums list.  The operation types that a Company has are sent to Find a Roofer. */
export type CompanyOperation = Node & {
  __typename?: "CompanyOperation";
  /** fk */
  company: Scalars["Int"];
  /** Reads a single `Company` that is related to this `CompanyOperation`. */
  companyByCompany?: Maybe<Company>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** ek */
  operation: Operation;
  updatedAt: Scalars["Datetime"];
};

/** The `companyOperation` to be created by this mutation. */
export type CompanyOperationCompanyFkeyCompanyOperationCreateInput = {
  companyToCompany?: InputMaybe<CompanyOperationCompanyFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  operation: Operation;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `company` in the `CompanyOperationInput` mutation. */
export type CompanyOperationCompanyFkeyInput = {
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectById?: InputMaybe<CompanyCompanyPkeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<CompanyNodeIdConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteById?: InputMaybe<CompanyCompanyPkeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<CompanyNodeIdDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyDelete>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateById?: InputMaybe<CompanyOnCompanyOperationForCompanyOperationCompanyFkeyUsingCompanyPkeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByMarketIdAndName?: InputMaybe<CompanyOnCompanyOperationForCompanyOperationCompanyFkeyUsingCompanyMarketIdNameKeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CompanyOperationOnCompanyOperationForCompanyOperationCompanyFkeyNodeIdUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByReferenceNumber?: InputMaybe<CompanyOnCompanyOperationForCompanyOperationCompanyFkeyUsingCompanyReferenceNumberKeyUpdate>;
};

/** Input for the nested mutation of `companyOperation` in the `CompanyInput` mutation. */
export type CompanyOperationCompanyFkeyInverseInput = {
  /** The primary key(s) for `companyOperation` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CompanyOperationCompanyOperationPkeyConnect>>;
  /** The primary key(s) for `companyOperation` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CompanyOperationNodeIdConnect>>;
  /** A `CompanyOperationInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<CompanyOperationCompanyFkeyCompanyOperationCreateInput>
  >;
  /** The primary key(s) for `companyOperation` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CompanyOperationCompanyOperationPkeyDelete>>;
  /** The primary key(s) for `companyOperation` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CompanyOperationNodeIdDelete>>;
  /** Flag indicating whether all other `companyOperation` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `companyOperation` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CompanyOperationOnCompanyOperationForCompanyOperationCompanyFkeyUsingCompanyOperationPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `companyOperation` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<CompanyOnCompanyOperationForCompanyOperationCompanyFkeyNodeIdUpdate>
  >;
};

/** The fields on `companyOperation` to look up the row to connect. */
export type CompanyOperationCompanyOperationPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `companyOperation` to look up the row to delete. */
export type CompanyOperationCompanyOperationPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/**
 * A condition to be used against `CompanyOperation` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanyOperationCondition = {
  /** Checks for equality with the object’s `company` field. */
  company?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `CompanyOperation` object types. All fields are combined with a logical ‘and.’ */
export type CompanyOperationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CompanyOperationFilter>>;
  /** Filter by the object’s `company` field. */
  company?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CompanyOperationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CompanyOperationFilter>>;
};

/** An input for mutations affecting `CompanyOperation` */
export type CompanyOperationInput = {
  /** fk */
  company?: InputMaybe<Scalars["Int"]>;
  companyToCompany?: InputMaybe<CompanyOperationCompanyFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  operation: Operation;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type CompanyOperationNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `companyOperation` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type CompanyOperationNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `companyOperation` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type CompanyOperationOnCompanyOperationForCompanyOperationCompanyFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `company` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `company` being updated. */
    patch: CompanyPatch;
  };

/** The fields on `companyOperation` to look up the row to update. */
export type CompanyOperationOnCompanyOperationForCompanyOperationCompanyFkeyUsingCompanyOperationPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `companyOperation` being updated. */
    patch: UpdateCompanyOperationOnCompanyOperationForCompanyOperationCompanyFkeyPatch;
  };

/** Represents an update to a `CompanyOperation`. Fields that are set will be updated. */
export type CompanyOperationPatch = {
  /** fk */
  company?: InputMaybe<Scalars["Int"]>;
  companyToCompany?: InputMaybe<CompanyOperationCompanyFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  operation?: InputMaybe<Operation>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CompanyOperation` values. */
export type CompanyOperationsConnection = {
  __typename?: "CompanyOperationsConnection";
  /** A list of edges which contains the `CompanyOperation` and cursor to aid in pagination. */
  edges: Array<CompanyOperationsEdge>;
  /** A list of `CompanyOperation` objects. */
  nodes: Array<CompanyOperation>;
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
export type CompanyOperationsOrderBy =
  | "COMPANY_ASC"
  | "COMPANY_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** Represents an update to a `Company`. Fields that are set will be updated. */
export type CompanyPatch = {
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: InputMaybe<Scalars["String"]>;
  addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
  addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
  /** ek */
  businessType?: InputMaybe<BusinessType>;
  companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
  companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company facebook website */
  facebook?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
  /** Their Company LinkedIn page URL */
  linkedIn?: InputMaybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: InputMaybe<Scalars["String"]>;
  logoUpload?: InputMaybe<Scalars["Upload"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: InputMaybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: InputMaybe<Scalars["String"]>;
  /** the name of the owner of the Company */
  ownerFullname?: InputMaybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: InputMaybe<Scalars["String"]>;
  /** The Company public phone number */
  phone?: InputMaybe<Scalars["String"]>;
  projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: InputMaybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: InputMaybe<Scalars["Int"]>;
  /** fk */
  registeredAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: InputMaybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: InputMaybe<Scalars["Datetime"]>;
  shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<CompanyStatus>;
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: InputMaybe<Scalars["String"]>;
  /** ek */
  tier?: InputMaybe<Tier>;
  /** fk */
  tradingAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company website URL */
  website?: InputMaybe<Scalars["String"]>;
};

/** The `address` to be created by this mutation. */
export type CompanyRegisteredAddressIdFkeyAddressCreateInput = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `address` in the `CompanyInput` mutation. */
export type CompanyRegisteredAddressIdFkeyInput = {
  /** The primary key(s) for `address` for the far side of the relationship. */
  connectById?: InputMaybe<AddressAddressPkeyConnect>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AddressNodeIdConnect>;
  /** A `AddressInput` object that will be created and connected to this object. */
  create?: InputMaybe<CompanyRegisteredAddressIdFkeyAddressCreateInput>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  deleteById?: InputMaybe<AddressAddressPkeyDelete>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AddressNodeIdDelete>;
  /** The primary key(s) and patch data for `address` for the far side of the relationship. */
  updateById?: InputMaybe<AddressOnCompanyForCompanyRegisteredAddressIdFkeyUsingAddressPkeyUpdate>;
  /** The primary key(s) and patch data for `address` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CompanyOnCompanyForCompanyRegisteredAddressIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `company` in the `AddressInput` mutation. */
export type CompanyRegisteredAddressIdFkeyInverseInput = {
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CompanyCompanyPkeyConnect>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByMarketIdAndName?: InputMaybe<
    Array<CompanyCompanyMarketIdNameKeyConnect>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CompanyNodeIdConnect>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByReferenceNumber?: InputMaybe<
    Array<CompanyCompanyReferenceNumberKeyConnect>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CompanyCompanyPkeyDelete>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByMarketIdAndName?: InputMaybe<
    Array<CompanyCompanyMarketIdNameKeyDelete>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CompanyNodeIdDelete>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByReferenceNumber?: InputMaybe<
    Array<CompanyCompanyReferenceNumberKeyDelete>
  >;
  /** Flag indicating whether all other `company` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CompanyOnCompanyForCompanyRegisteredAddressIdFkeyUsingCompanyPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByMarketIdAndName?: InputMaybe<
    Array<CompanyOnCompanyForCompanyRegisteredAddressIdFkeyUsingCompanyMarketIdNameKeyUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AddressOnCompanyForCompanyRegisteredAddressIdFkeyNodeIdUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByReferenceNumber?: InputMaybe<
    Array<CompanyOnCompanyForCompanyRegisteredAddressIdFkeyUsingCompanyReferenceNumberKeyUpdate>
  >;
};

export type CompanyStatus = "ACTIVE" | "DEACTIVATED" | "NEW";

/** The `address` to be created by this mutation. */
export type CompanyTradingAddressIdFkeyAddressCreateInput = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `address` in the `CompanyInput` mutation. */
export type CompanyTradingAddressIdFkeyInput = {
  /** The primary key(s) for `address` for the far side of the relationship. */
  connectById?: InputMaybe<AddressAddressPkeyConnect>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AddressNodeIdConnect>;
  /** A `AddressInput` object that will be created and connected to this object. */
  create?: InputMaybe<CompanyTradingAddressIdFkeyAddressCreateInput>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  deleteById?: InputMaybe<AddressAddressPkeyDelete>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AddressNodeIdDelete>;
  /** The primary key(s) and patch data for `address` for the far side of the relationship. */
  updateById?: InputMaybe<AddressOnCompanyForCompanyTradingAddressIdFkeyUsingAddressPkeyUpdate>;
  /** The primary key(s) and patch data for `address` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<CompanyOnCompanyForCompanyTradingAddressIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `company` in the `AddressInput` mutation. */
export type CompanyTradingAddressIdFkeyInverseInput = {
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectById?: InputMaybe<Array<CompanyCompanyPkeyConnect>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByMarketIdAndName?: InputMaybe<
    Array<CompanyCompanyMarketIdNameKeyConnect>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<CompanyNodeIdConnect>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByReferenceNumber?: InputMaybe<
    Array<CompanyCompanyReferenceNumberKeyConnect>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<CompanyCompanyPkeyDelete>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByMarketIdAndName?: InputMaybe<
    Array<CompanyCompanyMarketIdNameKeyDelete>
  >;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<CompanyNodeIdDelete>>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByReferenceNumber?: InputMaybe<
    Array<CompanyCompanyReferenceNumberKeyDelete>
  >;
  /** Flag indicating whether all other `company` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<CompanyOnCompanyForCompanyTradingAddressIdFkeyUsingCompanyPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByMarketIdAndName?: InputMaybe<
    Array<CompanyOnCompanyForCompanyTradingAddressIdFkeyUsingCompanyMarketIdNameKeyUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AddressOnCompanyForCompanyTradingAddressIdFkeyNodeIdUpdate>
  >;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByReferenceNumber?: InputMaybe<
    Array<CompanyOnCompanyForCompanyTradingAddressIdFkeyUsingCompanyReferenceNumberKeyUpdate>
  >;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contactDetails) */
export type ContactDetails = Entry & {
  __typename?: "ContactDetails";
  contentfulMetadata: ContentfulMetadata;
  email?: Maybe<Scalars["String"]>;
  fullName?: Maybe<Scalars["String"]>;
  linkedFrom?: Maybe<ContactDetailsLinkingCollections>;
  phoneNumber?: Maybe<Scalars["String"]>;
  subHeading?: Maybe<Scalars["String"]>;
  sys: Sys;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contactDetails) */
export type ContactDetailsEmailArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contactDetails) */
export type ContactDetailsFullNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contactDetails) */
export type ContactDetailsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contactDetails) */
export type ContactDetailsPhoneNumberArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contactDetails) */
export type ContactDetailsSubHeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type ContactDetailsCollection = {
  __typename?: "ContactDetailsCollection";
  items: Array<Maybe<ContactDetails>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type ContactDetailsFilter = {
  AND?: InputMaybe<Array<InputMaybe<ContactDetailsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ContactDetailsFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  email?: InputMaybe<Scalars["String"]>;
  email_contains?: InputMaybe<Scalars["String"]>;
  email_exists?: InputMaybe<Scalars["Boolean"]>;
  email_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  email_not?: InputMaybe<Scalars["String"]>;
  email_not_contains?: InputMaybe<Scalars["String"]>;
  email_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  fullName?: InputMaybe<Scalars["String"]>;
  fullName_contains?: InputMaybe<Scalars["String"]>;
  fullName_exists?: InputMaybe<Scalars["Boolean"]>;
  fullName_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  fullName_not?: InputMaybe<Scalars["String"]>;
  fullName_not_contains?: InputMaybe<Scalars["String"]>;
  fullName_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  phoneNumber?: InputMaybe<Scalars["String"]>;
  phoneNumber_contains?: InputMaybe<Scalars["String"]>;
  phoneNumber_exists?: InputMaybe<Scalars["Boolean"]>;
  phoneNumber_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  phoneNumber_not?: InputMaybe<Scalars["String"]>;
  phoneNumber_not_contains?: InputMaybe<Scalars["String"]>;
  phoneNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  subHeading?: InputMaybe<Scalars["String"]>;
  subHeading_contains?: InputMaybe<Scalars["String"]>;
  subHeading_exists?: InputMaybe<Scalars["Boolean"]>;
  subHeading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  subHeading_not?: InputMaybe<Scalars["String"]>;
  subHeading_not_contains?: InputMaybe<Scalars["String"]>;
  subHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ContactDetailsLinkingCollections = {
  __typename?: "ContactDetailsLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  marketContentCollection?: Maybe<MarketContentCollection>;
};

export type ContactDetailsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type ContactDetailsLinkingCollectionsMarketContentCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type ContactDetailsOrder =
  | "email_ASC"
  | "email_DESC"
  | "fullName_ASC"
  | "fullName_DESC"
  | "phoneNumber_ASC"
  | "phoneNumber_DESC"
  | "subHeading_ASC"
  | "subHeading_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contentArticle) */
export type ContentArticle = Entry & {
  __typename?: "ContentArticle";
  body?: Maybe<ContentArticleBody>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ContentArticleLinkingCollections>;
  relativePath?: Maybe<Scalars["String"]>;
  sys: Sys;
  title?: Maybe<Scalars["String"]>;
};

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contentArticle) */
export type ContentArticleBodyArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contentArticle) */
export type ContentArticleLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contentArticle) */
export type ContentArticleRelativePathArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/contentArticle) */
export type ContentArticleTitleArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type ContentArticleBody = {
  __typename?: "ContentArticleBody";
  json: Scalars["JSON"];
  links: ContentArticleBodyLinks;
};

export type ContentArticleBodyAssets = {
  __typename?: "ContentArticleBodyAssets";
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type ContentArticleBodyEntries = {
  __typename?: "ContentArticleBodyEntries";
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type ContentArticleBodyLinks = {
  __typename?: "ContentArticleBodyLinks";
  assets: ContentArticleBodyAssets;
  entries: ContentArticleBodyEntries;
};

export type ContentArticleCollection = {
  __typename?: "ContentArticleCollection";
  items: Array<Maybe<ContentArticle>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type ContentArticleFilter = {
  AND?: InputMaybe<Array<InputMaybe<ContentArticleFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ContentArticleFilter>>>;
  body_contains?: InputMaybe<Scalars["String"]>;
  body_exists?: InputMaybe<Scalars["Boolean"]>;
  body_not_contains?: InputMaybe<Scalars["String"]>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  relativePath?: InputMaybe<Scalars["String"]>;
  relativePath_contains?: InputMaybe<Scalars["String"]>;
  relativePath_exists?: InputMaybe<Scalars["Boolean"]>;
  relativePath_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  relativePath_not?: InputMaybe<Scalars["String"]>;
  relativePath_not_contains?: InputMaybe<Scalars["String"]>;
  relativePath_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars["String"]>;
  title_contains?: InputMaybe<Scalars["String"]>;
  title_exists?: InputMaybe<Scalars["Boolean"]>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  title_not?: InputMaybe<Scalars["String"]>;
  title_not_contains?: InputMaybe<Scalars["String"]>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type ContentArticleLinkingCollections = {
  __typename?: "ContentArticleLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  marketContentCollection?: Maybe<MarketContentCollection>;
};

export type ContentArticleLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type ContentArticleLinkingCollectionsMarketContentCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type ContentArticleOrder =
  | "relativePath_ASC"
  | "relativePath_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC"
  | "title_ASC"
  | "title_DESC";

export type ContentfulAsset = {
  __typename?: "ContentfulAsset";
  contentType?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  fileName?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

export type ContentfulEvidenceCategory = {
  __typename?: "ContentfulEvidenceCategory";
  description?: Maybe<ContentfulEvidenceCategoryDescription>;
  minimumUploads?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  referenceCode?: Maybe<Scalars["String"]>;
  sys: ContentfulSys;
};

export type ContentfulEvidenceCategoryCollection = {
  __typename?: "ContentfulEvidenceCategoryCollection";
  items?: Maybe<Array<Maybe<ContentfulEvidenceCategory>>>;
};

export type ContentfulEvidenceCategoryDescription = {
  __typename?: "ContentfulEvidenceCategoryDescription";
  json: Scalars["JSON"];
};

export type ContentfulGuaranteeCoverageType = "PRODUCT" | "SOLUTION" | "SYSTEM";

export type ContentfulGuaranteeTemplate = {
  __typename?: "ContentfulGuaranteeTemplate";
  approvalMessage?: Maybe<ContentfulMessage>;
  coverage?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  filenamePrefix?: Maybe<Scalars["String"]>;
  footer?: Maybe<Scalars["String"]>;
  guaranteeScope?: Maybe<Scalars["String"]>;
  headingBeneficiary?: Maybe<Scalars["String"]>;
  headingBuildingAddress?: Maybe<Scalars["String"]>;
  headingBuildingOwnerName?: Maybe<Scalars["String"]>;
  headingContractor?: Maybe<Scalars["String"]>;
  headingContractorId?: Maybe<Scalars["String"]>;
  headingContractorName?: Maybe<Scalars["String"]>;
  headingExpiry?: Maybe<Scalars["String"]>;
  headingGuarantee?: Maybe<Scalars["String"]>;
  headingGuaranteeId?: Maybe<Scalars["String"]>;
  headingProducts?: Maybe<Scalars["String"]>;
  headingRoofArea?: Maybe<Scalars["String"]>;
  headingRoofType?: Maybe<Scalars["String"]>;
  headingScope?: Maybe<Scalars["String"]>;
  headingStartDate?: Maybe<Scalars["String"]>;
  headingValidity?: Maybe<Scalars["String"]>;
  languageCode?: Maybe<Scalars["String"]>;
  languageDescriptor?: Maybe<Scalars["String"]>;
  logo?: Maybe<ContentfulAsset>;
  mailBody?: Maybe<Scalars["String"]>;
  maintenanceTemplate?: Maybe<ContentfulAsset>;
  rejectionMessage?: Maybe<ContentfulMessage>;
  roofType?: Maybe<Scalars["String"]>;
  signatory?: Maybe<Scalars["String"]>;
  technology?: Maybe<ContentfulTechnologyType>;
  terms?: Maybe<ContentfulAsset>;
  titleLine1?: Maybe<Scalars["String"]>;
  titleLine2?: Maybe<Scalars["String"]>;
};

export type ContentfulGuaranteeTemplatesCollection = {
  __typename?: "ContentfulGuaranteeTemplatesCollection";
  items?: Maybe<Array<Maybe<ContentfulGuaranteeTemplate>>>;
  total: Scalars["Int"];
};

export type ContentfulGuaranteeType = {
  __typename?: "ContentfulGuaranteeType";
  coverage?: Maybe<ContentfulGuaranteeCoverageType>;
  displayName?: Maybe<Scalars["String"]>;
  evidenceCategoriesCollection?: Maybe<ContentfulEvidenceCategoryCollection>;
  guaranteeReferenceCode?: Maybe<GuaranteeReferenceCode>;
  guaranteeTemplatesCollection?: Maybe<ContentfulGuaranteeTemplatesCollection>;
  languageCode?: Maybe<Scalars["String"]>;
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  ranking?: Maybe<Scalars["Int"]>;
  signature?: Maybe<ContentfulAsset>;
  sys: ContentfulSys;
  technology?: Maybe<ContentfulTechnologyType>;
  tiersAvailable?: Maybe<Array<Maybe<ContentfulTiers>>>;
};

export type ContentfulGuaranteeTypeCollection = {
  __typename?: "ContentfulGuaranteeTypeCollection";
  items?: Maybe<Array<Maybe<ContentfulGuaranteeType>>>;
};

export type ContentfulMessage = {
  __typename?: "ContentfulMessage";
  emailBody?: Maybe<Scalars["String"]>;
  event?: Maybe<ContentfulMessageEventType>;
  format?: Maybe<Array<Maybe<ContentfulMessageFormat>>>;
  notificationBody?: Maybe<Scalars["String"]>;
  subject?: Maybe<Scalars["String"]>;
};

export type ContentfulMessageEventType =
  | "ADMIN_INVITED"
  | "CERTIFICATION_EXPIRED"
  | "MEMBER_INVITED"
  | "NEWUSER_INVITED"
  | "OWNER_INVITED"
  | "PROFILE_REMINDER"
  | "REGISTRATION_ACTIVATED"
  | "REGISTRATION_CONGRATS"
  | "REQUEST_APPROVED"
  | "REQUEST_REJECTED"
  | "ROLE_ASSIGNED"
  | "TEAM_JOINED"
  | "TIER_ASSIGNED";

export type ContentfulMessageFormat = "EMAIL" | "NOTIFICATION";

export type ContentfulMetadata = {
  __typename?: "ContentfulMetadata";
  tags: Array<Maybe<ContentfulTag>>;
};

export type ContentfulMetadataFilter = {
  tags?: InputMaybe<ContentfulMetadataTagsFilter>;
  tags_exists?: InputMaybe<Scalars["Boolean"]>;
};

export type ContentfulMetadataTagsFilter = {
  id_contains_all?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  id_contains_none?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  id_contains_some?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type ContentfulSys = {
  __typename?: "ContentfulSys";
  id: Scalars["String"];
};

/**
 * Represents a tag entity for finding and organizing content easily.
 *     Find out more here: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-tags
 */
export type ContentfulTag = {
  __typename?: "ContentfulTag";
  id?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
};

export type ContentfulTechnologyType = "FLAT" | "OTHER" | "PITCHED";

export type ContentfulTiers = "T1" | "T2" | "T3" | "T4";

/** A training course that BMI offers in Docebo */
export type Course = {
  __typename?: "Course";
  /** Reads and enables pagination through a set of `CourseCatalogue`. */
  courseCatalogues: CourseCataloguesConnection;
  /** Reads and enables pagination through a set of `CourseEnrollment`. */
  courseEnrollments: CourseEnrollmentsConnection;
  /** Docebo CourseId */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  /** Text description from Docebo */
  description?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** A reference to the image */
  image?: Maybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Promoted courses a listed higher than others */
  promoted?: Maybe<Scalars["Boolean"]>;
  /** Course slug */
  slug?: Maybe<Scalars["String"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
};

/** A training course that BMI offers in Docebo */
export type CourseCourseCataloguesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseCatalogueCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CourseCataloguesOrderBy>>;
};

/** A training course that BMI offers in Docebo */
export type CourseCourseEnrollmentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseEnrollmentCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CourseEnrollmentsOrderBy>>;
};

/** Course Catalog */
export type CourseCatalogue = {
  __typename?: "CourseCatalogue";
  /** market */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** Reads a single `Course` that is related to this `CourseCatalogue`. */
  course?: Maybe<Course>;
  /** fk */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `CourseCatalogue` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CourseCatalogueCondition = {
  /** Checks for equality with the object’s `catalogueId` field. */
  catalogueId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `courseId` field. */
  courseId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseCatalogue` */
export type CourseCatalogueInput = {
  /** market */
  catalogueId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseCatalogue`. Fields that are set will be updated. */
export type CourseCataloguePatch = {
  /** market */
  catalogueId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Course Catalog temp table.  The course cataloogues from docebo are pulled into here first, before being merged into the course_catalogue table. */
export type CourseCatalogueTemp = {
  __typename?: "CourseCatalogueTemp";
  /** catalogue */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** course */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `CourseCatalogueTemp` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type CourseCatalogueTempCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseCatalogueTemp` */
export type CourseCatalogueTempInput = {
  /** catalogue */
  catalogueId?: InputMaybe<Scalars["Int"]>;
  /** course */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseCatalogueTemp`. Fields that are set will be updated. */
export type CourseCatalogueTempPatch = {
  /** catalogue */
  catalogueId?: InputMaybe<Scalars["Int"]>;
  /** course */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CourseCatalogueTemp` values. */
export type CourseCatalogueTempsConnection = {
  __typename?: "CourseCatalogueTempsConnection";
  /** A list of edges which contains the `CourseCatalogueTemp` and cursor to aid in pagination. */
  edges: Array<CourseCatalogueTempsEdge>;
  /** A list of `CourseCatalogueTemp` objects. */
  nodes: Array<CourseCatalogueTemp>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CourseCatalogueTemp` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CourseCatalogueTemp` edge in the connection. */
export type CourseCatalogueTempsEdge = {
  __typename?: "CourseCatalogueTempsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CourseCatalogueTemp` at the end of the edge. */
  node: CourseCatalogueTemp;
};

/** Methods to use when ordering `CourseCatalogueTemp`. */
export type CourseCatalogueTempsOrderBy =
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** All input for the `courseCatalogueUpdateByTemp` mutation. */
export type CourseCatalogueUpdateByTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** The output of our `courseCatalogueUpdateByTemp` mutation. */
export type CourseCatalogueUpdateByTempPayload = {
  __typename?: "CourseCatalogueUpdateByTempPayload";
  bigInt?: Maybe<Scalars["BigInt"]>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `courseCatalogueUpdate` mutation. */
export type CourseCatalogueUpdateInput = {
  catalogues?: InputMaybe<Array<InputMaybe<CourseCatalogueInput>>>;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** The output of our `courseCatalogueUpdate` mutation. */
export type CourseCatalogueUpdatePayload = {
  __typename?: "CourseCatalogueUpdatePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** A connection to a list of `CourseCatalogue` values. */
export type CourseCataloguesConnection = {
  __typename?: "CourseCataloguesConnection";
  /** A list of edges which contains the `CourseCatalogue` and cursor to aid in pagination. */
  edges: Array<CourseCataloguesEdge>;
  /** A list of `CourseCatalogue` objects. */
  nodes: Array<CourseCatalogue>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CourseCatalogue` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CourseCatalogue` edge in the connection. */
export type CourseCataloguesEdge = {
  __typename?: "CourseCataloguesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CourseCatalogue` at the end of the edge. */
  node: CourseCatalogue;
};

/** Methods to use when ordering `CourseCatalogue`. */
export type CourseCataloguesOrderBy =
  | "CATALOGUE_ID_ASC"
  | "CATALOGUE_ID_DESC"
  | "COURSE_ID_ASC"
  | "COURSE_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A condition to be used against `Course` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CourseCondition = {
  /** Checks for equality with the object’s `courseId` field. */
  courseId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** Course Enrollments */
export type CourseEnrollment = {
  __typename?: "CourseEnrollment";
  /** Reads a single `Course` that is related to this `CourseEnrollment`. */
  course?: Maybe<Course>;
  /** fk */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** status */
  status?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
  /** url */
  url?: Maybe<Scalars["String"]>;
  /** account */
  userId?: Maybe<Scalars["Int"]>;
};

/**
 * A condition to be used against `CourseEnrollment` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CourseEnrollmentCondition = {
  /** Checks for equality with the object’s `courseId` field. */
  courseId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseEnrollment` */
export type CourseEnrollmentInput = {
  /** fk */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** status */
  status?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** url */
  url?: InputMaybe<Scalars["String"]>;
  /** account */
  userId?: InputMaybe<Scalars["Int"]>;
};

/** Represents an update to a `CourseEnrollment`. Fields that are set will be updated. */
export type CourseEnrollmentPatch = {
  /** fk */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** status */
  status?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** url */
  url?: InputMaybe<Scalars["String"]>;
  /** account */
  userId?: InputMaybe<Scalars["Int"]>;
};

/** Course Enrollments temp table.  Enrollements are brought in here from Docebo first, before being merged into the course_enrollemnt table */
export type CourseEnrollmentTemp = {
  __typename?: "CourseEnrollmentTemp";
  /** course */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** status */
  status?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
  /** url */
  url?: Maybe<Scalars["String"]>;
  /** account */
  userId?: Maybe<Scalars["Int"]>;
};

/**
 * A condition to be used against `CourseEnrollmentTemp` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type CourseEnrollmentTempCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseEnrollmentTemp` */
export type CourseEnrollmentTempInput = {
  /** course */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** status */
  status?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** url */
  url?: InputMaybe<Scalars["String"]>;
  /** account */
  userId?: InputMaybe<Scalars["Int"]>;
};

/** Represents an update to a `CourseEnrollmentTemp`. Fields that are set will be updated. */
export type CourseEnrollmentTempPatch = {
  /** course */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** status */
  status?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** url */
  url?: InputMaybe<Scalars["String"]>;
  /** account */
  userId?: InputMaybe<Scalars["Int"]>;
};

/** A connection to a list of `CourseEnrollmentTemp` values. */
export type CourseEnrollmentTempsConnection = {
  __typename?: "CourseEnrollmentTempsConnection";
  /** A list of edges which contains the `CourseEnrollmentTemp` and cursor to aid in pagination. */
  edges: Array<CourseEnrollmentTempsEdge>;
  /** A list of `CourseEnrollmentTemp` objects. */
  nodes: Array<CourseEnrollmentTemp>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CourseEnrollmentTemp` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CourseEnrollmentTemp` edge in the connection. */
export type CourseEnrollmentTempsEdge = {
  __typename?: "CourseEnrollmentTempsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CourseEnrollmentTemp` at the end of the edge. */
  node: CourseEnrollmentTemp;
};

/** Methods to use when ordering `CourseEnrollmentTemp`. */
export type CourseEnrollmentTempsOrderBy =
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** All input for the `courseEnrollmentUpdateByTemp` mutation. */
export type CourseEnrollmentUpdateByTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** The output of our `courseEnrollmentUpdateByTemp` mutation. */
export type CourseEnrollmentUpdateByTempPayload = {
  __typename?: "CourseEnrollmentUpdateByTempPayload";
  bigInt?: Maybe<Scalars["BigInt"]>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `courseEnrollmentUpdate` mutation. */
export type CourseEnrollmentUpdateInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  enrollments?: InputMaybe<Array<InputMaybe<CourseEnrollmentInput>>>;
};

/** The output of our `courseEnrollmentUpdate` mutation. */
export type CourseEnrollmentUpdatePayload = {
  __typename?: "CourseEnrollmentUpdatePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** A connection to a list of `CourseEnrollment` values. */
export type CourseEnrollmentsConnection = {
  __typename?: "CourseEnrollmentsConnection";
  /** A list of edges which contains the `CourseEnrollment` and cursor to aid in pagination. */
  edges: Array<CourseEnrollmentsEdge>;
  /** A list of `CourseEnrollment` objects. */
  nodes: Array<CourseEnrollment>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CourseEnrollment` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CourseEnrollment` edge in the connection. */
export type CourseEnrollmentsEdge = {
  __typename?: "CourseEnrollmentsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CourseEnrollment` at the end of the edge. */
  node: CourseEnrollment;
};

/** Methods to use when ordering `CourseEnrollment`. */
export type CourseEnrollmentsOrderBy =
  | "COURSE_ID_ASC"
  | "COURSE_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "USER_ID_ASC"
  | "USER_ID_DESC";

/** An input for mutations affecting `Course` */
export type CourseInput = {
  /** Docebo CourseId */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Text description from Docebo */
  description?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** A reference to the image */
  image?: InputMaybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: InputMaybe<Scalars["String"]>;
  /** Promoted courses a listed higher than others */
  promoted?: InputMaybe<Scalars["Boolean"]>;
  /** Course slug */
  slug?: InputMaybe<Scalars["String"]>;
  /** technology */
  technology?: InputMaybe<Scalars["String"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Course`. Fields that are set will be updated. */
export type CoursePatch = {
  /** Docebo CourseId */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Text description from Docebo */
  description?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** A reference to the image */
  image?: InputMaybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: InputMaybe<Scalars["String"]>;
  /** Promoted courses a listed higher than others */
  promoted?: InputMaybe<Scalars["Boolean"]>;
  /** Course slug */
  slug?: InputMaybe<Scalars["String"]>;
  /** technology */
  technology?: InputMaybe<Scalars["String"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Course Sync Configuration */
export type CourseSyncConfiguration = {
  __typename?: "CourseSyncConfiguration";
  /** account */
  configName?: Maybe<Scalars["String"]>;
  /** course */
  configValue?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `CourseSyncConfiguration` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type CourseSyncConfigurationCondition = {
  /** Checks for equality with the object’s `configName` field. */
  configName?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseSyncConfiguration` */
export type CourseSyncConfigurationInput = {
  /** account */
  configName?: InputMaybe<Scalars["String"]>;
  /** course */
  configValue?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseSyncConfiguration`. Fields that are set will be updated. */
export type CourseSyncConfigurationPatch = {
  /** account */
  configName?: InputMaybe<Scalars["String"]>;
  /** course */
  configValue?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CourseSyncConfiguration` values. */
export type CourseSyncConfigurationsConnection = {
  __typename?: "CourseSyncConfigurationsConnection";
  /** A list of edges which contains the `CourseSyncConfiguration` and cursor to aid in pagination. */
  edges: Array<CourseSyncConfigurationsEdge>;
  /** A list of `CourseSyncConfiguration` objects. */
  nodes: Array<CourseSyncConfiguration>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CourseSyncConfiguration` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CourseSyncConfiguration` edge in the connection. */
export type CourseSyncConfigurationsEdge = {
  __typename?: "CourseSyncConfigurationsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CourseSyncConfiguration` at the end of the edge. */
  node: CourseSyncConfiguration;
};

/** Methods to use when ordering `CourseSyncConfiguration`. */
export type CourseSyncConfigurationsOrderBy =
  | "CONFIG_NAME_ASC"
  | "CONFIG_NAME_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A temporary training course that BMI offers in Docebo. Courses are brought from Docebo into this table before being merged into the course table. */
export type CourseTemp = {
  __typename?: "CourseTemp";
  /** Docebo CourseId */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  /** Text description from Docebo */
  description?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** A reference to the image */
  image?: Maybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Promoted courses are intended to be listed higher than others. At time of writing, this data could not practically be acquired from the Docebo API */
  promoted?: Maybe<Scalars["Boolean"]>;
  /** Course slug */
  slug?: Maybe<Scalars["String"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `CourseTemp` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CourseTempCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseTemp` */
export type CourseTempInput = {
  /** Docebo CourseId */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Text description from Docebo */
  description?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** A reference to the image */
  image?: InputMaybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: InputMaybe<Scalars["String"]>;
  /** Promoted courses are intended to be listed higher than others. At time of writing, this data could not practically be acquired from the Docebo API */
  promoted?: InputMaybe<Scalars["Boolean"]>;
  /** Course slug */
  slug?: InputMaybe<Scalars["String"]>;
  /** technology */
  technology?: InputMaybe<Scalars["String"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseTemp`. Fields that are set will be updated. */
export type CourseTempPatch = {
  /** Docebo CourseId */
  courseId?: InputMaybe<Scalars["Int"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Text description from Docebo */
  description?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** A reference to the image */
  image?: InputMaybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: InputMaybe<Scalars["String"]>;
  /** Promoted courses are intended to be listed higher than others. At time of writing, this data could not practically be acquired from the Docebo API */
  promoted?: InputMaybe<Scalars["Boolean"]>;
  /** Course slug */
  slug?: InputMaybe<Scalars["String"]>;
  /** technology */
  technology?: InputMaybe<Scalars["String"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CourseTemp` values. */
export type CourseTempsConnection = {
  __typename?: "CourseTempsConnection";
  /** A list of edges which contains the `CourseTemp` and cursor to aid in pagination. */
  edges: Array<CourseTempsEdge>;
  /** A list of `CourseTemp` objects. */
  nodes: Array<CourseTemp>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CourseTemp` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `CourseTemp` edge in the connection. */
export type CourseTempsEdge = {
  __typename?: "CourseTempsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CourseTemp` at the end of the edge. */
  node: CourseTemp;
};

/** Methods to use when ordering `CourseTemp`. */
export type CourseTempsOrderBy =
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** All input for the `courseUpdateByTemp` mutation. */
export type CourseUpdateByTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** The output of our `courseUpdateByTemp` mutation. */
export type CourseUpdateByTempPayload = {
  __typename?: "CourseUpdateByTempPayload";
  bigInt?: Maybe<Scalars["BigInt"]>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `courseUpdate` mutation. */
export type CourseUpdateInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  courses?: InputMaybe<Array<InputMaybe<CourseInput>>>;
};

/** The output of our `courseUpdate` mutation. */
export type CourseUpdatePayload = {
  __typename?: "CourseUpdatePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** A connection to a list of `Course` values. */
export type CoursesConnection = {
  __typename?: "CoursesConnection";
  /** A list of edges which contains the `Course` and cursor to aid in pagination. */
  edges: Array<CoursesEdge>;
  /** A list of `Course` objects. */
  nodes: Array<Course>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Course` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Course` edge in the connection. */
export type CoursesEdge = {
  __typename?: "CoursesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Course` at the end of the edge. */
  node: Course;
};

/** Methods to use when ordering `Course`. */
export type CoursesOrderBy =
  | "COURSE_ID_ASC"
  | "COURSE_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** All input for the `createAccount` mutation. */
export type CreateAccountInput = {
  account?: InputMaybe<AccountInput>;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  marketCode?: InputMaybe<Scalars["String"]>;
};

/** The output of our `createAccount` mutation. */
export type CreateAccountPayload = {
  __typename?: "CreateAccountPayload";
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our `createAccount` mutation. */
export type CreateAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the create `Address` mutation. */
export type CreateAddressInput = {
  /** The `Address` to be created by this mutation. */
  address: AddressInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** The output of our create `Address` mutation. */
export type CreateAddressPayload = {
  __typename?: "CreateAddressPayload";
  /** The `Address` that was created by this mutation. */
  address?: Maybe<Address>;
  /** An edge for our `Address`. May be used by Relay 1. */
  addressEdge?: Maybe<AddressesEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Address` mutation. */
export type CreateAddressPayloadAddressEdgeArgs = {
  orderBy?: InputMaybe<Array<AddressesOrderBy>>;
};

/** All input for the create `Certification` mutation. */
export type CreateCertificationInput = {
  /** The `Certification` to be created by this mutation. */
  certification: CertificationInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** The output of our create `Certification` mutation. */
export type CreateCertificationPayload = {
  __typename?: "CreateCertificationPayload";
  /** The `Certification` that was created by this mutation. */
  certification?: Maybe<Certification>;
  /** An edge for our `Certification`. May be used by Relay 1. */
  certificationEdge?: Maybe<CertificationsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Account` that is related to this `Certification`. */
  doceboUser?: Maybe<Account>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Certification` mutation. */
export type CreateCertificationPayloadCertificationEdgeArgs = {
  orderBy?: InputMaybe<Array<CertificationsOrderBy>>;
};

/** All input for the create `CompanyDocument` mutation. */
export type CreateCompanyDocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
  /** The `CompanyDocument` that was created by this mutation. */
  companyDocument?: Maybe<CompanyDocument>;
  /** An edge for our `CompanyDocument`. May be used by Relay 1. */
  companyDocumentEdge?: Maybe<CompanyDocumentsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CompanyDocument` mutation. */
export type CreateCompanyDocumentPayloadCompanyDocumentEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyDocumentsOrderBy>>;
};

/** All input for the `createCompanyDocuments` mutation. */
export type CreateCompanyDocumentsInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  documents: Array<InputMaybe<CompanyDocumentInput>>;
};

/** The output of our `createCompanyDocuments` mutation. */
export type CreateCompanyDocumentsPayload = {
  __typename?: "CreateCompanyDocumentsPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  companyDocuments?: Maybe<Array<CompanyDocument>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `createCompany` mutation. */
export type CreateCompanyInput = {
  aboutUs?: InputMaybe<Scalars["String"]>;
  businessType?: InputMaybe<BusinessType>;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  facebook?: InputMaybe<Scalars["String"]>;
  linkedIn?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  ownerEmail?: InputMaybe<Scalars["String"]>;
  ownerFullname?: InputMaybe<Scalars["String"]>;
  ownerPhone?: InputMaybe<Scalars["String"]>;
  phone?: InputMaybe<Scalars["String"]>;
  publicEmail?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<CompanyStatus>;
  taxNumber?: InputMaybe<Scalars["String"]>;
  tier?: InputMaybe<Tier>;
  website?: InputMaybe<Scalars["String"]>;
};

/** All input for the create `CompanyMember` mutation. */
export type CreateCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `CompanyMember` to be created by this mutation. */
  companyMember: CompanyMemberInput;
};

/** The output of our create `CompanyMember` mutation. */
export type CreateCompanyMemberPayload = {
  __typename?: "CreateCompanyMemberPayload";
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  /** The `CompanyMember` that was created by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMembersEdge>;
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CompanyMember` mutation. */
export type CreateCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyMembersOrderBy>>;
};

/** All input for the create `CompanyOperation` mutation. */
export type CreateCompanyOperationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** Reads a single `Company` that is related to this `CompanyOperation`. */
  companyByCompany?: Maybe<Company>;
  /** The `CompanyOperation` that was created by this mutation. */
  companyOperation?: Maybe<CompanyOperation>;
  /** An edge for our `CompanyOperation`. May be used by Relay 1. */
  companyOperationEdge?: Maybe<CompanyOperationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CompanyOperation` mutation. */
export type CreateCompanyOperationPayloadCompanyOperationEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyOperationsOrderBy>>;
};

/** The output of our `createCompany` mutation. */
export type CreateCompanyPayload = {
  __typename?: "CreateCompanyPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  company?: Maybe<Company>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
};

/** The output of our `createCompany` mutation. */
export type CreateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: InputMaybe<Array<CompaniesOrderBy>>;
};

/** All input for the create `CourseCatalogue` mutation. */
export type CreateCourseCatalogueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `CourseCatalogue` to be created by this mutation. */
  courseCatalogue: CourseCatalogueInput;
};

/** The output of our create `CourseCatalogue` mutation. */
export type CreateCourseCataloguePayload = {
  __typename?: "CreateCourseCataloguePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Course` that is related to this `CourseCatalogue`. */
  course?: Maybe<Course>;
  /** The `CourseCatalogue` that was created by this mutation. */
  courseCatalogue?: Maybe<CourseCatalogue>;
  /** An edge for our `CourseCatalogue`. May be used by Relay 1. */
  courseCatalogueEdge?: Maybe<CourseCataloguesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CourseCatalogue` mutation. */
export type CreateCourseCataloguePayloadCourseCatalogueEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseCataloguesOrderBy>>;
};

/** All input for the create `CourseCatalogueTemp` mutation. */
export type CreateCourseCatalogueTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `CourseCatalogueTemp` to be created by this mutation. */
  courseCatalogueTemp: CourseCatalogueTempInput;
};

/** The output of our create `CourseCatalogueTemp` mutation. */
export type CreateCourseCatalogueTempPayload = {
  __typename?: "CreateCourseCatalogueTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseCatalogueTemp` that was created by this mutation. */
  courseCatalogueTemp?: Maybe<CourseCatalogueTemp>;
  /** An edge for our `CourseCatalogueTemp`. May be used by Relay 1. */
  courseCatalogueTempEdge?: Maybe<CourseCatalogueTempsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CourseCatalogueTemp` mutation. */
export type CreateCourseCatalogueTempPayloadCourseCatalogueTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseCatalogueTempsOrderBy>>;
};

/** All input for the create `CourseEnrollment` mutation. */
export type CreateCourseEnrollmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `CourseEnrollment` to be created by this mutation. */
  courseEnrollment: CourseEnrollmentInput;
};

/** The output of our create `CourseEnrollment` mutation. */
export type CreateCourseEnrollmentPayload = {
  __typename?: "CreateCourseEnrollmentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Course` that is related to this `CourseEnrollment`. */
  course?: Maybe<Course>;
  /** The `CourseEnrollment` that was created by this mutation. */
  courseEnrollment?: Maybe<CourseEnrollment>;
  /** An edge for our `CourseEnrollment`. May be used by Relay 1. */
  courseEnrollmentEdge?: Maybe<CourseEnrollmentsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CourseEnrollment` mutation. */
export type CreateCourseEnrollmentPayloadCourseEnrollmentEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseEnrollmentsOrderBy>>;
};

/** All input for the create `CourseEnrollmentTemp` mutation. */
export type CreateCourseEnrollmentTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `CourseEnrollmentTemp` to be created by this mutation. */
  courseEnrollmentTemp: CourseEnrollmentTempInput;
};

/** The output of our create `CourseEnrollmentTemp` mutation. */
export type CreateCourseEnrollmentTempPayload = {
  __typename?: "CreateCourseEnrollmentTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseEnrollmentTemp` that was created by this mutation. */
  courseEnrollmentTemp?: Maybe<CourseEnrollmentTemp>;
  /** An edge for our `CourseEnrollmentTemp`. May be used by Relay 1. */
  courseEnrollmentTempEdge?: Maybe<CourseEnrollmentTempsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CourseEnrollmentTemp` mutation. */
export type CreateCourseEnrollmentTempPayloadCourseEnrollmentTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseEnrollmentTempsOrderBy>>;
};

/** All input for the create `Course` mutation. */
export type CreateCourseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `Course` to be created by this mutation. */
  course: CourseInput;
};

/** The output of our create `Course` mutation. */
export type CreateCoursePayload = {
  __typename?: "CreateCoursePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Course` that was created by this mutation. */
  course?: Maybe<Course>;
  /** An edge for our `Course`. May be used by Relay 1. */
  courseEdge?: Maybe<CoursesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Course` mutation. */
export type CreateCoursePayloadCourseEdgeArgs = {
  orderBy?: InputMaybe<Array<CoursesOrderBy>>;
};

/** All input for the create `CourseSyncConfiguration` mutation. */
export type CreateCourseSyncConfigurationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `CourseSyncConfiguration` to be created by this mutation. */
  courseSyncConfiguration: CourseSyncConfigurationInput;
};

/** The output of our create `CourseSyncConfiguration` mutation. */
export type CreateCourseSyncConfigurationPayload = {
  __typename?: "CreateCourseSyncConfigurationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseSyncConfiguration` that was created by this mutation. */
  courseSyncConfiguration?: Maybe<CourseSyncConfiguration>;
  /** An edge for our `CourseSyncConfiguration`. May be used by Relay 1. */
  courseSyncConfigurationEdge?: Maybe<CourseSyncConfigurationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CourseSyncConfiguration` mutation. */
export type CreateCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs =
  {
    orderBy?: InputMaybe<Array<CourseSyncConfigurationsOrderBy>>;
  };

/** All input for the create `CourseTemp` mutation. */
export type CreateCourseTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `CourseTemp` to be created by this mutation. */
  courseTemp: CourseTempInput;
};

/** The output of our create `CourseTemp` mutation. */
export type CreateCourseTempPayload = {
  __typename?: "CreateCourseTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseTemp` that was created by this mutation. */
  courseTemp?: Maybe<CourseTemp>;
  /** An edge for our `CourseTemp`. May be used by Relay 1. */
  courseTempEdge?: Maybe<CourseTempsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `CourseTemp` mutation. */
export type CreateCourseTempPayloadCourseTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseTempsOrderBy>>;
};

/** All input for the create `EvidenceItem` mutation. */
export type CreateEvidenceItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** An edge for our `EvidenceItem`. May be used by Relay 1. */
  evidenceItemEdge?: Maybe<EvidenceItemsEdge>;
  /** Reads a single `Guarantee` that is related to this `EvidenceItem`. */
  guarantee?: Maybe<Guarantee>;
  /** Reads a single `Project` that is related to this `EvidenceItem`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `EvidenceItem` mutation. */
export type CreateEvidenceItemPayloadEvidenceItemEdgeArgs = {
  orderBy?: InputMaybe<Array<EvidenceItemsOrderBy>>;
};

/** All input for the create `Guarantee` mutation. */
export type CreateGuaranteeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
  /** Reads a single `Product` that is related to this `Guarantee`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  systemBySystemBmiRef?: Maybe<System>;
};

/** The output of our create `Guarantee` mutation. */
export type CreateGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** All input for the create `Market` mutation. */
export type CreateMarketInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** An edge for our `Market`. May be used by Relay 1. */
  marketEdge?: Maybe<MarketsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Market` mutation. */
export type CreateMarketPayloadMarketEdgeArgs = {
  orderBy?: InputMaybe<Array<MarketsOrderBy>>;
};

/** All input for the create `Note` mutation. */
export type CreateNoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `Note` to be created by this mutation. */
  note: NoteInput;
};

/** The output of our create `Note` mutation. */
export type CreateNotePayload = {
  __typename?: "CreateNotePayload";
  /** Reads a single `Account` that is related to this `Note`. */
  author?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Note` that was created by this mutation. */
  note?: Maybe<Note>;
  /** An edge for our `Note`. May be used by Relay 1. */
  noteEdge?: Maybe<NotesEdge>;
  /** Reads a single `Project` that is related to this `Note`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Note` mutation. */
export type CreateNotePayloadNoteEdgeArgs = {
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
};

/** All input for the create `Notification` mutation. */
export type CreateNotificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `Notification` to be created by this mutation. */
  notification: NotificationInput;
};

/** The output of our create `Notification` mutation. */
export type CreateNotificationPayload = {
  __typename?: "CreateNotificationPayload";
  /** Reads a single `Account` that is related to this `Notification`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Notification` that was created by this mutation. */
  notification?: Maybe<Notification>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Notification` mutation. */
export type CreateNotificationPayloadNotificationEdgeArgs = {
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};

/** All input for the create `Product` mutation. */
export type CreateProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** The `Product` that was created by this mutation. */
  product?: Maybe<Product>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Product` mutation. */
export type CreateProductPayloadProductEdgeArgs = {
  orderBy?: InputMaybe<Array<ProductsOrderBy>>;
};

/** All input for the create `Project` mutation. */
export type CreateProjectInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `Project` to be created by this mutation. */
  project: ProjectInput;
};

/** All input for the create `ProjectMember` mutation. */
export type CreateProjectMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `ProjectMember` to be created by this mutation. */
  projectMember: ProjectMemberInput;
};

/** The output of our create `ProjectMember` mutation. */
export type CreateProjectMemberPayload = {
  __typename?: "CreateProjectMemberPayload";
  /** Reads a single `Account` that is related to this `ProjectMember`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Project` that is related to this `ProjectMember`. */
  project?: Maybe<Project>;
  /** The `ProjectMember` that was created by this mutation. */
  projectMember?: Maybe<ProjectMember>;
  /** An edge for our `ProjectMember`. May be used by Relay 1. */
  projectMemberEdge?: Maybe<ProjectMembersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `ProjectMember` mutation. */
export type CreateProjectMemberPayloadProjectMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<ProjectMembersOrderBy>>;
};

/** The output of our create `Project` mutation. */
export type CreateProjectPayload = {
  __typename?: "CreateProjectPayload";
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  /** The `Project` that was created by this mutation. */
  project?: Maybe<Project>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
};

/** The output of our create `Project` mutation. */
export type CreateProjectPayloadProjectEdgeArgs = {
  orderBy?: InputMaybe<Array<ProjectsOrderBy>>;
};

/** All input for the create `System` mutation. */
export type CreateSystemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The `System` to be created by this mutation. */
  system: SystemInput;
};

/** All input for the create `SystemMember` mutation. */
export type CreateSystemMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** Reads a single `Market` that is related to this `SystemMember`. */
  market?: Maybe<Market>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `System` that is related to this `SystemMember`. */
  systemBySystemBmiRef?: Maybe<System>;
  /** The `SystemMember` that was created by this mutation. */
  systemMember?: Maybe<SystemMember>;
  /** An edge for our `SystemMember`. May be used by Relay 1. */
  systemMemberEdge?: Maybe<SystemMembersEdge>;
};

/** The output of our create `SystemMember` mutation. */
export type CreateSystemMemberPayloadSystemMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<SystemMembersOrderBy>>;
};

/** The output of our create `System` mutation. */
export type CreateSystemPayload = {
  __typename?: "CreateSystemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `System` that was created by this mutation. */
  system?: Maybe<System>;
  /** An edge for our `System`. May be used by Relay 1. */
  systemEdge?: Maybe<SystemsEdge>;
};

/** The output of our create `System` mutation. */
export type CreateSystemPayloadSystemEdgeArgs = {
  orderBy?: InputMaybe<Array<SystemsOrderBy>>;
};

export type CustomEvidenceCategoryKey =
  | "FLAT_BASE"
  | "FLAT_DETAILS"
  | "FLAT_FIXINGS"
  | "FLAT_INSULATION"
  | "FLAT_LAYER"
  | "FLAT_PENETRATIONS"
  | "FLAT_PLAN"
  | "FLAT_SAFETY"
  | "FLAT_TOP"
  | "FLAT_VENTILATION"
  | "MISC_1"
  | "MISC_2"
  | "MISC_3"
  | "MISC_4"
  | "PITCHED_BASE"
  | "PITCHED_DETAILS"
  | "PITCHED_FIXINGS"
  | "PITCHED_INSPECTION"
  | "PITCHED_INSULATION"
  | "PITCHED_PENETRATIONS"
  | "PITCHED_PLAN"
  | "PITCHED_SAFETY"
  | "PITCHED_TILES"
  | "PITCHED_UNDERLAY"
  | "PITCHED_VENTILATION";

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars["Datetime"]>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars["Datetime"]>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars["Datetime"]>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars["Datetime"]>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars["Datetime"]>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars["Boolean"]>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars["Datetime"]>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars["Datetime"]>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars["Datetime"]>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars["Datetime"]>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars["Datetime"]>>;
};

/** All input for the `deleteAccountByDoceboUserId` mutation. */
export type DeleteAccountByDoceboUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** User account in Docebo */
  doceboUserId: Scalars["Int"];
};

/** All input for the `deleteAccountByEmail` mutation. */
export type DeleteAccountByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email: Scalars["String"];
};

/** All input for the `deleteAccountByNodeId` mutation. */
export type DeleteAccountByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Account` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteAccount` mutation. */
export type DeleteAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayload = {
  __typename?: "DeleteAccountPayload";
  /** The `Account` that was deleted by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  deletedAccountNodeId?: Maybe<Scalars["ID"]>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `deleteAddressByNodeId` mutation. */
export type DeleteAddressByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Address` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteAddress` mutation. */
export type DeleteAddressInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Address` mutation. */
export type DeleteAddressPayload = {
  __typename?: "DeleteAddressPayload";
  /** The `Address` that was deleted by this mutation. */
  address?: Maybe<Address>;
  /** An edge for our `Address`. May be used by Relay 1. */
  addressEdge?: Maybe<AddressesEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  deletedAddressNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Address` mutation. */
export type DeleteAddressPayloadAddressEdgeArgs = {
  orderBy?: InputMaybe<Array<AddressesOrderBy>>;
};

/** All input for the `deleteCertificationByNodeId` mutation. */
export type DeleteCertificationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Certification` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCertification` mutation. */
export type DeleteCertificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Certification` mutation. */
export type DeleteCertificationPayload = {
  __typename?: "DeleteCertificationPayload";
  /** The `Certification` that was deleted by this mutation. */
  certification?: Maybe<Certification>;
  /** An edge for our `Certification`. May be used by Relay 1. */
  certificationEdge?: Maybe<CertificationsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  deletedCertificationNodeId?: Maybe<Scalars["ID"]>;
  /** Reads a single `Account` that is related to this `Certification`. */
  doceboUser?: Maybe<Account>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Certification` mutation. */
export type DeleteCertificationPayloadCertificationEdgeArgs = {
  orderBy?: InputMaybe<Array<CertificationsOrderBy>>;
};

/** All input for the `deleteCompanyByMarketIdAndName` mutation. */
export type DeleteCompanyByMarketIdAndNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId: Scalars["Int"];
  /** The registered name of the Company */
  name: Scalars["String"];
};

/** All input for the `deleteCompanyByNodeId` mutation. */
export type DeleteCompanyByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Company` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanyByReferenceNumber` mutation. */
export type DeleteCompanyByReferenceNumberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber: Scalars["Int"];
};

/** All input for the `deleteCompanyDocumentByNodeId` mutation. */
export type DeleteCompanyDocumentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyDocument` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanyDocument` mutation. */
export type DeleteCompanyDocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
  /** The `CompanyDocument` that was deleted by this mutation. */
  companyDocument?: Maybe<CompanyDocument>;
  /** An edge for our `CompanyDocument`. May be used by Relay 1. */
  companyDocumentEdge?: Maybe<CompanyDocumentsEdge>;
  deletedCompanyDocumentNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CompanyDocument` mutation. */
export type DeleteCompanyDocumentPayloadCompanyDocumentEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyDocumentsOrderBy>>;
};

/** All input for the `deleteCompany` mutation. */
export type DeleteCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `deleteCompanyMemberByMarketIdAndAccountIdAndCompanyId` mutation. */
export type DeleteCompanyMemberByMarketIdAndAccountIdAndCompanyIdInput = {
  /** fk */
  accountId: Scalars["Int"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId: Scalars["Int"];
  /** fk */
  marketId: Scalars["Int"];
};

/** All input for the `deleteCompanyMemberByNodeId` mutation. */
export type DeleteCompanyMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanyMember` mutation. */
export type DeleteCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CompanyMember` mutation. */
export type DeleteCompanyMemberPayload = {
  __typename?: "DeleteCompanyMemberPayload";
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  /** The `CompanyMember` that was deleted by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMembersEdge>;
  deletedCompanyMemberNodeId?: Maybe<Scalars["ID"]>;
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CompanyMember` mutation. */
export type DeleteCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyMembersOrderBy>>;
};

/** All input for the `deleteCompanyOperationByNodeId` mutation. */
export type DeleteCompanyOperationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CompanyOperation` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanyOperation` mutation. */
export type DeleteCompanyOperationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** Reads a single `Company` that is related to this `CompanyOperation`. */
  companyByCompany?: Maybe<Company>;
  /** The `CompanyOperation` that was deleted by this mutation. */
  companyOperation?: Maybe<CompanyOperation>;
  /** An edge for our `CompanyOperation`. May be used by Relay 1. */
  companyOperationEdge?: Maybe<CompanyOperationsEdge>;
  deletedCompanyOperationNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CompanyOperation` mutation. */
export type DeleteCompanyOperationPayloadCompanyOperationEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyOperationsOrderBy>>;
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
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
  deletedCompanyNodeId?: Maybe<Scalars["ID"]>;
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
};

/** The output of our delete `Company` mutation. */
export type DeleteCompanyPayloadCompanyEdgeArgs = {
  orderBy?: InputMaybe<Array<CompaniesOrderBy>>;
};

/** All input for the `deleteCourseByCourseId` mutation. */
export type DeleteCourseByCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Docebo CourseId */
  courseId: Scalars["Int"];
};

/** All input for the `deleteCourseByNodeId` mutation. */
export type DeleteCourseByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Course` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseCatalogueByCatalogueIdAndCourseId` mutation. */
export type DeleteCourseCatalogueByCatalogueIdAndCourseIdInput = {
  /** market */
  catalogueId: Scalars["Int"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  courseId: Scalars["Int"];
};

/** All input for the `deleteCourseCatalogueByNodeId` mutation. */
export type DeleteCourseCatalogueByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseCatalogue` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseCatalogue` mutation. */
export type DeleteCourseCatalogueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CourseCatalogue` mutation. */
export type DeleteCourseCataloguePayload = {
  __typename?: "DeleteCourseCataloguePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Course` that is related to this `CourseCatalogue`. */
  course?: Maybe<Course>;
  /** The `CourseCatalogue` that was deleted by this mutation. */
  courseCatalogue?: Maybe<CourseCatalogue>;
  /** An edge for our `CourseCatalogue`. May be used by Relay 1. */
  courseCatalogueEdge?: Maybe<CourseCataloguesEdge>;
  deletedCourseCatalogueNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CourseCatalogue` mutation. */
export type DeleteCourseCataloguePayloadCourseCatalogueEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseCataloguesOrderBy>>;
};

/** All input for the `deleteCourseCatalogueTempByNodeId` mutation. */
export type DeleteCourseCatalogueTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseCatalogueTemp` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseCatalogueTemp` mutation. */
export type DeleteCourseCatalogueTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CourseCatalogueTemp` mutation. */
export type DeleteCourseCatalogueTempPayload = {
  __typename?: "DeleteCourseCatalogueTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseCatalogueTemp` that was deleted by this mutation. */
  courseCatalogueTemp?: Maybe<CourseCatalogueTemp>;
  /** An edge for our `CourseCatalogueTemp`. May be used by Relay 1. */
  courseCatalogueTempEdge?: Maybe<CourseCatalogueTempsEdge>;
  deletedCourseCatalogueTempNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CourseCatalogueTemp` mutation. */
export type DeleteCourseCatalogueTempPayloadCourseCatalogueTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseCatalogueTempsOrderBy>>;
};

/** All input for the `deleteCourseEnrollmentByNodeId` mutation. */
export type DeleteCourseEnrollmentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseEnrollment` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseEnrollmentByUserIdAndCourseId` mutation. */
export type DeleteCourseEnrollmentByUserIdAndCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  courseId: Scalars["Int"];
  /** account */
  userId: Scalars["Int"];
};

/** All input for the `deleteCourseEnrollment` mutation. */
export type DeleteCourseEnrollmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CourseEnrollment` mutation. */
export type DeleteCourseEnrollmentPayload = {
  __typename?: "DeleteCourseEnrollmentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Course` that is related to this `CourseEnrollment`. */
  course?: Maybe<Course>;
  /** The `CourseEnrollment` that was deleted by this mutation. */
  courseEnrollment?: Maybe<CourseEnrollment>;
  /** An edge for our `CourseEnrollment`. May be used by Relay 1. */
  courseEnrollmentEdge?: Maybe<CourseEnrollmentsEdge>;
  deletedCourseEnrollmentNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CourseEnrollment` mutation. */
export type DeleteCourseEnrollmentPayloadCourseEnrollmentEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseEnrollmentsOrderBy>>;
};

/** All input for the `deleteCourseEnrollmentTempByNodeId` mutation. */
export type DeleteCourseEnrollmentTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseEnrollmentTemp` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseEnrollmentTemp` mutation. */
export type DeleteCourseEnrollmentTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CourseEnrollmentTemp` mutation. */
export type DeleteCourseEnrollmentTempPayload = {
  __typename?: "DeleteCourseEnrollmentTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseEnrollmentTemp` that was deleted by this mutation. */
  courseEnrollmentTemp?: Maybe<CourseEnrollmentTemp>;
  /** An edge for our `CourseEnrollmentTemp`. May be used by Relay 1. */
  courseEnrollmentTempEdge?: Maybe<CourseEnrollmentTempsEdge>;
  deletedCourseEnrollmentTempNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CourseEnrollmentTemp` mutation. */
export type DeleteCourseEnrollmentTempPayloadCourseEnrollmentTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseEnrollmentTempsOrderBy>>;
};

/** All input for the `deleteCourse` mutation. */
export type DeleteCourseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Course` mutation. */
export type DeleteCoursePayload = {
  __typename?: "DeleteCoursePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Course` that was deleted by this mutation. */
  course?: Maybe<Course>;
  /** An edge for our `Course`. May be used by Relay 1. */
  courseEdge?: Maybe<CoursesEdge>;
  deletedCourseNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Course` mutation. */
export type DeleteCoursePayloadCourseEdgeArgs = {
  orderBy?: InputMaybe<Array<CoursesOrderBy>>;
};

/** All input for the `deleteCourseSyncConfigurationByConfigName` mutation. */
export type DeleteCourseSyncConfigurationByConfigNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** account */
  configName: Scalars["String"];
};

/** All input for the `deleteCourseSyncConfigurationByNodeId` mutation. */
export type DeleteCourseSyncConfigurationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseSyncConfiguration` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseSyncConfiguration` mutation. */
export type DeleteCourseSyncConfigurationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CourseSyncConfiguration` mutation. */
export type DeleteCourseSyncConfigurationPayload = {
  __typename?: "DeleteCourseSyncConfigurationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseSyncConfiguration` that was deleted by this mutation. */
  courseSyncConfiguration?: Maybe<CourseSyncConfiguration>;
  /** An edge for our `CourseSyncConfiguration`. May be used by Relay 1. */
  courseSyncConfigurationEdge?: Maybe<CourseSyncConfigurationsEdge>;
  deletedCourseSyncConfigurationNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CourseSyncConfiguration` mutation. */
export type DeleteCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs =
  {
    orderBy?: InputMaybe<Array<CourseSyncConfigurationsOrderBy>>;
  };

/** All input for the `deleteCourseTempByNodeId` mutation. */
export type DeleteCourseTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseTemp` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseTemp` mutation. */
export type DeleteCourseTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `CourseTemp` mutation. */
export type DeleteCourseTempPayload = {
  __typename?: "DeleteCourseTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseTemp` that was deleted by this mutation. */
  courseTemp?: Maybe<CourseTemp>;
  /** An edge for our `CourseTemp`. May be used by Relay 1. */
  courseTempEdge?: Maybe<CourseTempsEdge>;
  deletedCourseTempNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `CourseTemp` mutation. */
export type DeleteCourseTempPayloadCourseTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseTempsOrderBy>>;
};

/** All input for the `deleteEvidenceItemByNodeId` mutation. */
export type DeleteEvidenceItemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `EvidenceItem` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteEvidenceItem` mutation. */
export type DeleteEvidenceItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  deletedEvidenceItemNodeId?: Maybe<Scalars["ID"]>;
  /** The `EvidenceItem` that was deleted by this mutation. */
  evidenceItem?: Maybe<EvidenceItem>;
  /** An edge for our `EvidenceItem`. May be used by Relay 1. */
  evidenceItemEdge?: Maybe<EvidenceItemsEdge>;
  /** Reads a single `Guarantee` that is related to this `EvidenceItem`. */
  guarantee?: Maybe<Guarantee>;
  /** Reads a single `Project` that is related to this `EvidenceItem`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `EvidenceItem` mutation. */
export type DeleteEvidenceItemPayloadEvidenceItemEdgeArgs = {
  orderBy?: InputMaybe<Array<EvidenceItemsOrderBy>>;
};

/** All input for the `deleteGuaranteeByBmiReferenceId` mutation. */
export type DeleteGuaranteeByBmiReferenceIdInput = {
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId: Scalars["String"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** All input for the `deleteGuaranteeByNodeId` mutation. */
export type DeleteGuaranteeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Guarantee` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteGuarantee` mutation. */
export type DeleteGuaranteeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  deletedGuaranteeNodeId?: Maybe<Scalars["ID"]>;
  /** The `Guarantee` that was deleted by this mutation. */
  guarantee?: Maybe<Guarantee>;
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
  /** Reads a single `Product` that is related to this `Guarantee`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  systemBySystemBmiRef?: Maybe<System>;
};

/** The output of our delete `Guarantee` mutation. */
export type DeleteGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** All input for the `deleteInvitationByNodeId` mutation. */
export type DeleteInvitationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Invitation` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteInvitation` mutation. */
export type DeleteInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  /** Reads a single `Company` that is related to this `Invitation`. */
  company?: Maybe<Company>;
  deletedInvitationNodeId?: Maybe<Scalars["ID"]>;
  /** The `Invitation` that was deleted by this mutation. */
  invitation?: Maybe<Invitation>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Invitation`. */
  senderAccount?: Maybe<Account>;
};

/** The output of our delete `Invitation` mutation. */
export type DeleteInvitationPayloadInvitationEdgeArgs = {
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};

/** All input for the `deleteMarketByDoceboCatalogueId` mutation. */
export type DeleteMarketByDoceboCatalogueIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId: Scalars["Int"];
};

/** All input for the `deleteMarketByDomain` mutation. */
export type DeleteMarketByDomainInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
};

/** All input for the `deleteMarketByNodeId` mutation. */
export type DeleteMarketByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Market` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteMarket` mutation. */
export type DeleteMarketInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  deletedMarketNodeId?: Maybe<Scalars["ID"]>;
  /** The `Market` that was deleted by this mutation. */
  market?: Maybe<Market>;
  /** An edge for our `Market`. May be used by Relay 1. */
  marketEdge?: Maybe<MarketsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Market` mutation. */
export type DeleteMarketPayloadMarketEdgeArgs = {
  orderBy?: InputMaybe<Array<MarketsOrderBy>>;
};

/** All input for the `deleteNoteByNodeId` mutation. */
export type DeleteNoteByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Note` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteNote` mutation. */
export type DeleteNoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Note` mutation. */
export type DeleteNotePayload = {
  __typename?: "DeleteNotePayload";
  /** Reads a single `Account` that is related to this `Note`. */
  author?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  deletedNoteNodeId?: Maybe<Scalars["ID"]>;
  /** The `Note` that was deleted by this mutation. */
  note?: Maybe<Note>;
  /** An edge for our `Note`. May be used by Relay 1. */
  noteEdge?: Maybe<NotesEdge>;
  /** Reads a single `Project` that is related to this `Note`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Note` mutation. */
export type DeleteNotePayloadNoteEdgeArgs = {
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
};

/** All input for the `deleteNotificationByNodeId` mutation. */
export type DeleteNotificationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Notification` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteNotification` mutation. */
export type DeleteNotificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Notification` mutation. */
export type DeleteNotificationPayload = {
  __typename?: "DeleteNotificationPayload";
  /** Reads a single `Account` that is related to this `Notification`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  deletedNotificationNodeId?: Maybe<Scalars["ID"]>;
  /** The `Notification` that was deleted by this mutation. */
  notification?: Maybe<Notification>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Notification` mutation. */
export type DeleteNotificationPayloadNotificationEdgeArgs = {
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};

/** All input for the `deleteProductByBmiRef` mutation. */
export type DeleteProductByBmiRefInput = {
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** All input for the `deleteProductByNodeId` mutation. */
export type DeleteProductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Product` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteProduct` mutation. */
export type DeleteProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  deletedProductNodeId?: Maybe<Scalars["ID"]>;
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** The `Product` that was deleted by this mutation. */
  product?: Maybe<Product>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Product` mutation. */
export type DeleteProductPayloadProductEdgeArgs = {
  orderBy?: InputMaybe<Array<ProductsOrderBy>>;
};

/** All input for the `deleteProjectByNodeId` mutation. */
export type DeleteProjectByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Project` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteProject` mutation. */
export type DeleteProjectInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `deleteProjectMemberByNodeId` mutation. */
export type DeleteProjectMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `ProjectMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteProjectMember` mutation. */
export type DeleteProjectMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `ProjectMember` mutation. */
export type DeleteProjectMemberPayload = {
  __typename?: "DeleteProjectMemberPayload";
  /** Reads a single `Account` that is related to this `ProjectMember`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  deletedProjectMemberNodeId?: Maybe<Scalars["ID"]>;
  /** Reads a single `Project` that is related to this `ProjectMember`. */
  project?: Maybe<Project>;
  /** The `ProjectMember` that was deleted by this mutation. */
  projectMember?: Maybe<ProjectMember>;
  /** An edge for our `ProjectMember`. May be used by Relay 1. */
  projectMemberEdge?: Maybe<ProjectMembersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `ProjectMember` mutation. */
export type DeleteProjectMemberPayloadProjectMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<ProjectMembersOrderBy>>;
};

/** The output of our delete `Project` mutation. */
export type DeleteProjectPayload = {
  __typename?: "DeleteProjectPayload";
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  deletedProjectNodeId?: Maybe<Scalars["ID"]>;
  /** The `Project` that was deleted by this mutation. */
  project?: Maybe<Project>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
};

/** The output of our delete `Project` mutation. */
export type DeleteProjectPayloadProjectEdgeArgs = {
  orderBy?: InputMaybe<Array<ProjectsOrderBy>>;
};

/** All input for the `deleteSystemByBmiRef` mutation. */
export type DeleteSystemByBmiRefInput = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** All input for the `deleteSystemByNodeId` mutation. */
export type DeleteSystemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `System` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteSystem` mutation. */
export type DeleteSystemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `deleteSystemMemberByNodeId` mutation. */
export type DeleteSystemMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `SystemMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteSystemMemberBySystemBmiRefAndProductBmiRefAndMarketId` mutation. */
export type DeleteSystemMemberBySystemBmiRefAndProductBmiRefAndMarketIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId: Scalars["Int"];
  /** fk */
  productBmiRef: Scalars["String"];
  /** fk */
  systemBmiRef: Scalars["String"];
};

/** All input for the `deleteSystemMember` mutation. */
export type DeleteSystemMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  deletedSystemMemberNodeId?: Maybe<Scalars["ID"]>;
  /** Reads a single `Market` that is related to this `SystemMember`. */
  market?: Maybe<Market>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `System` that is related to this `SystemMember`. */
  systemBySystemBmiRef?: Maybe<System>;
  /** The `SystemMember` that was deleted by this mutation. */
  systemMember?: Maybe<SystemMember>;
  /** An edge for our `SystemMember`. May be used by Relay 1. */
  systemMemberEdge?: Maybe<SystemMembersEdge>;
};

/** The output of our delete `SystemMember` mutation. */
export type DeleteSystemMemberPayloadSystemMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<SystemMembersOrderBy>>;
};

/** The output of our delete `System` mutation. */
export type DeleteSystemPayload = {
  __typename?: "DeleteSystemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  deletedSystemNodeId?: Maybe<Scalars["ID"]>;
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `System` that was deleted by this mutation. */
  system?: Maybe<System>;
  /** An edge for our `System`. May be used by Relay 1. */
  systemEdge?: Maybe<SystemsEdge>;
};

/** The output of our delete `System` mutation. */
export type DeleteSystemPayloadSystemEdgeArgs = {
  orderBy?: InputMaybe<Array<SystemsOrderBy>>;
};

export type Entry = {
  contentfulMetadata: ContentfulMetadata;
  sys: Sys;
};

export type EntryCollection = {
  __typename?: "EntryCollection";
  items: Array<Maybe<Entry>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type EntryFilter = {
  AND?: InputMaybe<Array<InputMaybe<EntryFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EntryFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  sys?: InputMaybe<SysFilter>;
};

export type EntryOrder =
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/evidenceCategory) */
export type EvidenceCategory = Entry & {
  __typename?: "EvidenceCategory";
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<EvidenceCategoryDescription>;
  linkedFrom?: Maybe<EvidenceCategoryLinkingCollections>;
  minimumUploads?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  referenceCode?: Maybe<Scalars["String"]>;
  sys: Sys;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/evidenceCategory) */
export type EvidenceCategoryDescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/evidenceCategory) */
export type EvidenceCategoryLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/evidenceCategory) */
export type EvidenceCategoryMinimumUploadsArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/evidenceCategory) */
export type EvidenceCategoryNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/evidenceCategory) */
export type EvidenceCategoryReferenceCodeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type EvidenceCategoryCollection = {
  __typename?: "EvidenceCategoryCollection";
  items: Array<Maybe<EvidenceCategory>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type EvidenceCategoryDescription = {
  __typename?: "EvidenceCategoryDescription";
  json: Scalars["JSON"];
  links: EvidenceCategoryDescriptionLinks;
};

export type EvidenceCategoryDescriptionAssets = {
  __typename?: "EvidenceCategoryDescriptionAssets";
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type EvidenceCategoryDescriptionEntries = {
  __typename?: "EvidenceCategoryDescriptionEntries";
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type EvidenceCategoryDescriptionLinks = {
  __typename?: "EvidenceCategoryDescriptionLinks";
  assets: EvidenceCategoryDescriptionAssets;
  entries: EvidenceCategoryDescriptionEntries;
};

export type EvidenceCategoryFilter = {
  AND?: InputMaybe<Array<InputMaybe<EvidenceCategoryFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EvidenceCategoryFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description_contains?: InputMaybe<Scalars["String"]>;
  description_exists?: InputMaybe<Scalars["Boolean"]>;
  description_not_contains?: InputMaybe<Scalars["String"]>;
  minimumUploads?: InputMaybe<Scalars["Int"]>;
  minimumUploads_exists?: InputMaybe<Scalars["Boolean"]>;
  minimumUploads_gt?: InputMaybe<Scalars["Int"]>;
  minimumUploads_gte?: InputMaybe<Scalars["Int"]>;
  minimumUploads_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  minimumUploads_lt?: InputMaybe<Scalars["Int"]>;
  minimumUploads_lte?: InputMaybe<Scalars["Int"]>;
  minimumUploads_not?: InputMaybe<Scalars["Int"]>;
  minimumUploads_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_exists?: InputMaybe<Scalars["Boolean"]>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  referenceCode?: InputMaybe<Scalars["String"]>;
  referenceCode_contains?: InputMaybe<Scalars["String"]>;
  referenceCode_exists?: InputMaybe<Scalars["Boolean"]>;
  referenceCode_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  referenceCode_not?: InputMaybe<Scalars["String"]>;
  referenceCode_not_contains?: InputMaybe<Scalars["String"]>;
  referenceCode_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
};

export type EvidenceCategoryLinkingCollections = {
  __typename?: "EvidenceCategoryLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
};

export type EvidenceCategoryLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type EvidenceCategoryLinkingCollectionsGuaranteeTypeCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type EvidenceCategoryOrder =
  | "minimumUploads_ASC"
  | "minimumUploads_DESC"
  | "name_ASC"
  | "name_DESC"
  | "referenceCode_ASC"
  | "referenceCode_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

export type EvidenceCategoryType =
  | "CUSTOM"
  | "MISCELLANEOUS"
  | "PROOF_OF_PURCHASE";

/** A file uploaded to a project, usually as evidence to support a guarantee */
export type EvidenceItem = Node & {
  __typename?: "EvidenceItem";
  /** File reference or the file itself. Photo of the evidence */
  attachment: Scalars["String"];
  createdAt: Scalars["Datetime"];
  customEvidenceCategory?: Maybe<ContentfulEvidenceCategory>;
  /** ek */
  customEvidenceCategoryKey?: Maybe<CustomEvidenceCategoryKey>;
  /** ek */
  evidenceCategoryType?: Maybe<EvidenceCategoryType>;
  /** Reads a single `Guarantee` that is related to this `EvidenceItem`. */
  guarantee?: Maybe<Guarantee>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** Short name for the item of evidence */
  name: Scalars["String"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Reads a single `Project` that is related to this `EvidenceItem`. */
  project?: Maybe<Project>;
  /** fk */
  projectId: Scalars["Int"];
  signedUrl?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `EvidenceItem` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EvidenceItemCondition = {
  /** Checks for equality with the object’s `guaranteeId` field. */
  guaranteeId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars["Int"]>;
};

/** The fields on `evidenceItem` to look up the row to connect. */
export type EvidenceItemEvidenceItemPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `evidenceItem` to look up the row to delete. */
export type EvidenceItemEvidenceItemPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** A filter to be used against `EvidenceItem` object types. All fields are combined with a logical ‘and.’ */
export type EvidenceItemFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EvidenceItemFilter>>;
  /** Filter by the object’s `guaranteeId` field. */
  guaranteeId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EvidenceItemFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EvidenceItemFilter>>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<IntFilter>;
};

/** The `evidenceItem` to be created by this mutation. */
export type EvidenceItemGuaranteeIdFkeyEvidenceItemCreateInput = {
  /** File reference or the file itself. Photo of the evidence */
  attachment: Scalars["String"];
  attachmentUpload?: InputMaybe<Scalars["Upload"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  customEvidenceCategoryKey?: InputMaybe<CustomEvidenceCategoryKey>;
  /** ek */
  evidenceCategoryType?: InputMaybe<EvidenceCategoryType>;
  guaranteeToGuaranteeId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name: Scalars["String"];
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<EvidenceItemProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `guarantee` to be created by this mutation. */
export type EvidenceItemGuaranteeIdFkeyGuaranteeCreateInput = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode: GuaranteeReferenceCode;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `guarantee` in the `EvidenceItemInput` mutation. */
export type EvidenceItemGuaranteeIdFkeyInput = {
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByBmiReferenceId?: InputMaybe<GuaranteeGuaranteeBmiReferenceIdKeyConnect>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectById?: InputMaybe<GuaranteeGuaranteePkeyConnect>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<GuaranteeNodeIdConnect>;
  /** A `GuaranteeInput` object that will be created and connected to this object. */
  create?: InputMaybe<EvidenceItemGuaranteeIdFkeyGuaranteeCreateInput>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByBmiReferenceId?: InputMaybe<GuaranteeGuaranteeBmiReferenceIdKeyDelete>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteById?: InputMaybe<GuaranteeGuaranteePkeyDelete>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<GuaranteeNodeIdDelete>;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByBmiReferenceId?: InputMaybe<GuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyUsingGuaranteeBmiReferenceIdKeyUpdate>;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateById?: InputMaybe<GuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyUsingGuaranteePkeyUpdate>;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<EvidenceItemOnEvidenceItemForEvidenceItemGuaranteeIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `evidenceItem` in the `GuaranteeInput` mutation. */
export type EvidenceItemGuaranteeIdFkeyInverseInput = {
  /** The primary key(s) for `evidenceItem` for the far side of the relationship. */
  connectById?: InputMaybe<Array<EvidenceItemEvidenceItemPkeyConnect>>;
  /** The primary key(s) for `evidenceItem` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<EvidenceItemNodeIdConnect>>;
  /** A `EvidenceItemInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<EvidenceItemGuaranteeIdFkeyEvidenceItemCreateInput>
  >;
  /** The primary key(s) for `evidenceItem` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<EvidenceItemEvidenceItemPkeyDelete>>;
  /** The primary key(s) for `evidenceItem` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<EvidenceItemNodeIdDelete>>;
  /** Flag indicating whether all other `evidenceItem` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `evidenceItem` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<EvidenceItemOnEvidenceItemForEvidenceItemGuaranteeIdFkeyUsingEvidenceItemPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `evidenceItem` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<GuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyNodeIdUpdate>
  >;
};

/** An input for mutations affecting `EvidenceItem` */
export type EvidenceItemInput = {
  /** File reference or the file itself. Photo of the evidence */
  attachment: Scalars["String"];
  attachmentUpload?: InputMaybe<Scalars["Upload"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  customEvidenceCategoryKey?: InputMaybe<CustomEvidenceCategoryKey>;
  /** ek */
  evidenceCategoryType?: InputMaybe<EvidenceCategoryType>;
  /** fk */
  guaranteeId?: InputMaybe<Scalars["Int"]>;
  guaranteeToGuaranteeId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name: Scalars["String"];
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<EvidenceItemProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type EvidenceItemNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `evidenceItem` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type EvidenceItemNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `evidenceItem` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type EvidenceItemOnEvidenceItemForEvidenceItemGuaranteeIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `guarantee` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: GuaranteePatch;
  };

/** The fields on `evidenceItem` to look up the row to update. */
export type EvidenceItemOnEvidenceItemForEvidenceItemGuaranteeIdFkeyUsingEvidenceItemPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `evidenceItem` being updated. */
    patch: UpdateEvidenceItemOnEvidenceItemForEvidenceItemGuaranteeIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type EvidenceItemOnEvidenceItemForEvidenceItemProjectIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `project` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `project` being updated. */
    patch: ProjectPatch;
  };

/** The fields on `evidenceItem` to look up the row to update. */
export type EvidenceItemOnEvidenceItemForEvidenceItemProjectIdFkeyUsingEvidenceItemPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `evidenceItem` being updated. */
    patch: UpdateEvidenceItemOnEvidenceItemForEvidenceItemProjectIdFkeyPatch;
  };

/** Represents an update to a `EvidenceItem`. Fields that are set will be updated. */
export type EvidenceItemPatch = {
  /** File reference or the file itself. Photo of the evidence */
  attachment?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  customEvidenceCategoryKey?: InputMaybe<CustomEvidenceCategoryKey>;
  /** ek */
  evidenceCategoryType?: InputMaybe<EvidenceCategoryType>;
  /** fk */
  guaranteeId?: InputMaybe<Scalars["Int"]>;
  guaranteeToGuaranteeId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: InputMaybe<Scalars["String"]>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<EvidenceItemProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `evidenceItem` to be created by this mutation. */
export type EvidenceItemProjectIdFkeyEvidenceItemCreateInput = {
  /** File reference or the file itself. Photo of the evidence */
  attachment: Scalars["String"];
  attachmentUpload?: InputMaybe<Scalars["Upload"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  customEvidenceCategoryKey?: InputMaybe<CustomEvidenceCategoryKey>;
  /** ek */
  evidenceCategoryType?: InputMaybe<EvidenceCategoryType>;
  /** fk */
  guaranteeId?: InputMaybe<Scalars["Int"]>;
  guaranteeToGuaranteeId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name: Scalars["String"];
  projectToProjectId?: InputMaybe<EvidenceItemProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `project` in the `EvidenceItemInput` mutation. */
export type EvidenceItemProjectIdFkeyInput = {
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectById?: InputMaybe<ProjectProjectPkeyConnect>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<ProjectNodeIdConnect>;
  /** A `ProjectInput` object that will be created and connected to this object. */
  create?: InputMaybe<EvidenceItemProjectIdFkeyProjectCreateInput>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteById?: InputMaybe<ProjectProjectPkeyDelete>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<ProjectNodeIdDelete>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateById?: InputMaybe<ProjectOnEvidenceItemForEvidenceItemProjectIdFkeyUsingProjectPkeyUpdate>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<EvidenceItemOnEvidenceItemForEvidenceItemProjectIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `evidenceItem` in the `ProjectInput` mutation. */
export type EvidenceItemProjectIdFkeyInverseInput = {
  /** The primary key(s) for `evidenceItem` for the far side of the relationship. */
  connectById?: InputMaybe<Array<EvidenceItemEvidenceItemPkeyConnect>>;
  /** The primary key(s) for `evidenceItem` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<EvidenceItemNodeIdConnect>>;
  /** A `EvidenceItemInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<EvidenceItemProjectIdFkeyEvidenceItemCreateInput>>;
  /** The primary key(s) for `evidenceItem` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<EvidenceItemEvidenceItemPkeyDelete>>;
  /** The primary key(s) for `evidenceItem` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<EvidenceItemNodeIdDelete>>;
  /** Flag indicating whether all other `evidenceItem` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `evidenceItem` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<EvidenceItemOnEvidenceItemForEvidenceItemProjectIdFkeyUsingEvidenceItemPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `evidenceItem` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<ProjectOnEvidenceItemForEvidenceItemProjectIdFkeyNodeIdUpdate>
  >;
};

/** The `project` to be created by this mutation. */
export type EvidenceItemProjectIdFkeyProjectCreateInput = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name: Scalars["String"];
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** All input for the `evidenceItemsAdd` mutation. */
export type EvidenceItemsAddInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  evidences: Array<InputMaybe<EvidenceItemInput>>;
};

/** The output of our `evidenceItemsAdd` mutation. */
export type EvidenceItemsAddPayload = {
  __typename?: "EvidenceItemsAddPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  evidenceItems?: Maybe<Array<EvidenceItem>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** A connection to a list of `EvidenceItem` values. */
export type EvidenceItemsConnection = {
  __typename?: "EvidenceItemsConnection";
  /** A list of edges which contains the `EvidenceItem` and cursor to aid in pagination. */
  edges: Array<EvidenceItemsEdge>;
  /** A list of `EvidenceItem` objects. */
  nodes: Array<EvidenceItem>;
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
export type EvidenceItemsOrderBy =
  | "GUARANTEE_ID_ASC"
  | "GUARANTEE_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "PROJECT_ID_ASC"
  | "PROJECT_ID_DESC";

export type FindIncompleteCompanyProfile = {
  __typename?: "FindIncompleteCompanyProfile";
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
  lastName?: Maybe<Scalars["String"]>;
  marketid?: Maybe<Scalars["Int"]>;
};

/** A connection to a list of `FindIncompleteCompanyProfile` values. */
export type FindIncompleteCompanyProfilesConnection = {
  __typename?: "FindIncompleteCompanyProfilesConnection";
  /** A list of edges which contains the `FindIncompleteCompanyProfile` and cursor to aid in pagination. */
  edges: Array<FindIncompleteCompanyProfilesEdge>;
  /** A list of `FindIncompleteCompanyProfile` objects. */
  nodes: Array<FindIncompleteCompanyProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FindIncompleteCompanyProfile` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `FindIncompleteCompanyProfile` edge in the connection. */
export type FindIncompleteCompanyProfilesEdge = {
  __typename?: "FindIncompleteCompanyProfilesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `FindIncompleteCompanyProfile` at the end of the edge. */
  node: FindIncompleteCompanyProfile;
};

/** Methods to use when ordering `FindIncompleteCompanyProfile`. */
export type FindIncompleteCompanyProfilesOrderBy = "NATURAL";

export type FindRoofer = {
  __typename?: "FindRoofer";
  aboutUs?: Maybe<Scalars["String"]>;
  addressCoordinates?: Maybe<Point>;
  addressCountry?: Maybe<Scalars["String"]>;
  addressFirstLine?: Maybe<Scalars["String"]>;
  addressPostcode?: Maybe<Scalars["String"]>;
  addressRegion?: Maybe<Scalars["String"]>;
  addressSecondLine?: Maybe<Scalars["String"]>;
  addressTown?: Maybe<Scalars["String"]>;
  businessType?: Maybe<BusinessType>;
  certifications?: Maybe<Array<Maybe<Scalars["String"]>>>;
  coordinates?: Maybe<Point>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  facebook?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
  linkedIn?: Maybe<Scalars["String"]>;
  logo?: Maybe<Scalars["String"]>;
  marketId?: Maybe<Scalars["Int"]>;
  marketdomain?: Maybe<Scalars["String"]>;
  migrationId?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  operations?: Maybe<Array<Maybe<Operation>>>;
  ownerEmail?: Maybe<Scalars["String"]>;
  ownerFullname?: Maybe<Scalars["String"]>;
  ownerPhone?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  publicEmail?: Maybe<Scalars["String"]>;
  referenceNumber?: Maybe<Scalars["Int"]>;
  registeredAddressId?: Maybe<Scalars["Int"]>;
  registeredAddressMigrationId?: Maybe<Scalars["String"]>;
  registeredBy?: Maybe<Scalars["String"]>;
  registeredDate?: Maybe<Scalars["Datetime"]>;
  status?: Maybe<CompanyStatus>;
  taxNumber?: Maybe<Scalars["String"]>;
  tier?: Maybe<Tier>;
  tradingAddressId?: Maybe<Scalars["Int"]>;
  tradingAddressMigrationId?: Maybe<Scalars["String"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
  website?: Maybe<Scalars["String"]>;
};

/** A connection to a list of `FindRoofer` values. */
export type FindRoofersConnection = {
  __typename?: "FindRoofersConnection";
  /** A list of edges which contains the `FindRoofer` and cursor to aid in pagination. */
  edges: Array<FindRoofersEdge>;
  /** A list of `FindRoofer` objects. */
  nodes: Array<FindRoofer>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FindRoofer` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `FindRoofer` edge in the connection. */
export type FindRoofersEdge = {
  __typename?: "FindRoofersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `FindRoofer` at the end of the edge. */
  node: FindRoofer;
};

/** Methods to use when ordering `FindRoofer`. */
export type FindRoofersOrderBy = "NATURAL";

/** Starts life as request for a gurantee and becomes an actual issued guarantee */
export type Guarantee = Node & {
  __typename?: "Guarantee";
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: Maybe<Scalars["String"]>;
  /** ek */
  coverage?: Maybe<GuaranteeCoverage>;
  createdAt: Scalars["Datetime"];
  /** Reads and enables pagination through a set of `EvidenceItem`. */
  evidenceItems: EvidenceItemsConnection;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: Maybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode: GuaranteeReferenceCode;
  guaranteeType?: Maybe<ContentfulGuaranteeType>;
  guaranteeTypes?: Maybe<ContentfulGuaranteeTypeCollection>;
  /** Primary key - starts at 6100 */
  id: Scalars["Int"];
  /** ek */
  languageCode?: Maybe<Language>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** fk */
  productBmiRef?: Maybe<Scalars["String"]>;
  /** Reads a single `Product` that is related to this `Guarantee`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** fk */
  projectId: Scalars["Int"];
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** fk */
  requestorAccountId?: Maybe<Scalars["Int"]>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  signedFileStorageUrl?: Maybe<Scalars["String"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** fk */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  systemBySystemBmiRef?: Maybe<System>;
  updatedAt: Scalars["Datetime"];
};

/** Starts life as request for a gurantee and becomes an actual issued guarantee */
export type GuaranteeEvidenceItemsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<EvidenceItemCondition>;
  filter?: InputMaybe<EvidenceItemFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<EvidenceItemsOrderBy>>;
};

/**
 * A condition to be used against `Guarantee` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GuaranteeCondition = {
  /** Checks for equality with the object’s `bmiReferenceId` field. */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `productBmiRef` field. */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `requestorAccountId` field. */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `reviewerAccountId` field. */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `systemBmiRef` field. */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
};

export type GuaranteeCoverage = "PRODUCT" | "SOLUTION" | "SYSTEM";

export type GuaranteeEventType =
  | "APPROVE_SOLUTION"
  | "ASSIGN_SOLUTION"
  | "REASSIGN_SOLUTION"
  | "REJECT_SOLUTION"
  | "SUBMIT_SOLUTION"
  | "UNASSIGN_SOLUTION";

/** A filter to be used against `Guarantee` object types. All fields are combined with a logical ‘and.’ */
export type GuaranteeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<GuaranteeFilter>>;
  /** Filter by the object’s `bmiReferenceId` field. */
  bmiReferenceId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<GuaranteeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<GuaranteeFilter>>;
  /** Filter by the object’s `productBmiRef` field. */
  productBmiRef?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `requestorAccountId` field. */
  requestorAccountId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `reviewerAccountId` field. */
  reviewerAccountId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `systemBmiRef` field. */
  systemBmiRef?: InputMaybe<StringFilter>;
};

/** The fields on `guarantee` to look up the row to connect. */
export type GuaranteeGuaranteeBmiReferenceIdKeyConnect = {
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId: Scalars["String"];
};

/** The fields on `guarantee` to look up the row to delete. */
export type GuaranteeGuaranteeBmiReferenceIdKeyDelete = {
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId: Scalars["String"];
};

/** The fields on `guarantee` to look up the row to connect. */
export type GuaranteeGuaranteePkeyConnect = {
  /** Primary key - starts at 6100 */
  id: Scalars["Int"];
};

/** The fields on `guarantee` to look up the row to delete. */
export type GuaranteeGuaranteePkeyDelete = {
  /** Primary key - starts at 6100 */
  id: Scalars["Int"];
};

/** An input for mutations affecting `Guarantee` */
export type GuaranteeInput = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode: GuaranteeReferenceCode;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type GuaranteeNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `guarantee` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type GuaranteeNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `guarantee` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type GuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `evidenceItem` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `evidenceItem` being updated. */
    patch: EvidenceItemPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyUsingGuaranteeBmiReferenceIdKeyUpdate =
  {
    /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
    bmiReferenceId: Scalars["String"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyUsingGuaranteePkeyUpdate =
  {
    /** Primary key - starts at 6100 */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `product` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `product` being updated. */
  patch: ProductPatch;
};

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyUsingGuaranteeBmiReferenceIdKeyUpdate =
  {
    /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
    bmiReferenceId: Scalars["String"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyUsingGuaranteePkeyUpdate =
  {
    /** Primary key - starts at 6100 */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeProjectIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `project` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `project` being updated. */
  patch: ProjectPatch;
};

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeProjectIdFkeyUsingGuaranteeBmiReferenceIdKeyUpdate =
  {
    /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
    bmiReferenceId: Scalars["String"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeProjectIdFkeyPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeProjectIdFkeyUsingGuaranteePkeyUpdate =
  {
    /** Primary key - starts at 6100 */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeProjectIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `account` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: AccountPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingGuaranteeBmiReferenceIdKeyUpdate =
  {
    /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
    bmiReferenceId: Scalars["String"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingGuaranteePkeyUpdate =
  {
    /** Primary key - starts at 6100 */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `account` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: AccountPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingGuaranteeBmiReferenceIdKeyUpdate =
  {
    /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
    bmiReferenceId: Scalars["String"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingGuaranteePkeyUpdate =
  {
    /** Primary key - starts at 6100 */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `system` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `system` being updated. */
  patch: SystemPatch;
};

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyUsingGuaranteeBmiReferenceIdKeyUpdate =
  {
    /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
    bmiReferenceId: Scalars["String"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyPatch;
  };

/** The fields on `guarantee` to look up the row to update. */
export type GuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyUsingGuaranteePkeyUpdate =
  {
    /** Primary key - starts at 6100 */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `guarantee` being updated. */
    patch: UpdateGuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyPatch;
  };

/** Represents an update to a `Guarantee`. Fields that are set will be updated. */
export type GuaranteePatch = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode?: InputMaybe<GuaranteeReferenceCode>;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `guarantee` to be created by this mutation. */
export type GuaranteeProductBmiRefFkeyGuaranteeCreateInput = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode: GuaranteeReferenceCode;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `product` in the `GuaranteeInput` mutation. */
export type GuaranteeProductBmiRefFkeyInput = {
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectByBmiRef?: InputMaybe<ProductProductBmiRefKeyConnect>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectById?: InputMaybe<ProductProductPkeyConnect>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<ProductNodeIdConnect>;
  /** A `ProductInput` object that will be created and connected to this object. */
  create?: InputMaybe<GuaranteeProductBmiRefFkeyProductCreateInput>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteByBmiRef?: InputMaybe<ProductProductBmiRefKeyDelete>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteById?: InputMaybe<ProductProductPkeyDelete>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<ProductNodeIdDelete>;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateByBmiRef?: InputMaybe<ProductOnGuaranteeForGuaranteeProductBmiRefFkeyUsingProductBmiRefKeyUpdate>;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateById?: InputMaybe<ProductOnGuaranteeForGuaranteeProductBmiRefFkeyUsingProductPkeyUpdate>;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<GuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `guarantee` in the `ProductInput` mutation. */
export type GuaranteeProductBmiRefFkeyInverseInput = {
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyConnect>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectById?: InputMaybe<Array<GuaranteeGuaranteePkeyConnect>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<GuaranteeNodeIdConnect>>;
  /** A `GuaranteeInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<GuaranteeProductBmiRefFkeyGuaranteeCreateInput>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyDelete>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<GuaranteeGuaranteePkeyDelete>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<GuaranteeNodeIdDelete>>;
  /** Flag indicating whether all other `guarantee` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByBmiReferenceId?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyUsingGuaranteeBmiReferenceIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyUsingGuaranteePkeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<ProductOnGuaranteeForGuaranteeProductBmiRefFkeyNodeIdUpdate>
  >;
};

/** The `product` to be created by this mutation. */
export type GuaranteeProductBmiRefFkeyProductCreateInput = {
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
  /** The Products brand */
  brand: Scalars["String"];
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description of the Product */
  description?: InputMaybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family: Scalars["String"];
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<ProductMarketIdFkeyInput>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the Product */
  name: Scalars["String"];
  /** Whether the Product is avialable for new guarantees */
  published: Scalars["Boolean"];
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInverseInput>;
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `guarantee` to be created by this mutation. */
export type GuaranteeProjectIdFkeyGuaranteeCreateInput = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode: GuaranteeReferenceCode;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `project` in the `GuaranteeInput` mutation. */
export type GuaranteeProjectIdFkeyInput = {
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectById?: InputMaybe<ProjectProjectPkeyConnect>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<ProjectNodeIdConnect>;
  /** A `ProjectInput` object that will be created and connected to this object. */
  create?: InputMaybe<GuaranteeProjectIdFkeyProjectCreateInput>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteById?: InputMaybe<ProjectProjectPkeyDelete>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<ProjectNodeIdDelete>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateById?: InputMaybe<ProjectOnGuaranteeForGuaranteeProjectIdFkeyUsingProjectPkeyUpdate>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<GuaranteeOnGuaranteeForGuaranteeProjectIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `guarantee` in the `ProjectInput` mutation. */
export type GuaranteeProjectIdFkeyInverseInput = {
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyConnect>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectById?: InputMaybe<Array<GuaranteeGuaranteePkeyConnect>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<GuaranteeNodeIdConnect>>;
  /** A `GuaranteeInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<GuaranteeProjectIdFkeyGuaranteeCreateInput>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyDelete>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<GuaranteeGuaranteePkeyDelete>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<GuaranteeNodeIdDelete>>;
  /** Flag indicating whether all other `guarantee` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByBmiReferenceId?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeProjectIdFkeyUsingGuaranteeBmiReferenceIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeProjectIdFkeyUsingGuaranteePkeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<ProjectOnGuaranteeForGuaranteeProjectIdFkeyNodeIdUpdate>
  >;
};

/** The `project` to be created by this mutation. */
export type GuaranteeProjectIdFkeyProjectCreateInput = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name: Scalars["String"];
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

export type GuaranteeReferenceCode =
  | "FLAT_PRODUCT"
  | "FLAT_SOLUTION"
  | "FLAT_SYSTEM"
  | "PITCHED_PRODUCT"
  | "PITCHED_SOLUTION"
  | "PITCHED_SYSTEM";

/** The `guarantee` to be created by this mutation. */
export type GuaranteeRequestorAccountIdFkeyGuaranteeCreateInput = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode: GuaranteeReferenceCode;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `account` in the `GuaranteeInput` mutation. */
export type GuaranteeRequestorAccountIdFkeyInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<AccountAccountEmailKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<AccountAccountPkeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AccountNodeIdConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<AccountAccountEmailKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<AccountAccountPkeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AccountNodeIdDelete>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<AccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<AccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingAccountEmailKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<AccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingAccountPkeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<GuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `guarantee` in the `AccountInput` mutation. */
export type GuaranteeRequestorAccountIdFkeyInverseInput = {
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyConnect>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectById?: InputMaybe<Array<GuaranteeGuaranteePkeyConnect>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<GuaranteeNodeIdConnect>>;
  /** A `GuaranteeInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<GuaranteeRequestorAccountIdFkeyGuaranteeCreateInput>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyDelete>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<GuaranteeGuaranteePkeyDelete>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<GuaranteeNodeIdDelete>>;
  /** Flag indicating whether all other `guarantee` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByBmiReferenceId?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingGuaranteeBmiReferenceIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyUsingGuaranteePkeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyNodeIdUpdate>
  >;
};

/** The `guarantee` to be created by this mutation. */
export type GuaranteeReviewerAccountIdFkeyGuaranteeCreateInput = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode: GuaranteeReferenceCode;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `account` in the `GuaranteeInput` mutation. */
export type GuaranteeReviewerAccountIdFkeyInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<AccountAccountEmailKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<AccountAccountPkeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AccountNodeIdConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<AccountAccountEmailKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<AccountAccountPkeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AccountNodeIdDelete>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<AccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<AccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingAccountEmailKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<AccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingAccountPkeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<GuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `guarantee` in the `AccountInput` mutation. */
export type GuaranteeReviewerAccountIdFkeyInverseInput = {
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyConnect>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectById?: InputMaybe<Array<GuaranteeGuaranteePkeyConnect>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<GuaranteeNodeIdConnect>>;
  /** A `GuaranteeInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<GuaranteeReviewerAccountIdFkeyGuaranteeCreateInput>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyDelete>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<GuaranteeGuaranteePkeyDelete>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<GuaranteeNodeIdDelete>>;
  /** Flag indicating whether all other `guarantee` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByBmiReferenceId?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingGuaranteeBmiReferenceIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyUsingGuaranteePkeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyNodeIdUpdate>
  >;
};

/** The `guarantee` to be created by this mutation. */
export type GuaranteeSystemBmiRefFkeyGuaranteeCreateInput = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode: GuaranteeReferenceCode;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `system` in the `GuaranteeInput` mutation. */
export type GuaranteeSystemBmiRefFkeyInput = {
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectByBmiRef?: InputMaybe<SystemSystemBmiRefKeyConnect>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectById?: InputMaybe<SystemSystemPkeyConnect>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<SystemNodeIdConnect>;
  /** A `SystemInput` object that will be created and connected to this object. */
  create?: InputMaybe<GuaranteeSystemBmiRefFkeySystemCreateInput>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteByBmiRef?: InputMaybe<SystemSystemBmiRefKeyDelete>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteById?: InputMaybe<SystemSystemPkeyDelete>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<SystemNodeIdDelete>;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateByBmiRef?: InputMaybe<SystemOnGuaranteeForGuaranteeSystemBmiRefFkeyUsingSystemBmiRefKeyUpdate>;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateById?: InputMaybe<SystemOnGuaranteeForGuaranteeSystemBmiRefFkeyUsingSystemPkeyUpdate>;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<GuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `guarantee` in the `SystemInput` mutation. */
export type GuaranteeSystemBmiRefFkeyInverseInput = {
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyConnect>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectById?: InputMaybe<Array<GuaranteeGuaranteePkeyConnect>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<GuaranteeNodeIdConnect>>;
  /** A `GuaranteeInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<GuaranteeSystemBmiRefFkeyGuaranteeCreateInput>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByBmiReferenceId?: InputMaybe<
    Array<GuaranteeGuaranteeBmiReferenceIdKeyDelete>
  >;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<GuaranteeGuaranteePkeyDelete>>;
  /** The primary key(s) for `guarantee` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<GuaranteeNodeIdDelete>>;
  /** Flag indicating whether all other `guarantee` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByBmiReferenceId?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyUsingGuaranteeBmiReferenceIdKeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<GuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyUsingGuaranteePkeyUpdate>
  >;
  /** The primary key(s) and patch data for `guarantee` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<SystemOnGuaranteeForGuaranteeSystemBmiRefFkeyNodeIdUpdate>
  >;
};

/** The `system` to be created by this mutation. */
export type GuaranteeSystemBmiRefFkeySystemCreateInput = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description for the System */
  description?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMarketIdFkeyInput>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the System */
  name: Scalars["String"];
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published: Scalars["Boolean"];
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInverseInput>;
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplate = Entry & {
  __typename?: "GuaranteeTemplate";
  approvalMessage?: Maybe<MessageTemplate>;
  contentfulMetadata: ContentfulMetadata;
  coverage?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  filenamePrefix?: Maybe<Scalars["String"]>;
  footer?: Maybe<Scalars["String"]>;
  guaranteeScope?: Maybe<Scalars["String"]>;
  headingBeneficiary?: Maybe<Scalars["String"]>;
  headingBuildingAddress?: Maybe<Scalars["String"]>;
  headingBuildingOwnerName?: Maybe<Scalars["String"]>;
  headingContractor?: Maybe<Scalars["String"]>;
  headingContractorId?: Maybe<Scalars["String"]>;
  headingContractorName?: Maybe<Scalars["String"]>;
  headingExpiry?: Maybe<Scalars["String"]>;
  headingGuarantee?: Maybe<Scalars["String"]>;
  headingGuaranteeId?: Maybe<Scalars["String"]>;
  headingProducts?: Maybe<Scalars["String"]>;
  headingRoofArea?: Maybe<Scalars["String"]>;
  headingRoofType?: Maybe<Scalars["String"]>;
  headingScope?: Maybe<Scalars["String"]>;
  headingStartDate?: Maybe<Scalars["String"]>;
  headingValidity?: Maybe<Scalars["String"]>;
  languageCode?: Maybe<Scalars["String"]>;
  languageDescriptor?: Maybe<Scalars["String"]>;
  linkedFrom?: Maybe<GuaranteeTemplateLinkingCollections>;
  logo?: Maybe<Asset>;
  mailBody?: Maybe<Scalars["String"]>;
  maintenanceTemplate?: Maybe<Asset>;
  rejectionMessage?: Maybe<MessageTemplate>;
  roofType?: Maybe<Scalars["String"]>;
  signatory?: Maybe<Scalars["String"]>;
  sys: Sys;
  technology?: Maybe<Scalars["String"]>;
  terms?: Maybe<Asset>;
  titleLine1?: Maybe<Scalars["String"]>;
  titleLine2?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateApprovalMessageArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateCoverageArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateDisplayNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateFilenamePrefixArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateFooterArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateGuaranteeScopeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingBeneficiaryArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingBuildingAddressArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingBuildingOwnerNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingContractorArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingContractorIdArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingContractorNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingExpiryArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingGuaranteeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingGuaranteeIdArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingProductsArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingRoofAreaArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingRoofTypeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingScopeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingStartDateArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingValidityArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateLanguageCodeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateLanguageDescriptorArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateLogoArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateMailBodyArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateMaintenanceTemplateArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateRejectionMessageArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateRoofTypeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateSignatoryArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateTechnologyArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateTermsArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateTitleLine1Args = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeTemplate) */
export type GuaranteeTemplateTitleLine2Args = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type GuaranteeTemplateCollection = {
  __typename?: "GuaranteeTemplateCollection";
  items: Array<Maybe<GuaranteeTemplate>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type GuaranteeTemplateFilter = {
  AND?: InputMaybe<Array<InputMaybe<GuaranteeTemplateFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<GuaranteeTemplateFilter>>>;
  approvalMessage?: InputMaybe<CfMessageTemplateNestedFilter>;
  approvalMessage_exists?: InputMaybe<Scalars["Boolean"]>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  coverage?: InputMaybe<Scalars["String"]>;
  coverage_contains?: InputMaybe<Scalars["String"]>;
  coverage_exists?: InputMaybe<Scalars["Boolean"]>;
  coverage_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  coverage_not?: InputMaybe<Scalars["String"]>;
  coverage_not_contains?: InputMaybe<Scalars["String"]>;
  coverage_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  displayName?: InputMaybe<Scalars["String"]>;
  displayName_contains?: InputMaybe<Scalars["String"]>;
  displayName_exists?: InputMaybe<Scalars["Boolean"]>;
  displayName_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  displayName_not?: InputMaybe<Scalars["String"]>;
  displayName_not_contains?: InputMaybe<Scalars["String"]>;
  displayName_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  filenamePrefix?: InputMaybe<Scalars["String"]>;
  filenamePrefix_contains?: InputMaybe<Scalars["String"]>;
  filenamePrefix_exists?: InputMaybe<Scalars["Boolean"]>;
  filenamePrefix_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  filenamePrefix_not?: InputMaybe<Scalars["String"]>;
  filenamePrefix_not_contains?: InputMaybe<Scalars["String"]>;
  filenamePrefix_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  footer?: InputMaybe<Scalars["String"]>;
  footer_contains?: InputMaybe<Scalars["String"]>;
  footer_exists?: InputMaybe<Scalars["Boolean"]>;
  footer_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  footer_not?: InputMaybe<Scalars["String"]>;
  footer_not_contains?: InputMaybe<Scalars["String"]>;
  footer_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  guaranteeScope?: InputMaybe<Scalars["String"]>;
  guaranteeScope_contains?: InputMaybe<Scalars["String"]>;
  guaranteeScope_exists?: InputMaybe<Scalars["Boolean"]>;
  guaranteeScope_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  guaranteeScope_not?: InputMaybe<Scalars["String"]>;
  guaranteeScope_not_contains?: InputMaybe<Scalars["String"]>;
  guaranteeScope_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingBeneficiary?: InputMaybe<Scalars["String"]>;
  headingBeneficiary_contains?: InputMaybe<Scalars["String"]>;
  headingBeneficiary_exists?: InputMaybe<Scalars["Boolean"]>;
  headingBeneficiary_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingBeneficiary_not?: InputMaybe<Scalars["String"]>;
  headingBeneficiary_not_contains?: InputMaybe<Scalars["String"]>;
  headingBeneficiary_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingBuildingAddress?: InputMaybe<Scalars["String"]>;
  headingBuildingAddress_contains?: InputMaybe<Scalars["String"]>;
  headingBuildingAddress_exists?: InputMaybe<Scalars["Boolean"]>;
  headingBuildingAddress_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingBuildingAddress_not?: InputMaybe<Scalars["String"]>;
  headingBuildingAddress_not_contains?: InputMaybe<Scalars["String"]>;
  headingBuildingAddress_not_in?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  headingBuildingOwnerName?: InputMaybe<Scalars["String"]>;
  headingBuildingOwnerName_contains?: InputMaybe<Scalars["String"]>;
  headingBuildingOwnerName_exists?: InputMaybe<Scalars["Boolean"]>;
  headingBuildingOwnerName_in?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  headingBuildingOwnerName_not?: InputMaybe<Scalars["String"]>;
  headingBuildingOwnerName_not_contains?: InputMaybe<Scalars["String"]>;
  headingBuildingOwnerName_not_in?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  headingContractor?: InputMaybe<Scalars["String"]>;
  headingContractorId?: InputMaybe<Scalars["String"]>;
  headingContractorId_contains?: InputMaybe<Scalars["String"]>;
  headingContractorId_exists?: InputMaybe<Scalars["Boolean"]>;
  headingContractorId_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingContractorId_not?: InputMaybe<Scalars["String"]>;
  headingContractorId_not_contains?: InputMaybe<Scalars["String"]>;
  headingContractorId_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingContractorName?: InputMaybe<Scalars["String"]>;
  headingContractorName_contains?: InputMaybe<Scalars["String"]>;
  headingContractorName_exists?: InputMaybe<Scalars["Boolean"]>;
  headingContractorName_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingContractorName_not?: InputMaybe<Scalars["String"]>;
  headingContractorName_not_contains?: InputMaybe<Scalars["String"]>;
  headingContractorName_not_in?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  headingContractor_contains?: InputMaybe<Scalars["String"]>;
  headingContractor_exists?: InputMaybe<Scalars["Boolean"]>;
  headingContractor_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingContractor_not?: InputMaybe<Scalars["String"]>;
  headingContractor_not_contains?: InputMaybe<Scalars["String"]>;
  headingContractor_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingExpiry?: InputMaybe<Scalars["String"]>;
  headingExpiry_contains?: InputMaybe<Scalars["String"]>;
  headingExpiry_exists?: InputMaybe<Scalars["Boolean"]>;
  headingExpiry_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingExpiry_not?: InputMaybe<Scalars["String"]>;
  headingExpiry_not_contains?: InputMaybe<Scalars["String"]>;
  headingExpiry_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingGuarantee?: InputMaybe<Scalars["String"]>;
  headingGuaranteeId?: InputMaybe<Scalars["String"]>;
  headingGuaranteeId_contains?: InputMaybe<Scalars["String"]>;
  headingGuaranteeId_exists?: InputMaybe<Scalars["Boolean"]>;
  headingGuaranteeId_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingGuaranteeId_not?: InputMaybe<Scalars["String"]>;
  headingGuaranteeId_not_contains?: InputMaybe<Scalars["String"]>;
  headingGuaranteeId_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingGuarantee_contains?: InputMaybe<Scalars["String"]>;
  headingGuarantee_exists?: InputMaybe<Scalars["Boolean"]>;
  headingGuarantee_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingGuarantee_not?: InputMaybe<Scalars["String"]>;
  headingGuarantee_not_contains?: InputMaybe<Scalars["String"]>;
  headingGuarantee_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingProducts?: InputMaybe<Scalars["String"]>;
  headingProducts_contains?: InputMaybe<Scalars["String"]>;
  headingProducts_exists?: InputMaybe<Scalars["Boolean"]>;
  headingProducts_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingProducts_not?: InputMaybe<Scalars["String"]>;
  headingProducts_not_contains?: InputMaybe<Scalars["String"]>;
  headingProducts_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingRoofArea?: InputMaybe<Scalars["String"]>;
  headingRoofArea_contains?: InputMaybe<Scalars["String"]>;
  headingRoofArea_exists?: InputMaybe<Scalars["Boolean"]>;
  headingRoofArea_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingRoofArea_not?: InputMaybe<Scalars["String"]>;
  headingRoofArea_not_contains?: InputMaybe<Scalars["String"]>;
  headingRoofArea_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingRoofType?: InputMaybe<Scalars["String"]>;
  headingRoofType_contains?: InputMaybe<Scalars["String"]>;
  headingRoofType_exists?: InputMaybe<Scalars["Boolean"]>;
  headingRoofType_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingRoofType_not?: InputMaybe<Scalars["String"]>;
  headingRoofType_not_contains?: InputMaybe<Scalars["String"]>;
  headingRoofType_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingScope?: InputMaybe<Scalars["String"]>;
  headingScope_contains?: InputMaybe<Scalars["String"]>;
  headingScope_exists?: InputMaybe<Scalars["Boolean"]>;
  headingScope_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingScope_not?: InputMaybe<Scalars["String"]>;
  headingScope_not_contains?: InputMaybe<Scalars["String"]>;
  headingScope_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingStartDate?: InputMaybe<Scalars["String"]>;
  headingStartDate_contains?: InputMaybe<Scalars["String"]>;
  headingStartDate_exists?: InputMaybe<Scalars["Boolean"]>;
  headingStartDate_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingStartDate_not?: InputMaybe<Scalars["String"]>;
  headingStartDate_not_contains?: InputMaybe<Scalars["String"]>;
  headingStartDate_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingValidity?: InputMaybe<Scalars["String"]>;
  headingValidity_contains?: InputMaybe<Scalars["String"]>;
  headingValidity_exists?: InputMaybe<Scalars["Boolean"]>;
  headingValidity_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  headingValidity_not?: InputMaybe<Scalars["String"]>;
  headingValidity_not_contains?: InputMaybe<Scalars["String"]>;
  headingValidity_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  languageCode?: InputMaybe<Scalars["String"]>;
  languageCode_contains?: InputMaybe<Scalars["String"]>;
  languageCode_exists?: InputMaybe<Scalars["Boolean"]>;
  languageCode_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  languageCode_not?: InputMaybe<Scalars["String"]>;
  languageCode_not_contains?: InputMaybe<Scalars["String"]>;
  languageCode_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  languageDescriptor?: InputMaybe<Scalars["String"]>;
  languageDescriptor_contains?: InputMaybe<Scalars["String"]>;
  languageDescriptor_exists?: InputMaybe<Scalars["Boolean"]>;
  languageDescriptor_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  languageDescriptor_not?: InputMaybe<Scalars["String"]>;
  languageDescriptor_not_contains?: InputMaybe<Scalars["String"]>;
  languageDescriptor_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  logo_exists?: InputMaybe<Scalars["Boolean"]>;
  mailBody?: InputMaybe<Scalars["String"]>;
  mailBody_contains?: InputMaybe<Scalars["String"]>;
  mailBody_exists?: InputMaybe<Scalars["Boolean"]>;
  mailBody_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  mailBody_not?: InputMaybe<Scalars["String"]>;
  mailBody_not_contains?: InputMaybe<Scalars["String"]>;
  mailBody_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  maintenanceTemplate_exists?: InputMaybe<Scalars["Boolean"]>;
  rejectionMessage?: InputMaybe<CfMessageTemplateNestedFilter>;
  rejectionMessage_exists?: InputMaybe<Scalars["Boolean"]>;
  roofType?: InputMaybe<Scalars["String"]>;
  roofType_contains?: InputMaybe<Scalars["String"]>;
  roofType_exists?: InputMaybe<Scalars["Boolean"]>;
  roofType_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  roofType_not?: InputMaybe<Scalars["String"]>;
  roofType_not_contains?: InputMaybe<Scalars["String"]>;
  roofType_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  signatory?: InputMaybe<Scalars["String"]>;
  signatory_contains?: InputMaybe<Scalars["String"]>;
  signatory_exists?: InputMaybe<Scalars["Boolean"]>;
  signatory_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  signatory_not?: InputMaybe<Scalars["String"]>;
  signatory_not_contains?: InputMaybe<Scalars["String"]>;
  signatory_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
  technology?: InputMaybe<Scalars["String"]>;
  technology_contains?: InputMaybe<Scalars["String"]>;
  technology_exists?: InputMaybe<Scalars["Boolean"]>;
  technology_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  technology_not?: InputMaybe<Scalars["String"]>;
  technology_not_contains?: InputMaybe<Scalars["String"]>;
  technology_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  terms_exists?: InputMaybe<Scalars["Boolean"]>;
  titleLine1?: InputMaybe<Scalars["String"]>;
  titleLine1_contains?: InputMaybe<Scalars["String"]>;
  titleLine1_exists?: InputMaybe<Scalars["Boolean"]>;
  titleLine1_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  titleLine1_not?: InputMaybe<Scalars["String"]>;
  titleLine1_not_contains?: InputMaybe<Scalars["String"]>;
  titleLine1_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  titleLine2?: InputMaybe<Scalars["String"]>;
  titleLine2_contains?: InputMaybe<Scalars["String"]>;
  titleLine2_exists?: InputMaybe<Scalars["Boolean"]>;
  titleLine2_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  titleLine2_not?: InputMaybe<Scalars["String"]>;
  titleLine2_not_contains?: InputMaybe<Scalars["String"]>;
  titleLine2_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type GuaranteeTemplateLinkingCollections = {
  __typename?: "GuaranteeTemplateLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
};

export type GuaranteeTemplateLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type GuaranteeTemplateLinkingCollectionsGuaranteeTypeCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type GuaranteeTemplateOrder =
  | "coverage_ASC"
  | "coverage_DESC"
  | "displayName_ASC"
  | "displayName_DESC"
  | "filenamePrefix_ASC"
  | "filenamePrefix_DESC"
  | "guaranteeScope_ASC"
  | "guaranteeScope_DESC"
  | "headingBeneficiary_ASC"
  | "headingBeneficiary_DESC"
  | "headingBuildingAddress_ASC"
  | "headingBuildingAddress_DESC"
  | "headingBuildingOwnerName_ASC"
  | "headingBuildingOwnerName_DESC"
  | "headingContractorId_ASC"
  | "headingContractorId_DESC"
  | "headingContractorName_ASC"
  | "headingContractorName_DESC"
  | "headingContractor_ASC"
  | "headingContractor_DESC"
  | "headingExpiry_ASC"
  | "headingExpiry_DESC"
  | "headingGuaranteeId_ASC"
  | "headingGuaranteeId_DESC"
  | "headingGuarantee_ASC"
  | "headingGuarantee_DESC"
  | "headingProducts_ASC"
  | "headingProducts_DESC"
  | "headingRoofArea_ASC"
  | "headingRoofArea_DESC"
  | "headingRoofType_ASC"
  | "headingRoofType_DESC"
  | "headingScope_ASC"
  | "headingScope_DESC"
  | "headingStartDate_ASC"
  | "headingStartDate_DESC"
  | "headingValidity_ASC"
  | "headingValidity_DESC"
  | "languageCode_ASC"
  | "languageCode_DESC"
  | "languageDescriptor_ASC"
  | "languageDescriptor_DESC"
  | "roofType_ASC"
  | "roofType_DESC"
  | "signatory_ASC"
  | "signatory_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC"
  | "technology_ASC"
  | "technology_DESC"
  | "titleLine1_ASC"
  | "titleLine1_DESC"
  | "titleLine2_ASC"
  | "titleLine2_DESC";

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeType = Entry & {
  __typename?: "GuaranteeType";
  contentfulMetadata: ContentfulMetadata;
  coverage?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  evidenceCategoriesCollection?: Maybe<GuaranteeTypeEvidenceCategoriesCollection>;
  guaranteeReferenceCode?: Maybe<Scalars["String"]>;
  guaranteeTemplatesCollection?: Maybe<GuaranteeTypeGuaranteeTemplatesCollection>;
  linkedFrom?: Maybe<GuaranteeTypeLinkingCollections>;
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  ranking?: Maybe<Scalars["Int"]>;
  signature?: Maybe<Asset>;
  sys: Sys;
  technology?: Maybe<Scalars["String"]>;
  tiersAvailable?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeCoverageArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeDisplayNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeEvidenceCategoriesCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeGuaranteeReferenceCodeArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeGuaranteeTemplatesCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeMaximumValidityYearsArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeRankingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeSignatureArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeTechnologyArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/guaranteeType) */
export type GuaranteeTypeTiersAvailableArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type GuaranteeTypeCollection = {
  __typename?: "GuaranteeTypeCollection";
  items: Array<Maybe<GuaranteeType>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type GuaranteeTypeEvidenceCategoriesCollection = {
  __typename?: "GuaranteeTypeEvidenceCategoriesCollection";
  items: Array<Maybe<EvidenceCategory>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type GuaranteeTypeFilter = {
  AND?: InputMaybe<Array<InputMaybe<GuaranteeTypeFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<GuaranteeTypeFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  coverage?: InputMaybe<Scalars["String"]>;
  coverage_contains?: InputMaybe<Scalars["String"]>;
  coverage_exists?: InputMaybe<Scalars["Boolean"]>;
  coverage_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  coverage_not?: InputMaybe<Scalars["String"]>;
  coverage_not_contains?: InputMaybe<Scalars["String"]>;
  coverage_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  displayName?: InputMaybe<Scalars["String"]>;
  displayName_contains?: InputMaybe<Scalars["String"]>;
  displayName_exists?: InputMaybe<Scalars["Boolean"]>;
  displayName_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  displayName_not?: InputMaybe<Scalars["String"]>;
  displayName_not_contains?: InputMaybe<Scalars["String"]>;
  displayName_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  evidenceCategoriesCollection_exists?: InputMaybe<Scalars["Boolean"]>;
  guaranteeReferenceCode?: InputMaybe<Scalars["String"]>;
  guaranteeReferenceCode_contains?: InputMaybe<Scalars["String"]>;
  guaranteeReferenceCode_exists?: InputMaybe<Scalars["Boolean"]>;
  guaranteeReferenceCode_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  guaranteeReferenceCode_not?: InputMaybe<Scalars["String"]>;
  guaranteeReferenceCode_not_contains?: InputMaybe<Scalars["String"]>;
  guaranteeReferenceCode_not_in?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  guaranteeTemplatesCollection_exists?: InputMaybe<Scalars["Boolean"]>;
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  maximumValidityYears_exists?: InputMaybe<Scalars["Boolean"]>;
  maximumValidityYears_gt?: InputMaybe<Scalars["Int"]>;
  maximumValidityYears_gte?: InputMaybe<Scalars["Int"]>;
  maximumValidityYears_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  maximumValidityYears_lt?: InputMaybe<Scalars["Int"]>;
  maximumValidityYears_lte?: InputMaybe<Scalars["Int"]>;
  maximumValidityYears_not?: InputMaybe<Scalars["Int"]>;
  maximumValidityYears_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_exists?: InputMaybe<Scalars["Boolean"]>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  ranking?: InputMaybe<Scalars["Int"]>;
  ranking_exists?: InputMaybe<Scalars["Boolean"]>;
  ranking_gt?: InputMaybe<Scalars["Int"]>;
  ranking_gte?: InputMaybe<Scalars["Int"]>;
  ranking_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  ranking_lt?: InputMaybe<Scalars["Int"]>;
  ranking_lte?: InputMaybe<Scalars["Int"]>;
  ranking_not?: InputMaybe<Scalars["Int"]>;
  ranking_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  signature_exists?: InputMaybe<Scalars["Boolean"]>;
  sys?: InputMaybe<SysFilter>;
  technology?: InputMaybe<Scalars["String"]>;
  technology_contains?: InputMaybe<Scalars["String"]>;
  technology_exists?: InputMaybe<Scalars["Boolean"]>;
  technology_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  technology_not?: InputMaybe<Scalars["String"]>;
  technology_not_contains?: InputMaybe<Scalars["String"]>;
  technology_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  tiersAvailable_contains_all?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  tiersAvailable_contains_none?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  tiersAvailable_contains_some?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  tiersAvailable_exists?: InputMaybe<Scalars["Boolean"]>;
};

export type GuaranteeTypeGuaranteeTemplatesCollection = {
  __typename?: "GuaranteeTypeGuaranteeTemplatesCollection";
  items: Array<Maybe<GuaranteeTemplate>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type GuaranteeTypeLinkingCollections = {
  __typename?: "GuaranteeTypeLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type GuaranteeTypeLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type GuaranteeTypeOrder =
  | "coverage_ASC"
  | "coverage_DESC"
  | "displayName_ASC"
  | "displayName_DESC"
  | "guaranteeReferenceCode_ASC"
  | "guaranteeReferenceCode_DESC"
  | "maximumValidityYears_ASC"
  | "maximumValidityYears_DESC"
  | "name_ASC"
  | "name_DESC"
  | "ranking_ASC"
  | "ranking_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC"
  | "technology_ASC"
  | "technology_DESC";

/** A connection to a list of `Guarantee` values. */
export type GuaranteesConnection = {
  __typename?: "GuaranteesConnection";
  /** A list of edges which contains the `Guarantee` and cursor to aid in pagination. */
  edges: Array<GuaranteesEdge>;
  /** A list of `Guarantee` objects. */
  nodes: Array<Guarantee>;
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
export type GuaranteesOrderBy =
  | "BMI_REFERENCE_ID_ASC"
  | "BMI_REFERENCE_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "PRODUCT_BMI_REF_ASC"
  | "PRODUCT_BMI_REF_DESC"
  | "PROJECT_ID_ASC"
  | "PROJECT_ID_DESC"
  | "REQUESTOR_ACCOUNT_ID_ASC"
  | "REQUESTOR_ACCOUNT_ID_DESC"
  | "REVIEWER_ACCOUNT_ID_ASC"
  | "REVIEWER_ACCOUNT_ID_DESC"
  | "SYSTEM_BMI_REF_ASC"
  | "SYSTEM_BMI_REF_DESC";

export type ImageFormat =
  | "AVIF"
  /** JPG image format. */
  | "JPG"
  /**
   * Progressive JPG format stores multiple passes of an image in progressively higher detail.
   *         When a progressive image is loading, the viewer will first see a lower quality pixelated version which
   *         will gradually improve in detail, until the image is fully downloaded. This is to display an image as
   *         early as possible to make the layout look as designed.
   */
  | "JPG_PROGRESSIVE"
  /** PNG image format */
  | "PNG"
  /**
   * 8-bit PNG images support up to 256 colors and weigh less than the standard 24-bit PNG equivalent.
   *         The 8-bit PNG format is mostly used for simple images, such as icons or logos.
   */
  | "PNG8"
  /** WebP image format. */
  | "WEBP";

export type ImageResizeFocus =
  /** Focus the resizing on the bottom. */
  | "BOTTOM"
  /** Focus the resizing on the bottom left. */
  | "BOTTOM_LEFT"
  /** Focus the resizing on the bottom right. */
  | "BOTTOM_RIGHT"
  /** Focus the resizing on the center. */
  | "CENTER"
  /** Focus the resizing on the largest face. */
  | "FACE"
  /** Focus the resizing on the area containing all the faces. */
  | "FACES"
  /** Focus the resizing on the left. */
  | "LEFT"
  /** Focus the resizing on the right. */
  | "RIGHT"
  /** Focus the resizing on the top. */
  | "TOP"
  /** Focus the resizing on the top left. */
  | "TOP_LEFT"
  /** Focus the resizing on the top right. */
  | "TOP_RIGHT";

export type ImageResizeStrategy =
  /** Crops a part of the original image to fit into the specified dimensions. */
  | "CROP"
  /** Resizes the image to the specified dimensions, cropping the image if needed. */
  | "FILL"
  /** Resizes the image to fit into the specified dimensions. */
  | "FIT"
  /**
   * Resizes the image to the specified dimensions, padding the image if needed.
   *         Uses desired background color as padding color.
   */
  | "PAD"
  /** Resizes the image to the specified dimensions, changing the original aspect ratio if needed. */
  | "SCALE"
  /** Creates a thumbnail from the image. */
  | "THUMB";

export type ImageTransformOptions = {
  /**
   * Desired background color, used with corner radius or `PAD` resize strategy.
   *         Defaults to transparent (for `PNG`, `PNG8` and `WEBP`) or white (for `JPG` and `JPG_PROGRESSIVE`).
   */
  backgroundColor?: InputMaybe<Scalars["HexColor"]>;
  /**
   * Desired corner radius in pixels.
   *         Results in an image with rounded corners (pass `-1` for a full circle/ellipse).
   *         Defaults to `0`. Uses desired background color as padding color,
   *         unless the format is `JPG` or `JPG_PROGRESSIVE` and resize strategy is `PAD`, then defaults to white.
   */
  cornerRadius?: InputMaybe<Scalars["Int"]>;
  /** Desired image format. Defaults to the original image format. */
  format?: InputMaybe<ImageFormat>;
  /** Desired height in pixels. Defaults to the original image height. */
  height?: InputMaybe<Scalars["Dimension"]>;
  /**
   * Desired quality of the image in percents.
   *         Used for `PNG8`, `JPG`, `JPG_PROGRESSIVE` and `WEBP` formats.
   */
  quality?: InputMaybe<Scalars["Quality"]>;
  /** Desired resize focus area. Defaults to `CENTER`. */
  resizeFocus?: InputMaybe<ImageResizeFocus>;
  /** Desired resize strategy. Defaults to `FIT`. */
  resizeStrategy?: InputMaybe<ImageResizeStrategy>;
  /** Desired width in pixels. Defaults to the original image width. */
  width?: InputMaybe<Scalars["Dimension"]>;
};

export type ImportAccountsCompaniesFromCsvInput = {
  dryRun?: InputMaybe<Scalars["Boolean"]>;
  files: Array<Scalars["Upload"]>;
};

export type ImportAccountsCompaniesFromCsvResult = {
  __typename?: "ImportAccountsCompaniesFromCSVResult";
  accounts?: Maybe<Array<Maybe<Account>>>;
  auth0Job?: Maybe<Auth0ImportResult>;
  companies?: Maybe<Array<Maybe<Company>>>;
  dryRun?: Maybe<Scalars["Boolean"]>;
};

export type ImportError = {
  __typename?: "ImportError";
  message?: Maybe<Scalars["String"]>;
  ref?: Maybe<Scalars["String"]>;
};

export type ImportOutput = {
  __typename?: "ImportOutput";
  errorProductsToInsert?: Maybe<Array<ImportError>>;
  errorProductsToUpdate?: Maybe<Array<ImportError>>;
  errorSystemMembersInsert?: Maybe<Array<ImportError>>;
  errorSystemsToInsert?: Maybe<Array<ImportError>>;
  errorSystemsToUpdate?: Maybe<Array<ImportError>>;
  productsToInsert?: Maybe<Array<Product>>;
  productsToUpdate?: Maybe<Array<Product>>;
  systemsToInsert?: Maybe<Array<System>>;
  systemsToUpdate?: Maybe<Array<System>>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars["Int"]>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars["Int"]>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars["Int"]>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars["Int"]>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars["Int"]>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars["Boolean"]>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars["Int"]>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars["Int"]>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars["Int"]>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars["Int"]>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars["Int"]>>;
};

/** An invitation to join InTouch */
export type Invitation = Node & {
  __typename?: "Invitation";
  /** Reads a single `Company` that is related to this `Invitation`. */
  company?: Maybe<Company>;
  /** fk */
  companyId: Scalars["Int"];
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** An email address */
  invitee: Scalars["String"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** An optional note that can be included in the invitation by the sender */
  personalNote?: Maybe<Scalars["String"]>;
  /** Reads a single `Account` that is related to this `Invitation`. */
  senderAccount?: Maybe<Account>;
  /** fk */
  senderAccountId?: Maybe<Scalars["Int"]>;
  /** ek */
  status: InvitationStatus;
  updatedAt: Scalars["Datetime"];
};

/** Input for the nested mutation of `company` in the `InvitationInput` mutation. */
export type InvitationCompanyIdFkeyInput = {
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectById?: InputMaybe<CompanyCompanyPkeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<CompanyNodeIdConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteById?: InputMaybe<CompanyCompanyPkeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<CompanyNodeIdDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyDelete>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateById?: InputMaybe<CompanyOnInvitationForInvitationCompanyIdFkeyUsingCompanyPkeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByMarketIdAndName?: InputMaybe<CompanyOnInvitationForInvitationCompanyIdFkeyUsingCompanyMarketIdNameKeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<InvitationOnInvitationForInvitationCompanyIdFkeyNodeIdUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByReferenceNumber?: InputMaybe<CompanyOnInvitationForInvitationCompanyIdFkeyUsingCompanyReferenceNumberKeyUpdate>;
};

/** Input for the nested mutation of `invitation` in the `CompanyInput` mutation. */
export type InvitationCompanyIdFkeyInverseInput = {
  /** The primary key(s) for `invitation` for the far side of the relationship. */
  connectById?: InputMaybe<Array<InvitationInvitationPkeyConnect>>;
  /** The primary key(s) for `invitation` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<InvitationNodeIdConnect>>;
  /** The primary key(s) for `invitation` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<InvitationInvitationPkeyDelete>>;
  /** The primary key(s) for `invitation` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<InvitationNodeIdDelete>>;
  /** Flag indicating whether all other `invitation` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `invitation` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<InvitationOnInvitationForInvitationCompanyIdFkeyUsingInvitationPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `invitation` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<CompanyOnInvitationForInvitationCompanyIdFkeyNodeIdUpdate>
  >;
};

/**
 * A condition to be used against `Invitation` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type InvitationCondition = {
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `invitee` field. */
  invitee?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `senderAccountId` field. */
  senderAccountId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<InvitationStatus>;
};

/** A filter to be used against `Invitation` object types. All fields are combined with a logical ‘and.’ */
export type InvitationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<InvitationFilter>>;
  /** Filter by the object’s `companyId` field. */
  companyId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `invitee` field. */
  invitee?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<InvitationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<InvitationFilter>>;
  /** Filter by the object’s `senderAccountId` field. */
  senderAccountId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<InvitationStatusFilter>;
};

/** The fields on `invitation` to look up the row to connect. */
export type InvitationInvitationPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `invitation` to look up the row to delete. */
export type InvitationInvitationPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The globally unique `ID` look up for the row to connect. */
export type InvitationNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `invitation` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type InvitationNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `invitation` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type InvitationOnInvitationForInvitationCompanyIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `company` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `company` being updated. */
  patch: CompanyPatch;
};

/** The fields on `invitation` to look up the row to update. */
export type InvitationOnInvitationForInvitationCompanyIdFkeyUsingInvitationPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `invitation` being updated. */
    patch: UpdateInvitationOnInvitationForInvitationCompanyIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type InvitationOnInvitationForInvitationSenderAccountIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `account` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: AccountPatch;
  };

/** The fields on `invitation` to look up the row to update. */
export type InvitationOnInvitationForInvitationSenderAccountIdFkeyUsingInvitationPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `invitation` being updated. */
    patch: UpdateInvitationOnInvitationForInvitationSenderAccountIdFkeyPatch;
  };

/** Represents an update to a `Invitation`. Fields that are set will be updated. */
export type InvitationPatch = {
  accountToSenderAccountId?: InputMaybe<InvitationSenderAccountIdFkeyInput>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<InvitationCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** An email address */
  invitee?: InputMaybe<Scalars["String"]>;
  /** An optional note that can be included in the invitation by the sender */
  personalNote?: InputMaybe<Scalars["String"]>;
  /** fk */
  senderAccountId?: InputMaybe<Scalars["Int"]>;
  /** ek */
  status?: InputMaybe<InvitationStatus>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `account` in the `InvitationInput` mutation. */
export type InvitationSenderAccountIdFkeyInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<AccountAccountEmailKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<AccountAccountPkeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AccountNodeIdConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<AccountAccountEmailKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<AccountAccountPkeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AccountNodeIdDelete>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<AccountOnInvitationForInvitationSenderAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<AccountOnInvitationForInvitationSenderAccountIdFkeyUsingAccountEmailKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<AccountOnInvitationForInvitationSenderAccountIdFkeyUsingAccountPkeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<InvitationOnInvitationForInvitationSenderAccountIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `invitation` in the `AccountInput` mutation. */
export type InvitationSenderAccountIdFkeyInverseInput = {
  /** The primary key(s) for `invitation` for the far side of the relationship. */
  connectById?: InputMaybe<Array<InvitationInvitationPkeyConnect>>;
  /** The primary key(s) for `invitation` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<InvitationNodeIdConnect>>;
  /** The primary key(s) for `invitation` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<InvitationInvitationPkeyDelete>>;
  /** The primary key(s) for `invitation` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<InvitationNodeIdDelete>>;
  /** Flag indicating whether all other `invitation` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `invitation` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<InvitationOnInvitationForInvitationSenderAccountIdFkeyUsingInvitationPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `invitation` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AccountOnInvitationForInvitationSenderAccountIdFkeyNodeIdUpdate>
  >;
};

export type InvitationStatus = "ACCEPTED" | "CANCELLED" | "NEW";

/** A filter to be used against InvitationStatus fields. All fields are combined with a logical ‘and.’ */
export type InvitationStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<InvitationStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<InvitationStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<InvitationStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<InvitationStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<InvitationStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars["Boolean"]>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<InvitationStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<InvitationStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<InvitationStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<InvitationStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<InvitationStatus>>;
};

/** A connection to a list of `Invitation` values. */
export type InvitationsConnection = {
  __typename?: "InvitationsConnection";
  /** A list of edges which contains the `Invitation` and cursor to aid in pagination. */
  edges: Array<InvitationsEdge>;
  /** A list of `Invitation` objects. */
  nodes: Array<Invitation>;
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
export type InvitationsOrderBy =
  | "COMPANY_ID_ASC"
  | "COMPANY_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "INVITEE_ASC"
  | "INVITEE_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "SENDER_ACCOUNT_ID_ASC"
  | "SENDER_ACCOUNT_ID_DESC"
  | "STATUS_ASC"
  | "STATUS_DESC";

export type InviteInput = {
  emails: Array<Scalars["String"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  personalNote?: InputMaybe<Scalars["String"]>;
};

/** A connection to a list of `Int` values. */
export type InvitedByCompaniesConnection = {
  __typename?: "InvitedByCompaniesConnection";
  /** A list of edges which contains the `Int` and cursor to aid in pagination. */
  edges: Array<InvitedByCompanyEdge>;
  /** A list of `Int` objects. */
  nodes: Array<Maybe<Scalars["Int"]>>;
  /** The count of *all* `Int` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Int` edge in the connection. */
export type InvitedByCompanyEdge = {
  __typename?: "InvitedByCompanyEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Int` at the end of the edge. */
  node?: Maybe<Scalars["Int"]>;
};

/** A connection to a list of `Int` values. */
export type IsPartOfProjectConnection = {
  __typename?: "IsPartOfProjectConnection";
  /** A list of edges which contains the `Int` and cursor to aid in pagination. */
  edges: Array<IsPartOfProjectEdge>;
  /** A list of `Int` objects. */
  nodes: Array<Maybe<Scalars["Int"]>>;
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

export type Language =
  | "DA"
  | "DE"
  | "EN"
  | "ES"
  | "FI"
  | "FR"
  | "IT"
  | "NL"
  | "NO"
  | "PL"
  | "PT"
  | "SK"
  | "SV";

/** All input for the `linkAccountToCompany` mutation. */
export type LinkAccountToCompanyInput = {
  accountId?: InputMaybe<Scalars["Int"]>;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  companyId?: InputMaybe<Scalars["Int"]>;
};

/** The output of our `linkAccountToCompany` mutation. */
export type LinkAccountToCompanyPayload = {
  __typename?: "LinkAccountToCompanyPayload";
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  companyMember?: Maybe<CompanyMember>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMembersEdge>;
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our `linkAccountToCompany` mutation. */
export type LinkAccountToCompanyPayloadCompanyMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyMembersOrderBy>>;
};

/** All input for the `markAllNotificationsAsRead` mutation. */
export type MarkAllNotificationsAsReadInput = {
  accountToUpdateId?: InputMaybe<Scalars["Int"]>;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
};

/** The output of our `markAllNotificationsAsRead` mutation. */
export type MarkAllNotificationsAsReadPayload = {
  __typename?: "MarkAllNotificationsAsReadPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  notifications?: Maybe<Array<Notification>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** A country that BMI operates in */
export type Market = Node & {
  __typename?: "Market";
  /** Reads and enables pagination through a set of `Account`. */
  accounts: AccountsConnection;
  /** The space in Contenful */
  cmsSpaceId?: Maybe<Scalars["String"]>;
  /** Reads and enables pagination through a set of `Company`. */
  companies: CompaniesConnection;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMembersConnection;
  createdAt: Scalars["Datetime"];
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: Maybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: Maybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: Maybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: Maybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: Maybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: Maybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: Maybe<Point>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: Maybe<Scalars["String"]>;
  gtagMarketMedia?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** ek */
  language: Language;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: Maybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: Maybe<Scalars["String"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Reads and enables pagination through a set of `Product`. */
  products: ProductsConnection;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: Maybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: Maybe<Scalars["String"]>;
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembers: SystemMembersConnection;
  /** Reads and enables pagination through a set of `System`. */
  systems: SystemsConnection;
  updatedAt: Scalars["Datetime"];
};

/** A country that BMI operates in */
export type MarketAccountsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<AccountCondition>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** A country that BMI operates in */
export type MarketCompaniesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyCondition>;
  filter?: InputMaybe<CompanyFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompaniesOrderBy>>;
};

/** A country that BMI operates in */
export type MarketCompanyMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyMemberCondition>;
  filter?: InputMaybe<CompanyMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompanyMembersOrderBy>>;
};

/** A country that BMI operates in */
export type MarketProductsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProductCondition>;
  filter?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProductsOrderBy>>;
};

/** A country that BMI operates in */
export type MarketSystemMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<SystemMemberCondition>;
  filter?: InputMaybe<SystemMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<SystemMembersOrderBy>>;
};

/** A country that BMI operates in */
export type MarketSystemsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<SystemCondition>;
  filter?: InputMaybe<SystemFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<SystemsOrderBy>>;
};

/** A condition to be used against `Market` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MarketCondition = {
  /** Checks for equality with the object’s `doceboCatalogueId` field. */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `domain` field. */
  domain?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContent = Entry & {
  __typename?: "MarketContent";
  contactUsPage?: Maybe<ContentArticle>;
  contactsCollection?: Maybe<MarketContentContactsCollection>;
  contentfulMetadata: ContentfulMetadata;
  externalLinkLabel?: Maybe<Scalars["String"]>;
  externalLinkUrl?: Maybe<Scalars["String"]>;
  footerLinksCollection?: Maybe<MarketContentFooterLinksCollection>;
  linkedFrom?: Maybe<MarketContentLinkingCollections>;
  live?: Maybe<Scalars["String"]>;
  mediaLibraryRootCollection?: Maybe<MarketContentMediaLibraryRootCollection>;
  name?: Maybe<Scalars["String"]>;
  newsItemCta?: Maybe<Scalars["String"]>;
  newsItemHeading?: Maybe<Scalars["String"]>;
  newsItemUrl?: Maybe<Scalars["String"]>;
  partnerBrandsCollection?: Maybe<MarketContentPartnerBrandsCollection>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentContactUsPageArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentContactsCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentExternalLinkLabelArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentExternalLinkUrlArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentFooterLinksCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentLiveArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentMediaLibraryRootCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentNewsItemCtaArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentNewsItemHeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentNewsItemUrlArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/marketContent) */
export type MarketContentPartnerBrandsCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MarketContentCollection = {
  __typename?: "MarketContentCollection";
  items: Array<Maybe<MarketContent>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MarketContentContactsCollection = {
  __typename?: "MarketContentContactsCollection";
  items: Array<Maybe<ContactDetails>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MarketContentFilter = {
  AND?: InputMaybe<Array<InputMaybe<MarketContentFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MarketContentFilter>>>;
  contactUsPage?: InputMaybe<CfContentArticleNestedFilter>;
  contactUsPage_exists?: InputMaybe<Scalars["Boolean"]>;
  contactsCollection_exists?: InputMaybe<Scalars["Boolean"]>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  externalLinkLabel?: InputMaybe<Scalars["String"]>;
  externalLinkLabel_contains?: InputMaybe<Scalars["String"]>;
  externalLinkLabel_exists?: InputMaybe<Scalars["Boolean"]>;
  externalLinkLabel_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  externalLinkLabel_not?: InputMaybe<Scalars["String"]>;
  externalLinkLabel_not_contains?: InputMaybe<Scalars["String"]>;
  externalLinkLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  externalLinkUrl?: InputMaybe<Scalars["String"]>;
  externalLinkUrl_contains?: InputMaybe<Scalars["String"]>;
  externalLinkUrl_exists?: InputMaybe<Scalars["Boolean"]>;
  externalLinkUrl_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  externalLinkUrl_not?: InputMaybe<Scalars["String"]>;
  externalLinkUrl_not_contains?: InputMaybe<Scalars["String"]>;
  externalLinkUrl_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  footerLinksCollection_exists?: InputMaybe<Scalars["Boolean"]>;
  live?: InputMaybe<Scalars["String"]>;
  live_contains?: InputMaybe<Scalars["String"]>;
  live_exists?: InputMaybe<Scalars["Boolean"]>;
  live_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  live_not?: InputMaybe<Scalars["String"]>;
  live_not_contains?: InputMaybe<Scalars["String"]>;
  live_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  mediaLibraryRootCollection_exists?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_exists?: InputMaybe<Scalars["Boolean"]>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  newsItemCta?: InputMaybe<Scalars["String"]>;
  newsItemCta_contains?: InputMaybe<Scalars["String"]>;
  newsItemCta_exists?: InputMaybe<Scalars["Boolean"]>;
  newsItemCta_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  newsItemCta_not?: InputMaybe<Scalars["String"]>;
  newsItemCta_not_contains?: InputMaybe<Scalars["String"]>;
  newsItemCta_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  newsItemHeading?: InputMaybe<Scalars["String"]>;
  newsItemHeading_contains?: InputMaybe<Scalars["String"]>;
  newsItemHeading_exists?: InputMaybe<Scalars["Boolean"]>;
  newsItemHeading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  newsItemHeading_not?: InputMaybe<Scalars["String"]>;
  newsItemHeading_not_contains?: InputMaybe<Scalars["String"]>;
  newsItemHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  newsItemUrl?: InputMaybe<Scalars["String"]>;
  newsItemUrl_contains?: InputMaybe<Scalars["String"]>;
  newsItemUrl_exists?: InputMaybe<Scalars["Boolean"]>;
  newsItemUrl_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  newsItemUrl_not?: InputMaybe<Scalars["String"]>;
  newsItemUrl_not_contains?: InputMaybe<Scalars["String"]>;
  newsItemUrl_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  partnerBrandsCollection_exists?: InputMaybe<Scalars["Boolean"]>;
  sys?: InputMaybe<SysFilter>;
};

export type MarketContentFooterLinksCollection = {
  __typename?: "MarketContentFooterLinksCollection";
  items: Array<Maybe<ContentArticle>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MarketContentLinkingCollections = {
  __typename?: "MarketContentLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type MarketContentLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MarketContentMediaLibraryRootCollection = {
  __typename?: "MarketContentMediaLibraryRootCollection";
  items: Array<Maybe<MediaFolder>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MarketContentOrder =
  | "externalLinkLabel_ASC"
  | "externalLinkLabel_DESC"
  | "externalLinkUrl_ASC"
  | "externalLinkUrl_DESC"
  | "live_ASC"
  | "live_DESC"
  | "name_ASC"
  | "name_DESC"
  | "newsItemCta_ASC"
  | "newsItemCta_DESC"
  | "newsItemHeading_ASC"
  | "newsItemHeading_DESC"
  | "newsItemUrl_ASC"
  | "newsItemUrl_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

export type MarketContentPartnerBrandsCollection = {
  __typename?: "MarketContentPartnerBrandsCollection";
  items: Array<Maybe<PartnerBrand>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

/** A filter to be used against `Market` object types. All fields are combined with a logical ‘and.’ */
export type MarketFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MarketFilter>>;
  /** Filter by the object’s `doceboCatalogueId` field. */
  doceboCatalogueId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `domain` field. */
  domain?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MarketFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MarketFilter>>;
};

/** An input for mutations affecting `Market` */
export type MarketInput = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language: Language;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The fields on `market` to look up the row to connect. */
export type MarketMarketDoceboCatalogueIdKeyConnect = {
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId: Scalars["Int"];
};

/** The fields on `market` to look up the row to delete. */
export type MarketMarketDoceboCatalogueIdKeyDelete = {
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId: Scalars["Int"];
};

/** The fields on `market` to look up the row to connect. */
export type MarketMarketDomainKeyConnect = {
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
};

/** The fields on `market` to look up the row to delete. */
export type MarketMarketDomainKeyDelete = {
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
};

/** The fields on `market` to look up the row to connect. */
export type MarketMarketPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `market` to look up the row to delete. */
export type MarketMarketPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The globally unique `ID` look up for the row to connect. */
export type MarketNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `market` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type MarketNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `market` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type MarketOnAccountForAccountMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `account` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `account` being updated. */
  patch: AccountPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnAccountForAccountMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate =
  {
    /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
    doceboCatalogueId: Scalars["Int"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnAccountForAccountMarketIdFkeyPatch;
  };

/** The fields on `market` to look up the row to update. */
export type MarketOnAccountForAccountMarketIdFkeyUsingMarketDomainKeyUpdate = {
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: UpdateMarketOnAccountForAccountMarketIdFkeyPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnAccountForAccountMarketIdFkeyUsingMarketPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: UpdateMarketOnAccountForAccountMarketIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type MarketOnCompanyForCompanyMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `company` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `company` being updated. */
  patch: CompanyPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnCompanyForCompanyMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate =
  {
    /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
    doceboCatalogueId: Scalars["Int"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnCompanyForCompanyMarketIdFkeyPatch;
  };

/** The fields on `market` to look up the row to update. */
export type MarketOnCompanyForCompanyMarketIdFkeyUsingMarketDomainKeyUpdate = {
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: UpdateMarketOnCompanyForCompanyMarketIdFkeyPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnCompanyForCompanyMarketIdFkeyUsingMarketPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: UpdateMarketOnCompanyForCompanyMarketIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type MarketOnCompanyMemberForCompanyMemberMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `companyMember` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `companyMember` being updated. */
  patch: CompanyMemberPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnCompanyMemberForCompanyMemberMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate =
  {
    /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
    doceboCatalogueId: Scalars["Int"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnCompanyMemberForCompanyMemberMarketIdFkeyPatch;
  };

/** The fields on `market` to look up the row to update. */
export type MarketOnCompanyMemberForCompanyMemberMarketIdFkeyUsingMarketDomainKeyUpdate =
  {
    /** the country code used for example as the subdomain */
    domain: Scalars["String"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnCompanyMemberForCompanyMemberMarketIdFkeyPatch;
  };

/** The fields on `market` to look up the row to update. */
export type MarketOnCompanyMemberForCompanyMemberMarketIdFkeyUsingMarketPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnCompanyMemberForCompanyMemberMarketIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type MarketOnProductForProductMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `product` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `product` being updated. */
  patch: ProductPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnProductForProductMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate =
  {
    /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
    doceboCatalogueId: Scalars["Int"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnProductForProductMarketIdFkeyPatch;
  };

/** The fields on `market` to look up the row to update. */
export type MarketOnProductForProductMarketIdFkeyUsingMarketDomainKeyUpdate = {
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: UpdateMarketOnProductForProductMarketIdFkeyPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnProductForProductMarketIdFkeyUsingMarketPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: UpdateMarketOnProductForProductMarketIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type MarketOnSystemForSystemMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `system` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `system` being updated. */
  patch: SystemPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnSystemForSystemMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate =
  {
    /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
    doceboCatalogueId: Scalars["Int"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnSystemForSystemMarketIdFkeyPatch;
  };

/** The fields on `market` to look up the row to update. */
export type MarketOnSystemForSystemMarketIdFkeyUsingMarketDomainKeyUpdate = {
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: UpdateMarketOnSystemForSystemMarketIdFkeyPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnSystemForSystemMarketIdFkeyUsingMarketPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: UpdateMarketOnSystemForSystemMarketIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type MarketOnSystemMemberForSystemMemberMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `systemMember` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `systemMember` being updated. */
  patch: SystemMemberPatch;
};

/** The fields on `market` to look up the row to update. */
export type MarketOnSystemMemberForSystemMemberMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate =
  {
    /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
    doceboCatalogueId: Scalars["Int"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnSystemMemberForSystemMemberMarketIdFkeyPatch;
  };

/** The fields on `market` to look up the row to update. */
export type MarketOnSystemMemberForSystemMemberMarketIdFkeyUsingMarketDomainKeyUpdate =
  {
    /** the country code used for example as the subdomain */
    domain: Scalars["String"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnSystemMemberForSystemMemberMarketIdFkeyPatch;
  };

/** The fields on `market` to look up the row to update. */
export type MarketOnSystemMemberForSystemMemberMarketIdFkeyUsingMarketPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: UpdateMarketOnSystemMemberForSystemMemberMarketIdFkeyPatch;
  };

/** Represents an update to a `Market`. Fields that are set will be updated. */
export type MarketPatch = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain?: InputMaybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language?: InputMaybe<Language>;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Market` values. */
export type MarketsConnection = {
  __typename?: "MarketsConnection";
  /** A list of edges which contains the `Market` and cursor to aid in pagination. */
  edges: Array<MarketsEdge>;
  /** A list of `Market` objects. */
  nodes: Array<Market>;
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
export type MarketsOrderBy =
  | "DOCEBO_CATALOGUE_ID_ASC"
  | "DOCEBO_CATALOGUE_ID_DESC"
  | "DOMAIN_ASC"
  | "DOMAIN_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A folder used for categorising the presentation in the Media Tools Library [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaFolder) */
export type MediaFolder = Entry & {
  __typename?: "MediaFolder";
  childrenCollection?: Maybe<MediaFolderChildrenCollection>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MediaFolderLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  sys: Sys;
};

/** A folder used for categorising the presentation in the Media Tools Library [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaFolder) */
export type MediaFolderChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

/** A folder used for categorising the presentation in the Media Tools Library [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaFolder) */
export type MediaFolderLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** A folder used for categorising the presentation in the Media Tools Library [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaFolder) */
export type MediaFolderNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type MediaFolderChildrenCollection = {
  __typename?: "MediaFolderChildrenCollection";
  items: Array<Maybe<MediaFolderChildrenItem>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MediaFolderChildrenItem = MediaFolder | MediaTool;

export type MediaFolderCollection = {
  __typename?: "MediaFolderCollection";
  items: Array<Maybe<MediaFolder>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MediaFolderFilter = {
  AND?: InputMaybe<Array<InputMaybe<MediaFolderFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MediaFolderFilter>>>;
  childrenCollection_exists?: InputMaybe<Scalars["Boolean"]>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_exists?: InputMaybe<Scalars["Boolean"]>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
};

export type MediaFolderLinkingCollections = {
  __typename?: "MediaFolderLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  marketContentCollection?: Maybe<MarketContentCollection>;
  mediaFolderCollection?: Maybe<MediaFolderCollection>;
};

export type MediaFolderLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MediaFolderLinkingCollectionsMarketContentCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MediaFolderLinkingCollectionsMediaFolderCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MediaFolderOrder =
  | "name_ASC"
  | "name_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaTool) */
export type MediaTool = Entry & {
  __typename?: "MediaTool";
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MediaToolLinkingCollections>;
  media?: Maybe<Asset>;
  name?: Maybe<Scalars["String"]>;
  sys: Sys;
  thumbnail?: Maybe<Asset>;
  url?: Maybe<Scalars["String"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaTool) */
export type MediaToolLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaTool) */
export type MediaToolMediaArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaTool) */
export type MediaToolNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaTool) */
export type MediaToolThumbnailArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/mediaTool) */
export type MediaToolUrlArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type MediaToolCollection = {
  __typename?: "MediaToolCollection";
  items: Array<Maybe<MediaTool>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MediaToolFilter = {
  AND?: InputMaybe<Array<InputMaybe<MediaToolFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MediaToolFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  media_exists?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_exists?: InputMaybe<Scalars["Boolean"]>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
  thumbnail_exists?: InputMaybe<Scalars["Boolean"]>;
  url?: InputMaybe<Scalars["String"]>;
  url_contains?: InputMaybe<Scalars["String"]>;
  url_exists?: InputMaybe<Scalars["Boolean"]>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  url_not?: InputMaybe<Scalars["String"]>;
  url_not_contains?: InputMaybe<Scalars["String"]>;
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MediaToolLinkingCollections = {
  __typename?: "MediaToolLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  mediaFolderCollection?: Maybe<MediaFolderCollection>;
};

export type MediaToolLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MediaToolLinkingCollectionsMediaFolderCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MediaToolOrder =
  | "name_ASC"
  | "name_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC"
  | "url_ASC"
  | "url_DESC";

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/messageTemplate) */
export type MessageTemplate = Entry & {
  __typename?: "MessageTemplate";
  contentfulMetadata: ContentfulMetadata;
  emailBody?: Maybe<Scalars["String"]>;
  event?: Maybe<Scalars["String"]>;
  format?: Maybe<Array<Maybe<Scalars["String"]>>>;
  linkedFrom?: Maybe<MessageTemplateLinkingCollections>;
  notificationBody?: Maybe<Scalars["String"]>;
  subject?: Maybe<Scalars["String"]>;
  sys: Sys;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/messageTemplate) */
export type MessageTemplateEmailBodyArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/messageTemplate) */
export type MessageTemplateEventArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/messageTemplate) */
export type MessageTemplateFormatArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/messageTemplate) */
export type MessageTemplateLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/messageTemplate) */
export type MessageTemplateNotificationBodyArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/messageTemplate) */
export type MessageTemplateSubjectArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type MessageTemplateCollection = {
  __typename?: "MessageTemplateCollection";
  items: Array<Maybe<MessageTemplate>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MessageTemplateFilter = {
  AND?: InputMaybe<Array<InputMaybe<MessageTemplateFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MessageTemplateFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  emailBody?: InputMaybe<Scalars["String"]>;
  emailBody_contains?: InputMaybe<Scalars["String"]>;
  emailBody_exists?: InputMaybe<Scalars["Boolean"]>;
  emailBody_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  emailBody_not?: InputMaybe<Scalars["String"]>;
  emailBody_not_contains?: InputMaybe<Scalars["String"]>;
  emailBody_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  event?: InputMaybe<Scalars["String"]>;
  event_contains?: InputMaybe<Scalars["String"]>;
  event_exists?: InputMaybe<Scalars["Boolean"]>;
  event_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  event_not?: InputMaybe<Scalars["String"]>;
  event_not_contains?: InputMaybe<Scalars["String"]>;
  event_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  format_contains_all?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  format_contains_none?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  format_contains_some?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  format_exists?: InputMaybe<Scalars["Boolean"]>;
  notificationBody?: InputMaybe<Scalars["String"]>;
  notificationBody_contains?: InputMaybe<Scalars["String"]>;
  notificationBody_exists?: InputMaybe<Scalars["Boolean"]>;
  notificationBody_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  notificationBody_not?: InputMaybe<Scalars["String"]>;
  notificationBody_not_contains?: InputMaybe<Scalars["String"]>;
  notificationBody_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  subject?: InputMaybe<Scalars["String"]>;
  subject_contains?: InputMaybe<Scalars["String"]>;
  subject_exists?: InputMaybe<Scalars["Boolean"]>;
  subject_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  subject_not?: InputMaybe<Scalars["String"]>;
  subject_not_contains?: InputMaybe<Scalars["String"]>;
  subject_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
};

export type MessageTemplateLinkingCollections = {
  __typename?: "MessageTemplateLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
};

export type MessageTemplateLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MessageTemplateLinkingCollectionsGuaranteeTemplateCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MessageTemplateOrder =
  | "event_ASC"
  | "event_DESC"
  | "notificationBody_ASC"
  | "notificationBody_DESC"
  | "subject_ASC"
  | "subject_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/migration) */
export type Migration = Entry & {
  __typename?: "Migration";
  contentTypeId?: Maybe<Scalars["String"]>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MigrationLinkingCollections>;
  state?: Maybe<Scalars["JSON"]>;
  sys: Sys;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/migration) */
export type MigrationContentTypeIdArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/migration) */
export type MigrationLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/migration) */
export type MigrationStateArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type MigrationCollection = {
  __typename?: "MigrationCollection";
  items: Array<Maybe<Migration>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type MigrationFilter = {
  AND?: InputMaybe<Array<InputMaybe<MigrationFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MigrationFilter>>>;
  contentTypeId?: InputMaybe<Scalars["String"]>;
  contentTypeId_contains?: InputMaybe<Scalars["String"]>;
  contentTypeId_exists?: InputMaybe<Scalars["Boolean"]>;
  contentTypeId_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  contentTypeId_not?: InputMaybe<Scalars["String"]>;
  contentTypeId_not_contains?: InputMaybe<Scalars["String"]>;
  contentTypeId_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  sys?: InputMaybe<SysFilter>;
};

export type MigrationLinkingCollections = {
  __typename?: "MigrationLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type MigrationLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type MigrationOrder =
  | "contentTypeId_ASC"
  | "contentTypeId_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: "Mutation";
  bulkImport?: Maybe<ImportOutput>;
  completeInvitation?: Maybe<Account>;
  courseCatalogueUpdate?: Maybe<CourseCatalogueUpdatePayload>;
  courseCatalogueUpdateByTemp?: Maybe<CourseCatalogueUpdateByTempPayload>;
  courseEnrollmentUpdate?: Maybe<CourseEnrollmentUpdatePayload>;
  courseEnrollmentUpdateByTemp?: Maybe<CourseEnrollmentUpdateByTempPayload>;
  courseUpdate?: Maybe<CourseUpdatePayload>;
  courseUpdateByTemp?: Maybe<CourseUpdateByTempPayload>;
  createAccount?: Maybe<CreateAccountPayload>;
  /** Creates a single `Address`. */
  createAddress?: Maybe<CreateAddressPayload>;
  /** Creates a single `Certification`. */
  createCertification?: Maybe<CreateCertificationPayload>;
  createCompany?: Maybe<CreateCompanyPayload>;
  /** Creates a single `CompanyDocument`. */
  createCompanyDocument?: Maybe<CreateCompanyDocumentPayload>;
  createCompanyDocuments?: Maybe<CreateCompanyDocumentsPayload>;
  /** Creates a single `CompanyMember`. */
  createCompanyMember?: Maybe<CreateCompanyMemberPayload>;
  /** Creates a single `CompanyOperation`. */
  createCompanyOperation?: Maybe<CreateCompanyOperationPayload>;
  /** Creates a single `Course`. */
  createCourse?: Maybe<CreateCoursePayload>;
  /** Creates a single `CourseCatalogue`. */
  createCourseCatalogue?: Maybe<CreateCourseCataloguePayload>;
  /** Creates a single `CourseCatalogueTemp`. */
  createCourseCatalogueTemp?: Maybe<CreateCourseCatalogueTempPayload>;
  /** Creates a single `CourseEnrollment`. */
  createCourseEnrollment?: Maybe<CreateCourseEnrollmentPayload>;
  /** Creates a single `CourseEnrollmentTemp`. */
  createCourseEnrollmentTemp?: Maybe<CreateCourseEnrollmentTempPayload>;
  /** Creates a single `CourseSyncConfiguration`. */
  createCourseSyncConfiguration?: Maybe<CreateCourseSyncConfigurationPayload>;
  /** Creates a single `CourseTemp`. */
  createCourseTemp?: Maybe<CreateCourseTempPayload>;
  createDoceboUser?: Maybe<UserCreateResponse>;
  /** Creates a single `EvidenceItem`. */
  createEvidenceItem?: Maybe<CreateEvidenceItemPayload>;
  /** Creates a single `Guarantee`. */
  createGuarantee?: Maybe<CreateGuaranteePayload>;
  createGuaranteePdf?: Maybe<PublishOutput>;
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
  createSSOUrl?: Maybe<SsoUrlOutput>;
  /** Creates a single `System`. */
  createSystem?: Maybe<CreateSystemPayload>;
  /** Creates a single `SystemMember`. */
  createSystemMember?: Maybe<CreateSystemMemberPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountByDoceboUserId?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountByEmail?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccountByNodeId?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Address` using a unique key. */
  deleteAddress?: Maybe<DeleteAddressPayload>;
  /** Deletes a single `Address` using its globally unique id. */
  deleteAddressByNodeId?: Maybe<DeleteAddressPayload>;
  /** Deletes a single `Certification` using a unique key. */
  deleteCertification?: Maybe<DeleteCertificationPayload>;
  /** Deletes a single `Certification` using its globally unique id. */
  deleteCertificationByNodeId?: Maybe<DeleteCertificationPayload>;
  /** Deletes a single `Company` using a unique key. */
  deleteCompany?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `Company` using a unique key. */
  deleteCompanyByMarketIdAndName?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `Company` using its globally unique id. */
  deleteCompanyByNodeId?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `Company` using a unique key. */
  deleteCompanyByReferenceNumber?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `CompanyDocument` using a unique key. */
  deleteCompanyDocument?: Maybe<DeleteCompanyDocumentPayload>;
  /** Deletes a single `CompanyDocument` using its globally unique id. */
  deleteCompanyDocumentByNodeId?: Maybe<DeleteCompanyDocumentPayload>;
  /** Deletes a single `CompanyMember` using a unique key. */
  deleteCompanyMember?: Maybe<DeleteCompanyMemberPayload>;
  /** Deletes a single `CompanyMember` using a unique key. */
  deleteCompanyMemberByMarketIdAndAccountIdAndCompanyId?: Maybe<DeleteCompanyMemberPayload>;
  /** Deletes a single `CompanyMember` using its globally unique id. */
  deleteCompanyMemberByNodeId?: Maybe<DeleteCompanyMemberPayload>;
  /** Deletes a single `CompanyOperation` using a unique key. */
  deleteCompanyOperation?: Maybe<DeleteCompanyOperationPayload>;
  /** Deletes a single `CompanyOperation` using its globally unique id. */
  deleteCompanyOperationByNodeId?: Maybe<DeleteCompanyOperationPayload>;
  /** Deletes a single `Course` using a unique key. */
  deleteCourse?: Maybe<DeleteCoursePayload>;
  /** Deletes a single `Course` using a unique key. */
  deleteCourseByCourseId?: Maybe<DeleteCoursePayload>;
  /** Deletes a single `Course` using its globally unique id. */
  deleteCourseByNodeId?: Maybe<DeleteCoursePayload>;
  /** Deletes a single `CourseCatalogue` using a unique key. */
  deleteCourseCatalogue?: Maybe<DeleteCourseCataloguePayload>;
  /** Deletes a single `CourseCatalogue` using a unique key. */
  deleteCourseCatalogueByCatalogueIdAndCourseId?: Maybe<DeleteCourseCataloguePayload>;
  /** Deletes a single `CourseCatalogue` using its globally unique id. */
  deleteCourseCatalogueByNodeId?: Maybe<DeleteCourseCataloguePayload>;
  /** Deletes a single `CourseCatalogueTemp` using a unique key. */
  deleteCourseCatalogueTemp?: Maybe<DeleteCourseCatalogueTempPayload>;
  /** Deletes a single `CourseCatalogueTemp` using its globally unique id. */
  deleteCourseCatalogueTempByNodeId?: Maybe<DeleteCourseCatalogueTempPayload>;
  /** Deletes a single `CourseEnrollment` using a unique key. */
  deleteCourseEnrollment?: Maybe<DeleteCourseEnrollmentPayload>;
  /** Deletes a single `CourseEnrollment` using its globally unique id. */
  deleteCourseEnrollmentByNodeId?: Maybe<DeleteCourseEnrollmentPayload>;
  /** Deletes a single `CourseEnrollment` using a unique key. */
  deleteCourseEnrollmentByUserIdAndCourseId?: Maybe<DeleteCourseEnrollmentPayload>;
  /** Deletes a single `CourseEnrollmentTemp` using a unique key. */
  deleteCourseEnrollmentTemp?: Maybe<DeleteCourseEnrollmentTempPayload>;
  /** Deletes a single `CourseEnrollmentTemp` using its globally unique id. */
  deleteCourseEnrollmentTempByNodeId?: Maybe<DeleteCourseEnrollmentTempPayload>;
  /** Deletes a single `CourseSyncConfiguration` using a unique key. */
  deleteCourseSyncConfiguration?: Maybe<DeleteCourseSyncConfigurationPayload>;
  /** Deletes a single `CourseSyncConfiguration` using a unique key. */
  deleteCourseSyncConfigurationByConfigName?: Maybe<DeleteCourseSyncConfigurationPayload>;
  /** Deletes a single `CourseSyncConfiguration` using its globally unique id. */
  deleteCourseSyncConfigurationByNodeId?: Maybe<DeleteCourseSyncConfigurationPayload>;
  /** Deletes a single `CourseTemp` using a unique key. */
  deleteCourseTemp?: Maybe<DeleteCourseTempPayload>;
  /** Deletes a single `CourseTemp` using its globally unique id. */
  deleteCourseTempByNodeId?: Maybe<DeleteCourseTempPayload>;
  /** Deletes a single `EvidenceItem` using a unique key. */
  deleteEvidenceItem?: Maybe<DeleteEvidenceItemPayload>;
  /** Deletes a single `EvidenceItem` using its globally unique id. */
  deleteEvidenceItemByNodeId?: Maybe<DeleteEvidenceItemPayload>;
  /** Deletes a single `Guarantee` using a unique key. */
  deleteGuarantee?: Maybe<DeleteGuaranteePayload>;
  /** Deletes a single `Guarantee` using a unique key. */
  deleteGuaranteeByBmiReferenceId?: Maybe<DeleteGuaranteePayload>;
  /** Deletes a single `Guarantee` using its globally unique id. */
  deleteGuaranteeByNodeId?: Maybe<DeleteGuaranteePayload>;
  /** Deletes a single `Invitation` using a unique key. */
  deleteInvitation?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Invitation` using its globally unique id. */
  deleteInvitationByNodeId?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Market` using a unique key. */
  deleteMarket?: Maybe<DeleteMarketPayload>;
  /** Deletes a single `Market` using a unique key. */
  deleteMarketByDoceboCatalogueId?: Maybe<DeleteMarketPayload>;
  /** Deletes a single `Market` using a unique key. */
  deleteMarketByDomain?: Maybe<DeleteMarketPayload>;
  /** Deletes a single `Market` using its globally unique id. */
  deleteMarketByNodeId?: Maybe<DeleteMarketPayload>;
  /** Deletes a single `Note` using a unique key. */
  deleteNote?: Maybe<DeleteNotePayload>;
  /** Deletes a single `Note` using its globally unique id. */
  deleteNoteByNodeId?: Maybe<DeleteNotePayload>;
  /** Deletes a single `Notification` using a unique key. */
  deleteNotification?: Maybe<DeleteNotificationPayload>;
  /** Deletes a single `Notification` using its globally unique id. */
  deleteNotificationByNodeId?: Maybe<DeleteNotificationPayload>;
  /** Deletes a single `Product` using a unique key. */
  deleteProduct?: Maybe<DeleteProductPayload>;
  /** Deletes a single `Product` using a unique key. */
  deleteProductByBmiRef?: Maybe<DeleteProductPayload>;
  /** Deletes a single `Product` using its globally unique id. */
  deleteProductByNodeId?: Maybe<DeleteProductPayload>;
  /** Deletes a single `Project` using a unique key. */
  deleteProject?: Maybe<DeleteProjectPayload>;
  /** Deletes a single `Project` using its globally unique id. */
  deleteProjectByNodeId?: Maybe<DeleteProjectPayload>;
  /** Deletes a single `ProjectMember` using a unique key. */
  deleteProjectMember?: Maybe<DeleteProjectMemberPayload>;
  /** Deletes a single `ProjectMember` using its globally unique id. */
  deleteProjectMemberByNodeId?: Maybe<DeleteProjectMemberPayload>;
  /** Deletes a single `System` using a unique key. */
  deleteSystem?: Maybe<DeleteSystemPayload>;
  /** Deletes a single `System` using a unique key. */
  deleteSystemByBmiRef?: Maybe<DeleteSystemPayload>;
  /** Deletes a single `System` using its globally unique id. */
  deleteSystemByNodeId?: Maybe<DeleteSystemPayload>;
  /** Deletes a single `SystemMember` using a unique key. */
  deleteSystemMember?: Maybe<DeleteSystemMemberPayload>;
  /** Deletes a single `SystemMember` using its globally unique id. */
  deleteSystemMemberByNodeId?: Maybe<DeleteSystemMemberPayload>;
  /** Deletes a single `SystemMember` using a unique key. */
  deleteSystemMemberBySystemBmiRefAndProductBmiRefAndMarketId?: Maybe<DeleteSystemMemberPayload>;
  evidenceItemsAdd?: Maybe<EvidenceItemsAddPayload>;
  importAccountsCompaniesFromCVS?: Maybe<ImportAccountsCompaniesFromCsvResult>;
  invite?: Maybe<Array<Maybe<Invitation>>>;
  linkAccountToCompany?: Maybe<LinkAccountToCompanyPayload>;
  markAllNotificationsAsRead?: Maybe<MarkAllNotificationsAsReadPayload>;
  projectMembersAdd?: Maybe<ProjectMembersAddPayload>;
  publishMessage?: Maybe<Publish>;
  resetPassword?: Maybe<Scalars["String"]>;
  resetPasswordImportedUsers?: Maybe<ResetPasswordImportedUsersResult>;
  sendReminderToIncompleteCompanyProfile?: Maybe<Scalars["String"]>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccount?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountByDoceboUserId?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountByEmail?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using its globally unique id and a patch. */
  updateAccountByNodeId?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Address` using a unique key and a patch. */
  updateAddress?: Maybe<UpdateAddressPayload>;
  /** Updates a single `Address` using its globally unique id and a patch. */
  updateAddressByNodeId?: Maybe<UpdateAddressPayload>;
  /** Updates a single `Certification` using a unique key and a patch. */
  updateCertification?: Maybe<UpdateCertificationPayload>;
  /** Updates a single `Certification` using its globally unique id and a patch. */
  updateCertificationByNodeId?: Maybe<UpdateCertificationPayload>;
  /** Updates a single `Company` using a unique key and a patch. */
  updateCompany?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `Company` using a unique key and a patch. */
  updateCompanyByMarketIdAndName?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `Company` using its globally unique id and a patch. */
  updateCompanyByNodeId?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `Company` using a unique key and a patch. */
  updateCompanyByReferenceNumber?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `CompanyDocument` using a unique key and a patch. */
  updateCompanyDocument?: Maybe<UpdateCompanyDocumentPayload>;
  /** Updates a single `CompanyDocument` using its globally unique id and a patch. */
  updateCompanyDocumentByNodeId?: Maybe<UpdateCompanyDocumentPayload>;
  /** Updates a single `CompanyMember` using a unique key and a patch. */
  updateCompanyMember?: Maybe<UpdateCompanyMemberPayload>;
  /** Updates a single `CompanyMember` using a unique key and a patch. */
  updateCompanyMemberByMarketIdAndAccountIdAndCompanyId?: Maybe<UpdateCompanyMemberPayload>;
  /** Updates a single `CompanyMember` using its globally unique id and a patch. */
  updateCompanyMemberByNodeId?: Maybe<UpdateCompanyMemberPayload>;
  /** Updates a single `CompanyOperation` using a unique key and a patch. */
  updateCompanyOperation?: Maybe<UpdateCompanyOperationPayload>;
  /** Updates a single `CompanyOperation` using its globally unique id and a patch. */
  updateCompanyOperationByNodeId?: Maybe<UpdateCompanyOperationPayload>;
  /** Updates a single `Course` using a unique key and a patch. */
  updateCourse?: Maybe<UpdateCoursePayload>;
  /** Updates a single `Course` using a unique key and a patch. */
  updateCourseByCourseId?: Maybe<UpdateCoursePayload>;
  /** Updates a single `Course` using its globally unique id and a patch. */
  updateCourseByNodeId?: Maybe<UpdateCoursePayload>;
  /** Updates a single `CourseCatalogue` using a unique key and a patch. */
  updateCourseCatalogue?: Maybe<UpdateCourseCataloguePayload>;
  /** Updates a single `CourseCatalogue` using a unique key and a patch. */
  updateCourseCatalogueByCatalogueIdAndCourseId?: Maybe<UpdateCourseCataloguePayload>;
  /** Updates a single `CourseCatalogue` using its globally unique id and a patch. */
  updateCourseCatalogueByNodeId?: Maybe<UpdateCourseCataloguePayload>;
  /** Updates a single `CourseCatalogueTemp` using a unique key and a patch. */
  updateCourseCatalogueTemp?: Maybe<UpdateCourseCatalogueTempPayload>;
  /** Updates a single `CourseCatalogueTemp` using its globally unique id and a patch. */
  updateCourseCatalogueTempByNodeId?: Maybe<UpdateCourseCatalogueTempPayload>;
  /** Updates a single `CourseEnrollment` using a unique key and a patch. */
  updateCourseEnrollment?: Maybe<UpdateCourseEnrollmentPayload>;
  /** Updates a single `CourseEnrollment` using its globally unique id and a patch. */
  updateCourseEnrollmentByNodeId?: Maybe<UpdateCourseEnrollmentPayload>;
  /** Updates a single `CourseEnrollment` using a unique key and a patch. */
  updateCourseEnrollmentByUserIdAndCourseId?: Maybe<UpdateCourseEnrollmentPayload>;
  /** Updates a single `CourseEnrollmentTemp` using a unique key and a patch. */
  updateCourseEnrollmentTemp?: Maybe<UpdateCourseEnrollmentTempPayload>;
  /** Updates a single `CourseEnrollmentTemp` using its globally unique id and a patch. */
  updateCourseEnrollmentTempByNodeId?: Maybe<UpdateCourseEnrollmentTempPayload>;
  /** Updates a single `CourseSyncConfiguration` using a unique key and a patch. */
  updateCourseSyncConfiguration?: Maybe<UpdateCourseSyncConfigurationPayload>;
  /** Updates a single `CourseSyncConfiguration` using a unique key and a patch. */
  updateCourseSyncConfigurationByConfigName?: Maybe<UpdateCourseSyncConfigurationPayload>;
  /** Updates a single `CourseSyncConfiguration` using its globally unique id and a patch. */
  updateCourseSyncConfigurationByNodeId?: Maybe<UpdateCourseSyncConfigurationPayload>;
  /** Updates a single `CourseTemp` using a unique key and a patch. */
  updateCourseTemp?: Maybe<UpdateCourseTempPayload>;
  /** Updates a single `CourseTemp` using its globally unique id and a patch. */
  updateCourseTempByNodeId?: Maybe<UpdateCourseTempPayload>;
  updateDoceboUser?: Maybe<UserUpdateResponse>;
  /** Updates a single `EvidenceItem` using a unique key and a patch. */
  updateEvidenceItem?: Maybe<UpdateEvidenceItemPayload>;
  /** Updates a single `EvidenceItem` using its globally unique id and a patch. */
  updateEvidenceItemByNodeId?: Maybe<UpdateEvidenceItemPayload>;
  /** Updates a single `Guarantee` using a unique key and a patch. */
  updateGuarantee?: Maybe<UpdateGuaranteePayload>;
  /** Updates a single `Guarantee` using a unique key and a patch. */
  updateGuaranteeByBmiReferenceId?: Maybe<UpdateGuaranteePayload>;
  /** Updates a single `Guarantee` using its globally unique id and a patch. */
  updateGuaranteeByNodeId?: Maybe<UpdateGuaranteePayload>;
  /** Updates a single `Invitation` using a unique key and a patch. */
  updateInvitation?: Maybe<UpdateInvitationPayload>;
  /** Updates a single `Invitation` using its globally unique id and a patch. */
  updateInvitationByNodeId?: Maybe<UpdateInvitationPayload>;
  /** Updates a single `Market` using a unique key and a patch. */
  updateMarket?: Maybe<UpdateMarketPayload>;
  /** Updates a single `Market` using a unique key and a patch. */
  updateMarketByDoceboCatalogueId?: Maybe<UpdateMarketPayload>;
  /** Updates a single `Market` using a unique key and a patch. */
  updateMarketByDomain?: Maybe<UpdateMarketPayload>;
  /** Updates a single `Market` using its globally unique id and a patch. */
  updateMarketByNodeId?: Maybe<UpdateMarketPayload>;
  /** Updates a single `Note` using a unique key and a patch. */
  updateNote?: Maybe<UpdateNotePayload>;
  /** Updates a single `Note` using its globally unique id and a patch. */
  updateNoteByNodeId?: Maybe<UpdateNotePayload>;
  /** Updates a single `Notification` using a unique key and a patch. */
  updateNotification?: Maybe<UpdateNotificationPayload>;
  /** Updates a single `Notification` using its globally unique id and a patch. */
  updateNotificationByNodeId?: Maybe<UpdateNotificationPayload>;
  /** Updates a single `Product` using a unique key and a patch. */
  updateProduct?: Maybe<UpdateProductPayload>;
  /** Updates a single `Product` using a unique key and a patch. */
  updateProductByBmiRef?: Maybe<UpdateProductPayload>;
  /** Updates a single `Product` using its globally unique id and a patch. */
  updateProductByNodeId?: Maybe<UpdateProductPayload>;
  /** Updates a single `Project` using a unique key and a patch. */
  updateProject?: Maybe<UpdateProjectPayload>;
  /** Updates a single `Project` using its globally unique id and a patch. */
  updateProjectByNodeId?: Maybe<UpdateProjectPayload>;
  /** Updates a single `ProjectMember` using a unique key and a patch. */
  updateProjectMember?: Maybe<UpdateProjectMemberPayload>;
  /** Updates a single `ProjectMember` using its globally unique id and a patch. */
  updateProjectMemberByNodeId?: Maybe<UpdateProjectMemberPayload>;
  /** Updates a single `System` using a unique key and a patch. */
  updateSystem?: Maybe<UpdateSystemPayload>;
  /** Updates a single `System` using a unique key and a patch. */
  updateSystemByBmiRef?: Maybe<UpdateSystemPayload>;
  /** Updates a single `System` using its globally unique id and a patch. */
  updateSystemByNodeId?: Maybe<UpdateSystemPayload>;
  /** Updates a single `SystemMember` using a unique key and a patch. */
  updateSystemMember?: Maybe<UpdateSystemMemberPayload>;
  /** Updates a single `SystemMember` using its globally unique id and a patch. */
  updateSystemMemberByNodeId?: Maybe<UpdateSystemMemberPayload>;
  /** Updates a single `SystemMember` using a unique key and a patch. */
  updateSystemMemberBySystemBmiRefAndProductBmiRefAndMarketId?: Maybe<UpdateSystemMemberPayload>;
  updateTraining?: Maybe<Scalars["String"]>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkImportArgs = {
  input: BulkImportInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCompleteInvitationArgs = {
  companyId: Scalars["Int"];
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCourseCatalogueUpdateArgs = {
  input: CourseCatalogueUpdateInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCourseCatalogueUpdateByTempArgs = {
  input: CourseCatalogueUpdateByTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCourseEnrollmentUpdateArgs = {
  input: CourseEnrollmentUpdateInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCourseEnrollmentUpdateByTempArgs = {
  input: CourseEnrollmentUpdateByTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCourseUpdateArgs = {
  input: CourseUpdateInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCourseUpdateByTempArgs = {
  input: CourseUpdateByTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
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
export type MutationCreateCompanyDocumentsArgs = {
  input: CreateCompanyDocumentsInput;
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
export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCourseCatalogueArgs = {
  input: CreateCourseCatalogueInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCourseCatalogueTempArgs = {
  input: CreateCourseCatalogueTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCourseEnrollmentArgs = {
  input: CreateCourseEnrollmentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCourseEnrollmentTempArgs = {
  input: CreateCourseEnrollmentTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCourseSyncConfigurationArgs = {
  input: CreateCourseSyncConfigurationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCourseTempArgs = {
  input: CreateCourseTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateDoceboUserArgs = {
  input?: InputMaybe<UserCreateInput>;
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
export type MutationCreateGuaranteePdfArgs = {
  id: Scalars["Int"];
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
export type MutationCreateSsoUrlArgs = {
  path?: InputMaybe<Scalars["String"]>;
  username: Scalars["String"];
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
export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByDoceboUserIdArgs = {
  input: DeleteAccountByDoceboUserIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByEmailArgs = {
  input: DeleteAccountByEmailInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByNodeIdArgs = {
  input: DeleteAccountByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAddressArgs = {
  input: DeleteAddressInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAddressByNodeIdArgs = {
  input: DeleteAddressByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCertificationArgs = {
  input: DeleteCertificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCertificationByNodeIdArgs = {
  input: DeleteCertificationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyArgs = {
  input: DeleteCompanyInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyByMarketIdAndNameArgs = {
  input: DeleteCompanyByMarketIdAndNameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyByNodeIdArgs = {
  input: DeleteCompanyByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyByReferenceNumberArgs = {
  input: DeleteCompanyByReferenceNumberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyDocumentArgs = {
  input: DeleteCompanyDocumentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyDocumentByNodeIdArgs = {
  input: DeleteCompanyDocumentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyMemberArgs = {
  input: DeleteCompanyMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyMemberByMarketIdAndAccountIdAndCompanyIdArgs =
  {
    input: DeleteCompanyMemberByMarketIdAndAccountIdAndCompanyIdInput;
  };

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyMemberByNodeIdArgs = {
  input: DeleteCompanyMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyOperationArgs = {
  input: DeleteCompanyOperationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyOperationByNodeIdArgs = {
  input: DeleteCompanyOperationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseArgs = {
  input: DeleteCourseInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseByCourseIdArgs = {
  input: DeleteCourseByCourseIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseByNodeIdArgs = {
  input: DeleteCourseByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseCatalogueArgs = {
  input: DeleteCourseCatalogueInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseCatalogueByCatalogueIdAndCourseIdArgs = {
  input: DeleteCourseCatalogueByCatalogueIdAndCourseIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseCatalogueByNodeIdArgs = {
  input: DeleteCourseCatalogueByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseCatalogueTempArgs = {
  input: DeleteCourseCatalogueTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseCatalogueTempByNodeIdArgs = {
  input: DeleteCourseCatalogueTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentArgs = {
  input: DeleteCourseEnrollmentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentByNodeIdArgs = {
  input: DeleteCourseEnrollmentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentByUserIdAndCourseIdArgs = {
  input: DeleteCourseEnrollmentByUserIdAndCourseIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentTempArgs = {
  input: DeleteCourseEnrollmentTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentTempByNodeIdArgs = {
  input: DeleteCourseEnrollmentTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseSyncConfigurationArgs = {
  input: DeleteCourseSyncConfigurationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseSyncConfigurationByConfigNameArgs = {
  input: DeleteCourseSyncConfigurationByConfigNameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseSyncConfigurationByNodeIdArgs = {
  input: DeleteCourseSyncConfigurationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseTempArgs = {
  input: DeleteCourseTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseTempByNodeIdArgs = {
  input: DeleteCourseTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEvidenceItemArgs = {
  input: DeleteEvidenceItemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEvidenceItemByNodeIdArgs = {
  input: DeleteEvidenceItemByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuaranteeArgs = {
  input: DeleteGuaranteeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuaranteeByBmiReferenceIdArgs = {
  input: DeleteGuaranteeByBmiReferenceIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuaranteeByNodeIdArgs = {
  input: DeleteGuaranteeByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvitationArgs = {
  input: DeleteInvitationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvitationByNodeIdArgs = {
  input: DeleteInvitationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMarketArgs = {
  input: DeleteMarketInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMarketByDoceboCatalogueIdArgs = {
  input: DeleteMarketByDoceboCatalogueIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMarketByDomainArgs = {
  input: DeleteMarketByDomainInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMarketByNodeIdArgs = {
  input: DeleteMarketByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNoteArgs = {
  input: DeleteNoteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNoteByNodeIdArgs = {
  input: DeleteNoteByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNotificationArgs = {
  input: DeleteNotificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNotificationByNodeIdArgs = {
  input: DeleteNotificationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProductArgs = {
  input: DeleteProductInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProductByBmiRefArgs = {
  input: DeleteProductByBmiRefInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProductByNodeIdArgs = {
  input: DeleteProductByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectArgs = {
  input: DeleteProjectInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectByNodeIdArgs = {
  input: DeleteProjectByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectMemberArgs = {
  input: DeleteProjectMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectMemberByNodeIdArgs = {
  input: DeleteProjectMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemArgs = {
  input: DeleteSystemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemByBmiRefArgs = {
  input: DeleteSystemByBmiRefInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemByNodeIdArgs = {
  input: DeleteSystemByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemMemberArgs = {
  input: DeleteSystemMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemMemberByNodeIdArgs = {
  input: DeleteSystemMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSystemMemberBySystemBmiRefAndProductBmiRefAndMarketIdArgs =
  {
    input: DeleteSystemMemberBySystemBmiRefAndProductBmiRefAndMarketIdInput;
  };

/** The root mutation type which contains root level fields which mutate data. */
export type MutationEvidenceItemsAddArgs = {
  input: EvidenceItemsAddInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationImportAccountsCompaniesFromCvsArgs = {
  input: ImportAccountsCompaniesFromCsvInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationInviteArgs = {
  input: InviteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationLinkAccountToCompanyArgs = {
  input: LinkAccountToCompanyInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationMarkAllNotificationsAsReadArgs = {
  input: MarkAllNotificationsAsReadInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationProjectMembersAddArgs = {
  input: ProjectMembersAddInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishMessageArgs = {
  input: PublishInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationResetPasswordImportedUsersArgs = {
  input?: InputMaybe<ResetPasswordImportedUsersInput>;
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
export type MutationUpdateAccountByEmailArgs = {
  input: UpdateAccountByEmailInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByNodeIdArgs = {
  input: UpdateAccountByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAddressArgs = {
  input: UpdateAddressInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAddressByNodeIdArgs = {
  input: UpdateAddressByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCertificationArgs = {
  input: UpdateCertificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCertificationByNodeIdArgs = {
  input: UpdateCertificationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyByMarketIdAndNameArgs = {
  input: UpdateCompanyByMarketIdAndNameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyByNodeIdArgs = {
  input: UpdateCompanyByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyByReferenceNumberArgs = {
  input: UpdateCompanyByReferenceNumberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyDocumentArgs = {
  input: UpdateCompanyDocumentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyDocumentByNodeIdArgs = {
  input: UpdateCompanyDocumentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyMemberArgs = {
  input: UpdateCompanyMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyMemberByMarketIdAndAccountIdAndCompanyIdArgs =
  {
    input: UpdateCompanyMemberByMarketIdAndAccountIdAndCompanyIdInput;
  };

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyMemberByNodeIdArgs = {
  input: UpdateCompanyMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyOperationArgs = {
  input: UpdateCompanyOperationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyOperationByNodeIdArgs = {
  input: UpdateCompanyOperationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseArgs = {
  input: UpdateCourseInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseByCourseIdArgs = {
  input: UpdateCourseByCourseIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseByNodeIdArgs = {
  input: UpdateCourseByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseCatalogueArgs = {
  input: UpdateCourseCatalogueInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseCatalogueByCatalogueIdAndCourseIdArgs = {
  input: UpdateCourseCatalogueByCatalogueIdAndCourseIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseCatalogueByNodeIdArgs = {
  input: UpdateCourseCatalogueByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseCatalogueTempArgs = {
  input: UpdateCourseCatalogueTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseCatalogueTempByNodeIdArgs = {
  input: UpdateCourseCatalogueTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentArgs = {
  input: UpdateCourseEnrollmentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentByNodeIdArgs = {
  input: UpdateCourseEnrollmentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentByUserIdAndCourseIdArgs = {
  input: UpdateCourseEnrollmentByUserIdAndCourseIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentTempArgs = {
  input: UpdateCourseEnrollmentTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentTempByNodeIdArgs = {
  input: UpdateCourseEnrollmentTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseSyncConfigurationArgs = {
  input: UpdateCourseSyncConfigurationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseSyncConfigurationByConfigNameArgs = {
  input: UpdateCourseSyncConfigurationByConfigNameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseSyncConfigurationByNodeIdArgs = {
  input: UpdateCourseSyncConfigurationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseTempArgs = {
  input: UpdateCourseTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseTempByNodeIdArgs = {
  input: UpdateCourseTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateDoceboUserArgs = {
  input?: InputMaybe<UserUpdateInput>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEvidenceItemArgs = {
  input: UpdateEvidenceItemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEvidenceItemByNodeIdArgs = {
  input: UpdateEvidenceItemByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuaranteeArgs = {
  input: UpdateGuaranteeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuaranteeByBmiReferenceIdArgs = {
  input: UpdateGuaranteeByBmiReferenceIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuaranteeByNodeIdArgs = {
  input: UpdateGuaranteeByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvitationArgs = {
  input: UpdateInvitationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvitationByNodeIdArgs = {
  input: UpdateInvitationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMarketArgs = {
  input: UpdateMarketInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMarketByDoceboCatalogueIdArgs = {
  input: UpdateMarketByDoceboCatalogueIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMarketByDomainArgs = {
  input: UpdateMarketByDomainInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMarketByNodeIdArgs = {
  input: UpdateMarketByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNoteArgs = {
  input: UpdateNoteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNoteByNodeIdArgs = {
  input: UpdateNoteByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNotificationArgs = {
  input: UpdateNotificationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNotificationByNodeIdArgs = {
  input: UpdateNotificationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProductByBmiRefArgs = {
  input: UpdateProductByBmiRefInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProductByNodeIdArgs = {
  input: UpdateProductByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectByNodeIdArgs = {
  input: UpdateProjectByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectMemberArgs = {
  input: UpdateProjectMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectMemberByNodeIdArgs = {
  input: UpdateProjectMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemArgs = {
  input: UpdateSystemInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemByBmiRefArgs = {
  input: UpdateSystemByBmiRefInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemByNodeIdArgs = {
  input: UpdateSystemByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemMemberArgs = {
  input: UpdateSystemMemberInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemMemberByNodeIdArgs = {
  input: UpdateSystemMemberByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSystemMemberBySystemBmiRefAndProductBmiRefAndMarketIdArgs =
  {
    input: UpdateSystemMemberBySystemBmiRefAndProductBmiRefAndMarketIdInput;
  };

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTrainingArgs = {
  lastUpdateDate?: InputMaybe<Scalars["String"]>;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
};

/** A note added by a BMI admin. It is likely to be either a short note regarding approval, saying something like, Approved, or Good Job, or a note explaining a rejection, saying  something like, The photographs of the roof are not clear enough. */
export type Note = Node & {
  __typename?: "Note";
  /** Reads a single `Account` that is related to this `Note`. */
  author?: Maybe<Account>;
  /** fk */
  authorId?: Maybe<Scalars["Int"]>;
  /** The body of the Note */
  body?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Reads a single `Project` that is related to this `Note`. */
  project?: Maybe<Project>;
  /** fk */
  projectId: Scalars["Int"];
  senderName?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Datetime"];
};

/** Input for the nested mutation of `account` in the `NoteInput` mutation. */
export type NoteAuthorIdFkeyInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<AccountAccountEmailKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<AccountAccountPkeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AccountNodeIdConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<AccountAccountEmailKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<AccountAccountPkeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AccountNodeIdDelete>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<AccountOnNoteForNoteAuthorIdFkeyUsingAccountDoceboUserIdKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<AccountOnNoteForNoteAuthorIdFkeyUsingAccountEmailKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<AccountOnNoteForNoteAuthorIdFkeyUsingAccountPkeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<NoteOnNoteForNoteAuthorIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `note` in the `AccountInput` mutation. */
export type NoteAuthorIdFkeyInverseInput = {
  /** The primary key(s) for `note` for the far side of the relationship. */
  connectById?: InputMaybe<Array<NoteNotePkeyConnect>>;
  /** The primary key(s) for `note` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<NoteNodeIdConnect>>;
  /** A `NoteInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<NoteAuthorIdFkeyNoteCreateInput>>;
  /** The primary key(s) for `note` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<NoteNotePkeyDelete>>;
  /** The primary key(s) for `note` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<NoteNodeIdDelete>>;
  /** Flag indicating whether all other `note` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `note` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<NoteOnNoteForNoteAuthorIdFkeyUsingNotePkeyUpdate>
  >;
  /** The primary key(s) and patch data for `note` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AccountOnNoteForNoteAuthorIdFkeyNodeIdUpdate>
  >;
};

/** The `note` to be created by this mutation. */
export type NoteAuthorIdFkeyNoteCreateInput = {
  accountToAuthorId?: InputMaybe<NoteAuthorIdFkeyInput>;
  /** The body of the Note */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<NoteProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A condition to be used against `Note` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type NoteCondition = {
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `Note` object types. All fields are combined with a logical ‘and.’ */
export type NoteFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<NoteFilter>>;
  /** Filter by the object’s `authorId` field. */
  authorId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<NoteFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<NoteFilter>>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `senderName` field. */
  senderName?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Note` */
export type NoteInput = {
  accountToAuthorId?: InputMaybe<NoteAuthorIdFkeyInput>;
  /** fk */
  authorId?: InputMaybe<Scalars["Int"]>;
  /** The body of the Note */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<NoteProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type NoteNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `note` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type NoteNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `note` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The fields on `note` to look up the row to connect. */
export type NoteNotePkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `note` to look up the row to delete. */
export type NoteNotePkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The globally unique `ID` look up for the row to update. */
export type NoteOnNoteForNoteAuthorIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `account` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `account` being updated. */
  patch: AccountPatch;
};

/** The fields on `note` to look up the row to update. */
export type NoteOnNoteForNoteAuthorIdFkeyUsingNotePkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `note` being updated. */
  patch: UpdateNoteOnNoteForNoteAuthorIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type NoteOnNoteForNoteProjectIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `project` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `project` being updated. */
  patch: ProjectPatch;
};

/** The fields on `note` to look up the row to update. */
export type NoteOnNoteForNoteProjectIdFkeyUsingNotePkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `note` being updated. */
  patch: UpdateNoteOnNoteForNoteProjectIdFkeyPatch;
};

/** Represents an update to a `Note`. Fields that are set will be updated. */
export type NotePatch = {
  accountToAuthorId?: InputMaybe<NoteAuthorIdFkeyInput>;
  /** fk */
  authorId?: InputMaybe<Scalars["Int"]>;
  /** The body of the Note */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<NoteProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `project` in the `NoteInput` mutation. */
export type NoteProjectIdFkeyInput = {
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectById?: InputMaybe<ProjectProjectPkeyConnect>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<ProjectNodeIdConnect>;
  /** A `ProjectInput` object that will be created and connected to this object. */
  create?: InputMaybe<NoteProjectIdFkeyProjectCreateInput>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteById?: InputMaybe<ProjectProjectPkeyDelete>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<ProjectNodeIdDelete>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateById?: InputMaybe<ProjectOnNoteForNoteProjectIdFkeyUsingProjectPkeyUpdate>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<NoteOnNoteForNoteProjectIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `note` in the `ProjectInput` mutation. */
export type NoteProjectIdFkeyInverseInput = {
  /** The primary key(s) for `note` for the far side of the relationship. */
  connectById?: InputMaybe<Array<NoteNotePkeyConnect>>;
  /** The primary key(s) for `note` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<NoteNodeIdConnect>>;
  /** A `NoteInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<NoteProjectIdFkeyNoteCreateInput>>;
  /** The primary key(s) for `note` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<NoteNotePkeyDelete>>;
  /** The primary key(s) for `note` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<NoteNodeIdDelete>>;
  /** Flag indicating whether all other `note` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `note` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<NoteOnNoteForNoteProjectIdFkeyUsingNotePkeyUpdate>
  >;
  /** The primary key(s) and patch data for `note` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<ProjectOnNoteForNoteProjectIdFkeyNodeIdUpdate>
  >;
};

/** The `note` to be created by this mutation. */
export type NoteProjectIdFkeyNoteCreateInput = {
  accountToAuthorId?: InputMaybe<NoteAuthorIdFkeyInput>;
  /** fk */
  authorId?: InputMaybe<Scalars["Int"]>;
  /** The body of the Note */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<NoteProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `project` to be created by this mutation. */
export type NoteProjectIdFkeyProjectCreateInput = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name: Scalars["String"];
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Note` values. */
export type NotesConnection = {
  __typename?: "NotesConnection";
  /** A list of edges which contains the `Note` and cursor to aid in pagination. */
  edges: Array<NotesEdge>;
  /** A list of `Note` objects. */
  nodes: Array<Note>;
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
export type NotesOrderBy =
  | "AUTHOR_ID_ASC"
  | "AUTHOR_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "PROJECT_ID_ASC"
  | "PROJECT_ID_DESC";

/** An internal notification available to an end user */
export type Notification = Node & {
  __typename?: "Notification";
  /** Reads a single `Account` that is related to this `Notification`. */
  account?: Maybe<Account>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** The body of the message */
  body?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Whether the message has been read */
  read: Scalars["Boolean"];
  /** The datetime stamp for when the message was sent */
  sendDate: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
};

/** Input for the nested mutation of `account` in the `NotificationInput` mutation. */
export type NotificationAccountIdFkeyInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<AccountAccountEmailKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<AccountAccountPkeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AccountNodeIdConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<AccountAccountEmailKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<AccountAccountPkeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AccountNodeIdDelete>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<AccountOnNotificationForNotificationAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<AccountOnNotificationForNotificationAccountIdFkeyUsingAccountEmailKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<AccountOnNotificationForNotificationAccountIdFkeyUsingAccountPkeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<NotificationOnNotificationForNotificationAccountIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `notification` in the `AccountInput` mutation. */
export type NotificationAccountIdFkeyInverseInput = {
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectById?: InputMaybe<Array<NotificationNotificationPkeyConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<NotificationNodeIdConnect>>;
  /** A `NotificationInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<NotificationAccountIdFkeyNotificationCreateInput>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<NotificationNotificationPkeyDelete>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<NotificationNodeIdDelete>>;
  /** Flag indicating whether all other `notification` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<NotificationOnNotificationForNotificationAccountIdFkeyUsingNotificationPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AccountOnNotificationForNotificationAccountIdFkeyNodeIdUpdate>
  >;
};

/** The `notification` to be created by this mutation. */
export type NotificationAccountIdFkeyNotificationCreateInput = {
  accountToAccountId?: InputMaybe<NotificationAccountIdFkeyInput>;
  /** The body of the message */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Whether the message has been read */
  read?: InputMaybe<Scalars["Boolean"]>;
  /** The datetime stamp for when the message was sent */
  sendDate: Scalars["Datetime"];
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/**
 * A condition to be used against `Notification` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type NotificationCondition = {
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `Notification` object types. All fields are combined with a logical ‘and.’ */
export type NotificationFilter = {
  /** Filter by the object’s `accountId` field. */
  accountId?: InputMaybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<NotificationFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<NotificationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<NotificationFilter>>;
};

/** An input for mutations affecting `Notification` */
export type NotificationInput = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<NotificationAccountIdFkeyInput>;
  /** The body of the message */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Whether the message has been read */
  read?: InputMaybe<Scalars["Boolean"]>;
  /** The datetime stamp for when the message was sent */
  sendDate: Scalars["Datetime"];
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type NotificationNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `notification` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type NotificationNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `notification` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The fields on `notification` to look up the row to connect. */
export type NotificationNotificationPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `notification` to look up the row to delete. */
export type NotificationNotificationPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The globally unique `ID` look up for the row to update. */
export type NotificationOnNotificationForNotificationAccountIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `account` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: AccountPatch;
  };

/** The fields on `notification` to look up the row to update. */
export type NotificationOnNotificationForNotificationAccountIdFkeyUsingNotificationPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `notification` being updated. */
    patch: UpdateNotificationOnNotificationForNotificationAccountIdFkeyPatch;
  };

/** Represents an update to a `Notification`. Fields that are set will be updated. */
export type NotificationPatch = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<NotificationAccountIdFkeyInput>;
  /** The body of the message */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Whether the message has been read */
  read?: InputMaybe<Scalars["Boolean"]>;
  /** The datetime stamp for when the message was sent */
  sendDate?: InputMaybe<Scalars["Datetime"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Notification` values. */
export type NotificationsConnection = {
  __typename?: "NotificationsConnection";
  /** A list of edges which contains the `Notification` and cursor to aid in pagination. */
  edges: Array<NotificationsEdge>;
  /** A list of `Notification` objects. */
  nodes: Array<Notification>;
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
export type NotificationsOrderBy =
  | "ACCOUNT_ID_ASC"
  | "ACCOUNT_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

export type Operation =
  | "BITUMEN"
  | "COATER"
  | "FLAT"
  | "GREEN"
  | "PITCHED"
  | "SOLAR"
  | "TILE";

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: "PageInfo";
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["Cursor"]>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["Cursor"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/partnerBrand) */
export type PartnerBrand = Entry & {
  __typename?: "PartnerBrand";
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<PartnerBrandDescription>;
  image?: Maybe<Asset>;
  linkedFrom?: Maybe<PartnerBrandLinkingCollections>;
  logo?: Maybe<Asset>;
  name?: Maybe<Scalars["String"]>;
  shortDescription?: Maybe<Scalars["String"]>;
  sys: Sys;
  websiteUrl?: Maybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/partnerBrand) */
export type PartnerBrandDescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/partnerBrand) */
export type PartnerBrandImageArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/partnerBrand) */
export type PartnerBrandLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/partnerBrand) */
export type PartnerBrandLogoArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/partnerBrand) */
export type PartnerBrandNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/partnerBrand) */
export type PartnerBrandShortDescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/partnerBrand) */
export type PartnerBrandWebsiteUrlArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type PartnerBrandCollection = {
  __typename?: "PartnerBrandCollection";
  items: Array<Maybe<PartnerBrand>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type PartnerBrandDescription = {
  __typename?: "PartnerBrandDescription";
  json: Scalars["JSON"];
  links: PartnerBrandDescriptionLinks;
};

export type PartnerBrandDescriptionAssets = {
  __typename?: "PartnerBrandDescriptionAssets";
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type PartnerBrandDescriptionEntries = {
  __typename?: "PartnerBrandDescriptionEntries";
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type PartnerBrandDescriptionLinks = {
  __typename?: "PartnerBrandDescriptionLinks";
  assets: PartnerBrandDescriptionAssets;
  entries: PartnerBrandDescriptionEntries;
};

export type PartnerBrandFilter = {
  AND?: InputMaybe<Array<InputMaybe<PartnerBrandFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<PartnerBrandFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description_contains?: InputMaybe<Scalars["String"]>;
  description_exists?: InputMaybe<Scalars["Boolean"]>;
  description_not_contains?: InputMaybe<Scalars["String"]>;
  image_exists?: InputMaybe<Scalars["Boolean"]>;
  logo_exists?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_exists?: InputMaybe<Scalars["Boolean"]>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  shortDescription?: InputMaybe<Scalars["String"]>;
  shortDescription_contains?: InputMaybe<Scalars["String"]>;
  shortDescription_exists?: InputMaybe<Scalars["Boolean"]>;
  shortDescription_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  shortDescription_not?: InputMaybe<Scalars["String"]>;
  shortDescription_not_contains?: InputMaybe<Scalars["String"]>;
  shortDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
  websiteUrl?: InputMaybe<Scalars["String"]>;
  websiteUrl_contains?: InputMaybe<Scalars["String"]>;
  websiteUrl_exists?: InputMaybe<Scalars["Boolean"]>;
  websiteUrl_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  websiteUrl_not?: InputMaybe<Scalars["String"]>;
  websiteUrl_not_contains?: InputMaybe<Scalars["String"]>;
  websiteUrl_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type PartnerBrandLinkingCollections = {
  __typename?: "PartnerBrandLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  marketContentCollection?: Maybe<MarketContentCollection>;
};

export type PartnerBrandLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type PartnerBrandLinkingCollectionsMarketContentCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type PartnerBrandOrder =
  | "name_ASC"
  | "name_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC"
  | "websiteUrl_ASC"
  | "websiteUrl_DESC";

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
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
  /** The Products brand */
  brand: Scalars["String"];
  createdAt: Scalars["Datetime"];
  /** A description of the Product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family: Scalars["String"];
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByProductBmiRef: GuaranteesConnection;
  /** Primary key */
  id: Scalars["Int"];
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** fk */
  marketId: Scalars["Int"];
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the Product */
  name: Scalars["String"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Whether the Product is avialable for new guarantees */
  published: Scalars["Boolean"];
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembersByProductBmiRef: SystemMembersConnection;
  /** ek */
  technology: Technology;
  updatedAt: Scalars["Datetime"];
};

/** A product made by BMI */
export type ProductGuaranteesByProductBmiRefArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<GuaranteeCondition>;
  filter?: InputMaybe<GuaranteeFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** A product made by BMI */
export type ProductSystemMembersByProductBmiRefArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<SystemMemberCondition>;
  filter?: InputMaybe<SystemMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<SystemMembersOrderBy>>;
};

/** A condition to be used against `Product` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProductCondition = {
  /** Checks for equality with the object’s `bmiRef` field. */
  bmiRef?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars["String"]>;
};

/** A filter to be used against `Product` object types. All fields are combined with a logical ‘and.’ */
export type ProductFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProductFilter>>;
  /** Filter by the object’s `bmiRef` field. */
  bmiRef?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `marketId` field. */
  marketId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProductFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProductFilter>>;
};

/** An input for mutations affecting `Product` */
export type ProductInput = {
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
  /** The Products brand */
  brand: Scalars["String"];
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description of the Product */
  description?: InputMaybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family: Scalars["String"];
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<ProductMarketIdFkeyInput>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the Product */
  name: Scalars["String"];
  /** Whether the Product is avialable for new guarantees */
  published: Scalars["Boolean"];
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInverseInput>;
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `market` in the `ProductInput` mutation. */
export type ProductMarketIdFkeyInput = {
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDomain?: InputMaybe<MarketMarketDomainKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectById?: InputMaybe<MarketMarketPkeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<MarketNodeIdConnect>;
  /** A `MarketInput` object that will be created and connected to this object. */
  create?: InputMaybe<ProductMarketIdFkeyMarketCreateInput>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDomain?: InputMaybe<MarketMarketDomainKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteById?: InputMaybe<MarketMarketPkeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<MarketNodeIdDelete>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDoceboCatalogueId?: InputMaybe<MarketOnProductForProductMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDomain?: InputMaybe<MarketOnProductForProductMarketIdFkeyUsingMarketDomainKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateById?: InputMaybe<MarketOnProductForProductMarketIdFkeyUsingMarketPkeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<ProductOnProductForProductMarketIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `product` in the `MarketInput` mutation. */
export type ProductMarketIdFkeyInverseInput = {
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectByBmiRef?: InputMaybe<Array<ProductProductBmiRefKeyConnect>>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectById?: InputMaybe<Array<ProductProductPkeyConnect>>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<ProductNodeIdConnect>>;
  /** A `ProductInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<ProductMarketIdFkeyProductCreateInput>>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteByBmiRef?: InputMaybe<Array<ProductProductBmiRefKeyDelete>>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<ProductProductPkeyDelete>>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<ProductNodeIdDelete>>;
  /** Flag indicating whether all other `product` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateByBmiRef?: InputMaybe<
    Array<ProductOnProductForProductMarketIdFkeyUsingProductBmiRefKeyUpdate>
  >;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<ProductOnProductForProductMarketIdFkeyUsingProductPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<MarketOnProductForProductMarketIdFkeyNodeIdUpdate>
  >;
};

/** The `market` to be created by this mutation. */
export type ProductMarketIdFkeyMarketCreateInput = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language: Language;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `product` to be created by this mutation. */
export type ProductMarketIdFkeyProductCreateInput = {
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
  /** The Products brand */
  brand: Scalars["String"];
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description of the Product */
  description?: InputMaybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family: Scalars["String"];
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<ProductMarketIdFkeyInput>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the Product */
  name: Scalars["String"];
  /** Whether the Product is avialable for new guarantees */
  published: Scalars["Boolean"];
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInverseInput>;
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type ProductNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `product` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type ProductNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `product` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type ProductOnGuaranteeForGuaranteeProductBmiRefFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `guarantee` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `guarantee` being updated. */
  patch: GuaranteePatch;
};

/** The fields on `product` to look up the row to update. */
export type ProductOnGuaranteeForGuaranteeProductBmiRefFkeyUsingProductBmiRefKeyUpdate =
  {
    /** A unique reference for the product known to BMI */
    bmiRef: Scalars["String"];
    /** An object where the defined keys will be set on the `product` being updated. */
    patch: UpdateProductOnGuaranteeForGuaranteeProductBmiRefFkeyPatch;
  };

/** The fields on `product` to look up the row to update. */
export type ProductOnGuaranteeForGuaranteeProductBmiRefFkeyUsingProductPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `product` being updated. */
    patch: UpdateProductOnGuaranteeForGuaranteeProductBmiRefFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type ProductOnProductForProductMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `market` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: MarketPatch;
};

/** The fields on `product` to look up the row to update. */
export type ProductOnProductForProductMarketIdFkeyUsingProductBmiRefKeyUpdate =
  {
    /** A unique reference for the product known to BMI */
    bmiRef: Scalars["String"];
    /** An object where the defined keys will be set on the `product` being updated. */
    patch: UpdateProductOnProductForProductMarketIdFkeyPatch;
  };

/** The fields on `product` to look up the row to update. */
export type ProductOnProductForProductMarketIdFkeyUsingProductPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `product` being updated. */
  patch: UpdateProductOnProductForProductMarketIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type ProductOnSystemMemberForSystemMemberProductBmiRefFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `systemMember` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `systemMember` being updated. */
    patch: SystemMemberPatch;
  };

/** The fields on `product` to look up the row to update. */
export type ProductOnSystemMemberForSystemMemberProductBmiRefFkeyUsingProductBmiRefKeyUpdate =
  {
    /** A unique reference for the product known to BMI */
    bmiRef: Scalars["String"];
    /** An object where the defined keys will be set on the `product` being updated. */
    patch: UpdateProductOnSystemMemberForSystemMemberProductBmiRefFkeyPatch;
  };

/** The fields on `product` to look up the row to update. */
export type ProductOnSystemMemberForSystemMemberProductBmiRefFkeyUsingProductPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `product` being updated. */
    patch: UpdateProductOnSystemMemberForSystemMemberProductBmiRefFkeyPatch;
  };

/** Represents an update to a `Product`. Fields that are set will be updated. */
export type ProductPatch = {
  /** A unique reference for the product known to BMI */
  bmiRef?: InputMaybe<Scalars["String"]>;
  /** The Products brand */
  brand?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description of the Product */
  description?: InputMaybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<ProductMarketIdFkeyInput>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Product */
  name?: InputMaybe<Scalars["String"]>;
  /** Whether the Product is avialable for new guarantees */
  published?: InputMaybe<Scalars["Boolean"]>;
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInverseInput>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The fields on `product` to look up the row to connect. */
export type ProductProductBmiRefKeyConnect = {
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
};

/** The fields on `product` to look up the row to delete. */
export type ProductProductBmiRefKeyDelete = {
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
};

/** The fields on `product` to look up the row to connect. */
export type ProductProductPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `product` to look up the row to delete. */
export type ProductProductPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** A connection to a list of `Product` values. */
export type ProductsConnection = {
  __typename?: "ProductsConnection";
  /** A list of edges which contains the `Product` and cursor to aid in pagination. */
  edges: Array<ProductsEdge>;
  /** A list of `Product` objects. */
  nodes: Array<Product>;
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
export type ProductsOrderBy =
  | "BMI_REF_ASC"
  | "BMI_REF_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "NAME_ASC"
  | "NAME_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type Project = Node & {
  __typename?: "Project";
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
  /** fk */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  /** fk */
  companyId: Scalars["Int"];
  createdAt: Scalars["Datetime"];
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: Maybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  /** Reads and enables pagination through a set of `EvidenceItem`. */
  evidenceItems: EvidenceItemsConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guarantees: GuaranteesConnection;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: Maybe<Scalars["Boolean"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** Short name for the Project */
  name: Scalars["String"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Reads and enables pagination through a set of `Note`. */
  notes: NotesConnection;
  /** Reads and enables pagination through a set of `ProjectMember`. */
  projectMembers: ProjectMembersConnection;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
  /** fk */
  siteAddressId?: Maybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt: Scalars["Datetime"];
};

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type ProjectEvidenceItemsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<EvidenceItemCondition>;
  filter?: InputMaybe<EvidenceItemFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<EvidenceItemsOrderBy>>;
};

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type ProjectGuaranteesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<GuaranteeCondition>;
  filter?: InputMaybe<GuaranteeFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type ProjectNotesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<NoteCondition>;
  filter?: InputMaybe<NoteFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
};

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type ProjectProjectMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProjectMemberCondition>;
  filter?: InputMaybe<ProjectMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProjectMembersOrderBy>>;
};

/** The `address` to be created by this mutation. */
export type ProjectBuildingOwnerAddressIdFkeyAddressCreateInput = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `address` in the `ProjectInput` mutation. */
export type ProjectBuildingOwnerAddressIdFkeyInput = {
  /** The primary key(s) for `address` for the far side of the relationship. */
  connectById?: InputMaybe<AddressAddressPkeyConnect>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AddressNodeIdConnect>;
  /** A `AddressInput` object that will be created and connected to this object. */
  create?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyAddressCreateInput>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  deleteById?: InputMaybe<AddressAddressPkeyDelete>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AddressNodeIdDelete>;
  /** The primary key(s) and patch data for `address` for the far side of the relationship. */
  updateById?: InputMaybe<AddressOnProjectForProjectBuildingOwnerAddressIdFkeyUsingAddressPkeyUpdate>;
  /** The primary key(s) and patch data for `address` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<ProjectOnProjectForProjectBuildingOwnerAddressIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `project` in the `AddressInput` mutation. */
export type ProjectBuildingOwnerAddressIdFkeyInverseInput = {
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectById?: InputMaybe<Array<ProjectProjectPkeyConnect>>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<ProjectNodeIdConnect>>;
  /** A `ProjectInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<ProjectBuildingOwnerAddressIdFkeyProjectCreateInput>
  >;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<ProjectProjectPkeyDelete>>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<ProjectNodeIdDelete>>;
  /** Flag indicating whether all other `project` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<ProjectOnProjectForProjectBuildingOwnerAddressIdFkeyUsingProjectPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AddressOnProjectForProjectBuildingOwnerAddressIdFkeyNodeIdUpdate>
  >;
};

/** The `project` to be created by this mutation. */
export type ProjectBuildingOwnerAddressIdFkeyProjectCreateInput = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name: Scalars["String"];
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `company` in the `ProjectInput` mutation. */
export type ProjectCompanyIdFkeyInput = {
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectById?: InputMaybe<CompanyCompanyPkeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<CompanyNodeIdConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  connectByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyConnect>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteById?: InputMaybe<CompanyCompanyPkeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByMarketIdAndName?: InputMaybe<CompanyCompanyMarketIdNameKeyDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<CompanyNodeIdDelete>;
  /** The primary key(s) for `company` for the far side of the relationship. */
  deleteByReferenceNumber?: InputMaybe<CompanyCompanyReferenceNumberKeyDelete>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateById?: InputMaybe<CompanyOnProjectForProjectCompanyIdFkeyUsingCompanyPkeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByMarketIdAndName?: InputMaybe<CompanyOnProjectForProjectCompanyIdFkeyUsingCompanyMarketIdNameKeyUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<ProjectOnProjectForProjectCompanyIdFkeyNodeIdUpdate>;
  /** The primary key(s) and patch data for `company` for the far side of the relationship. */
  updateByReferenceNumber?: InputMaybe<CompanyOnProjectForProjectCompanyIdFkeyUsingCompanyReferenceNumberKeyUpdate>;
};

/** Input for the nested mutation of `project` in the `CompanyInput` mutation. */
export type ProjectCompanyIdFkeyInverseInput = {
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectById?: InputMaybe<Array<ProjectProjectPkeyConnect>>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<ProjectNodeIdConnect>>;
  /** A `ProjectInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<ProjectCompanyIdFkeyProjectCreateInput>>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<ProjectProjectPkeyDelete>>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<ProjectNodeIdDelete>>;
  /** Flag indicating whether all other `project` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<ProjectOnProjectForProjectCompanyIdFkeyUsingProjectPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<CompanyOnProjectForProjectCompanyIdFkeyNodeIdUpdate>
  >;
};

/** The `project` to be created by this mutation. */
export type ProjectCompanyIdFkeyProjectCreateInput = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name: Scalars["String"];
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A condition to be used against `Project` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProjectCondition = {
  /** Checks for equality with the object’s `buildingOwnerAddressId` field. */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `siteAddressId` field. */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `Project` object types. All fields are combined with a logical ‘and.’ */
export type ProjectFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProjectFilter>>;
  /** Filter by the object’s `buildingOwnerAddressId` field. */
  buildingOwnerAddressId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `companyId` field. */
  companyId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProjectFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProjectFilter>>;
  /** Filter by the object’s `siteAddressId` field. */
  siteAddressId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `Project` */
export type ProjectInput = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name: Scalars["String"];
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** People who are on a Project */
export type ProjectMember = Node & {
  __typename?: "ProjectMember";
  /** Reads a single `Account` that is related to this `ProjectMember`. */
  account?: Maybe<Account>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** The responsible installer */
  isResponsibleInstaller?: Maybe<Scalars["Boolean"]>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Reads a single `Project` that is related to this `ProjectMember`. */
  project?: Maybe<Project>;
  /** fk */
  projectId: Scalars["Int"];
  updatedAt: Scalars["Datetime"];
};

/** Input for the nested mutation of `account` in the `ProjectMemberInput` mutation. */
export type ProjectMemberAccountIdFkeyInput = {
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByEmail?: InputMaybe<AccountAccountEmailKeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectById?: InputMaybe<AccountAccountPkeyConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AccountNodeIdConnect>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByDoceboUserId?: InputMaybe<AccountAccountDoceboUserIdKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByEmail?: InputMaybe<AccountAccountEmailKeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteById?: InputMaybe<AccountAccountPkeyDelete>;
  /** The primary key(s) for `account` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AccountNodeIdDelete>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByDoceboUserId?: InputMaybe<AccountOnProjectMemberForProjectMemberAccountIdFkeyUsingAccountDoceboUserIdKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByEmail?: InputMaybe<AccountOnProjectMemberForProjectMemberAccountIdFkeyUsingAccountEmailKeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateById?: InputMaybe<AccountOnProjectMemberForProjectMemberAccountIdFkeyUsingAccountPkeyUpdate>;
  /** The primary key(s) and patch data for `account` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<ProjectMemberOnProjectMemberForProjectMemberAccountIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `projectMember` in the `AccountInput` mutation. */
export type ProjectMemberAccountIdFkeyInverseInput = {
  /** The primary key(s) for `projectMember` for the far side of the relationship. */
  connectById?: InputMaybe<Array<ProjectMemberProjectMemberPkeyConnect>>;
  /** The primary key(s) for `projectMember` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<ProjectMemberNodeIdConnect>>;
  /** A `ProjectMemberInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<ProjectMemberAccountIdFkeyProjectMemberCreateInput>
  >;
  /** The primary key(s) for `projectMember` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<ProjectMemberProjectMemberPkeyDelete>>;
  /** The primary key(s) for `projectMember` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<ProjectMemberNodeIdDelete>>;
  /** Flag indicating whether all other `projectMember` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `projectMember` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<ProjectMemberOnProjectMemberForProjectMemberAccountIdFkeyUsingProjectMemberPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `projectMember` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AccountOnProjectMemberForProjectMemberAccountIdFkeyNodeIdUpdate>
  >;
};

/** The `projectMember` to be created by this mutation. */
export type ProjectMemberAccountIdFkeyProjectMemberCreateInput = {
  accountToAccountId?: InputMaybe<ProjectMemberAccountIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** The responsible installer */
  isResponsibleInstaller?: InputMaybe<Scalars["Boolean"]>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<ProjectMemberProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/**
 * A condition to be used against `ProjectMember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ProjectMemberCondition = {
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `isResponsibleInstaller` field. */
  isResponsibleInstaller?: InputMaybe<Scalars["Boolean"]>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars["Int"]>;
};

/** A filter to be used against `ProjectMember` object types. All fields are combined with a logical ‘and.’ */
export type ProjectMemberFilter = {
  /** Filter by the object’s `accountId` field. */
  accountId?: InputMaybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProjectMemberFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `isResponsibleInstaller` field. */
  isResponsibleInstaller?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProjectMemberFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProjectMemberFilter>>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `ProjectMember` */
export type ProjectMemberInput = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<ProjectMemberAccountIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** The responsible installer */
  isResponsibleInstaller?: InputMaybe<Scalars["Boolean"]>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<ProjectMemberProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type ProjectMemberNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `projectMember` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type ProjectMemberNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `projectMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type ProjectMemberOnProjectMemberForProjectMemberAccountIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `account` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `account` being updated. */
    patch: AccountPatch;
  };

/** The fields on `projectMember` to look up the row to update. */
export type ProjectMemberOnProjectMemberForProjectMemberAccountIdFkeyUsingProjectMemberPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `projectMember` being updated. */
    patch: UpdateProjectMemberOnProjectMemberForProjectMemberAccountIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type ProjectMemberOnProjectMemberForProjectMemberProjectIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `project` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `project` being updated. */
    patch: ProjectPatch;
  };

/** The fields on `projectMember` to look up the row to update. */
export type ProjectMemberOnProjectMemberForProjectMemberProjectIdFkeyUsingProjectMemberPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `projectMember` being updated. */
    patch: UpdateProjectMemberOnProjectMemberForProjectMemberProjectIdFkeyPatch;
  };

/** Represents an update to a `ProjectMember`. Fields that are set will be updated. */
export type ProjectMemberPatch = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<ProjectMemberAccountIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** The responsible installer */
  isResponsibleInstaller?: InputMaybe<Scalars["Boolean"]>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<ProjectMemberProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `project` in the `ProjectMemberInput` mutation. */
export type ProjectMemberProjectIdFkeyInput = {
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectById?: InputMaybe<ProjectProjectPkeyConnect>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<ProjectNodeIdConnect>;
  /** A `ProjectInput` object that will be created and connected to this object. */
  create?: InputMaybe<ProjectMemberProjectIdFkeyProjectCreateInput>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteById?: InputMaybe<ProjectProjectPkeyDelete>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<ProjectNodeIdDelete>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateById?: InputMaybe<ProjectOnProjectMemberForProjectMemberProjectIdFkeyUsingProjectPkeyUpdate>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<ProjectMemberOnProjectMemberForProjectMemberProjectIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `projectMember` in the `ProjectInput` mutation. */
export type ProjectMemberProjectIdFkeyInverseInput = {
  /** The primary key(s) for `projectMember` for the far side of the relationship. */
  connectById?: InputMaybe<Array<ProjectMemberProjectMemberPkeyConnect>>;
  /** The primary key(s) for `projectMember` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<ProjectMemberNodeIdConnect>>;
  /** A `ProjectMemberInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<ProjectMemberProjectIdFkeyProjectMemberCreateInput>
  >;
  /** The primary key(s) for `projectMember` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<ProjectMemberProjectMemberPkeyDelete>>;
  /** The primary key(s) for `projectMember` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<ProjectMemberNodeIdDelete>>;
  /** Flag indicating whether all other `projectMember` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `projectMember` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<ProjectMemberOnProjectMemberForProjectMemberProjectIdFkeyUsingProjectMemberPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `projectMember` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<ProjectOnProjectMemberForProjectMemberProjectIdFkeyNodeIdUpdate>
  >;
};

/** The `project` to be created by this mutation. */
export type ProjectMemberProjectIdFkeyProjectCreateInput = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name: Scalars["String"];
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `projectMember` to be created by this mutation. */
export type ProjectMemberProjectIdFkeyProjectMemberCreateInput = {
  /** fk */
  accountId?: InputMaybe<Scalars["Int"]>;
  accountToAccountId?: InputMaybe<ProjectMemberAccountIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** The responsible installer */
  isResponsibleInstaller?: InputMaybe<Scalars["Boolean"]>;
  projectToProjectId?: InputMaybe<ProjectMemberProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The fields on `projectMember` to look up the row to connect. */
export type ProjectMemberProjectMemberPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `projectMember` to look up the row to delete. */
export type ProjectMemberProjectMemberPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** All input for the `projectMembersAdd` mutation. */
export type ProjectMembersAddInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  members: Array<InputMaybe<ProjectMemberInput>>;
};

/** The output of our `projectMembersAdd` mutation. */
export type ProjectMembersAddPayload = {
  __typename?: "ProjectMembersAddPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  projectMembers?: Maybe<Array<ProjectMember>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** A connection to a list of `ProjectMember` values. */
export type ProjectMembersConnection = {
  __typename?: "ProjectMembersConnection";
  /** A list of edges which contains the `ProjectMember` and cursor to aid in pagination. */
  edges: Array<ProjectMembersEdge>;
  /** A list of `ProjectMember` objects. */
  nodes: Array<ProjectMember>;
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
export type ProjectMembersOrderBy =
  | "ACCOUNT_ID_ASC"
  | "ACCOUNT_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "IS_RESPONSIBLE_INSTALLER_ASC"
  | "IS_RESPONSIBLE_INSTALLER_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "PROJECT_ID_ASC"
  | "PROJECT_ID_DESC";

/** The globally unique `ID` look up for the row to connect. */
export type ProjectNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `project` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type ProjectNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `project` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type ProjectOnEvidenceItemForEvidenceItemProjectIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `evidenceItem` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `evidenceItem` being updated. */
  patch: EvidenceItemPatch;
};

/** The fields on `project` to look up the row to update. */
export type ProjectOnEvidenceItemForEvidenceItemProjectIdFkeyUsingProjectPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `project` being updated. */
    patch: UpdateProjectOnEvidenceItemForEvidenceItemProjectIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type ProjectOnGuaranteeForGuaranteeProjectIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `guarantee` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `guarantee` being updated. */
  patch: GuaranteePatch;
};

/** The fields on `project` to look up the row to update. */
export type ProjectOnGuaranteeForGuaranteeProjectIdFkeyUsingProjectPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `project` being updated. */
    patch: UpdateProjectOnGuaranteeForGuaranteeProjectIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type ProjectOnNoteForNoteProjectIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `note` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `note` being updated. */
  patch: NotePatch;
};

/** The fields on `project` to look up the row to update. */
export type ProjectOnNoteForNoteProjectIdFkeyUsingProjectPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `project` being updated. */
  patch: UpdateProjectOnNoteForNoteProjectIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type ProjectOnProjectForProjectBuildingOwnerAddressIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `address` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `address` being updated. */
  patch: AddressPatch;
};

/** The fields on `project` to look up the row to update. */
export type ProjectOnProjectForProjectBuildingOwnerAddressIdFkeyUsingProjectPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `project` being updated. */
    patch: UpdateProjectOnProjectForProjectBuildingOwnerAddressIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type ProjectOnProjectForProjectCompanyIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `company` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `company` being updated. */
  patch: CompanyPatch;
};

/** The fields on `project` to look up the row to update. */
export type ProjectOnProjectForProjectCompanyIdFkeyUsingProjectPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `project` being updated. */
  patch: UpdateProjectOnProjectForProjectCompanyIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type ProjectOnProjectForProjectSiteAddressIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `address` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `address` being updated. */
  patch: AddressPatch;
};

/** The fields on `project` to look up the row to update. */
export type ProjectOnProjectForProjectSiteAddressIdFkeyUsingProjectPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `project` being updated. */
    patch: UpdateProjectOnProjectForProjectSiteAddressIdFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type ProjectOnProjectMemberForProjectMemberProjectIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `projectMember` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `projectMember` being updated. */
  patch: ProjectMemberPatch;
};

/** The fields on `project` to look up the row to update. */
export type ProjectOnProjectMemberForProjectMemberProjectIdFkeyUsingProjectPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `project` being updated. */
    patch: UpdateProjectOnProjectMemberForProjectMemberProjectIdFkeyPatch;
  };

/** Represents an update to a `Project`. Fields that are set will be updated. */
export type ProjectPatch = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea?: InputMaybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The fields on `project` to look up the row to connect. */
export type ProjectProjectPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `project` to look up the row to delete. */
export type ProjectProjectPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The `address` to be created by this mutation. */
export type ProjectSiteAddressIdFkeyAddressCreateInput = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `address` in the `ProjectInput` mutation. */
export type ProjectSiteAddressIdFkeyInput = {
  /** The primary key(s) for `address` for the far side of the relationship. */
  connectById?: InputMaybe<AddressAddressPkeyConnect>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<AddressNodeIdConnect>;
  /** A `AddressInput` object that will be created and connected to this object. */
  create?: InputMaybe<ProjectSiteAddressIdFkeyAddressCreateInput>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  deleteById?: InputMaybe<AddressAddressPkeyDelete>;
  /** The primary key(s) for `address` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<AddressNodeIdDelete>;
  /** The primary key(s) and patch data for `address` for the far side of the relationship. */
  updateById?: InputMaybe<AddressOnProjectForProjectSiteAddressIdFkeyUsingAddressPkeyUpdate>;
  /** The primary key(s) and patch data for `address` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<ProjectOnProjectForProjectSiteAddressIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `project` in the `AddressInput` mutation. */
export type ProjectSiteAddressIdFkeyInverseInput = {
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectById?: InputMaybe<Array<ProjectProjectPkeyConnect>>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<ProjectNodeIdConnect>>;
  /** A `ProjectInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<ProjectSiteAddressIdFkeyProjectCreateInput>>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<ProjectProjectPkeyDelete>>;
  /** The primary key(s) for `project` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<ProjectNodeIdDelete>>;
  /** Flag indicating whether all other `project` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<ProjectOnProjectForProjectSiteAddressIdFkeyUsingProjectPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `project` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<AddressOnProjectForProjectSiteAddressIdFkeyNodeIdUpdate>
  >;
};

/** The `project` to be created by this mutation. */
export type ProjectSiteAddressIdFkeyProjectCreateInput = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate: Scalars["Datetime"];
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name: Scalars["String"];
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea: Scalars["Int"];
  /** The date that the Project officially starts or started */
  startDate: Scalars["Datetime"];
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Project` values. */
export type ProjectsConnection = {
  __typename?: "ProjectsConnection";
  /** A list of edges which contains the `Project` and cursor to aid in pagination. */
  edges: Array<ProjectsEdge>;
  /** A list of `Project` objects. */
  nodes: Array<Project>;
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
export type ProjectsOrderBy =
  | "BUILDING_OWNER_ADDRESS_ID_ASC"
  | "BUILDING_OWNER_ADDRESS_ID_DESC"
  | "COMPANY_ID_ASC"
  | "COMPANY_ID_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "SITE_ADDRESS_ID_ASC"
  | "SITE_ADDRESS_ID_DESC";

export type Publish = {
  __typename?: "Publish";
  email?: Maybe<Scalars["String"]>;
  html?: Maybe<Scalars["String"]>;
  text?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
};

export type PublishInput = {
  email?: InputMaybe<Scalars["String"]>;
  html?: InputMaybe<Scalars["String"]>;
  text?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type PublishOutput = {
  __typename?: "PublishOutput";
  messageId?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: "Query";
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
  account?: Maybe<Account>;
  accountByDoceboUserId?: Maybe<Account>;
  accountByEmail?: Maybe<Account>;
  /** Reads a single `Account` using its globally unique `ID`. */
  accountByNodeId?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Account`. */
  accounts?: Maybe<AccountsConnection>;
  address?: Maybe<Address>;
  /** Reads a single `Address` using its globally unique `ID`. */
  addressByNodeId?: Maybe<Address>;
  /** Reads and enables pagination through a set of `Address`. */
  addresses?: Maybe<AddressesConnection>;
  asset?: Maybe<Asset>;
  assetCollection?: Maybe<AssetCollection>;
  carousel?: Maybe<Carousel>;
  carouselCollection?: Maybe<CarouselCollection>;
  carouselItem?: Maybe<CarouselItem>;
  carouselItemCollection?: Maybe<CarouselItemCollection>;
  certification?: Maybe<Certification>;
  /** Reads a single `Certification` using its globally unique `ID`. */
  certificationByNodeId?: Maybe<Certification>;
  /** Reads and enables pagination through a set of `Certification`. */
  certifications?: Maybe<CertificationsConnection>;
  checkUserValidatiy?: Maybe<CheckUserValidityPayload>;
  /** Reads and enables pagination through a set of `Company`. */
  companies?: Maybe<CompaniesConnection>;
  company?: Maybe<Company>;
  companyByMarketIdAndName?: Maybe<Company>;
  /** Reads a single `Company` using its globally unique `ID`. */
  companyByNodeId?: Maybe<Company>;
  companyByReferenceNumber?: Maybe<Company>;
  companyDocument?: Maybe<CompanyDocument>;
  /** Reads a single `CompanyDocument` using its globally unique `ID`. */
  companyDocumentByNodeId?: Maybe<CompanyDocument>;
  /** Reads and enables pagination through a set of `CompanyDocument`. */
  companyDocuments?: Maybe<CompanyDocumentsConnection>;
  companyMember?: Maybe<CompanyMember>;
  companyMemberByMarketIdAndAccountIdAndCompanyId?: Maybe<CompanyMember>;
  /** Reads a single `CompanyMember` using its globally unique `ID`. */
  companyMemberByNodeId?: Maybe<CompanyMember>;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers?: Maybe<CompanyMembersConnection>;
  companyOperation?: Maybe<CompanyOperation>;
  /** Reads a single `CompanyOperation` using its globally unique `ID`. */
  companyOperationByNodeId?: Maybe<CompanyOperation>;
  /** Reads and enables pagination through a set of `CompanyOperation`. */
  companyOperations?: Maybe<CompanyOperationsConnection>;
  contactDetails?: Maybe<ContactDetails>;
  contactDetailsCollection?: Maybe<ContactDetailsCollection>;
  contentArticle?: Maybe<ContentArticle>;
  contentArticleCollection?: Maybe<ContentArticleCollection>;
  course?: Maybe<Course>;
  courseByCourseId?: Maybe<Course>;
  /** Reads a single `Course` using its globally unique `ID`. */
  courseByNodeId?: Maybe<Course>;
  courseCatalogue?: Maybe<CourseCatalogue>;
  courseCatalogueByCatalogueIdAndCourseId?: Maybe<CourseCatalogue>;
  /** Reads a single `CourseCatalogue` using its globally unique `ID`. */
  courseCatalogueByNodeId?: Maybe<CourseCatalogue>;
  courseCatalogueTemp?: Maybe<CourseCatalogueTemp>;
  /** Reads a single `CourseCatalogueTemp` using its globally unique `ID`. */
  courseCatalogueTempByNodeId?: Maybe<CourseCatalogueTemp>;
  /** Reads and enables pagination through a set of `CourseCatalogueTemp`. */
  courseCatalogueTemps?: Maybe<CourseCatalogueTempsConnection>;
  /** Reads and enables pagination through a set of `CourseCatalogue`. */
  courseCatalogues?: Maybe<CourseCataloguesConnection>;
  courseEnrollment?: Maybe<CourseEnrollment>;
  /** Reads a single `CourseEnrollment` using its globally unique `ID`. */
  courseEnrollmentByNodeId?: Maybe<CourseEnrollment>;
  courseEnrollmentByUserIdAndCourseId?: Maybe<CourseEnrollment>;
  courseEnrollmentTemp?: Maybe<CourseEnrollmentTemp>;
  /** Reads a single `CourseEnrollmentTemp` using its globally unique `ID`. */
  courseEnrollmentTempByNodeId?: Maybe<CourseEnrollmentTemp>;
  /** Reads and enables pagination through a set of `CourseEnrollmentTemp`. */
  courseEnrollmentTemps?: Maybe<CourseEnrollmentTempsConnection>;
  /** Reads and enables pagination through a set of `CourseEnrollment`. */
  courseEnrollments?: Maybe<CourseEnrollmentsConnection>;
  courseSyncConfiguration?: Maybe<CourseSyncConfiguration>;
  courseSyncConfigurationByConfigName?: Maybe<CourseSyncConfiguration>;
  /** Reads a single `CourseSyncConfiguration` using its globally unique `ID`. */
  courseSyncConfigurationByNodeId?: Maybe<CourseSyncConfiguration>;
  /** Reads and enables pagination through a set of `CourseSyncConfiguration`. */
  courseSyncConfigurations?: Maybe<CourseSyncConfigurationsConnection>;
  courseTemp?: Maybe<CourseTemp>;
  /** Reads a single `CourseTemp` using its globally unique `ID`. */
  courseTempByNodeId?: Maybe<CourseTemp>;
  /** Reads and enables pagination through a set of `CourseTemp`. */
  courseTemps?: Maybe<CourseTempsConnection>;
  /** Reads and enables pagination through a set of `Course`. */
  courses?: Maybe<CoursesConnection>;
  currentAccountDoceboId?: Maybe<Scalars["Int"]>;
  currentAccountEmail?: Maybe<Scalars["String"]>;
  currentAccountId?: Maybe<Scalars["Int"]>;
  currentCompany?: Maybe<Scalars["Int"]>;
  currentMarket?: Maybe<Scalars["Int"]>;
  entryCollection?: Maybe<EntryCollection>;
  evidenceCategory?: Maybe<EvidenceCategory>;
  evidenceCategoryCollection?: Maybe<EvidenceCategoryCollection>;
  evidenceItem?: Maybe<EvidenceItem>;
  /** Reads a single `EvidenceItem` using its globally unique `ID`. */
  evidenceItemByNodeId?: Maybe<EvidenceItem>;
  /** Reads and enables pagination through a set of `EvidenceItem`. */
  evidenceItems?: Maybe<EvidenceItemsConnection>;
  /** Reads and enables pagination through a set of `FindIncompleteCompanyProfile`. */
  findIncompleteCompanyProfiles?: Maybe<FindIncompleteCompanyProfilesConnection>;
  /** Reads and enables pagination through a set of `FindRoofer`. */
  findRoofers?: Maybe<FindRoofersConnection>;
  guarantee?: Maybe<Guarantee>;
  guaranteeByBmiReferenceId?: Maybe<Guarantee>;
  /** Reads a single `Guarantee` using its globally unique `ID`. */
  guaranteeByNodeId?: Maybe<Guarantee>;
  guaranteeTemplate?: Maybe<GuaranteeTemplate>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
  guaranteeType?: Maybe<GuaranteeType>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guarantees?: Maybe<GuaranteesConnection>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByMarket?: Maybe<GuaranteesConnection>;
  invitation?: Maybe<Invitation>;
  /** Reads a single `Invitation` using its globally unique `ID`. */
  invitationByNodeId?: Maybe<Invitation>;
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations?: Maybe<InvitationsConnection>;
  invitedByCompanies?: Maybe<InvitedByCompaniesConnection>;
  isPartOfProject?: Maybe<IsPartOfProjectConnection>;
  isProjectEnabledByMarket?: Maybe<Scalars["Boolean"]>;
  market?: Maybe<Market>;
  marketByDoceboCatalogueId?: Maybe<Market>;
  marketByDomain?: Maybe<Market>;
  /** Reads a single `Market` using its globally unique `ID`. */
  marketByNodeId?: Maybe<Market>;
  marketContent?: Maybe<MarketContent>;
  marketContentCollection?: Maybe<MarketContentCollection>;
  /** Reads and enables pagination through a set of `Market`. */
  markets?: Maybe<MarketsConnection>;
  mediaFolder?: Maybe<MediaFolder>;
  mediaFolderCollection?: Maybe<MediaFolderCollection>;
  mediaTool?: Maybe<MediaTool>;
  mediaToolCollection?: Maybe<MediaToolCollection>;
  messageTemplate?: Maybe<MessageTemplate>;
  messageTemplateCollection?: Maybe<MessageTemplateCollection>;
  migration?: Maybe<Migration>;
  migrationCollection?: Maybe<MigrationCollection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars["ID"];
  note?: Maybe<Note>;
  /** Reads a single `Note` using its globally unique `ID`. */
  noteByNodeId?: Maybe<Note>;
  /** Reads and enables pagination through a set of `Note`. */
  notes?: Maybe<NotesConnection>;
  notification?: Maybe<Notification>;
  /** Reads a single `Notification` using its globally unique `ID`. */
  notificationByNodeId?: Maybe<Notification>;
  /** Reads and enables pagination through a set of `Notification`. */
  notifications?: Maybe<NotificationsConnection>;
  partnerBrand?: Maybe<PartnerBrand>;
  partnerBrandCollection?: Maybe<PartnerBrandCollection>;
  product?: Maybe<Product>;
  productByBmiRef?: Maybe<Product>;
  /** Reads a single `Product` using its globally unique `ID`. */
  productByNodeId?: Maybe<Product>;
  /** Reads and enables pagination through a set of `Product`. */
  products?: Maybe<ProductsConnection>;
  project?: Maybe<Project>;
  /** Reads a single `Project` using its globally unique `ID`. */
  projectByNodeId?: Maybe<Project>;
  projectMember?: Maybe<ProjectMember>;
  /** Reads a single `ProjectMember` using its globally unique `ID`. */
  projectMemberByNodeId?: Maybe<ProjectMember>;
  /** Reads and enables pagination through a set of `ProjectMember`. */
  projectMembers?: Maybe<ProjectMembersConnection>;
  /** Reads and enables pagination through a set of `Project`. */
  projects?: Maybe<ProjectsConnection>;
  /** Reads and enables pagination through a set of `Project`. */
  projectsByMarket?: Maybe<ProjectsConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads and enables pagination through a set of `Product`. */
  searchProducts?: Maybe<ProductsConnection>;
  /** Reads and enables pagination through a set of `System`. */
  searchSystems?: Maybe<SystemsConnection>;
  system?: Maybe<System>;
  systemByBmiRef?: Maybe<System>;
  /** Reads a single `System` using its globally unique `ID`. */
  systemByNodeId?: Maybe<System>;
  systemMember?: Maybe<SystemMember>;
  /** Reads a single `SystemMember` using its globally unique `ID`. */
  systemMemberByNodeId?: Maybe<SystemMember>;
  systemMemberBySystemBmiRefAndProductBmiRefAndMarketId?: Maybe<SystemMember>;
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembers?: Maybe<SystemMembersConnection>;
  /** Reads and enables pagination through a set of `System`. */
  systems?: Maybe<SystemsConnection>;
  tierBenefit?: Maybe<TierBenefit>;
  tierBenefitCollection?: Maybe<TierBenefitCollection>;
  token?: Maybe<Token>;
  tokenByUsername?: Maybe<Token>;
  trainingContent?: Maybe<TrainingContent>;
  trainingContentCollection?: Maybe<TrainingContentCollection>;
  userByEmail?: Maybe<UserData>;
};

/** The root query type which gives access points into the data universe. */
export type Query_EntitiesArgs = {
  representations: Array<Scalars["_Any"]>;
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
export type QueryAccountByEmailArgs = {
  email: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<AccountCondition>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAddressArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryAddressByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryAddressesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<AddressCondition>;
  filter?: InputMaybe<AddressFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<AddressesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAssetArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAssetCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<AssetOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<AssetFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCarouselArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCarouselCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<CarouselOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<CarouselFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCarouselItemArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCarouselItemCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<CarouselItemOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<CarouselItemFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCertificationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCertificationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCertificationsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CertificationCondition>;
  filter?: InputMaybe<CertificationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CertificationsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCheckUserValidatiyArgs = {
  email?: InputMaybe<Scalars["String"]>;
  username?: InputMaybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompaniesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyCondition>;
  filter?: InputMaybe<CompanyFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompaniesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyByMarketIdAndNameArgs = {
  marketId: Scalars["Int"];
  name: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyByReferenceNumberArgs = {
  referenceNumber: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyDocumentArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyDocumentByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyDocumentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyDocumentCondition>;
  filter?: InputMaybe<CompanyDocumentFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompanyDocumentsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberByMarketIdAndAccountIdAndCompanyIdArgs = {
  accountId: Scalars["Int"];
  companyId: Scalars["Int"];
  marketId: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyMemberCondition>;
  filter?: InputMaybe<CompanyMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompanyMembersOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyOperationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyOperationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyOperationsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CompanyOperationCondition>;
  filter?: InputMaybe<CompanyOperationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CompanyOperationsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryContactDetailsArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryContactDetailsCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<ContactDetailsOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ContactDetailsFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryContentArticleArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryContentArticleCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<ContentArticleOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ContentArticleFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseByCourseIdArgs = {
  courseId: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCatalogueArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCatalogueByCatalogueIdAndCourseIdArgs = {
  catalogueId: Scalars["Int"];
  courseId: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCatalogueByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCatalogueTempArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCatalogueTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCatalogueTempsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseCatalogueTempCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CourseCatalogueTempsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCataloguesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseCatalogueCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CourseCataloguesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentByUserIdAndCourseIdArgs = {
  courseId: Scalars["Int"];
  userId: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentTempArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentTempsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseEnrollmentTempCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CourseEnrollmentTempsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseEnrollmentCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CourseEnrollmentsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseSyncConfigurationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseSyncConfigurationByConfigNameArgs = {
  configName: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseSyncConfigurationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseSyncConfigurationsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseSyncConfigurationCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CourseSyncConfigurationsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseTempArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseTempsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseTempCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CourseTempsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCoursesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<CourseCondition>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<CoursesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<EntryOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EntryFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceCategoryArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceCategoryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<EvidenceCategoryOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EvidenceCategoryFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceItemArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceItemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceItemsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<EvidenceItemCondition>;
  filter?: InputMaybe<EvidenceItemFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<EvidenceItemsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryFindIncompleteCompanyProfilesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<FindIncompleteCompanyProfilesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryFindRoofersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<FindRoofersOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeByBmiReferenceIdArgs = {
  bmiReferenceId: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeTemplateArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeTemplateCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<GuaranteeTemplateOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<GuaranteeTemplateFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeTypeArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeTypeCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<GuaranteeTypeOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<GuaranteeTypeFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<GuaranteeCondition>;
  filter?: InputMaybe<GuaranteeFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteesByMarketArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  filter?: InputMaybe<GuaranteeFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  market: Scalars["Int"];
  offset?: InputMaybe<Scalars["Int"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryInvitationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryInvitationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryInvitationsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<InvitationCondition>;
  filter?: InputMaybe<InvitationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryInvitedByCompaniesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  filter?: InputMaybe<IntFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryIsPartOfProjectArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  filter?: InputMaybe<IntFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketByDoceboCatalogueIdArgs = {
  doceboCatalogueId: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketByDomainArgs = {
  domain: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketContentArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketContentCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<MarketContentOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MarketContentFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<MarketCondition>;
  filter?: InputMaybe<MarketFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<MarketsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMediaFolderArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMediaFolderCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<MediaFolderOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MediaFolderFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMediaToolArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMediaToolCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<MediaToolOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MediaToolFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMessageTemplateArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMessageTemplateCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<MessageTemplateOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MessageTemplateFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMigrationArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMigrationCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<MigrationOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MigrationFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNoteArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNoteByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNotesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<NoteCondition>;
  filter?: InputMaybe<NoteFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryNotificationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNotificationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryNotificationsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<NotificationCondition>;
  filter?: InputMaybe<NotificationFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryPartnerBrandArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryPartnerBrandCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<PartnerBrandOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<PartnerBrandFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryProductArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProductByBmiRefArgs = {
  bmiRef: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProductByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProductsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProductCondition>;
  filter?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProductsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectMemberArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProjectMemberCondition>;
  filter?: InputMaybe<ProjectMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProjectMembersOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<ProjectCondition>;
  filter?: InputMaybe<ProjectFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<ProjectsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryProjectsByMarketArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  filter?: InputMaybe<ProjectFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  market: Scalars["Int"];
  offset?: InputMaybe<Scalars["Int"]>;
};

/** The root query type which gives access points into the data universe. */
export type QuerySearchProductsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  filter?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  query: Scalars["String"];
  technology: Technology;
};

/** The root query type which gives access points into the data universe. */
export type QuerySearchSystemsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  filter?: InputMaybe<SystemFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  query: Scalars["String"];
  technology: Technology;
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemByBmiRefArgs = {
  bmiRef: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemMemberArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemMemberBySystemBmiRefAndProductBmiRefAndMarketIdArgs = {
  marketId: Scalars["Int"];
  productBmiRef: Scalars["String"];
  systemBmiRef: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemMembersArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<SystemMemberCondition>;
  filter?: InputMaybe<SystemMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<SystemMembersOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QuerySystemsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<SystemCondition>;
  filter?: InputMaybe<SystemFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<SystemsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTierBenefitArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTierBenefitCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<TierBenefitOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<TierBenefitFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTokenByUsernameArgs = {
  username: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryTrainingContentArgs = {
  id: Scalars["String"];
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTrainingContentCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Array<InputMaybe<TrainingContentOrder>>>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<TrainingContentFilter>;
};

/** The root query type which gives access points into the data universe. */
export type QueryUserByEmailArgs = {
  email?: InputMaybe<Scalars["String"]>;
};

export type RequestStatus =
  | "APPROVED"
  | "NEW"
  | "REJECTED"
  | "REVIEW"
  | "SUBMITTED";

export type Role =
  | "COMPANY_ADMIN"
  | "INSTALLER"
  | "MARKET_ADMIN"
  | "SUPER_ADMIN";

export type SsoUrlOutput = {
  __typename?: "SSOUrlOutput";
  url?: Maybe<Scalars["String"]>;
};

export type SelectOrgchart = {
  branch_id?: InputMaybe<Scalars["String"]>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars["String"]>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars["String"]>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars["String"]>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars["String"]>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars["String"]>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars["String"]>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars["String"]>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars["String"]>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars["String"]>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars["String"]>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars["String"]>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars["String"]>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars["String"]>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars["String"]>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars["Boolean"]>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars["String"]>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars["String"]>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars["String"]>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars["String"]>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars["String"]>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars["String"]>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars["String"]>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars["String"]>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars["String"]>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars["String"]>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars["String"]>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars["String"]>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars["String"]>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars["String"]>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars["String"]>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars["String"]>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars["String"]>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars["String"]>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars["String"]>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars["String"]>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars["String"]>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars["String"]>;
};

export type Sys = {
  __typename?: "Sys";
  environmentId: Scalars["String"];
  firstPublishedAt?: Maybe<Scalars["DateTime"]>;
  id: Scalars["String"];
  publishedAt?: Maybe<Scalars["DateTime"]>;
  publishedVersion?: Maybe<Scalars["Int"]>;
  spaceId: Scalars["String"];
};

export type SysFilter = {
  firstPublishedAt?: InputMaybe<Scalars["DateTime"]>;
  firstPublishedAt_exists?: InputMaybe<Scalars["Boolean"]>;
  firstPublishedAt_gt?: InputMaybe<Scalars["DateTime"]>;
  firstPublishedAt_gte?: InputMaybe<Scalars["DateTime"]>;
  firstPublishedAt_in?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  firstPublishedAt_lt?: InputMaybe<Scalars["DateTime"]>;
  firstPublishedAt_lte?: InputMaybe<Scalars["DateTime"]>;
  firstPublishedAt_not?: InputMaybe<Scalars["DateTime"]>;
  firstPublishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  id?: InputMaybe<Scalars["String"]>;
  id_contains?: InputMaybe<Scalars["String"]>;
  id_exists?: InputMaybe<Scalars["Boolean"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  id_not?: InputMaybe<Scalars["String"]>;
  id_not_contains?: InputMaybe<Scalars["String"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  publishedAt?: InputMaybe<Scalars["DateTime"]>;
  publishedAt_exists?: InputMaybe<Scalars["Boolean"]>;
  publishedAt_gt?: InputMaybe<Scalars["DateTime"]>;
  publishedAt_gte?: InputMaybe<Scalars["DateTime"]>;
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  publishedAt_lt?: InputMaybe<Scalars["DateTime"]>;
  publishedAt_lte?: InputMaybe<Scalars["DateTime"]>;
  publishedAt_not?: InputMaybe<Scalars["DateTime"]>;
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  publishedVersion?: InputMaybe<Scalars["Float"]>;
  publishedVersion_exists?: InputMaybe<Scalars["Boolean"]>;
  publishedVersion_gt?: InputMaybe<Scalars["Float"]>;
  publishedVersion_gte?: InputMaybe<Scalars["Float"]>;
  publishedVersion_in?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  publishedVersion_lt?: InputMaybe<Scalars["Float"]>;
  publishedVersion_lte?: InputMaybe<Scalars["Float"]>;
  publishedVersion_not?: InputMaybe<Scalars["Float"]>;
  publishedVersion_not_in?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
};

/** A collection of products that can be guaranteed as a system */
export type System = Node & {
  __typename?: "System";
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
  createdAt: Scalars["Datetime"];
  /** A description for the System */
  description?: Maybe<Scalars["String"]>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesBySystemBmiRef: GuaranteesConnection;
  /** Primary key */
  id: Scalars["Int"];
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** fk */
  marketId: Scalars["Int"];
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the System */
  name: Scalars["String"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published: Scalars["Boolean"];
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembersBySystemBmiRef: SystemMembersConnection;
  /** ek */
  technology: Technology;
  updatedAt: Scalars["Datetime"];
};

/** A collection of products that can be guaranteed as a system */
export type SystemGuaranteesBySystemBmiRefArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<GuaranteeCondition>;
  filter?: InputMaybe<GuaranteeFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** A collection of products that can be guaranteed as a system */
export type SystemSystemMembersBySystemBmiRefArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  condition?: InputMaybe<SystemMemberCondition>;
  filter?: InputMaybe<SystemMemberFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<SystemMembersOrderBy>>;
};

/** A condition to be used against `System` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SystemCondition = {
  /** Checks for equality with the object’s `bmiRef` field. */
  bmiRef?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars["String"]>;
};

/** A filter to be used against `System` object types. All fields are combined with a logical ‘and.’ */
export type SystemFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SystemFilter>>;
  /** Filter by the object’s `bmiRef` field. */
  bmiRef?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `marketId` field. */
  marketId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SystemFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SystemFilter>>;
};

/** An input for mutations affecting `System` */
export type SystemInput = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description for the System */
  description?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMarketIdFkeyInput>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the System */
  name: Scalars["String"];
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published: Scalars["Boolean"];
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInverseInput>;
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `market` in the `SystemInput` mutation. */
export type SystemMarketIdFkeyInput = {
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDomain?: InputMaybe<MarketMarketDomainKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectById?: InputMaybe<MarketMarketPkeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<MarketNodeIdConnect>;
  /** A `MarketInput` object that will be created and connected to this object. */
  create?: InputMaybe<SystemMarketIdFkeyMarketCreateInput>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDomain?: InputMaybe<MarketMarketDomainKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteById?: InputMaybe<MarketMarketPkeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<MarketNodeIdDelete>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDoceboCatalogueId?: InputMaybe<MarketOnSystemForSystemMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDomain?: InputMaybe<MarketOnSystemForSystemMarketIdFkeyUsingMarketDomainKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateById?: InputMaybe<MarketOnSystemForSystemMarketIdFkeyUsingMarketPkeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<SystemOnSystemForSystemMarketIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `system` in the `MarketInput` mutation. */
export type SystemMarketIdFkeyInverseInput = {
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectByBmiRef?: InputMaybe<Array<SystemSystemBmiRefKeyConnect>>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectById?: InputMaybe<Array<SystemSystemPkeyConnect>>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<SystemNodeIdConnect>>;
  /** A `SystemInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<SystemMarketIdFkeySystemCreateInput>>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteByBmiRef?: InputMaybe<Array<SystemSystemBmiRefKeyDelete>>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<SystemSystemPkeyDelete>>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<SystemNodeIdDelete>>;
  /** Flag indicating whether all other `system` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateByBmiRef?: InputMaybe<
    Array<SystemOnSystemForSystemMarketIdFkeyUsingSystemBmiRefKeyUpdate>
  >;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<SystemOnSystemForSystemMarketIdFkeyUsingSystemPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<MarketOnSystemForSystemMarketIdFkeyNodeIdUpdate>
  >;
};

/** The `market` to be created by this mutation. */
export type SystemMarketIdFkeyMarketCreateInput = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language: Language;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `system` to be created by this mutation. */
export type SystemMarketIdFkeySystemCreateInput = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description for the System */
  description?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMarketIdFkeyInput>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the System */
  name: Scalars["String"];
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published: Scalars["Boolean"];
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInverseInput>;
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** A Products that make up a system */
export type SystemMember = Node & {
  __typename?: "SystemMember";
  createdAt: Scalars["Datetime"];
  /** Primary key */
  id: Scalars["Int"];
  /** Reads a single `Market` that is related to this `SystemMember`. */
  market?: Maybe<Market>;
  /** fk */
  marketId: Scalars["Int"];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** fk */
  productBmiRef: Scalars["String"];
  /** Reads a single `Product` that is related to this `SystemMember`. */
  productByProductBmiRef?: Maybe<Product>;
  /** fk */
  systemBmiRef: Scalars["String"];
  /** Reads a single `System` that is related to this `SystemMember`. */
  systemBySystemBmiRef?: Maybe<System>;
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `SystemMember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SystemMemberCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: InputMaybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `productBmiRef` field. */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  /** Checks for equality with the object’s `systemBmiRef` field. */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
};

/** A filter to be used against `SystemMember` object types. All fields are combined with a logical ‘and.’ */
export type SystemMemberFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SystemMemberFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `marketId` field. */
  marketId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SystemMemberFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SystemMemberFilter>>;
  /** Filter by the object’s `productBmiRef` field. */
  productBmiRef?: InputMaybe<StringFilter>;
  /** Filter by the object’s `systemBmiRef` field. */
  systemBmiRef?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `SystemMember` */
export type SystemMemberInput = {
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMemberMarketIdFkeyInput>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInput>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `market` in the `SystemMemberInput` mutation. */
export type SystemMemberMarketIdFkeyInput = {
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByDomain?: InputMaybe<MarketMarketDomainKeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectById?: InputMaybe<MarketMarketPkeyConnect>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<MarketNodeIdConnect>;
  /** A `MarketInput` object that will be created and connected to this object. */
  create?: InputMaybe<SystemMemberMarketIdFkeyMarketCreateInput>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDoceboCatalogueId?: InputMaybe<MarketMarketDoceboCatalogueIdKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByDomain?: InputMaybe<MarketMarketDomainKeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteById?: InputMaybe<MarketMarketPkeyDelete>;
  /** The primary key(s) for `market` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<MarketNodeIdDelete>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDoceboCatalogueId?: InputMaybe<MarketOnSystemMemberForSystemMemberMarketIdFkeyUsingMarketDoceboCatalogueIdKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByDomain?: InputMaybe<MarketOnSystemMemberForSystemMemberMarketIdFkeyUsingMarketDomainKeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateById?: InputMaybe<MarketOnSystemMemberForSystemMemberMarketIdFkeyUsingMarketPkeyUpdate>;
  /** The primary key(s) and patch data for `market` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<SystemMemberOnSystemMemberForSystemMemberMarketIdFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `systemMember` in the `MarketInput` mutation. */
export type SystemMemberMarketIdFkeyInverseInput = {
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectById?: InputMaybe<Array<SystemMemberSystemMemberPkeyConnect>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<SystemMemberNodeIdConnect>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberSystemMemberSystemBmiRefProductBmiRefMarketIdKeyConnect>
  >;
  /** A `SystemMemberInput` object that will be created and connected to this object. */
  create?: InputMaybe<Array<SystemMemberMarketIdFkeySystemMemberCreateInput>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<SystemMemberSystemMemberPkeyDelete>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<SystemMemberNodeIdDelete>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberSystemMemberSystemBmiRefProductBmiRefMarketIdKeyDelete>
  >;
  /** Flag indicating whether all other `systemMember` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<SystemMemberOnSystemMemberForSystemMemberMarketIdFkeyUsingSystemMemberPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<MarketOnSystemMemberForSystemMemberMarketIdFkeyNodeIdUpdate>
  >;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberOnSystemMemberForSystemMemberMarketIdFkeyUsingSystemMemberSystemBmiRefProductBmiRefMarketIdKeyUpdate>
  >;
};

/** The `market` to be created by this mutation. */
export type SystemMemberMarketIdFkeyMarketCreateInput = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language: Language;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `systemMember` to be created by this mutation. */
export type SystemMemberMarketIdFkeySystemMemberCreateInput = {
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMemberMarketIdFkeyInput>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInput>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The globally unique `ID` look up for the row to connect. */
export type SystemMemberNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `systemMember` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type SystemMemberNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `systemMember` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberMarketIdFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `market` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `market` being updated. */
    patch: MarketPatch;
  };

/** The fields on `systemMember` to look up the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberMarketIdFkeyUsingSystemMemberPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `systemMember` being updated. */
    patch: UpdateSystemMemberOnSystemMemberForSystemMemberMarketIdFkeyPatch;
  };

/** The fields on `systemMember` to look up the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberMarketIdFkeyUsingSystemMemberSystemBmiRefProductBmiRefMarketIdKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** An object where the defined keys will be set on the `systemMember` being updated. */
    patch: UpdateSystemMemberOnSystemMemberForSystemMemberMarketIdFkeyPatch;
    /** fk */
    productBmiRef: Scalars["String"];
    /** fk */
    systemBmiRef: Scalars["String"];
  };

/** The globally unique `ID` look up for the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `product` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `product` being updated. */
    patch: ProductPatch;
  };

/** The fields on `systemMember` to look up the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyUsingSystemMemberPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `systemMember` being updated. */
    patch: UpdateSystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyPatch;
  };

/** The fields on `systemMember` to look up the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyUsingSystemMemberSystemBmiRefProductBmiRefMarketIdKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** An object where the defined keys will be set on the `systemMember` being updated. */
    patch: UpdateSystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyPatch;
    /** fk */
    productBmiRef: Scalars["String"];
    /** fk */
    systemBmiRef: Scalars["String"];
  };

/** The globally unique `ID` look up for the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyNodeIdUpdate =
  {
    /** The globally unique `ID` which identifies a single `system` to be connected. */
    nodeId: Scalars["ID"];
    /** An object where the defined keys will be set on the `system` being updated. */
    patch: SystemPatch;
  };

/** The fields on `systemMember` to look up the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyUsingSystemMemberPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `systemMember` being updated. */
    patch: UpdateSystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyPatch;
  };

/** The fields on `systemMember` to look up the row to update. */
export type SystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyUsingSystemMemberSystemBmiRefProductBmiRefMarketIdKeyUpdate =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** An object where the defined keys will be set on the `systemMember` being updated. */
    patch: UpdateSystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyPatch;
    /** fk */
    productBmiRef: Scalars["String"];
    /** fk */
    systemBmiRef: Scalars["String"];
  };

/** Represents an update to a `SystemMember`. Fields that are set will be updated. */
export type SystemMemberPatch = {
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMemberMarketIdFkeyInput>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInput>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `product` in the `SystemMemberInput` mutation. */
export type SystemMemberProductBmiRefFkeyInput = {
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectByBmiRef?: InputMaybe<ProductProductBmiRefKeyConnect>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectById?: InputMaybe<ProductProductPkeyConnect>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<ProductNodeIdConnect>;
  /** A `ProductInput` object that will be created and connected to this object. */
  create?: InputMaybe<SystemMemberProductBmiRefFkeyProductCreateInput>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteByBmiRef?: InputMaybe<ProductProductBmiRefKeyDelete>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteById?: InputMaybe<ProductProductPkeyDelete>;
  /** The primary key(s) for `product` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<ProductNodeIdDelete>;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateByBmiRef?: InputMaybe<ProductOnSystemMemberForSystemMemberProductBmiRefFkeyUsingProductBmiRefKeyUpdate>;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateById?: InputMaybe<ProductOnSystemMemberForSystemMemberProductBmiRefFkeyUsingProductPkeyUpdate>;
  /** The primary key(s) and patch data for `product` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<SystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `systemMember` in the `ProductInput` mutation. */
export type SystemMemberProductBmiRefFkeyInverseInput = {
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectById?: InputMaybe<Array<SystemMemberSystemMemberPkeyConnect>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<SystemMemberNodeIdConnect>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberSystemMemberSystemBmiRefProductBmiRefMarketIdKeyConnect>
  >;
  /** A `SystemMemberInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<SystemMemberProductBmiRefFkeySystemMemberCreateInput>
  >;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<SystemMemberSystemMemberPkeyDelete>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<SystemMemberNodeIdDelete>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberSystemMemberSystemBmiRefProductBmiRefMarketIdKeyDelete>
  >;
  /** Flag indicating whether all other `systemMember` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<SystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyUsingSystemMemberPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<ProductOnSystemMemberForSystemMemberProductBmiRefFkeyNodeIdUpdate>
  >;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyUsingSystemMemberSystemBmiRefProductBmiRefMarketIdKeyUpdate>
  >;
};

/** The `product` to be created by this mutation. */
export type SystemMemberProductBmiRefFkeyProductCreateInput = {
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
  /** The Products brand */
  brand: Scalars["String"];
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description of the Product */
  description?: InputMaybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family: Scalars["String"];
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<ProductMarketIdFkeyInput>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the Product */
  name: Scalars["String"];
  /** Whether the Product is avialable for new guarantees */
  published: Scalars["Boolean"];
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInverseInput>;
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `systemMember` to be created by this mutation. */
export type SystemMemberProductBmiRefFkeySystemMemberCreateInput = {
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMemberMarketIdFkeyInput>;
  productToProductBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInput>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** Input for the nested mutation of `system` in the `SystemMemberInput` mutation. */
export type SystemMemberSystemBmiRefFkeyInput = {
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectByBmiRef?: InputMaybe<SystemSystemBmiRefKeyConnect>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectById?: InputMaybe<SystemSystemPkeyConnect>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<SystemNodeIdConnect>;
  /** A `SystemInput` object that will be created and connected to this object. */
  create?: InputMaybe<SystemMemberSystemBmiRefFkeySystemCreateInput>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteByBmiRef?: InputMaybe<SystemSystemBmiRefKeyDelete>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteById?: InputMaybe<SystemSystemPkeyDelete>;
  /** The primary key(s) for `system` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<SystemNodeIdDelete>;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateByBmiRef?: InputMaybe<SystemOnSystemMemberForSystemMemberSystemBmiRefFkeyUsingSystemBmiRefKeyUpdate>;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateById?: InputMaybe<SystemOnSystemMemberForSystemMemberSystemBmiRefFkeyUsingSystemPkeyUpdate>;
  /** The primary key(s) and patch data for `system` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<SystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyNodeIdUpdate>;
};

/** Input for the nested mutation of `systemMember` in the `SystemInput` mutation. */
export type SystemMemberSystemBmiRefFkeyInverseInput = {
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectById?: InputMaybe<Array<SystemMemberSystemMemberPkeyConnect>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectByNodeId?: InputMaybe<Array<SystemMemberNodeIdConnect>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  connectBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberSystemMemberSystemBmiRefProductBmiRefMarketIdKeyConnect>
  >;
  /** A `SystemMemberInput` object that will be created and connected to this object. */
  create?: InputMaybe<
    Array<SystemMemberSystemBmiRefFkeySystemMemberCreateInput>
  >;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteById?: InputMaybe<Array<SystemMemberSystemMemberPkeyDelete>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteByNodeId?: InputMaybe<Array<SystemMemberNodeIdDelete>>;
  /** The primary key(s) for `systemMember` for the far side of the relationship. */
  deleteBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberSystemMemberSystemBmiRefProductBmiRefMarketIdKeyDelete>
  >;
  /** Flag indicating whether all other `systemMember` records that match this relationship should be removed. */
  deleteOthers?: InputMaybe<Scalars["Boolean"]>;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateById?: InputMaybe<
    Array<SystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyUsingSystemMemberPkeyUpdate>
  >;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateByNodeId?: InputMaybe<
    Array<SystemOnSystemMemberForSystemMemberSystemBmiRefFkeyNodeIdUpdate>
  >;
  /** The primary key(s) and patch data for `systemMember` for the far side of the relationship. */
  updateBySystemBmiRefAndProductBmiRefAndMarketId?: InputMaybe<
    Array<SystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyUsingSystemMemberSystemBmiRefProductBmiRefMarketIdKeyUpdate>
  >;
};

/** The `system` to be created by this mutation. */
export type SystemMemberSystemBmiRefFkeySystemCreateInput = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description for the System */
  description?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMarketIdFkeyInput>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears: Scalars["Int"];
  /** Short name for the System */
  name: Scalars["String"];
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published: Scalars["Boolean"];
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInverseInput>;
  /** ek */
  technology: Technology;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The `systemMember` to be created by this mutation. */
export type SystemMemberSystemBmiRefFkeySystemMemberCreateInput = {
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMemberMarketIdFkeyInput>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInput>;
  systemToSystemBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The fields on `systemMember` to look up the row to connect. */
export type SystemMemberSystemMemberPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `systemMember` to look up the row to delete. */
export type SystemMemberSystemMemberPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `systemMember` to look up the row to connect. */
export type SystemMemberSystemMemberSystemBmiRefProductBmiRefMarketIdKeyConnect =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** fk */
    productBmiRef: Scalars["String"];
    /** fk */
    systemBmiRef: Scalars["String"];
  };

/** The fields on `systemMember` to look up the row to delete. */
export type SystemMemberSystemMemberSystemBmiRefProductBmiRefMarketIdKeyDelete =
  {
    /** fk */
    marketId: Scalars["Int"];
    /** fk */
    productBmiRef: Scalars["String"];
    /** fk */
    systemBmiRef: Scalars["String"];
  };

/** A connection to a list of `SystemMember` values. */
export type SystemMembersConnection = {
  __typename?: "SystemMembersConnection";
  /** A list of edges which contains the `SystemMember` and cursor to aid in pagination. */
  edges: Array<SystemMembersEdge>;
  /** A list of `SystemMember` objects. */
  nodes: Array<SystemMember>;
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
export type SystemMembersOrderBy =
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC"
  | "PRODUCT_BMI_REF_ASC"
  | "PRODUCT_BMI_REF_DESC"
  | "SYSTEM_BMI_REF_ASC"
  | "SYSTEM_BMI_REF_DESC";

/** The globally unique `ID` look up for the row to connect. */
export type SystemNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `system` to be connected. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to delete. */
export type SystemNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `system` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The globally unique `ID` look up for the row to update. */
export type SystemOnGuaranteeForGuaranteeSystemBmiRefFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `guarantee` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `guarantee` being updated. */
  patch: GuaranteePatch;
};

/** The fields on `system` to look up the row to update. */
export type SystemOnGuaranteeForGuaranteeSystemBmiRefFkeyUsingSystemBmiRefKeyUpdate =
  {
    /** A unique reference for the system known to BMI */
    bmiRef: Scalars["String"];
    /** An object where the defined keys will be set on the `system` being updated. */
    patch: UpdateSystemOnGuaranteeForGuaranteeSystemBmiRefFkeyPatch;
  };

/** The fields on `system` to look up the row to update. */
export type SystemOnGuaranteeForGuaranteeSystemBmiRefFkeyUsingSystemPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `system` being updated. */
    patch: UpdateSystemOnGuaranteeForGuaranteeSystemBmiRefFkeyPatch;
  };

/** The globally unique `ID` look up for the row to update. */
export type SystemOnSystemForSystemMarketIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `market` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `market` being updated. */
  patch: MarketPatch;
};

/** The fields on `system` to look up the row to update. */
export type SystemOnSystemForSystemMarketIdFkeyUsingSystemBmiRefKeyUpdate = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
  /** An object where the defined keys will be set on the `system` being updated. */
  patch: UpdateSystemOnSystemForSystemMarketIdFkeyPatch;
};

/** The fields on `system` to look up the row to update. */
export type SystemOnSystemForSystemMarketIdFkeyUsingSystemPkeyUpdate = {
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `system` being updated. */
  patch: UpdateSystemOnSystemForSystemMarketIdFkeyPatch;
};

/** The globally unique `ID` look up for the row to update. */
export type SystemOnSystemMemberForSystemMemberSystemBmiRefFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `systemMember` to be connected. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `systemMember` being updated. */
  patch: SystemMemberPatch;
};

/** The fields on `system` to look up the row to update. */
export type SystemOnSystemMemberForSystemMemberSystemBmiRefFkeyUsingSystemBmiRefKeyUpdate =
  {
    /** A unique reference for the system known to BMI */
    bmiRef: Scalars["String"];
    /** An object where the defined keys will be set on the `system` being updated. */
    patch: UpdateSystemOnSystemMemberForSystemMemberSystemBmiRefFkeyPatch;
  };

/** The fields on `system` to look up the row to update. */
export type SystemOnSystemMemberForSystemMemberSystemBmiRefFkeyUsingSystemPkeyUpdate =
  {
    /** Primary key */
    id: Scalars["Int"];
    /** An object where the defined keys will be set on the `system` being updated. */
    patch: UpdateSystemOnSystemMemberForSystemMemberSystemBmiRefFkeyPatch;
  };

/** Represents an update to a `System`. Fields that are set will be updated. */
export type SystemPatch = {
  /** A unique reference for the system known to BMI */
  bmiRef?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description for the System */
  description?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMarketIdFkeyInput>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  /** Short name for the System */
  name?: InputMaybe<Scalars["String"]>;
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published?: InputMaybe<Scalars["Boolean"]>;
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInverseInput>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** The fields on `system` to look up the row to connect. */
export type SystemSystemBmiRefKeyConnect = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
};

/** The fields on `system` to look up the row to delete. */
export type SystemSystemBmiRefKeyDelete = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
};

/** The fields on `system` to look up the row to connect. */
export type SystemSystemPkeyConnect = {
  /** Primary key */
  id: Scalars["Int"];
};

/** The fields on `system` to look up the row to delete. */
export type SystemSystemPkeyDelete = {
  /** Primary key */
  id: Scalars["Int"];
};

/** A connection to a list of `System` values. */
export type SystemsConnection = {
  __typename?: "SystemsConnection";
  /** A list of edges which contains the `System` and cursor to aid in pagination. */
  edges: Array<SystemsEdge>;
  /** A list of `System` objects. */
  nodes: Array<System>;
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
export type SystemsOrderBy =
  | "BMI_REF_ASC"
  | "BMI_REF_DESC"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "NAME_ASC"
  | "NAME_DESC"
  | "NATURAL"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

export type Technology = "FLAT" | "OTHER" | "PITCHED";

export type Tier = "T1" | "T2" | "T3" | "T4";

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/tierBenefit) */
export type TierBenefit = Entry & {
  __typename?: "TierBenefit";
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<TierBenefitDescription>;
  guaranteeValidityOffsetYears?: Maybe<Scalars["Int"]>;
  linkedFrom?: Maybe<TierBenefitLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  shortDescription?: Maybe<Scalars["String"]>;
  sys: Sys;
  tier?: Maybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/tierBenefit) */
export type TierBenefitDescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/tierBenefit) */
export type TierBenefitGuaranteeValidityOffsetYearsArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/tierBenefit) */
export type TierBenefitLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/tierBenefit) */
export type TierBenefitNameArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/tierBenefit) */
export type TierBenefitShortDescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/tierBenefit) */
export type TierBenefitTierArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type TierBenefitCollection = {
  __typename?: "TierBenefitCollection";
  items: Array<Maybe<TierBenefit>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type TierBenefitDescription = {
  __typename?: "TierBenefitDescription";
  json: Scalars["JSON"];
  links: TierBenefitDescriptionLinks;
};

export type TierBenefitDescriptionAssets = {
  __typename?: "TierBenefitDescriptionAssets";
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type TierBenefitDescriptionEntries = {
  __typename?: "TierBenefitDescriptionEntries";
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type TierBenefitDescriptionLinks = {
  __typename?: "TierBenefitDescriptionLinks";
  assets: TierBenefitDescriptionAssets;
  entries: TierBenefitDescriptionEntries;
};

export type TierBenefitFilter = {
  AND?: InputMaybe<Array<InputMaybe<TierBenefitFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TierBenefitFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description_contains?: InputMaybe<Scalars["String"]>;
  description_exists?: InputMaybe<Scalars["Boolean"]>;
  description_not_contains?: InputMaybe<Scalars["String"]>;
  guaranteeValidityOffsetYears?: InputMaybe<Scalars["Int"]>;
  guaranteeValidityOffsetYears_exists?: InputMaybe<Scalars["Boolean"]>;
  guaranteeValidityOffsetYears_gt?: InputMaybe<Scalars["Int"]>;
  guaranteeValidityOffsetYears_gte?: InputMaybe<Scalars["Int"]>;
  guaranteeValidityOffsetYears_in?: InputMaybe<
    Array<InputMaybe<Scalars["Int"]>>
  >;
  guaranteeValidityOffsetYears_lt?: InputMaybe<Scalars["Int"]>;
  guaranteeValidityOffsetYears_lte?: InputMaybe<Scalars["Int"]>;
  guaranteeValidityOffsetYears_not?: InputMaybe<Scalars["Int"]>;
  guaranteeValidityOffsetYears_not_in?: InputMaybe<
    Array<InputMaybe<Scalars["Int"]>>
  >;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_exists?: InputMaybe<Scalars["Boolean"]>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  shortDescription?: InputMaybe<Scalars["String"]>;
  shortDescription_contains?: InputMaybe<Scalars["String"]>;
  shortDescription_exists?: InputMaybe<Scalars["Boolean"]>;
  shortDescription_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  shortDescription_not?: InputMaybe<Scalars["String"]>;
  shortDescription_not_contains?: InputMaybe<Scalars["String"]>;
  shortDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
  tier?: InputMaybe<Scalars["String"]>;
  tier_contains?: InputMaybe<Scalars["String"]>;
  tier_exists?: InputMaybe<Scalars["Boolean"]>;
  tier_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  tier_not?: InputMaybe<Scalars["String"]>;
  tier_not_contains?: InputMaybe<Scalars["String"]>;
  tier_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type TierBenefitLinkingCollections = {
  __typename?: "TierBenefitLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type TierBenefitLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type TierBenefitOrder =
  | "guaranteeValidityOffsetYears_ASC"
  | "guaranteeValidityOffsetYears_DESC"
  | "name_ASC"
  | "name_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC"
  | "tier_ASC"
  | "tier_DESC";

export type Token = {
  __typename?: "Token";
  access_token?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContent = Entry & {
  __typename?: "TrainingContent";
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars["String"]>;
  image?: Maybe<Asset>;
  linkedFrom?: Maybe<TrainingContentLinkingCollections>;
  live?: Maybe<Scalars["String"]>;
  lmsCtaLabel?: Maybe<Scalars["String"]>;
  pageHeading?: Maybe<Scalars["String"]>;
  pageSubHeading?: Maybe<Scalars["String"]>;
  step1Description?: Maybe<Scalars["String"]>;
  step1Heading?: Maybe<Scalars["String"]>;
  step1SubHeading?: Maybe<Scalars["String"]>;
  step2Description?: Maybe<Scalars["String"]>;
  step2Heading?: Maybe<Scalars["String"]>;
  step2SubHeading?: Maybe<Scalars["String"]>;
  step3Description?: Maybe<Scalars["String"]>;
  step3Heading?: Maybe<Scalars["String"]>;
  step3SubHeading?: Maybe<Scalars["String"]>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentDescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentImageArgs = {
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentLiveArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentLmsCtaLabelArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentPageHeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentPageSubHeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep1DescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep1HeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep1SubHeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep2DescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep2HeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep2SubHeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep3DescriptionArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep3HeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/j30snaps0u9c/content_types/trainingContent) */
export type TrainingContentStep3SubHeadingArgs = {
  locale?: InputMaybe<Scalars["String"]>;
};

export type TrainingContentCollection = {
  __typename?: "TrainingContentCollection";
  items: Array<Maybe<TrainingContent>>;
  limit: Scalars["Int"];
  skip: Scalars["Int"];
  total: Scalars["Int"];
};

export type TrainingContentFilter = {
  AND?: InputMaybe<Array<InputMaybe<TrainingContentFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TrainingContentFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars["String"]>;
  description_contains?: InputMaybe<Scalars["String"]>;
  description_exists?: InputMaybe<Scalars["Boolean"]>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  description_not?: InputMaybe<Scalars["String"]>;
  description_not_contains?: InputMaybe<Scalars["String"]>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  image_exists?: InputMaybe<Scalars["Boolean"]>;
  live?: InputMaybe<Scalars["String"]>;
  live_contains?: InputMaybe<Scalars["String"]>;
  live_exists?: InputMaybe<Scalars["Boolean"]>;
  live_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  live_not?: InputMaybe<Scalars["String"]>;
  live_not_contains?: InputMaybe<Scalars["String"]>;
  live_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  lmsCtaLabel?: InputMaybe<Scalars["String"]>;
  lmsCtaLabel_contains?: InputMaybe<Scalars["String"]>;
  lmsCtaLabel_exists?: InputMaybe<Scalars["Boolean"]>;
  lmsCtaLabel_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  lmsCtaLabel_not?: InputMaybe<Scalars["String"]>;
  lmsCtaLabel_not_contains?: InputMaybe<Scalars["String"]>;
  lmsCtaLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  pageHeading?: InputMaybe<Scalars["String"]>;
  pageHeading_contains?: InputMaybe<Scalars["String"]>;
  pageHeading_exists?: InputMaybe<Scalars["Boolean"]>;
  pageHeading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  pageHeading_not?: InputMaybe<Scalars["String"]>;
  pageHeading_not_contains?: InputMaybe<Scalars["String"]>;
  pageHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  pageSubHeading?: InputMaybe<Scalars["String"]>;
  pageSubHeading_contains?: InputMaybe<Scalars["String"]>;
  pageSubHeading_exists?: InputMaybe<Scalars["Boolean"]>;
  pageSubHeading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  pageSubHeading_not?: InputMaybe<Scalars["String"]>;
  pageSubHeading_not_contains?: InputMaybe<Scalars["String"]>;
  pageSubHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step1Description?: InputMaybe<Scalars["String"]>;
  step1Description_contains?: InputMaybe<Scalars["String"]>;
  step1Description_exists?: InputMaybe<Scalars["Boolean"]>;
  step1Description_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step1Description_not?: InputMaybe<Scalars["String"]>;
  step1Description_not_contains?: InputMaybe<Scalars["String"]>;
  step1Description_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step1Heading?: InputMaybe<Scalars["String"]>;
  step1Heading_contains?: InputMaybe<Scalars["String"]>;
  step1Heading_exists?: InputMaybe<Scalars["Boolean"]>;
  step1Heading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step1Heading_not?: InputMaybe<Scalars["String"]>;
  step1Heading_not_contains?: InputMaybe<Scalars["String"]>;
  step1Heading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step1SubHeading?: InputMaybe<Scalars["String"]>;
  step1SubHeading_contains?: InputMaybe<Scalars["String"]>;
  step1SubHeading_exists?: InputMaybe<Scalars["Boolean"]>;
  step1SubHeading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step1SubHeading_not?: InputMaybe<Scalars["String"]>;
  step1SubHeading_not_contains?: InputMaybe<Scalars["String"]>;
  step1SubHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step2Description?: InputMaybe<Scalars["String"]>;
  step2Description_contains?: InputMaybe<Scalars["String"]>;
  step2Description_exists?: InputMaybe<Scalars["Boolean"]>;
  step2Description_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step2Description_not?: InputMaybe<Scalars["String"]>;
  step2Description_not_contains?: InputMaybe<Scalars["String"]>;
  step2Description_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step2Heading?: InputMaybe<Scalars["String"]>;
  step2Heading_contains?: InputMaybe<Scalars["String"]>;
  step2Heading_exists?: InputMaybe<Scalars["Boolean"]>;
  step2Heading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step2Heading_not?: InputMaybe<Scalars["String"]>;
  step2Heading_not_contains?: InputMaybe<Scalars["String"]>;
  step2Heading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step2SubHeading?: InputMaybe<Scalars["String"]>;
  step2SubHeading_contains?: InputMaybe<Scalars["String"]>;
  step2SubHeading_exists?: InputMaybe<Scalars["Boolean"]>;
  step2SubHeading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step2SubHeading_not?: InputMaybe<Scalars["String"]>;
  step2SubHeading_not_contains?: InputMaybe<Scalars["String"]>;
  step2SubHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step3Description?: InputMaybe<Scalars["String"]>;
  step3Description_contains?: InputMaybe<Scalars["String"]>;
  step3Description_exists?: InputMaybe<Scalars["Boolean"]>;
  step3Description_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step3Description_not?: InputMaybe<Scalars["String"]>;
  step3Description_not_contains?: InputMaybe<Scalars["String"]>;
  step3Description_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step3Heading?: InputMaybe<Scalars["String"]>;
  step3Heading_contains?: InputMaybe<Scalars["String"]>;
  step3Heading_exists?: InputMaybe<Scalars["Boolean"]>;
  step3Heading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step3Heading_not?: InputMaybe<Scalars["String"]>;
  step3Heading_not_contains?: InputMaybe<Scalars["String"]>;
  step3Heading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step3SubHeading?: InputMaybe<Scalars["String"]>;
  step3SubHeading_contains?: InputMaybe<Scalars["String"]>;
  step3SubHeading_exists?: InputMaybe<Scalars["Boolean"]>;
  step3SubHeading_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  step3SubHeading_not?: InputMaybe<Scalars["String"]>;
  step3SubHeading_not_contains?: InputMaybe<Scalars["String"]>;
  step3SubHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
};

export type TrainingContentLinkingCollections = {
  __typename?: "TrainingContentLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type TrainingContentLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  locale?: InputMaybe<Scalars["String"]>;
  preview?: InputMaybe<Scalars["Boolean"]>;
  skip?: InputMaybe<Scalars["Int"]>;
};

export type TrainingContentOrder =
  | "live_ASC"
  | "live_DESC"
  | "lmsCtaLabel_ASC"
  | "lmsCtaLabel_DESC"
  | "pageHeading_ASC"
  | "pageHeading_DESC"
  | "pageSubHeading_ASC"
  | "pageSubHeading_DESC"
  | "step1Heading_ASC"
  | "step1Heading_DESC"
  | "step1SubHeading_ASC"
  | "step1SubHeading_DESC"
  | "step2Heading_ASC"
  | "step2Heading_DESC"
  | "step2SubHeading_ASC"
  | "step2SubHeading_DESC"
  | "step3Heading_ASC"
  | "step3Heading_DESC"
  | "step3SubHeading_ASC"
  | "step3SubHeading_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** All input for the `updateAccountByDoceboUserId` mutation. */
export type UpdateAccountByDoceboUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** User account in Docebo */
  doceboUserId: Scalars["Int"];
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
};

/** All input for the `updateAccountByEmail` mutation. */
export type UpdateAccountByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email: Scalars["String"];
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
};

/** All input for the `updateAccountByNodeId` mutation. */
export type UpdateAccountByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
};

/** The output of our update `Account` mutation. */
export type UpdateAccountPayload = {
  __typename?: "UpdateAccountPayload";
  /** The `Account` that was updated by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Account` mutation. */
export type UpdateAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `updateAddressByNodeId` mutation. */
export type UpdateAddressByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Address` being updated. */
  patch: AddressPatch;
};

/** The output of our update `Address` mutation. */
export type UpdateAddressPayload = {
  __typename?: "UpdateAddressPayload";
  /** The `Address` that was updated by this mutation. */
  address?: Maybe<Address>;
  /** An edge for our `Address`. May be used by Relay 1. */
  addressEdge?: Maybe<AddressesEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Address` mutation. */
export type UpdateAddressPayloadAddressEdgeArgs = {
  orderBy?: InputMaybe<Array<AddressesOrderBy>>;
};

/** All input for the `updateCertificationByNodeId` mutation. */
export type UpdateCertificationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Certification` being updated. */
  patch: CertificationPatch;
};

/** The output of our update `Certification` mutation. */
export type UpdateCertificationPayload = {
  __typename?: "UpdateCertificationPayload";
  /** The `Certification` that was updated by this mutation. */
  certification?: Maybe<Certification>;
  /** An edge for our `Certification`. May be used by Relay 1. */
  certificationEdge?: Maybe<CertificationsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Account` that is related to this `Certification`. */
  doceboUser?: Maybe<Account>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Certification` mutation. */
export type UpdateCertificationPayloadCertificationEdgeArgs = {
  orderBy?: InputMaybe<Array<CertificationsOrderBy>>;
};

/** All input for the `updateCompanyByMarketIdAndName` mutation. */
export type UpdateCompanyByMarketIdAndNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId: Scalars["Int"];
  /** The registered name of the Company */
  name: Scalars["String"];
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
};

/** All input for the `updateCompanyByNodeId` mutation. */
export type UpdateCompanyByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Company` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
};

/** All input for the `updateCompanyByReferenceNumber` mutation. */
export type UpdateCompanyByReferenceNumberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber: Scalars["Int"];
};

/** All input for the `updateCompanyDocumentByNodeId` mutation. */
export type UpdateCompanyDocumentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CompanyDocument` being updated. */
  patch: CompanyDocumentPatch;
};

/** The output of our update `CompanyDocument` mutation. */
export type UpdateCompanyDocumentPayload = {
  __typename?: "UpdateCompanyDocumentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
  /** The `CompanyDocument` that was updated by this mutation. */
  companyDocument?: Maybe<CompanyDocument>;
  /** An edge for our `CompanyDocument`. May be used by Relay 1. */
  companyDocumentEdge?: Maybe<CompanyDocumentsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CompanyDocument` mutation. */
export type UpdateCompanyDocumentPayloadCompanyDocumentEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyDocumentsOrderBy>>;
};

/** All input for the `updateCompany` mutation. */
export type UpdateCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
};

/** All input for the `updateCompanyMemberByMarketIdAndAccountIdAndCompanyId` mutation. */
export type UpdateCompanyMemberByMarketIdAndAccountIdAndCompanyIdInput = {
  /** fk */
  accountId: Scalars["Int"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId: Scalars["Int"];
  /** fk */
  marketId: Scalars["Int"];
  /** An object where the defined keys will be set on the `CompanyMember` being updated. */
  patch: CompanyMemberPatch;
};

/** All input for the `updateCompanyMemberByNodeId` mutation. */
export type UpdateCompanyMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CompanyMember` being updated. */
  patch: CompanyMemberPatch;
};

/** The output of our update `CompanyMember` mutation. */
export type UpdateCompanyMemberPayload = {
  __typename?: "UpdateCompanyMemberPayload";
  /** Reads a single `Account` that is related to this `CompanyMember`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  /** The `CompanyMember` that was updated by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMembersEdge>;
  /** Reads a single `Market` that is related to this `CompanyMember`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CompanyMember` mutation. */
export type UpdateCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyMembersOrderBy>>;
};

/** All input for the `updateCompanyOperationByNodeId` mutation. */
export type UpdateCompanyOperationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CompanyOperation` being updated. */
  patch: CompanyOperationPatch;
};

/** The output of our update `CompanyOperation` mutation. */
export type UpdateCompanyOperationPayload = {
  __typename?: "UpdateCompanyOperationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `CompanyOperation`. */
  companyByCompany?: Maybe<Company>;
  /** The `CompanyOperation` that was updated by this mutation. */
  companyOperation?: Maybe<CompanyOperation>;
  /** An edge for our `CompanyOperation`. May be used by Relay 1. */
  companyOperationEdge?: Maybe<CompanyOperationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CompanyOperation` mutation. */
export type UpdateCompanyOperationPayloadCompanyOperationEdgeArgs = {
  orderBy?: InputMaybe<Array<CompanyOperationsOrderBy>>;
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
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
};

/** The output of our update `Company` mutation. */
export type UpdateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: InputMaybe<Array<CompaniesOrderBy>>;
};

/** All input for the `updateCourseByCourseId` mutation. */
export type UpdateCourseByCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Docebo CourseId */
  courseId: Scalars["Int"];
  /** An object where the defined keys will be set on the `Course` being updated. */
  patch: CoursePatch;
};

/** All input for the `updateCourseByNodeId` mutation. */
export type UpdateCourseByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Course` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Course` being updated. */
  patch: CoursePatch;
};

/** All input for the `updateCourseCatalogueByCatalogueIdAndCourseId` mutation. */
export type UpdateCourseCatalogueByCatalogueIdAndCourseIdInput = {
  /** market */
  catalogueId: Scalars["Int"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  courseId: Scalars["Int"];
  /** An object where the defined keys will be set on the `CourseCatalogue` being updated. */
  patch: CourseCataloguePatch;
};

/** All input for the `updateCourseCatalogueByNodeId` mutation. */
export type UpdateCourseCatalogueByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseCatalogue` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CourseCatalogue` being updated. */
  patch: CourseCataloguePatch;
};

/** All input for the `updateCourseCatalogue` mutation. */
export type UpdateCourseCatalogueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CourseCatalogue` being updated. */
  patch: CourseCataloguePatch;
};

/** The output of our update `CourseCatalogue` mutation. */
export type UpdateCourseCataloguePayload = {
  __typename?: "UpdateCourseCataloguePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Course` that is related to this `CourseCatalogue`. */
  course?: Maybe<Course>;
  /** The `CourseCatalogue` that was updated by this mutation. */
  courseCatalogue?: Maybe<CourseCatalogue>;
  /** An edge for our `CourseCatalogue`. May be used by Relay 1. */
  courseCatalogueEdge?: Maybe<CourseCataloguesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CourseCatalogue` mutation. */
export type UpdateCourseCataloguePayloadCourseCatalogueEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseCataloguesOrderBy>>;
};

/** All input for the `updateCourseCatalogueTempByNodeId` mutation. */
export type UpdateCourseCatalogueTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseCatalogueTemp` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CourseCatalogueTemp` being updated. */
  patch: CourseCatalogueTempPatch;
};

/** All input for the `updateCourseCatalogueTemp` mutation. */
export type UpdateCourseCatalogueTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CourseCatalogueTemp` being updated. */
  patch: CourseCatalogueTempPatch;
};

/** The output of our update `CourseCatalogueTemp` mutation. */
export type UpdateCourseCatalogueTempPayload = {
  __typename?: "UpdateCourseCatalogueTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseCatalogueTemp` that was updated by this mutation. */
  courseCatalogueTemp?: Maybe<CourseCatalogueTemp>;
  /** An edge for our `CourseCatalogueTemp`. May be used by Relay 1. */
  courseCatalogueTempEdge?: Maybe<CourseCatalogueTempsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CourseCatalogueTemp` mutation. */
export type UpdateCourseCatalogueTempPayloadCourseCatalogueTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseCatalogueTempsOrderBy>>;
};

/** All input for the `updateCourseEnrollmentByNodeId` mutation. */
export type UpdateCourseEnrollmentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseEnrollment` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CourseEnrollment` being updated. */
  patch: CourseEnrollmentPatch;
};

/** All input for the `updateCourseEnrollmentByUserIdAndCourseId` mutation. */
export type UpdateCourseEnrollmentByUserIdAndCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  courseId: Scalars["Int"];
  /** An object where the defined keys will be set on the `CourseEnrollment` being updated. */
  patch: CourseEnrollmentPatch;
  /** account */
  userId: Scalars["Int"];
};

/** All input for the `updateCourseEnrollment` mutation. */
export type UpdateCourseEnrollmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CourseEnrollment` being updated. */
  patch: CourseEnrollmentPatch;
};

/** The output of our update `CourseEnrollment` mutation. */
export type UpdateCourseEnrollmentPayload = {
  __typename?: "UpdateCourseEnrollmentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Course` that is related to this `CourseEnrollment`. */
  course?: Maybe<Course>;
  /** The `CourseEnrollment` that was updated by this mutation. */
  courseEnrollment?: Maybe<CourseEnrollment>;
  /** An edge for our `CourseEnrollment`. May be used by Relay 1. */
  courseEnrollmentEdge?: Maybe<CourseEnrollmentsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CourseEnrollment` mutation. */
export type UpdateCourseEnrollmentPayloadCourseEnrollmentEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseEnrollmentsOrderBy>>;
};

/** All input for the `updateCourseEnrollmentTempByNodeId` mutation. */
export type UpdateCourseEnrollmentTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseEnrollmentTemp` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CourseEnrollmentTemp` being updated. */
  patch: CourseEnrollmentTempPatch;
};

/** All input for the `updateCourseEnrollmentTemp` mutation. */
export type UpdateCourseEnrollmentTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CourseEnrollmentTemp` being updated. */
  patch: CourseEnrollmentTempPatch;
};

/** The output of our update `CourseEnrollmentTemp` mutation. */
export type UpdateCourseEnrollmentTempPayload = {
  __typename?: "UpdateCourseEnrollmentTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseEnrollmentTemp` that was updated by this mutation. */
  courseEnrollmentTemp?: Maybe<CourseEnrollmentTemp>;
  /** An edge for our `CourseEnrollmentTemp`. May be used by Relay 1. */
  courseEnrollmentTempEdge?: Maybe<CourseEnrollmentTempsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CourseEnrollmentTemp` mutation. */
export type UpdateCourseEnrollmentTempPayloadCourseEnrollmentTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseEnrollmentTempsOrderBy>>;
};

/** All input for the `updateCourse` mutation. */
export type UpdateCourseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Course` being updated. */
  patch: CoursePatch;
};

/** The output of our update `Course` mutation. */
export type UpdateCoursePayload = {
  __typename?: "UpdateCoursePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Course` that was updated by this mutation. */
  course?: Maybe<Course>;
  /** An edge for our `Course`. May be used by Relay 1. */
  courseEdge?: Maybe<CoursesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Course` mutation. */
export type UpdateCoursePayloadCourseEdgeArgs = {
  orderBy?: InputMaybe<Array<CoursesOrderBy>>;
};

/** All input for the `updateCourseSyncConfigurationByConfigName` mutation. */
export type UpdateCourseSyncConfigurationByConfigNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** account */
  configName: Scalars["String"];
  /** An object where the defined keys will be set on the `CourseSyncConfiguration` being updated. */
  patch: CourseSyncConfigurationPatch;
};

/** All input for the `updateCourseSyncConfigurationByNodeId` mutation. */
export type UpdateCourseSyncConfigurationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseSyncConfiguration` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CourseSyncConfiguration` being updated. */
  patch: CourseSyncConfigurationPatch;
};

/** All input for the `updateCourseSyncConfiguration` mutation. */
export type UpdateCourseSyncConfigurationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CourseSyncConfiguration` being updated. */
  patch: CourseSyncConfigurationPatch;
};

/** The output of our update `CourseSyncConfiguration` mutation. */
export type UpdateCourseSyncConfigurationPayload = {
  __typename?: "UpdateCourseSyncConfigurationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseSyncConfiguration` that was updated by this mutation. */
  courseSyncConfiguration?: Maybe<CourseSyncConfiguration>;
  /** An edge for our `CourseSyncConfiguration`. May be used by Relay 1. */
  courseSyncConfigurationEdge?: Maybe<CourseSyncConfigurationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CourseSyncConfiguration` mutation. */
export type UpdateCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs =
  {
    orderBy?: InputMaybe<Array<CourseSyncConfigurationsOrderBy>>;
  };

/** All input for the `updateCourseTempByNodeId` mutation. */
export type UpdateCourseTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseTemp` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `CourseTemp` being updated. */
  patch: CourseTempPatch;
};

/** All input for the `updateCourseTemp` mutation. */
export type UpdateCourseTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `CourseTemp` being updated. */
  patch: CourseTempPatch;
};

/** The output of our update `CourseTemp` mutation. */
export type UpdateCourseTempPayload = {
  __typename?: "UpdateCourseTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseTemp` that was updated by this mutation. */
  courseTemp?: Maybe<CourseTemp>;
  /** An edge for our `CourseTemp`. May be used by Relay 1. */
  courseTempEdge?: Maybe<CourseTempsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `CourseTemp` mutation. */
export type UpdateCourseTempPayloadCourseTempEdgeArgs = {
  orderBy?: InputMaybe<Array<CourseTempsOrderBy>>;
};

/** All input for the `updateEvidenceItemByNodeId` mutation. */
export type UpdateEvidenceItemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `EvidenceItem` being updated. */
  patch: EvidenceItemPatch;
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
  /** An edge for our `EvidenceItem`. May be used by Relay 1. */
  evidenceItemEdge?: Maybe<EvidenceItemsEdge>;
  /** Reads a single `Guarantee` that is related to this `EvidenceItem`. */
  guarantee?: Maybe<Guarantee>;
  /** Reads a single `Project` that is related to this `EvidenceItem`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `EvidenceItem` mutation. */
export type UpdateEvidenceItemPayloadEvidenceItemEdgeArgs = {
  orderBy?: InputMaybe<Array<EvidenceItemsOrderBy>>;
};

/** All input for the `updateGuaranteeByBmiReferenceId` mutation. */
export type UpdateGuaranteeByBmiReferenceIdInput = {
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId: Scalars["String"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Guarantee` being updated. */
  patch: GuaranteePatch;
};

/** All input for the `updateGuaranteeByNodeId` mutation. */
export type UpdateGuaranteeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  guaranteeEventType?: InputMaybe<GuaranteeEventType>;
  /** Primary key - starts at 6100 */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Guarantee` being updated. */
  patch: GuaranteePatch;
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
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
  /** Reads a single `Product` that is related to this `Guarantee`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  systemBySystemBmiRef?: Maybe<System>;
};

/** The output of our update `Guarantee` mutation. */
export type UpdateGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: InputMaybe<Array<GuaranteesOrderBy>>;
};

/** All input for the `updateInvitationByNodeId` mutation. */
export type UpdateInvitationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Invitation` being updated. */
  patch: InvitationPatch;
};

/** The output of our update `Invitation` mutation. */
export type UpdateInvitationPayload = {
  __typename?: "UpdateInvitationPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `Invitation`. */
  company?: Maybe<Company>;
  /** The `Invitation` that was updated by this mutation. */
  invitation?: Maybe<Invitation>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Invitation`. */
  senderAccount?: Maybe<Account>;
};

/** The output of our update `Invitation` mutation. */
export type UpdateInvitationPayloadInvitationEdgeArgs = {
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};

/** All input for the `updateMarketByDoceboCatalogueId` mutation. */
export type UpdateMarketByDoceboCatalogueIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId: Scalars["Int"];
  /** An object where the defined keys will be set on the `Market` being updated. */
  patch: MarketPatch;
};

/** All input for the `updateMarketByDomain` mutation. */
export type UpdateMarketByDomainInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
  /** An object where the defined keys will be set on the `Market` being updated. */
  patch: MarketPatch;
};

/** All input for the `updateMarketByNodeId` mutation. */
export type UpdateMarketByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Market` being updated. */
  patch: MarketPatch;
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
  /** An edge for our `Market`. May be used by Relay 1. */
  marketEdge?: Maybe<MarketsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Market` mutation. */
export type UpdateMarketPayloadMarketEdgeArgs = {
  orderBy?: InputMaybe<Array<MarketsOrderBy>>;
};

/** All input for the `updateNoteByNodeId` mutation. */
export type UpdateNoteByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Note` being updated. */
  patch: NotePatch;
};

/** The output of our update `Note` mutation. */
export type UpdateNotePayload = {
  __typename?: "UpdateNotePayload";
  /** Reads a single `Account` that is related to this `Note`. */
  author?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Note` that was updated by this mutation. */
  note?: Maybe<Note>;
  /** An edge for our `Note`. May be used by Relay 1. */
  noteEdge?: Maybe<NotesEdge>;
  /** Reads a single `Project` that is related to this `Note`. */
  project?: Maybe<Project>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Note` mutation. */
export type UpdateNotePayloadNoteEdgeArgs = {
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
};

/** All input for the `updateNotificationByNodeId` mutation. */
export type UpdateNotificationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Notification` being updated. */
  patch: NotificationPatch;
};

/** The output of our update `Notification` mutation. */
export type UpdateNotificationPayload = {
  __typename?: "UpdateNotificationPayload";
  /** Reads a single `Account` that is related to this `Notification`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Notification` that was updated by this mutation. */
  notification?: Maybe<Notification>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Notification` mutation. */
export type UpdateNotificationPayloadNotificationEdgeArgs = {
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};

/** All input for the `updateProductByBmiRef` mutation. */
export type UpdateProductByBmiRefInput = {
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Product` being updated. */
  patch: ProductPatch;
};

/** All input for the `updateProductByNodeId` mutation. */
export type UpdateProductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Product` being updated. */
  patch: ProductPatch;
};

/** The output of our update `Product` mutation. */
export type UpdateProductPayload = {
  __typename?: "UpdateProductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** The `Product` that was updated by this mutation. */
  product?: Maybe<Product>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Product` mutation. */
export type UpdateProductPayloadProductEdgeArgs = {
  orderBy?: InputMaybe<Array<ProductsOrderBy>>;
};

/** All input for the `updateProjectByNodeId` mutation. */
export type UpdateProjectByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `Project` being updated. */
  patch: ProjectPatch;
};

/** All input for the `updateProjectMemberByNodeId` mutation. */
export type UpdateProjectMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `ProjectMember` being updated. */
  patch: ProjectMemberPatch;
};

/** The output of our update `ProjectMember` mutation. */
export type UpdateProjectMemberPayload = {
  __typename?: "UpdateProjectMemberPayload";
  /** Reads a single `Account` that is related to this `ProjectMember`. */
  account?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Project` that is related to this `ProjectMember`. */
  project?: Maybe<Project>;
  /** The `ProjectMember` that was updated by this mutation. */
  projectMember?: Maybe<ProjectMember>;
  /** An edge for our `ProjectMember`. May be used by Relay 1. */
  projectMemberEdge?: Maybe<ProjectMembersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `ProjectMember` mutation. */
export type UpdateProjectMemberPayloadProjectMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<ProjectMembersOrderBy>>;
};

/** The output of our update `Project` mutation. */
export type UpdateProjectPayload = {
  __typename?: "UpdateProjectPayload";
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  /** The `Project` that was updated by this mutation. */
  project?: Maybe<Project>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
};

/** The output of our update `Project` mutation. */
export type UpdateProjectPayloadProjectEdgeArgs = {
  orderBy?: InputMaybe<Array<ProjectsOrderBy>>;
};

/** All input for the `updateSystemByBmiRef` mutation. */
export type UpdateSystemByBmiRefInput = {
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `System` being updated. */
  patch: SystemPatch;
};

/** All input for the `updateSystemByNodeId` mutation. */
export type UpdateSystemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
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
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `System` being updated. */
  patch: SystemPatch;
};

/** All input for the `updateSystemMemberByNodeId` mutation. */
export type UpdateSystemMemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `SystemMember` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `SystemMember` being updated. */
  patch: SystemMemberPatch;
};

/** All input for the `updateSystemMemberBySystemBmiRefAndProductBmiRefAndMarketId` mutation. */
export type UpdateSystemMemberBySystemBmiRefAndProductBmiRefAndMarketIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId: Scalars["Int"];
  /** An object where the defined keys will be set on the `SystemMember` being updated. */
  patch: SystemMemberPatch;
  /** fk */
  productBmiRef: Scalars["String"];
  /** fk */
  systemBmiRef: Scalars["String"];
};

/** All input for the `updateSystemMember` mutation. */
export type UpdateSystemMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
  /** An object where the defined keys will be set on the `SystemMember` being updated. */
  patch: SystemMemberPatch;
};

/** The output of our update `SystemMember` mutation. */
export type UpdateSystemMemberPayload = {
  __typename?: "UpdateSystemMemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Market` that is related to this `SystemMember`. */
  market?: Maybe<Market>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `System` that is related to this `SystemMember`. */
  systemBySystemBmiRef?: Maybe<System>;
  /** The `SystemMember` that was updated by this mutation. */
  systemMember?: Maybe<SystemMember>;
  /** An edge for our `SystemMember`. May be used by Relay 1. */
  systemMemberEdge?: Maybe<SystemMembersEdge>;
};

/** The output of our update `SystemMember` mutation. */
export type UpdateSystemMemberPayloadSystemMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<SystemMembersOrderBy>>;
};

/** The output of our update `System` mutation. */
export type UpdateSystemPayload = {
  __typename?: "UpdateSystemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `System` that was updated by this mutation. */
  system?: Maybe<System>;
  /** An edge for our `System`. May be used by Relay 1. */
  systemEdge?: Maybe<SystemsEdge>;
};

/** The output of our update `System` mutation. */
export type UpdateSystemPayloadSystemEdgeArgs = {
  orderBy?: InputMaybe<Array<SystemsOrderBy>>;
};

export type UserCreateInput = {
  can_manage_subordinates?: InputMaybe<Scalars["Boolean"]>;
  date_format?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  email_validation_status?: InputMaybe<Scalars["Int"]>;
  expiration?: InputMaybe<Scalars["String"]>;
  firstname?: InputMaybe<Scalars["String"]>;
  force_change?: InputMaybe<Scalars["Int"]>;
  language?: InputMaybe<Scalars["String"]>;
  lastname?: InputMaybe<Scalars["String"]>;
  level?: InputMaybe<Scalars["Int"]>;
  password?: InputMaybe<Scalars["String"]>;
  privacy?: InputMaybe<Scalars["String"]>;
  role?: InputMaybe<Scalars["Int"]>;
  select_orgchart?: InputMaybe<SelectOrgchart>;
  send_notification_email?: InputMaybe<Scalars["Boolean"]>;
  timezone?: InputMaybe<Scalars["String"]>;
  userid?: InputMaybe<Scalars["String"]>;
  valid?: InputMaybe<Scalars["Int"]>;
};

export type UserCreateResponse = {
  __typename?: "UserCreateResponse";
  success?: Maybe<Scalars["Boolean"]>;
  user_id?: Maybe<Scalars["Int"]>;
};

export type UserData = {
  __typename?: "UserData";
  email?: Maybe<Scalars["String"]>;
  email_validation_status?: Maybe<Scalars["String"]>;
  expiration?: Maybe<Scalars["String"]>;
  first_name?: Maybe<Scalars["String"]>;
  lang_code?: Maybe<Scalars["String"]>;
  language?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
  level?: Maybe<Scalars["String"]>;
  role?: Maybe<Scalars["String"]>;
  role_id?: Maybe<Scalars["String"]>;
  role_title?: Maybe<Scalars["String"]>;
  user_id?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  uuid?: Maybe<Scalars["String"]>;
  valid?: Maybe<Scalars["String"]>;
};

export type UserUpdateInput = {
  can_manage_subordinates?: InputMaybe<Scalars["Boolean"]>;
  date_format?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  email_validation_status?: InputMaybe<Scalars["Int"]>;
  expiration?: InputMaybe<Scalars["String"]>;
  firstname?: InputMaybe<Scalars["String"]>;
  force_change?: InputMaybe<Scalars["Int"]>;
  language?: InputMaybe<Scalars["String"]>;
  lastname?: InputMaybe<Scalars["String"]>;
  level?: InputMaybe<Scalars["Int"]>;
  password?: InputMaybe<Scalars["String"]>;
  privacy?: InputMaybe<Scalars["String"]>;
  role?: InputMaybe<Scalars["Int"]>;
  select_orgchart?: InputMaybe<SelectOrgchart>;
  send_notification_email?: InputMaybe<Scalars["Boolean"]>;
  timezone?: InputMaybe<Scalars["String"]>;
  userid?: InputMaybe<Scalars["String"]>;
  valid?: InputMaybe<Scalars["Int"]>;
};

export type UserUpdateResponse = {
  __typename?: "UserUpdateResponse";
  success?: Maybe<Scalars["Boolean"]>;
  user_id?: Maybe<Scalars["Int"]>;
};

/** A union of all federated types (those that use the @key directive). */
export type _Entity =
  | Account
  | Address
  | Certification
  | Company
  | CompanyDocument
  | CompanyMember
  | CompanyOperation
  | Course
  | CourseCatalogue
  | CourseCatalogueTemp
  | CourseEnrollment
  | CourseEnrollmentTemp
  | CourseSyncConfiguration
  | CourseTemp
  | EvidenceItem
  | Guarantee
  | Invitation
  | Market
  | Note
  | Notification
  | Product
  | Project
  | ProjectMember
  | System
  | SystemMember;

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

export type CfContentArticleNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfContentArticleNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfContentArticleNestedFilter>>>;
  body_contains?: InputMaybe<Scalars["String"]>;
  body_exists?: InputMaybe<Scalars["Boolean"]>;
  body_not_contains?: InputMaybe<Scalars["String"]>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  relativePath?: InputMaybe<Scalars["String"]>;
  relativePath_contains?: InputMaybe<Scalars["String"]>;
  relativePath_exists?: InputMaybe<Scalars["Boolean"]>;
  relativePath_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  relativePath_not?: InputMaybe<Scalars["String"]>;
  relativePath_not_contains?: InputMaybe<Scalars["String"]>;
  relativePath_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars["String"]>;
  title_contains?: InputMaybe<Scalars["String"]>;
  title_exists?: InputMaybe<Scalars["Boolean"]>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  title_not?: InputMaybe<Scalars["String"]>;
  title_not_contains?: InputMaybe<Scalars["String"]>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type CfMessageTemplateNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfMessageTemplateNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfMessageTemplateNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  emailBody?: InputMaybe<Scalars["String"]>;
  emailBody_contains?: InputMaybe<Scalars["String"]>;
  emailBody_exists?: InputMaybe<Scalars["Boolean"]>;
  emailBody_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  emailBody_not?: InputMaybe<Scalars["String"]>;
  emailBody_not_contains?: InputMaybe<Scalars["String"]>;
  emailBody_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  event?: InputMaybe<Scalars["String"]>;
  event_contains?: InputMaybe<Scalars["String"]>;
  event_exists?: InputMaybe<Scalars["Boolean"]>;
  event_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  event_not?: InputMaybe<Scalars["String"]>;
  event_not_contains?: InputMaybe<Scalars["String"]>;
  event_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  format_contains_all?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  format_contains_none?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  format_contains_some?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  format_exists?: InputMaybe<Scalars["Boolean"]>;
  notificationBody?: InputMaybe<Scalars["String"]>;
  notificationBody_contains?: InputMaybe<Scalars["String"]>;
  notificationBody_exists?: InputMaybe<Scalars["Boolean"]>;
  notificationBody_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  notificationBody_not?: InputMaybe<Scalars["String"]>;
  notificationBody_not_contains?: InputMaybe<Scalars["String"]>;
  notificationBody_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  subject?: InputMaybe<Scalars["String"]>;
  subject_contains?: InputMaybe<Scalars["String"]>;
  subject_exists?: InputMaybe<Scalars["Boolean"]>;
  subject_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  subject_not?: InputMaybe<Scalars["String"]>;
  subject_not_contains?: InputMaybe<Scalars["String"]>;
  subject_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ResetPasswordImportedUsersInput = {
  market?: InputMaybe<Scalars["String"]>;
};

export type ResetPasswordImportedUsersResult = {
  __typename?: "resetPasswordImportedUsersResult";
  result?: Maybe<Scalars["String"]>;
};

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnAccountForAccountMarketIdFkeyPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnCertificationForCertificationDoceboUserIdFkeyPatch =
  {
    certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
    companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
    /** When the account was created */
    created?: InputMaybe<Scalars["Datetime"]>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Username in Docebo.  Needed to generate the SSO link */
    doceboUsername?: InputMaybe<Scalars["String"]>;
    /** The email address associated with the account */
    email?: InputMaybe<Scalars["String"]>;
    /** First name */
    firstName?: InputMaybe<Scalars["String"]>;
    guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
    guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
    /** Last name */
    lastName?: InputMaybe<Scalars["String"]>;
    /** fk */
    marketId?: InputMaybe<Scalars["Int"]>;
    marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
    /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
    migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
    /** Used for reference when importing data from the legacy system */
    migrationId?: InputMaybe<Scalars["String"]>;
    notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
    notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
    /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
    phone?: InputMaybe<Scalars["String"]>;
    /** File reference. A profile picture of the user */
    photo?: InputMaybe<Scalars["String"]>;
    photoUpload?: InputMaybe<Scalars["Upload"]>;
    projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
    /** ek */
    role?: InputMaybe<Role>;
    shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
    /** ek */
    status?: InputMaybe<AccountStatus>;
    termsCondition?: InputMaybe<Scalars["Boolean"]>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnCompanyMemberForCompanyMemberAccountIdFkeyPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnGuaranteeForGuaranteeRequestorAccountIdFkeyPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnGuaranteeForGuaranteeReviewerAccountIdFkeyPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnInvitationForInvitationSenderAccountIdFkeyPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnNoteForNoteAuthorIdFkeyPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnNotificationForNotificationAccountIdFkeyPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `account` being updated. */
export type UpdateAccountOnProjectMemberForProjectMemberAccountIdFkeyPatch = {
  certificationsUsingDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberAccountIdFkeyInverseInput>;
  /** When the account was created */
  created?: InputMaybe<Scalars["Datetime"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** User account in Docebo */
  doceboUserId?: InputMaybe<Scalars["Int"]>;
  /** Username in Docebo.  Needed to generate the SSO link */
  doceboUsername?: InputMaybe<Scalars["String"]>;
  /** The email address associated with the account */
  email?: InputMaybe<Scalars["String"]>;
  /** First name */
  firstName?: InputMaybe<Scalars["String"]>;
  guaranteesToRequestorAccountIdUsingId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInverseInput>;
  guaranteesToReviewerAccountIdUsingId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationSenderAccountIdFkeyInverseInput>;
  /** Last name */
  lastName?: InputMaybe<Scalars["String"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<AccountMarketIdFkeyInput>;
  /** Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent) */
  migratedToAuth0?: InputMaybe<Scalars["Boolean"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteAuthorIdFkeyInverseInput>;
  notificationsUsingId?: InputMaybe<NotificationAccountIdFkeyInverseInput>;
  /** A phone number that can optionally be provided, and is useful for Company Admin people to provide */
  phone?: InputMaybe<Scalars["String"]>;
  /** File reference. A profile picture of the user */
  photo?: InputMaybe<Scalars["String"]>;
  photoUpload?: InputMaybe<Scalars["Upload"]>;
  projectMembersUsingId?: InputMaybe<ProjectMemberAccountIdFkeyInverseInput>;
  /** ek */
  role?: InputMaybe<Role>;
  shouldRemovePhoto?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<AccountStatus>;
  termsCondition?: InputMaybe<Scalars["Boolean"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `address` being updated. */
export type UpdateAddressOnCompanyForCompanyRegisteredAddressIdFkeyPatch = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `address` being updated. */
export type UpdateAddressOnCompanyForCompanyTradingAddressIdFkeyPatch = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `address` being updated. */
export type UpdateAddressOnProjectForProjectBuildingOwnerAddressIdFkeyPatch = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `address` being updated. */
export type UpdateAddressOnProjectForProjectSiteAddressIdFkeyPatch = {
  companiesToRegisteredAddressIdUsingId?: InputMaybe<CompanyRegisteredAddressIdFkeyInverseInput>;
  companiesToTradingAddressIdUsingId?: InputMaybe<CompanyTradingAddressIdFkeyInverseInput>;
  /** The coordinates on a map of the world */
  coordinates?: InputMaybe<PointInput>;
  /** The country for this address */
  country?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** First line of this address */
  firstLine?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: InputMaybe<Scalars["String"]>;
  projectsToBuildingOwnerAddressIdUsingId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInverseInput>;
  projectsToSiteAddressIdUsingId?: InputMaybe<ProjectSiteAddressIdFkeyInverseInput>;
  /** The region if relevant */
  region?: InputMaybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: InputMaybe<Scalars["String"]>;
  /** The postal town */
  town?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `certification` being updated. */
export type UpdateCertificationOnCertificationForCertificationDoceboUserIdFkeyPatch =
  {
    accountToDoceboUserId?: InputMaybe<CertificationDoceboUserIdFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** The last day that this certification is valid */
    expiryDate?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** The name of the certification according to Docebo */
    name?: InputMaybe<Scalars["String"]>;
    /** technology */
    technology?: InputMaybe<Scalars["String"]>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `companyDocument` being updated. */
export type UpdateCompanyDocumentOnCompanyDocumentForCompanyDocumentCompanyIdFkeyPatch =
  {
    companyToCompanyId?: InputMaybe<CompanyDocumentCompanyIdFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** The reference to the document */
    document?: InputMaybe<Scalars["String"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `companyMember` being updated. */
export type UpdateCompanyMemberOnCompanyMemberForCompanyMemberAccountIdFkeyPatch =
  {
    accountToAccountId?: InputMaybe<CompanyMemberAccountIdFkeyInput>;
    /** fk */
    companyId?: InputMaybe<Scalars["Int"]>;
    companyToCompanyId?: InputMaybe<CompanyMemberCompanyIdFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** fk */
    marketId?: InputMaybe<Scalars["Int"]>;
    marketToMarketId?: InputMaybe<CompanyMemberMarketIdFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `companyMember` being updated. */
export type UpdateCompanyMemberOnCompanyMemberForCompanyMemberCompanyIdFkeyPatch =
  {
    /** fk */
    accountId?: InputMaybe<Scalars["Int"]>;
    accountToAccountId?: InputMaybe<CompanyMemberAccountIdFkeyInput>;
    companyToCompanyId?: InputMaybe<CompanyMemberCompanyIdFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** fk */
    marketId?: InputMaybe<Scalars["Int"]>;
    marketToMarketId?: InputMaybe<CompanyMemberMarketIdFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `companyMember` being updated. */
export type UpdateCompanyMemberOnCompanyMemberForCompanyMemberMarketIdFkeyPatch =
  {
    /** fk */
    accountId?: InputMaybe<Scalars["Int"]>;
    accountToAccountId?: InputMaybe<CompanyMemberAccountIdFkeyInput>;
    /** fk */
    companyId?: InputMaybe<Scalars["Int"]>;
    companyToCompanyId?: InputMaybe<CompanyMemberCompanyIdFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    marketToMarketId?: InputMaybe<CompanyMemberMarketIdFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `company` being updated. */
export type UpdateCompanyOnCompanyDocumentForCompanyDocumentCompanyIdFkeyPatch =
  {
    /** A descirption of the Company intended for Find a Roofer */
    aboutUs?: InputMaybe<Scalars["String"]>;
    addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
    addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
    /** ek */
    businessType?: InputMaybe<BusinessType>;
    companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
    companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
    companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** The Company facebook website */
    facebook?: InputMaybe<Scalars["String"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
    /** Their Company LinkedIn page URL */
    linkedIn?: InputMaybe<Scalars["String"]>;
    /** A reference to the logo image */
    logo?: InputMaybe<Scalars["String"]>;
    logoUpload?: InputMaybe<Scalars["Upload"]>;
    /** fk */
    marketId?: InputMaybe<Scalars["Int"]>;
    marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
    /** Used for reference when importing data from the legacy system */
    migrationId?: InputMaybe<Scalars["String"]>;
    /** The registered name of the Company */
    name?: InputMaybe<Scalars["String"]>;
    /** the email address to contact the owner */
    ownerEmail?: InputMaybe<Scalars["String"]>;
    /** the name of the owner of the Company */
    ownerFullname?: InputMaybe<Scalars["String"]>;
    /** the phone number to contact the owner */
    ownerPhone?: InputMaybe<Scalars["String"]>;
    /** The Company public phone number */
    phone?: InputMaybe<Scalars["String"]>;
    projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
    /** The email address that they can be contacted with by the public assuming they are listed */
    publicEmail?: InputMaybe<Scalars["String"]>;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber?: InputMaybe<Scalars["Int"]>;
    /** fk */
    registeredAddressId?: InputMaybe<Scalars["Int"]>;
    /** Used for reference when importing data from the legacy system */
    registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
    /** the email address of the person who filled out the company registration form */
    registeredBy?: InputMaybe<Scalars["String"]>;
    /** the date that the Company registration form was submitted */
    registeredDate?: InputMaybe<Scalars["Datetime"]>;
    shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
    /** ek */
    status?: InputMaybe<CompanyStatus>;
    /** The Tax number in that Market, such as the VAT number */
    taxNumber?: InputMaybe<Scalars["String"]>;
    /** ek */
    tier?: InputMaybe<Tier>;
    /** fk */
    tradingAddressId?: InputMaybe<Scalars["Int"]>;
    /** Used for reference when importing data from the legacy system */
    tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
    /** The Company website URL */
    website?: InputMaybe<Scalars["String"]>;
  };

/** An object where the defined keys will be set on the `company` being updated. */
export type UpdateCompanyOnCompanyForCompanyMarketIdFkeyPatch = {
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: InputMaybe<Scalars["String"]>;
  addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
  addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
  /** ek */
  businessType?: InputMaybe<BusinessType>;
  companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
  companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company facebook website */
  facebook?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
  /** Their Company LinkedIn page URL */
  linkedIn?: InputMaybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: InputMaybe<Scalars["String"]>;
  logoUpload?: InputMaybe<Scalars["Upload"]>;
  marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: InputMaybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: InputMaybe<Scalars["String"]>;
  /** the name of the owner of the Company */
  ownerFullname?: InputMaybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: InputMaybe<Scalars["String"]>;
  /** The Company public phone number */
  phone?: InputMaybe<Scalars["String"]>;
  projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: InputMaybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: InputMaybe<Scalars["Int"]>;
  /** fk */
  registeredAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: InputMaybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: InputMaybe<Scalars["Datetime"]>;
  shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<CompanyStatus>;
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: InputMaybe<Scalars["String"]>;
  /** ek */
  tier?: InputMaybe<Tier>;
  /** fk */
  tradingAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company website URL */
  website?: InputMaybe<Scalars["String"]>;
};

/** An object where the defined keys will be set on the `company` being updated. */
export type UpdateCompanyOnCompanyForCompanyRegisteredAddressIdFkeyPatch = {
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: InputMaybe<Scalars["String"]>;
  addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
  addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
  /** ek */
  businessType?: InputMaybe<BusinessType>;
  companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
  companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company facebook website */
  facebook?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
  /** Their Company LinkedIn page URL */
  linkedIn?: InputMaybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: InputMaybe<Scalars["String"]>;
  logoUpload?: InputMaybe<Scalars["Upload"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: InputMaybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: InputMaybe<Scalars["String"]>;
  /** the name of the owner of the Company */
  ownerFullname?: InputMaybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: InputMaybe<Scalars["String"]>;
  /** The Company public phone number */
  phone?: InputMaybe<Scalars["String"]>;
  projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: InputMaybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: InputMaybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: InputMaybe<Scalars["Datetime"]>;
  shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<CompanyStatus>;
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: InputMaybe<Scalars["String"]>;
  /** ek */
  tier?: InputMaybe<Tier>;
  /** fk */
  tradingAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company website URL */
  website?: InputMaybe<Scalars["String"]>;
};

/** An object where the defined keys will be set on the `company` being updated. */
export type UpdateCompanyOnCompanyForCompanyTradingAddressIdFkeyPatch = {
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: InputMaybe<Scalars["String"]>;
  addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
  addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
  /** ek */
  businessType?: InputMaybe<BusinessType>;
  companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
  companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company facebook website */
  facebook?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
  /** Their Company LinkedIn page URL */
  linkedIn?: InputMaybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: InputMaybe<Scalars["String"]>;
  logoUpload?: InputMaybe<Scalars["Upload"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: InputMaybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: InputMaybe<Scalars["String"]>;
  /** the name of the owner of the Company */
  ownerFullname?: InputMaybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: InputMaybe<Scalars["String"]>;
  /** The Company public phone number */
  phone?: InputMaybe<Scalars["String"]>;
  projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: InputMaybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: InputMaybe<Scalars["Int"]>;
  /** fk */
  registeredAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: InputMaybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: InputMaybe<Scalars["Datetime"]>;
  shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<CompanyStatus>;
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: InputMaybe<Scalars["String"]>;
  /** ek */
  tier?: InputMaybe<Tier>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company website URL */
  website?: InputMaybe<Scalars["String"]>;
};

/** An object where the defined keys will be set on the `company` being updated. */
export type UpdateCompanyOnCompanyMemberForCompanyMemberCompanyIdFkeyPatch = {
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: InputMaybe<Scalars["String"]>;
  addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
  addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
  /** ek */
  businessType?: InputMaybe<BusinessType>;
  companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
  companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company facebook website */
  facebook?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
  /** Their Company LinkedIn page URL */
  linkedIn?: InputMaybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: InputMaybe<Scalars["String"]>;
  logoUpload?: InputMaybe<Scalars["Upload"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: InputMaybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: InputMaybe<Scalars["String"]>;
  /** the name of the owner of the Company */
  ownerFullname?: InputMaybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: InputMaybe<Scalars["String"]>;
  /** The Company public phone number */
  phone?: InputMaybe<Scalars["String"]>;
  projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: InputMaybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: InputMaybe<Scalars["Int"]>;
  /** fk */
  registeredAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: InputMaybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: InputMaybe<Scalars["Datetime"]>;
  shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<CompanyStatus>;
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: InputMaybe<Scalars["String"]>;
  /** ek */
  tier?: InputMaybe<Tier>;
  /** fk */
  tradingAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company website URL */
  website?: InputMaybe<Scalars["String"]>;
};

/** An object where the defined keys will be set on the `company` being updated. */
export type UpdateCompanyOnCompanyOperationForCompanyOperationCompanyFkeyPatch =
  {
    /** A descirption of the Company intended for Find a Roofer */
    aboutUs?: InputMaybe<Scalars["String"]>;
    addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
    addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
    /** ek */
    businessType?: InputMaybe<BusinessType>;
    companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
    companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
    companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** The Company facebook website */
    facebook?: InputMaybe<Scalars["String"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
    /** Their Company LinkedIn page URL */
    linkedIn?: InputMaybe<Scalars["String"]>;
    /** A reference to the logo image */
    logo?: InputMaybe<Scalars["String"]>;
    logoUpload?: InputMaybe<Scalars["Upload"]>;
    /** fk */
    marketId?: InputMaybe<Scalars["Int"]>;
    marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
    /** Used for reference when importing data from the legacy system */
    migrationId?: InputMaybe<Scalars["String"]>;
    /** The registered name of the Company */
    name?: InputMaybe<Scalars["String"]>;
    /** the email address to contact the owner */
    ownerEmail?: InputMaybe<Scalars["String"]>;
    /** the name of the owner of the Company */
    ownerFullname?: InputMaybe<Scalars["String"]>;
    /** the phone number to contact the owner */
    ownerPhone?: InputMaybe<Scalars["String"]>;
    /** The Company public phone number */
    phone?: InputMaybe<Scalars["String"]>;
    projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
    /** The email address that they can be contacted with by the public assuming they are listed */
    publicEmail?: InputMaybe<Scalars["String"]>;
    /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
    referenceNumber?: InputMaybe<Scalars["Int"]>;
    /** fk */
    registeredAddressId?: InputMaybe<Scalars["Int"]>;
    /** Used for reference when importing data from the legacy system */
    registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
    /** the email address of the person who filled out the company registration form */
    registeredBy?: InputMaybe<Scalars["String"]>;
    /** the date that the Company registration form was submitted */
    registeredDate?: InputMaybe<Scalars["Datetime"]>;
    shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
    /** ek */
    status?: InputMaybe<CompanyStatus>;
    /** The Tax number in that Market, such as the VAT number */
    taxNumber?: InputMaybe<Scalars["String"]>;
    /** ek */
    tier?: InputMaybe<Tier>;
    /** fk */
    tradingAddressId?: InputMaybe<Scalars["Int"]>;
    /** Used for reference when importing data from the legacy system */
    tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
    /** The Company website URL */
    website?: InputMaybe<Scalars["String"]>;
  };

/** An object where the defined keys will be set on the `company` being updated. */
export type UpdateCompanyOnInvitationForInvitationCompanyIdFkeyPatch = {
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: InputMaybe<Scalars["String"]>;
  addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
  addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
  /** ek */
  businessType?: InputMaybe<BusinessType>;
  companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
  companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company facebook website */
  facebook?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
  /** Their Company LinkedIn page URL */
  linkedIn?: InputMaybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: InputMaybe<Scalars["String"]>;
  logoUpload?: InputMaybe<Scalars["Upload"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: InputMaybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: InputMaybe<Scalars["String"]>;
  /** the name of the owner of the Company */
  ownerFullname?: InputMaybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: InputMaybe<Scalars["String"]>;
  /** The Company public phone number */
  phone?: InputMaybe<Scalars["String"]>;
  projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: InputMaybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: InputMaybe<Scalars["Int"]>;
  /** fk */
  registeredAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: InputMaybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: InputMaybe<Scalars["Datetime"]>;
  shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<CompanyStatus>;
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: InputMaybe<Scalars["String"]>;
  /** ek */
  tier?: InputMaybe<Tier>;
  /** fk */
  tradingAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company website URL */
  website?: InputMaybe<Scalars["String"]>;
};

/** An object where the defined keys will be set on the `company` being updated. */
export type UpdateCompanyOnProjectForProjectCompanyIdFkeyPatch = {
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: InputMaybe<Scalars["String"]>;
  addressToRegisteredAddressId?: InputMaybe<CompanyRegisteredAddressIdFkeyInput>;
  addressToTradingAddressId?: InputMaybe<CompanyTradingAddressIdFkeyInput>;
  /** ek */
  businessType?: InputMaybe<BusinessType>;
  companyDocumentsUsingId?: InputMaybe<CompanyDocumentCompanyIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberCompanyIdFkeyInverseInput>;
  companyOperationsUsingId?: InputMaybe<CompanyOperationCompanyFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company facebook website */
  facebook?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  invitationsUsingId?: InputMaybe<InvitationCompanyIdFkeyInverseInput>;
  /** Their Company LinkedIn page URL */
  linkedIn?: InputMaybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: InputMaybe<Scalars["String"]>;
  logoUpload?: InputMaybe<Scalars["Upload"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<CompanyMarketIdFkeyInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: InputMaybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: InputMaybe<Scalars["String"]>;
  /** the email address to contact the owner */
  ownerEmail?: InputMaybe<Scalars["String"]>;
  /** the name of the owner of the Company */
  ownerFullname?: InputMaybe<Scalars["String"]>;
  /** the phone number to contact the owner */
  ownerPhone?: InputMaybe<Scalars["String"]>;
  /** The Company public phone number */
  phone?: InputMaybe<Scalars["String"]>;
  projectsUsingId?: InputMaybe<ProjectCompanyIdFkeyInverseInput>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: InputMaybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: InputMaybe<Scalars["Int"]>;
  /** fk */
  registeredAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: InputMaybe<Scalars["String"]>;
  /** the email address of the person who filled out the company registration form */
  registeredBy?: InputMaybe<Scalars["String"]>;
  /** the date that the Company registration form was submitted */
  registeredDate?: InputMaybe<Scalars["Datetime"]>;
  shouldRemoveLogo?: InputMaybe<Scalars["Boolean"]>;
  /** ek */
  status?: InputMaybe<CompanyStatus>;
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: InputMaybe<Scalars["String"]>;
  /** ek */
  tier?: InputMaybe<Tier>;
  /** fk */
  tradingAddressId?: InputMaybe<Scalars["Int"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
  /** The Company website URL */
  website?: InputMaybe<Scalars["String"]>;
};

/** An object where the defined keys will be set on the `companyOperation` being updated. */
export type UpdateCompanyOperationOnCompanyOperationForCompanyOperationCompanyFkeyPatch =
  {
    companyToCompany?: InputMaybe<CompanyOperationCompanyFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** ek */
    operation?: InputMaybe<Operation>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `evidenceItem` being updated. */
export type UpdateEvidenceItemOnEvidenceItemForEvidenceItemGuaranteeIdFkeyPatch =
  {
    /** File reference or the file itself. Photo of the evidence */
    attachment?: InputMaybe<Scalars["String"]>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** ek */
    customEvidenceCategoryKey?: InputMaybe<CustomEvidenceCategoryKey>;
    /** ek */
    evidenceCategoryType?: InputMaybe<EvidenceCategoryType>;
    guaranteeToGuaranteeId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInput>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** Short name for the item of evidence */
    name?: InputMaybe<Scalars["String"]>;
    /** fk */
    projectId?: InputMaybe<Scalars["Int"]>;
    projectToProjectId?: InputMaybe<EvidenceItemProjectIdFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `evidenceItem` being updated. */
export type UpdateEvidenceItemOnEvidenceItemForEvidenceItemProjectIdFkeyPatch =
  {
    /** File reference or the file itself. Photo of the evidence */
    attachment?: InputMaybe<Scalars["String"]>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** ek */
    customEvidenceCategoryKey?: InputMaybe<CustomEvidenceCategoryKey>;
    /** ek */
    evidenceCategoryType?: InputMaybe<EvidenceCategoryType>;
    /** fk */
    guaranteeId?: InputMaybe<Scalars["Int"]>;
    guaranteeToGuaranteeId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInput>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** Short name for the item of evidence */
    name?: InputMaybe<Scalars["String"]>;
    projectToProjectId?: InputMaybe<EvidenceItemProjectIdFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `guarantee` being updated. */
export type UpdateGuaranteeOnEvidenceItemForEvidenceItemGuaranteeIdFkeyPatch = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode?: InputMaybe<GuaranteeReferenceCode>;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `guarantee` being updated. */
export type UpdateGuaranteeOnGuaranteeForGuaranteeProductBmiRefFkeyPatch = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode?: InputMaybe<GuaranteeReferenceCode>;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `guarantee` being updated. */
export type UpdateGuaranteeOnGuaranteeForGuaranteeProjectIdFkeyPatch = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode?: InputMaybe<GuaranteeReferenceCode>;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `guarantee` being updated. */
export type UpdateGuaranteeOnGuaranteeForGuaranteeRequestorAccountIdFkeyPatch =
  {
    accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
    accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
    /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
    bmiReferenceId?: InputMaybe<Scalars["String"]>;
    /** ek */
    coverage?: InputMaybe<GuaranteeCoverage>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
    /**
     * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
     * The date is stored in UTC.
     */
    expiryDate?: InputMaybe<Scalars["Datetime"]>;
    /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
    fileStorageId?: InputMaybe<Scalars["String"]>;
    /** ek */
    guaranteeReferenceCode?: InputMaybe<GuaranteeReferenceCode>;
    /** Primary key - starts at 6100 */
    id?: InputMaybe<Scalars["Int"]>;
    /** ek */
    languageCode?: InputMaybe<Language>;
    /** fk */
    productBmiRef?: InputMaybe<Scalars["String"]>;
    productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
    /** fk */
    projectId?: InputMaybe<Scalars["Int"]>;
    projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
    /** fk */
    reviewerAccountId?: InputMaybe<Scalars["Int"]>;
    /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
    startDate?: InputMaybe<Scalars["Datetime"]>;
    /** ek */
    status?: InputMaybe<RequestStatus>;
    /** fk */
    systemBmiRef?: InputMaybe<Scalars["String"]>;
    systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `guarantee` being updated. */
export type UpdateGuaranteeOnGuaranteeForGuaranteeReviewerAccountIdFkeyPatch = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode?: InputMaybe<GuaranteeReferenceCode>;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `guarantee` being updated. */
export type UpdateGuaranteeOnGuaranteeForGuaranteeSystemBmiRefFkeyPatch = {
  accountToRequestorAccountId?: InputMaybe<GuaranteeRequestorAccountIdFkeyInput>;
  accountToReviewerAccountId?: InputMaybe<GuaranteeReviewerAccountIdFkeyInput>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: InputMaybe<Scalars["String"]>;
  /** ek */
  coverage?: InputMaybe<GuaranteeCoverage>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemGuaranteeIdFkeyInverseInput>;
  /**
   * When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
   * The date is stored in UTC.
   */
  expiryDate?: InputMaybe<Scalars["Datetime"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: InputMaybe<Scalars["String"]>;
  /** ek */
  guaranteeReferenceCode?: InputMaybe<GuaranteeReferenceCode>;
  /** Primary key - starts at 6100 */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  languageCode?: InputMaybe<Language>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInput>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<GuaranteeProjectIdFkeyInput>;
  /** fk */
  requestorAccountId?: InputMaybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Guarantee is approved either automatically or manually. The date is stored in UTC. */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  status?: InputMaybe<RequestStatus>;
  systemToSystemBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `invitation` being updated. */
export type UpdateInvitationOnInvitationForInvitationCompanyIdFkeyPatch = {
  accountToSenderAccountId?: InputMaybe<InvitationSenderAccountIdFkeyInput>;
  companyToCompanyId?: InputMaybe<InvitationCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** An email address */
  invitee?: InputMaybe<Scalars["String"]>;
  /** An optional note that can be included in the invitation by the sender */
  personalNote?: InputMaybe<Scalars["String"]>;
  /** fk */
  senderAccountId?: InputMaybe<Scalars["Int"]>;
  /** ek */
  status?: InputMaybe<InvitationStatus>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `invitation` being updated. */
export type UpdateInvitationOnInvitationForInvitationSenderAccountIdFkeyPatch =
  {
    accountToSenderAccountId?: InputMaybe<InvitationSenderAccountIdFkeyInput>;
    /** fk */
    companyId?: InputMaybe<Scalars["Int"]>;
    companyToCompanyId?: InputMaybe<InvitationCompanyIdFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** An email address */
    invitee?: InputMaybe<Scalars["String"]>;
    /** An optional note that can be included in the invitation by the sender */
    personalNote?: InputMaybe<Scalars["String"]>;
    /** ek */
    status?: InputMaybe<InvitationStatus>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `market` being updated. */
export type UpdateMarketOnAccountForAccountMarketIdFkeyPatch = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain?: InputMaybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language?: InputMaybe<Language>;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `market` being updated. */
export type UpdateMarketOnCompanyForCompanyMarketIdFkeyPatch = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain?: InputMaybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language?: InputMaybe<Language>;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `market` being updated. */
export type UpdateMarketOnCompanyMemberForCompanyMemberMarketIdFkeyPatch = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain?: InputMaybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language?: InputMaybe<Language>;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `market` being updated. */
export type UpdateMarketOnProductForProductMarketIdFkeyPatch = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain?: InputMaybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language?: InputMaybe<Language>;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `market` being updated. */
export type UpdateMarketOnSystemForSystemMarketIdFkeyPatch = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain?: InputMaybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language?: InputMaybe<Language>;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `market` being updated. */
export type UpdateMarketOnSystemMemberForSystemMemberMarketIdFkeyPatch = {
  accountsUsingId?: InputMaybe<AccountMarketIdFkeyInverseInput>;
  /** The space in Contenful */
  cmsSpaceId?: InputMaybe<Scalars["String"]>;
  companiesUsingId?: InputMaybe<CompanyMarketIdFkeyInverseInput>;
  companyMembersUsingId?: InputMaybe<CompanyMemberMarketIdFkeyInverseInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT2?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT3?: InputMaybe<Scalars["Int"]>;
  doceboCatalogueIdT4?: InputMaybe<Scalars["Int"]>;
  /** The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboCompanyAdminBranchId?: InputMaybe<Scalars["String"]>;
  /** The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach. */
  doceboInstallersBranchId?: InputMaybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain?: InputMaybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
  geoMiddle?: InputMaybe<PointInput>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: InputMaybe<Scalars["String"]>;
  gtagMarketMedia?: InputMaybe<Scalars["String"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** ek */
  language?: InputMaybe<Language>;
  /** The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded. */
  locationBiasRadiusKm?: InputMaybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: InputMaybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: InputMaybe<Scalars["String"]>;
  productsUsingId?: InputMaybe<ProductMarketIdFkeyInverseInput>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: InputMaybe<Scalars["Boolean"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: InputMaybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: InputMaybe<Scalars["String"]>;
  systemMembersUsingId?: InputMaybe<SystemMemberMarketIdFkeyInverseInput>;
  systemsUsingId?: InputMaybe<SystemMarketIdFkeyInverseInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `note` being updated. */
export type UpdateNoteOnNoteForNoteAuthorIdFkeyPatch = {
  accountToAuthorId?: InputMaybe<NoteAuthorIdFkeyInput>;
  /** The body of the Note */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  projectId?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<NoteProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `note` being updated. */
export type UpdateNoteOnNoteForNoteProjectIdFkeyPatch = {
  accountToAuthorId?: InputMaybe<NoteAuthorIdFkeyInput>;
  /** fk */
  authorId?: InputMaybe<Scalars["Int"]>;
  /** The body of the Note */
  body?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  projectToProjectId?: InputMaybe<NoteProjectIdFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `notification` being updated. */
export type UpdateNotificationOnNotificationForNotificationAccountIdFkeyPatch =
  {
    accountToAccountId?: InputMaybe<NotificationAccountIdFkeyInput>;
    /** The body of the message */
    body?: InputMaybe<Scalars["String"]>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** Whether the message has been read */
    read?: InputMaybe<Scalars["Boolean"]>;
    /** The datetime stamp for when the message was sent */
    sendDate?: InputMaybe<Scalars["Datetime"]>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `product` being updated. */
export type UpdateProductOnGuaranteeForGuaranteeProductBmiRefFkeyPatch = {
  /** A unique reference for the product known to BMI */
  bmiRef?: InputMaybe<Scalars["String"]>;
  /** The Products brand */
  brand?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description of the Product */
  description?: InputMaybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<ProductMarketIdFkeyInput>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Product */
  name?: InputMaybe<Scalars["String"]>;
  /** Whether the Product is avialable for new guarantees */
  published?: InputMaybe<Scalars["Boolean"]>;
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInverseInput>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `product` being updated. */
export type UpdateProductOnProductForProductMarketIdFkeyPatch = {
  /** A unique reference for the product known to BMI */
  bmiRef?: InputMaybe<Scalars["String"]>;
  /** The Products brand */
  brand?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description of the Product */
  description?: InputMaybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<ProductMarketIdFkeyInput>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Product */
  name?: InputMaybe<Scalars["String"]>;
  /** Whether the Product is avialable for new guarantees */
  published?: InputMaybe<Scalars["Boolean"]>;
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInverseInput>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `product` being updated. */
export type UpdateProductOnSystemMemberForSystemMemberProductBmiRefFkeyPatch = {
  /** A unique reference for the product known to BMI */
  bmiRef?: InputMaybe<Scalars["String"]>;
  /** The Products brand */
  brand?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description of the Product */
  description?: InputMaybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeProductBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<ProductMarketIdFkeyInput>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Product */
  name?: InputMaybe<Scalars["String"]>;
  /** Whether the Product is avialable for new guarantees */
  published?: InputMaybe<Scalars["Boolean"]>;
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInverseInput>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `projectMember` being updated. */
export type UpdateProjectMemberOnProjectMemberForProjectMemberAccountIdFkeyPatch =
  {
    accountToAccountId?: InputMaybe<ProjectMemberAccountIdFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** The responsible installer */
    isResponsibleInstaller?: InputMaybe<Scalars["Boolean"]>;
    /** fk */
    projectId?: InputMaybe<Scalars["Int"]>;
    projectToProjectId?: InputMaybe<ProjectMemberProjectIdFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `projectMember` being updated. */
export type UpdateProjectMemberOnProjectMemberForProjectMemberProjectIdFkeyPatch =
  {
    /** fk */
    accountId?: InputMaybe<Scalars["Int"]>;
    accountToAccountId?: InputMaybe<ProjectMemberAccountIdFkeyInput>;
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** The responsible installer */
    isResponsibleInstaller?: InputMaybe<Scalars["Boolean"]>;
    projectToProjectId?: InputMaybe<ProjectMemberProjectIdFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `project` being updated. */
export type UpdateProjectOnEvidenceItemForEvidenceItemProjectIdFkeyPatch = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea?: InputMaybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `project` being updated. */
export type UpdateProjectOnGuaranteeForGuaranteeProjectIdFkeyPatch = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea?: InputMaybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `project` being updated. */
export type UpdateProjectOnNoteForNoteProjectIdFkeyPatch = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea?: InputMaybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `project` being updated. */
export type UpdateProjectOnProjectForProjectBuildingOwnerAddressIdFkeyPatch = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea?: InputMaybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `project` being updated. */
export type UpdateProjectOnProjectForProjectCompanyIdFkeyPatch = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea?: InputMaybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `project` being updated. */
export type UpdateProjectOnProjectForProjectSiteAddressIdFkeyPatch = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `project` being updated. */
export type UpdateProjectOnProjectMemberForProjectMemberProjectIdFkeyPatch = {
  addressToBuildingOwnerAddressId?: InputMaybe<ProjectBuildingOwnerAddressIdFkeyInput>;
  addressToSiteAddressId?: InputMaybe<ProjectSiteAddressIdFkeyInput>;
  /** fk */
  buildingOwnerAddressId?: InputMaybe<Scalars["Int"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: InputMaybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: InputMaybe<Scalars["String"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: InputMaybe<Scalars["String"]>;
  /** fk */
  companyId?: InputMaybe<Scalars["Int"]>;
  companyToCompanyId?: InputMaybe<ProjectCompanyIdFkeyInput>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: InputMaybe<Scalars["String"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: InputMaybe<Scalars["Datetime"]>;
  evidenceItemsUsingId?: InputMaybe<EvidenceItemProjectIdFkeyInverseInput>;
  guaranteesUsingId?: InputMaybe<GuaranteeProjectIdFkeyInverseInput>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: InputMaybe<Scalars["Boolean"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** Short name for the Project */
  name?: InputMaybe<Scalars["String"]>;
  notesUsingId?: InputMaybe<NoteProjectIdFkeyInverseInput>;
  projectMembersUsingId?: InputMaybe<ProjectMemberProjectIdFkeyInverseInput>;
  /** The number of square meters of roof that this project covers */
  roofArea?: InputMaybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: InputMaybe<Scalars["Int"]>;
  /** The date that the Project officially starts or started */
  startDate?: InputMaybe<Scalars["Datetime"]>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `systemMember` being updated. */
export type UpdateSystemMemberOnSystemMemberForSystemMemberMarketIdFkeyPatch = {
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMemberMarketIdFkeyInput>;
  /** fk */
  productBmiRef?: InputMaybe<Scalars["String"]>;
  productToProductBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInput>;
  /** fk */
  systemBmiRef?: InputMaybe<Scalars["String"]>;
  systemToSystemBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInput>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `systemMember` being updated. */
export type UpdateSystemMemberOnSystemMemberForSystemMemberProductBmiRefFkeyPatch =
  {
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** fk */
    marketId?: InputMaybe<Scalars["Int"]>;
    marketToMarketId?: InputMaybe<SystemMemberMarketIdFkeyInput>;
    productToProductBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInput>;
    /** fk */
    systemBmiRef?: InputMaybe<Scalars["String"]>;
    systemToSystemBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `systemMember` being updated. */
export type UpdateSystemMemberOnSystemMemberForSystemMemberSystemBmiRefFkeyPatch =
  {
    createdAt?: InputMaybe<Scalars["Datetime"]>;
    /** Primary key */
    id?: InputMaybe<Scalars["Int"]>;
    /** fk */
    marketId?: InputMaybe<Scalars["Int"]>;
    marketToMarketId?: InputMaybe<SystemMemberMarketIdFkeyInput>;
    /** fk */
    productBmiRef?: InputMaybe<Scalars["String"]>;
    productToProductBmiRef?: InputMaybe<SystemMemberProductBmiRefFkeyInput>;
    systemToSystemBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInput>;
    updatedAt?: InputMaybe<Scalars["Datetime"]>;
  };

/** An object where the defined keys will be set on the `system` being updated. */
export type UpdateSystemOnGuaranteeForGuaranteeSystemBmiRefFkeyPatch = {
  /** A unique reference for the system known to BMI */
  bmiRef?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description for the System */
  description?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMarketIdFkeyInput>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  /** Short name for the System */
  name?: InputMaybe<Scalars["String"]>;
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published?: InputMaybe<Scalars["Boolean"]>;
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInverseInput>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `system` being updated. */
export type UpdateSystemOnSystemForSystemMarketIdFkeyPatch = {
  /** A unique reference for the system known to BMI */
  bmiRef?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description for the System */
  description?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMarketIdFkeyInput>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  /** Short name for the System */
  name?: InputMaybe<Scalars["String"]>;
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published?: InputMaybe<Scalars["Boolean"]>;
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInverseInput>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};

/** An object where the defined keys will be set on the `system` being updated. */
export type UpdateSystemOnSystemMemberForSystemMemberSystemBmiRefFkeyPatch = {
  /** A unique reference for the system known to BMI */
  bmiRef?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["Datetime"]>;
  /** A description for the System */
  description?: InputMaybe<Scalars["String"]>;
  guaranteesUsingBmiRef?: InputMaybe<GuaranteeSystemBmiRefFkeyInverseInput>;
  /** Primary key */
  id?: InputMaybe<Scalars["Int"]>;
  /** fk */
  marketId?: InputMaybe<Scalars["Int"]>;
  marketToMarketId?: InputMaybe<SystemMarketIdFkeyInput>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidityYears?: InputMaybe<Scalars["Int"]>;
  /** Short name for the System */
  name?: InputMaybe<Scalars["String"]>;
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published?: InputMaybe<Scalars["Boolean"]>;
  systemMembersUsingBmiRef?: InputMaybe<SystemMemberSystemBmiRefFkeyInverseInput>;
  /** ek */
  technology?: InputMaybe<Technology>;
  updatedAt?: InputMaybe<Scalars["Datetime"]>;
};
