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
  /** The email address associated with the account */
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
  /** File reference. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
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
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<Scalars["String"]>;
  /** Checks for equality with the object’s `doceboUserId` field. */
  doceboUserId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Account` */
export type AccountInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** ek */
  status?: Maybe<AccountStatus>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  role?: Maybe<Role>;
  /** The email address associated with the account */
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
  /** File reference. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
  marketCode?: Maybe<Scalars["String"]>;
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
  /** The email address associated with the account */
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
  /** File reference. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

export type AccountStatus = "NEW" | "ACTIVE" | "SUSPENDED";

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
export type AccountsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "EMAIL_ASC"
  | "EMAIL_DESC"
  | "DOCEBO_USER_ID_ASC"
  | "DOCEBO_USER_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A generic address */
export type Address = Node & {
  __typename?: "Address";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** First line of this address */
  firstLine?: Maybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: Maybe<Scalars["String"]>;
  /** The postal town */
  town?: Maybe<Scalars["String"]>;
  /** The region if relevant */
  region?: Maybe<Scalars["String"]>;
  /** The country for this address */
  country?: Maybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: Maybe<Scalars["String"]>;
  /** The coordinates on a map of the world */
  coordinates?: Maybe<Point>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads and enables pagination through a set of `Company`. */
  companiesByRegisteredAddressId: CompaniesConnection;
  /** Reads and enables pagination through a set of `Company`. */
  companiesByTradingAddressId: CompaniesConnection;
  /** Reads and enables pagination through a set of `Project`. */
  projectsBySiteAddressId: ProjectsConnection;
  /** Reads and enables pagination through a set of `Project`. */
  projectsByBuildingOwnerAddressId: ProjectsConnection;
};

/** A generic address */
export type AddressCompaniesByRegisteredAddressIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
  condition?: Maybe<CompanyCondition>;
};

/** A generic address */
export type AddressCompaniesByTradingAddressIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
  condition?: Maybe<CompanyCondition>;
};

/** A generic address */
export type AddressProjectsBySiteAddressIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
  condition?: Maybe<ProjectCondition>;
};

/** A generic address */
export type AddressProjectsByBuildingOwnerAddressIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
  condition?: Maybe<ProjectCondition>;
};

/** A condition to be used against `Address` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AddressCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Address` */
export type AddressInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** First line of this address */
  firstLine?: Maybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: Maybe<Scalars["String"]>;
  /** The postal town */
  town?: Maybe<Scalars["String"]>;
  /** The region if relevant */
  region?: Maybe<Scalars["String"]>;
  /** The country for this address */
  country?: Maybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: Maybe<Scalars["String"]>;
  /** The coordinates on a map of the world */
  coordinates?: Maybe<PointInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Address`. Fields that are set will be updated. */
export type AddressPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** First line of this address */
  firstLine?: Maybe<Scalars["String"]>;
  /** Second line of this address */
  secondLine?: Maybe<Scalars["String"]>;
  /** The postal town */
  town?: Maybe<Scalars["String"]>;
  /** The region if relevant */
  region?: Maybe<Scalars["String"]>;
  /** The country for this address */
  country?: Maybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: Maybe<Scalars["String"]>;
  /** The coordinates on a map of the world */
  coordinates?: Maybe<PointInput>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

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
export type AddressesOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** Represents a binary file in a space. An asset can be any file type. */
export type Asset = {
  __typename?: "Asset";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  contentType?: Maybe<Scalars["String"]>;
  fileName?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Int"]>;
  url?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["Int"]>;
  height?: Maybe<Scalars["Int"]>;
  linkedFrom?: Maybe<AssetLinkingCollections>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetUrlArgs = {
  transform?: Maybe<ImageTransformOptions>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type AssetCollection = {
  __typename?: "AssetCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<Asset>>;
};

export type AssetFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  title_exists?: Maybe<Scalars["Boolean"]>;
  title?: Maybe<Scalars["String"]>;
  title_not?: Maybe<Scalars["String"]>;
  title_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_contains?: Maybe<Scalars["String"]>;
  title_not_contains?: Maybe<Scalars["String"]>;
  description_exists?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
  description_not?: Maybe<Scalars["String"]>;
  description_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  description_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  description_contains?: Maybe<Scalars["String"]>;
  description_not_contains?: Maybe<Scalars["String"]>;
  url_exists?: Maybe<Scalars["Boolean"]>;
  url?: Maybe<Scalars["String"]>;
  url_not?: Maybe<Scalars["String"]>;
  url_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_contains?: Maybe<Scalars["String"]>;
  url_not_contains?: Maybe<Scalars["String"]>;
  size_exists?: Maybe<Scalars["Boolean"]>;
  size?: Maybe<Scalars["Int"]>;
  size_not?: Maybe<Scalars["Int"]>;
  size_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  size_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  size_gt?: Maybe<Scalars["Int"]>;
  size_gte?: Maybe<Scalars["Int"]>;
  size_lt?: Maybe<Scalars["Int"]>;
  size_lte?: Maybe<Scalars["Int"]>;
  contentType_exists?: Maybe<Scalars["Boolean"]>;
  contentType?: Maybe<Scalars["String"]>;
  contentType_not?: Maybe<Scalars["String"]>;
  contentType_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  contentType_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  contentType_contains?: Maybe<Scalars["String"]>;
  contentType_not_contains?: Maybe<Scalars["String"]>;
  fileName_exists?: Maybe<Scalars["Boolean"]>;
  fileName?: Maybe<Scalars["String"]>;
  fileName_not?: Maybe<Scalars["String"]>;
  fileName_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  fileName_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  fileName_contains?: Maybe<Scalars["String"]>;
  fileName_not_contains?: Maybe<Scalars["String"]>;
  width_exists?: Maybe<Scalars["Boolean"]>;
  width?: Maybe<Scalars["Int"]>;
  width_not?: Maybe<Scalars["Int"]>;
  width_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  width_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  width_gt?: Maybe<Scalars["Int"]>;
  width_gte?: Maybe<Scalars["Int"]>;
  width_lt?: Maybe<Scalars["Int"]>;
  width_lte?: Maybe<Scalars["Int"]>;
  height_exists?: Maybe<Scalars["Boolean"]>;
  height?: Maybe<Scalars["Int"]>;
  height_not?: Maybe<Scalars["Int"]>;
  height_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  height_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  height_gt?: Maybe<Scalars["Int"]>;
  height_gte?: Maybe<Scalars["Int"]>;
  height_lt?: Maybe<Scalars["Int"]>;
  height_lte?: Maybe<Scalars["Int"]>;
  OR?: Maybe<Array<Maybe<AssetFilter>>>;
  AND?: Maybe<Array<Maybe<AssetFilter>>>;
};

export type AssetLinkingCollections = {
  __typename?: "AssetLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
  carouselItemCollection?: Maybe<CarouselItemCollection>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
  trainingContentCollection?: Maybe<TrainingContentCollection>;
  partnerBrandCollection?: Maybe<PartnerBrandCollection>;
  mediaToolCollection?: Maybe<MediaToolCollection>;
};

export type AssetLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsGuaranteeTemplateCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsCarouselItemCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsGuaranteeTypeCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsTrainingContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsPartnerBrandCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsMediaToolCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetOrder =
  | "url_ASC"
  | "url_DESC"
  | "size_ASC"
  | "size_DESC"
  | "contentType_ASC"
  | "contentType_DESC"
  | "fileName_ASC"
  | "fileName_DESC"
  | "width_ASC"
  | "width_DESC"
  | "height_ASC"
  | "height_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

export type BulkImportInput = {
  files: Array<Scalars["Upload"]>;
  dryRun?: Maybe<Scalars["Boolean"]>;
};

export type BusinessType =
  | "CONTRACTOR"
  | "ARCHITECT"
  | "MERCHANT"
  | "CORP_DEVELOPER";

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carousel) */
export type Carousel = Entry & {
  __typename?: "Carousel";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<CarouselLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  listCollection?: Maybe<CarouselListCollection>;
  audienceRole?: Maybe<Scalars["String"]>;
};

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carousel) */
export type CarouselLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carousel) */
export type CarouselNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carousel) */
export type CarouselListCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** Ordered list of items to be rendered as a carousel. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carousel) */
export type CarouselAudienceRoleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type CarouselCollection = {
  __typename?: "CarouselCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<Carousel>>;
};

export type CarouselFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name_exists?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  listCollection_exists?: Maybe<Scalars["Boolean"]>;
  audienceRole_exists?: Maybe<Scalars["Boolean"]>;
  audienceRole?: Maybe<Scalars["String"]>;
  audienceRole_not?: Maybe<Scalars["String"]>;
  audienceRole_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  audienceRole_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  audienceRole_contains?: Maybe<Scalars["String"]>;
  audienceRole_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<CarouselFilter>>>;
  AND?: Maybe<Array<Maybe<CarouselFilter>>>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem) */
export type CarouselItem = Entry & {
  __typename?: "CarouselItem";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<CarouselItemLinkingCollections>;
  header?: Maybe<Scalars["String"]>;
  image?: Maybe<Asset>;
  body?: Maybe<Scalars["String"]>;
  cta?: Maybe<Scalars["String"]>;
  audienceTiers?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem) */
export type CarouselItemLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem) */
export type CarouselItemHeaderArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem) */
export type CarouselItemImageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem) */
export type CarouselItemBodyArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem) */
export type CarouselItemCtaArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem) */
export type CarouselItemAudienceTiersArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type CarouselItemCollection = {
  __typename?: "CarouselItemCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<CarouselItem>>;
};

export type CarouselItemFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  header_exists?: Maybe<Scalars["Boolean"]>;
  header?: Maybe<Scalars["String"]>;
  header_not?: Maybe<Scalars["String"]>;
  header_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  header_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  header_contains?: Maybe<Scalars["String"]>;
  header_not_contains?: Maybe<Scalars["String"]>;
  image_exists?: Maybe<Scalars["Boolean"]>;
  body_exists?: Maybe<Scalars["Boolean"]>;
  body?: Maybe<Scalars["String"]>;
  body_not?: Maybe<Scalars["String"]>;
  body_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  body_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  body_contains?: Maybe<Scalars["String"]>;
  body_not_contains?: Maybe<Scalars["String"]>;
  cta_exists?: Maybe<Scalars["Boolean"]>;
  cta?: Maybe<Scalars["String"]>;
  cta_not?: Maybe<Scalars["String"]>;
  cta_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  cta_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  cta_contains?: Maybe<Scalars["String"]>;
  cta_not_contains?: Maybe<Scalars["String"]>;
  audienceTiers_exists?: Maybe<Scalars["Boolean"]>;
  audienceTiers_contains_all?: Maybe<Array<Maybe<Scalars["String"]>>>;
  audienceTiers_contains_some?: Maybe<Array<Maybe<Scalars["String"]>>>;
  audienceTiers_contains_none?: Maybe<Array<Maybe<Scalars["String"]>>>;
  OR?: Maybe<Array<Maybe<CarouselItemFilter>>>;
  AND?: Maybe<Array<Maybe<CarouselItemFilter>>>;
};

export type CarouselItemLinkingCollections = {
  __typename?: "CarouselItemLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  carouselCollection?: Maybe<CarouselCollection>;
};

export type CarouselItemLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type CarouselItemLinkingCollectionsCarouselCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type CarouselItemOrder =
  | "header_ASC"
  | "header_DESC"
  | "cta_ASC"
  | "cta_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

export type CarouselLinkingCollections = {
  __typename?: "CarouselLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type CarouselLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type CarouselListCollection = {
  __typename?: "CarouselListCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<CarouselItem>>;
};

export type CarouselOrder =
  | "name_ASC"
  | "name_DESC"
  | "audienceRole_ASC"
  | "audienceRole_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

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
export type CertificationsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "DOCEBO_USER_ID_ASC"
  | "DOCEBO_USER_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

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
export type CompaniesOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "REGISTERED_ADDRESS_ID_ASC"
  | "REGISTERED_ADDRESS_ID_DESC"
  | "TRADING_ADDRESS_ID_ASC"
  | "TRADING_ADDRESS_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A company that has been registered in InTouch */
export type Company = Node & {
  __typename?: "Company";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** fk */
  registeredAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  tradingAddressId?: Maybe<Scalars["Int"]>;
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
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** They Company public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: Maybe<Scalars["String"]>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: Maybe<Scalars["String"]>;
  /** The Company website URL */
  website?: Maybe<Scalars["String"]>;
  /** The Company facebook website */
  facebook?: Maybe<Scalars["String"]>;
  /** Their Company LinkedIn page URL */
  linkedIn?: Maybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: Maybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
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
  /** Checks for equality with the object’s `registeredAddressId` field. */
  registeredAddressId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `tradingAddressId` field. */
  tradingAddressId?: Maybe<Scalars["Int"]>;
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
  /** The reference to the document */
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
  /** The reference to the document */
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
  /** The reference to the document */
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
export type CompanyDocumentsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "COMPANY_ID_ASC"
  | "COMPANY_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

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
export type CompanyMembersOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "ACCOUNT_ID_ASC"
  | "ACCOUNT_ID_DESC"
  | "COMPANY_ID_ASC"
  | "COMPANY_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

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
export type CompanyOperationsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "COMPANY_ASC"
  | "COMPANY_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** Represents an update to a `Company`. Fields that are set will be updated. */
export type CompanyPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** fk */
  registeredAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  tradingAddressId?: Maybe<Scalars["Int"]>;
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
  /** The Tax number in that Market, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** They Company public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** A descirption of the Company intended for Find a Roofer */
  aboutUs?: Maybe<Scalars["String"]>;
  /** The email address that they can be contacted with by the public assuming they are listed */
  publicEmail?: Maybe<Scalars["String"]>;
  /** The Company website URL */
  website?: Maybe<Scalars["String"]>;
  /** The Company facebook website */
  facebook?: Maybe<Scalars["String"]>;
  /** Their Company LinkedIn page URL */
  linkedIn?: Maybe<Scalars["String"]>;
  /** A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. */
  referenceNumber?: Maybe<Scalars["String"]>;
  /** A reference to the logo image */
  logo?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  migrationId?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  tradingAddressMigrationId?: Maybe<Scalars["String"]>;
  /** Used for reference when importing data from the legacy system */
  registeredAddressMigrationId?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

export type CompanyStatus = "NEW" | "ACTIVE" | "DEACTIVATED";

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contactDetails) */
export type ContactDetails = Entry & {
  __typename?: "ContactDetails";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ContactDetailsLinkingCollections>;
  fullName?: Maybe<Scalars["String"]>;
  subHeading?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contactDetails) */
export type ContactDetailsLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contactDetails) */
export type ContactDetailsFullNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contactDetails) */
export type ContactDetailsSubHeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contactDetails) */
export type ContactDetailsEmailArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Contact details that appear as cards on the Company Page [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contactDetails) */
export type ContactDetailsPhoneNumberArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type ContactDetailsCollection = {
  __typename?: "ContactDetailsCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<ContactDetails>>;
};

export type ContactDetailsFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  fullName_exists?: Maybe<Scalars["Boolean"]>;
  fullName?: Maybe<Scalars["String"]>;
  fullName_not?: Maybe<Scalars["String"]>;
  fullName_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  fullName_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  fullName_contains?: Maybe<Scalars["String"]>;
  fullName_not_contains?: Maybe<Scalars["String"]>;
  subHeading_exists?: Maybe<Scalars["Boolean"]>;
  subHeading?: Maybe<Scalars["String"]>;
  subHeading_not?: Maybe<Scalars["String"]>;
  subHeading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subHeading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subHeading_contains?: Maybe<Scalars["String"]>;
  subHeading_not_contains?: Maybe<Scalars["String"]>;
  email_exists?: Maybe<Scalars["Boolean"]>;
  email?: Maybe<Scalars["String"]>;
  email_not?: Maybe<Scalars["String"]>;
  email_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  email_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  email_contains?: Maybe<Scalars["String"]>;
  email_not_contains?: Maybe<Scalars["String"]>;
  phoneNumber_exists?: Maybe<Scalars["Boolean"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
  phoneNumber_not?: Maybe<Scalars["String"]>;
  phoneNumber_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  phoneNumber_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  phoneNumber_contains?: Maybe<Scalars["String"]>;
  phoneNumber_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<ContactDetailsFilter>>>;
  AND?: Maybe<Array<Maybe<ContactDetailsFilter>>>;
};

export type ContactDetailsLinkingCollections = {
  __typename?: "ContactDetailsLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  marketContentCollection?: Maybe<MarketContentCollection>;
};

export type ContactDetailsLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type ContactDetailsLinkingCollectionsMarketContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type ContactDetailsOrder =
  | "fullName_ASC"
  | "fullName_DESC"
  | "subHeading_ASC"
  | "subHeading_DESC"
  | "email_ASC"
  | "email_DESC"
  | "phoneNumber_ASC"
  | "phoneNumber_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle) */
export type ContentArticle = Entry & {
  __typename?: "ContentArticle";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ContentArticleLinkingCollections>;
  title?: Maybe<Scalars["String"]>;
  relativePath?: Maybe<Scalars["String"]>;
  body?: Maybe<ContentArticleBody>;
};

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle) */
export type ContentArticleLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle) */
export type ContentArticleTitleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle) */
export type ContentArticleRelativePathArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle) */
export type ContentArticleBodyArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type ContentArticleBody = {
  __typename?: "ContentArticleBody";
  json: Scalars["JSON"];
  links: ContentArticleBodyLinks;
};

export type ContentArticleBodyAssets = {
  __typename?: "ContentArticleBodyAssets";
  hyperlink: Array<Maybe<Asset>>;
  block: Array<Maybe<Asset>>;
};

export type ContentArticleBodyEntries = {
  __typename?: "ContentArticleBodyEntries";
  inline: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  block: Array<Maybe<Entry>>;
};

export type ContentArticleBodyLinks = {
  __typename?: "ContentArticleBodyLinks";
  entries: ContentArticleBodyEntries;
  assets: ContentArticleBodyAssets;
};

export type ContentArticleCollection = {
  __typename?: "ContentArticleCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<ContentArticle>>;
};

export type ContentArticleFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  title_exists?: Maybe<Scalars["Boolean"]>;
  title?: Maybe<Scalars["String"]>;
  title_not?: Maybe<Scalars["String"]>;
  title_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_contains?: Maybe<Scalars["String"]>;
  title_not_contains?: Maybe<Scalars["String"]>;
  relativePath_exists?: Maybe<Scalars["Boolean"]>;
  relativePath?: Maybe<Scalars["String"]>;
  relativePath_not?: Maybe<Scalars["String"]>;
  relativePath_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  relativePath_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  relativePath_contains?: Maybe<Scalars["String"]>;
  relativePath_not_contains?: Maybe<Scalars["String"]>;
  body_exists?: Maybe<Scalars["Boolean"]>;
  body_contains?: Maybe<Scalars["String"]>;
  body_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<ContentArticleFilter>>>;
  AND?: Maybe<Array<Maybe<ContentArticleFilter>>>;
};

export type ContentArticleLinkingCollections = {
  __typename?: "ContentArticleLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  marketContentCollection?: Maybe<MarketContentCollection>;
};

export type ContentArticleLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type ContentArticleLinkingCollectionsMarketContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type ContentArticleOrder =
  | "title_ASC"
  | "title_DESC"
  | "relativePath_ASC"
  | "relativePath_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

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

export type ContentfulGuaranteeCoverageType = "PRODUCT" | "SYSTEM" | "SOLUTION";

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

export type ContentfulMessageEventType =
  | "MEMBER_INVITED"
  | "NEWUSER_INVITED"
  | "PROFILE_REMINDER"
  | "ADMIN_INVITED"
  | "ROLE_ASSIGNED"
  | "OWNER_INVITED"
  | "REGISTRATION_CONGRATS"
  | "REGISTRATION_ACTIVATED"
  | "TEAM_JOINED"
  | "CERTIFICATION_EXPIRED"
  | "TIER_ASSIGNED"
  | "REQUEST_REJECTED"
  | "REQUEST_APPROVED";

export type ContentfulMessageFormat = "EMAIL" | "NOTIFICATION";

export type ContentfulMetadata = {
  __typename?: "ContentfulMetadata";
  tags: Array<Maybe<ContentfulTag>>;
};

export type ContentfulMetadataFilter = {
  tags_exists?: Maybe<Scalars["Boolean"]>;
  tags?: Maybe<ContentfulMetadataTagsFilter>;
};

export type ContentfulMetadataTagsFilter = {
  id_contains_all?: Maybe<Array<Maybe<Scalars["String"]>>>;
  id_contains_some?: Maybe<Array<Maybe<Scalars["String"]>>>;
  id_contains_none?: Maybe<Array<Maybe<Scalars["String"]>>>;
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

export type ContentfulTechnologyType = "FLAT" | "PITCHED" | "OTHER";

export type ContentfulTiers = "T1" | "T2" | "T3" | "T4";

/** A training course that BMI offers in Docebo */
export type Course = {
  __typename?: "Course";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** Docebo CourseId */
  courseId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A reference to the image */
  image?: Maybe<Scalars["String"]>;
  /** Promoted courses a listed higher than others */
  promoted?: Maybe<Scalars["Boolean"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: Maybe<Scalars["String"]>;
  /** Text description from Docebo */
  description?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads and enables pagination through a set of `CourseCatalogue`. */
  courseCatalogues: CourseCataloguesConnection;
  /** Reads and enables pagination through a set of `CourseEnrollment`. */
  courseEnrollments: CourseEnrollmentsConnection;
};

/** A training course that BMI offers in Docebo */
export type CourseCourseCataloguesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseCataloguesOrderBy>>;
  condition?: Maybe<CourseCatalogueCondition>;
};

/** A training course that BMI offers in Docebo */
export type CourseCourseEnrollmentsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseEnrollmentsOrderBy>>;
  condition?: Maybe<CourseEnrollmentCondition>;
};

/** Course Catalog */
export type CourseCatalogue = {
  __typename?: "CourseCatalogue";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** market */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** fk */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Course` that is related to this `CourseCatalogue`. */
  course?: Maybe<Course>;
};

/**
 * A condition to be used against `CourseCatalogue` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CourseCatalogueCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `catalogueId` field. */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `courseId` field. */
  courseId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseCatalogue` */
export type CourseCatalogueInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** market */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** fk */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseCatalogue`. Fields that are set will be updated. */
export type CourseCataloguePatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** market */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** fk */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Course Catalog temp table.  The course cataloogues from docebo are pulled into here first, before being merged into the course_catalogue table. */
export type CourseCatalogueTemp = {
  __typename?: "CourseCatalogueTemp";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** catalogue */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** course */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `CourseCatalogueTemp` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type CourseCatalogueTempCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseCatalogueTemp` */
export type CourseCatalogueTempInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** catalogue */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** course */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseCatalogueTemp`. Fields that are set will be updated. */
export type CourseCatalogueTempPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** catalogue */
  catalogueId?: Maybe<Scalars["Int"]>;
  /** course */
  courseId?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CourseCatalogueTemp` values. */
export type CourseCatalogueTempsConnection = {
  __typename?: "CourseCatalogueTempsConnection";
  /** A list of `CourseCatalogueTemp` objects. */
  nodes: Array<CourseCatalogueTemp>;
  /** A list of edges which contains the `CourseCatalogueTemp` and cursor to aid in pagination. */
  edges: Array<CourseCatalogueTempsEdge>;
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
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** All input for the `courseCatalogueUpdateByTemp` mutation. */
export type CourseCatalogueUpdateByTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
};

/** The output of our `courseCatalogueUpdateByTemp` mutation. */
export type CourseCatalogueUpdateByTempPayload = {
  __typename?: "CourseCatalogueUpdateByTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  bigInt?: Maybe<Scalars["BigInt"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `courseCatalogueUpdate` mutation. */
export type CourseCatalogueUpdateInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  catalogues?: Maybe<Array<Maybe<CourseCatalogueInput>>>;
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
  /** A list of `CourseCatalogue` objects. */
  nodes: Array<CourseCatalogue>;
  /** A list of edges which contains the `CourseCatalogue` and cursor to aid in pagination. */
  edges: Array<CourseCataloguesEdge>;
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
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "CATALOGUE_ID_ASC"
  | "CATALOGUE_ID_DESC"
  | "COURSE_ID_ASC"
  | "COURSE_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A condition to be used against `Course` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CourseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `courseId` field. */
  courseId?: Maybe<Scalars["Int"]>;
};

/** Course Enrollments */
export type CourseEnrollment = {
  __typename?: "CourseEnrollment";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** account */
  userId?: Maybe<Scalars["Int"]>;
  /** fk */
  courseId?: Maybe<Scalars["Int"]>;
  /** status */
  status?: Maybe<Scalars["String"]>;
  /** url */
  url?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Course` that is related to this `CourseEnrollment`. */
  course?: Maybe<Course>;
};

/**
 * A condition to be used against `CourseEnrollment` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CourseEnrollmentCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `courseId` field. */
  courseId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseEnrollment` */
export type CourseEnrollmentInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** account */
  userId?: Maybe<Scalars["Int"]>;
  /** fk */
  courseId?: Maybe<Scalars["Int"]>;
  /** status */
  status?: Maybe<Scalars["String"]>;
  /** url */
  url?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseEnrollment`. Fields that are set will be updated. */
export type CourseEnrollmentPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** account */
  userId?: Maybe<Scalars["Int"]>;
  /** fk */
  courseId?: Maybe<Scalars["Int"]>;
  /** status */
  status?: Maybe<Scalars["String"]>;
  /** url */
  url?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Course Enrollments temp table.  Enrollements are brought in here from Docebo first, before being merged into the course_enrollemnt table */
export type CourseEnrollmentTemp = {
  __typename?: "CourseEnrollmentTemp";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** account */
  userId?: Maybe<Scalars["Int"]>;
  /** course */
  courseId?: Maybe<Scalars["Int"]>;
  /** status */
  status?: Maybe<Scalars["String"]>;
  /** url */
  url?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `CourseEnrollmentTemp` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type CourseEnrollmentTempCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseEnrollmentTemp` */
export type CourseEnrollmentTempInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** account */
  userId?: Maybe<Scalars["Int"]>;
  /** course */
  courseId?: Maybe<Scalars["Int"]>;
  /** status */
  status?: Maybe<Scalars["String"]>;
  /** url */
  url?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseEnrollmentTemp`. Fields that are set will be updated. */
export type CourseEnrollmentTempPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** account */
  userId?: Maybe<Scalars["Int"]>;
  /** course */
  courseId?: Maybe<Scalars["Int"]>;
  /** status */
  status?: Maybe<Scalars["String"]>;
  /** url */
  url?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CourseEnrollmentTemp` values. */
export type CourseEnrollmentTempsConnection = {
  __typename?: "CourseEnrollmentTempsConnection";
  /** A list of `CourseEnrollmentTemp` objects. */
  nodes: Array<CourseEnrollmentTemp>;
  /** A list of edges which contains the `CourseEnrollmentTemp` and cursor to aid in pagination. */
  edges: Array<CourseEnrollmentTempsEdge>;
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
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** All input for the `courseEnrollmentUpdateByTemp` mutation. */
export type CourseEnrollmentUpdateByTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
};

/** The output of our `courseEnrollmentUpdateByTemp` mutation. */
export type CourseEnrollmentUpdateByTempPayload = {
  __typename?: "CourseEnrollmentUpdateByTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  bigInt?: Maybe<Scalars["BigInt"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `courseEnrollmentUpdate` mutation. */
export type CourseEnrollmentUpdateInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  enrollments?: Maybe<Array<Maybe<CourseEnrollmentInput>>>;
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
  /** A list of `CourseEnrollment` objects. */
  nodes: Array<CourseEnrollment>;
  /** A list of edges which contains the `CourseEnrollment` and cursor to aid in pagination. */
  edges: Array<CourseEnrollmentsEdge>;
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
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "USER_ID_ASC"
  | "USER_ID_DESC"
  | "COURSE_ID_ASC"
  | "COURSE_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** An input for mutations affecting `Course` */
export type CourseInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** Docebo CourseId */
  courseId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A reference to the image */
  image?: Maybe<Scalars["String"]>;
  /** Promoted courses a listed higher than others */
  promoted?: Maybe<Scalars["Boolean"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: Maybe<Scalars["String"]>;
  /** Text description from Docebo */
  description?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Course`. Fields that are set will be updated. */
export type CoursePatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** Docebo CourseId */
  courseId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A reference to the image */
  image?: Maybe<Scalars["String"]>;
  /** Promoted courses a listed higher than others */
  promoted?: Maybe<Scalars["Boolean"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: Maybe<Scalars["String"]>;
  /** Text description from Docebo */
  description?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Course Sync Configuration */
export type CourseSyncConfiguration = {
  __typename?: "CourseSyncConfiguration";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** account */
  configName?: Maybe<Scalars["String"]>;
  /** course */
  configValue?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `CourseSyncConfiguration` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type CourseSyncConfigurationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `configName` field. */
  configName?: Maybe<Scalars["String"]>;
};

/** An input for mutations affecting `CourseSyncConfiguration` */
export type CourseSyncConfigurationInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** account */
  configName?: Maybe<Scalars["String"]>;
  /** course */
  configValue?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseSyncConfiguration`. Fields that are set will be updated. */
export type CourseSyncConfigurationPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** account */
  configName?: Maybe<Scalars["String"]>;
  /** course */
  configValue?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CourseSyncConfiguration` values. */
export type CourseSyncConfigurationsConnection = {
  __typename?: "CourseSyncConfigurationsConnection";
  /** A list of `CourseSyncConfiguration` objects. */
  nodes: Array<CourseSyncConfiguration>;
  /** A list of edges which contains the `CourseSyncConfiguration` and cursor to aid in pagination. */
  edges: Array<CourseSyncConfigurationsEdge>;
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
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "CONFIG_NAME_ASC"
  | "CONFIG_NAME_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A temporary training course that BMI offers in Docebo. Courses are brought from Docebo into this table before being merged into the course table. */
export type CourseTemp = {
  __typename?: "CourseTemp";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** Docebo CourseId */
  courseId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A reference to the image */
  image?: Maybe<Scalars["String"]>;
  /** Promoted courses are intended to be listed higher than others. At time of writing, this data could not practically be acquired from the Docebo API */
  promoted?: Maybe<Scalars["Boolean"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: Maybe<Scalars["String"]>;
  /** Text description from Docebo */
  description?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
};

/**
 * A condition to be used against `CourseTemp` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CourseTempCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `CourseTemp` */
export type CourseTempInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** Docebo CourseId */
  courseId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A reference to the image */
  image?: Maybe<Scalars["String"]>;
  /** Promoted courses are intended to be listed higher than others. At time of writing, this data could not practically be acquired from the Docebo API */
  promoted?: Maybe<Scalars["Boolean"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: Maybe<Scalars["String"]>;
  /** Text description from Docebo */
  description?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `CourseTemp`. Fields that are set will be updated. */
export type CourseTempPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** Docebo CourseId */
  courseId?: Maybe<Scalars["Int"]>;
  /** technology */
  technology?: Maybe<Scalars["String"]>;
  /** A short name for the Course taken from Docebo */
  name?: Maybe<Scalars["String"]>;
  /** A reference to the image */
  image?: Maybe<Scalars["String"]>;
  /** Promoted courses are intended to be listed higher than others. At time of writing, this data could not practically be acquired from the Docebo API */
  promoted?: Maybe<Scalars["Boolean"]>;
  /** Some text from Docebo indicating whether it is a webinar, classroom etc */
  trainingType?: Maybe<Scalars["String"]>;
  /** Text description from Docebo */
  description?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `CourseTemp` values. */
export type CourseTempsConnection = {
  __typename?: "CourseTempsConnection";
  /** A list of `CourseTemp` objects. */
  nodes: Array<CourseTemp>;
  /** A list of edges which contains the `CourseTemp` and cursor to aid in pagination. */
  edges: Array<CourseTempsEdge>;
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
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** All input for the `courseUpdateByTemp` mutation. */
export type CourseUpdateByTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
};

/** The output of our `courseUpdateByTemp` mutation. */
export type CourseUpdateByTempPayload = {
  __typename?: "CourseUpdateByTempPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  bigInt?: Maybe<Scalars["BigInt"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `courseUpdate` mutation. */
export type CourseUpdateInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  courses?: Maybe<Array<Maybe<CourseInput>>>;
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
  /** A list of `Course` objects. */
  nodes: Array<Course>;
  /** A list of edges which contains the `Course` and cursor to aid in pagination. */
  edges: Array<CoursesEdge>;
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
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "COURSE_ID_ASC"
  | "COURSE_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** All input for the `createAccount` mutation. */
export type CreateAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  account?: Maybe<AccountInput>;
  marketCode?: Maybe<Scalars["String"]>;
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

/** All input for the `createCompany` mutation. */
export type CreateCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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

/** The output of our `createCompany` mutation. */
export type CreateCompanyPayload = {
  __typename?: "CreateCompanyPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  company?: Maybe<Company>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `Company`. */
  market?: Maybe<Market>;
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
};

/** The output of our `createCompany` mutation. */
export type CreateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
};

/** All input for the create `CourseCatalogue` mutation. */
export type CreateCourseCatalogueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** The `CourseCatalogue` that was created by this mutation. */
  courseCatalogue?: Maybe<CourseCatalogue>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Course` that is related to this `CourseCatalogue`. */
  course?: Maybe<Course>;
  /** An edge for our `CourseCatalogue`. May be used by Relay 1. */
  courseCatalogueEdge?: Maybe<CourseCataloguesEdge>;
};

/** The output of our create `CourseCatalogue` mutation. */
export type CreateCourseCataloguePayloadCourseCatalogueEdgeArgs = {
  orderBy?: Maybe<Array<CourseCataloguesOrderBy>>;
};

/** All input for the create `CourseCatalogueTemp` mutation. */
export type CreateCourseCatalogueTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseCatalogueTemp`. May be used by Relay 1. */
  courseCatalogueTempEdge?: Maybe<CourseCatalogueTempsEdge>;
};

/** The output of our create `CourseCatalogueTemp` mutation. */
export type CreateCourseCatalogueTempPayloadCourseCatalogueTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseCatalogueTempsOrderBy>>;
};

/** All input for the create `CourseEnrollment` mutation. */
export type CreateCourseEnrollmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** The `CourseEnrollment` that was created by this mutation. */
  courseEnrollment?: Maybe<CourseEnrollment>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Course` that is related to this `CourseEnrollment`. */
  course?: Maybe<Course>;
  /** An edge for our `CourseEnrollment`. May be used by Relay 1. */
  courseEnrollmentEdge?: Maybe<CourseEnrollmentsEdge>;
};

/** The output of our create `CourseEnrollment` mutation. */
export type CreateCourseEnrollmentPayloadCourseEnrollmentEdgeArgs = {
  orderBy?: Maybe<Array<CourseEnrollmentsOrderBy>>;
};

/** All input for the create `CourseEnrollmentTemp` mutation. */
export type CreateCourseEnrollmentTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseEnrollmentTemp`. May be used by Relay 1. */
  courseEnrollmentTempEdge?: Maybe<CourseEnrollmentTempsEdge>;
};

/** The output of our create `CourseEnrollmentTemp` mutation. */
export type CreateCourseEnrollmentTempPayloadCourseEnrollmentTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseEnrollmentTempsOrderBy>>;
};

/** All input for the create `Course` mutation. */
export type CreateCourseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Course`. May be used by Relay 1. */
  courseEdge?: Maybe<CoursesEdge>;
};

/** The output of our create `Course` mutation. */
export type CreateCoursePayloadCourseEdgeArgs = {
  orderBy?: Maybe<Array<CoursesOrderBy>>;
};

/** All input for the create `CourseSyncConfiguration` mutation. */
export type CreateCourseSyncConfigurationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseSyncConfiguration`. May be used by Relay 1. */
  courseSyncConfigurationEdge?: Maybe<CourseSyncConfigurationsEdge>;
};

/** The output of our create `CourseSyncConfiguration` mutation. */
export type CreateCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs =
  {
    orderBy?: Maybe<Array<CourseSyncConfigurationsOrderBy>>;
  };

/** All input for the create `CourseTemp` mutation. */
export type CreateCourseTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseTemp`. May be used by Relay 1. */
  courseTempEdge?: Maybe<CourseTempsEdge>;
};

/** The output of our create `CourseTemp` mutation. */
export type CreateCourseTempPayloadCourseTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseTempsOrderBy>>;
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
  systemBySystemBmiRef?: Maybe<System>;
  /** Reads a single `Product` that is related to this `Guarantee`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
};

/** The output of our create `Guarantee` mutation. */
export type CreateGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
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
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
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
  systemBySystemBmiRef?: Maybe<System>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  productByProductBmiRef?: Maybe<Product>;
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

/** All input for the `deleteAccountByEmail` mutation. */
export type DeleteAccountByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The email address associated with the account */
  email: Scalars["String"];
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
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
};

/** The output of our delete `Company` mutation. */
export type DeleteCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
};

/** All input for the `deleteCourseByCourseId` mutation. */
export type DeleteCourseByCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Docebo CourseId */
  courseId: Scalars["Int"];
};

/** All input for the `deleteCourseByNodeId` mutation. */
export type DeleteCourseByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Course` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseCatalogueByCatalogueIdAndCourseId` mutation. */
export type DeleteCourseCatalogueByCatalogueIdAndCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** market */
  catalogueId: Scalars["Int"];
  /** fk */
  courseId: Scalars["Int"];
};

/** All input for the `deleteCourseCatalogueByNodeId` mutation. */
export type DeleteCourseCatalogueByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseCatalogue` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseCatalogue` mutation. */
export type DeleteCourseCatalogueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** The `CourseCatalogue` that was deleted by this mutation. */
  courseCatalogue?: Maybe<CourseCatalogue>;
  deletedCourseCatalogueNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Course` that is related to this `CourseCatalogue`. */
  course?: Maybe<Course>;
  /** An edge for our `CourseCatalogue`. May be used by Relay 1. */
  courseCatalogueEdge?: Maybe<CourseCataloguesEdge>;
};

/** The output of our delete `CourseCatalogue` mutation. */
export type DeleteCourseCataloguePayloadCourseCatalogueEdgeArgs = {
  orderBy?: Maybe<Array<CourseCataloguesOrderBy>>;
};

/** All input for the `deleteCourseCatalogueTempByNodeId` mutation. */
export type DeleteCourseCatalogueTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseCatalogueTemp` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseCatalogueTemp` mutation. */
export type DeleteCourseCatalogueTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  deletedCourseCatalogueTempNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseCatalogueTemp`. May be used by Relay 1. */
  courseCatalogueTempEdge?: Maybe<CourseCatalogueTempsEdge>;
};

/** The output of our delete `CourseCatalogueTemp` mutation. */
export type DeleteCourseCatalogueTempPayloadCourseCatalogueTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseCatalogueTempsOrderBy>>;
};

/** All input for the `deleteCourseEnrollmentByNodeId` mutation. */
export type DeleteCourseEnrollmentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseEnrollment` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseEnrollmentByUserIdAndCourseId` mutation. */
export type DeleteCourseEnrollmentByUserIdAndCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** account */
  userId: Scalars["Int"];
  /** fk */
  courseId: Scalars["Int"];
};

/** All input for the `deleteCourseEnrollment` mutation. */
export type DeleteCourseEnrollmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  /** The `CourseEnrollment` that was deleted by this mutation. */
  courseEnrollment?: Maybe<CourseEnrollment>;
  deletedCourseEnrollmentNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Course` that is related to this `CourseEnrollment`. */
  course?: Maybe<Course>;
  /** An edge for our `CourseEnrollment`. May be used by Relay 1. */
  courseEnrollmentEdge?: Maybe<CourseEnrollmentsEdge>;
};

/** The output of our delete `CourseEnrollment` mutation. */
export type DeleteCourseEnrollmentPayloadCourseEnrollmentEdgeArgs = {
  orderBy?: Maybe<Array<CourseEnrollmentsOrderBy>>;
};

/** All input for the `deleteCourseEnrollmentTempByNodeId` mutation. */
export type DeleteCourseEnrollmentTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseEnrollmentTemp` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseEnrollmentTemp` mutation. */
export type DeleteCourseEnrollmentTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  deletedCourseEnrollmentTempNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseEnrollmentTemp`. May be used by Relay 1. */
  courseEnrollmentTempEdge?: Maybe<CourseEnrollmentTempsEdge>;
};

/** The output of our delete `CourseEnrollmentTemp` mutation. */
export type DeleteCourseEnrollmentTempPayloadCourseEnrollmentTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseEnrollmentTempsOrderBy>>;
};

/** All input for the `deleteCourse` mutation. */
export type DeleteCourseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  deletedCourseNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Course`. May be used by Relay 1. */
  courseEdge?: Maybe<CoursesEdge>;
};

/** The output of our delete `Course` mutation. */
export type DeleteCoursePayloadCourseEdgeArgs = {
  orderBy?: Maybe<Array<CoursesOrderBy>>;
};

/** All input for the `deleteCourseSyncConfigurationByConfigName` mutation. */
export type DeleteCourseSyncConfigurationByConfigNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** account */
  configName: Scalars["String"];
};

/** All input for the `deleteCourseSyncConfigurationByNodeId` mutation. */
export type DeleteCourseSyncConfigurationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseSyncConfiguration` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseSyncConfiguration` mutation. */
export type DeleteCourseSyncConfigurationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  deletedCourseSyncConfigurationNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseSyncConfiguration`. May be used by Relay 1. */
  courseSyncConfigurationEdge?: Maybe<CourseSyncConfigurationsEdge>;
};

/** The output of our delete `CourseSyncConfiguration` mutation. */
export type DeleteCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs =
  {
    orderBy?: Maybe<Array<CourseSyncConfigurationsOrderBy>>;
  };

/** All input for the `deleteCourseTempByNodeId` mutation. */
export type DeleteCourseTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `CourseTemp` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCourseTemp` mutation. */
export type DeleteCourseTempInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  deletedCourseTempNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseTemp`. May be used by Relay 1. */
  courseTempEdge?: Maybe<CourseTempsEdge>;
};

/** The output of our delete `CourseTemp` mutation. */
export type DeleteCourseTempPayloadCourseTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseTempsOrderBy>>;
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
  systemBySystemBmiRef?: Maybe<System>;
  /** Reads a single `Product` that is related to this `Guarantee`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
};

/** The output of our delete `Guarantee` mutation. */
export type DeleteGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
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

/** All input for the `deleteMarketByDoceboCatalogueId` mutation. */
export type DeleteMarketByDoceboCatalogueIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The default catalogue for the market.  All users in the market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId: Scalars["Int"];
};

/** All input for the `deleteMarketByDomain` mutation. */
export type DeleteMarketByDomainInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
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

/** All input for the `deleteProductByBmiRef` mutation. */
export type DeleteProductByBmiRefInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
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
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectsEdge>;
};

/** The output of our delete `Project` mutation. */
export type DeleteProjectPayloadProjectEdgeArgs = {
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
};

/** All input for the `deleteSystemByBmiRef` mutation. */
export type DeleteSystemByBmiRefInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
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
  systemBySystemBmiRef?: Maybe<System>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  productByProductBmiRef?: Maybe<Product>;
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

export type Entry = {
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
};

export type EntryCollection = {
  __typename?: "EntryCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<Entry>>;
};

export type EntryFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  OR?: Maybe<Array<Maybe<EntryFilter>>>;
  AND?: Maybe<Array<Maybe<EntryFilter>>>;
};

export type EntryOrder =
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/evidenceCategory) */
export type EvidenceCategory = Entry & {
  __typename?: "EvidenceCategory";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<EvidenceCategoryLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<EvidenceCategoryDescription>;
  minimumUploads?: Maybe<Scalars["Int"]>;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/evidenceCategory) */
export type EvidenceCategoryLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/evidenceCategory) */
export type EvidenceCategoryNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/evidenceCategory) */
export type EvidenceCategoryDescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A category of evidence required by a Market for guarantees to be issued [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/evidenceCategory) */
export type EvidenceCategoryMinimumUploadsArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type EvidenceCategoryCollection = {
  __typename?: "EvidenceCategoryCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<EvidenceCategory>>;
};

export type EvidenceCategoryDescription = {
  __typename?: "EvidenceCategoryDescription";
  json: Scalars["JSON"];
  links: EvidenceCategoryDescriptionLinks;
};

export type EvidenceCategoryDescriptionAssets = {
  __typename?: "EvidenceCategoryDescriptionAssets";
  hyperlink: Array<Maybe<Asset>>;
  block: Array<Maybe<Asset>>;
};

export type EvidenceCategoryDescriptionEntries = {
  __typename?: "EvidenceCategoryDescriptionEntries";
  inline: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  block: Array<Maybe<Entry>>;
};

export type EvidenceCategoryDescriptionLinks = {
  __typename?: "EvidenceCategoryDescriptionLinks";
  entries: EvidenceCategoryDescriptionEntries;
  assets: EvidenceCategoryDescriptionAssets;
};

export type EvidenceCategoryFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name_exists?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  description_exists?: Maybe<Scalars["Boolean"]>;
  description_contains?: Maybe<Scalars["String"]>;
  description_not_contains?: Maybe<Scalars["String"]>;
  minimumUploads_exists?: Maybe<Scalars["Boolean"]>;
  minimumUploads?: Maybe<Scalars["Int"]>;
  minimumUploads_not?: Maybe<Scalars["Int"]>;
  minimumUploads_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  minimumUploads_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  minimumUploads_gt?: Maybe<Scalars["Int"]>;
  minimumUploads_gte?: Maybe<Scalars["Int"]>;
  minimumUploads_lt?: Maybe<Scalars["Int"]>;
  minimumUploads_lte?: Maybe<Scalars["Int"]>;
  OR?: Maybe<Array<Maybe<EvidenceCategoryFilter>>>;
  AND?: Maybe<Array<Maybe<EvidenceCategoryFilter>>>;
};

export type EvidenceCategoryLinkingCollections = {
  __typename?: "EvidenceCategoryLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
};

export type EvidenceCategoryLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type EvidenceCategoryLinkingCollectionsGuaranteeTypeCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type EvidenceCategoryOrder =
  | "name_ASC"
  | "name_DESC"
  | "minimumUploads_ASC"
  | "minimumUploads_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

export type EvidenceCategoryType =
  | "PROOF_OF_PURCHASE"
  | "MISCELLANEOUS"
  | "CUSTOM";

/** A file uploaded to a project, usually as evidence to support a guarantee */
export type EvidenceItem = Node & {
  __typename?: "EvidenceItem";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** a reference to the evidenceCategory sys id in Contentful */
  customEvidenceCategoryId?: Maybe<Scalars["String"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** ek */
  evidenceCategoryType?: Maybe<EvidenceCategoryType>;
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
  customEvidenceCategoryId?: Maybe<Scalars["String"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** ek */
  evidenceCategoryType?: Maybe<EvidenceCategoryType>;
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
  customEvidenceCategoryId?: Maybe<Scalars["String"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** ek */
  evidenceCategoryType?: Maybe<EvidenceCategoryType>;
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
export type EvidenceItemsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "GUARANTEE_ID_ASC"
  | "GUARANTEE_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** Starts life as request for a gurantee and becomes an actual issued guarantee */
export type Guarantee = Node & {
  __typename?: "Guarantee";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key - starts at 6100 */
  id: Scalars["Int"];
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: Maybe<Scalars["String"]>;
  /** fk */
  requestorAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  responsibleInstallerAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTypeId?: Maybe<Scalars["String"]>;
  /** fk */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  productBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTemplateId?: Maybe<Scalars["String"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Guarantee`. */
  requestorAccount?: Maybe<Account>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  responsibleInstallerAccount?: Maybe<Account>;
  /** Reads a single `Project` that is related to this `Guarantee`. */
  project?: Maybe<Project>;
  /** Reads a single `System` that is related to this `Guarantee`. */
  systemBySystemBmiRef?: Maybe<System>;
  /** Reads a single `Product` that is related to this `Guarantee`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** Reads and enables pagination through a set of `EvidenceItem`. */
  evidenceItems: EvidenceItemsConnection;
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
  /** Checks for equality with the object’s `systemBmiRef` field. */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** Checks for equality with the object’s `productBmiRef` field. */
  productBmiRef?: Maybe<Scalars["String"]>;
  /** Checks for equality with the object’s `reviewerAccountId` field. */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Guarantee` */
export type GuaranteeInput = {
  /** Primary key - starts at 6100 */
  id?: Maybe<Scalars["Int"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: Maybe<Scalars["String"]>;
  /** fk */
  requestorAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  responsibleInstallerAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTypeId?: Maybe<Scalars["String"]>;
  /** fk */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  productBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTemplateId?: Maybe<Scalars["String"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Guarantee`. Fields that are set will be updated. */
export type GuaranteePatch = {
  /** Primary key - starts at 6100 */
  id?: Maybe<Scalars["Int"]>;
  /** The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand */
  fileStorageId?: Maybe<Scalars["String"]>;
  /** fk */
  requestorAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  responsibleInstallerAccountId?: Maybe<Scalars["Int"]>;
  /** fk */
  projectId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTypeId?: Maybe<Scalars["String"]>;
  /** fk */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  productBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** a reference to the guaranteeType sys id in Contentful */
  guaranteeTemplateId?: Maybe<Scalars["String"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /** This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id */
  bmiReferenceId?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplate = Entry & {
  __typename?: "GuaranteeTemplate";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<GuaranteeTemplateLinkingCollections>;
  displayName?: Maybe<Scalars["String"]>;
  approvalMessage?: Maybe<MessageTemplate>;
  rejectionMessage?: Maybe<MessageTemplate>;
  logo?: Maybe<Asset>;
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
  maintenanceTemplate?: Maybe<Asset>;
  guaranteeScope?: Maybe<Scalars["String"]>;
  terms?: Maybe<Asset>;
  mailBody?: Maybe<Scalars["String"]>;
  filenamePrefix?: Maybe<Scalars["String"]>;
  lockupLine1?: Maybe<Scalars["String"]>;
  lockupLine2?: Maybe<Scalars["String"]>;
  roofType?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateDisplayNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateApprovalMessageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateRejectionMessageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateLogoArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateSignatoryArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingGuaranteeArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingScopeArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingProductsArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingBeneficiaryArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingBuildingOwnerNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingBuildingAddressArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingRoofAreaArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingRoofTypeArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingContractorArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingContractorNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingContractorIdArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingStartDateArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingGuaranteeIdArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingValidityArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateHeadingExpiryArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateFooterArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateMaintenanceTemplateArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateGuaranteeScopeArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateTermsArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateMailBodyArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateFilenamePrefixArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateLockupLine1Args = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateLockupLine2Args = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for a type of Guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeTemplate) */
export type GuaranteeTemplateRoofTypeArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type GuaranteeTemplateCollection = {
  __typename?: "GuaranteeTemplateCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<GuaranteeTemplate>>;
};

export type GuaranteeTemplateFilter = {
  approvalMessage?: Maybe<CfMessageTemplateNestedFilter>;
  rejectionMessage?: Maybe<CfMessageTemplateNestedFilter>;
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  displayName_exists?: Maybe<Scalars["Boolean"]>;
  displayName?: Maybe<Scalars["String"]>;
  displayName_not?: Maybe<Scalars["String"]>;
  displayName_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  displayName_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  displayName_contains?: Maybe<Scalars["String"]>;
  displayName_not_contains?: Maybe<Scalars["String"]>;
  approvalMessage_exists?: Maybe<Scalars["Boolean"]>;
  rejectionMessage_exists?: Maybe<Scalars["Boolean"]>;
  logo_exists?: Maybe<Scalars["Boolean"]>;
  signatory_exists?: Maybe<Scalars["Boolean"]>;
  signatory?: Maybe<Scalars["String"]>;
  signatory_not?: Maybe<Scalars["String"]>;
  signatory_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  signatory_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  signatory_contains?: Maybe<Scalars["String"]>;
  signatory_not_contains?: Maybe<Scalars["String"]>;
  headingGuarantee_exists?: Maybe<Scalars["Boolean"]>;
  headingGuarantee?: Maybe<Scalars["String"]>;
  headingGuarantee_not?: Maybe<Scalars["String"]>;
  headingGuarantee_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingGuarantee_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingGuarantee_contains?: Maybe<Scalars["String"]>;
  headingGuarantee_not_contains?: Maybe<Scalars["String"]>;
  headingScope_exists?: Maybe<Scalars["Boolean"]>;
  headingScope?: Maybe<Scalars["String"]>;
  headingScope_not?: Maybe<Scalars["String"]>;
  headingScope_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingScope_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingScope_contains?: Maybe<Scalars["String"]>;
  headingScope_not_contains?: Maybe<Scalars["String"]>;
  headingProducts_exists?: Maybe<Scalars["Boolean"]>;
  headingProducts?: Maybe<Scalars["String"]>;
  headingProducts_not?: Maybe<Scalars["String"]>;
  headingProducts_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingProducts_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingProducts_contains?: Maybe<Scalars["String"]>;
  headingProducts_not_contains?: Maybe<Scalars["String"]>;
  headingBeneficiary_exists?: Maybe<Scalars["Boolean"]>;
  headingBeneficiary?: Maybe<Scalars["String"]>;
  headingBeneficiary_not?: Maybe<Scalars["String"]>;
  headingBeneficiary_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingBeneficiary_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingBeneficiary_contains?: Maybe<Scalars["String"]>;
  headingBeneficiary_not_contains?: Maybe<Scalars["String"]>;
  headingBuildingOwnerName_exists?: Maybe<Scalars["Boolean"]>;
  headingBuildingOwnerName?: Maybe<Scalars["String"]>;
  headingBuildingOwnerName_not?: Maybe<Scalars["String"]>;
  headingBuildingOwnerName_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingBuildingOwnerName_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingBuildingOwnerName_contains?: Maybe<Scalars["String"]>;
  headingBuildingOwnerName_not_contains?: Maybe<Scalars["String"]>;
  headingBuildingAddress_exists?: Maybe<Scalars["Boolean"]>;
  headingBuildingAddress?: Maybe<Scalars["String"]>;
  headingBuildingAddress_not?: Maybe<Scalars["String"]>;
  headingBuildingAddress_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingBuildingAddress_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingBuildingAddress_contains?: Maybe<Scalars["String"]>;
  headingBuildingAddress_not_contains?: Maybe<Scalars["String"]>;
  headingRoofArea_exists?: Maybe<Scalars["Boolean"]>;
  headingRoofArea?: Maybe<Scalars["String"]>;
  headingRoofArea_not?: Maybe<Scalars["String"]>;
  headingRoofArea_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingRoofArea_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingRoofArea_contains?: Maybe<Scalars["String"]>;
  headingRoofArea_not_contains?: Maybe<Scalars["String"]>;
  headingRoofType_exists?: Maybe<Scalars["Boolean"]>;
  headingRoofType?: Maybe<Scalars["String"]>;
  headingRoofType_not?: Maybe<Scalars["String"]>;
  headingRoofType_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingRoofType_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingRoofType_contains?: Maybe<Scalars["String"]>;
  headingRoofType_not_contains?: Maybe<Scalars["String"]>;
  headingContractor_exists?: Maybe<Scalars["Boolean"]>;
  headingContractor?: Maybe<Scalars["String"]>;
  headingContractor_not?: Maybe<Scalars["String"]>;
  headingContractor_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingContractor_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingContractor_contains?: Maybe<Scalars["String"]>;
  headingContractor_not_contains?: Maybe<Scalars["String"]>;
  headingContractorName_exists?: Maybe<Scalars["Boolean"]>;
  headingContractorName?: Maybe<Scalars["String"]>;
  headingContractorName_not?: Maybe<Scalars["String"]>;
  headingContractorName_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingContractorName_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingContractorName_contains?: Maybe<Scalars["String"]>;
  headingContractorName_not_contains?: Maybe<Scalars["String"]>;
  headingContractorId_exists?: Maybe<Scalars["Boolean"]>;
  headingContractorId?: Maybe<Scalars["String"]>;
  headingContractorId_not?: Maybe<Scalars["String"]>;
  headingContractorId_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingContractorId_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingContractorId_contains?: Maybe<Scalars["String"]>;
  headingContractorId_not_contains?: Maybe<Scalars["String"]>;
  headingStartDate_exists?: Maybe<Scalars["Boolean"]>;
  headingStartDate?: Maybe<Scalars["String"]>;
  headingStartDate_not?: Maybe<Scalars["String"]>;
  headingStartDate_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingStartDate_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingStartDate_contains?: Maybe<Scalars["String"]>;
  headingStartDate_not_contains?: Maybe<Scalars["String"]>;
  headingGuaranteeId_exists?: Maybe<Scalars["Boolean"]>;
  headingGuaranteeId?: Maybe<Scalars["String"]>;
  headingGuaranteeId_not?: Maybe<Scalars["String"]>;
  headingGuaranteeId_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingGuaranteeId_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingGuaranteeId_contains?: Maybe<Scalars["String"]>;
  headingGuaranteeId_not_contains?: Maybe<Scalars["String"]>;
  headingValidity_exists?: Maybe<Scalars["Boolean"]>;
  headingValidity?: Maybe<Scalars["String"]>;
  headingValidity_not?: Maybe<Scalars["String"]>;
  headingValidity_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingValidity_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingValidity_contains?: Maybe<Scalars["String"]>;
  headingValidity_not_contains?: Maybe<Scalars["String"]>;
  headingExpiry_exists?: Maybe<Scalars["Boolean"]>;
  headingExpiry?: Maybe<Scalars["String"]>;
  headingExpiry_not?: Maybe<Scalars["String"]>;
  headingExpiry_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingExpiry_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  headingExpiry_contains?: Maybe<Scalars["String"]>;
  headingExpiry_not_contains?: Maybe<Scalars["String"]>;
  footer_exists?: Maybe<Scalars["Boolean"]>;
  footer?: Maybe<Scalars["String"]>;
  footer_not?: Maybe<Scalars["String"]>;
  footer_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  footer_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  footer_contains?: Maybe<Scalars["String"]>;
  footer_not_contains?: Maybe<Scalars["String"]>;
  maintenanceTemplate_exists?: Maybe<Scalars["Boolean"]>;
  guaranteeScope_exists?: Maybe<Scalars["Boolean"]>;
  guaranteeScope?: Maybe<Scalars["String"]>;
  guaranteeScope_not?: Maybe<Scalars["String"]>;
  guaranteeScope_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  guaranteeScope_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  guaranteeScope_contains?: Maybe<Scalars["String"]>;
  guaranteeScope_not_contains?: Maybe<Scalars["String"]>;
  terms_exists?: Maybe<Scalars["Boolean"]>;
  mailBody_exists?: Maybe<Scalars["Boolean"]>;
  mailBody?: Maybe<Scalars["String"]>;
  mailBody_not?: Maybe<Scalars["String"]>;
  mailBody_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  mailBody_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  mailBody_contains?: Maybe<Scalars["String"]>;
  mailBody_not_contains?: Maybe<Scalars["String"]>;
  filenamePrefix_exists?: Maybe<Scalars["Boolean"]>;
  filenamePrefix?: Maybe<Scalars["String"]>;
  filenamePrefix_not?: Maybe<Scalars["String"]>;
  filenamePrefix_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  filenamePrefix_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  filenamePrefix_contains?: Maybe<Scalars["String"]>;
  filenamePrefix_not_contains?: Maybe<Scalars["String"]>;
  lockupLine1_exists?: Maybe<Scalars["Boolean"]>;
  lockupLine1?: Maybe<Scalars["String"]>;
  lockupLine1_not?: Maybe<Scalars["String"]>;
  lockupLine1_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  lockupLine1_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  lockupLine1_contains?: Maybe<Scalars["String"]>;
  lockupLine1_not_contains?: Maybe<Scalars["String"]>;
  lockupLine2_exists?: Maybe<Scalars["Boolean"]>;
  lockupLine2?: Maybe<Scalars["String"]>;
  lockupLine2_not?: Maybe<Scalars["String"]>;
  lockupLine2_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  lockupLine2_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  lockupLine2_contains?: Maybe<Scalars["String"]>;
  lockupLine2_not_contains?: Maybe<Scalars["String"]>;
  roofType_exists?: Maybe<Scalars["Boolean"]>;
  roofType?: Maybe<Scalars["String"]>;
  roofType_not?: Maybe<Scalars["String"]>;
  roofType_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  roofType_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  roofType_contains?: Maybe<Scalars["String"]>;
  roofType_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<GuaranteeTemplateFilter>>>;
  AND?: Maybe<Array<Maybe<GuaranteeTemplateFilter>>>;
};

export type GuaranteeTemplateLinkingCollections = {
  __typename?: "GuaranteeTemplateLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
};

export type GuaranteeTemplateLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type GuaranteeTemplateLinkingCollectionsGuaranteeTypeCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type GuaranteeTemplateOrder =
  | "displayName_ASC"
  | "displayName_DESC"
  | "signatory_ASC"
  | "signatory_DESC"
  | "headingGuarantee_ASC"
  | "headingGuarantee_DESC"
  | "headingScope_ASC"
  | "headingScope_DESC"
  | "headingProducts_ASC"
  | "headingProducts_DESC"
  | "headingBeneficiary_ASC"
  | "headingBeneficiary_DESC"
  | "headingBuildingOwnerName_ASC"
  | "headingBuildingOwnerName_DESC"
  | "headingBuildingAddress_ASC"
  | "headingBuildingAddress_DESC"
  | "headingRoofArea_ASC"
  | "headingRoofArea_DESC"
  | "headingRoofType_ASC"
  | "headingRoofType_DESC"
  | "headingContractor_ASC"
  | "headingContractor_DESC"
  | "headingContractorName_ASC"
  | "headingContractorName_DESC"
  | "headingContractorId_ASC"
  | "headingContractorId_DESC"
  | "headingStartDate_ASC"
  | "headingStartDate_DESC"
  | "headingGuaranteeId_ASC"
  | "headingGuaranteeId_DESC"
  | "headingValidity_ASC"
  | "headingValidity_DESC"
  | "headingExpiry_ASC"
  | "headingExpiry_DESC"
  | "guaranteeScope_ASC"
  | "guaranteeScope_DESC"
  | "filenamePrefix_ASC"
  | "filenamePrefix_DESC"
  | "lockupLine1_ASC"
  | "lockupLine1_DESC"
  | "lockupLine2_ASC"
  | "lockupLine2_DESC"
  | "roofType_ASC"
  | "roofType_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeType = Entry & {
  __typename?: "GuaranteeType";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<GuaranteeTypeLinkingCollections>;
  displayName?: Maybe<Scalars["String"]>;
  technology?: Maybe<Scalars["String"]>;
  coverage?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  signature?: Maybe<Asset>;
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  tiersAvailable?: Maybe<Array<Maybe<Scalars["String"]>>>;
  ranking?: Maybe<Scalars["Int"]>;
  evidenceCategoriesCollection?: Maybe<GuaranteeTypeEvidenceCategoriesCollection>;
  guaranteeTemplatesCollection?: Maybe<GuaranteeTypeGuaranteeTemplatesCollection>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeDisplayNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeTechnologyArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeCoverageArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeSignatureArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeMaximumValidityYearsArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeTiersAvailableArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeRankingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeEvidenceCategoriesCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** A type of guarantee [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/guaranteeType) */
export type GuaranteeTypeGuaranteeTemplatesCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type GuaranteeTypeCollection = {
  __typename?: "GuaranteeTypeCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<GuaranteeType>>;
};

export type GuaranteeTypeEvidenceCategoriesCollection = {
  __typename?: "GuaranteeTypeEvidenceCategoriesCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<EvidenceCategory>>;
};

export type GuaranteeTypeFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  displayName_exists?: Maybe<Scalars["Boolean"]>;
  displayName?: Maybe<Scalars["String"]>;
  displayName_not?: Maybe<Scalars["String"]>;
  displayName_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  displayName_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  displayName_contains?: Maybe<Scalars["String"]>;
  displayName_not_contains?: Maybe<Scalars["String"]>;
  technology_exists?: Maybe<Scalars["Boolean"]>;
  technology?: Maybe<Scalars["String"]>;
  technology_not?: Maybe<Scalars["String"]>;
  technology_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  technology_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  technology_contains?: Maybe<Scalars["String"]>;
  technology_not_contains?: Maybe<Scalars["String"]>;
  coverage_exists?: Maybe<Scalars["Boolean"]>;
  coverage?: Maybe<Scalars["String"]>;
  coverage_not?: Maybe<Scalars["String"]>;
  coverage_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  coverage_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  coverage_contains?: Maybe<Scalars["String"]>;
  coverage_not_contains?: Maybe<Scalars["String"]>;
  name_exists?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  signature_exists?: Maybe<Scalars["Boolean"]>;
  maximumValidityYears_exists?: Maybe<Scalars["Boolean"]>;
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  maximumValidityYears_not?: Maybe<Scalars["Int"]>;
  maximumValidityYears_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  maximumValidityYears_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  maximumValidityYears_gt?: Maybe<Scalars["Int"]>;
  maximumValidityYears_gte?: Maybe<Scalars["Int"]>;
  maximumValidityYears_lt?: Maybe<Scalars["Int"]>;
  maximumValidityYears_lte?: Maybe<Scalars["Int"]>;
  tiersAvailable_exists?: Maybe<Scalars["Boolean"]>;
  tiersAvailable_contains_all?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tiersAvailable_contains_some?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tiersAvailable_contains_none?: Maybe<Array<Maybe<Scalars["String"]>>>;
  ranking_exists?: Maybe<Scalars["Boolean"]>;
  ranking?: Maybe<Scalars["Int"]>;
  ranking_not?: Maybe<Scalars["Int"]>;
  ranking_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  ranking_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  ranking_gt?: Maybe<Scalars["Int"]>;
  ranking_gte?: Maybe<Scalars["Int"]>;
  ranking_lt?: Maybe<Scalars["Int"]>;
  ranking_lte?: Maybe<Scalars["Int"]>;
  evidenceCategoriesCollection_exists?: Maybe<Scalars["Boolean"]>;
  guaranteeTemplatesCollection_exists?: Maybe<Scalars["Boolean"]>;
  OR?: Maybe<Array<Maybe<GuaranteeTypeFilter>>>;
  AND?: Maybe<Array<Maybe<GuaranteeTypeFilter>>>;
};

export type GuaranteeTypeGuaranteeTemplatesCollection = {
  __typename?: "GuaranteeTypeGuaranteeTemplatesCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<GuaranteeTemplate>>;
};

export type GuaranteeTypeLinkingCollections = {
  __typename?: "GuaranteeTypeLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type GuaranteeTypeLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type GuaranteeTypeOrder =
  | "displayName_ASC"
  | "displayName_DESC"
  | "technology_ASC"
  | "technology_DESC"
  | "coverage_ASC"
  | "coverage_DESC"
  | "name_ASC"
  | "name_DESC"
  | "maximumValidityYears_ASC"
  | "maximumValidityYears_DESC"
  | "ranking_ASC"
  | "ranking_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

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
export type GuaranteesOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "REQUESTOR_ACCOUNT_ID_ASC"
  | "REQUESTOR_ACCOUNT_ID_DESC"
  | "RESPONSIBLE_INSTALLER_ACCOUNT_ID_ASC"
  | "RESPONSIBLE_INSTALLER_ACCOUNT_ID_DESC"
  | "PROJECT_ID_ASC"
  | "PROJECT_ID_DESC"
  | "SYSTEM_BMI_REF_ASC"
  | "SYSTEM_BMI_REF_DESC"
  | "PRODUCT_BMI_REF_ASC"
  | "PRODUCT_BMI_REF_DESC"
  | "REVIEWER_ACCOUNT_ID_ASC"
  | "REVIEWER_ACCOUNT_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

export type ImageFormat =
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
  /** Focus the resizing on the center. */
  | "CENTER"
  /** Focus the resizing on the top. */
  | "TOP"
  /** Focus the resizing on the top right. */
  | "TOP_RIGHT"
  /** Focus the resizing on the right. */
  | "RIGHT"
  /** Focus the resizing on the bottom right. */
  | "BOTTOM_RIGHT"
  /** Focus the resizing on the bottom. */
  | "BOTTOM"
  /** Focus the resizing on the bottom left. */
  | "BOTTOM_LEFT"
  /** Focus the resizing on the left. */
  | "LEFT"
  /** Focus the resizing on the top left. */
  | "TOP_LEFT"
  /** Focus the resizing on the largest face. */
  | "FACE"
  /** Focus the resizing on the area containing all the faces. */
  | "FACES";

export type ImageResizeStrategy =
  /** Resizes the image to fit into the specified dimensions. */
  | "FIT"
  /**
   * Resizes the image to the specified dimensions, padding the image if needed.
   *         Uses desired background color as padding color.
   */
  | "PAD"
  /** Resizes the image to the specified dimensions, cropping the image if needed. */
  | "FILL"
  /** Resizes the image to the specified dimensions, changing the original aspect ratio if needed. */
  | "SCALE"
  /** Crops a part of the original image to fit into the specified dimensions. */
  | "CROP"
  /** Creates a thumbnail from the image. */
  | "THUMB";

export type ImageTransformOptions = {
  /** Desired width in pixels. Defaults to the original image width. */
  width?: Maybe<Scalars["Dimension"]>;
  /** Desired height in pixels. Defaults to the original image height. */
  height?: Maybe<Scalars["Dimension"]>;
  /**
   * Desired quality of the image in percents.
   *         Used for `PNG8`, `JPG`, `JPG_PROGRESSIVE` and `WEBP` formats.
   */
  quality?: Maybe<Scalars["Quality"]>;
  /**
   * Desired corner radius in pixels.
   *         Results in an image with rounded corners (pass `-1` for a full circle/ellipse).
   *         Defaults to `0`. Uses desired background color as padding color,
   *         unless the format is `JPG` or `JPG_PROGRESSIVE` and resize strategy is `PAD`, then defaults to white.
   */
  cornerRadius?: Maybe<Scalars["Int"]>;
  /** Desired resize strategy. Defaults to `FIT`. */
  resizeStrategy?: Maybe<ImageResizeStrategy>;
  /** Desired resize focus area. Defaults to `CENTER`. */
  resizeFocus?: Maybe<ImageResizeFocus>;
  /**
   * Desired background color, used with corner radius or `PAD` resize strategy.
   *         Defaults to transparent (for `PNG`, `PNG8` and `WEBP`) or white (for `JPG` and `JPG_PROGRESSIVE`).
   */
  backgroundColor?: Maybe<Scalars["HexColor"]>;
  /** Desired image format. Defaults to the original image format. */
  format?: Maybe<ImageFormat>;
};

export type ImportPayload = {
  __typename?: "ImportPayload";
  systemsToUpdate?: Maybe<Array<Maybe<System>>>;
  systemsToInsert?: Maybe<Array<Maybe<System>>>;
  productsToUpdate?: Maybe<Array<Maybe<Product>>>;
  productsToInsert?: Maybe<Array<Maybe<Product>>>;
};

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
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<InvitationStatus>;
  /** Checks for equality with the object’s `invitee` field. */
  invitee?: Maybe<Scalars["String"]>;
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

export type InvitationStatus = "NEW" | "ACCEPTED" | "CANCELLED";

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
export type InvitationsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "SENDER_ACCOUNT_ID_ASC"
  | "SENDER_ACCOUNT_ID_DESC"
  | "COMPANY_ID_ASC"
  | "COMPANY_ID_DESC"
  | "STATUS_ASC"
  | "STATUS_DESC"
  | "INVITEE_ASC"
  | "INVITEE_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

export type InviteInput = {
  email: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  role: Role;
};

/** A connection to a list of `Int` values. */
export type InvitedByCompaniesConnection = {
  __typename?: "InvitedByCompaniesConnection";
  /** A list of `Int` objects. */
  nodes: Array<Maybe<Scalars["Int"]>>;
  /** A list of edges which contains the `Int` and cursor to aid in pagination. */
  edges: Array<InvitedByCompanyEdge>;
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

export type Language =
  | "DA"
  | "NO"
  | "EN"
  | "SV"
  | "PT"
  | "DE"
  | "NL"
  | "SK"
  | "FR"
  | "PL"
  | "ES"
  | "FI";

/** All input for the `linkAccountToCompany` mutation. */
export type LinkAccountToCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  accountId?: Maybe<Scalars["Int"]>;
  companyId?: Maybe<Scalars["Int"]>;
};

/** The output of our `linkAccountToCompany` mutation. */
export type LinkAccountToCompanyPayload = {
  __typename?: "LinkAccountToCompanyPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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

/** The output of our `linkAccountToCompany` mutation. */
export type LinkAccountToCompanyPayloadCompanyMemberEdgeArgs = {
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
};

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
  doceboCatalogueId?: Maybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: Maybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
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
  /** Checks for equality with the object’s `domain` field. */
  domain?: Maybe<Scalars["String"]>;
  /** Checks for equality with the object’s `doceboCatalogueId` field. */
  doceboCatalogueId?: Maybe<Scalars["Int"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContent = Entry & {
  __typename?: "MarketContent";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MarketContentLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  partnerBrandsCollection?: Maybe<MarketContentPartnerBrandsCollection>;
  contactsCollection?: Maybe<MarketContentContactsCollection>;
  mediaLibraryRootCollection?: Maybe<MarketContentMediaLibraryRootCollection>;
  newsItemHeading?: Maybe<Scalars["String"]>;
  newsItemUrl?: Maybe<Scalars["String"]>;
  newsItemCta?: Maybe<Scalars["String"]>;
  footerLinksCollection?: Maybe<MarketContentFooterLinksCollection>;
  contactUsPage?: Maybe<ContentArticle>;
  externalLinkLabel?: Maybe<Scalars["String"]>;
  externalLinkUrl?: Maybe<Scalars["String"]>;
  live?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentPartnerBrandsCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentContactsCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentMediaLibraryRootCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentNewsItemHeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentNewsItemUrlArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentNewsItemCtaArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentFooterLinksCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentContactUsPageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentExternalLinkLabelArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentExternalLinkUrlArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/marketContent) */
export type MarketContentLiveArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type MarketContentCollection = {
  __typename?: "MarketContentCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<MarketContent>>;
};

export type MarketContentContactsCollection = {
  __typename?: "MarketContentContactsCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<ContactDetails>>;
};

export type MarketContentFilter = {
  contactUsPage?: Maybe<CfContentArticleNestedFilter>;
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name_exists?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  partnerBrandsCollection_exists?: Maybe<Scalars["Boolean"]>;
  contactsCollection_exists?: Maybe<Scalars["Boolean"]>;
  mediaLibraryRootCollection_exists?: Maybe<Scalars["Boolean"]>;
  newsItemHeading_exists?: Maybe<Scalars["Boolean"]>;
  newsItemHeading?: Maybe<Scalars["String"]>;
  newsItemHeading_not?: Maybe<Scalars["String"]>;
  newsItemHeading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  newsItemHeading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  newsItemHeading_contains?: Maybe<Scalars["String"]>;
  newsItemHeading_not_contains?: Maybe<Scalars["String"]>;
  newsItemUrl_exists?: Maybe<Scalars["Boolean"]>;
  newsItemUrl?: Maybe<Scalars["String"]>;
  newsItemUrl_not?: Maybe<Scalars["String"]>;
  newsItemUrl_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  newsItemUrl_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  newsItemUrl_contains?: Maybe<Scalars["String"]>;
  newsItemUrl_not_contains?: Maybe<Scalars["String"]>;
  newsItemCta_exists?: Maybe<Scalars["Boolean"]>;
  newsItemCta?: Maybe<Scalars["String"]>;
  newsItemCta_not?: Maybe<Scalars["String"]>;
  newsItemCta_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  newsItemCta_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  newsItemCta_contains?: Maybe<Scalars["String"]>;
  newsItemCta_not_contains?: Maybe<Scalars["String"]>;
  footerLinksCollection_exists?: Maybe<Scalars["Boolean"]>;
  contactUsPage_exists?: Maybe<Scalars["Boolean"]>;
  externalLinkLabel_exists?: Maybe<Scalars["Boolean"]>;
  externalLinkLabel?: Maybe<Scalars["String"]>;
  externalLinkLabel_not?: Maybe<Scalars["String"]>;
  externalLinkLabel_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  externalLinkLabel_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  externalLinkLabel_contains?: Maybe<Scalars["String"]>;
  externalLinkLabel_not_contains?: Maybe<Scalars["String"]>;
  externalLinkUrl_exists?: Maybe<Scalars["Boolean"]>;
  externalLinkUrl?: Maybe<Scalars["String"]>;
  externalLinkUrl_not?: Maybe<Scalars["String"]>;
  externalLinkUrl_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  externalLinkUrl_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  externalLinkUrl_contains?: Maybe<Scalars["String"]>;
  externalLinkUrl_not_contains?: Maybe<Scalars["String"]>;
  live_exists?: Maybe<Scalars["Boolean"]>;
  live?: Maybe<Scalars["String"]>;
  live_not?: Maybe<Scalars["String"]>;
  live_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  live_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  live_contains?: Maybe<Scalars["String"]>;
  live_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<MarketContentFilter>>>;
  AND?: Maybe<Array<Maybe<MarketContentFilter>>>;
};

export type MarketContentFooterLinksCollection = {
  __typename?: "MarketContentFooterLinksCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<ContentArticle>>;
};

export type MarketContentLinkingCollections = {
  __typename?: "MarketContentLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type MarketContentLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MarketContentMediaLibraryRootCollection = {
  __typename?: "MarketContentMediaLibraryRootCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<MediaFolder>>;
};

export type MarketContentOrder =
  | "name_ASC"
  | "name_DESC"
  | "newsItemHeading_ASC"
  | "newsItemHeading_DESC"
  | "newsItemUrl_ASC"
  | "newsItemUrl_DESC"
  | "newsItemCta_ASC"
  | "newsItemCta_DESC"
  | "externalLinkLabel_ASC"
  | "externalLinkLabel_DESC"
  | "externalLinkUrl_ASC"
  | "externalLinkUrl_DESC"
  | "live_ASC"
  | "live_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

export type MarketContentPartnerBrandsCollection = {
  __typename?: "MarketContentPartnerBrandsCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<PartnerBrand>>;
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
  doceboCatalogueId?: Maybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: Maybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
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
  doceboCatalogueId?: Maybe<Scalars["Int"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /** Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation. */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** Reference to the Google Analytics tracking ID that is used for the Country GA reports */
  gtag?: Maybe<Scalars["String"]>;
  /** The coordinates of the middle of the Market on a map */
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
export type MarketsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "DOMAIN_ASC"
  | "DOMAIN_DESC"
  | "DOCEBO_CATALOGUE_ID_ASC"
  | "DOCEBO_CATALOGUE_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A folder used for categorising the presentation in the Media Tools Library [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaFolder) */
export type MediaFolder = Entry & {
  __typename?: "MediaFolder";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MediaFolderLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  childrenCollection?: Maybe<MediaFolderChildrenCollection>;
};

/** A folder used for categorising the presentation in the Media Tools Library [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaFolder) */
export type MediaFolderLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** A folder used for categorising the presentation in the Media Tools Library [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaFolder) */
export type MediaFolderNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A folder used for categorising the presentation in the Media Tools Library [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaFolder) */
export type MediaFolderChildrenCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MediaFolderChildrenCollection = {
  __typename?: "MediaFolderChildrenCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<MediaFolderChildrenItem>>;
};

export type MediaFolderChildrenItem = MediaFolder | MediaTool;

export type MediaFolderCollection = {
  __typename?: "MediaFolderCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<MediaFolder>>;
};

export type MediaFolderFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name_exists?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  childrenCollection_exists?: Maybe<Scalars["Boolean"]>;
  OR?: Maybe<Array<Maybe<MediaFolderFilter>>>;
  AND?: Maybe<Array<Maybe<MediaFolderFilter>>>;
};

export type MediaFolderLinkingCollections = {
  __typename?: "MediaFolderLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  marketContentCollection?: Maybe<MarketContentCollection>;
  mediaFolderCollection?: Maybe<MediaFolderCollection>;
};

export type MediaFolderLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MediaFolderLinkingCollectionsMarketContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MediaFolderLinkingCollectionsMediaFolderCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MediaFolderOrder =
  | "name_ASC"
  | "name_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaTool) */
export type MediaTool = Entry & {
  __typename?: "MediaTool";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MediaToolLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  thumbnail?: Maybe<Asset>;
  media?: Maybe<Asset>;
  description?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaTool) */
export type MediaToolLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaTool) */
export type MediaToolNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaTool) */
export type MediaToolThumbnailArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaTool) */
export type MediaToolMediaArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaTool) */
export type MediaToolDescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Media which is hosted on Contentful [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/mediaTool) */
export type MediaToolUrlArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type MediaToolCollection = {
  __typename?: "MediaToolCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<MediaTool>>;
};

export type MediaToolFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name_exists?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  thumbnail_exists?: Maybe<Scalars["Boolean"]>;
  media_exists?: Maybe<Scalars["Boolean"]>;
  description_exists?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
  description_not?: Maybe<Scalars["String"]>;
  description_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  description_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  description_contains?: Maybe<Scalars["String"]>;
  description_not_contains?: Maybe<Scalars["String"]>;
  url_exists?: Maybe<Scalars["Boolean"]>;
  url?: Maybe<Scalars["String"]>;
  url_not?: Maybe<Scalars["String"]>;
  url_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_contains?: Maybe<Scalars["String"]>;
  url_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<MediaToolFilter>>>;
  AND?: Maybe<Array<Maybe<MediaToolFilter>>>;
};

export type MediaToolLinkingCollections = {
  __typename?: "MediaToolLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  mediaFolderCollection?: Maybe<MediaFolderCollection>;
};

export type MediaToolLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MediaToolLinkingCollectionsMediaFolderCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MediaToolOrder =
  | "name_ASC"
  | "name_DESC"
  | "url_ASC"
  | "url_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/messageTemplate) */
export type MessageTemplate = Entry & {
  __typename?: "MessageTemplate";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MessageTemplateLinkingCollections>;
  event?: Maybe<Scalars["String"]>;
  format?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subject?: Maybe<Scalars["String"]>;
  notificationBody?: Maybe<Scalars["String"]>;
  emailBody?: Maybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/messageTemplate) */
export type MessageTemplateLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/messageTemplate) */
export type MessageTemplateEventArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/messageTemplate) */
export type MessageTemplateFormatArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/messageTemplate) */
export type MessageTemplateSubjectArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/messageTemplate) */
export type MessageTemplateNotificationBodyArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A template for email and/or notifications [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/messageTemplate) */
export type MessageTemplateEmailBodyArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type MessageTemplateCollection = {
  __typename?: "MessageTemplateCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<MessageTemplate>>;
};

export type MessageTemplateFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  event_exists?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<Scalars["String"]>;
  event_not?: Maybe<Scalars["String"]>;
  event_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  event_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  event_contains?: Maybe<Scalars["String"]>;
  event_not_contains?: Maybe<Scalars["String"]>;
  format_exists?: Maybe<Scalars["Boolean"]>;
  format_contains_all?: Maybe<Array<Maybe<Scalars["String"]>>>;
  format_contains_some?: Maybe<Array<Maybe<Scalars["String"]>>>;
  format_contains_none?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subject_exists?: Maybe<Scalars["Boolean"]>;
  subject?: Maybe<Scalars["String"]>;
  subject_not?: Maybe<Scalars["String"]>;
  subject_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subject_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subject_contains?: Maybe<Scalars["String"]>;
  subject_not_contains?: Maybe<Scalars["String"]>;
  notificationBody_exists?: Maybe<Scalars["Boolean"]>;
  notificationBody?: Maybe<Scalars["String"]>;
  notificationBody_not?: Maybe<Scalars["String"]>;
  notificationBody_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  notificationBody_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  notificationBody_contains?: Maybe<Scalars["String"]>;
  notificationBody_not_contains?: Maybe<Scalars["String"]>;
  emailBody_exists?: Maybe<Scalars["Boolean"]>;
  emailBody?: Maybe<Scalars["String"]>;
  emailBody_not?: Maybe<Scalars["String"]>;
  emailBody_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  emailBody_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  emailBody_contains?: Maybe<Scalars["String"]>;
  emailBody_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<MessageTemplateFilter>>>;
  AND?: Maybe<Array<Maybe<MessageTemplateFilter>>>;
};

export type MessageTemplateLinkingCollections = {
  __typename?: "MessageTemplateLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
};

export type MessageTemplateLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MessageTemplateLinkingCollectionsGuaranteeTemplateCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MessageTemplateOrder =
  | "event_ASC"
  | "event_DESC"
  | "subject_ASC"
  | "subject_DESC"
  | "notificationBody_ASC"
  | "notificationBody_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/migration) */
export type Migration = Entry & {
  __typename?: "Migration";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MigrationLinkingCollections>;
  state?: Maybe<Scalars["JSON"]>;
  contentTypeId?: Maybe<Scalars["String"]>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/migration) */
export type MigrationLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/migration) */
export type MigrationStateArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/migration) */
export type MigrationContentTypeIdArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type MigrationCollection = {
  __typename?: "MigrationCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<Migration>>;
};

export type MigrationFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  contentTypeId_exists?: Maybe<Scalars["Boolean"]>;
  contentTypeId?: Maybe<Scalars["String"]>;
  contentTypeId_not?: Maybe<Scalars["String"]>;
  contentTypeId_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  contentTypeId_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  contentTypeId_contains?: Maybe<Scalars["String"]>;
  contentTypeId_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<MigrationFilter>>>;
  AND?: Maybe<Array<Maybe<MigrationFilter>>>;
};

export type MigrationLinkingCollections = {
  __typename?: "MigrationLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type MigrationLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type MigrationOrder =
  | "contentTypeId_ASC"
  | "contentTypeId_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: "Mutation";
  bulkImport?: Maybe<ImportPayload>;
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
  /** Deletes a single `Company` using its globally unique id. */
  deleteCompanyByNodeId?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `CompanyDocument` using a unique key. */
  deleteCompanyDocument?: Maybe<DeleteCompanyDocumentPayload>;
  /** Deletes a single `CompanyDocument` using its globally unique id. */
  deleteCompanyDocumentByNodeId?: Maybe<DeleteCompanyDocumentPayload>;
  /** Deletes a single `CompanyMember` using a unique key. */
  deleteCompanyMember?: Maybe<DeleteCompanyMemberPayload>;
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
  invite?: Maybe<Invitation>;
  linkAccountToCompany?: Maybe<LinkAccountToCompanyPayload>;
  publishMessage?: Maybe<Publish>;
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
  /** Updates a single `Company` using its globally unique id and a patch. */
  updateCompanyByNodeId?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `CompanyDocument` using a unique key and a patch. */
  updateCompanyDocument?: Maybe<UpdateCompanyDocumentPayload>;
  /** Updates a single `CompanyDocument` using its globally unique id and a patch. */
  updateCompanyDocumentByNodeId?: Maybe<UpdateCompanyDocumentPayload>;
  /** Updates a single `CompanyMember` using a unique key and a patch. */
  updateCompanyMember?: Maybe<UpdateCompanyMemberPayload>;
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
  /** Updates a single `EvidenceItem` using a unique key and a patch. */
  updateEvidenceItem?: Maybe<UpdateEvidenceItemPayload>;
  /** Updates a single `EvidenceItem` using its globally unique id and a patch. */
  updateEvidenceItemByNodeId?: Maybe<UpdateEvidenceItemPayload>;
  /** Updates a single `Guarantee` using a unique key and a patch. */
  updateGuarantee?: Maybe<UpdateGuaranteePayload>;
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
  input?: Maybe<UserCreateInput>;
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
  username: Scalars["String"];
  path?: Maybe<Scalars["String"]>;
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
export type MutationDeleteCompanyByNodeIdArgs = {
  input: DeleteCompanyByNodeIdInput;
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
export type MutationInviteArgs = {
  input: InviteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationLinkAccountToCompanyArgs = {
  input: LinkAccountToCompanyInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishMessageArgs = {
  input: PublishInput;
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
export type MutationUpdateCompanyByNodeIdArgs = {
  input: UpdateCompanyByNodeIdInput;
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
export type MutationUpdateTrainingArgs = {
  lastUpdateDate?: Maybe<Scalars["String"]>;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
};

/** A note added by a BMI admin. It is likely to be either a short note regarding approval, saying something like, Approved, or Good Job, or a note explaining a rejection, saying  something like, The photographs of the roof are not clear enough. */
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
export type NotesOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "AUTHOR_ID_ASC"
  | "AUTHOR_ID_DESC"
  | "PROJECT_ID_ASC"
  | "PROJECT_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

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
export type NotificationsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "ACCOUNT_ID_ASC"
  | "ACCOUNT_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

export type Operation =
  | "FLAT"
  | "PITCHED"
  | "SOLAR"
  | "BITUMEN"
  | "TILE"
  | "COATER"
  | "GREEN";

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

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/partnerBrand) */
export type PartnerBrand = Entry & {
  __typename?: "PartnerBrand";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<PartnerBrandLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  image?: Maybe<Asset>;
  logo?: Maybe<Asset>;
  description?: Maybe<PartnerBrandDescription>;
  shortDescription?: Maybe<Scalars["String"]>;
  websiteUrl?: Maybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/partnerBrand) */
export type PartnerBrandLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/partnerBrand) */
export type PartnerBrandNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/partnerBrand) */
export type PartnerBrandImageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/partnerBrand) */
export type PartnerBrandLogoArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/partnerBrand) */
export type PartnerBrandDescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/partnerBrand) */
export type PartnerBrandShortDescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** MarketAdmin could change these every 6 months [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/partnerBrand) */
export type PartnerBrandWebsiteUrlArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type PartnerBrandCollection = {
  __typename?: "PartnerBrandCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<PartnerBrand>>;
};

export type PartnerBrandDescription = {
  __typename?: "PartnerBrandDescription";
  json: Scalars["JSON"];
  links: PartnerBrandDescriptionLinks;
};

export type PartnerBrandDescriptionAssets = {
  __typename?: "PartnerBrandDescriptionAssets";
  hyperlink: Array<Maybe<Asset>>;
  block: Array<Maybe<Asset>>;
};

export type PartnerBrandDescriptionEntries = {
  __typename?: "PartnerBrandDescriptionEntries";
  inline: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  block: Array<Maybe<Entry>>;
};

export type PartnerBrandDescriptionLinks = {
  __typename?: "PartnerBrandDescriptionLinks";
  entries: PartnerBrandDescriptionEntries;
  assets: PartnerBrandDescriptionAssets;
};

export type PartnerBrandFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name_exists?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  image_exists?: Maybe<Scalars["Boolean"]>;
  logo_exists?: Maybe<Scalars["Boolean"]>;
  description_exists?: Maybe<Scalars["Boolean"]>;
  description_contains?: Maybe<Scalars["String"]>;
  description_not_contains?: Maybe<Scalars["String"]>;
  shortDescription_exists?: Maybe<Scalars["Boolean"]>;
  shortDescription?: Maybe<Scalars["String"]>;
  shortDescription_not?: Maybe<Scalars["String"]>;
  shortDescription_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  shortDescription_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  shortDescription_contains?: Maybe<Scalars["String"]>;
  shortDescription_not_contains?: Maybe<Scalars["String"]>;
  websiteUrl_exists?: Maybe<Scalars["Boolean"]>;
  websiteUrl?: Maybe<Scalars["String"]>;
  websiteUrl_not?: Maybe<Scalars["String"]>;
  websiteUrl_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  websiteUrl_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  websiteUrl_contains?: Maybe<Scalars["String"]>;
  websiteUrl_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<PartnerBrandFilter>>>;
  AND?: Maybe<Array<Maybe<PartnerBrandFilter>>>;
};

export type PartnerBrandLinkingCollections = {
  __typename?: "PartnerBrandLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  marketContentCollection?: Maybe<MarketContentCollection>;
};

export type PartnerBrandLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type PartnerBrandLinkingCollectionsMarketContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type PartnerBrandOrder =
  | "name_ASC"
  | "name_DESC"
  | "websiteUrl_ASC"
  | "websiteUrl_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

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
  /** Short name for the Product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the Product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the Product is avialable for new guarantees */
  published?: Maybe<Scalars["Boolean"]>;
  /** The number of years that this product can be guaranteed for */
  maximumValidityYears?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `Product`. */
  market?: Maybe<Market>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByProductBmiRef: GuaranteesConnection;
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembersByProductBmiRef: SystemMembersConnection;
};

/** A product made by BMI */
export type ProductGuaranteesByProductBmiRefArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

/** A product made by BMI */
export type ProductSystemMembersByProductBmiRefArgs = {
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
  /** Checks for equality with the object’s `bmiRef` field. */
  bmiRef?: Maybe<Scalars["String"]>;
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
  /** Short name for the Product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the Product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the Product is avialable for new guarantees */
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
  /** Short name for the Product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the Product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the Product is avialable for new guarantees */
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
export type ProductsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "BMI_REF_ASC"
  | "BMI_REF_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** A project that has been put into InTouch by a Company Administrator to represent a project being done by that company */
export type Project = Node & {
  __typename?: "Project";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** Short name for the Project */
  name?: Maybe<Scalars["String"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: Maybe<Scalars["String"]>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: Maybe<Scalars["Boolean"]>;
  /** The number of square meters of roof that this project covers */
  roofArea?: Maybe<Scalars["Int"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project officially starts or started */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: Maybe<Scalars["Datetime"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Company` that is related to this `Project`. */
  company?: Maybe<Company>;
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guarantees: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Note`. */
  notes: NotesConnection;
  /** Reads and enables pagination through a set of `ProjectMember`. */
  projectMembers: ProjectMembersConnection;
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
  /** Checks for equality with the object’s `siteAddressId` field. */
  siteAddressId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `buildingOwnerAddressId` field. */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Project` */
export type ProjectInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** Short name for the Project */
  name?: Maybe<Scalars["String"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: Maybe<Scalars["String"]>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: Maybe<Scalars["Boolean"]>;
  /** The number of square meters of roof that this project covers */
  roofArea?: Maybe<Scalars["Int"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project officially starts or started */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project officially expects to end or ended */
  endDate?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** People who are on a Project */
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
export type ProjectMembersOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "PROJECT_ID_ASC"
  | "PROJECT_ID_DESC"
  | "ACCOUNT_ID_ASC"
  | "ACCOUNT_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

/** Represents an update to a `Project`. Fields that are set will be updated. */
export type ProjectPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
  /** ek */
  technology?: Maybe<Technology>;
  /** Short name for the Project */
  name?: Maybe<Scalars["String"]>;
  /** Short description of what the Project is about.  Sometimes useful to clarify some points to BMI */
  description?: Maybe<Scalars["String"]>;
  /** If this is true then the Project should be hidden from End Users */
  hidden?: Maybe<Scalars["Boolean"]>;
  /** The number of square meters of roof that this project covers */
  roofArea?: Maybe<Scalars["Int"]>;
  /** Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project. */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company. */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project officially starts or started */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project officially expects to end or ended */
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
export type ProjectsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "COMPANY_ID_ASC"
  | "COMPANY_ID_DESC"
  | "SITE_ADDRESS_ID_ASC"
  | "SITE_ADDRESS_ID_DESC"
  | "BUILDING_OWNER_ADDRESS_ID_ASC"
  | "BUILDING_OWNER_ADDRESS_ID_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

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
  /** Reads and enables pagination through a set of `Company`. */
  companies?: Maybe<CompaniesConnection>;
  company?: Maybe<Company>;
  /** Reads a single `Company` using its globally unique `ID`. */
  companyByNodeId?: Maybe<Company>;
  companyDocument?: Maybe<CompanyDocument>;
  /** Reads a single `CompanyDocument` using its globally unique `ID`. */
  companyDocumentByNodeId?: Maybe<CompanyDocument>;
  /** Reads and enables pagination through a set of `CompanyDocument`. */
  companyDocuments?: Maybe<CompanyDocumentsConnection>;
  companyMember?: Maybe<CompanyMember>;
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
  guarantee?: Maybe<Guarantee>;
  /** Reads a single `Guarantee` using its globally unique `ID`. */
  guaranteeByNodeId?: Maybe<Guarantee>;
  guaranteeTemplate?: Maybe<GuaranteeTemplate>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
  guaranteeType?: Maybe<GuaranteeType>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guarantees?: Maybe<GuaranteesConnection>;
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
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  system?: Maybe<System>;
  systemByBmiRef?: Maybe<System>;
  /** Reads a single `System` using its globally unique `ID`. */
  systemByNodeId?: Maybe<System>;
  systemMember?: Maybe<SystemMember>;
  /** Reads a single `SystemMember` using its globally unique `ID`. */
  systemMemberByNodeId?: Maybe<SystemMember>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AccountsOrderBy>>;
  condition?: Maybe<AccountCondition>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AddressesOrderBy>>;
  condition?: Maybe<AddressCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAssetArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAssetCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<AssetFilter>;
  order?: Maybe<Array<Maybe<AssetOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCarouselArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCarouselCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<CarouselFilter>;
  order?: Maybe<Array<Maybe<CarouselOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCarouselItemArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCarouselItemCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<CarouselItemFilter>;
  order?: Maybe<Array<Maybe<CarouselItemOrder>>>;
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
export type QueryCompanyArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyByNodeIdArgs = {
  nodeId: Scalars["ID"];
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyDocumentsOrderBy>>;
  condition?: Maybe<CompanyDocumentCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
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
export type QueryCompanyOperationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCompanyOperationByNodeIdArgs = {
  nodeId: Scalars["ID"];
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
export type QueryContactDetailsArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryContactDetailsCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<ContactDetailsFilter>;
  order?: Maybe<Array<Maybe<ContactDetailsOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryContentArticleArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryContentArticleCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<ContentArticleFilter>;
  order?: Maybe<Array<Maybe<ContentArticleOrder>>>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseCatalogueTempsOrderBy>>;
  condition?: Maybe<CourseCatalogueTempCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCataloguesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseCataloguesOrderBy>>;
  condition?: Maybe<CourseCatalogueCondition>;
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
  userId: Scalars["Int"];
  courseId: Scalars["Int"];
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseEnrollmentTempsOrderBy>>;
  condition?: Maybe<CourseEnrollmentTempCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseEnrollmentsOrderBy>>;
  condition?: Maybe<CourseEnrollmentCondition>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseSyncConfigurationsOrderBy>>;
  condition?: Maybe<CourseSyncConfigurationCondition>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseTempsOrderBy>>;
  condition?: Maybe<CourseTempCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCoursesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CoursesOrderBy>>;
  condition?: Maybe<CourseCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<EntryFilter>;
  order?: Maybe<Array<Maybe<EntryOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceCategoryArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryEvidenceCategoryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<EvidenceCategoryFilter>;
  order?: Maybe<Array<Maybe<EvidenceCategoryOrder>>>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<EvidenceItemsOrderBy>>;
  condition?: Maybe<EvidenceItemCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeTemplateArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeTemplateCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<GuaranteeTemplateFilter>;
  order?: Maybe<Array<Maybe<GuaranteeTemplateOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeTypeArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGuaranteeTypeCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<GuaranteeTypeFilter>;
  order?: Maybe<Array<Maybe<GuaranteeTypeOrder>>>;
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
export type QueryInvitationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryInvitationByNodeIdArgs = {
  nodeId: Scalars["ID"];
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
export type QueryInvitedByCompaniesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
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
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMarketContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MarketContentFilter>;
  order?: Maybe<Array<Maybe<MarketContentOrder>>>;
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
export type QueryMediaFolderArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMediaFolderCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MediaFolderFilter>;
  order?: Maybe<Array<Maybe<MediaFolderOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMediaToolArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMediaToolCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MediaToolFilter>;
  order?: Maybe<Array<Maybe<MediaToolOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMessageTemplateArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMessageTemplateCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MessageTemplateFilter>;
  order?: Maybe<Array<Maybe<MessageTemplateOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMigrationArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMigrationCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MigrationFilter>;
  order?: Maybe<Array<Maybe<MigrationOrder>>>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotesOrderBy>>;
  condition?: Maybe<NoteCondition>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryPartnerBrandArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryPartnerBrandCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<PartnerBrandFilter>;
  order?: Maybe<Array<Maybe<PartnerBrandOrder>>>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProductsOrderBy>>;
  condition?: Maybe<ProductCondition>;
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
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectMembersOrderBy>>;
  condition?: Maybe<ProjectMemberCondition>;
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
export type QueryTierBenefitArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTierBenefitCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<TierBenefitFilter>;
  order?: Maybe<Array<Maybe<TierBenefitOrder>>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTokenByUsernameArgs = {
  username: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryTrainingContentArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTrainingContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<TrainingContentFilter>;
  order?: Maybe<Array<Maybe<TrainingContentOrder>>>;
};

export type RequestStatus =
  | "NEW"
  | "SUBMITTED"
  | "REVIEW"
  | "REJECTED"
  | "APPROVED";

export type Role =
  | "SUPER_ADMIN"
  | "MARKET_ADMIN"
  | "INSTALLER"
  | "COMPANY_ADMIN";

export type SsoUrlOutput = {
  __typename?: "SSOUrlOutput";
  url?: Maybe<Scalars["String"]>;
};

export type SelectOrgchart = {
  branch_id?: Maybe<Scalars["String"]>;
};

export type Sys = {
  __typename?: "Sys";
  id: Scalars["String"];
  spaceId: Scalars["String"];
  environmentId: Scalars["String"];
  publishedAt?: Maybe<Scalars["DateTime"]>;
  firstPublishedAt?: Maybe<Scalars["DateTime"]>;
  publishedVersion?: Maybe<Scalars["Int"]>;
};

export type SysFilter = {
  id_exists?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["String"]>;
  id_not?: Maybe<Scalars["String"]>;
  id_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  id_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  id_contains?: Maybe<Scalars["String"]>;
  id_not_contains?: Maybe<Scalars["String"]>;
  publishedAt_exists?: Maybe<Scalars["Boolean"]>;
  publishedAt?: Maybe<Scalars["DateTime"]>;
  publishedAt_not?: Maybe<Scalars["DateTime"]>;
  publishedAt_in?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
  publishedAt_not_in?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
  publishedAt_gt?: Maybe<Scalars["DateTime"]>;
  publishedAt_gte?: Maybe<Scalars["DateTime"]>;
  publishedAt_lt?: Maybe<Scalars["DateTime"]>;
  publishedAt_lte?: Maybe<Scalars["DateTime"]>;
  firstPublishedAt_exists?: Maybe<Scalars["Boolean"]>;
  firstPublishedAt?: Maybe<Scalars["DateTime"]>;
  firstPublishedAt_not?: Maybe<Scalars["DateTime"]>;
  firstPublishedAt_in?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
  firstPublishedAt_not_in?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
  firstPublishedAt_gt?: Maybe<Scalars["DateTime"]>;
  firstPublishedAt_gte?: Maybe<Scalars["DateTime"]>;
  firstPublishedAt_lt?: Maybe<Scalars["DateTime"]>;
  firstPublishedAt_lte?: Maybe<Scalars["DateTime"]>;
  publishedVersion_exists?: Maybe<Scalars["Boolean"]>;
  publishedVersion?: Maybe<Scalars["Float"]>;
  publishedVersion_not?: Maybe<Scalars["Float"]>;
  publishedVersion_in?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  publishedVersion_not_in?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  publishedVersion_gt?: Maybe<Scalars["Float"]>;
  publishedVersion_gte?: Maybe<Scalars["Float"]>;
  publishedVersion_lt?: Maybe<Scalars["Float"]>;
  publishedVersion_lte?: Maybe<Scalars["Float"]>;
};

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
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published?: Maybe<Scalars["Boolean"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `System`. */
  market?: Maybe<Market>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesBySystemBmiRef: GuaranteesConnection;
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembersBySystemBmiRef: SystemMembersConnection;
};

/** A collection of products that can be guaranteed as a system */
export type SystemGuaranteesBySystemBmiRefArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

/** A collection of products that can be guaranteed as a system */
export type SystemSystemMembersBySystemBmiRefArgs = {
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
  /** Checks for equality with the object’s `bmiRef` field. */
  bmiRef?: Maybe<Scalars["String"]>;
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
  /** If true this system is available for users to select when applying for a system or solution guarantee */
  published?: Maybe<Scalars["Boolean"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A Products that make up a system */
export type SystemMember = Node & {
  __typename?: "SystemMember";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  productBmiRef?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `System` that is related to this `SystemMember`. */
  systemBySystemBmiRef?: Maybe<System>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  productByProductBmiRef?: Maybe<Product>;
};

/**
 * A condition to be used against `SystemMember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SystemMemberCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `systemBmiRef` field. */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** Checks for equality with the object’s `productBmiRef` field. */
  productBmiRef?: Maybe<Scalars["String"]>;
};

/** An input for mutations affecting `SystemMember` */
export type SystemMemberInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  productBmiRef?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `SystemMember`. Fields that are set will be updated. */
export type SystemMemberPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  systemBmiRef?: Maybe<Scalars["String"]>;
  /** fk */
  productBmiRef?: Maybe<Scalars["String"]>;
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
export type SystemMembersOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "SYSTEM_BMI_REF_ASC"
  | "SYSTEM_BMI_REF_DESC"
  | "PRODUCT_BMI_REF_ASC"
  | "PRODUCT_BMI_REF_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

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
  /** If true this system is available for users to select when applying for a system or solution guarantee */
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
export type SystemsOrderBy =
  | "NATURAL"
  | "ID_ASC"
  | "ID_DESC"
  | "MARKET_ID_ASC"
  | "MARKET_ID_DESC"
  | "BMI_REF_ASC"
  | "BMI_REF_DESC"
  | "PRIMARY_KEY_ASC"
  | "PRIMARY_KEY_DESC";

export type Technology = "FLAT" | "PITCHED" | "OTHER";

export type Tier = "T1" | "T2" | "T3" | "T4";

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/tierBenefit) */
export type TierBenefit = Entry & {
  __typename?: "TierBenefit";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<TierBenefitLinkingCollections>;
  name?: Maybe<Scalars["String"]>;
  tier?: Maybe<Scalars["String"]>;
  description?: Maybe<TierBenefitDescription>;
  shortDescription?: Maybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/tierBenefit) */
export type TierBenefitLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/tierBenefit) */
export type TierBenefitNameArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/tierBenefit) */
export type TierBenefitTierArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/tierBenefit) */
export type TierBenefitDescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** A benefit received by being part of a tier [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/tierBenefit) */
export type TierBenefitShortDescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type TierBenefitCollection = {
  __typename?: "TierBenefitCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<TierBenefit>>;
};

export type TierBenefitDescription = {
  __typename?: "TierBenefitDescription";
  json: Scalars["JSON"];
  links: TierBenefitDescriptionLinks;
};

export type TierBenefitDescriptionAssets = {
  __typename?: "TierBenefitDescriptionAssets";
  hyperlink: Array<Maybe<Asset>>;
  block: Array<Maybe<Asset>>;
};

export type TierBenefitDescriptionEntries = {
  __typename?: "TierBenefitDescriptionEntries";
  inline: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  block: Array<Maybe<Entry>>;
};

export type TierBenefitDescriptionLinks = {
  __typename?: "TierBenefitDescriptionLinks";
  entries: TierBenefitDescriptionEntries;
  assets: TierBenefitDescriptionAssets;
};

export type TierBenefitFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name_exists?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  tier_exists?: Maybe<Scalars["Boolean"]>;
  tier?: Maybe<Scalars["String"]>;
  tier_not?: Maybe<Scalars["String"]>;
  tier_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tier_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tier_contains?: Maybe<Scalars["String"]>;
  tier_not_contains?: Maybe<Scalars["String"]>;
  description_exists?: Maybe<Scalars["Boolean"]>;
  description_contains?: Maybe<Scalars["String"]>;
  description_not_contains?: Maybe<Scalars["String"]>;
  shortDescription_exists?: Maybe<Scalars["Boolean"]>;
  shortDescription?: Maybe<Scalars["String"]>;
  shortDescription_not?: Maybe<Scalars["String"]>;
  shortDescription_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  shortDescription_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  shortDescription_contains?: Maybe<Scalars["String"]>;
  shortDescription_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<TierBenefitFilter>>>;
  AND?: Maybe<Array<Maybe<TierBenefitFilter>>>;
};

export type TierBenefitLinkingCollections = {
  __typename?: "TierBenefitLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type TierBenefitLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type TierBenefitOrder =
  | "name_ASC"
  | "name_DESC"
  | "tier_ASC"
  | "tier_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

export type Token = {
  __typename?: "Token";
  access_token?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContent = Entry & {
  __typename?: "TrainingContent";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<TrainingContentLinkingCollections>;
  pageHeading?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  lmsCtaLabel?: Maybe<Scalars["String"]>;
  image?: Maybe<Asset>;
  pageSubHeading?: Maybe<Scalars["String"]>;
  step1Heading?: Maybe<Scalars["String"]>;
  step1SubHeading?: Maybe<Scalars["String"]>;
  step1Description?: Maybe<Scalars["String"]>;
  step2Heading?: Maybe<Scalars["String"]>;
  step2SubHeading?: Maybe<Scalars["String"]>;
  step2Description?: Maybe<Scalars["String"]>;
  step3Heading?: Maybe<Scalars["String"]>;
  step3SubHeading?: Maybe<Scalars["String"]>;
  step3Description?: Maybe<Scalars["String"]>;
  live?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentPageHeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentDescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentLmsCtaLabelArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentImageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentPageSubHeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep1HeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep1SubHeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep1DescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep2HeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep2SubHeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep2DescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep3HeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep3SubHeadingArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentStep3DescriptionArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/trainingContent) */
export type TrainingContentLiveArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type TrainingContentCollection = {
  __typename?: "TrainingContentCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<TrainingContent>>;
};

export type TrainingContentFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  pageHeading_exists?: Maybe<Scalars["Boolean"]>;
  pageHeading?: Maybe<Scalars["String"]>;
  pageHeading_not?: Maybe<Scalars["String"]>;
  pageHeading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  pageHeading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  pageHeading_contains?: Maybe<Scalars["String"]>;
  pageHeading_not_contains?: Maybe<Scalars["String"]>;
  description_exists?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
  description_not?: Maybe<Scalars["String"]>;
  description_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  description_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  description_contains?: Maybe<Scalars["String"]>;
  description_not_contains?: Maybe<Scalars["String"]>;
  lmsCtaLabel_exists?: Maybe<Scalars["Boolean"]>;
  lmsCtaLabel?: Maybe<Scalars["String"]>;
  lmsCtaLabel_not?: Maybe<Scalars["String"]>;
  lmsCtaLabel_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  lmsCtaLabel_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  lmsCtaLabel_contains?: Maybe<Scalars["String"]>;
  lmsCtaLabel_not_contains?: Maybe<Scalars["String"]>;
  image_exists?: Maybe<Scalars["Boolean"]>;
  pageSubHeading_exists?: Maybe<Scalars["Boolean"]>;
  pageSubHeading?: Maybe<Scalars["String"]>;
  pageSubHeading_not?: Maybe<Scalars["String"]>;
  pageSubHeading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  pageSubHeading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  pageSubHeading_contains?: Maybe<Scalars["String"]>;
  pageSubHeading_not_contains?: Maybe<Scalars["String"]>;
  step1Heading_exists?: Maybe<Scalars["Boolean"]>;
  step1Heading?: Maybe<Scalars["String"]>;
  step1Heading_not?: Maybe<Scalars["String"]>;
  step1Heading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step1Heading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step1Heading_contains?: Maybe<Scalars["String"]>;
  step1Heading_not_contains?: Maybe<Scalars["String"]>;
  step1SubHeading_exists?: Maybe<Scalars["Boolean"]>;
  step1SubHeading?: Maybe<Scalars["String"]>;
  step1SubHeading_not?: Maybe<Scalars["String"]>;
  step1SubHeading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step1SubHeading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step1SubHeading_contains?: Maybe<Scalars["String"]>;
  step1SubHeading_not_contains?: Maybe<Scalars["String"]>;
  step1Description_exists?: Maybe<Scalars["Boolean"]>;
  step1Description?: Maybe<Scalars["String"]>;
  step1Description_not?: Maybe<Scalars["String"]>;
  step1Description_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step1Description_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step1Description_contains?: Maybe<Scalars["String"]>;
  step1Description_not_contains?: Maybe<Scalars["String"]>;
  step2Heading_exists?: Maybe<Scalars["Boolean"]>;
  step2Heading?: Maybe<Scalars["String"]>;
  step2Heading_not?: Maybe<Scalars["String"]>;
  step2Heading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step2Heading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step2Heading_contains?: Maybe<Scalars["String"]>;
  step2Heading_not_contains?: Maybe<Scalars["String"]>;
  step2SubHeading_exists?: Maybe<Scalars["Boolean"]>;
  step2SubHeading?: Maybe<Scalars["String"]>;
  step2SubHeading_not?: Maybe<Scalars["String"]>;
  step2SubHeading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step2SubHeading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step2SubHeading_contains?: Maybe<Scalars["String"]>;
  step2SubHeading_not_contains?: Maybe<Scalars["String"]>;
  step2Description_exists?: Maybe<Scalars["Boolean"]>;
  step2Description?: Maybe<Scalars["String"]>;
  step2Description_not?: Maybe<Scalars["String"]>;
  step2Description_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step2Description_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step2Description_contains?: Maybe<Scalars["String"]>;
  step2Description_not_contains?: Maybe<Scalars["String"]>;
  step3Heading_exists?: Maybe<Scalars["Boolean"]>;
  step3Heading?: Maybe<Scalars["String"]>;
  step3Heading_not?: Maybe<Scalars["String"]>;
  step3Heading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step3Heading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step3Heading_contains?: Maybe<Scalars["String"]>;
  step3Heading_not_contains?: Maybe<Scalars["String"]>;
  step3SubHeading_exists?: Maybe<Scalars["Boolean"]>;
  step3SubHeading?: Maybe<Scalars["String"]>;
  step3SubHeading_not?: Maybe<Scalars["String"]>;
  step3SubHeading_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step3SubHeading_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step3SubHeading_contains?: Maybe<Scalars["String"]>;
  step3SubHeading_not_contains?: Maybe<Scalars["String"]>;
  step3Description_exists?: Maybe<Scalars["Boolean"]>;
  step3Description?: Maybe<Scalars["String"]>;
  step3Description_not?: Maybe<Scalars["String"]>;
  step3Description_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step3Description_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  step3Description_contains?: Maybe<Scalars["String"]>;
  step3Description_not_contains?: Maybe<Scalars["String"]>;
  live_exists?: Maybe<Scalars["Boolean"]>;
  live?: Maybe<Scalars["String"]>;
  live_not?: Maybe<Scalars["String"]>;
  live_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  live_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  live_contains?: Maybe<Scalars["String"]>;
  live_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<TrainingContentFilter>>>;
  AND?: Maybe<Array<Maybe<TrainingContentFilter>>>;
};

export type TrainingContentLinkingCollections = {
  __typename?: "TrainingContentLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type TrainingContentLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type TrainingContentOrder =
  | "pageHeading_ASC"
  | "pageHeading_DESC"
  | "lmsCtaLabel_ASC"
  | "lmsCtaLabel_DESC"
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
  | "live_ASC"
  | "live_DESC"
  | "sys_id_ASC"
  | "sys_id_DESC"
  | "sys_publishedAt_ASC"
  | "sys_publishedAt_DESC"
  | "sys_firstPublishedAt_ASC"
  | "sys_firstPublishedAt_DESC"
  | "sys_publishedVersion_ASC"
  | "sys_publishedVersion_DESC";

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

/** All input for the `updateAccountByEmail` mutation. */
export type UpdateAccountByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
  /** The email address associated with the account */
  email: Scalars["String"];
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
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
};

/** The output of our update `Company` mutation. */
export type UpdateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
};

/** All input for the `updateCourseByCourseId` mutation. */
export type UpdateCourseByCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Course` being updated. */
  patch: CoursePatch;
  /** Docebo CourseId */
  courseId: Scalars["Int"];
};

/** All input for the `updateCourseByNodeId` mutation. */
export type UpdateCourseByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Course` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Course` being updated. */
  patch: CoursePatch;
};

/** All input for the `updateCourseCatalogueByCatalogueIdAndCourseId` mutation. */
export type UpdateCourseCatalogueByCatalogueIdAndCourseIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseCatalogue` being updated. */
  patch: CourseCataloguePatch;
  /** market */
  catalogueId: Scalars["Int"];
  /** fk */
  courseId: Scalars["Int"];
};

/** All input for the `updateCourseCatalogueByNodeId` mutation. */
export type UpdateCourseCatalogueByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseCatalogue` being updated. */
  patch: CourseCataloguePatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `CourseCatalogue` mutation. */
export type UpdateCourseCataloguePayload = {
  __typename?: "UpdateCourseCataloguePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseCatalogue` that was updated by this mutation. */
  courseCatalogue?: Maybe<CourseCatalogue>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Course` that is related to this `CourseCatalogue`. */
  course?: Maybe<Course>;
  /** An edge for our `CourseCatalogue`. May be used by Relay 1. */
  courseCatalogueEdge?: Maybe<CourseCataloguesEdge>;
};

/** The output of our update `CourseCatalogue` mutation. */
export type UpdateCourseCataloguePayloadCourseCatalogueEdgeArgs = {
  orderBy?: Maybe<Array<CourseCataloguesOrderBy>>;
};

/** All input for the `updateCourseCatalogueTempByNodeId` mutation. */
export type UpdateCourseCatalogueTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseCatalogueTemp` being updated. */
  patch: CourseCatalogueTempPatch;
  /** Primary key */
  id: Scalars["Int"];
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseCatalogueTemp`. May be used by Relay 1. */
  courseCatalogueTempEdge?: Maybe<CourseCatalogueTempsEdge>;
};

/** The output of our update `CourseCatalogueTemp` mutation. */
export type UpdateCourseCatalogueTempPayloadCourseCatalogueTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseCatalogueTempsOrderBy>>;
};

/** All input for the `updateCourseEnrollmentByNodeId` mutation. */
export type UpdateCourseEnrollmentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseEnrollment` being updated. */
  patch: CourseEnrollmentPatch;
  /** account */
  userId: Scalars["Int"];
  /** fk */
  courseId: Scalars["Int"];
};

/** All input for the `updateCourseEnrollment` mutation. */
export type UpdateCourseEnrollmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseEnrollment` being updated. */
  patch: CourseEnrollmentPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `CourseEnrollment` mutation. */
export type UpdateCourseEnrollmentPayload = {
  __typename?: "UpdateCourseEnrollmentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `CourseEnrollment` that was updated by this mutation. */
  courseEnrollment?: Maybe<CourseEnrollment>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Course` that is related to this `CourseEnrollment`. */
  course?: Maybe<Course>;
  /** An edge for our `CourseEnrollment`. May be used by Relay 1. */
  courseEnrollmentEdge?: Maybe<CourseEnrollmentsEdge>;
};

/** The output of our update `CourseEnrollment` mutation. */
export type UpdateCourseEnrollmentPayloadCourseEnrollmentEdgeArgs = {
  orderBy?: Maybe<Array<CourseEnrollmentsOrderBy>>;
};

/** All input for the `updateCourseEnrollmentTempByNodeId` mutation. */
export type UpdateCourseEnrollmentTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseEnrollmentTemp` being updated. */
  patch: CourseEnrollmentTempPatch;
  /** Primary key */
  id: Scalars["Int"];
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseEnrollmentTemp`. May be used by Relay 1. */
  courseEnrollmentTempEdge?: Maybe<CourseEnrollmentTempsEdge>;
};

/** The output of our update `CourseEnrollmentTemp` mutation. */
export type UpdateCourseEnrollmentTempPayloadCourseEnrollmentTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseEnrollmentTempsOrderBy>>;
};

/** All input for the `updateCourse` mutation. */
export type UpdateCourseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Course` being updated. */
  patch: CoursePatch;
  /** Primary key */
  id: Scalars["Int"];
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Course`. May be used by Relay 1. */
  courseEdge?: Maybe<CoursesEdge>;
};

/** The output of our update `Course` mutation. */
export type UpdateCoursePayloadCourseEdgeArgs = {
  orderBy?: Maybe<Array<CoursesOrderBy>>;
};

/** All input for the `updateCourseSyncConfigurationByConfigName` mutation. */
export type UpdateCourseSyncConfigurationByConfigNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseSyncConfiguration` being updated. */
  patch: CourseSyncConfigurationPatch;
  /** account */
  configName: Scalars["String"];
};

/** All input for the `updateCourseSyncConfigurationByNodeId` mutation. */
export type UpdateCourseSyncConfigurationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseSyncConfiguration` being updated. */
  patch: CourseSyncConfigurationPatch;
  /** Primary key */
  id: Scalars["Int"];
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseSyncConfiguration`. May be used by Relay 1. */
  courseSyncConfigurationEdge?: Maybe<CourseSyncConfigurationsEdge>;
};

/** The output of our update `CourseSyncConfiguration` mutation. */
export type UpdateCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs =
  {
    orderBy?: Maybe<Array<CourseSyncConfigurationsOrderBy>>;
  };

/** All input for the `updateCourseTempByNodeId` mutation. */
export type UpdateCourseTempByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
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
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `CourseTemp` being updated. */
  patch: CourseTempPatch;
  /** Primary key */
  id: Scalars["Int"];
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
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `CourseTemp`. May be used by Relay 1. */
  courseTempEdge?: Maybe<CourseTempsEdge>;
};

/** The output of our update `CourseTemp` mutation. */
export type UpdateCourseTempPayloadCourseTempEdgeArgs = {
  orderBy?: Maybe<Array<CourseTempsOrderBy>>;
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
  systemBySystemBmiRef?: Maybe<System>;
  /** Reads a single `Product` that is related to this `Guarantee`. */
  productByProductBmiRef?: Maybe<Product>;
  /** Reads a single `Account` that is related to this `Guarantee`. */
  reviewerAccount?: Maybe<Account>;
  /** An edge for our `Guarantee`. May be used by Relay 1. */
  guaranteeEdge?: Maybe<GuaranteesEdge>;
};

/** The output of our update `Guarantee` mutation. */
export type UpdateGuaranteePayloadGuaranteeEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
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

/** All input for the `updateMarketByDoceboCatalogueId` mutation. */
export type UpdateMarketByDoceboCatalogueIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Market` being updated. */
  patch: MarketPatch;
  /** The default catalogue for the market.  All users in the market are able to see all courses in the default catalog from InTouch */
  doceboCatalogueId: Scalars["Int"];
};

/** All input for the `updateMarketByDomain` mutation. */
export type UpdateMarketByDomainInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Market` being updated. */
  patch: MarketPatch;
  /** the country code used for example as the subdomain */
  domain: Scalars["String"];
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

/** All input for the `updateProductByBmiRef` mutation. */
export type UpdateProductByBmiRefInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Product` being updated. */
  patch: ProductPatch;
  /** A unique reference for the product known to BMI */
  bmiRef: Scalars["String"];
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
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectsEdge>;
};

/** The output of our update `Project` mutation. */
export type UpdateProjectPayloadProjectEdgeArgs = {
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
};

/** All input for the `updateSystemByBmiRef` mutation. */
export type UpdateSystemByBmiRefInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `System` being updated. */
  patch: SystemPatch;
  /** A unique reference for the system known to BMI */
  bmiRef: Scalars["String"];
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
  systemBySystemBmiRef?: Maybe<System>;
  /** Reads a single `Product` that is related to this `SystemMember`. */
  productByProductBmiRef?: Maybe<Product>;
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

export type UserCreateInput = {
  userid?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  privacy?: Maybe<Scalars["String"]>;
  firstname?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
  force_change?: Maybe<Scalars["Int"]>;
  level?: Maybe<Scalars["Int"]>;
  language?: Maybe<Scalars["String"]>;
  expiration?: Maybe<Scalars["String"]>;
  email_validation_status?: Maybe<Scalars["Int"]>;
  valid?: Maybe<Scalars["Int"]>;
  date_format?: Maybe<Scalars["String"]>;
  timezone?: Maybe<Scalars["String"]>;
  role?: Maybe<Scalars["Int"]>;
  send_notification_email?: Maybe<Scalars["Boolean"]>;
  can_manage_subordinates?: Maybe<Scalars["Boolean"]>;
  select_orgchart?: Maybe<SelectOrgchart>;
};

export type UserCreateResponse = {
  __typename?: "UserCreateResponse";
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
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  title_exists?: Maybe<Scalars["Boolean"]>;
  title?: Maybe<Scalars["String"]>;
  title_not?: Maybe<Scalars["String"]>;
  title_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_contains?: Maybe<Scalars["String"]>;
  title_not_contains?: Maybe<Scalars["String"]>;
  relativePath_exists?: Maybe<Scalars["Boolean"]>;
  relativePath?: Maybe<Scalars["String"]>;
  relativePath_not?: Maybe<Scalars["String"]>;
  relativePath_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  relativePath_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  relativePath_contains?: Maybe<Scalars["String"]>;
  relativePath_not_contains?: Maybe<Scalars["String"]>;
  body_exists?: Maybe<Scalars["Boolean"]>;
  body_contains?: Maybe<Scalars["String"]>;
  body_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<CfContentArticleNestedFilter>>>;
  AND?: Maybe<Array<Maybe<CfContentArticleNestedFilter>>>;
};

export type CfMessageTemplateNestedFilter = {
  sys?: Maybe<SysFilter>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  event_exists?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<Scalars["String"]>;
  event_not?: Maybe<Scalars["String"]>;
  event_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  event_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  event_contains?: Maybe<Scalars["String"]>;
  event_not_contains?: Maybe<Scalars["String"]>;
  format_exists?: Maybe<Scalars["Boolean"]>;
  format_contains_all?: Maybe<Array<Maybe<Scalars["String"]>>>;
  format_contains_some?: Maybe<Array<Maybe<Scalars["String"]>>>;
  format_contains_none?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subject_exists?: Maybe<Scalars["Boolean"]>;
  subject?: Maybe<Scalars["String"]>;
  subject_not?: Maybe<Scalars["String"]>;
  subject_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subject_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subject_contains?: Maybe<Scalars["String"]>;
  subject_not_contains?: Maybe<Scalars["String"]>;
  notificationBody_exists?: Maybe<Scalars["Boolean"]>;
  notificationBody?: Maybe<Scalars["String"]>;
  notificationBody_not?: Maybe<Scalars["String"]>;
  notificationBody_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  notificationBody_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  notificationBody_contains?: Maybe<Scalars["String"]>;
  notificationBody_not_contains?: Maybe<Scalars["String"]>;
  emailBody_exists?: Maybe<Scalars["Boolean"]>;
  emailBody?: Maybe<Scalars["String"]>;
  emailBody_not?: Maybe<Scalars["String"]>;
  emailBody_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  emailBody_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  emailBody_contains?: Maybe<Scalars["String"]>;
  emailBody_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<CfMessageTemplateNestedFilter>>>;
  AND?: Maybe<Array<Maybe<CfMessageTemplateNestedFilter>>>;
};