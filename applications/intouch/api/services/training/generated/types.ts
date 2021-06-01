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
export enum CourseCatalogueTempsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
export enum CourseEnrollmentTempsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
export enum CourseSyncConfigurationsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  ConfigNameAsc = "CONFIG_NAME_ASC",
  ConfigNameDesc = "CONFIG_NAME_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

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
export type CreateCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs = {
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
export type DeleteCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs = {
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

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: "Mutation";
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
  /** Updates a single `CourseSyncConfiguration` using a unique key and a patch. */
  updateCourseSyncConfigurationByConfigName?: Maybe<UpdateCourseSyncConfigurationPayload>;
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
  /** Deletes a single `CourseSyncConfiguration` using a unique key. */
  deleteCourseSyncConfigurationByConfigName?: Maybe<DeleteCourseSyncConfigurationPayload>;
  /** Deletes a single `CourseTemp` using its globally unique id. */
  deleteCourseTempByNodeId?: Maybe<DeleteCourseTempPayload>;
  /** Deletes a single `CourseTemp` using a unique key. */
  deleteCourseTemp?: Maybe<DeleteCourseTempPayload>;
  createSSOUrl?: Maybe<SsoUrlOutput>;
  updateTraining?: Maybe<Scalars["String"]>;
  createDoceboUser?: Maybe<UserCreateResponse>;
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
export type MutationUpdateCourseByNodeIdArgs = {
  input: UpdateCourseByNodeIdInput;
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
export type MutationUpdateCourseCatalogueByNodeIdArgs = {
  input: UpdateCourseCatalogueByNodeIdInput;
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
export type MutationUpdateCourseCatalogueTempByNodeIdArgs = {
  input: UpdateCourseCatalogueTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseCatalogueTempArgs = {
  input: UpdateCourseCatalogueTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentByNodeIdArgs = {
  input: UpdateCourseEnrollmentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentArgs = {
  input: UpdateCourseEnrollmentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentByUserIdAndCourseIdArgs = {
  input: UpdateCourseEnrollmentByUserIdAndCourseIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentTempByNodeIdArgs = {
  input: UpdateCourseEnrollmentTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseEnrollmentTempArgs = {
  input: UpdateCourseEnrollmentTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseSyncConfigurationByNodeIdArgs = {
  input: UpdateCourseSyncConfigurationByNodeIdInput;
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
export type MutationUpdateCourseTempByNodeIdArgs = {
  input: UpdateCourseTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCourseTempArgs = {
  input: UpdateCourseTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseByNodeIdArgs = {
  input: DeleteCourseByNodeIdInput;
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
export type MutationDeleteCourseCatalogueByNodeIdArgs = {
  input: DeleteCourseCatalogueByNodeIdInput;
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
export type MutationDeleteCourseCatalogueTempByNodeIdArgs = {
  input: DeleteCourseCatalogueTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseCatalogueTempArgs = {
  input: DeleteCourseCatalogueTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentByNodeIdArgs = {
  input: DeleteCourseEnrollmentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentArgs = {
  input: DeleteCourseEnrollmentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentByUserIdAndCourseIdArgs = {
  input: DeleteCourseEnrollmentByUserIdAndCourseIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentTempByNodeIdArgs = {
  input: DeleteCourseEnrollmentTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseEnrollmentTempArgs = {
  input: DeleteCourseEnrollmentTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseSyncConfigurationByNodeIdArgs = {
  input: DeleteCourseSyncConfigurationByNodeIdInput;
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
export type MutationDeleteCourseTempByNodeIdArgs = {
  input: DeleteCourseTempByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCourseTempArgs = {
  input: DeleteCourseTempInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSsoUrlArgs = {
  username: Scalars["String"];
  path?: Maybe<Scalars["String"]>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTrainingArgs = {
  lastUpdateDate?: Maybe<Scalars["String"]>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateDoceboUserArgs = {
  input?: Maybe<UserCreateInput>;
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

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: "Query";
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
  courseSyncConfigurationByConfigName?: Maybe<CourseSyncConfiguration>;
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
  token?: Maybe<Token>;
  tokenByUsername?: Maybe<Token>;
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
export type QueryCourseArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseByCourseIdArgs = {
  courseId: Scalars["Int"];
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
export type QueryCourseCatalogueTempArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentArgs = {
  id: Scalars["Int"];
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
export type QueryCourseSyncConfigurationArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseSyncConfigurationByConfigNameArgs = {
  configName: Scalars["String"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseTempArgs = {
  id: Scalars["Int"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCatalogueByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseCatalogueTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseEnrollmentTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseSyncConfigurationByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryCourseTempByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type Query_EntitiesArgs = {
  representations: Array<Scalars["_Any"]>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTokenByUsernameArgs = {
  username: Scalars["String"];
};

export type SsoUrlOutput = {
  __typename?: "SSOUrlOutput";
  url?: Maybe<Scalars["String"]>;
};

export type SelectOrgchart = {
  branch_id?: Maybe<Scalars["String"]>;
};

export type Token = {
  __typename?: "Token";
  access_token?: Maybe<Scalars["String"]>;
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
export type UpdateCourseSyncConfigurationPayloadCourseSyncConfigurationEdgeArgs = {
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
  | Course
  | CourseCatalogue
  | CourseEnrollment
  | CourseCatalogueTemp
  | CourseEnrollmentTemp
  | CourseSyncConfiguration
  | CourseTemp;

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
