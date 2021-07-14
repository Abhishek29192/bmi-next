import type * as SchemaTypes from "@bmi/intouch-api-types";

export type AddressLinesFragmentFragment = {
  readonly __typename?: "Address";
} & Pick<
  SchemaTypes.Address,
  "firstLine" | "secondLine" | "town" | "region" | "country" | "postcode"
>;

export type CompanyCertificationsFragment = {
  readonly __typename?: "Company";
} & Pick<SchemaTypes.Company, "certifications">;

export type ContactDetailsCollectionFragmentFragment = {
  readonly __typename?: "ContactDetailsCollection";
} & {
  readonly items: ReadonlyArray<
    SchemaTypes.Maybe<
      { readonly __typename?: "ContactDetails" } & Pick<
        SchemaTypes.ContactDetails,
        "fullName" | "subHeading" | "email" | "phoneNumber"
      >
    >
  >;
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

export type GetGlobalDataQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetGlobalDataQuery = { readonly __typename?: "Query" } & {
  readonly marketContentCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "MarketContentCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "MarketContent" } & Pick<
            SchemaTypes.MarketContent,
            "externalLinkUrl" | "externalLinkLabel"
          > & {
              readonly footerLinksCollection?: SchemaTypes.Maybe<
                {
                  readonly __typename?: "MarketContentFooterLinksCollection";
                } & {
                  readonly items: ReadonlyArray<
                    SchemaTypes.Maybe<
                      { readonly __typename?: "ContentArticle" } & Pick<
                        SchemaTypes.ContentArticle,
                        "title" | "relativePath"
                      >
                    >
                  >;
                }
              >;
              readonly contactUsPage?: SchemaTypes.Maybe<
                { readonly __typename?: "ContentArticle" } & Pick<
                  SchemaTypes.ContentArticle,
                  "title" | "relativePath"
                >
              >;
            }
        >
      >;
    }
  >;
};

export type CompanyAdminsFragmentFragment = {
  readonly __typename?: "Company";
} & {
  readonly companyMembers: {
    readonly __typename?: "CompanyMembersConnection";
  } & {
    readonly nodes: ReadonlyArray<
      { readonly __typename?: "CompanyMember" } & {
        readonly account?: SchemaTypes.Maybe<
          { readonly __typename?: "Account" } & Pick<
            SchemaTypes.Account,
            | "role"
            | "id"
            | "firstName"
            | "lastName"
            | "phone"
            | "email"
            | "photo"
          >
        >;
      }
    >;
  };
};

export type InviteMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.InviteInput;
}>;

export type InviteMutation = { readonly __typename?: "Mutation" } & {
  readonly invite?: SchemaTypes.Maybe<
    ReadonlyArray<
      SchemaTypes.Maybe<
        { readonly __typename?: "Invitation" } & Pick<
          SchemaTypes.Invitation,
          "id" | "invitee"
        > & {
            readonly senderAccount?: SchemaTypes.Maybe<
              { readonly __typename?: "Account" } & Pick<
                SchemaTypes.Account,
                "email"
              >
            >;
          }
      >
    >
  >;
};

export type GetProjectQueryVariables = SchemaTypes.Exact<{
  projectId: SchemaTypes.Scalars["Int"];
}>;

export type GetProjectQuery = { readonly __typename?: "Query" } & {
  readonly project?: SchemaTypes.Maybe<
    { readonly __typename?: "Project" } & Pick<
      SchemaTypes.Project,
      | "id"
      | "name"
      | "technology"
      | "roofArea"
      | "startDate"
      | "endDate"
      | "description"
      | "buildingOwnerFirstname"
      | "buildingOwnerLastname"
      | "buildingOwnerCompany"
      | "buildingOwnerMail"
    > & {
        readonly siteAddress?: SchemaTypes.Maybe<
          { readonly __typename?: "Address" } & Pick<
            SchemaTypes.Address,
            "firstLine" | "secondLine" | "town" | "region" | "postcode"
          >
        >;
        readonly buildingOwnerAddress?: SchemaTypes.Maybe<
          { readonly __typename?: "Address" } & Pick<
            SchemaTypes.Address,
            "firstLine" | "secondLine" | "town" | "region" | "postcode"
          >
        >;
        readonly guarantees: {
          readonly __typename?: "GuaranteesConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "Guarantee" } & Pick<
              SchemaTypes.Guarantee,
              "id" | "guaranteeTypeId"
            > & {
                readonly guaranteeType?: SchemaTypes.Maybe<
                  { readonly __typename?: "ContentfulGuaranteeType" } & Pick<
                    SchemaTypes.ContentfulGuaranteeType,
                    "name"
                  > & {
                      readonly evidenceCategoriesCollection?: SchemaTypes.Maybe<
                        {
                          readonly __typename?: "ContentfulEvidenceCategoryCollection";
                        } & {
                          readonly items?: SchemaTypes.Maybe<
                            ReadonlyArray<
                              SchemaTypes.Maybe<
                                {
                                  readonly __typename?: "ContentfulEvidenceCategory";
                                } & Pick<
                                  SchemaTypes.ContentfulEvidenceCategory,
                                  "name" | "minimumUploads"
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
        readonly evidenceItems: {
          readonly __typename?: "EvidenceItemsConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "EvidenceItem" } & Pick<
              SchemaTypes.EvidenceItem,
              | "id"
              | "name"
              | "guaranteeId"
              | "evidenceCategoryType"
              | "customEvidenceCategoryId"
            > & {
                readonly customEvidenceCategory?: SchemaTypes.Maybe<
                  { readonly __typename?: "ContentfulEvidenceCategory" } & Pick<
                    SchemaTypes.ContentfulEvidenceCategory,
                    "name" | "minimumUploads"
                  >
                >;
              }
          >;
        };
        readonly notes: { readonly __typename?: "NotesConnection" } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "Note" } & Pick<
              SchemaTypes.Note,
              "id" | "body" | "createdAt"
            >
          >;
        };
      }
  >;
};

export type AccountByEmailQueryVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type AccountByEmailQuery = { readonly __typename?: "Query" } & {
  readonly accountByEmail?: SchemaTypes.Maybe<
    { readonly __typename?: "Account" } & Pick<
      SchemaTypes.Account,
      | "id"
      | "role"
      | "marketId"
      | "firstName"
      | "lastName"
      | "email"
      | "doceboUserId"
    > & {
        readonly market?: SchemaTypes.Maybe<
          { readonly __typename?: "Market" } & Pick<
            SchemaTypes.Market,
            | "domain"
            | "language"
            | "doceboCompanyAdminBranchId"
            | "doceboInstallersBranchId"
          >
        >;
        readonly companyMembers: {
          readonly __typename?: "CompanyMembersConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "CompanyMember" } & {
              readonly company?: SchemaTypes.Maybe<
                { readonly __typename?: "Company" } & Pick<
                  SchemaTypes.Company,
                  "id" | "status" | "name"
                >
              >;
            }
          >;
        };
      }
  >;
};

export type CreateAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateAccountInput;
}>;

export type CreateAccountMutation = { readonly __typename?: "Mutation" } & {
  readonly createAccount?: SchemaTypes.Maybe<
    { readonly __typename?: "CreateAccountPayload" } & {
      readonly account?: SchemaTypes.Maybe<
        { readonly __typename?: "Account" } & Pick<
          SchemaTypes.Account,
          "id" | "role" | "email" | "firstName" | "lastName" | "marketId"
        > & {
            readonly market?: SchemaTypes.Maybe<
              { readonly __typename?: "Market" } & Pick<
                SchemaTypes.Market,
                | "language"
                | "doceboCompanyAdminBranchId"
                | "doceboInstallersBranchId"
              >
            >;
            readonly companyMembers: {
              readonly __typename?: "CompanyMembersConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "CompanyMember" } & {
                  readonly company?: SchemaTypes.Maybe<
                    { readonly __typename?: "Company" } & Pick<
                      SchemaTypes.Company,
                      "id" | "status"
                    >
                  >;
                }
              >;
            };
          }
      >;
    }
  >;
};

export type CreateDoceboUserMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UserCreateInput;
}>;

export type CreateDoceboUserMutation = { readonly __typename?: "Mutation" } & {
  readonly createDoceboUser?: SchemaTypes.Maybe<
    { readonly __typename?: "UserCreateResponse" } & Pick<
      SchemaTypes.UserCreateResponse,
      "success" | "user_id"
    >
  >;
};

export type UpdateAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateAccountMutation = { readonly __typename?: "Mutation" } & {
  readonly updateAccount?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateAccountPayload" } & {
      readonly account?: SchemaTypes.Maybe<
        { readonly __typename?: "Account" } & Pick<
          SchemaTypes.Account,
          "id" | "doceboUserId"
        >
      >;
    }
  >;
};

export type UserByEmailQueryVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type UserByEmailQuery = { readonly __typename?: "Query" } & {
  readonly userByEmail?: SchemaTypes.Maybe<
    { readonly __typename?: "UserData" } & Pick<SchemaTypes.UserData, "user_id">
  >;
};

export type InvitationsQueryVariables = SchemaTypes.Exact<{
  invitee: SchemaTypes.Scalars["String"];
}>;

export type InvitationsQuery = { readonly __typename?: "Query" } & {
  readonly invitations?: SchemaTypes.Maybe<
    { readonly __typename?: "InvitationsConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Invitation" } & Pick<
          SchemaTypes.Invitation,
          "id" | "status" | "invitee" | "senderAccountId"
        >
      >;
    }
  >;
};

export type CompleteInvitationMutationVariables = SchemaTypes.Exact<{
  companyId: SchemaTypes.Scalars["Int"];
}>;

export type CompleteInvitationMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly completeInvitation?: SchemaTypes.Maybe<
    { readonly __typename?: "Account" } & Pick<
      SchemaTypes.Account,
      "id" | "role" | "email" | "firstName" | "lastName" | "marketId"
    > & {
        readonly market?: SchemaTypes.Maybe<
          { readonly __typename?: "Market" } & Pick<
            SchemaTypes.Market,
            | "language"
            | "domain"
            | "doceboCompanyAdminBranchId"
            | "doceboInstallersBranchId"
          >
        >;
      }
  >;
};

export type CreateSsoUrlMutationVariables = SchemaTypes.Exact<{
  username: SchemaTypes.Scalars["String"];
  path?: SchemaTypes.Maybe<SchemaTypes.Scalars["String"]>;
}>;

export type CreateSsoUrlMutation = { readonly __typename?: "Mutation" } & {
  readonly createSSOUrl?: SchemaTypes.Maybe<
    { readonly __typename?: "SSOUrlOutput" } & Pick<
      SchemaTypes.SsoUrlOutput,
      "url"
    >
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
  readonly contactDetailsCollection?: SchemaTypes.Maybe<
    {
      readonly __typename?: "ContactDetailsCollection";
    } & ContactDetailsCollectionFragmentFragment
  >;
};

export type CompanyDetailsFragmentFragment = {
  readonly __typename?: "Company";
} & Pick<
  SchemaTypes.Company,
  | "id"
  | "name"
  | "logo"
  | "phone"
  | "website"
  | "aboutUs"
  | "taxNumber"
  | "tier"
  | "businessType"
  | "ownerFullname"
  | "ownerEmail"
  | "ownerPhone"
  | "publicEmail"
  | "linkedIn"
  | "facebook"
  | "referenceNumber"
> & {
    readonly tradingAddress?: SchemaTypes.Maybe<
      { readonly __typename?: "Address" } & {
        readonly coordinates?: SchemaTypes.Maybe<
          { readonly __typename?: "Point" } & Pick<SchemaTypes.Point, "x" | "y">
        >;
      } & AddressLinesFragmentFragment
    >;
    readonly registeredAddress?: SchemaTypes.Maybe<
      { readonly __typename?: "Address" } & AddressLinesFragmentFragment
    >;
  } & CompanyAdminsFragmentFragment &
  CompanyCertificationsFragment;

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

export type GetProjectsQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetProjectsQuery = { readonly __typename?: "Query" } & {
  readonly projects?: SchemaTypes.Maybe<
    { readonly __typename?: "ProjectsConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Project" } & Pick<
          SchemaTypes.Project,
          "id" | "name" | "technology" | "startDate" | "endDate"
        > & {
            readonly siteAddress?: SchemaTypes.Maybe<
              { readonly __typename?: "Address" } & Pick<
                SchemaTypes.Address,
                "town" | "postcode"
              >
            >;
          }
      >;
    }
  >;
};

export type CompanyMembersQueryVariables = SchemaTypes.Exact<{
  expiryDate?: SchemaTypes.Maybe<SchemaTypes.Scalars["Datetime"]>;
}>;

export type CompanyMembersQuery = { readonly __typename?: "Query" } & {
  readonly companyMembers?: SchemaTypes.Maybe<
    { readonly __typename?: "CompanyMembersConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "CompanyMember" } & Pick<
          SchemaTypes.CompanyMember,
          "id"
        > & {
            readonly company?: SchemaTypes.Maybe<
              { readonly __typename?: "Company" } & Pick<
                SchemaTypes.Company,
                "name"
              >
            >;
            readonly account?: SchemaTypes.Maybe<
              { readonly __typename?: "Account" } & Pick<
                SchemaTypes.Account,
                | "id"
                | "role"
                | "email"
                | "phone"
                | "photo"
                | "lastName"
                | "firstName"
              > & {
                  readonly certificationsByDoceboUserId: {
                    readonly __typename?: "CertificationsConnection";
                  } & {
                    readonly nodes: ReadonlyArray<
                      { readonly __typename?: "Certification" } & Pick<
                        SchemaTypes.Certification,
                        "id" | "name" | "technology" | "expiryDate"
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
