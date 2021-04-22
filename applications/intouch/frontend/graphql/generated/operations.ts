import type * as SchemaTypes from "@bmi/intouch-api-types";

export type CreateCompanyMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateCompanyInput;
}>;

export type CreateCompanyMutation = { readonly __typename?: "Mutation" } & {
  readonly createCompany?: SchemaTypes.Maybe<
    { readonly __typename?: "CreateCompanyPayload" } & {
      readonly company?: SchemaTypes.Maybe<
        { readonly __typename?: "Company" } & Pick<SchemaTypes.Company, "name">
      >;
    }
  >;
};

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

export type TrainingQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type TrainingQuery = { readonly __typename?: "Query" } & {
  readonly training?: SchemaTypes.Maybe<
    { readonly __typename?: "TrainingInfo" } & Pick<
      SchemaTypes.TrainingInfo,
      "name" | "url"
    > & {
        readonly user?: SchemaTypes.Maybe<
          { readonly __typename?: "TrainingUser" } & Pick<
            SchemaTypes.TrainingUser,
            | "id"
            | "email"
            | "user_level"
            | "username"
            | "firstname"
            | "lastname"
          > & {
              readonly enrollment?: SchemaTypes.Maybe<
                { readonly __typename?: "Enrollment" } & Pick<
                  SchemaTypes.Enrollment,
                  | "count"
                  | "has_more_data"
                  | "current_page"
                  | "current_page_size"
                  | "total_page_count"
                  | "total_count"
                > & {
                    readonly items?: SchemaTypes.Maybe<
                      ReadonlyArray<
                        SchemaTypes.Maybe<
                          { readonly __typename?: "EnrollmentItems" } & Pick<
                            SchemaTypes.EnrollmentItems,
                            | "id"
                            | "name"
                            | "description"
                            | "status"
                            | "image_url"
                            | "url"
                            | "type"
                            | "level"
                          >
                        >
                      >
                    >;
                  }
              >;
            }
        >;
      }
  >;
};
