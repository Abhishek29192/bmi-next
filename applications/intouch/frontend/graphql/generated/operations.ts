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
          "id" | "accountId"
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

export type ProductsAndSystemsQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type ProductsAndSystemsQuery = { readonly __typename?: "Query" } & {
  readonly products?: SchemaTypes.Maybe<
    { readonly __typename?: "ProductsConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Product" } & Pick<
          SchemaTypes.Product,
          | "id"
          | "bmiRef"
          | "family"
          | "name"
          | "brand"
          | "published"
          | "description"
        >
      >;
    }
  >;
  readonly systems?: SchemaTypes.Maybe<
    { readonly __typename?: "SystemsConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "System" } & Pick<
          SchemaTypes.System,
          "id" | "bmiRef" | "description" | "name" | "published"
        >
      >;
    }
  >;
};

export type BulkImportMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.BulkImportInput;
}>;

export type BulkImportMutation = { readonly __typename?: "Mutation" } & {
  readonly bulkImport?: SchemaTypes.Maybe<
    { readonly __typename?: "ImportPayload" } & {
      readonly systemsToInsert?: SchemaTypes.Maybe<
        ReadonlyArray<
          SchemaTypes.Maybe<
            { readonly __typename?: "System" } & Pick<
              SchemaTypes.System,
              "bmiRef"
            >
          >
        >
      >;
      readonly systemsToUpdate?: SchemaTypes.Maybe<
        ReadonlyArray<
          SchemaTypes.Maybe<
            { readonly __typename?: "System" } & Pick<
              SchemaTypes.System,
              "bmiRef"
            >
          >
        >
      >;
      readonly productsToInsert?: SchemaTypes.Maybe<
        ReadonlyArray<
          SchemaTypes.Maybe<
            { readonly __typename?: "Product" } & Pick<
              SchemaTypes.Product,
              "bmiRef"
            >
          >
        >
      >;
      readonly productsToUpdate?: SchemaTypes.Maybe<
        ReadonlyArray<
          SchemaTypes.Maybe<
            { readonly __typename?: "Product" } & Pick<
              SchemaTypes.Product,
              "bmiRef"
            >
          >
        >
      >;
    }
  >;
};

export type UpdateProductMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProductInput;
}>;

export type UpdateProductMutation = { readonly __typename?: "Mutation" } & {
  readonly updateProduct?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateProductPayload" } & {
      readonly product?: SchemaTypes.Maybe<
        { readonly __typename?: "Product" } & Pick<SchemaTypes.Product, "id">
      >;
    }
  >;
};

export type UpdateSystemMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateSystemInput;
}>;

export type UpdateSystemMutation = { readonly __typename?: "Mutation" } & {
  readonly updateSystem?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateSystemPayload" } & {
      readonly system?: SchemaTypes.Maybe<
        { readonly __typename?: "System" } & Pick<SchemaTypes.System, "id">
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

export type ImageFragmentFragment = { readonly __typename?: "Asset" } & Pick<
  SchemaTypes.Asset,
  | "title"
  | "description"
  | "contentType"
  | "fileName"
  | "size"
  | "url"
  | "width"
  | "height"
>;

export type GetPartnerBrandsQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetPartnerBrandsQuery = { readonly __typename?: "Query" } & {
  readonly marketContentCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "MarketContentCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "MarketContent" } & {
            readonly partnerBrandsCollection?: SchemaTypes.Maybe<
              {
                readonly __typename?: "MarketContentPartnerBrandsCollection";
              } & {
                readonly items: ReadonlyArray<
                  SchemaTypes.Maybe<
                    { readonly __typename?: "PartnerBrand" } & Pick<
                      SchemaTypes.PartnerBrand,
                      "name" | "shortDescription"
                    > & {
                        readonly image?: SchemaTypes.Maybe<
                          {
                            readonly __typename?: "Asset";
                          } & ImageFragmentFragment
                        >;
                        readonly logo?: SchemaTypes.Maybe<
                          {
                            readonly __typename?: "Asset";
                          } & ImageFragmentFragment
                        >;
                      }
                  >
                >;
              }
            >;
          }
        >
      >;
    }
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
