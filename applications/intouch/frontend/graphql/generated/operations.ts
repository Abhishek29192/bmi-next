import type * as SchemaTypes from "@bmi/intouch-api-types";

export type UpdateCompanyMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateCompanyInput;
}>;

export type UpdateCompanyMutation = { readonly __typename?: "Mutation" } & {
  readonly updateCompany?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateCompanyPayload" } & {
      readonly company?: SchemaTypes.Maybe<
        { readonly __typename?: "Company" } & Pick<SchemaTypes.Company, "name">
      >;
    }
  >;
};

export type CurrentCompanyQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type CurrentCompanyQuery = { readonly __typename?: "Query" } & Pick<
  SchemaTypes.Query,
  "currentCompany"
>;

export type GetCurrentCompanyQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetCurrentCompanyQuery = { readonly __typename?: "Query" } & Pick<
  SchemaTypes.Query,
  "currentCompany"
>;

export type GetCompanyQueryVariables = SchemaTypes.Exact<{
  companyId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompanyQuery = { readonly __typename?: "Query" } & {
  readonly company?: SchemaTypes.Maybe<
    { readonly __typename?: "Company" } & Pick<
      SchemaTypes.Company,
      "name" | "phone" | "website" | "aboutUs" | "publicEmail"
    >
  >;
};

export type TrainingInformationQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type TrainingInformationQuery = { readonly __typename?: "Query" } & {
  readonly courses?: SchemaTypes.Maybe<
    { readonly __typename?: "CoursesConnection" } & Pick<
      SchemaTypes.CoursesConnection,
      "totalCount"
    > & {
        readonly nodes: ReadonlyArray<
          { readonly __typename?: "Course" } & Pick<
            SchemaTypes.Course,
            | "id"
            | "name"
            | "technology"
            | "image"
            | "promoted"
            | "trainingType"
            | "description"
          >
        >;
        readonly pageInfo: { readonly __typename?: "PageInfo" } & Pick<
          SchemaTypes.PageInfo,
          "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
        >;
      }
  >;
  readonly courseEnrollments?: SchemaTypes.Maybe<
    { readonly __typename?: "CourseEnrollmentsConnection" } & Pick<
      SchemaTypes.CourseEnrollmentsConnection,
      "totalCount"
    > & {
        readonly nodes: ReadonlyArray<
          { readonly __typename?: "CourseEnrollment" } & Pick<
            SchemaTypes.CourseEnrollment,
            "id" | "url" | "status"
          > & {
              readonly course?: SchemaTypes.Maybe<
                { readonly __typename?: "Course" } & Pick<
                  SchemaTypes.Course,
                  "id" | "name" | "description" | "image" | "technology"
                >
              >;
            }
        >;
        readonly pageInfo: { readonly __typename?: "PageInfo" } & Pick<
          SchemaTypes.PageInfo,
          "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
        >;
      }
  >;
};
