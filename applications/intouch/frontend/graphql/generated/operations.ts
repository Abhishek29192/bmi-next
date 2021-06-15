import type * as SchemaTypes from "@bmi/intouch-api-types";

export type CompanyDetailsFragmentFragment = {
  readonly __typename?: "Company";
} & Pick<
  SchemaTypes.Company,
  "id" | "name" | "phone" | "website" | "aboutUs" | "publicEmail"
> & {
    readonly companyMembers: {
      readonly __typename?: "CompanyMembersConnection";
    } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "CompanyMember" } & Pick<
          SchemaTypes.CompanyMember,
          "id"
        >
      >;
    };
  };

export type UpdateCompanyDetailsMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateCompanyInput;
}>;

export type UpdateCompanyDetailsMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly updateCompany?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateCompanyPayload" } & {
      readonly company?: SchemaTypes.Maybe<
        { readonly __typename?: "Company" } & CompanyDetailsFragmentFragment
      >;
    }
  >;
};

export type CreateCompanyMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateCompanyInput;
}>;

export type CreateCompanyMutation = { readonly __typename?: "Mutation" } & {
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
    { readonly __typename?: "Company" } & CompanyDetailsFragmentFragment
  >;
};

export type TrainingQueryVariables = SchemaTypes.Exact<{
  catalogueId?: SchemaTypes.Maybe<SchemaTypes.Scalars["Int"]>;
  userId?: SchemaTypes.Maybe<SchemaTypes.Scalars["Int"]>;
}>;

export type TrainingQuery = { readonly __typename?: "Query" } & {
  readonly trainingContentCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "TrainingContentCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "TrainingContent" } & Pick<
            SchemaTypes.TrainingContent,
            | "pageHeading"
            | "description"
            | "lmsCtaLabel"
            | "pageSubHeading"
            | "step1Heading"
            | "step1SubHeading"
            | "step1Description"
            | "step2Heading"
            | "step2SubHeading"
            | "step2Description"
            | "step3Heading"
            | "step3SubHeading"
            | "step3Description"
            | "live"
          > & {
              readonly image?: SchemaTypes.Maybe<
                { readonly __typename?: "Asset" } & Pick<
                  SchemaTypes.Asset,
                  "url"
                >
              >;
            }
        >
      >;
    }
  >;
  readonly courseCatalogues?: SchemaTypes.Maybe<
    { readonly __typename?: "CourseCataloguesConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "CourseCatalogue" } & {
          readonly course?: SchemaTypes.Maybe<
            { readonly __typename?: "Course" } & Pick<
              SchemaTypes.Course,
              | "courseId"
              | "name"
              | "technology"
              | "image"
              | "promoted"
              | "trainingType"
              | "description"
            > & {
                readonly courseEnrollments: {
                  readonly __typename?: "CourseEnrollmentsConnection";
                } & {
                  readonly nodes: ReadonlyArray<
                    { readonly __typename?: "CourseEnrollment" } & Pick<
                      SchemaTypes.CourseEnrollment,
                      "id" | "status" | "url" | "courseId"
                    >
                  >;
                };
              }
          >;
        }
      >;
    }
  >;
};

export type DoceboCatalogIdByMarketDomainQueryVariables = SchemaTypes.Exact<{
  domain: SchemaTypes.Scalars["String"];
}>;

export type DoceboCatalogIdByMarketDomainQuery = {
  readonly __typename?: "Query";
} & {
  readonly marketByDomain?: SchemaTypes.Maybe<
    { readonly __typename?: "Market" } & Pick<
      SchemaTypes.Market,
      "doceboCatalogueId"
    >
  >;
};

export type UploadDataMutationVariables = SchemaTypes.Exact<{
  files:
    | ReadonlyArray<SchemaTypes.Scalars["Upload"]>
    | SchemaTypes.Scalars["Upload"];
}>;

export type UploadDataMutation = { readonly __typename?: "Mutation" } & {
  readonly uploadData?: SchemaTypes.Maybe<
    ReadonlyArray<
      SchemaTypes.Maybe<
        { readonly __typename?: "File" } & Pick<
          SchemaTypes.File,
          "filename" | "mimetype" | "encoding"
        >
      >
    >
  >;
};
