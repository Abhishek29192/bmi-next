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

export enum AssetOrder {
  UrlAsc = "url_ASC",
  UrlDesc = "url_DESC",
  SizeAsc = "size_ASC",
  SizeDesc = "size_DESC",
  ContentTypeAsc = "contentType_ASC",
  ContentTypeDesc = "contentType_DESC",
  FileNameAsc = "fileName_ASC",
  FileNameDesc = "fileName_DESC",
  WidthAsc = "width_ASC",
  WidthDesc = "width_DESC",
  HeightAsc = "height_ASC",
  HeightDesc = "height_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

export enum BusinessType {
  Contractor = "CONTRACTOR",
  Architect = "ARCHITECT",
  Merchant = "MERCHANT",
  CorpDeveloper = "CORP_DEVELOPER"
}

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

export enum CarouselItemOrder {
  HeaderAsc = "header_ASC",
  HeaderDesc = "header_DESC",
  CtaAsc = "cta_ASC",
  CtaDesc = "cta_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum CarouselOrder {
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  AudienceRoleAsc = "audienceRole_ASC",
  AudienceRoleDesc = "audienceRole_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
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
  /**
   * A 7 digit reference number generated for all Companies and visible to Roofpro
   * member Companies. (aka membership number).  Should be unique.
   */
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
  /**
   * A 7 digit reference number generated for all Companies and visible to Roofpro
   * member Companies. (aka membership number).  Should be unique.
   */
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

/**
 * The assignment of an operation type to a Company by the Market Admin.  A Company
 * can be assigned multiple types from the allowed enums list.  The operation types
 * that a Company has are sent to Find a Roofer.
 */
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
  /**
   * A 7 digit reference number generated for all Companies and visible to Roofpro
   * member Companies. (aka membership number).  Should be unique.
   */
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

export enum ContactDetailsOrder {
  FullNameAsc = "fullName_ASC",
  FullNameDesc = "fullName_DESC",
  SubHeadingAsc = "subHeading_ASC",
  SubHeadingDesc = "subHeading_DESC",
  EmailAsc = "email_ASC",
  EmailDesc = "email_DESC",
  PhoneNumberAsc = "phoneNumber_ASC",
  PhoneNumberDesc = "phoneNumber_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum ContentArticleOrder {
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  RelativePathAsc = "relativePath_ASC",
  RelativePathDesc = "relativePath_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
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

/**
 * Course Catalog temp table.  The course cataloogues from docebo are pulled into
 * here first, before being merged into the course_catalogue table.
 */
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
export enum CourseCatalogueTempsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
export enum CourseCataloguesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CatalogueIdAsc = "CATALOGUE_ID_ASC",
  CatalogueIdDesc = "CATALOGUE_ID_DESC",
  CourseIdAsc = "COURSE_ID_ASC",
  CourseIdDesc = "COURSE_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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

/**
 * Course Enrollments temp table.  Enrollements are brought in here from Docebo
 * first, before being merged into the course_enrollemnt table
 */
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
export enum CourseEnrollmentTempsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
export enum CourseEnrollmentsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  UserIdAsc = "USER_ID_ASC",
  UserIdDesc = "USER_ID_DESC",
  CourseIdAsc = "COURSE_ID_ASC",
  CourseIdDesc = "COURSE_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
export enum CourseSyncConfigurationsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/**
 * A temporary training course that BMI offers in Docebo. Courses are brought from
 * Docebo into this table before being merged into the course table.
 */
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
  /** Promoted courses a listed higher than others */
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
  /** Promoted courses a listed higher than others */
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
  /** Promoted courses a listed higher than others */
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
export enum CourseTempsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
export enum CoursesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CourseIdAsc = "COURSE_ID_ASC",
  CourseIdDesc = "COURSE_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
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
  marketId?: Maybe<Scalars["Int"]>;
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

export enum EntryOrder {
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum EvidenceCategoryOrder {
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  MinimumUploadsAsc = "minimumUploads_ASC",
  MinimumUploadsDesc = "minimumUploads_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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
  /**
   * When the guarantee will expire.  This is calculated when the request_status
   * becomes APPROVED. dependent on the StartDate, the Validity of the Product or
   * System and the ValidityOffset in this Tier.
   */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /**
   * This will be presented on the Guarantee pdf itself, if approved and is the
   * primary reference for the Guarantees report. It is unique in the In the legacy
   * system, the number is 3 sets of 4 digit numbers concatenated into one long
   * number from the Company Id, Project Id and Request Id.
   */
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
  /**
   * When the guarantee will expire.  This is calculated when the request_status
   * becomes APPROVED. dependent on the StartDate, the Validity of the Product or
   * System and the ValidityOffset in this Tier.
   */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /**
   * This will be presented on the Guarantee pdf itself, if approved and is the
   * primary reference for the Guarantees report. It is unique in the In the legacy
   * system, the number is 3 sets of 4 digit numbers concatenated into one long
   * number from the Company Id, Project Id and Request Id.
   */
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
  /**
   * When the guarantee will expire.  This is calculated when the request_status
   * becomes APPROVED. dependent on the StartDate, the Validity of the Product or
   * System and the ValidityOffset in this Tier.
   */
  expiryDate?: Maybe<Scalars["Datetime"]>;
  /**
   * This will be presented on the Guarantee pdf itself, if approved and is the
   * primary reference for the Guarantees report. It is unique in the In the legacy
   * system, the number is 3 sets of 4 digit numbers concatenated into one long
   * number from the Company Id, Project Id and Request Id.
   */
  issueNumber?: Maybe<Scalars["String"]>;
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

export enum GuaranteeTemplateOrder {
  DisplayNameAsc = "displayName_ASC",
  DisplayNameDesc = "displayName_DESC",
  SignatoryAsc = "signatory_ASC",
  SignatoryDesc = "signatory_DESC",
  HeadingGuaranteeAsc = "headingGuarantee_ASC",
  HeadingGuaranteeDesc = "headingGuarantee_DESC",
  HeadingScopeAsc = "headingScope_ASC",
  HeadingScopeDesc = "headingScope_DESC",
  HeadingProductsAsc = "headingProducts_ASC",
  HeadingProductsDesc = "headingProducts_DESC",
  HeadingBeneficiaryAsc = "headingBeneficiary_ASC",
  HeadingBeneficiaryDesc = "headingBeneficiary_DESC",
  HeadingBuildingOwnerNameAsc = "headingBuildingOwnerName_ASC",
  HeadingBuildingOwnerNameDesc = "headingBuildingOwnerName_DESC",
  HeadingBuildingAddressAsc = "headingBuildingAddress_ASC",
  HeadingBuildingAddressDesc = "headingBuildingAddress_DESC",
  HeadingRoofAreaAsc = "headingRoofArea_ASC",
  HeadingRoofAreaDesc = "headingRoofArea_DESC",
  HeadingRoofTypeAsc = "headingRoofType_ASC",
  HeadingRoofTypeDesc = "headingRoofType_DESC",
  HeadingContractorAsc = "headingContractor_ASC",
  HeadingContractorDesc = "headingContractor_DESC",
  HeadingContractorNameAsc = "headingContractorName_ASC",
  HeadingContractorNameDesc = "headingContractorName_DESC",
  HeadingContractorIdAsc = "headingContractorId_ASC",
  HeadingContractorIdDesc = "headingContractorId_DESC",
  HeadingStartDateAsc = "headingStartDate_ASC",
  HeadingStartDateDesc = "headingStartDate_DESC",
  HeadingGuaranteeIdAsc = "headingGuaranteeId_ASC",
  HeadingGuaranteeIdDesc = "headingGuaranteeId_DESC",
  HeadingValidityAsc = "headingValidity_ASC",
  HeadingValidityDesc = "headingValidity_DESC",
  HeadingExpiryAsc = "headingExpiry_ASC",
  HeadingExpiryDesc = "headingExpiry_DESC",
  GuaranteeScopeAsc = "guaranteeScope_ASC",
  GuaranteeScopeDesc = "guaranteeScope_DESC",
  FilenamePrefixAsc = "filenamePrefix_ASC",
  FilenamePrefixDesc = "filenamePrefix_DESC",
  LockupLine1Asc = "lockupLine1_ASC",
  LockupLine1Desc = "lockupLine1_DESC",
  LockupLine2Asc = "lockupLine2_ASC",
  LockupLine2Desc = "lockupLine2_DESC",
  RoofTypeAsc = "roofType_ASC",
  RoofTypeDesc = "roofType_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum GuaranteeTypeOrder {
  DisplayNameAsc = "displayName_ASC",
  DisplayNameDesc = "displayName_DESC",
  TechnologyAsc = "technology_ASC",
  TechnologyDesc = "technology_DESC",
  CoverageAsc = "coverage_ASC",
  CoverageDesc = "coverage_DESC",
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  MaximumValidityYearsAsc = "maximumValidityYears_ASC",
  MaximumValidityYearsDesc = "maximumValidityYears_DESC",
  RankingAsc = "ranking_ASC",
  RankingDesc = "ranking_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum ImageFormat {
  /** JPG image format. */
  Jpg = "JPG",
  /**
   * Progressive JPG format stores multiple passes of an image in progressively higher detail.
   *         When a progressive image is loading, the viewer will first see a lower quality pixelated version which
   *         will gradually improve in detail, until the image is fully downloaded. This is to display an image as
   *         early as possible to make the layout look as designed.
   */
  JpgProgressive = "JPG_PROGRESSIVE",
  /** PNG image format */
  Png = "PNG",
  /**
   * 8-bit PNG images support up to 256 colors and weigh less than the standard 24-bit PNG equivalent.
   *         The 8-bit PNG format is mostly used for simple images, such as icons or logos.
   */
  Png8 = "PNG8",
  /** WebP image format. */
  Webp = "WEBP"
}

export enum ImageResizeFocus {
  /** Focus the resizing on the center. */
  Center = "CENTER",
  /** Focus the resizing on the top. */
  Top = "TOP",
  /** Focus the resizing on the top right. */
  TopRight = "TOP_RIGHT",
  /** Focus the resizing on the right. */
  Right = "RIGHT",
  /** Focus the resizing on the bottom right. */
  BottomRight = "BOTTOM_RIGHT",
  /** Focus the resizing on the bottom. */
  Bottom = "BOTTOM",
  /** Focus the resizing on the bottom left. */
  BottomLeft = "BOTTOM_LEFT",
  /** Focus the resizing on the left. */
  Left = "LEFT",
  /** Focus the resizing on the top left. */
  TopLeft = "TOP_LEFT",
  /** Focus the resizing on the largest face. */
  Face = "FACE",
  /** Focus the resizing on the area containing all the faces. */
  Faces = "FACES"
}

export enum ImageResizeStrategy {
  /** Resizes the image to fit into the specified dimensions. */
  Fit = "FIT",
  /**
   * Resizes the image to the specified dimensions, padding the image if needed.
   *         Uses desired background color as padding color.
   */
  Pad = "PAD",
  /** Resizes the image to the specified dimensions, cropping the image if needed. */
  Fill = "FILL",
  /** Resizes the image to the specified dimensions, changing the original aspect ratio if needed. */
  Scale = "SCALE",
  /** Crops a part of the original image to fit into the specified dimensions. */
  Crop = "CROP",
  /** Creates a thumbnail from the image. */
  Thumb = "THUMB"
}

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
  /**
   * The default catalogue for the market.  All users in the market are able to see
   * all courses in the default catalog from InTouch
   */
  doceboCatalogueId?: Maybe<Scalars["String"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /**
   * Whether the market supports Projects.  If so then the Project section is
   * available.  Tier 0 can then be configured to support Guarantees in non-Roopro
   * countries.  In Roofpro countries various Tier configurations become possible.
   */
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

export enum MarketContentOrder {
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  NewsItemHeadingAsc = "newsItemHeading_ASC",
  NewsItemHeadingDesc = "newsItemHeading_DESC",
  NewsItemUrlAsc = "newsItemUrl_ASC",
  NewsItemUrlDesc = "newsItemUrl_DESC",
  NewsItemCtaAsc = "newsItemCta_ASC",
  NewsItemCtaDesc = "newsItemCta_DESC",
  ExternalLinkLabelAsc = "externalLinkLabel_ASC",
  ExternalLinkLabelDesc = "externalLinkLabel_DESC",
  ExternalLinkUrlAsc = "externalLinkUrl_ASC",
  ExternalLinkUrlDesc = "externalLinkUrl_DESC",
  LiveAsc = "live_ASC",
  LiveDesc = "live_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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
  /**
   * The default catalogue for the market.  All users in the market are able to see
   * all courses in the default catalog from InTouch
   */
  doceboCatalogueId?: Maybe<Scalars["String"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /**
   * Whether the market supports Projects.  If so then the Project section is
   * available.  Tier 0 can then be configured to support Guarantees in non-Roopro
   * countries.  In Roofpro countries various Tier configurations become possible.
   */
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
  /**
   * The default catalogue for the market.  All users in the market are able to see
   * all courses in the default catalog from InTouch
   */
  doceboCatalogueId?: Maybe<Scalars["String"]>;
  /** The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address */
  merchandisingUrl?: Maybe<Scalars["String"]>;
  /**
   * Whether the market supports Projects.  If so then the Project section is
   * available.  Tier 0 can then be configured to support Guarantees in non-Roopro
   * countries.  In Roofpro countries various Tier configurations become possible.
   */
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

export enum MediaFolderOrder {
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum MediaToolOrder {
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  UrlAsc = "url_ASC",
  UrlDesc = "url_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum MessageTemplateOrder {
  EventAsc = "event_ASC",
  EventDesc = "event_DESC",
  SubjectAsc = "subject_ASC",
  SubjectDesc = "subject_DESC",
  NotificationBodyAsc = "notificationBody_ASC",
  NotificationBodyDesc = "notificationBody_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum MigrationOrder {
  ContentTypeIdAsc = "contentTypeId_ASC",
  ContentTypeIdDesc = "contentTypeId_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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
  /** Updates a single `Course` using its globally unique id and a patch. */
  updateCourseByNodeId?: Maybe<UpdateCoursePayload>;
  /** Updates a single `Course` using a unique key and a patch. */
  updateCourse?: Maybe<UpdateCoursePayload>;
  /** Updates a single `Course` using a unique key and a patch. */
  updateCourseByCourseId?: Maybe<UpdateCoursePayload>;
  /** Updates a single `CourseCatalogue` using its globally unique id and a patch. */
  updateCourseCatalogueByNodeId?: Maybe<UpdateCourseCataloguePayload>;
  /** Updates a single `CourseCatalogue` using a unique key and a patch. */
  updateCourseCatalogue?: Maybe<UpdateCourseCataloguePayload>;
  /** Updates a single `CourseCatalogue` using a unique key and a patch. */
  updateCourseCatalogueByCatalogueIdAndCourseId?: Maybe<UpdateCourseCataloguePayload>;
  /** Updates a single `CourseCatalogueTemp` using its globally unique id and a patch. */
  updateCourseCatalogueTempByNodeId?: Maybe<UpdateCourseCatalogueTempPayload>;
  /** Updates a single `CourseCatalogueTemp` using a unique key and a patch. */
  updateCourseCatalogueTemp?: Maybe<UpdateCourseCatalogueTempPayload>;
  /** Updates a single `CourseEnrollment` using its globally unique id and a patch. */
  updateCourseEnrollmentByNodeId?: Maybe<UpdateCourseEnrollmentPayload>;
  /** Updates a single `CourseEnrollment` using a unique key and a patch. */
  updateCourseEnrollment?: Maybe<UpdateCourseEnrollmentPayload>;
  /** Updates a single `CourseEnrollment` using a unique key and a patch. */
  updateCourseEnrollmentByUserIdAndCourseId?: Maybe<UpdateCourseEnrollmentPayload>;
  /** Updates a single `CourseEnrollmentTemp` using its globally unique id and a patch. */
  updateCourseEnrollmentTempByNodeId?: Maybe<UpdateCourseEnrollmentTempPayload>;
  /** Updates a single `CourseEnrollmentTemp` using a unique key and a patch. */
  updateCourseEnrollmentTemp?: Maybe<UpdateCourseEnrollmentTempPayload>;
  /** Updates a single `CourseSyncConfiguration` using its globally unique id and a patch. */
  updateCourseSyncConfigurationByNodeId?: Maybe<UpdateCourseSyncConfigurationPayload>;
  /** Updates a single `CourseSyncConfiguration` using a unique key and a patch. */
  updateCourseSyncConfiguration?: Maybe<UpdateCourseSyncConfigurationPayload>;
  /** Updates a single `CourseTemp` using its globally unique id and a patch. */
  updateCourseTempByNodeId?: Maybe<UpdateCourseTempPayload>;
  /** Updates a single `CourseTemp` using a unique key and a patch. */
  updateCourseTemp?: Maybe<UpdateCourseTempPayload>;
  /** Deletes a single `Course` using its globally unique id. */
  deleteCourseByNodeId?: Maybe<DeleteCoursePayload>;
  /** Deletes a single `Course` using a unique key. */
  deleteCourse?: Maybe<DeleteCoursePayload>;
  /** Deletes a single `Course` using a unique key. */
  deleteCourseByCourseId?: Maybe<DeleteCoursePayload>;
  /** Deletes a single `CourseCatalogue` using its globally unique id. */
  deleteCourseCatalogueByNodeId?: Maybe<DeleteCourseCataloguePayload>;
  /** Deletes a single `CourseCatalogue` using a unique key. */
  deleteCourseCatalogue?: Maybe<DeleteCourseCataloguePayload>;
  /** Deletes a single `CourseCatalogue` using a unique key. */
  deleteCourseCatalogueByCatalogueIdAndCourseId?: Maybe<DeleteCourseCataloguePayload>;
  /** Deletes a single `CourseCatalogueTemp` using its globally unique id. */
  deleteCourseCatalogueTempByNodeId?: Maybe<DeleteCourseCatalogueTempPayload>;
  /** Deletes a single `CourseCatalogueTemp` using a unique key. */
  deleteCourseCatalogueTemp?: Maybe<DeleteCourseCatalogueTempPayload>;
  /** Deletes a single `CourseEnrollment` using its globally unique id. */
  deleteCourseEnrollmentByNodeId?: Maybe<DeleteCourseEnrollmentPayload>;
  /** Deletes a single `CourseEnrollment` using a unique key. */
  deleteCourseEnrollment?: Maybe<DeleteCourseEnrollmentPayload>;
  /** Deletes a single `CourseEnrollment` using a unique key. */
  deleteCourseEnrollmentByUserIdAndCourseId?: Maybe<DeleteCourseEnrollmentPayload>;
  /** Deletes a single `CourseEnrollmentTemp` using its globally unique id. */
  deleteCourseEnrollmentTempByNodeId?: Maybe<DeleteCourseEnrollmentTempPayload>;
  /** Deletes a single `CourseEnrollmentTemp` using a unique key. */
  deleteCourseEnrollmentTemp?: Maybe<DeleteCourseEnrollmentTempPayload>;
  /** Deletes a single `CourseSyncConfiguration` using its globally unique id. */
  deleteCourseSyncConfigurationByNodeId?: Maybe<DeleteCourseSyncConfigurationPayload>;
  /** Deletes a single `CourseSyncConfiguration` using a unique key. */
  deleteCourseSyncConfiguration?: Maybe<DeleteCourseSyncConfigurationPayload>;
  /** Deletes a single `CourseTemp` using its globally unique id. */
  deleteCourseTempByNodeId?: Maybe<DeleteCourseTempPayload>;
  /** Deletes a single `CourseTemp` using a unique key. */
  deleteCourseTemp?: Maybe<DeleteCourseTempPayload>;
  courseCatalogueUpdateByTemp?: Maybe<CourseCatalogueUpdateByTempPayload>;
  courseEnrollmentUpdateByTemp?: Maybe<CourseEnrollmentUpdateByTempPayload>;
  courseUpdateByTemp?: Maybe<CourseUpdateByTempPayload>;
  createSSOUrl?: Maybe<SsoUrlOutput>;
};

export type MutationCreateAddressArgs = {
  input: CreateAddressInput;
};

export type MutationCreateCertificationArgs = {
  input: CreateCertificationInput;
};

export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};

export type MutationCreateCompanyDocumentArgs = {
  input: CreateCompanyDocumentInput;
};

export type MutationCreateCompanyMemberArgs = {
  input: CreateCompanyMemberInput;
};

export type MutationCreateCompanyOperationArgs = {
  input: CreateCompanyOperationInput;
};

export type MutationCreateEvidenceItemArgs = {
  input: CreateEvidenceItemInput;
};

export type MutationCreateGuaranteeArgs = {
  input: CreateGuaranteeInput;
};

export type MutationCreateGuaranteedProductArgs = {
  input: CreateGuaranteedProductInput;
};

export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
};

export type MutationCreateMarketArgs = {
  input: CreateMarketInput;
};

export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};

export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};

export type MutationCreateProductArgs = {
  input: CreateProductInput;
};

export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};

export type MutationCreateProjectMemberArgs = {
  input: CreateProjectMemberInput;
};

export type MutationCreateSystemArgs = {
  input: CreateSystemInput;
};

export type MutationCreateSystemMemberArgs = {
  input: CreateSystemMemberInput;
};

export type MutationUpdateAccountByNodeIdArgs = {
  input: UpdateAccountByNodeIdInput;
};

export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};

export type MutationUpdateAccountByDoceboUserIdArgs = {
  input: UpdateAccountByDoceboUserIdInput;
};

export type MutationUpdateAddressByNodeIdArgs = {
  input: UpdateAddressByNodeIdInput;
};

export type MutationUpdateAddressArgs = {
  input: UpdateAddressInput;
};

export type MutationUpdateCertificationByNodeIdArgs = {
  input: UpdateCertificationByNodeIdInput;
};

export type MutationUpdateCertificationArgs = {
  input: UpdateCertificationInput;
};

export type MutationUpdateCompanyByNodeIdArgs = {
  input: UpdateCompanyByNodeIdInput;
};

export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};

export type MutationUpdateCompanyDocumentByNodeIdArgs = {
  input: UpdateCompanyDocumentByNodeIdInput;
};

export type MutationUpdateCompanyDocumentArgs = {
  input: UpdateCompanyDocumentInput;
};

export type MutationUpdateCompanyMemberByNodeIdArgs = {
  input: UpdateCompanyMemberByNodeIdInput;
};

export type MutationUpdateCompanyMemberArgs = {
  input: UpdateCompanyMemberInput;
};

export type MutationUpdateCompanyOperationByNodeIdArgs = {
  input: UpdateCompanyOperationByNodeIdInput;
};

export type MutationUpdateCompanyOperationArgs = {
  input: UpdateCompanyOperationInput;
};

export type MutationUpdateEvidenceItemByNodeIdArgs = {
  input: UpdateEvidenceItemByNodeIdInput;
};

export type MutationUpdateEvidenceItemArgs = {
  input: UpdateEvidenceItemInput;
};

export type MutationUpdateGuaranteeByNodeIdArgs = {
  input: UpdateGuaranteeByNodeIdInput;
};

export type MutationUpdateGuaranteeArgs = {
  input: UpdateGuaranteeInput;
};

export type MutationUpdateGuaranteedProductByNodeIdArgs = {
  input: UpdateGuaranteedProductByNodeIdInput;
};

export type MutationUpdateGuaranteedProductArgs = {
  input: UpdateGuaranteedProductInput;
};

export type MutationUpdateInvitationByNodeIdArgs = {
  input: UpdateInvitationByNodeIdInput;
};

export type MutationUpdateInvitationArgs = {
  input: UpdateInvitationInput;
};

export type MutationUpdateMarketByNodeIdArgs = {
  input: UpdateMarketByNodeIdInput;
};

export type MutationUpdateMarketArgs = {
  input: UpdateMarketInput;
};

export type MutationUpdateNoteByNodeIdArgs = {
  input: UpdateNoteByNodeIdInput;
};

export type MutationUpdateNoteArgs = {
  input: UpdateNoteInput;
};

export type MutationUpdateNotificationByNodeIdArgs = {
  input: UpdateNotificationByNodeIdInput;
};

export type MutationUpdateNotificationArgs = {
  input: UpdateNotificationInput;
};

export type MutationUpdateProductByNodeIdArgs = {
  input: UpdateProductByNodeIdInput;
};

export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};

export type MutationUpdateProjectByNodeIdArgs = {
  input: UpdateProjectByNodeIdInput;
};

export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};

export type MutationUpdateProjectMemberByNodeIdArgs = {
  input: UpdateProjectMemberByNodeIdInput;
};

export type MutationUpdateProjectMemberArgs = {
  input: UpdateProjectMemberInput;
};

export type MutationUpdateSystemByNodeIdArgs = {
  input: UpdateSystemByNodeIdInput;
};

export type MutationUpdateSystemArgs = {
  input: UpdateSystemInput;
};

export type MutationUpdateSystemMemberByNodeIdArgs = {
  input: UpdateSystemMemberByNodeIdInput;
};

export type MutationUpdateSystemMemberArgs = {
  input: UpdateSystemMemberInput;
};

export type MutationDeleteAccountByNodeIdArgs = {
  input: DeleteAccountByNodeIdInput;
};

export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};

export type MutationDeleteAccountByDoceboUserIdArgs = {
  input: DeleteAccountByDoceboUserIdInput;
};

export type MutationDeleteAddressByNodeIdArgs = {
  input: DeleteAddressByNodeIdInput;
};

export type MutationDeleteAddressArgs = {
  input: DeleteAddressInput;
};

export type MutationDeleteCertificationByNodeIdArgs = {
  input: DeleteCertificationByNodeIdInput;
};

export type MutationDeleteCertificationArgs = {
  input: DeleteCertificationInput;
};

export type MutationDeleteCompanyByNodeIdArgs = {
  input: DeleteCompanyByNodeIdInput;
};

export type MutationDeleteCompanyArgs = {
  input: DeleteCompanyInput;
};

export type MutationDeleteCompanyDocumentByNodeIdArgs = {
  input: DeleteCompanyDocumentByNodeIdInput;
};

export type MutationDeleteCompanyDocumentArgs = {
  input: DeleteCompanyDocumentInput;
};

export type MutationDeleteCompanyMemberByNodeIdArgs = {
  input: DeleteCompanyMemberByNodeIdInput;
};

export type MutationDeleteCompanyMemberArgs = {
  input: DeleteCompanyMemberInput;
};

export type MutationDeleteCompanyOperationByNodeIdArgs = {
  input: DeleteCompanyOperationByNodeIdInput;
};

export type MutationDeleteCompanyOperationArgs = {
  input: DeleteCompanyOperationInput;
};

export type MutationDeleteEvidenceItemByNodeIdArgs = {
  input: DeleteEvidenceItemByNodeIdInput;
};

export type MutationDeleteEvidenceItemArgs = {
  input: DeleteEvidenceItemInput;
};

export type MutationDeleteGuaranteeByNodeIdArgs = {
  input: DeleteGuaranteeByNodeIdInput;
};

export type MutationDeleteGuaranteeArgs = {
  input: DeleteGuaranteeInput;
};

export type MutationDeleteGuaranteedProductByNodeIdArgs = {
  input: DeleteGuaranteedProductByNodeIdInput;
};

export type MutationDeleteGuaranteedProductArgs = {
  input: DeleteGuaranteedProductInput;
};

export type MutationDeleteInvitationByNodeIdArgs = {
  input: DeleteInvitationByNodeIdInput;
};

export type MutationDeleteInvitationArgs = {
  input: DeleteInvitationInput;
};

export type MutationDeleteMarketByNodeIdArgs = {
  input: DeleteMarketByNodeIdInput;
};

export type MutationDeleteMarketArgs = {
  input: DeleteMarketInput;
};

export type MutationDeleteNoteByNodeIdArgs = {
  input: DeleteNoteByNodeIdInput;
};

export type MutationDeleteNoteArgs = {
  input: DeleteNoteInput;
};

export type MutationDeleteNotificationByNodeIdArgs = {
  input: DeleteNotificationByNodeIdInput;
};

export type MutationDeleteNotificationArgs = {
  input: DeleteNotificationInput;
};

export type MutationDeleteProductByNodeIdArgs = {
  input: DeleteProductByNodeIdInput;
};

export type MutationDeleteProductArgs = {
  input: DeleteProductInput;
};

export type MutationDeleteProjectByNodeIdArgs = {
  input: DeleteProjectByNodeIdInput;
};

export type MutationDeleteProjectArgs = {
  input: DeleteProjectInput;
};

export type MutationDeleteProjectMemberByNodeIdArgs = {
  input: DeleteProjectMemberByNodeIdInput;
};

export type MutationDeleteProjectMemberArgs = {
  input: DeleteProjectMemberInput;
};

export type MutationDeleteSystemByNodeIdArgs = {
  input: DeleteSystemByNodeIdInput;
};

export type MutationDeleteSystemArgs = {
  input: DeleteSystemInput;
};

export type MutationDeleteSystemMemberByNodeIdArgs = {
  input: DeleteSystemMemberByNodeIdInput;
};

export type MutationDeleteSystemMemberArgs = {
  input: DeleteSystemMemberInput;
};

export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};

export type MutationPublishMessageArgs = {
  input: PublishInput;
};

export type MutationCreateGuaranteePdfArgs = {
  id: Scalars["Int"];
};

export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};

export type MutationCreateCourseCatalogueArgs = {
  input: CreateCourseCatalogueInput;
};

export type MutationCreateCourseCatalogueTempArgs = {
  input: CreateCourseCatalogueTempInput;
};

export type MutationCreateCourseEnrollmentArgs = {
  input: CreateCourseEnrollmentInput;
};

export type MutationCreateCourseEnrollmentTempArgs = {
  input: CreateCourseEnrollmentTempInput;
};

export type MutationCreateCourseSyncConfigurationArgs = {
  input: CreateCourseSyncConfigurationInput;
};

export type MutationCreateCourseTempArgs = {
  input: CreateCourseTempInput;
};

export type MutationUpdateCourseByNodeIdArgs = {
  input: UpdateCourseByNodeIdInput;
};

export type MutationUpdateCourseArgs = {
  input: UpdateCourseInput;
};

export type MutationUpdateCourseByCourseIdArgs = {
  input: UpdateCourseByCourseIdInput;
};

export type MutationUpdateCourseCatalogueByNodeIdArgs = {
  input: UpdateCourseCatalogueByNodeIdInput;
};

export type MutationUpdateCourseCatalogueArgs = {
  input: UpdateCourseCatalogueInput;
};

export type MutationUpdateCourseCatalogueByCatalogueIdAndCourseIdArgs = {
  input: UpdateCourseCatalogueByCatalogueIdAndCourseIdInput;
};

export type MutationUpdateCourseCatalogueTempByNodeIdArgs = {
  input: UpdateCourseCatalogueTempByNodeIdInput;
};

export type MutationUpdateCourseCatalogueTempArgs = {
  input: UpdateCourseCatalogueTempInput;
};

export type MutationUpdateCourseEnrollmentByNodeIdArgs = {
  input: UpdateCourseEnrollmentByNodeIdInput;
};

export type MutationUpdateCourseEnrollmentArgs = {
  input: UpdateCourseEnrollmentInput;
};

export type MutationUpdateCourseEnrollmentByUserIdAndCourseIdArgs = {
  input: UpdateCourseEnrollmentByUserIdAndCourseIdInput;
};

export type MutationUpdateCourseEnrollmentTempByNodeIdArgs = {
  input: UpdateCourseEnrollmentTempByNodeIdInput;
};

export type MutationUpdateCourseEnrollmentTempArgs = {
  input: UpdateCourseEnrollmentTempInput;
};

export type MutationUpdateCourseSyncConfigurationByNodeIdArgs = {
  input: UpdateCourseSyncConfigurationByNodeIdInput;
};

export type MutationUpdateCourseSyncConfigurationArgs = {
  input: UpdateCourseSyncConfigurationInput;
};

export type MutationUpdateCourseTempByNodeIdArgs = {
  input: UpdateCourseTempByNodeIdInput;
};

export type MutationUpdateCourseTempArgs = {
  input: UpdateCourseTempInput;
};

export type MutationDeleteCourseByNodeIdArgs = {
  input: DeleteCourseByNodeIdInput;
};

export type MutationDeleteCourseArgs = {
  input: DeleteCourseInput;
};

export type MutationDeleteCourseByCourseIdArgs = {
  input: DeleteCourseByCourseIdInput;
};

export type MutationDeleteCourseCatalogueByNodeIdArgs = {
  input: DeleteCourseCatalogueByNodeIdInput;
};

export type MutationDeleteCourseCatalogueArgs = {
  input: DeleteCourseCatalogueInput;
};

export type MutationDeleteCourseCatalogueByCatalogueIdAndCourseIdArgs = {
  input: DeleteCourseCatalogueByCatalogueIdAndCourseIdInput;
};

export type MutationDeleteCourseCatalogueTempByNodeIdArgs = {
  input: DeleteCourseCatalogueTempByNodeIdInput;
};

export type MutationDeleteCourseCatalogueTempArgs = {
  input: DeleteCourseCatalogueTempInput;
};

export type MutationDeleteCourseEnrollmentByNodeIdArgs = {
  input: DeleteCourseEnrollmentByNodeIdInput;
};

export type MutationDeleteCourseEnrollmentArgs = {
  input: DeleteCourseEnrollmentInput;
};

export type MutationDeleteCourseEnrollmentByUserIdAndCourseIdArgs = {
  input: DeleteCourseEnrollmentByUserIdAndCourseIdInput;
};

export type MutationDeleteCourseEnrollmentTempByNodeIdArgs = {
  input: DeleteCourseEnrollmentTempByNodeIdInput;
};

export type MutationDeleteCourseEnrollmentTempArgs = {
  input: DeleteCourseEnrollmentTempInput;
};

export type MutationDeleteCourseSyncConfigurationByNodeIdArgs = {
  input: DeleteCourseSyncConfigurationByNodeIdInput;
};

export type MutationDeleteCourseSyncConfigurationArgs = {
  input: DeleteCourseSyncConfigurationInput;
};

export type MutationDeleteCourseTempByNodeIdArgs = {
  input: DeleteCourseTempByNodeIdInput;
};

export type MutationDeleteCourseTempArgs = {
  input: DeleteCourseTempInput;
};

export type MutationCourseCatalogueUpdateByTempArgs = {
  input: CourseCatalogueUpdateByTempInput;
};

export type MutationCourseEnrollmentUpdateByTempArgs = {
  input: CourseEnrollmentUpdateByTempInput;
};

export type MutationCourseUpdateByTempArgs = {
  input: CourseUpdateByTempInput;
};

export type MutationCreateSsoUrlArgs = {
  username: Scalars["String"];
  path?: Maybe<Scalars["String"]>;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
};

/**
 * Usually a note added by someone at BMI who has been asked to approve a
 * Guarantee.  It is likely to be either a short note of approval, saying something
 * like, Approved, or Good Job, or a note of rejection, saying  something like, The
 * photographs of the roof are not clear enough.
 */
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

export enum PartnerBrandOrder {
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  WebsiteUrlAsc = "websiteUrl_ASC",
  WebsiteUrlDesc = "websiteUrl_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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
  /**
   * Email address of the person who owns the building that the roof is going on.
   * Not mandatory for a Project, but mandatory when the Company applies for a
   * Guarantee related to the project.
   */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owners Company if they have one */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project starts */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project expects to end.   */
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
  /**
   * Email address of the person who owns the building that the roof is going on.
   * Not mandatory for a Project, but mandatory when the Company applies for a
   * Guarantee related to the project.
   */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owners Company if they have one */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project starts */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project expects to end.   */
  endDate?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/**
 * A connection between a User and a Project. A connection between a user and a
 * company. This relationship could be simplified as one to many at the moment, but
 * there is already demand for a many to many relationship.
 */
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
  /**
   * Email address of the person who owns the building that the roof is going on.
   * Not mandatory for a Project, but mandatory when the Company applies for a
   * Guarantee related to the project.
   */
  buildingOwnerMail?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerFirstname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued. */
  buildingOwnerLastname?: Maybe<Scalars["String"]>;
  /** Name of the Building Owners Company if they have one */
  buildingOwnerCompany?: Maybe<Scalars["String"]>;
  /** The date that the Project starts */
  startDate?: Maybe<Scalars["Datetime"]>;
  /** The date that the Project expects to end.   */
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

export type Query = {
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
  /** Reads and enables pagination through a set of `Course`. */
  courses?: Maybe<CoursesConnection>;
  /** Reads and enables pagination through a set of `CourseCatalogue`. */
  courseCatalogues?: Maybe<CourseCataloguesConnection>;
  /** Reads and enables pagination through a set of `CourseCatalogueTemp`. */
  courseCatalogueTemps?: Maybe<CourseCatalogueTempsConnection>;
  /** Reads and enables pagination through a set of `CourseEnrollment`. */
  courseEnrollments?: Maybe<CourseEnrollmentsConnection>;
  /** Reads and enables pagination through a set of `CourseEnrollmentTemp`. */
  courseEnrollmentTemps?: Maybe<CourseEnrollmentTempsConnection>;
  /** Reads and enables pagination through a set of `CourseSyncConfiguration`. */
  courseSyncConfigurations?: Maybe<CourseSyncConfigurationsConnection>;
  /** Reads and enables pagination through a set of `CourseTemp`. */
  courseTemps?: Maybe<CourseTempsConnection>;
  course?: Maybe<Course>;
  courseByCourseId?: Maybe<Course>;
  courseCatalogue?: Maybe<CourseCatalogue>;
  courseCatalogueByCatalogueIdAndCourseId?: Maybe<CourseCatalogue>;
  courseCatalogueTemp?: Maybe<CourseCatalogueTemp>;
  courseEnrollment?: Maybe<CourseEnrollment>;
  courseEnrollmentByUserIdAndCourseId?: Maybe<CourseEnrollment>;
  courseEnrollmentTemp?: Maybe<CourseEnrollmentTemp>;
  courseSyncConfiguration?: Maybe<CourseSyncConfiguration>;
  courseTemp?: Maybe<CourseTemp>;
  /** Reads a single `Course` using its globally unique `ID`. */
  courseByNodeId?: Maybe<Course>;
  /** Reads a single `CourseCatalogue` using its globally unique `ID`. */
  courseCatalogueByNodeId?: Maybe<CourseCatalogue>;
  /** Reads a single `CourseCatalogueTemp` using its globally unique `ID`. */
  courseCatalogueTempByNodeId?: Maybe<CourseCatalogueTemp>;
  /** Reads a single `CourseEnrollment` using its globally unique `ID`. */
  courseEnrollmentByNodeId?: Maybe<CourseEnrollment>;
  /** Reads a single `CourseEnrollmentTemp` using its globally unique `ID`. */
  courseEnrollmentTempByNodeId?: Maybe<CourseEnrollmentTemp>;
  /** Reads a single `CourseSyncConfiguration` using its globally unique `ID`. */
  courseSyncConfigurationByNodeId?: Maybe<CourseSyncConfiguration>;
  /** Reads a single `CourseTemp` using its globally unique `ID`. */
  courseTempByNodeId?: Maybe<CourseTemp>;
  token?: Maybe<Token>;
  tokenByUsername?: Maybe<Token>;
  asset?: Maybe<Asset>;
  assetCollection?: Maybe<AssetCollection>;
  guaranteeTemplate?: Maybe<GuaranteeTemplate>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
  messageTemplate?: Maybe<MessageTemplate>;
  messageTemplateCollection?: Maybe<MessageTemplateCollection>;
  evidenceCategory?: Maybe<EvidenceCategory>;
  evidenceCategoryCollection?: Maybe<EvidenceCategoryCollection>;
  marketContent?: Maybe<MarketContent>;
  marketContentCollection?: Maybe<MarketContentCollection>;
  carouselItem?: Maybe<CarouselItem>;
  carouselItemCollection?: Maybe<CarouselItemCollection>;
  guaranteeType?: Maybe<GuaranteeType>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
  tierBenefit?: Maybe<TierBenefit>;
  tierBenefitCollection?: Maybe<TierBenefitCollection>;
  trainingContent?: Maybe<TrainingContent>;
  trainingContentCollection?: Maybe<TrainingContentCollection>;
  carousel?: Maybe<Carousel>;
  carouselCollection?: Maybe<CarouselCollection>;
  partnerBrand?: Maybe<PartnerBrand>;
  partnerBrandCollection?: Maybe<PartnerBrandCollection>;
  contactDetails?: Maybe<ContactDetails>;
  contactDetailsCollection?: Maybe<ContactDetailsCollection>;
  mediaTool?: Maybe<MediaTool>;
  mediaToolCollection?: Maybe<MediaToolCollection>;
  mediaFolder?: Maybe<MediaFolder>;
  mediaFolderCollection?: Maybe<MediaFolderCollection>;
  contentArticle?: Maybe<ContentArticle>;
  contentArticleCollection?: Maybe<ContentArticleCollection>;
  migration?: Maybe<Migration>;
  migrationCollection?: Maybe<MigrationCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type QueryNodeArgs = {
  nodeId: Scalars["ID"];
};

export type QueryAccountsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AccountsOrderBy>>;
  condition?: Maybe<AccountCondition>;
};

export type QueryAddressesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AddressesOrderBy>>;
  condition?: Maybe<AddressCondition>;
};

export type QueryCertificationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CertificationsOrderBy>>;
  condition?: Maybe<CertificationCondition>;
};

export type QueryCompaniesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
  condition?: Maybe<CompanyCondition>;
};

export type QueryCompanyDocumentsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyDocumentsOrderBy>>;
  condition?: Maybe<CompanyDocumentCondition>;
};

export type QueryCompanyMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyMembersOrderBy>>;
  condition?: Maybe<CompanyMemberCondition>;
};

export type QueryCompanyOperationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanyOperationsOrderBy>>;
  condition?: Maybe<CompanyOperationCondition>;
};

export type QueryEvidenceItemsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<EvidenceItemsOrderBy>>;
  condition?: Maybe<EvidenceItemCondition>;
};

export type QueryGuaranteesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteesOrderBy>>;
  condition?: Maybe<GuaranteeCondition>;
};

export type QueryGuaranteedProductsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteedProductsOrderBy>>;
  condition?: Maybe<GuaranteedProductCondition>;
};

export type QueryInvitationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
  condition?: Maybe<InvitationCondition>;
};

export type QueryMarketsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<MarketsOrderBy>>;
  condition?: Maybe<MarketCondition>;
};

export type QueryNotesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotesOrderBy>>;
  condition?: Maybe<NoteCondition>;
};

export type QueryNotificationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
};

export type QueryProductsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProductsOrderBy>>;
  condition?: Maybe<ProductCondition>;
};

export type QueryProjectsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
  condition?: Maybe<ProjectCondition>;
};

export type QueryProjectMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectMembersOrderBy>>;
  condition?: Maybe<ProjectMemberCondition>;
};

export type QuerySystemsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<SystemsOrderBy>>;
  condition?: Maybe<SystemCondition>;
};

export type QuerySystemMembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<SystemMembersOrderBy>>;
  condition?: Maybe<SystemMemberCondition>;
};

export type QueryAccountArgs = {
  id: Scalars["Int"];
};

export type QueryAccountByDoceboUserIdArgs = {
  doceboUserId: Scalars["Int"];
};

export type QueryAddressArgs = {
  id: Scalars["Int"];
};

export type QueryCertificationArgs = {
  id: Scalars["Int"];
};

export type QueryCompanyArgs = {
  id: Scalars["Int"];
};

export type QueryCompanyDocumentArgs = {
  id: Scalars["Int"];
};

export type QueryCompanyMemberArgs = {
  id: Scalars["Int"];
};

export type QueryCompanyOperationArgs = {
  id: Scalars["Int"];
};

export type QueryEvidenceItemArgs = {
  id: Scalars["Int"];
};

export type QueryGuaranteeArgs = {
  id: Scalars["Int"];
};

export type QueryGuaranteedProductArgs = {
  id: Scalars["Int"];
};

export type QueryInvitationArgs = {
  id: Scalars["Int"];
};

export type QueryMarketArgs = {
  id: Scalars["Int"];
};

export type QueryNoteArgs = {
  id: Scalars["Int"];
};

export type QueryNotificationArgs = {
  id: Scalars["Int"];
};

export type QueryProductArgs = {
  id: Scalars["Int"];
};

export type QueryProjectArgs = {
  id: Scalars["Int"];
};

export type QueryProjectMemberArgs = {
  id: Scalars["Int"];
};

export type QuerySystemArgs = {
  id: Scalars["Int"];
};

export type QuerySystemMemberArgs = {
  id: Scalars["Int"];
};

export type QueryIsPartOfProjectArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
};

export type QueryAccountByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryAddressByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCertificationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanyByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanyDocumentByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanyMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanyOperationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryEvidenceItemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryGuaranteeByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryGuaranteedProductByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryInvitationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryMarketByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryNoteByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryNotificationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryProductByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryProjectByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryProjectMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QuerySystemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QuerySystemMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCoursesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CoursesOrderBy>>;
  condition?: Maybe<CourseCondition>;
};

export type QueryCourseCataloguesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseCataloguesOrderBy>>;
  condition?: Maybe<CourseCatalogueCondition>;
};

export type QueryCourseCatalogueTempsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseCatalogueTempsOrderBy>>;
  condition?: Maybe<CourseCatalogueTempCondition>;
};

export type QueryCourseEnrollmentsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseEnrollmentsOrderBy>>;
  condition?: Maybe<CourseEnrollmentCondition>;
};

export type QueryCourseEnrollmentTempsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseEnrollmentTempsOrderBy>>;
  condition?: Maybe<CourseEnrollmentTempCondition>;
};

export type QueryCourseSyncConfigurationsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseSyncConfigurationsOrderBy>>;
  condition?: Maybe<CourseSyncConfigurationCondition>;
};

export type QueryCourseTempsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CourseTempsOrderBy>>;
  condition?: Maybe<CourseTempCondition>;
};

export type QueryCourseArgs = {
  id: Scalars["Int"];
};

export type QueryCourseByCourseIdArgs = {
  courseId: Scalars["Int"];
};

export type QueryCourseCatalogueArgs = {
  id: Scalars["Int"];
};

export type QueryCourseCatalogueByCatalogueIdAndCourseIdArgs = {
  catalogueId: Scalars["Int"];
  courseId: Scalars["Int"];
};

export type QueryCourseCatalogueTempArgs = {
  id: Scalars["Int"];
};

export type QueryCourseEnrollmentArgs = {
  id: Scalars["Int"];
};

export type QueryCourseEnrollmentByUserIdAndCourseIdArgs = {
  userId: Scalars["Int"];
  courseId: Scalars["Int"];
};

export type QueryCourseEnrollmentTempArgs = {
  id: Scalars["Int"];
};

export type QueryCourseSyncConfigurationArgs = {
  id: Scalars["Int"];
};

export type QueryCourseTempArgs = {
  id: Scalars["Int"];
};

export type QueryCourseByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCourseCatalogueByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCourseCatalogueTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCourseEnrollmentByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCourseEnrollmentTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCourseSyncConfigurationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCourseTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryTokenByUsernameArgs = {
  username: Scalars["String"];
};

export type QueryAssetArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryAssetCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<AssetFilter>;
  order?: Maybe<Array<Maybe<AssetOrder>>>;
};

export type QueryGuaranteeTemplateArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryGuaranteeTemplateCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<GuaranteeTemplateFilter>;
  order?: Maybe<Array<Maybe<GuaranteeTemplateOrder>>>;
};

export type QueryMessageTemplateArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryMessageTemplateCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MessageTemplateFilter>;
  order?: Maybe<Array<Maybe<MessageTemplateOrder>>>;
};

export type QueryEvidenceCategoryArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryEvidenceCategoryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<EvidenceCategoryFilter>;
  order?: Maybe<Array<Maybe<EvidenceCategoryOrder>>>;
};

export type QueryMarketContentArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryMarketContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MarketContentFilter>;
  order?: Maybe<Array<Maybe<MarketContentOrder>>>;
};

export type QueryCarouselItemArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryCarouselItemCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<CarouselItemFilter>;
  order?: Maybe<Array<Maybe<CarouselItemOrder>>>;
};

export type QueryGuaranteeTypeArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryGuaranteeTypeCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<GuaranteeTypeFilter>;
  order?: Maybe<Array<Maybe<GuaranteeTypeOrder>>>;
};

export type QueryTierBenefitArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryTierBenefitCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<TierBenefitFilter>;
  order?: Maybe<Array<Maybe<TierBenefitOrder>>>;
};

export type QueryTrainingContentArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryTrainingContentCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<TrainingContentFilter>;
  order?: Maybe<Array<Maybe<TrainingContentOrder>>>;
};

export type QueryCarouselArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryCarouselCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<CarouselFilter>;
  order?: Maybe<Array<Maybe<CarouselOrder>>>;
};

export type QueryPartnerBrandArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryPartnerBrandCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<PartnerBrandFilter>;
  order?: Maybe<Array<Maybe<PartnerBrandOrder>>>;
};

export type QueryContactDetailsArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryContactDetailsCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<ContactDetailsFilter>;
  order?: Maybe<Array<Maybe<ContactDetailsOrder>>>;
};

export type QueryMediaToolArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryMediaToolCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MediaToolFilter>;
  order?: Maybe<Array<Maybe<MediaToolOrder>>>;
};

export type QueryMediaFolderArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryMediaFolderCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MediaFolderFilter>;
  order?: Maybe<Array<Maybe<MediaFolderOrder>>>;
};

export type QueryContentArticleArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryContentArticleCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<ContentArticleFilter>;
  order?: Maybe<Array<Maybe<ContentArticleOrder>>>;
};

export type QueryMigrationArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryMigrationCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<MigrationFilter>;
  order?: Maybe<Array<Maybe<MigrationOrder>>>;
};

export type QueryEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<EntryFilter>;
  order?: Maybe<Array<Maybe<EntryOrder>>>;
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

export type SsoUrlOutput = {
  __typename?: "SSOUrlOutput";
  url?: Maybe<Scalars["String"]>;
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

export enum TierBenefitOrder {
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  TierAsc = "tier_ASC",
  TierDesc = "tier_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
}

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

export enum TrainingContentOrder {
  PageHeadingAsc = "pageHeading_ASC",
  PageHeadingDesc = "pageHeading_DESC",
  LmsCtaLabelAsc = "lmsCtaLabel_ASC",
  LmsCtaLabelDesc = "lmsCtaLabel_DESC",
  PageSubHeadingAsc = "pageSubHeading_ASC",
  PageSubHeadingDesc = "pageSubHeading_DESC",
  Step1HeadingAsc = "step1Heading_ASC",
  Step1HeadingDesc = "step1Heading_DESC",
  Step1SubHeadingAsc = "step1SubHeading_ASC",
  Step1SubHeadingDesc = "step1SubHeading_DESC",
  Step2HeadingAsc = "step2Heading_ASC",
  Step2HeadingDesc = "step2Heading_DESC",
  Step2SubHeadingAsc = "step2SubHeading_ASC",
  Step2SubHeadingDesc = "step2SubHeading_DESC",
  Step3HeadingAsc = "step3Heading_ASC",
  Step3HeadingDesc = "step3Heading_DESC",
  Step3SubHeadingAsc = "step3SubHeading_ASC",
  Step3SubHeadingDesc = "step3SubHeading_DESC",
  LiveAsc = "live_ASC",
  LiveDesc = "live_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC"
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
