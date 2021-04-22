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
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z,
   *     compliant with the 'date-time' format outlined in section 5.6 of
   *     the RFC 3339 profile of the ISO 8601 standard for representation
   *     of dates and times using the Gregorian calendar.
   */
  DateTime: any;
  /** The 'Dimension' type represents dimensions as whole numeric values between `1` and `4000`. */
  Dimension: any;
  /** The 'Quality' type represents quality as whole numeric values between `1` and `100`. */
  Quality: any;
  /** The 'HexColor' type represents color in `rgb:ffffff` string format. */
  HexColor: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

/** An InTouch account */
export type Account = Node & {
  __typename?: "Account";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  createdBy?: Maybe<Scalars["Int"]>;
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
  doceboId?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Account`. */
  accountByCreatedBy?: Maybe<Account>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** Reads and enables pagination through a set of `Account`. */
  accountsByCreatedBy: AccountsConnection;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMembersConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByRequestorAccountId: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByResponsibleInstallerAccountId: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guaranteesByReviewerAccountId: GuaranteesConnection;
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations: InvitationsConnection;
  /** Reads and enables pagination through a set of `Note`. */
  authoredNotes: NotesConnection;
  /** Reads and enables pagination through a set of `Notification`. */
  notifications: NotificationsConnection;
  /** Reads and enables pagination through a set of `ProjectMember`. */
  projectMembers: ProjectMembersConnection;
};

/** An InTouch account */
export type AccountAccountsByCreatedByArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<AccountsOrderBy>>;
  condition?: Maybe<AccountCondition>;
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
export type AccountInvitationsArgs = {
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
  /** Checks for equality with the object’s `createdBy` field. */
  createdBy?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<Scalars["String"]>;
};

/** An input for mutations affecting `Account` */
export type AccountInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  createdBy?: Maybe<Scalars["Int"]>;
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
  doceboId?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Account`. Fields that are set will be updated. */
export type AccountPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  createdBy?: Maybe<Scalars["Int"]>;
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
  doceboId?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. A profile picture of the user */
  photo?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

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
  CreatedByAsc = "CREATED_BY_ASC",
  CreatedByDesc = "CREATED_BY_DESC",
  MarketIdAsc = "MARKET_ID_ASC",
  MarketIdDesc = "MARKET_ID_DESC",
  EmailAsc = "EMAIL_ASC",
  EmailDesc = "EMAIL_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum AccountStatus {
  New = "NEW",
  Active = "ACTIVE",
  Suspended = "SUSPENDED"
}

export type ActiveLanguages = {
  __typename?: "ActiveLanguages";
  code?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  browsercode?: Maybe<Scalars["String"]>;
  is_rtl?: Maybe<Scalars["Boolean"]>;
  show_create_user_button?: Maybe<Scalars["Boolean"]>;
  authenticatorapp_pair_date?: Maybe<Scalars["String"]>;
  has_esignature_courses_to_sign?: Maybe<Scalars["Boolean"]>;
  is_impersonated?: Maybe<Scalars["Boolean"]>;
  branding_elements?: Maybe<BrandingElements>;
  oauth_clients?: Maybe<Array<Maybe<OauthClients>>>;
  pre_populated_fields?: Maybe<Array<Maybe<Scalars["String"]>>>;
  pu_manage_subscription_permission?: Maybe<
    Array<Maybe<PuManageSubscriptionPermission>>
  >;
  pu_manage_user_permissions?: Maybe<Array<Maybe<PuManageUserPermissions>>>;
};

export type AdditionalFields = {
  __typename?: "AdditionalFields";
  id?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  mandatory?: Maybe<Scalars["Boolean"]>;
  invisible_to_user?: Maybe<Scalars["Boolean"]>;
  settings?: Maybe<Scalars["String"]>;
  sequence?: Maybe<Scalars["Int"]>;
  enabled?: Maybe<Scalars["Boolean"]>;
};

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
  /** The country for this address */
  country?: Maybe<Scalars["String"]>;
  /** The postcode for this address */
  postcode?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads and enables pagination through a set of `Company`. */
  companiesByRegisteredAddressId: CompaniesConnection;
  /** Reads and enables pagination through a set of `Company`. */
  companiesByTradingAddressId: CompaniesConnection;
  /** Reads and enables pagination through a set of `Project`. */
  projectsByBuildingOwnerAddressId: ProjectsConnection;
  /** Reads and enables pagination through a set of `Project`. */
  projectsBySiteAddressId: ProjectsConnection;
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
export type AddressProjectsByBuildingOwnerAddressIdArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectsOrderBy>>;
  condition?: Maybe<ProjectCondition>;
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

/** A condition to be used against `Address` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AddressCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
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
export enum AddressesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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

export type AdminMenuItems = {
  __typename?: "AdminMenuItems";
  plugin_menu?: Maybe<PluginMenu>;
  main_menu?: Maybe<MainMenu>;
};

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
  carouselItemCollection?: Maybe<CarouselItemCollection>;
  guaranteeTypeCollection?: Maybe<GuaranteeTypeCollection>;
  trainingContentCollection?: Maybe<TrainingContentCollection>;
  partnerBrandCollection?: Maybe<PartnerBrandCollection>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
  mediaToolCollection?: Maybe<MediaToolCollection>;
};

export type AssetLinkingCollectionsEntryCollectionArgs = {
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

export type AssetLinkingCollectionsGuaranteeTemplateCollectionArgs = {
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

export type AvailableSeats = {
  __typename?: "AvailableSeats";
  allow_overbooking?: Maybe<Scalars["Int"]>;
  level?: Maybe<Scalars["Int"]>;
  can_enter?: Maybe<Scalars["Boolean"]>;
  affiliate_price?: Maybe<Scalars["String"]>;
  enrollment_policy?: Maybe<Scalars["Int"]>;
  max_attempts?: Maybe<Scalars["Int"]>;
  waiting_list?: Maybe<Scalars["Int"]>;
  has_esignature_enabled?: Maybe<Scalars["Boolean"]>;
  esignature_status?: Maybe<Scalars["String"]>;
  esignature_title?: Maybe<Scalars["String"]>;
  esignature_description?: Maybe<Scalars["String"]>;
  min_session_to_pass?: Maybe<Scalars["Int"]>;
  max_session_to_pass?: Maybe<Scalars["Int"]>;
  has_session_completion_rule?: Maybe<Scalars["Boolean"]>;
  ics_url?: Maybe<Scalars["String"]>;
  category?: Maybe<Array<Maybe<CourseCategory>>>;
  tree?: Maybe<Array<Maybe<Tree>>>;
  sessions?: Maybe<Array<Maybe<CourseSessions>>>;
  social_settings?: Maybe<SocialSettings>;
};

export type BackgroundImage = {
  __typename?: "BackgroundImage";
  url?: Maybe<Scalars["String"]>;
  aspect_ratio?: Maybe<Scalars["String"]>;
};

export type Branch = {
  __typename?: "Branch";
  id?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  lev?: Maybe<Scalars["String"]>;
  iLeft?: Maybe<Scalars["String"]>;
  iRight?: Maybe<Scalars["String"]>;
  parent_code?: Maybe<Scalars["String"]>;
  parent_id?: Maybe<Scalars["String"]>;
  selection_status?: Maybe<Scalars["Int"]>;
  selectable?: Maybe<Scalars["Int"]>;
  has_children?: Maybe<Scalars["Boolean"]>;
  can_manage?: Maybe<Scalars["Boolean"]>;
  icon?: Maybe<Scalars["String"]>;
  color?: Maybe<Scalars["String"]>;
  tooltip?: Maybe<Scalars["String"]>;
  actions?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type BranchData = {
  __typename?: "BranchData";
  count?: Maybe<Scalars["Int"]>;
  has_more_data?: Maybe<Scalars["Boolean"]>;
  cursor?: Maybe<Scalars["String"]>;
  current_page?: Maybe<Scalars["Int"]>;
  current_page_size?: Maybe<Scalars["Int"]>;
  total_page_count?: Maybe<Scalars["Int"]>;
  total_count?: Maybe<Scalars["Int"]>;
  items?: Maybe<Array<Maybe<Branch>>>;
};

export type Branches = {
  __typename?: "Branches";
  id?: Maybe<Scalars["Int"]>;
  iLeft?: Maybe<Scalars["Int"]>;
  iRight?: Maybe<Scalars["Int"]>;
};

export type BranchExtraData = {
  __typename?: "BranchExtraData";
  id?: Maybe<Scalars["Int"]>;
  code?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  id_parent?: Maybe<Scalars["Int"]>;
  title_parent?: Maybe<Scalars["String"]>;
  lev?: Maybe<Scalars["Int"]>;
  iLeft?: Maybe<Scalars["Int"]>;
  iRight?: Maybe<Scalars["Int"]>;
  is_root?: Maybe<Scalars["Boolean"]>;
  root_node_id?: Maybe<Scalars["Int"]>;
};

export type BranchType = {
  __typename?: "BranchType";
  extra_data?: Maybe<BranchExtraData>;
  data?: Maybe<BranchData>;
};

export type Branding = {
  __typename?: "Branding";
  header?: Maybe<Header>;
  footer?: Maybe<Footer>;
};

export type BrandingElements = {
  __typename?: "BrandingElements";
  white_label?: Maybe<WhiteLabel>;
  styles?: Maybe<Styles>;
  signin?: Maybe<Signin>;
  header?: Maybe<Header>;
  colors?: Maybe<Colors>;
};

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

/**
 * Content that appears in the main carousel.  Note that there are two other minor
 * carousels in InTouch, the Benefits Carousel and the Company Administrators
 * carousel (probably redundant).  This entity is for content you see in the big
 * one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem)
 */
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

/**
 * Content that appears in the main carousel.  Note that there are two other minor
 * carousels in InTouch, the Benefits Carousel and the Company Administrators
 * carousel (probably redundant).  This entity is for content you see in the big
 * one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem)
 */
export type CarouselItemLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/**
 * Content that appears in the main carousel.  Note that there are two other minor
 * carousels in InTouch, the Benefits Carousel and the Company Administrators
 * carousel (probably redundant).  This entity is for content you see in the big
 * one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem)
 */
export type CarouselItemHeaderArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/**
 * Content that appears in the main carousel.  Note that there are two other minor
 * carousels in InTouch, the Benefits Carousel and the Company Administrators
 * carousel (probably redundant).  This entity is for content you see in the big
 * one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem)
 */
export type CarouselItemImageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/**
 * Content that appears in the main carousel.  Note that there are two other minor
 * carousels in InTouch, the Benefits Carousel and the Company Administrators
 * carousel (probably redundant).  This entity is for content you see in the big
 * one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem)
 */
export type CarouselItemBodyArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/**
 * Content that appears in the main carousel.  Note that there are two other minor
 * carousels in InTouch, the Benefits Carousel and the Company Administrators
 * carousel (probably redundant).  This entity is for content you see in the big
 * one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem)
 */
export type CarouselItemCtaArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/**
 * Content that appears in the main carousel.  Note that there are two other minor
 * carousels in InTouch, the Benefits Carousel and the Company Administrators
 * carousel (probably redundant).  This entity is for content you see in the big
 * one which contains promotional messages that do not link anywhere. [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/carouselItem)
 */
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

export type CatalogSettings = {
  __typename?: "CatalogSettings";
  catalog_type?: Maybe<Scalars["String"]>;
  on_catalogue_empty?: Maybe<Scalars["Boolean"]>;
  catalog_external?: Maybe<Scalars["Boolean"]>;
  catalog_use_categories_tree?: Maybe<Scalars["Boolean"]>;
  show_course_details_dedicated_page?: Maybe<Scalars["Boolean"]>;
  catalog_external_selected_catalogs?: Maybe<Scalars["String"]>;
};

export type Catalogue = {
  __typename?: "Catalogue";
  catalogue_id?: Maybe<Scalars["Int"]>;
  catalogue_name?: Maybe<Scalars["String"]>;
  catalogue_description?: Maybe<Scalars["String"]>;
  catalogue_code?: Maybe<Scalars["String"]>;
  catalogue_sort_attr?: Maybe<Scalars["String"]>;
  catalogue_sort_dir?: Maybe<Scalars["String"]>;
  number_items?: Maybe<Scalars["Int"]>;
  items_count?: Maybe<Scalars["Int"]>;
  sub_items?: Maybe<Array<Maybe<CatalogueSubItem>>>;
};

export type CatalogueData = {
  __typename?: "CatalogueData";
  count?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["String"]>;
  has_more_data?: Maybe<Scalars["Boolean"]>;
  current_page?: Maybe<Scalars["Int"]>;
  current_page_size?: Maybe<Scalars["Int"]>;
  total_page_count?: Maybe<Scalars["Int"]>;
  total_count?: Maybe<Scalars["Int"]>;
  sort?: Maybe<Array<Maybe<Sort>>>;
  items?: Maybe<Array<Maybe<Catalogue>>>;
};

export type CatalogueSubItem = {
  __typename?: "CatalogueSubItem";
  item_id?: Maybe<Scalars["Int"]>;
  item_type?: Maybe<Scalars["String"]>;
  item_code?: Maybe<Scalars["String"]>;
  item_name?: Maybe<Scalars["String"]>;
  item_slug?: Maybe<Scalars["String"]>;
  item_description?: Maybe<Scalars["String"]>;
  item_category?: Maybe<Scalars["Int"]>;
  item_language?: Maybe<Scalars["String"]>;
  item_language_label?: Maybe<Scalars["String"]>;
  item_thumbnail?: Maybe<Scalars["String"]>;
  number_of_courses?: Maybe<Scalars["Int"]>;
  item_price?: Maybe<Scalars["Int"]>;
  item_rating_option?: Maybe<Scalars["String"]>;
  item_rating?: Maybe<Scalars["Int"]>;
  is_new?: Maybe<Scalars["Int"]>;
  item_visibility?: Maybe<Scalars["Int"]>;
  item_policy?: Maybe<Scalars["Int"]>;
  item_can_enroll?: Maybe<Scalars["Int"]>;
  is_opened?: Maybe<Scalars["Int"]>;
  access_status?: Maybe<Scalars["Int"]>;
  price_status?: Maybe<Scalars["Int"]>;
  shopify_product_meaningful_id?: Maybe<Scalars["String"]>;
  id_partner?: Maybe<Scalars["Int"]>;
  affiliate_price?: Maybe<Scalars["Int"]>;
  is_affiliate?: Maybe<Scalars["Boolean"]>;
  can_enter?: Maybe<Scalars["Boolean"]>;
  can_enter_reason?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
};

export type Category = {
  __typename?: "Category";
  id?: Maybe<Scalars["Int"]>;
  title?: Maybe<Scalars["String"]>;
  title_parent?: Maybe<Scalars["String"]>;
  has_child?: Maybe<Scalars["Int"]>;
  lev?: Maybe<Scalars["Int"]>;
  iLeft?: Maybe<Scalars["Int"]>;
  iRight?: Maybe<Scalars["Int"]>;
  icon?: Maybe<Scalars["String"]>;
};

export type CategoryData = {
  __typename?: "CategoryData";
  count?: Maybe<Scalars["Int"]>;
  has_more_data?: Maybe<Scalars["Boolean"]>;
  current_page?: Maybe<Scalars["Int"]>;
  current_page_size?: Maybe<Scalars["Int"]>;
  total_page_count?: Maybe<Scalars["Int"]>;
  total_count?: Maybe<Scalars["Int"]>;
  sort?: Maybe<Array<Maybe<Sort>>>;
  items?: Maybe<Array<Maybe<Category>>>;
};

export type CategoryExtraData = {
  __typename?: "CategoryExtraData";
  id?: Maybe<Scalars["Int"]>;
  title?: Maybe<Scalars["String"]>;
  title_parent?: Maybe<Scalars["String"]>;
  id_parent?: Maybe<Scalars["Int"]>;
  lev?: Maybe<Scalars["Int"]>;
  iLeft?: Maybe<Scalars["Int"]>;
  iRight?: Maybe<Scalars["Int"]>;
  is_root?: Maybe<Scalars["Boolean"]>;
  root_node_id?: Maybe<Scalars["Int"]>;
};

export type CategoryType = {
  __typename?: "CategoryType";
  extra_data?: Maybe<CategoryExtraData>;
  data?: Maybe<CategoryData>;
};

export type Certification = {
  __typename?: "Certification";
  id_cert?: Maybe<Scalars["Int"]>;
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  duration?: Maybe<Scalars["String"]>;
  allow_same_item?: Maybe<Scalars["Boolean"]>;
  duration_unit?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
};

export type CertificationData = {
  __typename?: "CertificationData";
  count?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["String"]>;
  has_more_data?: Maybe<Scalars["Boolean"]>;
  current_page?: Maybe<Scalars["Int"]>;
  current_page_size?: Maybe<Scalars["Int"]>;
  total_page_count?: Maybe<Scalars["Int"]>;
  total_count?: Maybe<Scalars["Int"]>;
  sort?: Maybe<Array<Maybe<Sort>>>;
  items?: Maybe<Array<Maybe<Certification>>>;
};

export type CertificationReport = {
  __typename?: "CertificationReport";
  user_idUser?: Maybe<Scalars["String"]>;
  user_userid?: Maybe<Scalars["String"]>;
  user_email?: Maybe<Scalars["String"]>;
  certification_title?: Maybe<Scalars["String"]>;
  certification_code?: Maybe<Scalars["String"]>;
  certification_description?: Maybe<Scalars["String"]>;
  certification_expiration?: Maybe<Scalars["String"]>;
  enrollment_issued_on?: Maybe<Scalars["String"]>;
  enrollment_to_renew_in?: Maybe<Scalars["String"]>;
  enrollment_activity_name?: Maybe<Scalars["String"]>;
  enrollment_activity_type?: Maybe<Scalars["String"]>;
};

export type CertificationReportData = {
  __typename?: "CertificationReportData";
  items?: Maybe<Array<Maybe<CertificationReport>>>;
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

export type Colors = {
  __typename?: "Colors";
  mainColor?: Maybe<Scalars["String"]>;
  actionColor?: Maybe<Scalars["String"]>;
  warningColor?: Maybe<Scalars["String"]>;
  errorColor?: Maybe<Scalars["String"]>;
  mainTextColor?: Maybe<Scalars["String"]>;
  secondaryColor?: Maybe<Scalars["String"]>;
  bordersColor?: Maybe<Scalars["String"]>;
  backgroundColor?: Maybe<Scalars["String"]>;
};

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
  RegisteredAddressIdAsc = "REGISTERED_ADDRESS_ID_ASC",
  RegisteredAddressIdDesc = "REGISTERED_ADDRESS_ID_DESC",
  TradingAddressIdAsc = "TRADING_ADDRESS_ID_ASC",
  TradingAddressIdDesc = "TRADING_ADDRESS_ID_DESC",
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
  /** fk */
  registeredAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  tradingAddressId?: Maybe<Scalars["Int"]>;
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
  lmsGroup?: Maybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: Maybe<Scalars["String"]>;
  /** The Tax number in that number, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** They Companys public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** The companys GoogleMap address */
  coordinates?: Maybe<Scalars["String"]>;
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
   * A 6 digit reference number generated for all Companies and visible to Roofpro
   * member Companies. (aka membership number).  Should be unique.
   */
  referenceNumber?: Maybe<Scalars["String"]>;
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
export type Companydocument = Node & {
  __typename?: "Companydocument";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  company?: Maybe<Scalars["Int"]>;
  /** The name of the document */
  name?: Maybe<Scalars["String"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
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
  /** The name of the document */
  name?: Maybe<Scalars["String"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Company` that is related to this `CompanyDocument`. */
  company?: Maybe<Company>;
};

/**
 * A condition to be used against `Companydocument` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanydocumentCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
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

/** An input for mutations affecting `Companydocument` */
export type CompanydocumentInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
  /** The name of the document */
  name?: Maybe<Scalars["String"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
};

/** An input for mutations affecting `CompanyDocument` */
export type CompanyDocumentInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** The name of the document */
  name?: Maybe<Scalars["String"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Companydocument`. Fields that are set will be updated. */
export type CompanydocumentPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
  /** The name of the document */
  name?: Maybe<Scalars["String"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
};

/** Represents an update to a `CompanyDocument`. Fields that are set will be updated. */
export type CompanyDocumentPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** The name of the document */
  name?: Maybe<Scalars["String"]>;
  /** The document itself or the path to it */
  document?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Companydocument` values. */
export type CompanydocumentsConnection = {
  __typename?: "CompanydocumentsConnection";
  /** A list of `Companydocument` objects. */
  nodes: Array<Companydocument>;
  /** A list of edges which contains the `Companydocument` and cursor to aid in pagination. */
  edges: Array<CompanydocumentsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Companydocument` you could get from the connection. */
  totalCount: Scalars["Int"];
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

/** A `Companydocument` edge in the connection. */
export type CompanydocumentsEdge = {
  __typename?: "CompanydocumentsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Companydocument` at the end of the edge. */
  node: Companydocument;
};

/** A `CompanyDocument` edge in the connection. */
export type CompanyDocumentsEdge = {
  __typename?: "CompanyDocumentsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CompanyDocument` at the end of the edge. */
  node: CompanyDocument;
};

/** Methods to use when ordering `Companydocument`. */
export enum CompanydocumentsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
  /** fk */
  registeredAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  tradingAddressId?: Maybe<Scalars["Int"]>;
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
  lmsGroup?: Maybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: Maybe<Scalars["String"]>;
  /** The Tax number in that number, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** They Companys public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** The companys GoogleMap address */
  coordinates?: Maybe<Scalars["String"]>;
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
   * A 6 digit reference number generated for all Companies and visible to Roofpro
   * member Companies. (aka membership number).  Should be unique.
   */
  referenceNumber?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection between a user and a company */
export type Companymember = Node & {
  __typename?: "Companymember";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  member?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
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
 * A condition to be used against `Companymember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanymemberCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
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

/** An input for mutations affecting `Companymember` */
export type CompanymemberInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  member?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
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

/** Represents an update to a `Companymember`. Fields that are set will be updated. */
export type CompanymemberPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  member?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
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

/** A connection to a list of `Companymember` values. */
export type CompanymembersConnection = {
  __typename?: "CompanymembersConnection";
  /** A list of `Companymember` objects. */
  nodes: Array<Companymember>;
  /** A list of edges which contains the `Companymember` and cursor to aid in pagination. */
  edges: Array<CompanymembersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Companymember` you could get from the connection. */
  totalCount: Scalars["Int"];
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

/** A `Companymember` edge in the connection. */
export type CompanymembersEdge = {
  __typename?: "CompanymembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Companymember` at the end of the edge. */
  node: Companymember;
};

/** A `CompanyMember` edge in the connection. */
export type CompanyMembersEdge = {
  __typename?: "CompanyMembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `CompanyMember` at the end of the edge. */
  node: CompanyMember;
};

/** A connection between a user and a company */
export type Companymembership = Node & {
  __typename?: "Companymembership";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  enduser?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
};

/**
 * A condition to be used against `Companymembership` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanymembershipCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Companymembership` */
export type CompanymembershipInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  enduser?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
};

/** Represents an update to a `Companymembership`. Fields that are set will be updated. */
export type CompanymembershipPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  enduser?: Maybe<Scalars["Int"]>;
  /** fk */
  company?: Maybe<Scalars["Int"]>;
};

/** A connection to a list of `Companymembership` values. */
export type CompanymembershipsConnection = {
  __typename?: "CompanymembershipsConnection";
  /** A list of `Companymembership` objects. */
  nodes: Array<Companymembership>;
  /** A list of edges which contains the `Companymembership` and cursor to aid in pagination. */
  edges: Array<CompanymembershipsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Companymembership` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Companymembership` edge in the connection. */
export type CompanymembershipsEdge = {
  __typename?: "CompanymembershipsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Companymembership` at the end of the edge. */
  node: Companymembership;
};

/** Methods to use when ordering `Companymembership`. */
export enum CompanymembershipsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** Methods to use when ordering `Companymember`. */
export enum CompanymembersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
  /** fk */
  registeredAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  tradingAddressId?: Maybe<Scalars["Int"]>;
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
  lmsGroup?: Maybe<Scalars["String"]>;
  /** The registered name of the Company */
  name?: Maybe<Scalars["String"]>;
  /** The Tax number in that number, such as the VAT number */
  taxNumber?: Maybe<Scalars["String"]>;
  /** They Companys public phone number */
  phone?: Maybe<Scalars["String"]>;
  /** The companys GoogleMap address */
  coordinates?: Maybe<Scalars["String"]>;
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
   * A 6 digit reference number generated for all Companies and visible to Roofpro
   * member Companies. (aka membership number).  Should be unique.
   */
  referenceNumber?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

export enum CompanyStatus {
  New = "NEW",
  Active = "ACTIVE",
  Deactivated = "DEACTIVATED"
}

/** Contact details that appear as cards on the Company Page */
export type Contactdetail = Node & {
  __typename?: "Contactdetail";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  market?: Maybe<Scalars["Int"]>;
  /** Some markdown text telling you how to get in touch with BMI */
  details?: Maybe<Scalars["String"]>;
};

/**
 * A condition to be used against `Contactdetail` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ContactdetailCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Contactdetail` */
export type ContactdetailInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  market?: Maybe<Scalars["Int"]>;
  /** Some markdown text telling you how to get in touch with BMI */
  details?: Maybe<Scalars["String"]>;
};

/** Represents an update to a `Contactdetail`. Fields that are set will be updated. */
export type ContactdetailPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  market?: Maybe<Scalars["Int"]>;
  /** Some markdown text telling you how to get in touch with BMI */
  details?: Maybe<Scalars["String"]>;
};

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

/** A connection to a list of `Contactdetail` values. */
export type ContactdetailsConnection = {
  __typename?: "ContactdetailsConnection";
  /** A list of `Contactdetail` objects. */
  nodes: Array<Contactdetail>;
  /** A list of edges which contains the `Contactdetail` and cursor to aid in pagination. */
  edges: Array<ContactdetailsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Contactdetail` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Contactdetail` edge in the connection. */
export type ContactdetailsEdge = {
  __typename?: "ContactdetailsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Contactdetail` at the end of the edge. */
  node: Contactdetail;
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

/** Methods to use when ordering `Contactdetail`. */
export enum ContactdetailsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/**
 * A standard webpage with just information and no iteractive functionality.
 * Currently limited to those pages targeted in the footer, which are Cookies
 * Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle)
 */
export type ContentArticle = Entry & {
  __typename?: "ContentArticle";
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ContentArticleLinkingCollections>;
  title?: Maybe<Scalars["String"]>;
  relativePath?: Maybe<Scalars["String"]>;
  body?: Maybe<ContentArticleBody>;
};

/**
 * A standard webpage with just information and no iteractive functionality.
 * Currently limited to those pages targeted in the footer, which are Cookies
 * Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle)
 */
export type ContentArticleLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/**
 * A standard webpage with just information and no iteractive functionality.
 * Currently limited to those pages targeted in the footer, which are Cookies
 * Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle)
 */
export type ContentArticleTitleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/**
 * A standard webpage with just information and no iteractive functionality.
 * Currently limited to those pages targeted in the footer, which are Cookies
 * Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle)
 */
export type ContentArticleRelativePathArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/**
 * A standard webpage with just information and no iteractive functionality.
 * Currently limited to those pages targeted in the footer, which are Cookies
 * Policy, Terms of use and the Privacy Policy [See type definition](https://app.contentful.com/spaces/opay6t6wwmup/content_types/contentArticle)
 */
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

export type Course = {
  __typename?: "Course";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  uidCourse?: Maybe<Scalars["String"]>;
  provider?: Maybe<Scalars["Int"]>;
  slug_name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  credits?: Maybe<Scalars["Int"]>;
  lang_code?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  is_published?: Maybe<Scalars["Boolean"]>;
  can_self_unenroll?: Maybe<Scalars["Boolean"]>;
  can_self_enroll?: Maybe<Scalars["Boolean"]>;
  can_session_change?: Maybe<Scalars["Boolean"]>;
  certificate_url?: Maybe<Scalars["String"]>;
  has_overview?: Maybe<Scalars["Boolean"]>;
  show_toc?: Maybe<Scalars["Boolean"]>;
  show_lightbox_nav?: Maybe<Scalars["Boolean"]>;
  level?: Maybe<Scalars["String"]>;
  shopify_product_meaningful_id?: Maybe<Scalars["String"]>;
  in_soft_deadline?: Maybe<Scalars["Boolean"]>;
  demo_file_type?: Maybe<Scalars["String"]>;
  can_manage_course?: Maybe<Scalars["Boolean"]>;
  is_affiliate?: Maybe<Scalars["Boolean"]>;
  partner_fileds?: Maybe<Scalars["String"]>;
  max_attempts_reached?: Maybe<Scalars["Boolean"]>;
  on_sale?: Maybe<Scalars["Boolean"]>;
  rating_option?: Maybe<Scalars["String"]>;
  can_rate?: Maybe<Scalars["Boolean"]>;
  current_rating?: Maybe<Scalars["Int"]>;
  has_autoplay?: Maybe<Scalars["Boolean"]>;
  deadline?: Maybe<Scalars["String"]>;
  completion_date?: Maybe<Scalars["String"]>;
  last_played_object?: Maybe<Scalars["Int"]>;
  last_completed_object?: Maybe<Scalars["Int"]>;
  thumbnail?: Maybe<Scalars["String"]>;
  demo_file?: Maybe<Scalars["String"]>;
  deeplink?: Maybe<Scalars["String"]>;
  final_score?: Maybe<Scalars["Int"]>;
  available_seats?: Maybe<Array<Maybe<AvailableSeats>>>;
  chapter_sequence?: Maybe<Array<Maybe<Scalars["String"]>>>;
  permissions?: Maybe<Array<Maybe<Scalars["String"]>>>;
  course_thumbnail?: Maybe<CourseThumbnail>;
  additional_fields?: Maybe<Array<Maybe<CourseAdditionalFields>>>;
  background_image?: Maybe<BackgroundImage>;
  instructors?: Maybe<Array<Maybe<Instructors>>>;
  learningplans?: Maybe<Array<Maybe<Learningplans>>>;
  enrolled?: Maybe<Enrolled>;
  self_unenrollment_settings?: Maybe<SelfUnenrollmentSettings>;
  partner_data?: Maybe<PartnerData>;
  enter_status?: Maybe<EnterStatus>;
};

export type CourseAdditionalFields = {
  __typename?: "CourseAdditionalFields";
  id?: Maybe<Scalars["Int"]>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  visible_to_user?: Maybe<Scalars["String"]>;
  settings?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
};

export type CourseCategory = {
  __typename?: "CourseCategory";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
};

export type CourseDates = {
  __typename?: "CourseDates";
  date?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  start_hour?: Maybe<Scalars["String"]>;
  end_hour?: Maybe<Scalars["String"]>;
  id_location?: Maybe<Scalars["Int"]>;
  id_classroom?: Maybe<Scalars["Int"]>;
  classroom_name?: Maybe<Scalars["String"]>;
  webinar_tool?: Maybe<Scalars["String"]>;
  timezone?: Maybe<Scalars["String"]>;
  gmt?: Maybe<Scalars["String"]>;
  duration?: Maybe<Scalars["Int"]>;
  effective_duration?: Maybe<Scalars["Int"]>;
  id_date?: Maybe<Scalars["Int"]>;
  collaboration_tool?: Maybe<Scalars["String"]>;
  is_instructor?: Maybe<Scalars["Boolean"]>;
  instructors?: Maybe<Array<Maybe<Instructors>>>;
};

export type Courses = {
  __typename?: "Courses";
  id_course?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uidCourse?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  date_last_updated?: Maybe<Scalars["String"]>;
  course_type?: Maybe<Scalars["String"]>;
  selling?: Maybe<Scalars["Boolean"]>;
  code?: Maybe<Scalars["String"]>;
  slug_name?: Maybe<Scalars["String"]>;
  image?: Maybe<Scalars["String"]>;
  duration?: Maybe<Scalars["Int"]>;
  language?: Maybe<Scalars["String"]>;
  language_label?: Maybe<Scalars["String"]>;
  price?: Maybe<Scalars["String"]>;
  is_new?: Maybe<Scalars["String"]>;
  is_opened?: Maybe<Scalars["String"]>;
  rating_option?: Maybe<Scalars["String"]>;
  current_rating?: Maybe<Scalars["Int"]>;
  credits?: Maybe<Scalars["Int"]>;
  img_url?: Maybe<Scalars["String"]>;
  can_rate?: Maybe<Scalars["Boolean"]>;
  can_self_unenroll?: Maybe<Scalars["Boolean"]>;
  start_date?: Maybe<Scalars["String"]>;
  end_date?: Maybe<Scalars["String"]>;
  enrollment_policy?: Maybe<Scalars["Int"]>;
  max_attempts?: Maybe<Scalars["Int"]>;
  is_affiliate?: Maybe<Scalars["Boolean"]>;
  partner_fileds?: Maybe<Scalars["String"]>;
  affiliate_price?: Maybe<Scalars["String"]>;
  partner_data?: Maybe<PartnerData>;
  available_seats?: Maybe<AvailableSeats>;
  category?: Maybe<CourseCategory>;
};

export type CoursesData = {
  __typename?: "CoursesData";
  count?: Maybe<Scalars["Int"]>;
  has_more_data?: Maybe<Scalars["Boolean"]>;
  current_page?: Maybe<Scalars["Int"]>;
  current_page_size?: Maybe<Scalars["Int"]>;
  total_page_count?: Maybe<Scalars["Int"]>;
  total_count?: Maybe<Scalars["Int"]>;
  sort?: Maybe<Array<Maybe<Sort>>>;
  items?: Maybe<Array<Maybe<Courses>>>;
};

export type CourseSessions = {
  __typename?: "CourseSessions";
  id_session?: Maybe<Scalars["Int"]>;
  uid_session?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  slug_name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  start_date?: Maybe<Scalars["String"]>;
  end_date?: Maybe<Scalars["String"]>;
  last_subscription_date?: Maybe<Scalars["String"]>;
  min_enroll?: Maybe<Scalars["Int"]>;
  max_enroll?: Maybe<Scalars["Int"]>;
  is_instructor?: Maybe<Scalars["Boolean"]>;
  additional_fields?: Maybe<Array<Maybe<CourseAdditionalFields>>>;
  locations?: Maybe<Array<Maybe<Locations>>>;
  dates?: Maybe<Array<Maybe<CourseDates>>>;
  instructors?: Maybe<Array<Maybe<Instructors>>>;
  enrolled?: Maybe<Array<Maybe<Enrolled>>>;
};

export type CourseThumbnail = {
  __typename?: "CourseThumbnail";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  used_by?: Maybe<Scalars["Int"]>;
  actions?: Maybe<Array<Maybe<Scalars["String"]>>>;
  params?: Maybe<Params>;
};

/** All input for the create `Account` mutation. */
export type CreateAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Account` to be created by this mutation. */
  account: AccountInput;
};

/** The output of our create `Account` mutation. */
export type CreateAccountPayload = {
  __typename?: "CreateAccountPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Account` that was created by this mutation. */
  account?: Maybe<Account>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Account`. */
  accountByCreatedBy?: Maybe<Account>;
  /** Reads a single `Market` that is related to this `Account`. */
  market?: Maybe<Market>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
};

/** The output of our create `Account` mutation. */
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

/** All input for the create `Companydocument` mutation. */
export type CreateCompanydocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companydocument` to be created by this mutation. */
  companydocument: CompanydocumentInput;
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

/** The output of our create `Companydocument` mutation. */
export type CreateCompanydocumentPayload = {
  __typename?: "CreateCompanydocumentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companydocument` that was created by this mutation. */
  companydocument?: Maybe<Companydocument>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companydocument`. May be used by Relay 1. */
  companydocumentEdge?: Maybe<CompanydocumentsEdge>;
};

/** The output of our create `Companydocument` mutation. */
export type CreateCompanydocumentPayloadCompanydocumentEdgeArgs = {
  orderBy?: Maybe<Array<CompanydocumentsOrderBy>>;
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

/** All input for the create `Companymember` mutation. */
export type CreateCompanymemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companymember` to be created by this mutation. */
  companymember: CompanymemberInput;
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

/** The output of our create `Companymember` mutation. */
export type CreateCompanymemberPayload = {
  __typename?: "CreateCompanymemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companymember` that was created by this mutation. */
  companymember?: Maybe<Companymember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companymember`. May be used by Relay 1. */
  companymemberEdge?: Maybe<CompanymembersEdge>;
};

/** The output of our create `Companymember` mutation. */
export type CreateCompanymemberPayloadCompanymemberEdgeArgs = {
  orderBy?: Maybe<Array<CompanymembersOrderBy>>;
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

/** All input for the create `Companymembership` mutation. */
export type CreateCompanymembershipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companymembership` to be created by this mutation. */
  companymembership: CompanymembershipInput;
};

/** The output of our create `Companymembership` mutation. */
export type CreateCompanymembershipPayload = {
  __typename?: "CreateCompanymembershipPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companymembership` that was created by this mutation. */
  companymembership?: Maybe<Companymembership>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companymembership`. May be used by Relay 1. */
  companymembershipEdge?: Maybe<CompanymembershipsEdge>;
};

/** The output of our create `Companymembership` mutation. */
export type CreateCompanymembershipPayloadCompanymembershipEdgeArgs = {
  orderBy?: Maybe<Array<CompanymembershipsOrderBy>>;
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
  /** Reads a single `Address` that is related to this `Company`. */
  registeredAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Company`. */
  tradingAddress?: Maybe<Address>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompaniesEdge>;
};

/** The output of our create `Company` mutation. */
export type CreateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Maybe<Array<CompaniesOrderBy>>;
};

/** All input for the create `Contactdetail` mutation. */
export type CreateContactdetailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Contactdetail` to be created by this mutation. */
  contactdetail: ContactdetailInput;
};

/** The output of our create `Contactdetail` mutation. */
export type CreateContactdetailPayload = {
  __typename?: "CreateContactdetailPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Contactdetail` that was created by this mutation. */
  contactdetail?: Maybe<Contactdetail>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Contactdetail`. May be used by Relay 1. */
  contactdetailEdge?: Maybe<ContactdetailsEdge>;
};

/** The output of our create `Contactdetail` mutation. */
export type CreateContactdetailPayloadContactdetailEdgeArgs = {
  orderBy?: Maybe<Array<ContactdetailsOrderBy>>;
};

/** All input for the create `Evidenceitem` mutation. */
export type CreateEvidenceitemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Evidenceitem` to be created by this mutation. */
  evidenceitem: EvidenceitemInput;
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

/** The output of our create `Evidenceitem` mutation. */
export type CreateEvidenceitemPayload = {
  __typename?: "CreateEvidenceitemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Evidenceitem` that was created by this mutation. */
  evidenceitem?: Maybe<Evidenceitem>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Evidenceitem`. May be used by Relay 1. */
  evidenceitemEdge?: Maybe<EvidenceitemsEdge>;
};

/** The output of our create `Evidenceitem` mutation. */
export type CreateEvidenceitemPayloadEvidenceitemEdgeArgs = {
  orderBy?: Maybe<Array<EvidenceitemsOrderBy>>;
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

/** All input for the create `Guaranteedproduct` mutation. */
export type CreateGuaranteedproductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Guaranteedproduct` to be created by this mutation. */
  guaranteedproduct: GuaranteedproductInput;
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

/** The output of our create `Guaranteedproduct` mutation. */
export type CreateGuaranteedproductPayload = {
  __typename?: "CreateGuaranteedproductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Guaranteedproduct` that was created by this mutation. */
  guaranteedproduct?: Maybe<Guaranteedproduct>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Guaranteedproduct`. May be used by Relay 1. */
  guaranteedproductEdge?: Maybe<GuaranteedproductsEdge>;
};

/** The output of our create `Guaranteedproduct` mutation. */
export type CreateGuaranteedproductPayloadGuaranteedproductEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteedproductsOrderBy>>;
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
  account?: Maybe<Account>;
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

/** All input for the create `Message` mutation. */
export type CreateMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Message` to be created by this mutation. */
  message: MessageInput;
};

/** The output of our create `Message` mutation. */
export type CreateMessagePayload = {
  __typename?: "CreateMessagePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Message` that was created by this mutation. */
  message?: Maybe<Message>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessagesEdge>;
};

/** The output of our create `Message` mutation. */
export type CreateMessagePayloadMessageEdgeArgs = {
  orderBy?: Maybe<Array<MessagesOrderBy>>;
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

/** All input for the create `Projectmember` mutation. */
export type CreateProjectmemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Projectmember` to be created by this mutation. */
  projectmember: ProjectmemberInput;
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

/** The output of our create `Projectmember` mutation. */
export type CreateProjectmemberPayload = {
  __typename?: "CreateProjectmemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Projectmember` that was created by this mutation. */
  projectmember?: Maybe<Projectmember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Projectmember`. May be used by Relay 1. */
  projectmemberEdge?: Maybe<ProjectmembersEdge>;
};

/** The output of our create `Projectmember` mutation. */
export type CreateProjectmemberPayloadProjectmemberEdgeArgs = {
  orderBy?: Maybe<Array<ProjectmembersOrderBy>>;
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
  buildingOwnerAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
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

/** All input for the create `Systemmember` mutation. */
export type CreateSystemmemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Systemmember` to be created by this mutation. */
  systemmember: SystemmemberInput;
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

/** The output of our create `Systemmember` mutation. */
export type CreateSystemmemberPayload = {
  __typename?: "CreateSystemmemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Systemmember` that was created by this mutation. */
  systemmember?: Maybe<Systemmember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Systemmember`. May be used by Relay 1. */
  systemmemberEdge?: Maybe<SystemmembersEdge>;
};

/** The output of our create `Systemmember` mutation. */
export type CreateSystemmemberPayloadSystemmemberEdgeArgs = {
  orderBy?: Maybe<Array<SystemmembersOrderBy>>;
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

/** All input for the create `TierOffset` mutation. */
export type CreateTierOffsetInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `TierOffset` to be created by this mutation. */
  tierOffset: TierOffsetInput;
};

/** The output of our create `TierOffset` mutation. */
export type CreateTierOffsetPayload = {
  __typename?: "CreateTierOffsetPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `TierOffset` that was created by this mutation. */
  tierOffset?: Maybe<TierOffset>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `TierOffset`. */
  market?: Maybe<Market>;
  /** An edge for our `TierOffset`. May be used by Relay 1. */
  tierOffsetEdge?: Maybe<TierOffsetsEdge>;
};

/** The output of our create `TierOffset` mutation. */
export type CreateTierOffsetPayloadTierOffsetEdgeArgs = {
  orderBy?: Maybe<Array<TierOffsetsOrderBy>>;
};

export type CurrencySettings = {
  __typename?: "CurrencySettings";
  currency?: Maybe<Scalars["String"]>;
  currency_symbol?: Maybe<Scalars["String"]>;
};

export type Dates = {
  __typename?: "Dates";
  date?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  time_begin?: Maybe<Scalars["String"]>;
  time_end?: Maybe<Scalars["String"]>;
  timezone?: Maybe<Scalars["String"]>;
  id_location?: Maybe<Scalars["Int"]>;
  id_classroom?: Maybe<Scalars["Int"]>;
  attendance_status?: Maybe<Scalars["String"]>;
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
  /** Reads a single `Account` that is related to this `Account`. */
  accountByCreatedBy?: Maybe<Account>;
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

/** All input for the `deleteCompanydocumentByNodeId` mutation. */
export type DeleteCompanydocumentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Companydocument` to be deleted. */
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

/** All input for the `deleteCompanydocument` mutation. */
export type DeleteCompanydocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our delete `Companydocument` mutation. */
export type DeleteCompanydocumentPayload = {
  __typename?: "DeleteCompanydocumentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companydocument` that was deleted by this mutation. */
  companydocument?: Maybe<Companydocument>;
  deletedCompanydocumentNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companydocument`. May be used by Relay 1. */
  companydocumentEdge?: Maybe<CompanydocumentsEdge>;
};

/** The output of our delete `Companydocument` mutation. */
export type DeleteCompanydocumentPayloadCompanydocumentEdgeArgs = {
  orderBy?: Maybe<Array<CompanydocumentsOrderBy>>;
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

/** All input for the `deleteCompanymemberByNodeId` mutation. */
export type DeleteCompanymemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Companymember` to be deleted. */
  nodeId: Scalars["ID"];
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

/** All input for the `deleteCompanymember` mutation. */
export type DeleteCompanymemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our delete `Companymember` mutation. */
export type DeleteCompanymemberPayload = {
  __typename?: "DeleteCompanymemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companymember` that was deleted by this mutation. */
  companymember?: Maybe<Companymember>;
  deletedCompanymemberNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companymember`. May be used by Relay 1. */
  companymemberEdge?: Maybe<CompanymembersEdge>;
};

/** The output of our delete `Companymember` mutation. */
export type DeleteCompanymemberPayloadCompanymemberEdgeArgs = {
  orderBy?: Maybe<Array<CompanymembersOrderBy>>;
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

/** All input for the `deleteCompanymembershipByNodeId` mutation. */
export type DeleteCompanymembershipByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Companymembership` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteCompanymembership` mutation. */
export type DeleteCompanymembershipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Companymembership` mutation. */
export type DeleteCompanymembershipPayload = {
  __typename?: "DeleteCompanymembershipPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companymembership` that was deleted by this mutation. */
  companymembership?: Maybe<Companymembership>;
  deletedCompanymembershipNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companymembership`. May be used by Relay 1. */
  companymembershipEdge?: Maybe<CompanymembershipsEdge>;
};

/** The output of our delete `Companymembership` mutation. */
export type DeleteCompanymembershipPayloadCompanymembershipEdgeArgs = {
  orderBy?: Maybe<Array<CompanymembershipsOrderBy>>;
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

/** All input for the `deleteContactdetailByNodeId` mutation. */
export type DeleteContactdetailByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Contactdetail` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteContactdetail` mutation. */
export type DeleteContactdetailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Contactdetail` mutation. */
export type DeleteContactdetailPayload = {
  __typename?: "DeleteContactdetailPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Contactdetail` that was deleted by this mutation. */
  contactdetail?: Maybe<Contactdetail>;
  deletedContactdetailNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Contactdetail`. May be used by Relay 1. */
  contactdetailEdge?: Maybe<ContactdetailsEdge>;
};

/** The output of our delete `Contactdetail` mutation. */
export type DeleteContactdetailPayloadContactdetailEdgeArgs = {
  orderBy?: Maybe<Array<ContactdetailsOrderBy>>;
};

/** All input for the `deleteEvidenceitemByNodeId` mutation. */
export type DeleteEvidenceitemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Evidenceitem` to be deleted. */
  nodeId: Scalars["ID"];
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

/** All input for the `deleteEvidenceitem` mutation. */
export type DeleteEvidenceitemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our delete `Evidenceitem` mutation. */
export type DeleteEvidenceitemPayload = {
  __typename?: "DeleteEvidenceitemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Evidenceitem` that was deleted by this mutation. */
  evidenceitem?: Maybe<Evidenceitem>;
  deletedEvidenceitemNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Evidenceitem`. May be used by Relay 1. */
  evidenceitemEdge?: Maybe<EvidenceitemsEdge>;
};

/** The output of our delete `Evidenceitem` mutation. */
export type DeleteEvidenceitemPayloadEvidenceitemEdgeArgs = {
  orderBy?: Maybe<Array<EvidenceitemsOrderBy>>;
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

/** All input for the `deleteGuaranteedproductByNodeId` mutation. */
export type DeleteGuaranteedproductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Guaranteedproduct` to be deleted. */
  nodeId: Scalars["ID"];
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

/** All input for the `deleteGuaranteedproduct` mutation. */
export type DeleteGuaranteedproductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our delete `Guaranteedproduct` mutation. */
export type DeleteGuaranteedproductPayload = {
  __typename?: "DeleteGuaranteedproductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Guaranteedproduct` that was deleted by this mutation. */
  guaranteedproduct?: Maybe<Guaranteedproduct>;
  deletedGuaranteedproductNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Guaranteedproduct`. May be used by Relay 1. */
  guaranteedproductEdge?: Maybe<GuaranteedproductsEdge>;
};

/** The output of our delete `Guaranteedproduct` mutation. */
export type DeleteGuaranteedproductPayloadGuaranteedproductEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteedproductsOrderBy>>;
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
  account?: Maybe<Account>;
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

/** All input for the `deleteMessageByNodeId` mutation. */
export type DeleteMessageByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Message` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteMessage` mutation. */
export type DeleteMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `Message` mutation. */
export type DeleteMessagePayload = {
  __typename?: "DeleteMessagePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Message` that was deleted by this mutation. */
  message?: Maybe<Message>;
  deletedMessageNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessagesEdge>;
};

/** The output of our delete `Message` mutation. */
export type DeleteMessagePayloadMessageEdgeArgs = {
  orderBy?: Maybe<Array<MessagesOrderBy>>;
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

/** All input for the `deleteProjectmemberByNodeId` mutation. */
export type DeleteProjectmemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Projectmember` to be deleted. */
  nodeId: Scalars["ID"];
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

/** All input for the `deleteProjectmember` mutation. */
export type DeleteProjectmemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our delete `Projectmember` mutation. */
export type DeleteProjectmemberPayload = {
  __typename?: "DeleteProjectmemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Projectmember` that was deleted by this mutation. */
  projectmember?: Maybe<Projectmember>;
  deletedProjectmemberNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Projectmember`. May be used by Relay 1. */
  projectmemberEdge?: Maybe<ProjectmembersEdge>;
};

/** The output of our delete `Projectmember` mutation. */
export type DeleteProjectmemberPayloadProjectmemberEdgeArgs = {
  orderBy?: Maybe<Array<ProjectmembersOrderBy>>;
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
  buildingOwnerAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
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

/** All input for the `deleteSystemmemberByNodeId` mutation. */
export type DeleteSystemmemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Systemmember` to be deleted. */
  nodeId: Scalars["ID"];
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

/** All input for the `deleteSystemmember` mutation. */
export type DeleteSystemmemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our delete `Systemmember` mutation. */
export type DeleteSystemmemberPayload = {
  __typename?: "DeleteSystemmemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Systemmember` that was deleted by this mutation. */
  systemmember?: Maybe<Systemmember>;
  deletedSystemmemberNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Systemmember`. May be used by Relay 1. */
  systemmemberEdge?: Maybe<SystemmembersEdge>;
};

/** The output of our delete `Systemmember` mutation. */
export type DeleteSystemmemberPayloadSystemmemberEdgeArgs = {
  orderBy?: Maybe<Array<SystemmembersOrderBy>>;
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

/** All input for the `deleteTierOffsetByNodeId` mutation. */
export type DeleteTierOffsetByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `TierOffset` to be deleted. */
  nodeId: Scalars["ID"];
};

/** All input for the `deleteTierOffset` mutation. */
export type DeleteTierOffsetInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our delete `TierOffset` mutation. */
export type DeleteTierOffsetPayload = {
  __typename?: "DeleteTierOffsetPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `TierOffset` that was deleted by this mutation. */
  tierOffset?: Maybe<TierOffset>;
  deletedTierOffsetNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `TierOffset`. */
  market?: Maybe<Market>;
  /** An edge for our `TierOffset`. May be used by Relay 1. */
  tierOffsetEdge?: Maybe<TierOffsetsEdge>;
};

/** The output of our delete `TierOffset` mutation. */
export type DeleteTierOffsetPayloadTierOffsetEdgeArgs = {
  orderBy?: Maybe<Array<TierOffsetsOrderBy>>;
};

export type Enrolled = {
  __typename?: "Enrolled";
  is_enrolled?: Maybe<Scalars["Boolean"]>;
  count_enrolled?: Maybe<Scalars["Boolean"]>;
  count_instructor?: Maybe<Scalars["Int"]>;
  count_instructor_waitlist?: Maybe<Scalars["Int"]>;
  count_tutor?: Maybe<Scalars["Int"]>;
  count_tutor_waitlist?: Maybe<Scalars["Int"]>;
  count_learner?: Maybe<Scalars["Int"]>;
  count_learner_waitlist?: Maybe<Scalars["Int"]>;
  waiting_list?: Maybe<Scalars["Boolean"]>;
  status?: Maybe<Scalars["String"]>;
  evaluation_type?: Maybe<Scalars["String"]>;
};

export type EnrolledSessions = {
  __typename?: "EnrolledSessions";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  other_info?: Maybe<Scalars["String"]>;
  date_begin?: Maybe<Scalars["String"]>;
  date_end?: Maybe<Scalars["String"]>;
  min_enrollments?: Maybe<Scalars["Int"]>;
  max_enrollments?: Maybe<Scalars["Int"]>;
  score_base?: Maybe<Scalars["Int"]>;
  tool?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  dates?: Maybe<Array<Maybe<Dates>>>;
};

export type Enrollment = {
  __typename?: "Enrollment";
  count?: Maybe<Scalars["Int"]>;
  has_more_data?: Maybe<Scalars["Boolean"]>;
  cursor?: Maybe<Scalars["String"]>;
  current_page?: Maybe<Scalars["Int"]>;
  current_page_size?: Maybe<Scalars["Int"]>;
  total_page_count?: Maybe<Scalars["Int"]>;
  total_count?: Maybe<Scalars["Int"]>;
  actions?: Maybe<Array<Maybe<Scalars["String"]>>>;
  sort?: Maybe<Array<Maybe<Sort>>>;
  items?: Maybe<Array<Maybe<EnrollmentItems>>>;
};

export type EnrollmentItems = {
  __typename?: "EnrollmentItems";
  id?: Maybe<Scalars["Int"]>;
  user_id?: Maybe<Scalars["Int"]>;
  subscribed_by?: Maybe<Scalars["Int"]>;
  date_last_updated?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
  complete_percent?: Maybe<Scalars["Int"]>;
  description?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  location_name?: Maybe<Scalars["String"]>;
  webinar_tool?: Maybe<Scalars["String"]>;
  session_date_begin?: Maybe<Scalars["String"]>;
  session_time_begin?: Maybe<Scalars["String"]>;
  session_timezone?: Maybe<Scalars["String"]>;
  lang_code?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  uidCourse?: Maybe<Scalars["String"]>;
  course_begin_date?: Maybe<Scalars["String"]>;
  enroll_begin_date?: Maybe<Scalars["String"]>;
  enroll_date_of_enrollment?: Maybe<Scalars["String"]>;
  enroll_end_date?: Maybe<Scalars["String"]>;
  course_complete_date?: Maybe<Scalars["String"]>;
  total_time?: Maybe<Scalars["Int"]>;
  score?: Maybe<Scalars["Int"]>;
  image_url?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  rating_option?: Maybe<Scalars["String"]>;
  rating?: Maybe<Scalars["Int"]>;
  is_new?: Maybe<Scalars["Boolean"]>;
  can_enter?: Maybe<Scalars["Boolean"]>;
  can_enter_reason?: Maybe<Scalars["String"]>;
  duration?: Maybe<Scalars["Int"]>;
  level?: Maybe<Scalars["String"]>;
  courses_count?: Maybe<Scalars["Int"]>;
  soft_deadline?: Maybe<Scalars["Boolean"]>;
  course_end_date?: Maybe<Scalars["String"]>;
  hidden?: Maybe<Scalars["Boolean"]>;
  outdated?: Maybe<Outdated>;
  enrolled_sessions?: Maybe<Array<Maybe<EnrolledSessions>>>;
  subscription?: Maybe<Array<Maybe<EnrollmentSubscription>>>;
  course?: Maybe<Course>;
};

export type EnrollmentReport = {
  __typename?: "EnrollmentReport";
  username?: Maybe<Scalars["String"]>;
  fullname?: Maybe<Scalars["String"]>;
  course_name?: Maybe<Scalars["String"]>;
  course_code?: Maybe<Scalars["String"]>;
  course_type?: Maybe<Scalars["String"]>;
  enrollment_date?: Maybe<Scalars["String"]>;
  completion_date?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Int"]>;
  session_time?: Maybe<Scalars["Int"]>;
  credits?: Maybe<Scalars["Int"]>;
};

export type EnrollmentReportData = {
  __typename?: "EnrollmentReportData";
  count?: Maybe<Scalars["Int"]>;
  has_more_data?: Maybe<Scalars["Boolean"]>;
  cursor?: Maybe<Scalars["String"]>;
  current_page?: Maybe<Scalars["Int"]>;
  current_page_size?: Maybe<Scalars["Int"]>;
  total_page_count?: Maybe<Scalars["Int"]>;
  total_count?: Maybe<Scalars["Int"]>;
  items?: Maybe<Array<Maybe<EnrollmentReport>>>;
};

export type EnrollmentSubscription = {
  __typename?: "EnrollmentSubscription";
  subscribed?: Maybe<Scalars["Boolean"]>;
  is_active?: Maybe<Scalars["Boolean"]>;
};

export type EnterStatus = {
  __typename?: "EnterStatus";
  status?: Maybe<Scalars["String"]>;
  price?: Maybe<Scalars["Int"]>;
  sessions?: Maybe<Array<Maybe<CourseSessions>>>;
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
export type Evidenceitem = Node & {
  __typename?: "Evidenceitem";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  category?: Maybe<Scalars["Int"]>;
  /** fk */
  request?: Maybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. Photo of the evidence */
  attachment?: Maybe<Scalars["String"]>;
};

/** An item of evidence for a guarantee */
export type EvidenceItem = Node & {
  __typename?: "EvidenceItem";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  evidenceCategoryId?: Maybe<Scalars["Int"]>;
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
 * A condition to be used against `Evidenceitem` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EvidenceitemCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
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

/** An input for mutations affecting `Evidenceitem` */
export type EvidenceitemInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  category?: Maybe<Scalars["Int"]>;
  /** fk */
  request?: Maybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. Photo of the evidence */
  attachment?: Maybe<Scalars["String"]>;
};

/** An input for mutations affecting `EvidenceItem` */
export type EvidenceItemInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  evidenceCategoryId?: Maybe<Scalars["Int"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. Photo of the evidence */
  attachment?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Evidenceitem`. Fields that are set will be updated. */
export type EvidenceitemPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  category?: Maybe<Scalars["Int"]>;
  /** fk */
  request?: Maybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. Photo of the evidence */
  attachment?: Maybe<Scalars["String"]>;
};

/** Represents an update to a `EvidenceItem`. Fields that are set will be updated. */
export type EvidenceItemPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  evidenceCategoryId?: Maybe<Scalars["Int"]>;
  /** fk */
  guaranteeId?: Maybe<Scalars["Int"]>;
  /** Short name for the item of evidence */
  name?: Maybe<Scalars["String"]>;
  /** File reference or the file itself. Photo of the evidence */
  attachment?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `Evidenceitem` values. */
export type EvidenceitemsConnection = {
  __typename?: "EvidenceitemsConnection";
  /** A list of `Evidenceitem` objects. */
  nodes: Array<Evidenceitem>;
  /** A list of edges which contains the `Evidenceitem` and cursor to aid in pagination. */
  edges: Array<EvidenceitemsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Evidenceitem` you could get from the connection. */
  totalCount: Scalars["Int"];
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

/** A `Evidenceitem` edge in the connection. */
export type EvidenceitemsEdge = {
  __typename?: "EvidenceitemsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Evidenceitem` at the end of the edge. */
  node: Evidenceitem;
};

/** A `EvidenceItem` edge in the connection. */
export type EvidenceItemsEdge = {
  __typename?: "EvidenceItemsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `EvidenceItem` at the end of the edge. */
  node: EvidenceItem;
};

/** Methods to use when ordering `Evidenceitem`. */
export enum EvidenceitemsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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

export type First = {
  __typename?: "First";
  href?: Maybe<Scalars["String"]>;
};

export type Footer = {
  __typename?: "Footer";
  footer_type?: Maybe<Scalars["String"]>;
  iframe_height?: Maybe<Scalars["Int"]>;
  iframe_url?: Maybe<Scalars["Boolean"]>;
  custom_html?: Maybe<Scalars["Boolean"]>;
};

export type Goto = {
  __typename?: "Goto";
  href?: Maybe<Scalars["String"]>;
};

export type GroupCreateInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  assign_rules?: Maybe<Scalars["Int"]>;
  rules_logic?: Maybe<Scalars["String"]>;
  assign_existing_users?: Maybe<Scalars["Boolean"]>;
  rules_list?: Maybe<Array<Maybe<RulesList>>>;
  id_users?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type GroupCreateResponse = {
  __typename?: "GroupCreateResponse";
  success?: Maybe<Scalars["Boolean"]>;
  id_group?: Maybe<Scalars["Int"]>;
  user_added?: Maybe<Scalars["Boolean"]>;
};

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
  /** fk */
  guaranteeTypeId?: Maybe<Scalars["Int"]>;
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually. */
  startDate?: Maybe<Scalars["Datetime"]>;
  /**
   * When the guarantee will expire.  This is dependent on the StartDate, the
   * Validity of the Product or System and the ValidityOffset in this Tier
   */
  expiry?: Maybe<Scalars["Datetime"]>;
  /**
   * This will be presented on the Guarantee pdf itself, if approved and is the
   * primary reference for the Guarantees report. It is unique in the In the legacy
   * system, the number is 3 sets of 4 digit numbers concatenated into one long
   * number from the Company Id, Project Id and Request Id.
   */
  issueNumber?: Maybe<Scalars["String"]>;
  /** The date that the BMI merchanise was purchased */
  purchaseDate?: Maybe<Scalars["Datetime"]>;
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

/** A mapping of Products to Guarantees.  You can have more than one Product per Product Guarantee. */
export type Guaranteedproduct = Node & {
  __typename?: "Guaranteedproduct";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  product?: Maybe<Scalars["Int"]>;
  /** fk */
  guarantee?: Maybe<Scalars["Int"]>;
};

/** A mapping of Products to Guarantees.  You can have more than one Product per Product Guarantee. */
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
 * A condition to be used against `Guaranteedproduct` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type GuaranteedproductCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
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

/** An input for mutations affecting `Guaranteedproduct` */
export type GuaranteedproductInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  product?: Maybe<Scalars["Int"]>;
  /** fk */
  guarantee?: Maybe<Scalars["Int"]>;
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

/** Represents an update to a `Guaranteedproduct`. Fields that are set will be updated. */
export type GuaranteedproductPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  product?: Maybe<Scalars["Int"]>;
  /** fk */
  guarantee?: Maybe<Scalars["Int"]>;
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

/** A connection to a list of `Guaranteedproduct` values. */
export type GuaranteedproductsConnection = {
  __typename?: "GuaranteedproductsConnection";
  /** A list of `Guaranteedproduct` objects. */
  nodes: Array<Guaranteedproduct>;
  /** A list of edges which contains the `Guaranteedproduct` and cursor to aid in pagination. */
  edges: Array<GuaranteedproductsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Guaranteedproduct` you could get from the connection. */
  totalCount: Scalars["Int"];
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

/** A `Guaranteedproduct` edge in the connection. */
export type GuaranteedproductsEdge = {
  __typename?: "GuaranteedproductsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Guaranteedproduct` at the end of the edge. */
  node: Guaranteedproduct;
};

/** A `GuaranteedProduct` edge in the connection. */
export type GuaranteedProductsEdge = {
  __typename?: "GuaranteedProductsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `GuaranteedProduct` at the end of the edge. */
  node: GuaranteedProduct;
};

/** Methods to use when ordering `Guaranteedproduct`. */
export enum GuaranteedproductsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
  /** fk */
  guaranteeTypeId?: Maybe<Scalars["Int"]>;
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually. */
  startDate?: Maybe<Scalars["Datetime"]>;
  /**
   * When the guarantee will expire.  This is dependent on the StartDate, the
   * Validity of the Product or System and the ValidityOffset in this Tier
   */
  expiry?: Maybe<Scalars["Datetime"]>;
  /**
   * This will be presented on the Guarantee pdf itself, if approved and is the
   * primary reference for the Guarantees report. It is unique in the In the legacy
   * system, the number is 3 sets of 4 digit numbers concatenated into one long
   * number from the Company Id, Project Id and Request Id.
   */
  issueNumber?: Maybe<Scalars["String"]>;
  /** The date that the BMI merchanise was purchased */
  purchaseDate?: Maybe<Scalars["Datetime"]>;
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
  /** fk */
  guaranteeTypeId?: Maybe<Scalars["Int"]>;
  /** fk */
  systemId?: Maybe<Scalars["Int"]>;
  /** fk */
  reviewerAccountId?: Maybe<Scalars["Int"]>;
  /** ek */
  status?: Maybe<RequestStatus>;
  /** The date that the Guarantee is approved either automatically or manually. */
  startDate?: Maybe<Scalars["Datetime"]>;
  /**
   * When the guarantee will expire.  This is dependent on the StartDate, the
   * Validity of the Product or System and the ValidityOffset in this Tier
   */
  expiry?: Maybe<Scalars["Datetime"]>;
  /**
   * This will be presented on the Guarantee pdf itself, if approved and is the
   * primary reference for the Guarantees report. It is unique in the In the legacy
   * system, the number is 3 sets of 4 digit numbers concatenated into one long
   * number from the Company Id, Project Id and Request Id.
   */
  issueNumber?: Maybe<Scalars["String"]>;
  /** The date that the BMI merchanise was purchased */
  purchaseDate?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

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

export type Header = {
  __typename?: "Header";
  iframe_active?: Maybe<Scalars["Boolean"]>;
  iframe_url?: Maybe<Scalars["String"]>;
  iframe_height?: Maybe<Scalars["Int"]>;
  header_message_active?: Maybe<Scalars["Boolean"]>;
  header_message?: Maybe<Scalars["String"]>;
};

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

export type Instructors = {
  __typename?: "Instructors";
  username?: Maybe<Scalars["String"]>;
  instructor_id?: Maybe<Scalars["Int"]>;
  firstname?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
  avatar_url?: Maybe<Scalars["String"]>;
};

/** An invitation to join InTouch */
export type Invitation = Node & {
  __typename?: "Invitation";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** ek */
  type?: Maybe<InvitationType>;
  /** An email address */
  invitee?: Maybe<Scalars["String"]>;
  /** if the invitation has been accepted */
  accepted?: Maybe<Scalars["Boolean"]>;
  /** When the invite was generated */
  generated?: Maybe<Scalars["Datetime"]>;
  /** When this invitation will expire */
  expires?: Maybe<Scalars["Datetime"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Account` that is related to this `Invitation`. */
  account?: Maybe<Account>;
};

/**
 * A condition to be used against `Invitation` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type InvitationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Invitation` */
export type InvitationInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** ek */
  type?: Maybe<InvitationType>;
  /** An email address */
  invitee?: Maybe<Scalars["String"]>;
  /** if the invitation has been accepted */
  accepted?: Maybe<Scalars["Boolean"]>;
  /** When the invite was generated */
  generated?: Maybe<Scalars["Datetime"]>;
  /** When this invitation will expire */
  expires?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `Invitation`. Fields that are set will be updated. */
export type InvitationPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  accountId?: Maybe<Scalars["Int"]>;
  /** ek */
  type?: Maybe<InvitationType>;
  /** An email address */
  invitee?: Maybe<Scalars["String"]>;
  /** if the invitation has been accepted */
  accepted?: Maybe<Scalars["Boolean"]>;
  /** When the invite was generated */
  generated?: Maybe<Scalars["Datetime"]>;
  /** When this invitation will expire */
  expires?: Maybe<Scalars["Datetime"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

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
  AccountIdAsc = "ACCOUNT_ID_ASC",
  AccountIdDesc = "ACCOUNT_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum InvitationType {
  JoinCompany = "JOIN_COMPANY",
  BecomeAdmin = "BECOME_ADMIN",
  BecomeOwner = "BECOME_OWNER"
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

export type Items = {
  __typename?: "Items";
  label?: Maybe<Scalars["String"]>;
  link?: Maybe<Scalars["String"]>;
  is_new?: Maybe<Scalars["Boolean"]>;
  notification_balloon?: Maybe<Array<Maybe<NotificationBalloon>>>;
  notification_tooltip?: Maybe<Array<Maybe<NotificationTooltip>>>;
};

export type Last = {
  __typename?: "Last";
  href?: Maybe<Scalars["String"]>;
};

export type Learningplans = {
  __typename?: "Learningplans";
  id?: Maybe<Scalars["Int"]>;
};

export type Links = {
  __typename?: "Links";
  last?: Maybe<Last>;
  first?: Maybe<First>;
  goto?: Maybe<Goto>;
  self?: Maybe<Self>;
};

export enum Locale {
  DaDk = "DA_DK",
  NoNo = "NO_NO",
  EnMy = "EN_MY",
  EnIn = "EN_IN",
  SvSe = "SV_SE",
  PtPt = "PT_PT",
  DeAt = "DE_AT",
  NlNl = "NL_NL",
  SkSk = "SK_SK",
  FrBe = "FR_BE",
  NlBe = "NL_BE",
  FrFr = "FR_FR",
  PlPl = "PL_PL",
  EsEs = "ES_ES",
  FiFi = "FI_FI",
  EnUs = "EN_US",
  EnCa = "EN_CA",
  FrCa = "FR_CA"
}

export type Locations = {
  __typename?: "Locations";
  id_location?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  address?: Maybe<Scalars["String"]>;
  id_country?: Maybe<Scalars["Int"]>;
  name_country?: Maybe<Scalars["String"]>;
  telephone?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  reaching_info?: Maybe<Scalars["String"]>;
  accommodation?: Maybe<Scalars["String"]>;
  iso_code_country?: Maybe<Scalars["String"]>;
  id_zone?: Maybe<Scalars["Int"]>;
  other_info?: Maybe<Scalars["String"]>;
};

export type MainMenu = {
  __typename?: "MainMenu";
  label?: Maybe<Scalars["String"]>;
  items?: Maybe<Array<Maybe<Items>>>;
};

export type Manager = {
  manager_type_id?: Maybe<Scalars["Int"]>;
};

/** A country that BMI operates in */
export type Market = Node & {
  __typename?: "Market";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** ek */
  locale?: Maybe<Locale>;
  /** The space in Contenful */
  cmsSpaceId?: Maybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: Maybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: Maybe<Scalars["String"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: Maybe<Scalars["String"]>;
  /** The default branch in Docebo that installers go into */
  lmsBranch?: Maybe<Scalars["String"]>;
  /** The branch in Docebo that company admins go into */
  lmsOwnerBranch?: Maybe<Scalars["String"]>;
  /**
   * Whether the market supports Projects.  If so then the Project section is
   * available.  Tier 0 can then be configured to support Guarantees in non-Roopro
   * countries.  In Roofpro countries various Tier configurations become possible.
   */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** A reference to a linkedin news item */
  news?: Maybe<Scalars["String"]>;
  /** Whether the market is live to the public or not */
  live?: Maybe<Scalars["Boolean"]>;
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
  /** Reads and enables pagination through a set of `TierOffset`. */
  tierOffsets: TierOffsetsConnection;
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

/** A country that BMI operates in */
export type MarketTierOffsetsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<TierOffsetsOrderBy>>;
  condition?: Maybe<TierOffsetCondition>;
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
  locale?: Maybe<Locale>;
  /** The space in Contenful */
  cmsSpaceId?: Maybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: Maybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: Maybe<Scalars["String"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: Maybe<Scalars["String"]>;
  /** The default branch in Docebo that installers go into */
  lmsBranch?: Maybe<Scalars["String"]>;
  /** The branch in Docebo that company admins go into */
  lmsOwnerBranch?: Maybe<Scalars["String"]>;
  /**
   * Whether the market supports Projects.  If so then the Project section is
   * available.  Tier 0 can then be configured to support Guarantees in non-Roopro
   * countries.  In Roofpro countries various Tier configurations become possible.
   */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** A reference to a linkedin news item */
  news?: Maybe<Scalars["String"]>;
  /** Whether the market is live to the public or not */
  live?: Maybe<Scalars["Boolean"]>;
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
  locale?: Maybe<Locale>;
  /** The space in Contenful */
  cmsSpaceId?: Maybe<Scalars["String"]>;
  /** A short name for the market, e.g. Italy, Norway, Netherlands */
  name?: Maybe<Scalars["String"]>;
  /** The From name used when sending an email */
  sendName?: Maybe<Scalars["String"]>;
  /** The mailbox on intouch.bmigroup.com that emails will be sent from for this Market */
  sendMailbox?: Maybe<Scalars["String"]>;
  /** The default branch in Docebo that installers go into */
  lmsBranch?: Maybe<Scalars["String"]>;
  /** The branch in Docebo that company admins go into */
  lmsOwnerBranch?: Maybe<Scalars["String"]>;
  /**
   * Whether the market supports Projects.  If so then the Project section is
   * available.  Tier 0 can then be configured to support Guarantees in non-Roopro
   * countries.  In Roofpro countries various Tier configurations become possible.
   */
  projectsEnabled?: Maybe<Scalars["Boolean"]>;
  /** A reference to a linkedin news item */
  news?: Maybe<Scalars["String"]>;
  /** Whether the market is live to the public or not */
  live?: Maybe<Scalars["Boolean"]>;
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

export type MenuItems = {
  __typename?: "MenuItems";
  icon?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
  route?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  target?: Maybe<Scalars["String"]>;
  is_new?: Maybe<Scalars["String"]>;
  count?: Maybe<Scalars["Int"]>;
};

export type MenuItemsMobile = {
  __typename?: "MenuItemsMobile";
  icon?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
  route?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  target?: Maybe<Scalars["String"]>;
  is_new?: Maybe<Scalars["String"]>;
  count?: Maybe<Scalars["Int"]>;
};

/** An email and/or notification to be sent to a user */
export type Message = Node & {
  __typename?: "Message";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  recipient?: Maybe<Scalars["Int"]>;
  /** The datetime stamp for when the message was sent */
  senddate?: Maybe<Scalars["Datetime"]>;
  /** File attachment such as a PDF or a link to it */
  attachment?: Maybe<Scalars["String"]>;
  /** Whether the message still needs to be read or not. Applies only to notifications, not emails. */
  unread?: Maybe<Scalars["Boolean"]>;
  /** The body of the message */
  body?: Maybe<Scalars["String"]>;
};

/** A condition to be used against `Message` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MessageCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Message` */
export type MessageInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  recipient?: Maybe<Scalars["Int"]>;
  /** The datetime stamp for when the message was sent */
  senddate?: Maybe<Scalars["Datetime"]>;
  /** File attachment such as a PDF or a link to it */
  attachment?: Maybe<Scalars["String"]>;
  /** Whether the message still needs to be read or not. Applies only to notifications, not emails. */
  unread?: Maybe<Scalars["Boolean"]>;
  /** The body of the message */
  body?: Maybe<Scalars["String"]>;
};

/** Represents an update to a `Message`. Fields that are set will be updated. */
export type MessagePatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  recipient?: Maybe<Scalars["Int"]>;
  /** The datetime stamp for when the message was sent */
  senddate?: Maybe<Scalars["Datetime"]>;
  /** File attachment such as a PDF or a link to it */
  attachment?: Maybe<Scalars["String"]>;
  /** Whether the message still needs to be read or not. Applies only to notifications, not emails. */
  unread?: Maybe<Scalars["Boolean"]>;
  /** The body of the message */
  body?: Maybe<Scalars["String"]>;
};

/** A connection to a list of `Message` values. */
export type MessagesConnection = {
  __typename?: "MessagesConnection";
  /** A list of `Message` objects. */
  nodes: Array<Message>;
  /** A list of edges which contains the `Message` and cursor to aid in pagination. */
  edges: Array<MessagesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Message` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Message` edge in the connection. */
export type MessagesEdge = {
  __typename?: "MessagesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Message` at the end of the edge. */
  node: Message;
};

/** Methods to use when ordering `Message`. */
export enum MessagesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
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

export type MultidomainNodeData = {
  __typename?: "MultidomainNodeData";
  id?: Maybe<Scalars["Int"]>;
  iLeft?: Maybe<Scalars["Int"]>;
  iRight?: Maybe<Scalars["Int"]>;
  can_manage?: Maybe<Scalars["Boolean"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  /** Creates a single `Account`. */
  createAccount?: Maybe<CreateAccountPayload>;
  /** Creates a single `Address`. */
  createAddress?: Maybe<CreateAddressPayload>;
  /** Creates a single `Company`. */
  createCompany?: Maybe<CreateCompanyPayload>;
  /** Creates a single `CompanyDocument`. */
  createCompanyDocument?: Maybe<CreateCompanyDocumentPayload>;
  /** Creates a single `CompanyMember`. */
  createCompanyMember?: Maybe<CreateCompanyMemberPayload>;
  /** Creates a single `Companydocument`. */
  createCompanydocument?: Maybe<CreateCompanydocumentPayload>;
  /** Creates a single `Companymember`. */
  createCompanymember?: Maybe<CreateCompanymemberPayload>;
  /** Creates a single `Companymembership`. */
  createCompanymembership?: Maybe<CreateCompanymembershipPayload>;
  /** Creates a single `Contactdetail`. */
  createContactdetail?: Maybe<CreateContactdetailPayload>;
  /** Creates a single `EvidenceItem`. */
  createEvidenceItem?: Maybe<CreateEvidenceItemPayload>;
  /** Creates a single `Evidenceitem`. */
  createEvidenceitem?: Maybe<CreateEvidenceitemPayload>;
  /** Creates a single `Guarantee`. */
  createGuarantee?: Maybe<CreateGuaranteePayload>;
  /** Creates a single `GuaranteedProduct`. */
  createGuaranteedProduct?: Maybe<CreateGuaranteedProductPayload>;
  /** Creates a single `Guaranteedproduct`. */
  createGuaranteedproduct?: Maybe<CreateGuaranteedproductPayload>;
  /** Creates a single `Invitation`. */
  createInvitation?: Maybe<CreateInvitationPayload>;
  /** Creates a single `Market`. */
  createMarket?: Maybe<CreateMarketPayload>;
  /** Creates a single `Message`. */
  createMessage?: Maybe<CreateMessagePayload>;
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
  /** Creates a single `Projectmember`. */
  createProjectmember?: Maybe<CreateProjectmemberPayload>;
  /** Creates a single `System`. */
  createSystem?: Maybe<CreateSystemPayload>;
  /** Creates a single `SystemMember`. */
  createSystemMember?: Maybe<CreateSystemMemberPayload>;
  /** Creates a single `Systemmember`. */
  createSystemmember?: Maybe<CreateSystemmemberPayload>;
  /** Creates a single `TierOffset`. */
  createTierOffset?: Maybe<CreateTierOffsetPayload>;
  /** Updates a single `Account` using its globally unique id and a patch. */
  updateAccountByNodeId?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccount?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Address` using its globally unique id and a patch. */
  updateAddressByNodeId?: Maybe<UpdateAddressPayload>;
  /** Updates a single `Address` using a unique key and a patch. */
  updateAddress?: Maybe<UpdateAddressPayload>;
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
  /** Updates a single `Companydocument` using its globally unique id and a patch. */
  updateCompanydocumentByNodeId?: Maybe<UpdateCompanydocumentPayload>;
  /** Updates a single `Companydocument` using a unique key and a patch. */
  updateCompanydocument?: Maybe<UpdateCompanydocumentPayload>;
  /** Updates a single `Companymember` using its globally unique id and a patch. */
  updateCompanymemberByNodeId?: Maybe<UpdateCompanymemberPayload>;
  /** Updates a single `Companymember` using a unique key and a patch. */
  updateCompanymember?: Maybe<UpdateCompanymemberPayload>;
  /** Updates a single `Companymembership` using its globally unique id and a patch. */
  updateCompanymembershipByNodeId?: Maybe<UpdateCompanymembershipPayload>;
  /** Updates a single `Companymembership` using a unique key and a patch. */
  updateCompanymembership?: Maybe<UpdateCompanymembershipPayload>;
  /** Updates a single `Contactdetail` using its globally unique id and a patch. */
  updateContactdetailByNodeId?: Maybe<UpdateContactdetailPayload>;
  /** Updates a single `Contactdetail` using a unique key and a patch. */
  updateContactdetail?: Maybe<UpdateContactdetailPayload>;
  /** Updates a single `EvidenceItem` using its globally unique id and a patch. */
  updateEvidenceItemByNodeId?: Maybe<UpdateEvidenceItemPayload>;
  /** Updates a single `EvidenceItem` using a unique key and a patch. */
  updateEvidenceItem?: Maybe<UpdateEvidenceItemPayload>;
  /** Updates a single `Evidenceitem` using its globally unique id and a patch. */
  updateEvidenceitemByNodeId?: Maybe<UpdateEvidenceitemPayload>;
  /** Updates a single `Evidenceitem` using a unique key and a patch. */
  updateEvidenceitem?: Maybe<UpdateEvidenceitemPayload>;
  /** Updates a single `Guarantee` using its globally unique id and a patch. */
  updateGuaranteeByNodeId?: Maybe<UpdateGuaranteePayload>;
  /** Updates a single `Guarantee` using a unique key and a patch. */
  updateGuarantee?: Maybe<UpdateGuaranteePayload>;
  /** Updates a single `GuaranteedProduct` using its globally unique id and a patch. */
  updateGuaranteedProductByNodeId?: Maybe<UpdateGuaranteedProductPayload>;
  /** Updates a single `GuaranteedProduct` using a unique key and a patch. */
  updateGuaranteedProduct?: Maybe<UpdateGuaranteedProductPayload>;
  /** Updates a single `Guaranteedproduct` using its globally unique id and a patch. */
  updateGuaranteedproductByNodeId?: Maybe<UpdateGuaranteedproductPayload>;
  /** Updates a single `Guaranteedproduct` using a unique key and a patch. */
  updateGuaranteedproduct?: Maybe<UpdateGuaranteedproductPayload>;
  /** Updates a single `Invitation` using its globally unique id and a patch. */
  updateInvitationByNodeId?: Maybe<UpdateInvitationPayload>;
  /** Updates a single `Invitation` using a unique key and a patch. */
  updateInvitation?: Maybe<UpdateInvitationPayload>;
  /** Updates a single `Market` using its globally unique id and a patch. */
  updateMarketByNodeId?: Maybe<UpdateMarketPayload>;
  /** Updates a single `Market` using a unique key and a patch. */
  updateMarket?: Maybe<UpdateMarketPayload>;
  /** Updates a single `Message` using its globally unique id and a patch. */
  updateMessageByNodeId?: Maybe<UpdateMessagePayload>;
  /** Updates a single `Message` using a unique key and a patch. */
  updateMessage?: Maybe<UpdateMessagePayload>;
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
  /** Updates a single `Projectmember` using its globally unique id and a patch. */
  updateProjectmemberByNodeId?: Maybe<UpdateProjectmemberPayload>;
  /** Updates a single `Projectmember` using a unique key and a patch. */
  updateProjectmember?: Maybe<UpdateProjectmemberPayload>;
  /** Updates a single `System` using its globally unique id and a patch. */
  updateSystemByNodeId?: Maybe<UpdateSystemPayload>;
  /** Updates a single `System` using a unique key and a patch. */
  updateSystem?: Maybe<UpdateSystemPayload>;
  /** Updates a single `SystemMember` using its globally unique id and a patch. */
  updateSystemMemberByNodeId?: Maybe<UpdateSystemMemberPayload>;
  /** Updates a single `SystemMember` using a unique key and a patch. */
  updateSystemMember?: Maybe<UpdateSystemMemberPayload>;
  /** Updates a single `Systemmember` using its globally unique id and a patch. */
  updateSystemmemberByNodeId?: Maybe<UpdateSystemmemberPayload>;
  /** Updates a single `Systemmember` using a unique key and a patch. */
  updateSystemmember?: Maybe<UpdateSystemmemberPayload>;
  /** Updates a single `TierOffset` using its globally unique id and a patch. */
  updateTierOffsetByNodeId?: Maybe<UpdateTierOffsetPayload>;
  /** Updates a single `TierOffset` using a unique key and a patch. */
  updateTierOffset?: Maybe<UpdateTierOffsetPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccountByNodeId?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Address` using its globally unique id. */
  deleteAddressByNodeId?: Maybe<DeleteAddressPayload>;
  /** Deletes a single `Address` using a unique key. */
  deleteAddress?: Maybe<DeleteAddressPayload>;
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
  /** Deletes a single `Companydocument` using its globally unique id. */
  deleteCompanydocumentByNodeId?: Maybe<DeleteCompanydocumentPayload>;
  /** Deletes a single `Companydocument` using a unique key. */
  deleteCompanydocument?: Maybe<DeleteCompanydocumentPayload>;
  /** Deletes a single `Companymember` using its globally unique id. */
  deleteCompanymemberByNodeId?: Maybe<DeleteCompanymemberPayload>;
  /** Deletes a single `Companymember` using a unique key. */
  deleteCompanymember?: Maybe<DeleteCompanymemberPayload>;
  /** Deletes a single `Companymembership` using its globally unique id. */
  deleteCompanymembershipByNodeId?: Maybe<DeleteCompanymembershipPayload>;
  /** Deletes a single `Companymembership` using a unique key. */
  deleteCompanymembership?: Maybe<DeleteCompanymembershipPayload>;
  /** Deletes a single `Contactdetail` using its globally unique id. */
  deleteContactdetailByNodeId?: Maybe<DeleteContactdetailPayload>;
  /** Deletes a single `Contactdetail` using a unique key. */
  deleteContactdetail?: Maybe<DeleteContactdetailPayload>;
  /** Deletes a single `EvidenceItem` using its globally unique id. */
  deleteEvidenceItemByNodeId?: Maybe<DeleteEvidenceItemPayload>;
  /** Deletes a single `EvidenceItem` using a unique key. */
  deleteEvidenceItem?: Maybe<DeleteEvidenceItemPayload>;
  /** Deletes a single `Evidenceitem` using its globally unique id. */
  deleteEvidenceitemByNodeId?: Maybe<DeleteEvidenceitemPayload>;
  /** Deletes a single `Evidenceitem` using a unique key. */
  deleteEvidenceitem?: Maybe<DeleteEvidenceitemPayload>;
  /** Deletes a single `Guarantee` using its globally unique id. */
  deleteGuaranteeByNodeId?: Maybe<DeleteGuaranteePayload>;
  /** Deletes a single `Guarantee` using a unique key. */
  deleteGuarantee?: Maybe<DeleteGuaranteePayload>;
  /** Deletes a single `GuaranteedProduct` using its globally unique id. */
  deleteGuaranteedProductByNodeId?: Maybe<DeleteGuaranteedProductPayload>;
  /** Deletes a single `GuaranteedProduct` using a unique key. */
  deleteGuaranteedProduct?: Maybe<DeleteGuaranteedProductPayload>;
  /** Deletes a single `Guaranteedproduct` using its globally unique id. */
  deleteGuaranteedproductByNodeId?: Maybe<DeleteGuaranteedproductPayload>;
  /** Deletes a single `Guaranteedproduct` using a unique key. */
  deleteGuaranteedproduct?: Maybe<DeleteGuaranteedproductPayload>;
  /** Deletes a single `Invitation` using its globally unique id. */
  deleteInvitationByNodeId?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Invitation` using a unique key. */
  deleteInvitation?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Market` using its globally unique id. */
  deleteMarketByNodeId?: Maybe<DeleteMarketPayload>;
  /** Deletes a single `Market` using a unique key. */
  deleteMarket?: Maybe<DeleteMarketPayload>;
  /** Deletes a single `Message` using its globally unique id. */
  deleteMessageByNodeId?: Maybe<DeleteMessagePayload>;
  /** Deletes a single `Message` using a unique key. */
  deleteMessage?: Maybe<DeleteMessagePayload>;
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
  /** Deletes a single `Projectmember` using its globally unique id. */
  deleteProjectmemberByNodeId?: Maybe<DeleteProjectmemberPayload>;
  /** Deletes a single `Projectmember` using a unique key. */
  deleteProjectmember?: Maybe<DeleteProjectmemberPayload>;
  /** Deletes a single `System` using its globally unique id. */
  deleteSystemByNodeId?: Maybe<DeleteSystemPayload>;
  /** Deletes a single `System` using a unique key. */
  deleteSystem?: Maybe<DeleteSystemPayload>;
  /** Deletes a single `SystemMember` using its globally unique id. */
  deleteSystemMemberByNodeId?: Maybe<DeleteSystemMemberPayload>;
  /** Deletes a single `SystemMember` using a unique key. */
  deleteSystemMember?: Maybe<DeleteSystemMemberPayload>;
  /** Deletes a single `Systemmember` using its globally unique id. */
  deleteSystemmemberByNodeId?: Maybe<DeleteSystemmemberPayload>;
  /** Deletes a single `Systemmember` using a unique key. */
  deleteSystemmember?: Maybe<DeleteSystemmemberPayload>;
  /** Deletes a single `TierOffset` using its globally unique id. */
  deleteTierOffsetByNodeId?: Maybe<DeleteTierOffsetPayload>;
  /** Deletes a single `TierOffset` using a unique key. */
  deleteTierOffset?: Maybe<DeleteTierOffsetPayload>;
  publishMessage?: Maybe<Publish>;
  createUser?: Maybe<UserCreateResponse>;
  createSSOUrl?: Maybe<Scalars["String"]>;
  createGroup?: Maybe<GroupCreateResponse>;
};

export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};

export type MutationCreateAddressArgs = {
  input: CreateAddressInput;
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

export type MutationCreateCompanydocumentArgs = {
  input: CreateCompanydocumentInput;
};

export type MutationCreateCompanymemberArgs = {
  input: CreateCompanymemberInput;
};

export type MutationCreateCompanymembershipArgs = {
  input: CreateCompanymembershipInput;
};

export type MutationCreateContactdetailArgs = {
  input: CreateContactdetailInput;
};

export type MutationCreateEvidenceItemArgs = {
  input: CreateEvidenceItemInput;
};

export type MutationCreateEvidenceitemArgs = {
  input: CreateEvidenceitemInput;
};

export type MutationCreateGuaranteeArgs = {
  input: CreateGuaranteeInput;
};

export type MutationCreateGuaranteedProductArgs = {
  input: CreateGuaranteedProductInput;
};

export type MutationCreateGuaranteedproductArgs = {
  input: CreateGuaranteedproductInput;
};

export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
};

export type MutationCreateMarketArgs = {
  input: CreateMarketInput;
};

export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
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

export type MutationCreateProjectmemberArgs = {
  input: CreateProjectmemberInput;
};

export type MutationCreateSystemArgs = {
  input: CreateSystemInput;
};

export type MutationCreateSystemMemberArgs = {
  input: CreateSystemMemberInput;
};

export type MutationCreateSystemmemberArgs = {
  input: CreateSystemmemberInput;
};

export type MutationCreateTierOffsetArgs = {
  input: CreateTierOffsetInput;
};

export type MutationUpdateAccountByNodeIdArgs = {
  input: UpdateAccountByNodeIdInput;
};

export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};

export type MutationUpdateAddressByNodeIdArgs = {
  input: UpdateAddressByNodeIdInput;
};

export type MutationUpdateAddressArgs = {
  input: UpdateAddressInput;
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

export type MutationUpdateCompanydocumentByNodeIdArgs = {
  input: UpdateCompanydocumentByNodeIdInput;
};

export type MutationUpdateCompanydocumentArgs = {
  input: UpdateCompanydocumentInput;
};

export type MutationUpdateCompanymemberByNodeIdArgs = {
  input: UpdateCompanymemberByNodeIdInput;
};

export type MutationUpdateCompanymemberArgs = {
  input: UpdateCompanymemberInput;
};

export type MutationUpdateCompanymembershipByNodeIdArgs = {
  input: UpdateCompanymembershipByNodeIdInput;
};

export type MutationUpdateCompanymembershipArgs = {
  input: UpdateCompanymembershipInput;
};

export type MutationUpdateContactdetailByNodeIdArgs = {
  input: UpdateContactdetailByNodeIdInput;
};

export type MutationUpdateContactdetailArgs = {
  input: UpdateContactdetailInput;
};

export type MutationUpdateEvidenceItemByNodeIdArgs = {
  input: UpdateEvidenceItemByNodeIdInput;
};

export type MutationUpdateEvidenceItemArgs = {
  input: UpdateEvidenceItemInput;
};

export type MutationUpdateEvidenceitemByNodeIdArgs = {
  input: UpdateEvidenceitemByNodeIdInput;
};

export type MutationUpdateEvidenceitemArgs = {
  input: UpdateEvidenceitemInput;
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

export type MutationUpdateGuaranteedproductByNodeIdArgs = {
  input: UpdateGuaranteedproductByNodeIdInput;
};

export type MutationUpdateGuaranteedproductArgs = {
  input: UpdateGuaranteedproductInput;
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

export type MutationUpdateMessageByNodeIdArgs = {
  input: UpdateMessageByNodeIdInput;
};

export type MutationUpdateMessageArgs = {
  input: UpdateMessageInput;
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

export type MutationUpdateProjectmemberByNodeIdArgs = {
  input: UpdateProjectmemberByNodeIdInput;
};

export type MutationUpdateProjectmemberArgs = {
  input: UpdateProjectmemberInput;
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

export type MutationUpdateSystemmemberByNodeIdArgs = {
  input: UpdateSystemmemberByNodeIdInput;
};

export type MutationUpdateSystemmemberArgs = {
  input: UpdateSystemmemberInput;
};

export type MutationUpdateTierOffsetByNodeIdArgs = {
  input: UpdateTierOffsetByNodeIdInput;
};

export type MutationUpdateTierOffsetArgs = {
  input: UpdateTierOffsetInput;
};

export type MutationDeleteAccountByNodeIdArgs = {
  input: DeleteAccountByNodeIdInput;
};

export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};

export type MutationDeleteAddressByNodeIdArgs = {
  input: DeleteAddressByNodeIdInput;
};

export type MutationDeleteAddressArgs = {
  input: DeleteAddressInput;
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

export type MutationDeleteCompanydocumentByNodeIdArgs = {
  input: DeleteCompanydocumentByNodeIdInput;
};

export type MutationDeleteCompanydocumentArgs = {
  input: DeleteCompanydocumentInput;
};

export type MutationDeleteCompanymemberByNodeIdArgs = {
  input: DeleteCompanymemberByNodeIdInput;
};

export type MutationDeleteCompanymemberArgs = {
  input: DeleteCompanymemberInput;
};

export type MutationDeleteCompanymembershipByNodeIdArgs = {
  input: DeleteCompanymembershipByNodeIdInput;
};

export type MutationDeleteCompanymembershipArgs = {
  input: DeleteCompanymembershipInput;
};

export type MutationDeleteContactdetailByNodeIdArgs = {
  input: DeleteContactdetailByNodeIdInput;
};

export type MutationDeleteContactdetailArgs = {
  input: DeleteContactdetailInput;
};

export type MutationDeleteEvidenceItemByNodeIdArgs = {
  input: DeleteEvidenceItemByNodeIdInput;
};

export type MutationDeleteEvidenceItemArgs = {
  input: DeleteEvidenceItemInput;
};

export type MutationDeleteEvidenceitemByNodeIdArgs = {
  input: DeleteEvidenceitemByNodeIdInput;
};

export type MutationDeleteEvidenceitemArgs = {
  input: DeleteEvidenceitemInput;
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

export type MutationDeleteGuaranteedproductByNodeIdArgs = {
  input: DeleteGuaranteedproductByNodeIdInput;
};

export type MutationDeleteGuaranteedproductArgs = {
  input: DeleteGuaranteedproductInput;
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

export type MutationDeleteMessageByNodeIdArgs = {
  input: DeleteMessageByNodeIdInput;
};

export type MutationDeleteMessageArgs = {
  input: DeleteMessageInput;
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

export type MutationDeleteProjectmemberByNodeIdArgs = {
  input: DeleteProjectmemberByNodeIdInput;
};

export type MutationDeleteProjectmemberArgs = {
  input: DeleteProjectmemberInput;
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

export type MutationDeleteSystemmemberByNodeIdArgs = {
  input: DeleteSystemmemberByNodeIdInput;
};

export type MutationDeleteSystemmemberArgs = {
  input: DeleteSystemmemberInput;
};

export type MutationDeleteTierOffsetByNodeIdArgs = {
  input: DeleteTierOffsetByNodeIdInput;
};

export type MutationDeleteTierOffsetArgs = {
  input: DeleteTierOffsetInput;
};

export type MutationPublishMessageArgs = {
  input: PublishInput;
};

export type MutationCreateUserArgs = {
  userCreateInput?: Maybe<UserCreateInput>;
};

export type MutationCreateSsoUrlArgs = {
  username: Scalars["String"];
  path?: Maybe<Scalars["String"]>;
};

export type MutationCreateGroupArgs = {
  groupCreateInput?: Maybe<GroupCreateInput>;
};

export type Networks = {
  __typename?: "Networks";
  type?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
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
 * photographs of the roof are not clear enough. Could also be a note inserted into
 * an invite to join InTouch.
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

export type NotificationBalloon = {
  __typename?: "NotificationBalloon";
  title?: Maybe<Scalars["String"]>;
  content?: Maybe<Scalars["String"]>;
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

export type NotificationTooltip = {
  __typename?: "NotificationTooltip";
  type?: Maybe<Scalars["String"]>;
  icon?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
};

export type OauthClients = {
  __typename?: "OauthClients";
  client_id?: Maybe<Scalars["String"]>;
  client_name?: Maybe<Scalars["String"]>;
};

export type Outdated = {
  __typename?: "Outdated";
  total_users?: Maybe<Scalars["Int"]>;
  already_marked?: Maybe<Scalars["Boolean"]>;
};

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

export type PageQueryOptions = {
  paginate?: Maybe<PaginateOptions>;
};

export type PaginateOptions = {
  page?: Maybe<Scalars["Int"]>;
  page_size?: Maybe<Scalars["Int"]>;
};

export type Params = {
  __typename?: "Params";
  width?: Maybe<Scalars["Int"]>;
  height?: Maybe<Scalars["Int"]>;
  filesize?: Maybe<Scalars["Int"]>;
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

export type PartnerData = {
  __typename?: "PartnerData";
  id?: Maybe<Scalars["Int"]>;
  referral_id?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  logo?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  address?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
  discount?: Maybe<Scalars["String"]>;
  affiliate_code?: Maybe<Scalars["String"]>;
  enable_affiliate?: Maybe<Scalars["String"]>;
  catalog_visible?: Maybe<Scalars["String"]>;
  course_visible?: Maybe<Scalars["String"]>;
  active?: Maybe<Scalars["String"]>;
  updated_at?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  logo_full_path?: Maybe<Scalars["String"]>;
};

export type PluginMenu = {
  __typename?: "PluginMenu";
  label?: Maybe<Scalars["String"]>;
  items?: Maybe<Array<Maybe<Items>>>;
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
  /** The Products brand */
  brand?: Maybe<Scalars["String"]>;
  /** Short name for the product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the product is avialable or not */
  published?: Maybe<Scalars["Boolean"]>;
  /** The numbe of years that this product can be guaranteed for */
  validity?: Maybe<Scalars["Int"]>;
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
  /** The Products brand */
  brand?: Maybe<Scalars["String"]>;
  /** Short name for the product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the product is avialable or not */
  published?: Maybe<Scalars["Boolean"]>;
  /** The numbe of years that this product can be guaranteed for */
  validity?: Maybe<Scalars["Int"]>;
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
  /** The Products brand */
  brand?: Maybe<Scalars["String"]>;
  /** Short name for the product */
  name?: Maybe<Scalars["String"]>;
  /** A description of the product */
  description?: Maybe<Scalars["String"]>;
  /** The family of Products this Product is in */
  family?: Maybe<Scalars["String"]>;
  /** Whether the product is avialable or not */
  published?: Maybe<Scalars["Boolean"]>;
  /** The numbe of years that this product can be guaranteed for */
  validity?: Maybe<Scalars["Int"]>;
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
  /** fk */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: Maybe<Scalars["Int"]>;
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
  /** Reads a single `Address` that is related to this `Project`. */
  buildingOwnerAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
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
  /** Checks for equality with the object’s `buildingOwnerAddressId` field. */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `siteAddressId` field. */
  siteAddressId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `Project` */
export type ProjectInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  companyId?: Maybe<Scalars["Int"]>;
  /** fk */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: Maybe<Scalars["Int"]>;
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
export type Projectmember = Node & {
  __typename?: "Projectmember";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  project?: Maybe<Scalars["Int"]>;
  /** fk */
  member?: Maybe<Scalars["Int"]>;
  added?: Maybe<Scalars["String"]>;
  removed?: Maybe<Scalars["String"]>;
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
 * A condition to be used against `Projectmember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ProjectmemberCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
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

/** An input for mutations affecting `Projectmember` */
export type ProjectmemberInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  project?: Maybe<Scalars["Int"]>;
  /** fk */
  member?: Maybe<Scalars["Int"]>;
  added?: Maybe<Scalars["String"]>;
  removed?: Maybe<Scalars["String"]>;
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

/** Represents an update to a `Projectmember`. Fields that are set will be updated. */
export type ProjectmemberPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  project?: Maybe<Scalars["Int"]>;
  /** fk */
  member?: Maybe<Scalars["Int"]>;
  added?: Maybe<Scalars["String"]>;
  removed?: Maybe<Scalars["String"]>;
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

/** A connection to a list of `Projectmember` values. */
export type ProjectmembersConnection = {
  __typename?: "ProjectmembersConnection";
  /** A list of `Projectmember` objects. */
  nodes: Array<Projectmember>;
  /** A list of edges which contains the `Projectmember` and cursor to aid in pagination. */
  edges: Array<ProjectmembersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Projectmember` you could get from the connection. */
  totalCount: Scalars["Int"];
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

/** A `Projectmember` edge in the connection. */
export type ProjectmembersEdge = {
  __typename?: "ProjectmembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Projectmember` at the end of the edge. */
  node: Projectmember;
};

/** A `ProjectMember` edge in the connection. */
export type ProjectMembersEdge = {
  __typename?: "ProjectMembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `ProjectMember` at the end of the edge. */
  node: ProjectMember;
};

/** Methods to use when ordering `Projectmember`. */
export enum ProjectmembersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
  /** fk */
  buildingOwnerAddressId?: Maybe<Scalars["Int"]>;
  /** fk */
  siteAddressId?: Maybe<Scalars["Int"]>;
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
  BuildingOwnerAddressIdAsc = "BUILDING_OWNER_ADDRESS_ID_ASC",
  BuildingOwnerAddressIdDesc = "BUILDING_OWNER_ADDRESS_ID_DESC",
  SiteAddressIdAsc = "SITE_ADDRESS_ID_ASC",
  SiteAddressIdDesc = "SITE_ADDRESS_ID_DESC",
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

export type PuManageSubscriptionPermission = {
  __typename?: "PuManageSubscriptionPermission";
  can_create_bundle?: Maybe<Scalars["Boolean"]>;
};

export type PuManageUserPermissions = {
  __typename?: "PuManageUserPermissions";
  can_create?: Maybe<Scalars["Boolean"]>;
  can_view?: Maybe<Scalars["Boolean"]>;
  can_update?: Maybe<Scalars["Boolean"]>;
  can_delete?: Maybe<Scalars["Boolean"]>;
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
  /** Reads and enables pagination through a set of `Company`. */
  companies?: Maybe<CompaniesConnection>;
  /** Reads and enables pagination through a set of `CompanyDocument`. */
  companyDocuments?: Maybe<CompanyDocumentsConnection>;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers?: Maybe<CompanyMembersConnection>;
  /** Reads and enables pagination through a set of `Companydocument`. */
  companydocuments?: Maybe<CompanydocumentsConnection>;
  /** Reads and enables pagination through a set of `Companymember`. */
  companymembers?: Maybe<CompanymembersConnection>;
  /** Reads and enables pagination through a set of `Companymembership`. */
  companymemberships?: Maybe<CompanymembershipsConnection>;
  /** Reads and enables pagination through a set of `Contactdetail`. */
  contactdetails?: Maybe<ContactdetailsConnection>;
  /** Reads and enables pagination through a set of `EvidenceItem`. */
  evidenceItems?: Maybe<EvidenceItemsConnection>;
  /** Reads and enables pagination through a set of `Evidenceitem`. */
  evidenceitems?: Maybe<EvidenceitemsConnection>;
  /** Reads and enables pagination through a set of `Guarantee`. */
  guarantees?: Maybe<GuaranteesConnection>;
  /** Reads and enables pagination through a set of `GuaranteedProduct`. */
  guaranteedProducts?: Maybe<GuaranteedProductsConnection>;
  /** Reads and enables pagination through a set of `Guaranteedproduct`. */
  guaranteedproducts?: Maybe<GuaranteedproductsConnection>;
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations?: Maybe<InvitationsConnection>;
  /** Reads and enables pagination through a set of `Market`. */
  markets?: Maybe<MarketsConnection>;
  /** Reads and enables pagination through a set of `Message`. */
  messages?: Maybe<MessagesConnection>;
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
  /** Reads and enables pagination through a set of `Projectmember`. */
  projectmembers?: Maybe<ProjectmembersConnection>;
  /** Reads and enables pagination through a set of `System`. */
  systems?: Maybe<SystemsConnection>;
  /** Reads and enables pagination through a set of `SystemMember`. */
  systemMembers?: Maybe<SystemMembersConnection>;
  /** Reads and enables pagination through a set of `Systemmember`. */
  systemmembers?: Maybe<SystemmembersConnection>;
  /** Reads and enables pagination through a set of `TierOffset`. */
  tierOffsets?: Maybe<TierOffsetsConnection>;
  account?: Maybe<Account>;
  address?: Maybe<Address>;
  company?: Maybe<Company>;
  companyDocument?: Maybe<CompanyDocument>;
  companyMember?: Maybe<CompanyMember>;
  companydocument?: Maybe<Companydocument>;
  companymember?: Maybe<Companymember>;
  companymembership?: Maybe<Companymembership>;
  contactdetail?: Maybe<Contactdetail>;
  evidenceItem?: Maybe<EvidenceItem>;
  evidenceitem?: Maybe<Evidenceitem>;
  guarantee?: Maybe<Guarantee>;
  guaranteedProduct?: Maybe<GuaranteedProduct>;
  guaranteedproduct?: Maybe<Guaranteedproduct>;
  invitation?: Maybe<Invitation>;
  market?: Maybe<Market>;
  message?: Maybe<Message>;
  note?: Maybe<Note>;
  notification?: Maybe<Notification>;
  product?: Maybe<Product>;
  project?: Maybe<Project>;
  projectMember?: Maybe<ProjectMember>;
  projectmember?: Maybe<Projectmember>;
  system?: Maybe<System>;
  systemMember?: Maybe<SystemMember>;
  systemmember?: Maybe<Systemmember>;
  tierOffset?: Maybe<TierOffset>;
  currentAccount?: Maybe<Scalars["Int"]>;
  currentCompany?: Maybe<Scalars["Int"]>;
  currentMarket?: Maybe<Scalars["Int"]>;
  isPartOfProject?: Maybe<IsPartOfProjectConnection>;
  isProjectEnabled?: Maybe<Scalars["Boolean"]>;
  /** Reads a single `Account` using its globally unique `ID`. */
  accountByNodeId?: Maybe<Account>;
  /** Reads a single `Address` using its globally unique `ID`. */
  addressByNodeId?: Maybe<Address>;
  /** Reads a single `Company` using its globally unique `ID`. */
  companyByNodeId?: Maybe<Company>;
  /** Reads a single `CompanyDocument` using its globally unique `ID`. */
  companyDocumentByNodeId?: Maybe<CompanyDocument>;
  /** Reads a single `CompanyMember` using its globally unique `ID`. */
  companyMemberByNodeId?: Maybe<CompanyMember>;
  /** Reads a single `Companydocument` using its globally unique `ID`. */
  companydocumentByNodeId?: Maybe<Companydocument>;
  /** Reads a single `Companymember` using its globally unique `ID`. */
  companymemberByNodeId?: Maybe<Companymember>;
  /** Reads a single `Companymembership` using its globally unique `ID`. */
  companymembershipByNodeId?: Maybe<Companymembership>;
  /** Reads a single `Contactdetail` using its globally unique `ID`. */
  contactdetailByNodeId?: Maybe<Contactdetail>;
  /** Reads a single `EvidenceItem` using its globally unique `ID`. */
  evidenceItemByNodeId?: Maybe<EvidenceItem>;
  /** Reads a single `Evidenceitem` using its globally unique `ID`. */
  evidenceitemByNodeId?: Maybe<Evidenceitem>;
  /** Reads a single `Guarantee` using its globally unique `ID`. */
  guaranteeByNodeId?: Maybe<Guarantee>;
  /** Reads a single `GuaranteedProduct` using its globally unique `ID`. */
  guaranteedProductByNodeId?: Maybe<GuaranteedProduct>;
  /** Reads a single `Guaranteedproduct` using its globally unique `ID`. */
  guaranteedproductByNodeId?: Maybe<Guaranteedproduct>;
  /** Reads a single `Invitation` using its globally unique `ID`. */
  invitationByNodeId?: Maybe<Invitation>;
  /** Reads a single `Market` using its globally unique `ID`. */
  marketByNodeId?: Maybe<Market>;
  /** Reads a single `Message` using its globally unique `ID`. */
  messageByNodeId?: Maybe<Message>;
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
  /** Reads a single `Projectmember` using its globally unique `ID`. */
  projectmemberByNodeId?: Maybe<Projectmember>;
  /** Reads a single `System` using its globally unique `ID`. */
  systemByNodeId?: Maybe<System>;
  /** Reads a single `SystemMember` using its globally unique `ID`. */
  systemMemberByNodeId?: Maybe<SystemMember>;
  /** Reads a single `Systemmember` using its globally unique `ID`. */
  systemmemberByNodeId?: Maybe<Systemmember>;
  /** Reads a single `TierOffset` using its globally unique `ID`. */
  tierOffsetByNodeId?: Maybe<TierOffset>;
  checkUserValidatiy?: Maybe<UserValidatiy>;
  token?: Maybe<TokenInfo>;
  tokenByJwtPayload?: Maybe<TokenInfo>;
  session?: Maybe<Session>;
  course?: Maybe<Course>;
  courses?: Maybe<CoursesData>;
  branches?: Maybe<BranchType>;
  training?: Maybe<TrainingInfo>;
  certifications?: Maybe<CertificationData>;
  catalogues?: Maybe<CatalogueData>;
  categories?: Maybe<CategoryType>;
  enrollmentsReport?: Maybe<EnrollmentReportData>;
  certificationsReport?: Maybe<CertificationReportData>;
  asset?: Maybe<Asset>;
  assetCollection?: Maybe<AssetCollection>;
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
  guaranteeTemplate?: Maybe<GuaranteeTemplate>;
  guaranteeTemplateCollection?: Maybe<GuaranteeTemplateCollection>;
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

export type QueryCompanydocumentsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanydocumentsOrderBy>>;
  condition?: Maybe<CompanydocumentCondition>;
};

export type QueryCompanymembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanymembersOrderBy>>;
  condition?: Maybe<CompanymemberCondition>;
};

export type QueryCompanymembershipsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<CompanymembershipsOrderBy>>;
  condition?: Maybe<CompanymembershipCondition>;
};

export type QueryContactdetailsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ContactdetailsOrderBy>>;
  condition?: Maybe<ContactdetailCondition>;
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

export type QueryEvidenceitemsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<EvidenceitemsOrderBy>>;
  condition?: Maybe<EvidenceitemCondition>;
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

export type QueryGuaranteedproductsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GuaranteedproductsOrderBy>>;
  condition?: Maybe<GuaranteedproductCondition>;
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

export type QueryMessagesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<MessagesOrderBy>>;
  condition?: Maybe<MessageCondition>;
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

export type QueryProjectmembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<ProjectmembersOrderBy>>;
  condition?: Maybe<ProjectmemberCondition>;
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

export type QuerySystemmembersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<SystemmembersOrderBy>>;
  condition?: Maybe<SystemmemberCondition>;
};

export type QueryTierOffsetsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<TierOffsetsOrderBy>>;
  condition?: Maybe<TierOffsetCondition>;
};

export type QueryAccountArgs = {
  id: Scalars["Int"];
};

export type QueryAddressArgs = {
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

export type QueryCompanydocumentArgs = {
  id: Scalars["Int"];
};

export type QueryCompanymemberArgs = {
  id: Scalars["Int"];
};

export type QueryCompanymembershipArgs = {
  id: Scalars["Int"];
};

export type QueryContactdetailArgs = {
  id: Scalars["Int"];
};

export type QueryEvidenceItemArgs = {
  id: Scalars["Int"];
};

export type QueryEvidenceitemArgs = {
  id: Scalars["Int"];
};

export type QueryGuaranteeArgs = {
  id: Scalars["Int"];
};

export type QueryGuaranteedProductArgs = {
  id: Scalars["Int"];
};

export type QueryGuaranteedproductArgs = {
  id: Scalars["Int"];
};

export type QueryInvitationArgs = {
  id: Scalars["Int"];
};

export type QueryMarketArgs = {
  id: Scalars["Int"];
};

export type QueryMessageArgs = {
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

export type QueryProjectmemberArgs = {
  id: Scalars["Int"];
};

export type QuerySystemArgs = {
  id: Scalars["Int"];
};

export type QuerySystemMemberArgs = {
  id: Scalars["Int"];
};

export type QuerySystemmemberArgs = {
  id: Scalars["Int"];
};

export type QueryTierOffsetArgs = {
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

export type QueryCompanyByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanyDocumentByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanyMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanydocumentByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanymemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCompanymembershipByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryContactdetailByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryEvidenceItemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryEvidenceitemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryGuaranteeByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryGuaranteedProductByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryGuaranteedproductByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryInvitationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryMarketByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryMessageByNodeIdArgs = {
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

export type QueryProjectmemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QuerySystemByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QuerySystemMemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QuerySystemmemberByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryTierOffsetByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

export type QueryCheckUserValidatiyArgs = {
  username?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type QueryTokenByJwtPayloadArgs = {
  username: Scalars["String"];
};

export type QueryCourseArgs = {
  id: Scalars["Int"];
};

export type QueryCoursesArgs = {
  options?: Maybe<PageQueryOptions>;
};

export type QueryBranchesArgs = {
  options?: Maybe<PageQueryOptions>;
};

export type QueryCertificationsArgs = {
  options?: Maybe<PageQueryOptions>;
};

export type QueryCataloguesArgs = {
  options?: Maybe<PageQueryOptions>;
};

export type QueryCategoriesArgs = {
  options?: Maybe<PageQueryOptions>;
};

export type QueryEnrollmentsReportArgs = {
  branchId: Scalars["Int"];
  options?: Maybe<PageQueryOptions>;
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

export type RulesList = {
  condition_value?: Maybe<Scalars["String"]>;
  condition_type?: Maybe<Scalars["String"]>;
  id_field_common?: Maybe<Scalars["Int"]>;
};

export type SelectOrgchart = {
  branch_id?: Maybe<Scalars["String"]>;
};

export type Self = {
  __typename?: "Self";
  href?: Maybe<Scalars["String"]>;
};

export type SelfUnenrollmentSettings = {
  __typename?: "SelfUnenrollmentSettings";
  self_unenrollment_settings?: Maybe<Scalars["Boolean"]>;
  allow_self_unenrollment_from_session?: Maybe<Scalars["Boolean"]>;
  allow_self_unenrollment_from_completed_course?: Maybe<Scalars["Boolean"]>;
  allow_change_session?: Maybe<Scalars["Boolean"]>;
};

export type Session = {
  __typename?: "Session";
  id?: Maybe<Scalars["Int"]>;
  username?: Maybe<Scalars["String"]>;
  firstname?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  user_level?: Maybe<Scalars["String"]>;
  language?: Maybe<Scalars["String"]>;
  dateformat_locale?: Maybe<Scalars["String"]>;
  timezone?: Maybe<Scalars["String"]>;
  avatar_url?: Maybe<Scalars["String"]>;
  has_unfilled_fields?: Maybe<Scalars["Boolean"]>;
  multidomain_id?: Maybe<Scalars["Int"]>;
  home_route?: Maybe<Scalars["String"]>;
  no_suggestion_modals?: Maybe<Scalars["Boolean"]>;
  force_change?: Maybe<Scalars["Boolean"]>;
  is_non_whitelabeled_user?: Maybe<Scalars["Boolean"]>;
  switched_to_new_pages?: Maybe<Scalars["Boolean"]>;
  lms_pages_enable_date?: Maybe<Scalars["String"]>;
  lms_pages_switcher_show?: Maybe<Scalars["String"]>;
  redirect_on_logout?: Maybe<Scalars["Boolean"]>;
  is_erp_admin?: Maybe<Scalars["Boolean"]>;
  need_policy_accept?: Maybe<Scalars["Boolean"]>;
  need_terms_and_conditions_accept?: Maybe<Scalars["Boolean"]>;
  is_instructor?: Maybe<Scalars["Boolean"]>;
  cant_have_direct_manager?: Maybe<Scalars["Boolean"]>;
  is_aoi_profiled?: Maybe<Scalars["Boolean"]>;
  active_languages?: Maybe<Array<Maybe<ActiveLanguages>>>;
  currency_settings?: Maybe<CurrencySettings>;
  catalog_settings?: Maybe<CatalogSettings>;
  branding?: Maybe<Branding>;
  admin_menu_items?: Maybe<AdminMenuItems>;
  menu_items_mobile?: Maybe<Array<Maybe<MenuItemsMobile>>>;
  skills?: Maybe<Skills>;
  menu_items?: Maybe<Array<Maybe<MenuItems>>>;
  available_multidomains?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  multidomain_node_data?: Maybe<MultidomainNodeData>;
};

export type Signin = {
  __typename?: "Signin";
  background_type?: Maybe<Scalars["String"]>;
  background_value?: Maybe<Scalars["String"]>;
  background_fallback_image?: Maybe<Scalars["String"]>;
};

export type Skills = {
  __typename?: "Skills";
  admin_welcome_dialog_enabled?: Maybe<Scalars["Boolean"]>;
  user_welcome_dialog_enabled?: Maybe<Scalars["Boolean"]>;
};

export type SocialSettings = {
  __typename?: "SocialSettings";
  networks?: Maybe<Array<Maybe<Networks>>>;
};

export type Sort = {
  __typename?: "Sort";
  sort_attr?: Maybe<Scalars["String"]>;
  sort_dir?: Maybe<Scalars["String"]>;
};

export type SsoUrl = {
  __typename?: "SSOUrl";
  link?: Maybe<Scalars["String"]>;
};

export type Styles = {
  __typename?: "Styles";
  custom_css?: Maybe<Scalars["String"]>;
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
  /** Short name for the System */
  name?: Maybe<Scalars["String"]>;
  /** A description for the System */
  description?: Maybe<Scalars["String"]>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidity?: Maybe<Scalars["Int"]>;
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
  /** Short name for the System */
  name?: Maybe<Scalars["String"]>;
  /** A description for the System */
  description?: Maybe<Scalars["String"]>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidity?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A system product pair */
export type Systemmember = Node & {
  __typename?: "Systemmember";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  system?: Maybe<Scalars["Int"]>;
  /** fk */
  product?: Maybe<Scalars["Int"]>;
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
 * A condition to be used against `Systemmember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SystemmemberCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
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

/** An input for mutations affecting `Systemmember` */
export type SystemmemberInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  system?: Maybe<Scalars["Int"]>;
  /** fk */
  product?: Maybe<Scalars["Int"]>;
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

/** Represents an update to a `Systemmember`. Fields that are set will be updated. */
export type SystemmemberPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  system?: Maybe<Scalars["Int"]>;
  /** fk */
  product?: Maybe<Scalars["Int"]>;
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

/** A connection to a list of `Systemmember` values. */
export type SystemmembersConnection = {
  __typename?: "SystemmembersConnection";
  /** A list of `Systemmember` objects. */
  nodes: Array<Systemmember>;
  /** A list of edges which contains the `Systemmember` and cursor to aid in pagination. */
  edges: Array<SystemmembersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Systemmember` you could get from the connection. */
  totalCount: Scalars["Int"];
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

/** A `Systemmember` edge in the connection. */
export type SystemmembersEdge = {
  __typename?: "SystemmembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Systemmember` at the end of the edge. */
  node: Systemmember;
};

/** A `SystemMember` edge in the connection. */
export type SystemMembersEdge = {
  __typename?: "SystemMembersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `SystemMember` at the end of the edge. */
  node: SystemMember;
};

/** Methods to use when ordering `Systemmember`. */
export enum SystemmembersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
  /** Short name for the System */
  name?: Maybe<Scalars["String"]>;
  /** A description for the System */
  description?: Maybe<Scalars["String"]>;
  /** The maximum number of years that this system can be guaranteed for.  Must be greater than 10. */
  maximumValidity?: Maybe<Scalars["Int"]>;
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

/**
 * A value needed, if present, to calculate the validity of a guarantee for a
 * particular tier.  In some Tiers, the guarantee validity will be reduced, which
 * is what we mean by offset, by more than others, so that the more premium Tier
 * members have the benefit of longer guarantees.
 */
export type TierOffset = Node & {
  __typename?: "TierOffset";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  /** Primary key */
  id: Scalars["Int"];
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  tier?: Maybe<Tier>;
  /** The number of years to reduce guarantee validities by in this Tier for this Market.  Must be 10 or less than 10. */
  validityOffset?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Datetime"];
  updatedAt: Scalars["Datetime"];
  /** Reads a single `Market` that is related to this `TierOffset`. */
  market?: Maybe<Market>;
};

/**
 * A condition to be used against `TierOffset` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TierOffsetCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["Int"]>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId?: Maybe<Scalars["Int"]>;
};

/** An input for mutations affecting `TierOffset` */
export type TierOffsetInput = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  tier?: Maybe<Tier>;
  /** The number of years to reduce guarantee validities by in this Tier for this Market.  Must be 10 or less than 10. */
  validityOffset?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** Represents an update to a `TierOffset`. Fields that are set will be updated. */
export type TierOffsetPatch = {
  /** Primary key */
  id?: Maybe<Scalars["Int"]>;
  /** fk */
  marketId?: Maybe<Scalars["Int"]>;
  /** ek */
  tier?: Maybe<Tier>;
  /** The number of years to reduce guarantee validities by in this Tier for this Market.  Must be 10 or less than 10. */
  validityOffset?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Datetime"]>;
  updatedAt?: Maybe<Scalars["Datetime"]>;
};

/** A connection to a list of `TierOffset` values. */
export type TierOffsetsConnection = {
  __typename?: "TierOffsetsConnection";
  /** A list of `TierOffset` objects. */
  nodes: Array<TierOffset>;
  /** A list of edges which contains the `TierOffset` and cursor to aid in pagination. */
  edges: Array<TierOffsetsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TierOffset` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `TierOffset` edge in the connection. */
export type TierOffsetsEdge = {
  __typename?: "TierOffsetsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `TierOffset` at the end of the edge. */
  node: TierOffset;
};

/** Methods to use when ordering `TierOffset`. */
export enum TierOffsetsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  MarketIdAsc = "MARKET_ID_ASC",
  MarketIdDesc = "MARKET_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export type TokenInfo = {
  __typename?: "TokenInfo";
  access_token?: Maybe<Scalars["String"]>;
  expires_in?: Maybe<Scalars["Int"]>;
  token_type?: Maybe<Scalars["String"]>;
  scope?: Maybe<Scalars["String"]>;
  refresh_token: Scalars["String"];
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

export type TrainingInfo = {
  __typename?: "TrainingInfo";
  name?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  user?: Maybe<TrainingUser>;
};

export type TrainingUser = {
  __typename?: "TrainingUser";
  id?: Maybe<Scalars["Int"]>;
  username?: Maybe<Scalars["String"]>;
  firstname?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  user_level?: Maybe<Scalars["String"]>;
  userInfo?: Maybe<UserInfo>;
  enrollment?: Maybe<Enrollment>;
};

export type TrainingUserEnrollmentArgs = {
  options?: Maybe<PageQueryOptions>;
};

export type Tree = {
  __typename?: "Tree";
  id?: Maybe<Scalars["String"]>;
  resource_id?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  id_scorm_item?: Maybe<Scalars["String"]>;
  id_aicc_item?: Maybe<Scalars["String"]>;
  slug_name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  thumbnail?: Maybe<Scalars["String"]>;
  duration?: Maybe<Scalars["Int"]>;
  status?: Maybe<Scalars["String"]>;
  locked?: Maybe<Scalars["String"]>;
  is_folder?: Maybe<Scalars["Boolean"]>;
  short_description?: Maybe<Scalars["String"]>;
  mobile_unsupported?: Maybe<Scalars["Boolean"]>;
  params?: Maybe<Scalars["String"]>;
  params_inherited?: Maybe<Scalars["String"]>;
  is_end_object?: Maybe<Scalars["Boolean"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
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
  /** Reads a single `Account` that is related to this `Account`. */
  accountByCreatedBy?: Maybe<Account>;
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

/** All input for the `updateCompanydocumentByNodeId` mutation. */
export type UpdateCompanydocumentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Companydocument` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Companydocument` being updated. */
  patch: CompanydocumentPatch;
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

/** All input for the `updateCompanydocument` mutation. */
export type UpdateCompanydocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Companydocument` being updated. */
  patch: CompanydocumentPatch;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our update `Companydocument` mutation. */
export type UpdateCompanydocumentPayload = {
  __typename?: "UpdateCompanydocumentPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companydocument` that was updated by this mutation. */
  companydocument?: Maybe<Companydocument>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companydocument`. May be used by Relay 1. */
  companydocumentEdge?: Maybe<CompanydocumentsEdge>;
};

/** The output of our update `Companydocument` mutation. */
export type UpdateCompanydocumentPayloadCompanydocumentEdgeArgs = {
  orderBy?: Maybe<Array<CompanydocumentsOrderBy>>;
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

/** All input for the `updateCompanymemberByNodeId` mutation. */
export type UpdateCompanymemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Companymember` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Companymember` being updated. */
  patch: CompanymemberPatch;
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

/** All input for the `updateCompanymember` mutation. */
export type UpdateCompanymemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Companymember` being updated. */
  patch: CompanymemberPatch;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our update `Companymember` mutation. */
export type UpdateCompanymemberPayload = {
  __typename?: "UpdateCompanymemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companymember` that was updated by this mutation. */
  companymember?: Maybe<Companymember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companymember`. May be used by Relay 1. */
  companymemberEdge?: Maybe<CompanymembersEdge>;
};

/** The output of our update `Companymember` mutation. */
export type UpdateCompanymemberPayloadCompanymemberEdgeArgs = {
  orderBy?: Maybe<Array<CompanymembersOrderBy>>;
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

/** All input for the `updateCompanymembershipByNodeId` mutation. */
export type UpdateCompanymembershipByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Companymembership` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Companymembership` being updated. */
  patch: CompanymembershipPatch;
};

/** All input for the `updateCompanymembership` mutation. */
export type UpdateCompanymembershipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Companymembership` being updated. */
  patch: CompanymembershipPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Companymembership` mutation. */
export type UpdateCompanymembershipPayload = {
  __typename?: "UpdateCompanymembershipPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Companymembership` that was updated by this mutation. */
  companymembership?: Maybe<Companymembership>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Companymembership`. May be used by Relay 1. */
  companymembershipEdge?: Maybe<CompanymembershipsEdge>;
};

/** The output of our update `Companymembership` mutation. */
export type UpdateCompanymembershipPayloadCompanymembershipEdgeArgs = {
  orderBy?: Maybe<Array<CompanymembershipsOrderBy>>;
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

/** All input for the `updateContactdetailByNodeId` mutation. */
export type UpdateContactdetailByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Contactdetail` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Contactdetail` being updated. */
  patch: ContactdetailPatch;
};

/** All input for the `updateContactdetail` mutation. */
export type UpdateContactdetailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Contactdetail` being updated. */
  patch: ContactdetailPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Contactdetail` mutation. */
export type UpdateContactdetailPayload = {
  __typename?: "UpdateContactdetailPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Contactdetail` that was updated by this mutation. */
  contactdetail?: Maybe<Contactdetail>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Contactdetail`. May be used by Relay 1. */
  contactdetailEdge?: Maybe<ContactdetailsEdge>;
};

/** The output of our update `Contactdetail` mutation. */
export type UpdateContactdetailPayloadContactdetailEdgeArgs = {
  orderBy?: Maybe<Array<ContactdetailsOrderBy>>;
};

/** All input for the `updateEvidenceitemByNodeId` mutation. */
export type UpdateEvidenceitemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Evidenceitem` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Evidenceitem` being updated. */
  patch: EvidenceitemPatch;
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

/** All input for the `updateEvidenceitem` mutation. */
export type UpdateEvidenceitemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Evidenceitem` being updated. */
  patch: EvidenceitemPatch;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our update `Evidenceitem` mutation. */
export type UpdateEvidenceitemPayload = {
  __typename?: "UpdateEvidenceitemPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Evidenceitem` that was updated by this mutation. */
  evidenceitem?: Maybe<Evidenceitem>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Evidenceitem`. May be used by Relay 1. */
  evidenceitemEdge?: Maybe<EvidenceitemsEdge>;
};

/** The output of our update `Evidenceitem` mutation. */
export type UpdateEvidenceitemPayloadEvidenceitemEdgeArgs = {
  orderBy?: Maybe<Array<EvidenceitemsOrderBy>>;
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

/** All input for the `updateGuaranteedproductByNodeId` mutation. */
export type UpdateGuaranteedproductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Guaranteedproduct` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Guaranteedproduct` being updated. */
  patch: GuaranteedproductPatch;
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

/** All input for the `updateGuaranteedproduct` mutation. */
export type UpdateGuaranteedproductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Guaranteedproduct` being updated. */
  patch: GuaranteedproductPatch;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our update `Guaranteedproduct` mutation. */
export type UpdateGuaranteedproductPayload = {
  __typename?: "UpdateGuaranteedproductPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Guaranteedproduct` that was updated by this mutation. */
  guaranteedproduct?: Maybe<Guaranteedproduct>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Guaranteedproduct`. May be used by Relay 1. */
  guaranteedproductEdge?: Maybe<GuaranteedproductsEdge>;
};

/** The output of our update `Guaranteedproduct` mutation. */
export type UpdateGuaranteedproductPayloadGuaranteedproductEdgeArgs = {
  orderBy?: Maybe<Array<GuaranteedproductsOrderBy>>;
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
  account?: Maybe<Account>;
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

/** All input for the `updateMessageByNodeId` mutation. */
export type UpdateMessageByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Message` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Message` being updated. */
  patch: MessagePatch;
};

/** All input for the `updateMessage` mutation. */
export type UpdateMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Message` being updated. */
  patch: MessagePatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `Message` mutation. */
export type UpdateMessagePayload = {
  __typename?: "UpdateMessagePayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Message` that was updated by this mutation. */
  message?: Maybe<Message>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessagesEdge>;
};

/** The output of our update `Message` mutation. */
export type UpdateMessagePayloadMessageEdgeArgs = {
  orderBy?: Maybe<Array<MessagesOrderBy>>;
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

/** All input for the `updateProjectmemberByNodeId` mutation. */
export type UpdateProjectmemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Projectmember` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Projectmember` being updated. */
  patch: ProjectmemberPatch;
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

/** All input for the `updateProjectmember` mutation. */
export type UpdateProjectmemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Projectmember` being updated. */
  patch: ProjectmemberPatch;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our update `Projectmember` mutation. */
export type UpdateProjectmemberPayload = {
  __typename?: "UpdateProjectmemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Projectmember` that was updated by this mutation. */
  projectmember?: Maybe<Projectmember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Projectmember`. May be used by Relay 1. */
  projectmemberEdge?: Maybe<ProjectmembersEdge>;
};

/** The output of our update `Projectmember` mutation. */
export type UpdateProjectmemberPayloadProjectmemberEdgeArgs = {
  orderBy?: Maybe<Array<ProjectmembersOrderBy>>;
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
  buildingOwnerAddress?: Maybe<Address>;
  /** Reads a single `Address` that is related to this `Project`. */
  siteAddress?: Maybe<Address>;
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

/** All input for the `updateSystemmemberByNodeId` mutation. */
export type UpdateSystemmemberByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Systemmember` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Systemmember` being updated. */
  patch: SystemmemberPatch;
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

/** All input for the `updateSystemmember` mutation. */
export type UpdateSystemmemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Systemmember` being updated. */
  patch: SystemmemberPatch;
  /** Primary key */
  id: Scalars["Int"];
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

/** The output of our update `Systemmember` mutation. */
export type UpdateSystemmemberPayload = {
  __typename?: "UpdateSystemmemberPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Systemmember` that was updated by this mutation. */
  systemmember?: Maybe<Systemmember>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Systemmember`. May be used by Relay 1. */
  systemmemberEdge?: Maybe<SystemmembersEdge>;
};

/** The output of our update `Systemmember` mutation. */
export type UpdateSystemmemberPayloadSystemmemberEdgeArgs = {
  orderBy?: Maybe<Array<SystemmembersOrderBy>>;
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

/** All input for the `updateTierOffsetByNodeId` mutation. */
export type UpdateTierOffsetByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `TierOffset` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `TierOffset` being updated. */
  patch: TierOffsetPatch;
};

/** All input for the `updateTierOffset` mutation. */
export type UpdateTierOffsetInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `TierOffset` being updated. */
  patch: TierOffsetPatch;
  /** Primary key */
  id: Scalars["Int"];
};

/** The output of our update `TierOffset` mutation. */
export type UpdateTierOffsetPayload = {
  __typename?: "UpdateTierOffsetPayload";
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `TierOffset` that was updated by this mutation. */
  tierOffset?: Maybe<TierOffset>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Market` that is related to this `TierOffset`. */
  market?: Maybe<Market>;
  /** An edge for our `TierOffset`. May be used by Relay 1. */
  tierOffsetEdge?: Maybe<TierOffsetsEdge>;
};

/** The output of our update `TierOffset` mutation. */
export type UpdateTierOffsetPayloadTierOffsetEdgeArgs = {
  orderBy?: Maybe<Array<TierOffsetsOrderBy>>;
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
  message?: Maybe<Array<Maybe<UserMessage>>>;
};

export type UserData = {
  __typename?: "UserData";
  user_id?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  first_name?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  uuid?: Maybe<Scalars["String"]>;
  lang_code?: Maybe<Scalars["String"]>;
  force_change?: Maybe<Scalars["String"]>;
  expiration?: Maybe<Scalars["String"]>;
  email_validation_status?: Maybe<Scalars["String"]>;
  valid?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  can_manage_subordinates?: Maybe<Scalars["Boolean"]>;
  is_saml_provision?: Maybe<Scalars["String"]>;
  language?: Maybe<Scalars["String"]>;
  level?: Maybe<Scalars["String"]>;
  date_format?: Maybe<Scalars["String"]>;
  timezone?: Maybe<Scalars["String"]>;
  manager_first_name?: Maybe<Scalars["String"]>;
  manager_last_name?: Maybe<Scalars["String"]>;
  manager_username?: Maybe<Scalars["String"]>;
  manager_id?: Maybe<Scalars["String"]>;
  role_id?: Maybe<Scalars["String"]>;
  role_title?: Maybe<Scalars["String"]>;
  role?: Maybe<Scalars["String"]>;
  cant_have_direct_manager?: Maybe<Scalars["Boolean"]>;
  subordinates?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type UserInfo = {
  __typename?: "UserInfo";
  saml_settings?: Maybe<Array<Maybe<Scalars["String"]>>>;
  branches?: Maybe<Array<Maybe<Branches>>>;
  additional_fields?: Maybe<Array<Maybe<AdditionalFields>>>;
  user_data?: Maybe<UserData>;
};

export type UserMessage = {
  __typename?: "UserMessage";
  id?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
};

export type UserValidatiy = {
  __typename?: "UserValidatiy";
  success?: Maybe<Scalars["Boolean"]>;
};

export type WhiteLabel = {
  __typename?: "WhiteLabel";
  whitelabel_naming?: Maybe<Scalars["Int"]>;
  whitelabel_disable_naming?: Maybe<Scalars["Int"]>;
  whitelabel_naming_text?: Maybe<Scalars["String"]>;
  whitelabel_naming_site_enable?: Maybe<Scalars["Int"]>;
  whitelabel_naming_site?: Maybe<Scalars["String"]>;
  whitelabel_menu_userid?: Maybe<Scalars["Int"]>;
};
