import type * as SchemaTypes from "@bmi/intouch-api-types";

export type AddressLinesFragmentFragment = {
  readonly __typename?: "Address";
} & Pick<
  SchemaTypes.Address,
  "id" | "firstLine" | "secondLine" | "town" | "region" | "country" | "postcode"
>;

export type CompanyCertificationsFragment = {
  readonly __typename?: "Company";
} & Pick<SchemaTypes.Company, "certifications">;

export type UpdateProjectHiddenMutationVariables = SchemaTypes.Exact<{
  projectId: SchemaTypes.Scalars["Int"];
  hidden: SchemaTypes.Scalars["Boolean"];
}>;

export type UpdateProjectHiddenMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly updateProject?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateProjectPayload" } & {
      readonly project?: SchemaTypes.Maybe<
        { readonly __typename?: "Project" } & Pick<
          SchemaTypes.Project,
          "id" | "hidden"
        >
      >;
    }
  >;
};

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

export type MarkAllNotificationsAsReadMutationVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
}>;

export type MarkAllNotificationsAsReadMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly markAllNotificationsAsRead?: SchemaTypes.Maybe<
    { readonly __typename?: "MarkAllNotificationsAsReadPayload" } & {
      readonly notifications?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "Notification" } & Pick<
            SchemaTypes.Notification,
            "id" | "read"
          >
        >
      >;
    }
  >;
};

export type GetGlobalDataQueryVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
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
  readonly notifications?: SchemaTypes.Maybe<
    { readonly __typename?: "NotificationsConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Notification" } & Pick<
          SchemaTypes.Notification,
          "body" | "sendDate" | "read" | "id"
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

export type CompanyDetailsFragmentFragment = {
  readonly __typename?: "Company";
} & Pick<
  SchemaTypes.Company,
  | "name"
  | "businessType"
  | "logo"
  | "aboutUs"
  | "ownerFullname"
  | "ownerPhone"
  | "ownerEmail"
  | "phone"
  | "publicEmail"
  | "website"
  | "facebook"
  | "linkedIn"
> & {
    readonly tradingAddress?: SchemaTypes.Maybe<
      { readonly __typename?: "Address" } & Pick<
        SchemaTypes.Address,
        | "id"
        | "firstLine"
        | "secondLine"
        | "town"
        | "region"
        | "country"
        | "postcode"
      > & {
          readonly coordinates?: SchemaTypes.Maybe<
            { readonly __typename?: "Point" } & Pick<
              SchemaTypes.Point,
              "x" | "y"
            >
          >;
        }
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
        { readonly __typename?: "Company" } & Pick<
          SchemaTypes.Company,
          | "id"
          | "status"
          | "isProfileComplete"
          | "name"
          | "businessType"
          | "logo"
          | "aboutUs"
          | "ownerFullname"
          | "ownerPhone"
          | "ownerEmail"
          | "phone"
          | "publicEmail"
          | "website"
          | "facebook"
          | "linkedIn"
          | "referenceNumber"
          | "taxNumber"
          | "tier"
          | "certifications"
        > & {
            readonly tradingAddress?: SchemaTypes.Maybe<
              { readonly __typename?: "Address" } & Pick<
                SchemaTypes.Address,
                | "id"
                | "firstLine"
                | "secondLine"
                | "town"
                | "region"
                | "country"
                | "postcode"
              > & {
                  readonly coordinates?: SchemaTypes.Maybe<
                    { readonly __typename?: "Point" } & Pick<
                      SchemaTypes.Point,
                      "x" | "y"
                    >
                  >;
                }
            >;
            readonly registeredAddress?: SchemaTypes.Maybe<
              { readonly __typename?: "Address" } & Pick<
                SchemaTypes.Address,
                | "id"
                | "firstLine"
                | "secondLine"
                | "town"
                | "region"
                | "country"
                | "postcode"
              >
            >;
            readonly companyOperationsByCompany: {
              readonly __typename?: "CompanyOperationsConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "CompanyOperation" } & Pick<
                  SchemaTypes.CompanyOperation,
                  "id" | "operation"
                >
              >;
            };
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
          }
      >;
    }
  >;
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

export type DeleteCompanyMemberMutationVariables = SchemaTypes.Exact<{
  id: SchemaTypes.Scalars["Int"];
}>;

export type DeleteCompanyMemberMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly deleteCompanyMember?: SchemaTypes.Maybe<
    { readonly __typename?: "DeleteCompanyMemberPayload" } & Pick<
      SchemaTypes.DeleteCompanyMemberPayload,
      "clientMutationId"
    >
  >;
};

export type CompanyRegisteredDetailsFragmentFragment = {
  readonly __typename?: "Company";
} & Pick<
  SchemaTypes.Company,
  "name" | "referenceNumber" | "taxNumber" | "tier"
> & {
    readonly registeredAddress?: SchemaTypes.Maybe<
      { readonly __typename?: "Address" } & Pick<
        SchemaTypes.Address,
        | "id"
        | "firstLine"
        | "secondLine"
        | "town"
        | "region"
        | "country"
        | "postcode"
      >
    >;
    readonly companyOperationsByCompany: {
      readonly __typename?: "CompanyOperationsConnection";
    } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "CompanyOperation" } & Pick<
          SchemaTypes.CompanyOperation,
          "id" | "operation"
        >
      >;
    };
  };

export type BulkImportMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.BulkImportInput;
}>;

export type BulkImportMutation = { readonly __typename?: "Mutation" } & {
  readonly bulkImport?: SchemaTypes.Maybe<
    { readonly __typename?: "ImportOutput" } & {
      readonly systemsToInsert?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "System" } & Pick<
            SchemaTypes.System,
            "bmiRef"
          >
        >
      >;
      readonly systemsToUpdate?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "System" } & Pick<
            SchemaTypes.System,
            "bmiRef"
          >
        >
      >;
      readonly productsToInsert?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "Product" } & Pick<
            SchemaTypes.Product,
            "bmiRef"
          >
        >
      >;
      readonly productsToUpdate?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "Product" } & Pick<
            SchemaTypes.Product,
            "bmiRef"
          >
        >
      >;
      readonly errorSystemsToUpdate?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "ImportError" } & Pick<
            SchemaTypes.ImportError,
            "ref" | "message"
          >
        >
      >;
      readonly errorSystemsToInsert?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "ImportError" } & Pick<
            SchemaTypes.ImportError,
            "ref" | "message"
          >
        >
      >;
      readonly errorProductsToUpdate?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "ImportError" } & Pick<
            SchemaTypes.ImportError,
            "ref" | "message"
          >
        >
      >;
      readonly errorProductsToInsert?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "ImportError" } & Pick<
            SchemaTypes.ImportError,
            "ref" | "message"
          >
        >
      >;
      readonly errorSystemMembersInsert?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "ImportError" } & Pick<
            SchemaTypes.ImportError,
            "ref" | "message"
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
      readonly query?: SchemaTypes.Maybe<
        { readonly __typename?: "Query" } & {
          readonly products?: SchemaTypes.Maybe<
            { readonly __typename?: "ProductsConnection" } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "Product" } & Pick<
                  SchemaTypes.Product,
                  | "id"
                  | "name"
                  | "brand"
                  | "family"
                  | "bmiRef"
                  | "updatedAt"
                  | "published"
                  | "technology"
                  | "description"
                  | "maximumValidityYears"
                >
              >;
            }
          >;
        }
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
      readonly query?: SchemaTypes.Maybe<
        { readonly __typename?: "Query" } & {
          readonly systems?: SchemaTypes.Maybe<
            { readonly __typename?: "SystemsConnection" } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "System" } & Pick<
                  SchemaTypes.System,
                  | "id"
                  | "name"
                  | "bmiRef"
                  | "updatedAt"
                  | "published"
                  | "technology"
                  | "description"
                  | "maximumValidityYears"
                >
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type CreateProjectMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateProjectInput;
}>;

export type CreateProjectMutation = { readonly __typename?: "Mutation" } & {
  readonly createProject?: SchemaTypes.Maybe<
    { readonly __typename?: "CreateProjectPayload" } & {
      readonly project?: SchemaTypes.Maybe<
        { readonly __typename?: "Project" } & Pick<
          SchemaTypes.Project,
          | "id"
          | "hidden"
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
                | "id"
                | "firstLine"
                | "secondLine"
                | "town"
                | "region"
                | "country"
                | "postcode"
              >
            >;
            readonly buildingOwnerAddress?: SchemaTypes.Maybe<
              { readonly __typename?: "Address" } & Pick<
                SchemaTypes.Address,
                | "id"
                | "firstLine"
                | "secondLine"
                | "town"
                | "region"
                | "country"
                | "postcode"
              >
            >;
            readonly guarantees: {
              readonly __typename?: "GuaranteesConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "Guarantee" } & Pick<
                  SchemaTypes.Guarantee,
                  | "id"
                  | "guaranteeReferenceCode"
                  | "reviewerAccountId"
                  | "coverage"
                  | "languageCode"
                  | "fileStorageId"
                  | "signedFileStorageUrl"
                  | "status"
                > & {
                    readonly guaranteeType?: SchemaTypes.Maybe<
                      {
                        readonly __typename?: "ContentfulGuaranteeType";
                      } & Pick<
                        SchemaTypes.ContentfulGuaranteeType,
                        | "name"
                        | "coverage"
                        | "displayName"
                        | "technology"
                        | "tiersAvailable"
                      > & {
                          readonly sys: {
                            readonly __typename?: "ContentfulSys";
                          } & Pick<SchemaTypes.ContentfulSys, "id">;
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
                                      | "referenceCode"
                                      | "name"
                                      | "minimumUploads"
                                    > & {
                                        readonly sys: {
                                          readonly __typename?: "ContentfulSys";
                                        } & Pick<
                                          SchemaTypes.ContentfulSys,
                                          "id"
                                        >;
                                      }
                                  >
                                >
                              >;
                            }
                          >;
                        }
                    >;
                    readonly productByProductBmiRef?: SchemaTypes.Maybe<
                      { readonly __typename?: "Product" } & Pick<
                        SchemaTypes.Product,
                        "id" | "name" | "brand" | "family" | "description"
                      >
                    >;
                    readonly systemBySystemBmiRef?: SchemaTypes.Maybe<
                      { readonly __typename?: "System" } & Pick<
                        SchemaTypes.System,
                        "id" | "name" | "description"
                      > & {
                          readonly systemMembersBySystemBmiRef: {
                            readonly __typename?: "SystemMembersConnection";
                          } & {
                            readonly nodes: ReadonlyArray<
                              { readonly __typename?: "SystemMember" } & Pick<
                                SchemaTypes.SystemMember,
                                "id"
                              > & {
                                  readonly productByProductBmiRef?: SchemaTypes.Maybe<
                                    { readonly __typename?: "Product" } & Pick<
                                      SchemaTypes.Product,
                                      | "id"
                                      | "name"
                                      | "brand"
                                      | "family"
                                      | "description"
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
            readonly evidenceItems: {
              readonly __typename?: "EvidenceItemsConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "EvidenceItem" } & Pick<
                  SchemaTypes.EvidenceItem,
                  | "id"
                  | "name"
                  | "signedUrl"
                  | "guaranteeId"
                  | "evidenceCategoryType"
                  | "customEvidenceCategoryKey"
                > & {
                    readonly customEvidenceCategory?: SchemaTypes.Maybe<
                      {
                        readonly __typename?: "ContentfulEvidenceCategory";
                      } & Pick<
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
                  "id" | "body" | "authorId" | "createdAt"
                > & {
                    readonly author?: SchemaTypes.Maybe<
                      { readonly __typename?: "Account" } & Pick<
                        SchemaTypes.Account,
                        "firstName" | "lastName"
                      >
                    >;
                  }
              >;
            };
            readonly projectMembers: {
              readonly __typename?: "ProjectMembersConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "ProjectMember" } & Pick<
                  SchemaTypes.ProjectMember,
                  "id" | "accountId" | "isResponsibleInstaller"
                > & {
                    readonly account?: SchemaTypes.Maybe<
                      { readonly __typename?: "Account" } & Pick<
                        SchemaTypes.Account,
                        "id" | "firstName" | "lastName" | "role"
                      > & {
                          readonly certificationsByDoceboUserId: {
                            readonly __typename?: "CertificationsConnection";
                          } & {
                            readonly nodes: ReadonlyArray<
                              { readonly __typename?: "Certification" } & Pick<
                                SchemaTypes.Certification,
                                "name" | "technology"
                              >
                            >;
                          };
                        }
                    >;
                  }
              >;
            };
            readonly company?: SchemaTypes.Maybe<
              { readonly __typename?: "Company" } & Pick<
                SchemaTypes.Company,
                "id" | "name" | "tier"
              >
            >;
          }
      >;
    }
  >;
};

export type UpdateProjectMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProjectInput;
}>;

export type UpdateProjectMutation = { readonly __typename?: "Mutation" } & {
  readonly updateProject?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateProjectPayload" } & {
      readonly project?: SchemaTypes.Maybe<
        { readonly __typename?: "Project" } & Pick<
          SchemaTypes.Project,
          | "id"
          | "hidden"
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
                | "id"
                | "firstLine"
                | "secondLine"
                | "town"
                | "region"
                | "country"
                | "postcode"
              >
            >;
            readonly buildingOwnerAddress?: SchemaTypes.Maybe<
              { readonly __typename?: "Address" } & Pick<
                SchemaTypes.Address,
                | "id"
                | "firstLine"
                | "secondLine"
                | "town"
                | "region"
                | "country"
                | "postcode"
              >
            >;
            readonly guarantees: {
              readonly __typename?: "GuaranteesConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "Guarantee" } & Pick<
                  SchemaTypes.Guarantee,
                  | "id"
                  | "guaranteeReferenceCode"
                  | "reviewerAccountId"
                  | "coverage"
                  | "languageCode"
                  | "fileStorageId"
                  | "signedFileStorageUrl"
                  | "status"
                > & {
                    readonly guaranteeType?: SchemaTypes.Maybe<
                      {
                        readonly __typename?: "ContentfulGuaranteeType";
                      } & Pick<
                        SchemaTypes.ContentfulGuaranteeType,
                        | "name"
                        | "coverage"
                        | "displayName"
                        | "technology"
                        | "tiersAvailable"
                      > & {
                          readonly sys: {
                            readonly __typename?: "ContentfulSys";
                          } & Pick<SchemaTypes.ContentfulSys, "id">;
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
                                      | "referenceCode"
                                      | "name"
                                      | "minimumUploads"
                                    > & {
                                        readonly sys: {
                                          readonly __typename?: "ContentfulSys";
                                        } & Pick<
                                          SchemaTypes.ContentfulSys,
                                          "id"
                                        >;
                                      }
                                  >
                                >
                              >;
                            }
                          >;
                        }
                    >;
                    readonly productByProductBmiRef?: SchemaTypes.Maybe<
                      { readonly __typename?: "Product" } & Pick<
                        SchemaTypes.Product,
                        "id" | "name" | "brand" | "family" | "description"
                      >
                    >;
                    readonly systemBySystemBmiRef?: SchemaTypes.Maybe<
                      { readonly __typename?: "System" } & Pick<
                        SchemaTypes.System,
                        "id" | "name" | "description"
                      > & {
                          readonly systemMembersBySystemBmiRef: {
                            readonly __typename?: "SystemMembersConnection";
                          } & {
                            readonly nodes: ReadonlyArray<
                              { readonly __typename?: "SystemMember" } & Pick<
                                SchemaTypes.SystemMember,
                                "id"
                              > & {
                                  readonly productByProductBmiRef?: SchemaTypes.Maybe<
                                    { readonly __typename?: "Product" } & Pick<
                                      SchemaTypes.Product,
                                      | "id"
                                      | "name"
                                      | "brand"
                                      | "family"
                                      | "description"
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
            readonly evidenceItems: {
              readonly __typename?: "EvidenceItemsConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "EvidenceItem" } & Pick<
                  SchemaTypes.EvidenceItem,
                  | "id"
                  | "name"
                  | "signedUrl"
                  | "guaranteeId"
                  | "evidenceCategoryType"
                  | "customEvidenceCategoryKey"
                > & {
                    readonly customEvidenceCategory?: SchemaTypes.Maybe<
                      {
                        readonly __typename?: "ContentfulEvidenceCategory";
                      } & Pick<
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
                  "id" | "body" | "authorId" | "createdAt"
                > & {
                    readonly author?: SchemaTypes.Maybe<
                      { readonly __typename?: "Account" } & Pick<
                        SchemaTypes.Account,
                        "firstName" | "lastName"
                      >
                    >;
                  }
              >;
            };
            readonly projectMembers: {
              readonly __typename?: "ProjectMembersConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "ProjectMember" } & Pick<
                  SchemaTypes.ProjectMember,
                  "id" | "accountId" | "isResponsibleInstaller"
                > & {
                    readonly account?: SchemaTypes.Maybe<
                      { readonly __typename?: "Account" } & Pick<
                        SchemaTypes.Account,
                        "id" | "firstName" | "lastName" | "role"
                      > & {
                          readonly certificationsByDoceboUserId: {
                            readonly __typename?: "CertificationsConnection";
                          } & {
                            readonly nodes: ReadonlyArray<
                              { readonly __typename?: "Certification" } & Pick<
                                SchemaTypes.Certification,
                                "name" | "technology"
                              >
                            >;
                          };
                        }
                    >;
                  }
              >;
            };
            readonly company?: SchemaTypes.Maybe<
              { readonly __typename?: "Company" } & Pick<
                SchemaTypes.Company,
                "id" | "name" | "tier"
              >
            >;
          }
      >;
    }
  >;
};

export type UpdateAccountProfileMutationVariables = SchemaTypes.Exact<{
  updateAccountInput: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateAccountProfileMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly updateAccount?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateAccountPayload" } & {
      readonly account?: SchemaTypes.Maybe<
        { readonly __typename?: "Account" } & Pick<
          SchemaTypes.Account,
          | "id"
          | "firstName"
          | "lastName"
          | "role"
          | "email"
          | "phone"
          | "photo"
          | "signedPhotoUrl"
        > & {
            readonly companyMembers: {
              readonly __typename?: "CompanyMembersConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "CompanyMember" } & {
                  readonly company?: SchemaTypes.Maybe<
                    { readonly __typename?: "Company" } & Pick<
                      SchemaTypes.Company,
                      | "id"
                      | "name"
                      | "businessType"
                      | "logo"
                      | "aboutUs"
                      | "ownerFullname"
                      | "ownerPhone"
                      | "ownerEmail"
                      | "phone"
                      | "publicEmail"
                      | "website"
                      | "facebook"
                      | "linkedIn"
                    > & {
                        readonly tradingAddress?: SchemaTypes.Maybe<
                          { readonly __typename?: "Address" } & Pick<
                            SchemaTypes.Address,
                            | "id"
                            | "firstLine"
                            | "secondLine"
                            | "town"
                            | "region"
                            | "country"
                            | "postcode"
                          > & {
                              readonly coordinates?: SchemaTypes.Maybe<
                                { readonly __typename?: "Point" } & Pick<
                                  SchemaTypes.Point,
                                  "x" | "y"
                                >
                              >;
                            }
                        >;
                      }
                  >;
                }
              >;
            };
            readonly certificationsByDoceboUserId: {
              readonly __typename?: "CertificationsConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "Certification" } & Pick<
                  SchemaTypes.Certification,
                  "id" | "technology" | "expiryDate" | "name"
                >
              >;
            };
          }
      >;
    }
  >;
};

export type LeaveCompanyMutationVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
  companyId: SchemaTypes.Scalars["Int"];
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type LeaveCompanyMutation = { readonly __typename?: "Mutation" } & {
  readonly deleteCompanyMemberByMarketIdAndAccountIdAndCompanyId?: SchemaTypes.Maybe<
    { readonly __typename?: "DeleteCompanyMemberPayload" } & Pick<
      SchemaTypes.DeleteCompanyMemberPayload,
      "clientMutationId"
    > & {
        readonly account?: SchemaTypes.Maybe<
          { readonly __typename?: "Account" } & Pick<
            SchemaTypes.Account,
            | "id"
            | "firstName"
            | "lastName"
            | "role"
            | "email"
            | "phone"
            | "photo"
            | "signedPhotoUrl"
          > & {
              readonly companyMembers: {
                readonly __typename?: "CompanyMembersConnection";
              } & {
                readonly nodes: ReadonlyArray<
                  { readonly __typename?: "CompanyMember" } & {
                    readonly company?: SchemaTypes.Maybe<
                      { readonly __typename?: "Company" } & Pick<
                        SchemaTypes.Company,
                        | "id"
                        | "name"
                        | "businessType"
                        | "logo"
                        | "aboutUs"
                        | "ownerFullname"
                        | "ownerPhone"
                        | "ownerEmail"
                        | "phone"
                        | "publicEmail"
                        | "website"
                        | "facebook"
                        | "linkedIn"
                      > & {
                          readonly tradingAddress?: SchemaTypes.Maybe<
                            { readonly __typename?: "Address" } & Pick<
                              SchemaTypes.Address,
                              | "id"
                              | "firstLine"
                              | "secondLine"
                              | "town"
                              | "region"
                              | "country"
                              | "postcode"
                            > & {
                                readonly coordinates?: SchemaTypes.Maybe<
                                  { readonly __typename?: "Point" } & Pick<
                                    SchemaTypes.Point,
                                    "x" | "y"
                                  >
                                >;
                              }
                          >;
                        }
                    >;
                  }
                >;
              };
              readonly certificationsByDoceboUserId: {
                readonly __typename?: "CertificationsConnection";
              } & {
                readonly nodes: ReadonlyArray<
                  { readonly __typename?: "Certification" } & Pick<
                    SchemaTypes.Certification,
                    "id" | "technology" | "expiryDate" | "name"
                  >
                >;
              };
            }
        >;
      }
  >;
};

export type ResetPasswordMutationVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type ResetPasswordMutation = { readonly __typename?: "Mutation" } & Pick<
  SchemaTypes.Mutation,
  "resetPassword"
>;

export type CreateCompanyMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateCompanyInput;
}>;

export type CreateCompanyMutation = { readonly __typename?: "Mutation" } & {
  readonly createCompany?: SchemaTypes.Maybe<
    { readonly __typename?: "CreateCompanyPayload" } & {
      readonly company?: SchemaTypes.Maybe<
        { readonly __typename?: "Company" } & Pick<SchemaTypes.Company, "id">
      >;
    }
  >;
};

export type ProjectDetailsFragmentFragment = {
  readonly __typename?: "Project";
} & Pick<
  SchemaTypes.Project,
  | "id"
  | "hidden"
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
        | "id"
        | "firstLine"
        | "secondLine"
        | "town"
        | "region"
        | "country"
        | "postcode"
      >
    >;
    readonly buildingOwnerAddress?: SchemaTypes.Maybe<
      { readonly __typename?: "Address" } & Pick<
        SchemaTypes.Address,
        | "id"
        | "firstLine"
        | "secondLine"
        | "town"
        | "region"
        | "country"
        | "postcode"
      >
    >;
    readonly guarantees: { readonly __typename?: "GuaranteesConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Guarantee" } & Pick<
          SchemaTypes.Guarantee,
          | "id"
          | "guaranteeReferenceCode"
          | "reviewerAccountId"
          | "coverage"
          | "languageCode"
          | "fileStorageId"
          | "signedFileStorageUrl"
          | "status"
        > & {
            readonly guaranteeType?: SchemaTypes.Maybe<
              { readonly __typename?: "ContentfulGuaranteeType" } & Pick<
                SchemaTypes.ContentfulGuaranteeType,
                | "name"
                | "coverage"
                | "displayName"
                | "technology"
                | "tiersAvailable"
              > & {
                  readonly sys: {
                    readonly __typename?: "ContentfulSys";
                  } & Pick<SchemaTypes.ContentfulSys, "id">;
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
                              "referenceCode" | "name" | "minimumUploads"
                            > & {
                                readonly sys: {
                                  readonly __typename?: "ContentfulSys";
                                } & Pick<SchemaTypes.ContentfulSys, "id">;
                              }
                          >
                        >
                      >;
                    }
                  >;
                }
            >;
            readonly productByProductBmiRef?: SchemaTypes.Maybe<
              { readonly __typename?: "Product" } & Pick<
                SchemaTypes.Product,
                "id" | "name" | "brand" | "family" | "description"
              >
            >;
            readonly systemBySystemBmiRef?: SchemaTypes.Maybe<
              { readonly __typename?: "System" } & Pick<
                SchemaTypes.System,
                "id" | "name" | "description"
              > & {
                  readonly systemMembersBySystemBmiRef: {
                    readonly __typename?: "SystemMembersConnection";
                  } & {
                    readonly nodes: ReadonlyArray<
                      { readonly __typename?: "SystemMember" } & Pick<
                        SchemaTypes.SystemMember,
                        "id"
                      > & {
                          readonly productByProductBmiRef?: SchemaTypes.Maybe<
                            { readonly __typename?: "Product" } & Pick<
                              SchemaTypes.Product,
                              "id" | "name" | "brand" | "family" | "description"
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
    readonly evidenceItems: {
      readonly __typename?: "EvidenceItemsConnection";
    } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "EvidenceItem" } & Pick<
          SchemaTypes.EvidenceItem,
          | "id"
          | "name"
          | "signedUrl"
          | "guaranteeId"
          | "evidenceCategoryType"
          | "customEvidenceCategoryKey"
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
          "id" | "body" | "authorId" | "createdAt"
        > & {
            readonly author?: SchemaTypes.Maybe<
              { readonly __typename?: "Account" } & Pick<
                SchemaTypes.Account,
                "firstName" | "lastName"
              >
            >;
          }
      >;
    };
    readonly projectMembers: {
      readonly __typename?: "ProjectMembersConnection";
    } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "ProjectMember" } & Pick<
          SchemaTypes.ProjectMember,
          "id" | "accountId" | "isResponsibleInstaller"
        > & {
            readonly account?: SchemaTypes.Maybe<
              { readonly __typename?: "Account" } & Pick<
                SchemaTypes.Account,
                "id" | "firstName" | "lastName" | "role"
              > & {
                  readonly certificationsByDoceboUserId: {
                    readonly __typename?: "CertificationsConnection";
                  } & {
                    readonly nodes: ReadonlyArray<
                      { readonly __typename?: "Certification" } & Pick<
                        SchemaTypes.Certification,
                        "name" | "technology"
                      >
                    >;
                  };
                }
            >;
          }
      >;
    };
    readonly company?: SchemaTypes.Maybe<
      { readonly __typename?: "Company" } & Pick<
        SchemaTypes.Company,
        "id" | "name" | "tier"
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
      | "hidden"
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
            | "id"
            | "firstLine"
            | "secondLine"
            | "town"
            | "region"
            | "country"
            | "postcode"
          >
        >;
        readonly buildingOwnerAddress?: SchemaTypes.Maybe<
          { readonly __typename?: "Address" } & Pick<
            SchemaTypes.Address,
            | "id"
            | "firstLine"
            | "secondLine"
            | "town"
            | "region"
            | "country"
            | "postcode"
          >
        >;
        readonly guarantees: {
          readonly __typename?: "GuaranteesConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "Guarantee" } & Pick<
              SchemaTypes.Guarantee,
              | "id"
              | "guaranteeReferenceCode"
              | "reviewerAccountId"
              | "coverage"
              | "languageCode"
              | "fileStorageId"
              | "signedFileStorageUrl"
              | "status"
            > & {
                readonly guaranteeType?: SchemaTypes.Maybe<
                  { readonly __typename?: "ContentfulGuaranteeType" } & Pick<
                    SchemaTypes.ContentfulGuaranteeType,
                    | "name"
                    | "coverage"
                    | "displayName"
                    | "technology"
                    | "tiersAvailable"
                  > & {
                      readonly sys: {
                        readonly __typename?: "ContentfulSys";
                      } & Pick<SchemaTypes.ContentfulSys, "id">;
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
                                  "referenceCode" | "name" | "minimumUploads"
                                > & {
                                    readonly sys: {
                                      readonly __typename?: "ContentfulSys";
                                    } & Pick<SchemaTypes.ContentfulSys, "id">;
                                  }
                              >
                            >
                          >;
                        }
                      >;
                    }
                >;
                readonly productByProductBmiRef?: SchemaTypes.Maybe<
                  { readonly __typename?: "Product" } & Pick<
                    SchemaTypes.Product,
                    "id" | "name" | "brand" | "family" | "description"
                  >
                >;
                readonly systemBySystemBmiRef?: SchemaTypes.Maybe<
                  { readonly __typename?: "System" } & Pick<
                    SchemaTypes.System,
                    "id" | "name" | "description"
                  > & {
                      readonly systemMembersBySystemBmiRef: {
                        readonly __typename?: "SystemMembersConnection";
                      } & {
                        readonly nodes: ReadonlyArray<
                          { readonly __typename?: "SystemMember" } & Pick<
                            SchemaTypes.SystemMember,
                            "id"
                          > & {
                              readonly productByProductBmiRef?: SchemaTypes.Maybe<
                                { readonly __typename?: "Product" } & Pick<
                                  SchemaTypes.Product,
                                  | "id"
                                  | "name"
                                  | "brand"
                                  | "family"
                                  | "description"
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
        readonly evidenceItems: {
          readonly __typename?: "EvidenceItemsConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "EvidenceItem" } & Pick<
              SchemaTypes.EvidenceItem,
              | "id"
              | "name"
              | "signedUrl"
              | "guaranteeId"
              | "evidenceCategoryType"
              | "customEvidenceCategoryKey"
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
              "id" | "body" | "authorId" | "createdAt"
            > & {
                readonly author?: SchemaTypes.Maybe<
                  { readonly __typename?: "Account" } & Pick<
                    SchemaTypes.Account,
                    "firstName" | "lastName"
                  >
                >;
              }
          >;
        };
        readonly projectMembers: {
          readonly __typename?: "ProjectMembersConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "ProjectMember" } & Pick<
              SchemaTypes.ProjectMember,
              "id" | "accountId" | "isResponsibleInstaller"
            > & {
                readonly account?: SchemaTypes.Maybe<
                  { readonly __typename?: "Account" } & Pick<
                    SchemaTypes.Account,
                    "id" | "firstName" | "lastName" | "role"
                  > & {
                      readonly certificationsByDoceboUserId: {
                        readonly __typename?: "CertificationsConnection";
                      } & {
                        readonly nodes: ReadonlyArray<
                          { readonly __typename?: "Certification" } & Pick<
                            SchemaTypes.Certification,
                            "name" | "technology"
                          >
                        >;
                      };
                    }
                >;
              }
          >;
        };
        readonly company?: SchemaTypes.Maybe<
          { readonly __typename?: "Company" } & Pick<
            SchemaTypes.Company,
            "id" | "name" | "tier"
          >
        >;
      }
  >;
};

export type ProjectDetailsProductFragmentFragment = {
  readonly __typename?: "Product";
} & Pick<
  SchemaTypes.Product,
  "id" | "name" | "brand" | "family" | "description"
>;

export type CreateGuaranteeMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateGuaranteeInput;
}>;

export type CreateGuaranteeMutation = { readonly __typename?: "Mutation" } & {
  readonly createGuarantee?: SchemaTypes.Maybe<
    { readonly __typename?: "CreateGuaranteePayload" } & {
      readonly guarantee?: SchemaTypes.Maybe<
        { readonly __typename?: "Guarantee" } & Pick<
          SchemaTypes.Guarantee,
          "id" | "coverage" | "status"
        >
      >;
    }
  >;
};

export type CreateGuaranteePdfMutationVariables = SchemaTypes.Exact<{
  id: SchemaTypes.Scalars["Int"];
}>;

export type CreateGuaranteePdfMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly createGuaranteePdf?: SchemaTypes.Maybe<
    { readonly __typename?: "PublishOutput" } & Pick<
      SchemaTypes.PublishOutput,
      "messageId"
    >
  >;
};

export type UpdateGuaranteeMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateGuaranteeInput;
}>;

export type UpdateGuaranteeMutation = { readonly __typename?: "Mutation" } & {
  readonly updateGuarantee?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateGuaranteePayload" } & {
      readonly guarantee?: SchemaTypes.Maybe<
        { readonly __typename?: "Guarantee" } & Pick<
          SchemaTypes.Guarantee,
          "id" | "coverage" | "status"
        >
      >;
    }
  >;
};

export type AddProjectNoteMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateNoteInput;
}>;

export type AddProjectNoteMutation = { readonly __typename?: "Mutation" } & {
  readonly createNote?: SchemaTypes.Maybe<
    { readonly __typename?: "CreateNotePayload" } & {
      readonly note?: SchemaTypes.Maybe<
        { readonly __typename?: "Note" } & Pick<SchemaTypes.Note, "id">
      >;
    }
  >;
};

export type DeleteProjectMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.DeleteProjectMemberInput;
}>;

export type DeleteProjectMemberMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly deleteProjectMember?: SchemaTypes.Maybe<
    { readonly __typename?: "DeleteProjectMemberPayload" } & {
      readonly projectMember?: SchemaTypes.Maybe<
        { readonly __typename?: "ProjectMember" } & Pick<
          SchemaTypes.ProjectMember,
          "id" | "accountId" | "isResponsibleInstaller"
        > & {
            readonly account?: SchemaTypes.Maybe<
              { readonly __typename?: "Account" } & Pick<
                SchemaTypes.Account,
                "id" | "firstName" | "lastName" | "role"
              > & {
                  readonly certificationsByDoceboUserId: {
                    readonly __typename?: "CertificationsConnection";
                  } & {
                    readonly nodes: ReadonlyArray<
                      { readonly __typename?: "Certification" } & Pick<
                        SchemaTypes.Certification,
                        "name" | "technology"
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

export type GetProjectCompanyMembersQueryVariables = SchemaTypes.Exact<{
  existAccounts?: SchemaTypes.Maybe<
    ReadonlyArray<SchemaTypes.Scalars["Int"]> | SchemaTypes.Scalars["Int"]
  >;
}>;

export type GetProjectCompanyMembersQuery = {
  readonly __typename?: "Query";
} & {
  readonly companyMembers?: SchemaTypes.Maybe<
    { readonly __typename?: "CompanyMembersConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "CompanyMember" } & Pick<
          SchemaTypes.CompanyMember,
          "id" | "accountId"
        > & {
            readonly account?: SchemaTypes.Maybe<
              { readonly __typename?: "Account" } & Pick<
                SchemaTypes.Account,
                "id" | "firstName" | "lastName" | "email"
              > & {
                  readonly certificationsByDoceboUserId: {
                    readonly __typename?: "CertificationsConnection";
                  } & {
                    readonly nodes: ReadonlyArray<
                      { readonly __typename?: "Certification" } & Pick<
                        SchemaTypes.Certification,
                        "technology"
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

export type CreateProjectMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateProjectMemberInput;
}>;

export type CreateProjectMemberMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly createProjectMember?: SchemaTypes.Maybe<
    { readonly __typename?: "CreateProjectMemberPayload" } & {
      readonly projectMember?: SchemaTypes.Maybe<
        { readonly __typename?: "ProjectMember" } & Pick<
          SchemaTypes.ProjectMember,
          "id" | "accountId" | "isResponsibleInstaller"
        > & {
            readonly account?: SchemaTypes.Maybe<
              { readonly __typename?: "Account" } & Pick<
                SchemaTypes.Account,
                "id" | "firstName" | "lastName" | "role"
              > & {
                  readonly certificationsByDoceboUserId: {
                    readonly __typename?: "CertificationsConnection";
                  } & {
                    readonly nodes: ReadonlyArray<
                      { readonly __typename?: "Certification" } & Pick<
                        SchemaTypes.Certification,
                        "name" | "technology"
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

export type AddProjectsMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.ProjectMembersAddInput;
}>;

export type AddProjectsMemberMutation = { readonly __typename?: "Mutation" } & {
  readonly projectMembersAdd?: SchemaTypes.Maybe<
    { readonly __typename?: "ProjectMembersAddPayload" } & {
      readonly projectMembers?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "ProjectMember" } & Pick<
            SchemaTypes.ProjectMember,
            "projectId" | "accountId"
          >
        >
      >;
    }
  >;
};

export type UpdateProjectMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProjectMemberInput;
  projectId: SchemaTypes.Scalars["Int"];
}>;

export type UpdateProjectMemberMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly updateProjectMember?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateProjectMemberPayload" } & {
      readonly projectMember?: SchemaTypes.Maybe<
        { readonly __typename?: "ProjectMember" } & Pick<
          SchemaTypes.ProjectMember,
          "id" | "projectId" | "isResponsibleInstaller"
        >
      >;
      readonly query?: SchemaTypes.Maybe<
        { readonly __typename?: "Query" } & {
          readonly projectMembers?: SchemaTypes.Maybe<
            { readonly __typename?: "ProjectMembersConnection" } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "ProjectMember" } & Pick<
                  SchemaTypes.ProjectMember,
                  "id" | "accountId" | "isResponsibleInstaller"
                > & {
                    readonly account?: SchemaTypes.Maybe<
                      { readonly __typename?: "Account" } & Pick<
                        SchemaTypes.Account,
                        "id" | "firstName" | "lastName" | "role"
                      > & {
                          readonly certificationsByDoceboUserId: {
                            readonly __typename?: "CertificationsConnection";
                          } & {
                            readonly nodes: ReadonlyArray<
                              { readonly __typename?: "Certification" } & Pick<
                                SchemaTypes.Certification,
                                "name" | "technology"
                              >
                            >;
                          };
                        }
                    >;
                  }
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type ProjectMemberDetailsFragmentFragment = {
  readonly __typename?: "ProjectMember";
} & Pick<
  SchemaTypes.ProjectMember,
  "id" | "accountId" | "isResponsibleInstaller"
> & {
    readonly account?: SchemaTypes.Maybe<
      { readonly __typename?: "Account" } & Pick<
        SchemaTypes.Account,
        "id" | "firstName" | "lastName" | "role"
      > & {
          readonly certificationsByDoceboUserId: {
            readonly __typename?: "CertificationsConnection";
          } & {
            readonly nodes: ReadonlyArray<
              { readonly __typename?: "Certification" } & Pick<
                SchemaTypes.Certification,
                "name" | "technology"
              >
            >;
          };
        }
    >;
  };

export type AddEvidencesMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.EvidenceItemsAddInput;
}>;

export type AddEvidencesMutation = { readonly __typename?: "Mutation" } & {
  readonly evidenceItemsAdd?: SchemaTypes.Maybe<
    { readonly __typename?: "EvidenceItemsAddPayload" } & {
      readonly evidenceItems?: SchemaTypes.Maybe<
        ReadonlyArray<
          { readonly __typename?: "EvidenceItem" } & Pick<
            SchemaTypes.EvidenceItem,
            "id" | "name"
          >
        >
      >;
    }
  >;
};

export type ContentfulEvidenceCategoriesQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type ContentfulEvidenceCategoriesQuery = {
  readonly __typename?: "Query";
} & {
  readonly evidenceCategoryCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "EvidenceCategoryCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "EvidenceCategory" } & Pick<
            SchemaTypes.EvidenceCategory,
            "name" | "referenceCode" | "minimumUploads"
          > & {
              readonly sys: { readonly __typename?: "Sys" } & Pick<
                SchemaTypes.Sys,
                "id"
              >;
            }
        >
      >;
    }
  >;
};

export type GetGuaranteeTemplatesQueryVariables = SchemaTypes.Exact<{
  technology: SchemaTypes.Scalars["String"];
  coverage: SchemaTypes.Scalars["String"];
  language?: SchemaTypes.Maybe<SchemaTypes.Scalars["String"]>;
}>;

export type GetGuaranteeTemplatesQuery = { readonly __typename?: "Query" } & {
  readonly guaranteeTemplateCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "GuaranteeTemplateCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "GuaranteeTemplate" } & Pick<
            SchemaTypes.GuaranteeTemplate,
            "displayName" | "languageCode" | "coverage"
          > & {
              readonly sys: { readonly __typename?: "Sys" } & Pick<
                SchemaTypes.Sys,
                "id"
              >;
            }
        >
      >;
    }
  >;
};

export type SearchProductsQueryVariables = SchemaTypes.Exact<{
  query: SchemaTypes.Scalars["String"];
  technology: SchemaTypes.Technology;
}>;

export type SearchProductsQuery = { readonly __typename?: "Query" } & {
  readonly searchProducts?: SchemaTypes.Maybe<
    { readonly __typename?: "ProductsConnection" } & Pick<
      SchemaTypes.ProductsConnection,
      "totalCount"
    > & {
        readonly nodes: ReadonlyArray<
          { readonly __typename?: "Product" } & Pick<
            SchemaTypes.Product,
            | "id"
            | "technology"
            | "name"
            | "description"
            | "published"
            | "brand"
            | "family"
            | "bmiRef"
          >
        >;
      }
  >;
};

export type SearchSystemsQueryVariables = SchemaTypes.Exact<{
  query: SchemaTypes.Scalars["String"];
  technology: SchemaTypes.Technology;
}>;

export type SearchSystemsQuery = { readonly __typename?: "Query" } & {
  readonly searchSystems?: SchemaTypes.Maybe<
    { readonly __typename?: "SystemsConnection" } & Pick<
      SchemaTypes.SystemsConnection,
      "totalCount"
    > & {
        readonly nodes: ReadonlyArray<
          { readonly __typename?: "System" } & Pick<
            SchemaTypes.System,
            "id" | "technology" | "name" | "description" | "bmiRef"
          > & {
              readonly systemMembersBySystemBmiRef: {
                readonly __typename?: "SystemMembersConnection";
              } & {
                readonly nodes: ReadonlyArray<
                  { readonly __typename?: "SystemMember" } & Pick<
                    SchemaTypes.SystemMember,
                    "id"
                  > & {
                      readonly productByProductBmiRef?: SchemaTypes.Maybe<
                        { readonly __typename?: "Product" } & Pick<
                          SchemaTypes.Product,
                          "id" | "name" | "family" | "brand"
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

export type GetProductGuaranteeTypesQueryVariables = SchemaTypes.Exact<{
  technology?: SchemaTypes.Maybe<SchemaTypes.Scalars["String"]>;
}>;

export type GetProductGuaranteeTypesQuery = {
  readonly __typename?: "Query";
} & {
  readonly guaranteeTypeCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "GuaranteeTypeCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "GuaranteeType" } & Pick<
            SchemaTypes.GuaranteeType,
            | "guaranteeReferenceCode"
            | "name"
            | "displayName"
            | "technology"
            | "coverage"
            | "ranking"
            | "tiersAvailable"
          > & {
              readonly sys: { readonly __typename?: "Sys" } & Pick<
                SchemaTypes.Sys,
                "id"
              >;
              readonly evidenceCategoriesCollection?: SchemaTypes.Maybe<
                {
                  readonly __typename?: "GuaranteeTypeEvidenceCategoriesCollection";
                } & {
                  readonly items: ReadonlyArray<
                    SchemaTypes.Maybe<
                      { readonly __typename?: "EvidenceCategory" } & Pick<
                        SchemaTypes.EvidenceCategory,
                        "name" | "referenceCode" | "minimumUploads"
                      >
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
            | "id"
            | "domain"
            | "language"
            | "projectsEnabled"
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
                  "id" | "status" | "name" | "tier"
                >
              >;
            }
          >;
        };
        readonly projectMembers: {
          readonly __typename?: "ProjectMembersConnection";
        } & Pick<SchemaTypes.ProjectMembersConnection, "totalCount">;
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

export type GetMarketsByDomainQueryVariables = SchemaTypes.Exact<{
  domain: SchemaTypes.Scalars["String"];
}>;

export type GetMarketsByDomainQuery = { readonly __typename?: "Query" } & {
  readonly markets?: SchemaTypes.Maybe<
    { readonly __typename?: "MarketsConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Market" } & Pick<
          SchemaTypes.Market,
          | "id"
          | "name"
          | "cmsSpaceId"
          | "language"
          | "domain"
          | "doceboCatalogueId"
          | "doceboInstallersBranchId"
          | "doceboCompanyAdminBranchId"
          | "merchandisingUrl"
          | "projectsEnabled"
          | "gtag"
          | "sendName"
          | "sendMailbox"
          | "locationBiasRadiusKm"
        > & {
            readonly geoMiddle?: SchemaTypes.Maybe<
              { readonly __typename?: "Point" } & Pick<
                SchemaTypes.Point,
                "x" | "y"
              >
            >;
          }
      >;
    }
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
> & {
    readonly sys: { readonly __typename?: "Sys" } & Pick<SchemaTypes.Sys, "id">;
  };

export type GetMediaFoldersQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetMediaFoldersQuery = { readonly __typename?: "Query" } & {
  readonly marketContentCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "MarketContentCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "MarketContent" } & {
            readonly mediaLibraryRootCollection?: SchemaTypes.Maybe<
              {
                readonly __typename?: "MarketContentMediaLibraryRootCollection";
              } & {
                readonly items: ReadonlyArray<
                  SchemaTypes.Maybe<
                    { readonly __typename?: "MediaFolder" } & Pick<
                      SchemaTypes.MediaFolder,
                      "name"
                    > & {
                        readonly sys: { readonly __typename?: "Sys" } & Pick<
                          SchemaTypes.Sys,
                          "id"
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
  readonly mediaFolderCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "MediaFolderCollection" } & Pick<
      SchemaTypes.MediaFolderCollection,
      "total"
    > & {
        readonly items: ReadonlyArray<
          SchemaTypes.Maybe<
            { readonly __typename?: "MediaFolder" } & Pick<
              SchemaTypes.MediaFolder,
              "name"
            > & {
                readonly sys: { readonly __typename?: "Sys" } & Pick<
                  SchemaTypes.Sys,
                  "id"
                >;
                readonly childrenCollection?: SchemaTypes.Maybe<
                  {
                    readonly __typename?: "MediaFolderChildrenCollection";
                  } & Pick<
                    SchemaTypes.MediaFolderChildrenCollection,
                    "total"
                  > & {
                      readonly items: ReadonlyArray<
                        SchemaTypes.Maybe<
                          | ({ readonly __typename: "MediaFolder" } & Pick<
                              SchemaTypes.MediaFolder,
                              "name"
                            > & {
                                readonly sys: {
                                  readonly __typename?: "Sys";
                                } & Pick<SchemaTypes.Sys, "id">;
                              })
                          | ({ readonly __typename: "MediaTool" } & Pick<
                              SchemaTypes.MediaTool,
                              "name"
                            > & {
                                readonly sys: {
                                  readonly __typename?: "Sys";
                                } & Pick<SchemaTypes.Sys, "id">;
                              })
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

export type MediaToolDetailsFragment = {
  readonly __typename: "MediaTool";
} & Pick<SchemaTypes.MediaTool, "name" | "url"> & {
    readonly sys: { readonly __typename?: "Sys" } & Pick<SchemaTypes.Sys, "id">;
    readonly media?: SchemaTypes.Maybe<
      { readonly __typename?: "Asset" } & Pick<
        SchemaTypes.Asset,
        | "title"
        | "description"
        | "contentType"
        | "fileName"
        | "size"
        | "url"
        | "width"
        | "height"
      > & {
          readonly sys: { readonly __typename?: "Sys" } & Pick<
            SchemaTypes.Sys,
            "id"
          >;
        }
    >;
    readonly thumbnail?: SchemaTypes.Maybe<
      { readonly __typename?: "Asset" } & Pick<
        SchemaTypes.Asset,
        | "title"
        | "description"
        | "contentType"
        | "fileName"
        | "size"
        | "url"
        | "width"
        | "height"
      > & {
          readonly sys: { readonly __typename?: "Sys" } & Pick<
            SchemaTypes.Sys,
            "id"
          >;
        }
    >;
  };

export type GetMediaItemByIdQueryVariables = SchemaTypes.Exact<{
  mediaItemId: SchemaTypes.Scalars["String"];
}>;

export type GetMediaItemByIdQuery = { readonly __typename?: "Query" } & {
  readonly mediaFolderCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "MediaFolderCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "MediaFolder" } & Pick<
            SchemaTypes.MediaFolder,
            "name"
          > & {
              readonly sys: { readonly __typename?: "Sys" } & Pick<
                SchemaTypes.Sys,
                "id"
              >;
              readonly childrenCollection?: SchemaTypes.Maybe<
                {
                  readonly __typename?: "MediaFolderChildrenCollection";
                } & Pick<SchemaTypes.MediaFolderChildrenCollection, "total"> & {
                    readonly items: ReadonlyArray<
                      SchemaTypes.Maybe<
                        | ({ readonly __typename: "MediaFolder" } & Pick<
                            SchemaTypes.MediaFolder,
                            "name"
                          > & {
                              readonly sys: {
                                readonly __typename?: "Sys";
                              } & Pick<SchemaTypes.Sys, "id">;
                            })
                        | ({ readonly __typename: "MediaTool" } & Pick<
                            SchemaTypes.MediaTool,
                            "name" | "url"
                          > & {
                              readonly sys: {
                                readonly __typename?: "Sys";
                              } & Pick<SchemaTypes.Sys, "id">;
                              readonly thumbnail?: SchemaTypes.Maybe<
                                { readonly __typename?: "Asset" } & Pick<
                                  SchemaTypes.Asset,
                                  | "title"
                                  | "description"
                                  | "contentType"
                                  | "fileName"
                                  | "size"
                                  | "url"
                                  | "width"
                                  | "height"
                                > & {
                                    readonly sys: {
                                      readonly __typename?: "Sys";
                                    } & Pick<SchemaTypes.Sys, "id">;
                                  }
                              >;
                              readonly media?: SchemaTypes.Maybe<
                                { readonly __typename?: "Asset" } & Pick<
                                  SchemaTypes.Asset,
                                  | "title"
                                  | "description"
                                  | "contentType"
                                  | "fileName"
                                  | "size"
                                  | "url"
                                  | "width"
                                  | "height"
                                > & {
                                    readonly sys: {
                                      readonly __typename?: "Sys";
                                    } & Pick<SchemaTypes.Sys, "id">;
                                  }
                              >;
                            })
                      >
                    >;
                  }
              >;
            }
        >
      >;
    }
  >;
  readonly mediaToolCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "MediaToolCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "MediaTool" } & Pick<
            SchemaTypes.MediaTool,
            "name" | "url"
          > & {
              readonly sys: { readonly __typename?: "Sys" } & Pick<
                SchemaTypes.Sys,
                "id"
              >;
              readonly media?: SchemaTypes.Maybe<
                { readonly __typename?: "Asset" } & Pick<
                  SchemaTypes.Asset,
                  | "title"
                  | "description"
                  | "contentType"
                  | "fileName"
                  | "size"
                  | "url"
                  | "width"
                  | "height"
                > & {
                    readonly sys: { readonly __typename?: "Sys" } & Pick<
                      SchemaTypes.Sys,
                      "id"
                    >;
                  }
              >;
              readonly thumbnail?: SchemaTypes.Maybe<
                { readonly __typename?: "Asset" } & Pick<
                  SchemaTypes.Asset,
                  | "title"
                  | "description"
                  | "contentType"
                  | "fileName"
                  | "size"
                  | "url"
                  | "width"
                  | "height"
                > & {
                    readonly sys: { readonly __typename?: "Sys" } & Pick<
                      SchemaTypes.Sys,
                      "id"
                    >;
                  }
              >;
            }
        >
      >;
    }
  >;
};

export type AccountInfoByEmailQueryVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type AccountInfoByEmailQuery = { readonly __typename?: "Query" } & {
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
            "id" | "domain" | "projectsEnabled"
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
                  "id" | "status" | "name" | "tier"
                >
              >;
            }
          >;
        };
        readonly projectMembers: {
          readonly __typename?: "ProjectMembersConnection";
        } & Pick<SchemaTypes.ProjectMembersConnection, "totalCount">;
      }
  >;
};

export type GetContentArticleContentQueryVariables = SchemaTypes.Exact<{
  relativePath: SchemaTypes.Scalars["String"];
}>;

export type GetContentArticleContentQuery = {
  readonly __typename?: "Query";
} & {
  readonly contentArticleCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "ContentArticleCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "ContentArticle" } & Pick<
            SchemaTypes.ContentArticle,
            "title"
          > & {
              readonly body?: SchemaTypes.Maybe<
                { readonly __typename?: "ContentArticleBody" } & Pick<
                  SchemaTypes.ContentArticleBody,
                  "json"
                >
              >;
            }
        >
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
          | "name"
          | "brand"
          | "family"
          | "bmiRef"
          | "updatedAt"
          | "published"
          | "technology"
          | "description"
          | "maximumValidityYears"
        >
      >;
    }
  >;
  readonly systems?: SchemaTypes.Maybe<
    { readonly __typename?: "SystemsConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "System" } & Pick<
          SchemaTypes.System,
          | "id"
          | "name"
          | "bmiRef"
          | "published"
          | "updatedAt"
          | "technology"
          | "description"
          | "maximumValidityYears"
        >
      >;
    }
  >;
};

export type CompanyPageDetailsFragmentFragment = {
  readonly __typename?: "Company";
} & Pick<
  SchemaTypes.Company,
  | "id"
  | "status"
  | "isProfileComplete"
  | "name"
  | "businessType"
  | "logo"
  | "aboutUs"
  | "ownerFullname"
  | "ownerPhone"
  | "ownerEmail"
  | "phone"
  | "publicEmail"
  | "website"
  | "facebook"
  | "linkedIn"
  | "referenceNumber"
  | "taxNumber"
  | "tier"
  | "certifications"
> & {
    readonly tradingAddress?: SchemaTypes.Maybe<
      { readonly __typename?: "Address" } & Pick<
        SchemaTypes.Address,
        | "id"
        | "firstLine"
        | "secondLine"
        | "town"
        | "region"
        | "country"
        | "postcode"
      > & {
          readonly coordinates?: SchemaTypes.Maybe<
            { readonly __typename?: "Point" } & Pick<
              SchemaTypes.Point,
              "x" | "y"
            >
          >;
        }
    >;
    readonly registeredAddress?: SchemaTypes.Maybe<
      { readonly __typename?: "Address" } & Pick<
        SchemaTypes.Address,
        | "id"
        | "firstLine"
        | "secondLine"
        | "town"
        | "region"
        | "country"
        | "postcode"
      >
    >;
    readonly companyOperationsByCompany: {
      readonly __typename?: "CompanyOperationsConnection";
    } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "CompanyOperation" } & Pick<
          SchemaTypes.CompanyOperation,
          "id" | "operation"
        >
      >;
    };
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

export type GetCompaniesByMarketQueryVariables = SchemaTypes.Exact<{
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompaniesByMarketQuery = { readonly __typename?: "Query" } & {
  readonly companies?: SchemaTypes.Maybe<
    { readonly __typename?: "CompaniesConnection" } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Company" } & Pick<
          SchemaTypes.Company,
          | "id"
          | "status"
          | "isProfileComplete"
          | "name"
          | "businessType"
          | "logo"
          | "aboutUs"
          | "ownerFullname"
          | "ownerPhone"
          | "ownerEmail"
          | "phone"
          | "publicEmail"
          | "website"
          | "facebook"
          | "linkedIn"
          | "referenceNumber"
          | "taxNumber"
          | "tier"
          | "certifications"
        > & {
            readonly tradingAddress?: SchemaTypes.Maybe<
              { readonly __typename?: "Address" } & Pick<
                SchemaTypes.Address,
                | "id"
                | "firstLine"
                | "secondLine"
                | "town"
                | "region"
                | "country"
                | "postcode"
              > & {
                  readonly coordinates?: SchemaTypes.Maybe<
                    { readonly __typename?: "Point" } & Pick<
                      SchemaTypes.Point,
                      "x" | "y"
                    >
                  >;
                }
            >;
            readonly registeredAddress?: SchemaTypes.Maybe<
              { readonly __typename?: "Address" } & Pick<
                SchemaTypes.Address,
                | "id"
                | "firstLine"
                | "secondLine"
                | "town"
                | "region"
                | "country"
                | "postcode"
              >
            >;
            readonly companyOperationsByCompany: {
              readonly __typename?: "CompanyOperationsConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "CompanyOperation" } & Pick<
                  SchemaTypes.CompanyOperation,
                  "id" | "operation"
                >
              >;
            };
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
          }
      >;
    }
  >;
  readonly contactDetailsCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "ContactDetailsCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "ContactDetails" } & Pick<
            SchemaTypes.ContactDetails,
            "fullName" | "subHeading" | "email" | "phoneNumber"
          >
        >
      >;
    }
  >;
};

export type GetCompanyQueryVariables = SchemaTypes.Exact<{
  companyId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompanyQuery = { readonly __typename?: "Query" } & {
  readonly company?: SchemaTypes.Maybe<
    { readonly __typename?: "Company" } & Pick<
      SchemaTypes.Company,
      | "id"
      | "status"
      | "isProfileComplete"
      | "name"
      | "businessType"
      | "logo"
      | "aboutUs"
      | "ownerFullname"
      | "ownerPhone"
      | "ownerEmail"
      | "phone"
      | "publicEmail"
      | "website"
      | "facebook"
      | "linkedIn"
      | "referenceNumber"
      | "taxNumber"
      | "tier"
      | "certifications"
    > & {
        readonly tradingAddress?: SchemaTypes.Maybe<
          { readonly __typename?: "Address" } & Pick<
            SchemaTypes.Address,
            | "id"
            | "firstLine"
            | "secondLine"
            | "town"
            | "region"
            | "country"
            | "postcode"
          > & {
              readonly coordinates?: SchemaTypes.Maybe<
                { readonly __typename?: "Point" } & Pick<
                  SchemaTypes.Point,
                  "x" | "y"
                >
              >;
            }
        >;
        readonly registeredAddress?: SchemaTypes.Maybe<
          { readonly __typename?: "Address" } & Pick<
            SchemaTypes.Address,
            | "id"
            | "firstLine"
            | "secondLine"
            | "town"
            | "region"
            | "country"
            | "postcode"
          >
        >;
        readonly companyOperationsByCompany: {
          readonly __typename?: "CompanyOperationsConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "CompanyOperation" } & Pick<
              SchemaTypes.CompanyOperation,
              "id" | "operation"
            >
          >;
        };
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
      }
  >;
  readonly contactDetailsCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "ContactDetailsCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "ContactDetails" } & Pick<
            SchemaTypes.ContactDetails,
            "fullName" | "subHeading" | "email" | "phoneNumber"
          >
        >
      >;
    }
  >;
};

export type GetPartnerBrandsQueryVariables = SchemaTypes.Exact<{
  role: SchemaTypes.Scalars["String"];
  tier: SchemaTypes.Scalars["String"];
}>;

export type GetPartnerBrandsQuery = { readonly __typename?: "Query" } & {
  readonly marketContentCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "MarketContentCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "MarketContent" } & Pick<
            SchemaTypes.MarketContent,
            "newsItemUrl" | "newsItemCta" | "newsItemHeading"
          > & {
              readonly partnerBrandsCollection?: SchemaTypes.Maybe<
                {
                  readonly __typename?: "MarketContentPartnerBrandsCollection";
                } & {
                  readonly items: ReadonlyArray<
                    SchemaTypes.Maybe<
                      { readonly __typename?: "PartnerBrand" } & Pick<
                        SchemaTypes.PartnerBrand,
                        "name" | "shortDescription" | "websiteUrl"
                      > & {
                          readonly description?: SchemaTypes.Maybe<
                            {
                              readonly __typename?: "PartnerBrandDescription";
                            } & Pick<
                              SchemaTypes.PartnerBrandDescription,
                              "json"
                            >
                          >;
                          readonly image?: SchemaTypes.Maybe<
                            { readonly __typename?: "Asset" } & Pick<
                              SchemaTypes.Asset,
                              | "title"
                              | "description"
                              | "contentType"
                              | "fileName"
                              | "size"
                              | "url"
                              | "width"
                              | "height"
                            > & {
                                readonly sys: {
                                  readonly __typename?: "Sys";
                                } & Pick<SchemaTypes.Sys, "id">;
                              }
                          >;
                          readonly logo?: SchemaTypes.Maybe<
                            { readonly __typename?: "Asset" } & Pick<
                              SchemaTypes.Asset,
                              | "title"
                              | "description"
                              | "contentType"
                              | "fileName"
                              | "size"
                              | "url"
                              | "width"
                              | "height"
                            > & {
                                readonly sys: {
                                  readonly __typename?: "Sys";
                                } & Pick<SchemaTypes.Sys, "id">;
                              }
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
  readonly carouselCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "CarouselCollection" } & Pick<
      SchemaTypes.CarouselCollection,
      "total"
    > & {
        readonly items: ReadonlyArray<
          SchemaTypes.Maybe<
            { readonly __typename?: "Carousel" } & Pick<
              SchemaTypes.Carousel,
              "audienceRole"
            > & {
                readonly listCollection?: SchemaTypes.Maybe<
                  { readonly __typename?: "CarouselListCollection" } & Pick<
                    SchemaTypes.CarouselListCollection,
                    "total"
                  > & {
                      readonly items: ReadonlyArray<
                        SchemaTypes.Maybe<
                          { readonly __typename?: "CarouselItem" } & Pick<
                            SchemaTypes.CarouselItem,
                            "header" | "body" | "cta" | "audienceTiers"
                          > & {
                              readonly image?: SchemaTypes.Maybe<
                                { readonly __typename?: "Asset" } & Pick<
                                  SchemaTypes.Asset,
                                  "title" | "description" | "url"
                                >
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
  readonly tierBenefitCollection?: SchemaTypes.Maybe<
    { readonly __typename?: "TierBenefitCollection" } & {
      readonly items: ReadonlyArray<
        SchemaTypes.Maybe<
          { readonly __typename?: "TierBenefit" } & Pick<
            SchemaTypes.TierBenefit,
            "name"
          > & {
              readonly description?: SchemaTypes.Maybe<
                { readonly __typename?: "TierBenefitDescription" } & Pick<
                  SchemaTypes.TierBenefitDescription,
                  "json"
                >
              >;
            }
        >
      >;
    }
  >;
};

export type AccountPageDetailsFragmentFragment = {
  readonly __typename?: "Account";
} & Pick<
  SchemaTypes.Account,
  | "id"
  | "firstName"
  | "lastName"
  | "role"
  | "email"
  | "phone"
  | "photo"
  | "signedPhotoUrl"
> & {
    readonly companyMembers: {
      readonly __typename?: "CompanyMembersConnection";
    } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "CompanyMember" } & {
          readonly company?: SchemaTypes.Maybe<
            { readonly __typename?: "Company" } & Pick<
              SchemaTypes.Company,
              | "id"
              | "name"
              | "businessType"
              | "logo"
              | "aboutUs"
              | "ownerFullname"
              | "ownerPhone"
              | "ownerEmail"
              | "phone"
              | "publicEmail"
              | "website"
              | "facebook"
              | "linkedIn"
            > & {
                readonly tradingAddress?: SchemaTypes.Maybe<
                  { readonly __typename?: "Address" } & Pick<
                    SchemaTypes.Address,
                    | "id"
                    | "firstLine"
                    | "secondLine"
                    | "town"
                    | "region"
                    | "country"
                    | "postcode"
                  > & {
                      readonly coordinates?: SchemaTypes.Maybe<
                        { readonly __typename?: "Point" } & Pick<
                          SchemaTypes.Point,
                          "x" | "y"
                        >
                      >;
                    }
                >;
              }
          >;
        }
      >;
    };
    readonly certificationsByDoceboUserId: {
      readonly __typename?: "CertificationsConnection";
    } & {
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Certification" } & Pick<
          SchemaTypes.Certification,
          "id" | "technology" | "expiryDate" | "name"
        >
      >;
    };
  };

export type GetUserProfileQueryVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
}>;

export type GetUserProfileQuery = { readonly __typename?: "Query" } & {
  readonly account?: SchemaTypes.Maybe<
    { readonly __typename?: "Account" } & Pick<
      SchemaTypes.Account,
      | "id"
      | "firstName"
      | "lastName"
      | "role"
      | "email"
      | "phone"
      | "photo"
      | "signedPhotoUrl"
    > & {
        readonly companyMembers: {
          readonly __typename?: "CompanyMembersConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "CompanyMember" } & {
              readonly company?: SchemaTypes.Maybe<
                { readonly __typename?: "Company" } & Pick<
                  SchemaTypes.Company,
                  | "id"
                  | "name"
                  | "businessType"
                  | "logo"
                  | "aboutUs"
                  | "ownerFullname"
                  | "ownerPhone"
                  | "ownerEmail"
                  | "phone"
                  | "publicEmail"
                  | "website"
                  | "facebook"
                  | "linkedIn"
                > & {
                    readonly tradingAddress?: SchemaTypes.Maybe<
                      { readonly __typename?: "Address" } & Pick<
                        SchemaTypes.Address,
                        | "id"
                        | "firstLine"
                        | "secondLine"
                        | "town"
                        | "region"
                        | "country"
                        | "postcode"
                      > & {
                          readonly coordinates?: SchemaTypes.Maybe<
                            { readonly __typename?: "Point" } & Pick<
                              SchemaTypes.Point,
                              "x" | "y"
                            >
                          >;
                        }
                    >;
                  }
              >;
            }
          >;
        };
        readonly certificationsByDoceboUserId: {
          readonly __typename?: "CertificationsConnection";
        } & {
          readonly nodes: ReadonlyArray<
            { readonly __typename?: "Certification" } & Pick<
              SchemaTypes.Certification,
              "id" | "technology" | "expiryDate" | "name"
            >
          >;
        };
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
            readonly company?: SchemaTypes.Maybe<
              { readonly __typename?: "Company" } & Pick<
                SchemaTypes.Company,
                "name"
              >
            >;
            readonly guarantees: {
              readonly __typename?: "GuaranteesConnection";
            } & {
              readonly nodes: ReadonlyArray<
                { readonly __typename?: "Guarantee" } & Pick<
                  SchemaTypes.Guarantee,
                  "coverage" | "status" | "reviewerAccountId"
                >
              >;
            };
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
                | "formattedRole"
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

export type UpdateRoleAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateRoleAccountMutation = { readonly __typename?: "Mutation" } & {
  readonly updateAccount?: SchemaTypes.Maybe<
    { readonly __typename?: "UpdateAccountPayload" } & {
      readonly account?: SchemaTypes.Maybe<
        { readonly __typename?: "Account" } & Pick<SchemaTypes.Account, "id">
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
              | "slug"
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
