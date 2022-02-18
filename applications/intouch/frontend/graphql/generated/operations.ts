import type * as SchemaTypes from "@bmi/intouch-api-types";

export type AddressLinesFragmentFragment = {
  readonly __typename?: "Address";
  readonly id: number;
  readonly firstLine?: string | null;
  readonly secondLine?: string | null;
  readonly town?: string | null;
  readonly region?: string | null;
  readonly country?: string | null;
  readonly postcode?: string | null;
  readonly coordinates?: {
    readonly __typename?: "Point";
    readonly x: number;
    readonly y: number;
  } | null;
};

export type CompanyCertificationsFragment = {
  readonly __typename?: "Company";
  readonly certifications: ReadonlyArray<SchemaTypes.Technology | null>;
};

export type UpdateProjectHiddenMutationVariables = SchemaTypes.Exact<{
  projectId: SchemaTypes.Scalars["Int"];
  hidden: SchemaTypes.Scalars["Boolean"];
}>;

export type UpdateProjectHiddenMutation = {
  readonly __typename?: "Mutation";
  readonly updateProject?: {
    readonly __typename?: "UpdateProjectPayload";
    readonly project?: {
      readonly __typename?: "Project";
      readonly id: number;
      readonly hidden?: boolean | null;
    } | null;
  } | null;
};

export type ContactDetailsCollectionFragmentFragment = {
  readonly __typename?: "ContactDetailsCollection";
  readonly items: ReadonlyArray<{
    readonly __typename?: "ContactDetails";
    readonly fullName?: string | null;
    readonly subHeading?: string | null;
    readonly email?: string | null;
    readonly phoneNumber?: string | null;
  } | null>;
};

export type MarkAllNotificationsAsReadMutationVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
}>;

export type MarkAllNotificationsAsReadMutation = {
  readonly __typename?: "Mutation";
  readonly markAllNotificationsAsRead?: {
    readonly __typename?: "MarkAllNotificationsAsReadPayload";
    readonly notifications?: ReadonlyArray<{
      readonly __typename?: "Notification";
      readonly id: number;
      readonly read: boolean;
    }> | null;
  } | null;
};

export type GetGlobalDataQueryVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
}>;

export type GetGlobalDataQuery = {
  readonly __typename?: "Query";
  readonly marketContentCollection?: {
    readonly __typename?: "MarketContentCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "MarketContent";
      readonly externalLinkUrl?: string | null;
      readonly externalLinkLabel?: string | null;
      readonly footerLinksCollection?: {
        readonly __typename?: "MarketContentFooterLinksCollection";
        readonly items: ReadonlyArray<{
          readonly __typename?: "ContentArticle";
          readonly title?: string | null;
          readonly relativePath?: string | null;
        } | null>;
      } | null;
      readonly contactUsPage?: {
        readonly __typename?: "ContentArticle";
        readonly title?: string | null;
        readonly relativePath?: string | null;
      } | null;
    } | null>;
  } | null;
  readonly notifications?: {
    readonly __typename?: "NotificationsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Notification";
      readonly body?: string | null;
      readonly sendDate: any;
      readonly read: boolean;
      readonly id: number;
    }>;
  } | null;
};

export type CompanyAdminsFragmentFragment = {
  readonly __typename?: "Company";
  readonly companyMembers: {
    readonly __typename?: "CompanyMembersConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CompanyMember";
      readonly account?: {
        readonly __typename?: "Account";
        readonly role?: SchemaTypes.Role | null;
        readonly id: number;
        readonly firstName?: string | null;
        readonly lastName?: string | null;
        readonly phone?: string | null;
        readonly email: string;
        readonly photo?: string | null;
      } | null;
    }>;
  };
};

export type CompanyDetailsFragmentFragment = {
  readonly __typename?: "Company";
  readonly name?: string | null;
  readonly businessType?: SchemaTypes.BusinessType | null;
  readonly logo?: string | null;
  readonly aboutUs?: string | null;
  readonly ownerFullname?: string | null;
  readonly ownerPhone?: string | null;
  readonly ownerEmail?: string | null;
  readonly phone?: string | null;
  readonly publicEmail?: string | null;
  readonly website?: string | null;
  readonly facebook?: string | null;
  readonly linkedIn?: string | null;
  readonly tradingAddress?: {
    readonly __typename?: "Address";
    readonly id: number;
    readonly firstLine?: string | null;
    readonly secondLine?: string | null;
    readonly town?: string | null;
    readonly region?: string | null;
    readonly country?: string | null;
    readonly postcode?: string | null;
    readonly coordinates?: {
      readonly __typename?: "Point";
      readonly x: number;
      readonly y: number;
    } | null;
  } | null;
};

export type CompanyDocumentFragmentFragment = {
  readonly __typename?: "CompanyDocument";
  readonly id: number;
  readonly document?: string | null;
  readonly name?: string | null;
  readonly documentType?: SchemaTypes.CompanyDocumentType | null;
  readonly size?: number | null;
  readonly signedDocumentUrl?: string | null;
  readonly createdAt: any;
  readonly updatedAt: any;
};

export type CompanyDocumentsFragmentFragment = {
  readonly __typename?: "Company";
  readonly companyDocuments: {
    readonly __typename?: "CompanyDocumentsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CompanyDocument";
      readonly id: number;
      readonly document?: string | null;
      readonly name?: string | null;
      readonly documentType?: SchemaTypes.CompanyDocumentType | null;
      readonly size?: number | null;
      readonly signedDocumentUrl?: string | null;
      readonly createdAt: any;
      readonly updatedAt: any;
    }>;
  };
};

export type CreateCompanyDocumentsMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateCompanyDocumentsInput;
}>;

export type CreateCompanyDocumentsMutation = {
  readonly __typename?: "Mutation";
  readonly createCompanyDocuments?: {
    readonly __typename?: "CreateCompanyDocumentsPayload";
    readonly companyDocuments?: ReadonlyArray<{
      readonly __typename?: "CompanyDocument";
      readonly id: number;
      readonly document?: string | null;
      readonly name?: string | null;
      readonly documentType?: SchemaTypes.CompanyDocumentType | null;
      readonly size?: number | null;
      readonly signedDocumentUrl?: string | null;
      readonly createdAt: any;
      readonly updatedAt: any;
    }> | null;
  } | null;
};

export type DeleteCompanyDocumentMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.DeleteCompanyDocumentInput;
}>;

export type DeleteCompanyDocumentMutation = {
  readonly __typename?: "Mutation";
  readonly deleteCompanyDocument?: {
    readonly __typename?: "DeleteCompanyDocumentPayload";
    readonly companyDocument?: {
      readonly __typename?: "CompanyDocument";
      readonly id: number;
      readonly document?: string | null;
      readonly createdAt: any;
    } | null;
  } | null;
};

export type UpdateCompanyDetailsMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateCompanyInput;
}>;

export type UpdateCompanyDetailsMutation = {
  readonly __typename?: "Mutation";
  readonly updateCompany?: {
    readonly __typename?: "UpdateCompanyPayload";
    readonly company?: {
      readonly __typename?: "Company";
      readonly id: number;
      readonly status?: SchemaTypes.CompanyStatus | null;
      readonly isProfileComplete: boolean;
      readonly name?: string | null;
      readonly businessType?: SchemaTypes.BusinessType | null;
      readonly logo?: string | null;
      readonly aboutUs?: string | null;
      readonly ownerFullname?: string | null;
      readonly ownerPhone?: string | null;
      readonly ownerEmail?: string | null;
      readonly phone?: string | null;
      readonly publicEmail?: string | null;
      readonly website?: string | null;
      readonly facebook?: string | null;
      readonly linkedIn?: string | null;
      readonly referenceNumber: number;
      readonly taxNumber?: string | null;
      readonly tier?: SchemaTypes.Tier | null;
      readonly certifications: ReadonlyArray<SchemaTypes.Technology | null>;
      readonly tradingAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly registeredAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly companyOperationsByCompany: {
        readonly __typename?: "CompanyOperationsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyOperation";
          readonly id: number;
          readonly operation: SchemaTypes.Operation;
        }>;
      };
      readonly companyMembers: {
        readonly __typename?: "CompanyMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyMember";
          readonly account?: {
            readonly __typename?: "Account";
            readonly role?: SchemaTypes.Role | null;
            readonly id: number;
            readonly firstName?: string | null;
            readonly lastName?: string | null;
            readonly phone?: string | null;
            readonly email: string;
            readonly photo?: string | null;
          } | null;
        }>;
      };
      readonly companyDocuments: {
        readonly __typename?: "CompanyDocumentsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyDocument";
          readonly id: number;
          readonly document?: string | null;
          readonly name?: string | null;
          readonly documentType?: SchemaTypes.CompanyDocumentType | null;
          readonly size?: number | null;
          readonly signedDocumentUrl?: string | null;
          readonly createdAt: any;
          readonly updatedAt: any;
        }>;
      };
    } | null;
  } | null;
};

export type InviteMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.InviteInput;
}>;

export type InviteMutation = {
  readonly __typename?: "Mutation";
  readonly invite?: ReadonlyArray<{
    readonly __typename?: "Invitation";
    readonly id: number;
    readonly invitee: string;
    readonly senderAccount?: {
      readonly __typename?: "Account";
      readonly email: string;
    } | null;
  } | null> | null;
};

export type DeleteCompanyMemberMutationVariables = SchemaTypes.Exact<{
  id: SchemaTypes.Scalars["Int"];
}>;

export type DeleteCompanyMemberMutation = {
  readonly __typename?: "Mutation";
  readonly deleteCompanyMember?: {
    readonly __typename?: "DeleteCompanyMemberPayload";
    readonly clientMutationId?: string | null;
  } | null;
};

export type CompanyRegisteredDetailsFragmentFragment = {
  readonly __typename?: "Company";
  readonly name?: string | null;
  readonly referenceNumber: number;
  readonly taxNumber?: string | null;
  readonly tier?: SchemaTypes.Tier | null;
  readonly registeredAddress?: {
    readonly __typename?: "Address";
    readonly id: number;
    readonly firstLine?: string | null;
    readonly secondLine?: string | null;
    readonly town?: string | null;
    readonly region?: string | null;
    readonly country?: string | null;
    readonly postcode?: string | null;
    readonly coordinates?: {
      readonly __typename?: "Point";
      readonly x: number;
      readonly y: number;
    } | null;
  } | null;
  readonly companyOperationsByCompany: {
    readonly __typename?: "CompanyOperationsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CompanyOperation";
      readonly id: number;
      readonly operation: SchemaTypes.Operation;
    }>;
  };
};

export type ImportAccountsCompaniesFromCvsMutationVariables =
  SchemaTypes.Exact<{
    input: SchemaTypes.ImportAccountsCompaniesFromCsvInput;
  }>;

export type ImportAccountsCompaniesFromCvsMutation = {
  readonly __typename?: "Mutation";
  readonly importAccountsCompaniesFromCVS?: {
    readonly __typename?: "ImportAccountsCompaniesFromCSVResult";
    readonly auth0Job?: {
      readonly __typename?: "Auth0ImportResult";
      readonly id?: string | null;
    } | null;
    readonly accounts?: ReadonlyArray<{
      readonly __typename?: "Account";
      readonly email: string;
      readonly role?: SchemaTypes.Role | null;
      readonly phone?: string | null;
      readonly status?: SchemaTypes.AccountStatus | null;
      readonly firstName?: string | null;
      readonly lastName?: string | null;
      readonly created?: any | null;
      readonly doceboUserId?: number | null;
      readonly doceboUsername?: string | null;
    } | null> | null;
    readonly companies?: ReadonlyArray<{
      readonly __typename?: "Company";
      readonly businessType?: SchemaTypes.BusinessType | null;
      readonly name?: string | null;
      readonly tier?: SchemaTypes.Tier | null;
      readonly status?: SchemaTypes.CompanyStatus | null;
      readonly taxNumber?: string | null;
      readonly aboutUs?: string | null;
      readonly logo?: string | null;
      readonly phone?: string | null;
      readonly publicEmail?: string | null;
      readonly website?: string | null;
      readonly linkedIn?: string | null;
      readonly registeredAddress?: {
        readonly __typename?: "Address";
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly companyMembers: {
        readonly __typename?: "CompanyMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyMember";
          readonly account?: {
            readonly __typename?: "Account";
            readonly role?: SchemaTypes.Role | null;
            readonly email: string;
            readonly status?: SchemaTypes.AccountStatus | null;
            readonly phone?: string | null;
            readonly firstName?: string | null;
            readonly lastName?: string | null;
            readonly created?: any | null;
            readonly doceboUserId?: number | null;
            readonly doceboUsername?: string | null;
          } | null;
        }>;
      };
    } | null> | null;
  } | null;
};

export type UpdateMarketMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateMarketInput;
}>;

export type UpdateMarketMutation = {
  readonly __typename?: "Mutation";
  readonly updateMarket?: {
    readonly __typename?: "UpdateMarketPayload";
    readonly query?: {
      readonly __typename?: "Query";
      readonly markets?: {
        readonly __typename?: "MarketsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Market";
          readonly id: number;
          readonly language: SchemaTypes.Language;
          readonly domain: string;
          readonly cmsSpaceId?: string | null;
          readonly name?: string | null;
          readonly sendName?: string | null;
          readonly sendMailbox?: string | null;
          readonly doceboInstallersBranchId?: string | null;
          readonly doceboCompanyAdminBranchId?: string | null;
          readonly doceboCatalogueId?: number | null;
          readonly doceboCatalogueIdT2?: number | null;
          readonly doceboCatalogueIdT3?: number | null;
          readonly doceboCatalogueIdT4?: number | null;
          readonly merchandisingUrl?: string | null;
          readonly projectsEnabled?: boolean | null;
          readonly locationBiasRadiusKm?: number | null;
          readonly gtag?: string | null;
          readonly gtagMarketMedia?: string | null;
        }>;
      } | null;
    } | null;
  } | null;
};

export type BulkImportMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.BulkImportInput;
}>;

export type BulkImportMutation = {
  readonly __typename?: "Mutation";
  readonly bulkImport?: {
    readonly __typename?: "ImportOutput";
    readonly systemsToInsert?: ReadonlyArray<{
      readonly __typename?: "System";
      readonly bmiRef: string;
    }> | null;
    readonly systemsToUpdate?: ReadonlyArray<{
      readonly __typename?: "System";
      readonly bmiRef: string;
    }> | null;
    readonly productsToInsert?: ReadonlyArray<{
      readonly __typename?: "Product";
      readonly bmiRef: string;
    }> | null;
    readonly productsToUpdate?: ReadonlyArray<{
      readonly __typename?: "Product";
      readonly bmiRef: string;
    }> | null;
    readonly errorSystemsToUpdate?: ReadonlyArray<{
      readonly __typename?: "ImportError";
      readonly ref?: string | null;
      readonly message?: string | null;
    }> | null;
    readonly errorSystemsToInsert?: ReadonlyArray<{
      readonly __typename?: "ImportError";
      readonly ref?: string | null;
      readonly message?: string | null;
    }> | null;
    readonly errorProductsToUpdate?: ReadonlyArray<{
      readonly __typename?: "ImportError";
      readonly ref?: string | null;
      readonly message?: string | null;
    }> | null;
    readonly errorProductsToInsert?: ReadonlyArray<{
      readonly __typename?: "ImportError";
      readonly ref?: string | null;
      readonly message?: string | null;
    }> | null;
    readonly errorSystemMembersInsert?: ReadonlyArray<{
      readonly __typename?: "ImportError";
      readonly ref?: string | null;
      readonly message?: string | null;
    }> | null;
  } | null;
};

export type UpdateProductMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProductInput;
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type UpdateProductMutation = {
  readonly __typename?: "Mutation";
  readonly updateProduct?: {
    readonly __typename?: "UpdateProductPayload";
    readonly query?: {
      readonly __typename?: "Query";
      readonly products?: {
        readonly __typename?: "ProductsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Product";
          readonly id: number;
          readonly name: string;
          readonly brand: string;
          readonly family: string;
          readonly bmiRef: string;
          readonly updatedAt: any;
          readonly published: boolean;
          readonly technology: SchemaTypes.Technology;
          readonly description?: string | null;
          readonly maximumValidityYears: number;
        }>;
      } | null;
    } | null;
  } | null;
};

export type UpdateSystemMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateSystemInput;
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type UpdateSystemMutation = {
  readonly __typename?: "Mutation";
  readonly updateSystem?: {
    readonly __typename?: "UpdateSystemPayload";
    readonly query?: {
      readonly __typename?: "Query";
      readonly systems?: {
        readonly __typename?: "SystemsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "System";
          readonly id: number;
          readonly name: string;
          readonly bmiRef: string;
          readonly updatedAt: any;
          readonly published: boolean;
          readonly technology: SchemaTypes.Technology;
          readonly description?: string | null;
          readonly maximumValidityYears: number;
        }>;
      } | null;
    } | null;
  } | null;
};

export type CreateProjectMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateProjectInput;
}>;

export type CreateProjectMutation = {
  readonly __typename?: "Mutation";
  readonly createProject?: {
    readonly __typename?: "CreateProjectPayload";
    readonly project?: {
      readonly __typename?: "Project";
      readonly id: number;
      readonly hidden?: boolean | null;
      readonly name: string;
      readonly technology: SchemaTypes.Technology;
      readonly roofArea: number;
      readonly startDate: any;
      readonly endDate: any;
      readonly description?: string | null;
      readonly buildingOwnerFirstname?: string | null;
      readonly buildingOwnerLastname?: string | null;
      readonly buildingOwnerCompany?: string | null;
      readonly buildingOwnerMail?: string | null;
      readonly siteAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly buildingOwnerAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly guarantees: {
        readonly __typename?: "GuaranteesConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Guarantee";
          readonly id: number;
          readonly guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
          readonly reviewerAccountId?: number | null;
          readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
          readonly languageCode?: SchemaTypes.Language | null;
          readonly fileStorageId?: string | null;
          readonly signedFileStorageUrl?: string | null;
          readonly status?: SchemaTypes.RequestStatus | null;
          readonly guaranteeType?: {
            readonly __typename?: "ContentfulGuaranteeType";
            readonly name?: string | null;
            readonly coverage?: SchemaTypes.ContentfulGuaranteeCoverageType | null;
            readonly displayName?: string | null;
            readonly technology?: SchemaTypes.ContentfulTechnologyType | null;
            readonly tiersAvailable?: ReadonlyArray<SchemaTypes.ContentfulTiers | null> | null;
            readonly sys: {
              readonly __typename?: "ContentfulSys";
              readonly id: string;
            };
            readonly evidenceCategoriesCollection?: {
              readonly __typename?: "ContentfulEvidenceCategoryCollection";
              readonly items?: ReadonlyArray<{
                readonly __typename?: "ContentfulEvidenceCategory";
                readonly referenceCode?: string | null;
                readonly name?: string | null;
                readonly minimumUploads?: number | null;
                readonly sys: {
                  readonly __typename?: "ContentfulSys";
                  readonly id: string;
                };
                readonly description?: {
                  readonly __typename?: "ContentfulEvidenceCategoryDescription";
                  readonly json: any;
                } | null;
              } | null> | null;
            } | null;
          } | null;
          readonly productByProductBmiRef?: {
            readonly __typename?: "Product";
            readonly id: number;
            readonly name: string;
            readonly brand: string;
            readonly family: string;
            readonly description?: string | null;
          } | null;
          readonly systemBySystemBmiRef?: {
            readonly __typename?: "System";
            readonly id: number;
            readonly name: string;
            readonly description?: string | null;
            readonly systemMembersBySystemBmiRef: {
              readonly __typename?: "SystemMembersConnection";
              readonly nodes: ReadonlyArray<{
                readonly __typename?: "SystemMember";
                readonly id: number;
                readonly productByProductBmiRef?: {
                  readonly __typename?: "Product";
                  readonly id: number;
                  readonly name: string;
                  readonly brand: string;
                  readonly family: string;
                  readonly description?: string | null;
                } | null;
              }>;
            };
          } | null;
        }>;
      };
      readonly evidenceItems: {
        readonly __typename?: "EvidenceItemsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "EvidenceItem";
          readonly id: number;
          readonly name: string;
          readonly signedUrl?: string | null;
          readonly guaranteeId?: number | null;
          readonly evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
          readonly customEvidenceCategoryKey?: SchemaTypes.CustomEvidenceCategoryKey | null;
          readonly customEvidenceCategory?: {
            readonly __typename?: "ContentfulEvidenceCategory";
            readonly name?: string | null;
            readonly minimumUploads?: number | null;
          } | null;
        }>;
      };
      readonly notes: {
        readonly __typename?: "NotesConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Note";
          readonly id: number;
          readonly body?: string | null;
          readonly senderName?: string | null;
          readonly createdAt: any;
        }>;
      };
      readonly projectMembers: {
        readonly __typename?: "ProjectMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "ProjectMember";
          readonly id: number;
          readonly accountId?: number | null;
          readonly isResponsibleInstaller?: boolean | null;
          readonly account?: {
            readonly __typename?: "Account";
            readonly id: number;
            readonly firstName?: string | null;
            readonly lastName?: string | null;
            readonly role?: SchemaTypes.Role | null;
            readonly certificationsByDoceboUserId: {
              readonly __typename?: "CertificationsConnection";
              readonly nodes: ReadonlyArray<{
                readonly __typename?: "Certification";
                readonly name?: string | null;
                readonly technology?: string | null;
              }>;
            };
          } | null;
        }>;
      };
      readonly company?: {
        readonly __typename?: "Company";
        readonly id: number;
        readonly name?: string | null;
        readonly tier?: SchemaTypes.Tier | null;
      } | null;
    } | null;
  } | null;
};

export type UpdateProjectMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProjectInput;
}>;

export type UpdateProjectMutation = {
  readonly __typename?: "Mutation";
  readonly updateProject?: {
    readonly __typename?: "UpdateProjectPayload";
    readonly project?: {
      readonly __typename?: "Project";
      readonly id: number;
      readonly hidden?: boolean | null;
      readonly name: string;
      readonly technology: SchemaTypes.Technology;
      readonly roofArea: number;
      readonly startDate: any;
      readonly endDate: any;
      readonly description?: string | null;
      readonly buildingOwnerFirstname?: string | null;
      readonly buildingOwnerLastname?: string | null;
      readonly buildingOwnerCompany?: string | null;
      readonly buildingOwnerMail?: string | null;
      readonly siteAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly buildingOwnerAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly guarantees: {
        readonly __typename?: "GuaranteesConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Guarantee";
          readonly id: number;
          readonly guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
          readonly reviewerAccountId?: number | null;
          readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
          readonly languageCode?: SchemaTypes.Language | null;
          readonly fileStorageId?: string | null;
          readonly signedFileStorageUrl?: string | null;
          readonly status?: SchemaTypes.RequestStatus | null;
          readonly guaranteeType?: {
            readonly __typename?: "ContentfulGuaranteeType";
            readonly name?: string | null;
            readonly coverage?: SchemaTypes.ContentfulGuaranteeCoverageType | null;
            readonly displayName?: string | null;
            readonly technology?: SchemaTypes.ContentfulTechnologyType | null;
            readonly tiersAvailable?: ReadonlyArray<SchemaTypes.ContentfulTiers | null> | null;
            readonly sys: {
              readonly __typename?: "ContentfulSys";
              readonly id: string;
            };
            readonly evidenceCategoriesCollection?: {
              readonly __typename?: "ContentfulEvidenceCategoryCollection";
              readonly items?: ReadonlyArray<{
                readonly __typename?: "ContentfulEvidenceCategory";
                readonly referenceCode?: string | null;
                readonly name?: string | null;
                readonly minimumUploads?: number | null;
                readonly sys: {
                  readonly __typename?: "ContentfulSys";
                  readonly id: string;
                };
                readonly description?: {
                  readonly __typename?: "ContentfulEvidenceCategoryDescription";
                  readonly json: any;
                } | null;
              } | null> | null;
            } | null;
          } | null;
          readonly productByProductBmiRef?: {
            readonly __typename?: "Product";
            readonly id: number;
            readonly name: string;
            readonly brand: string;
            readonly family: string;
            readonly description?: string | null;
          } | null;
          readonly systemBySystemBmiRef?: {
            readonly __typename?: "System";
            readonly id: number;
            readonly name: string;
            readonly description?: string | null;
            readonly systemMembersBySystemBmiRef: {
              readonly __typename?: "SystemMembersConnection";
              readonly nodes: ReadonlyArray<{
                readonly __typename?: "SystemMember";
                readonly id: number;
                readonly productByProductBmiRef?: {
                  readonly __typename?: "Product";
                  readonly id: number;
                  readonly name: string;
                  readonly brand: string;
                  readonly family: string;
                  readonly description?: string | null;
                } | null;
              }>;
            };
          } | null;
        }>;
      };
      readonly evidenceItems: {
        readonly __typename?: "EvidenceItemsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "EvidenceItem";
          readonly id: number;
          readonly name: string;
          readonly signedUrl?: string | null;
          readonly guaranteeId?: number | null;
          readonly evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
          readonly customEvidenceCategoryKey?: SchemaTypes.CustomEvidenceCategoryKey | null;
          readonly customEvidenceCategory?: {
            readonly __typename?: "ContentfulEvidenceCategory";
            readonly name?: string | null;
            readonly minimumUploads?: number | null;
          } | null;
        }>;
      };
      readonly notes: {
        readonly __typename?: "NotesConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Note";
          readonly id: number;
          readonly body?: string | null;
          readonly senderName?: string | null;
          readonly createdAt: any;
        }>;
      };
      readonly projectMembers: {
        readonly __typename?: "ProjectMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "ProjectMember";
          readonly id: number;
          readonly accountId?: number | null;
          readonly isResponsibleInstaller?: boolean | null;
          readonly account?: {
            readonly __typename?: "Account";
            readonly id: number;
            readonly firstName?: string | null;
            readonly lastName?: string | null;
            readonly role?: SchemaTypes.Role | null;
            readonly certificationsByDoceboUserId: {
              readonly __typename?: "CertificationsConnection";
              readonly nodes: ReadonlyArray<{
                readonly __typename?: "Certification";
                readonly name?: string | null;
                readonly technology?: string | null;
              }>;
            };
          } | null;
        }>;
      };
      readonly company?: {
        readonly __typename?: "Company";
        readonly id: number;
        readonly name?: string | null;
        readonly tier?: SchemaTypes.Tier | null;
      } | null;
    } | null;
  } | null;
};

export type UpdateAccountProfileMutationVariables = SchemaTypes.Exact<{
  updateAccountInput: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateAccountProfileMutation = {
  readonly __typename?: "Mutation";
  readonly updateAccount?: {
    readonly __typename?: "UpdateAccountPayload";
    readonly account?: {
      readonly __typename?: "Account";
      readonly id: number;
      readonly firstName?: string | null;
      readonly lastName?: string | null;
      readonly role?: SchemaTypes.Role | null;
      readonly email: string;
      readonly phone?: string | null;
      readonly photo?: string | null;
      readonly signedPhotoUrl?: string | null;
      readonly companyMembers: {
        readonly __typename?: "CompanyMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyMember";
          readonly company?: {
            readonly __typename?: "Company";
            readonly id: number;
            readonly name?: string | null;
            readonly businessType?: SchemaTypes.BusinessType | null;
            readonly logo?: string | null;
            readonly aboutUs?: string | null;
            readonly ownerFullname?: string | null;
            readonly ownerPhone?: string | null;
            readonly ownerEmail?: string | null;
            readonly phone?: string | null;
            readonly publicEmail?: string | null;
            readonly website?: string | null;
            readonly facebook?: string | null;
            readonly linkedIn?: string | null;
            readonly tradingAddress?: {
              readonly __typename?: "Address";
              readonly id: number;
              readonly firstLine?: string | null;
              readonly secondLine?: string | null;
              readonly town?: string | null;
              readonly region?: string | null;
              readonly country?: string | null;
              readonly postcode?: string | null;
              readonly coordinates?: {
                readonly __typename?: "Point";
                readonly x: number;
                readonly y: number;
              } | null;
            } | null;
          } | null;
        }>;
      };
      readonly certificationsByDoceboUserId: {
        readonly __typename?: "CertificationsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Certification";
          readonly id: number;
          readonly technology?: string | null;
          readonly expiryDate?: any | null;
          readonly name?: string | null;
        }>;
      };
    } | null;
  } | null;
};

export type LeaveCompanyMutationVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
  companyId: SchemaTypes.Scalars["Int"];
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type LeaveCompanyMutation = {
  readonly __typename?: "Mutation";
  readonly deleteCompanyMemberByMarketIdAndAccountIdAndCompanyId?: {
    readonly __typename?: "DeleteCompanyMemberPayload";
    readonly clientMutationId?: string | null;
    readonly account?: {
      readonly __typename?: "Account";
      readonly id: number;
      readonly firstName?: string | null;
      readonly lastName?: string | null;
      readonly role?: SchemaTypes.Role | null;
      readonly email: string;
      readonly phone?: string | null;
      readonly photo?: string | null;
      readonly signedPhotoUrl?: string | null;
      readonly companyMembers: {
        readonly __typename?: "CompanyMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyMember";
          readonly company?: {
            readonly __typename?: "Company";
            readonly id: number;
            readonly name?: string | null;
            readonly businessType?: SchemaTypes.BusinessType | null;
            readonly logo?: string | null;
            readonly aboutUs?: string | null;
            readonly ownerFullname?: string | null;
            readonly ownerPhone?: string | null;
            readonly ownerEmail?: string | null;
            readonly phone?: string | null;
            readonly publicEmail?: string | null;
            readonly website?: string | null;
            readonly facebook?: string | null;
            readonly linkedIn?: string | null;
            readonly tradingAddress?: {
              readonly __typename?: "Address";
              readonly id: number;
              readonly firstLine?: string | null;
              readonly secondLine?: string | null;
              readonly town?: string | null;
              readonly region?: string | null;
              readonly country?: string | null;
              readonly postcode?: string | null;
              readonly coordinates?: {
                readonly __typename?: "Point";
                readonly x: number;
                readonly y: number;
              } | null;
            } | null;
          } | null;
        }>;
      };
      readonly certificationsByDoceboUserId: {
        readonly __typename?: "CertificationsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Certification";
          readonly id: number;
          readonly technology?: string | null;
          readonly expiryDate?: any | null;
          readonly name?: string | null;
        }>;
      };
    } | null;
  } | null;
};

export type ResetPasswordMutationVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type ResetPasswordMutation = {
  readonly __typename?: "Mutation";
  readonly resetPassword?: string | null;
};

export type CreateCompanyMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateCompanyInput;
}>;

export type CreateCompanyMutation = {
  readonly __typename?: "Mutation";
  readonly createCompany?: {
    readonly __typename?: "CreateCompanyPayload";
    readonly company?: {
      readonly __typename?: "Company";
      readonly id: number;
    } | null;
  } | null;
};

export type ProjectDetailsFragmentFragment = {
  readonly __typename?: "Project";
  readonly id: number;
  readonly hidden?: boolean | null;
  readonly name: string;
  readonly technology: SchemaTypes.Technology;
  readonly roofArea: number;
  readonly startDate: any;
  readonly endDate: any;
  readonly description?: string | null;
  readonly buildingOwnerFirstname?: string | null;
  readonly buildingOwnerLastname?: string | null;
  readonly buildingOwnerCompany?: string | null;
  readonly buildingOwnerMail?: string | null;
  readonly siteAddress?: {
    readonly __typename?: "Address";
    readonly id: number;
    readonly firstLine?: string | null;
    readonly secondLine?: string | null;
    readonly town?: string | null;
    readonly region?: string | null;
    readonly country?: string | null;
    readonly postcode?: string | null;
    readonly coordinates?: {
      readonly __typename?: "Point";
      readonly x: number;
      readonly y: number;
    } | null;
  } | null;
  readonly buildingOwnerAddress?: {
    readonly __typename?: "Address";
    readonly id: number;
    readonly firstLine?: string | null;
    readonly secondLine?: string | null;
    readonly town?: string | null;
    readonly region?: string | null;
    readonly country?: string | null;
    readonly postcode?: string | null;
    readonly coordinates?: {
      readonly __typename?: "Point";
      readonly x: number;
      readonly y: number;
    } | null;
  } | null;
  readonly guarantees: {
    readonly __typename?: "GuaranteesConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Guarantee";
      readonly id: number;
      readonly guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
      readonly reviewerAccountId?: number | null;
      readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
      readonly languageCode?: SchemaTypes.Language | null;
      readonly fileStorageId?: string | null;
      readonly signedFileStorageUrl?: string | null;
      readonly status?: SchemaTypes.RequestStatus | null;
      readonly guaranteeType?: {
        readonly __typename?: "ContentfulGuaranteeType";
        readonly name?: string | null;
        readonly coverage?: SchemaTypes.ContentfulGuaranteeCoverageType | null;
        readonly displayName?: string | null;
        readonly technology?: SchemaTypes.ContentfulTechnologyType | null;
        readonly tiersAvailable?: ReadonlyArray<SchemaTypes.ContentfulTiers | null> | null;
        readonly sys: {
          readonly __typename?: "ContentfulSys";
          readonly id: string;
        };
        readonly evidenceCategoriesCollection?: {
          readonly __typename?: "ContentfulEvidenceCategoryCollection";
          readonly items?: ReadonlyArray<{
            readonly __typename?: "ContentfulEvidenceCategory";
            readonly referenceCode?: string | null;
            readonly name?: string | null;
            readonly minimumUploads?: number | null;
            readonly sys: {
              readonly __typename?: "ContentfulSys";
              readonly id: string;
            };
            readonly description?: {
              readonly __typename?: "ContentfulEvidenceCategoryDescription";
              readonly json: any;
            } | null;
          } | null> | null;
        } | null;
      } | null;
      readonly productByProductBmiRef?: {
        readonly __typename?: "Product";
        readonly id: number;
        readonly name: string;
        readonly brand: string;
        readonly family: string;
        readonly description?: string | null;
      } | null;
      readonly systemBySystemBmiRef?: {
        readonly __typename?: "System";
        readonly id: number;
        readonly name: string;
        readonly description?: string | null;
        readonly systemMembersBySystemBmiRef: {
          readonly __typename?: "SystemMembersConnection";
          readonly nodes: ReadonlyArray<{
            readonly __typename?: "SystemMember";
            readonly id: number;
            readonly productByProductBmiRef?: {
              readonly __typename?: "Product";
              readonly id: number;
              readonly name: string;
              readonly brand: string;
              readonly family: string;
              readonly description?: string | null;
            } | null;
          }>;
        };
      } | null;
    }>;
  };
  readonly evidenceItems: {
    readonly __typename?: "EvidenceItemsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "EvidenceItem";
      readonly id: number;
      readonly name: string;
      readonly signedUrl?: string | null;
      readonly guaranteeId?: number | null;
      readonly evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
      readonly customEvidenceCategoryKey?: SchemaTypes.CustomEvidenceCategoryKey | null;
      readonly customEvidenceCategory?: {
        readonly __typename?: "ContentfulEvidenceCategory";
        readonly name?: string | null;
        readonly minimumUploads?: number | null;
      } | null;
    }>;
  };
  readonly notes: {
    readonly __typename?: "NotesConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Note";
      readonly id: number;
      readonly body?: string | null;
      readonly senderName?: string | null;
      readonly createdAt: any;
    }>;
  };
  readonly projectMembers: {
    readonly __typename?: "ProjectMembersConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "ProjectMember";
      readonly id: number;
      readonly accountId?: number | null;
      readonly isResponsibleInstaller?: boolean | null;
      readonly account?: {
        readonly __typename?: "Account";
        readonly id: number;
        readonly firstName?: string | null;
        readonly lastName?: string | null;
        readonly role?: SchemaTypes.Role | null;
        readonly certificationsByDoceboUserId: {
          readonly __typename?: "CertificationsConnection";
          readonly nodes: ReadonlyArray<{
            readonly __typename?: "Certification";
            readonly name?: string | null;
            readonly technology?: string | null;
          }>;
        };
      } | null;
    }>;
  };
  readonly company?: {
    readonly __typename?: "Company";
    readonly id: number;
    readonly name?: string | null;
    readonly tier?: SchemaTypes.Tier | null;
  } | null;
};

export type GetProjectQueryVariables = SchemaTypes.Exact<{
  projectId: SchemaTypes.Scalars["Int"];
}>;

export type GetProjectQuery = {
  readonly __typename?: "Query";
  readonly project?: {
    readonly __typename?: "Project";
    readonly id: number;
    readonly hidden?: boolean | null;
    readonly name: string;
    readonly technology: SchemaTypes.Technology;
    readonly roofArea: number;
    readonly startDate: any;
    readonly endDate: any;
    readonly description?: string | null;
    readonly buildingOwnerFirstname?: string | null;
    readonly buildingOwnerLastname?: string | null;
    readonly buildingOwnerCompany?: string | null;
    readonly buildingOwnerMail?: string | null;
    readonly siteAddress?: {
      readonly __typename?: "Address";
      readonly id: number;
      readonly firstLine?: string | null;
      readonly secondLine?: string | null;
      readonly town?: string | null;
      readonly region?: string | null;
      readonly country?: string | null;
      readonly postcode?: string | null;
      readonly coordinates?: {
        readonly __typename?: "Point";
        readonly x: number;
        readonly y: number;
      } | null;
    } | null;
    readonly buildingOwnerAddress?: {
      readonly __typename?: "Address";
      readonly id: number;
      readonly firstLine?: string | null;
      readonly secondLine?: string | null;
      readonly town?: string | null;
      readonly region?: string | null;
      readonly country?: string | null;
      readonly postcode?: string | null;
      readonly coordinates?: {
        readonly __typename?: "Point";
        readonly x: number;
        readonly y: number;
      } | null;
    } | null;
    readonly guarantees: {
      readonly __typename?: "GuaranteesConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "Guarantee";
        readonly id: number;
        readonly guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
        readonly reviewerAccountId?: number | null;
        readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
        readonly languageCode?: SchemaTypes.Language | null;
        readonly fileStorageId?: string | null;
        readonly signedFileStorageUrl?: string | null;
        readonly status?: SchemaTypes.RequestStatus | null;
        readonly guaranteeType?: {
          readonly __typename?: "ContentfulGuaranteeType";
          readonly name?: string | null;
          readonly coverage?: SchemaTypes.ContentfulGuaranteeCoverageType | null;
          readonly displayName?: string | null;
          readonly technology?: SchemaTypes.ContentfulTechnologyType | null;
          readonly tiersAvailable?: ReadonlyArray<SchemaTypes.ContentfulTiers | null> | null;
          readonly sys: {
            readonly __typename?: "ContentfulSys";
            readonly id: string;
          };
          readonly evidenceCategoriesCollection?: {
            readonly __typename?: "ContentfulEvidenceCategoryCollection";
            readonly items?: ReadonlyArray<{
              readonly __typename?: "ContentfulEvidenceCategory";
              readonly referenceCode?: string | null;
              readonly name?: string | null;
              readonly minimumUploads?: number | null;
              readonly sys: {
                readonly __typename?: "ContentfulSys";
                readonly id: string;
              };
              readonly description?: {
                readonly __typename?: "ContentfulEvidenceCategoryDescription";
                readonly json: any;
              } | null;
            } | null> | null;
          } | null;
        } | null;
        readonly productByProductBmiRef?: {
          readonly __typename?: "Product";
          readonly id: number;
          readonly name: string;
          readonly brand: string;
          readonly family: string;
          readonly description?: string | null;
        } | null;
        readonly systemBySystemBmiRef?: {
          readonly __typename?: "System";
          readonly id: number;
          readonly name: string;
          readonly description?: string | null;
          readonly systemMembersBySystemBmiRef: {
            readonly __typename?: "SystemMembersConnection";
            readonly nodes: ReadonlyArray<{
              readonly __typename?: "SystemMember";
              readonly id: number;
              readonly productByProductBmiRef?: {
                readonly __typename?: "Product";
                readonly id: number;
                readonly name: string;
                readonly brand: string;
                readonly family: string;
                readonly description?: string | null;
              } | null;
            }>;
          };
        } | null;
      }>;
    };
    readonly evidenceItems: {
      readonly __typename?: "EvidenceItemsConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "EvidenceItem";
        readonly id: number;
        readonly name: string;
        readonly signedUrl?: string | null;
        readonly guaranteeId?: number | null;
        readonly evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
        readonly customEvidenceCategoryKey?: SchemaTypes.CustomEvidenceCategoryKey | null;
        readonly customEvidenceCategory?: {
          readonly __typename?: "ContentfulEvidenceCategory";
          readonly name?: string | null;
          readonly minimumUploads?: number | null;
        } | null;
      }>;
    };
    readonly notes: {
      readonly __typename?: "NotesConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "Note";
        readonly id: number;
        readonly body?: string | null;
        readonly senderName?: string | null;
        readonly createdAt: any;
      }>;
    };
    readonly projectMembers: {
      readonly __typename?: "ProjectMembersConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "ProjectMember";
        readonly id: number;
        readonly accountId?: number | null;
        readonly isResponsibleInstaller?: boolean | null;
        readonly account?: {
          readonly __typename?: "Account";
          readonly id: number;
          readonly firstName?: string | null;
          readonly lastName?: string | null;
          readonly role?: SchemaTypes.Role | null;
          readonly certificationsByDoceboUserId: {
            readonly __typename?: "CertificationsConnection";
            readonly nodes: ReadonlyArray<{
              readonly __typename?: "Certification";
              readonly name?: string | null;
              readonly technology?: string | null;
            }>;
          };
        } | null;
      }>;
    };
    readonly company?: {
      readonly __typename?: "Company";
      readonly id: number;
      readonly name?: string | null;
      readonly tier?: SchemaTypes.Tier | null;
    } | null;
  } | null;
};

export type ProjectDetailsProductFragmentFragment = {
  readonly __typename?: "Product";
  readonly id: number;
  readonly name: string;
  readonly brand: string;
  readonly family: string;
  readonly description?: string | null;
};

export type GetCompaniesReportQueryVariables = SchemaTypes.Exact<{
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompaniesReportQuery = {
  readonly __typename?: "Query";
  readonly companies?: {
    readonly __typename?: "CompaniesConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Company";
      readonly referenceNumber: number;
      readonly name?: string | null;
      readonly tier?: SchemaTypes.Tier | null;
      readonly logo?: string | null;
      readonly aboutUs?: string | null;
      readonly businessType?: SchemaTypes.BusinessType | null;
      readonly isProfileComplete: boolean;
      readonly phone?: string | null;
      readonly publicEmail?: string | null;
      readonly website?: string | null;
      readonly facebook?: string | null;
      readonly linkedIn?: string | null;
      readonly ownerFullname?: string | null;
      readonly ownerEmail?: string | null;
      readonly status?: SchemaTypes.CompanyStatus | null;
      readonly taxNumber?: string | null;
      readonly updatedAt: any;
      readonly registeredAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly tradingAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly companyOperationsByCompany: {
        readonly __typename?: "CompanyOperationsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyOperation";
          readonly id: number;
          readonly operation: SchemaTypes.Operation;
        }>;
      };
    }>;
  } | null;
};

export type GetGuaranteesReportQueryVariables = SchemaTypes.Exact<{
  market: SchemaTypes.Scalars["Int"];
}>;

export type GetGuaranteesReportQuery = {
  readonly __typename?: "Query";
  readonly guaranteesByMarket?: {
    readonly __typename?: "GuaranteesConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Guarantee";
      readonly id: number;
      readonly bmiReferenceId?: string | null;
      readonly requestorAccountId?: number | null;
      readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
      readonly status?: SchemaTypes.RequestStatus | null;
      readonly languageCode?: SchemaTypes.Language | null;
      readonly guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
      readonly startDate?: any | null;
      readonly expiryDate?: any | null;
      readonly signedFileStorageUrl?: string | null;
      readonly project?: {
        readonly __typename?: "Project";
        readonly name: string;
        readonly technology: SchemaTypes.Technology;
        readonly roofArea: number;
        readonly company?: {
          readonly __typename?: "Company";
          readonly name?: string | null;
        } | null;
      } | null;
      readonly guaranteeType?: {
        readonly __typename?: "ContentfulGuaranteeType";
        readonly name?: string | null;
        readonly maximumValidityYears?: number | null;
      } | null;
      readonly systemBySystemBmiRef?: {
        readonly __typename?: "System";
        readonly name: string;
      } | null;
      readonly productByProductBmiRef?: {
        readonly __typename?: "Product";
        readonly name: string;
      } | null;
    }>;
  } | null;
};

export type GetProductsReportQueryVariables = SchemaTypes.Exact<{
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type GetProductsReportQuery = {
  readonly __typename?: "Query";
  readonly products?: {
    readonly __typename?: "ProductsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Product";
      readonly id: number;
      readonly bmiRef: string;
      readonly name: string;
      readonly description?: string | null;
      readonly technology: SchemaTypes.Technology;
      readonly family: string;
      readonly brand: string;
      readonly maximumValidityYears: number;
      readonly published: boolean;
      readonly updatedAt: any;
    }>;
  } | null;
};

export type GetProjectsReportQueryVariables = SchemaTypes.Exact<{
  market: SchemaTypes.Scalars["Int"];
}>;

export type GetProjectsReportQuery = {
  readonly __typename?: "Query";
  readonly projectsByMarket?: {
    readonly __typename?: "ProjectsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Project";
      readonly id: number;
      readonly name: string;
      readonly technology: SchemaTypes.Technology;
      readonly roofArea: number;
      readonly buildingOwnerFirstname?: string | null;
      readonly buildingOwnerLastname?: string | null;
      readonly startDate: any;
      readonly endDate: any;
      readonly hidden?: boolean | null;
      readonly createdAt: any;
      readonly updatedAt: any;
      readonly siteAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly company?: {
        readonly __typename?: "Company";
        readonly name?: string | null;
        readonly status?: SchemaTypes.CompanyStatus | null;
      } | null;
      readonly guarantees: {
        readonly __typename?: "GuaranteesConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Guarantee";
          readonly id: number;
          readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
          readonly languageCode?: SchemaTypes.Language | null;
          readonly guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
          readonly guaranteeTypes?: {
            readonly __typename?: "ContentfulGuaranteeTypeCollection";
            readonly items?: ReadonlyArray<{
              readonly __typename?: "ContentfulGuaranteeType";
              readonly name?: string | null;
            } | null> | null;
          } | null;
        }>;
      };
      readonly projectMembers: {
        readonly __typename?: "ProjectMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "ProjectMember";
          readonly id: number;
          readonly account?: {
            readonly __typename?: "Account";
            readonly email: string;
          } | null;
        }>;
      };
    }>;
  } | null;
};

export type GetSystemsReportQueryVariables = SchemaTypes.Exact<{
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type GetSystemsReportQuery = {
  readonly __typename?: "Query";
  readonly systems?: {
    readonly __typename?: "SystemsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "System";
      readonly id: number;
      readonly bmiRef: string;
      readonly name: string;
      readonly description?: string | null;
      readonly technology: SchemaTypes.Technology;
      readonly maximumValidityYears: number;
      readonly published: boolean;
      readonly updatedAt: any;
      readonly systemMembersBySystemBmiRef: {
        readonly __typename?: "SystemMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "SystemMember";
          readonly productBmiRef: string;
        }>;
      };
    }>;
  } | null;
};

export type GetTeamsReportQueryVariables = SchemaTypes.Exact<{
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type GetTeamsReportQuery = {
  readonly __typename?: "Query";
  readonly accounts?: {
    readonly __typename?: "AccountsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Account";
      readonly id: number;
      readonly email: string;
      readonly phone?: string | null;
      readonly firstName?: string | null;
      readonly lastName?: string | null;
      readonly role?: SchemaTypes.Role | null;
      readonly status?: SchemaTypes.AccountStatus | null;
      readonly doceboUserId?: number | null;
      readonly doceboUsername?: string | null;
      readonly photo?: string | null;
      readonly signedPhotoUrl?: string | null;
      readonly migrationId?: string | null;
      readonly migratedToAuth0?: boolean | null;
      readonly createdAt: any;
      readonly updatedAt: any;
      readonly companyMembers: {
        readonly __typename?: "CompanyMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyMember";
          readonly company?: {
            readonly __typename?: "Company";
            readonly name?: string | null;
            readonly tier?: SchemaTypes.Tier | null;
          } | null;
        }>;
      };
    }>;
  } | null;
};

export type CreateGuaranteeMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateGuaranteeInput;
}>;

export type CreateGuaranteeMutation = {
  readonly __typename?: "Mutation";
  readonly createGuarantee?: {
    readonly __typename?: "CreateGuaranteePayload";
    readonly guarantee?: {
      readonly __typename?: "Guarantee";
      readonly id: number;
      readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
      readonly status?: SchemaTypes.RequestStatus | null;
    } | null;
  } | null;
};

export type CreateGuaranteePdfMutationVariables = SchemaTypes.Exact<{
  id: SchemaTypes.Scalars["Int"];
}>;

export type CreateGuaranteePdfMutation = {
  readonly __typename?: "Mutation";
  readonly createGuaranteePdf?: {
    readonly __typename?: "PublishOutput";
    readonly messageId?: string | null;
  } | null;
};

export type UpdateGuaranteeMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateGuaranteeInput;
}>;

export type UpdateGuaranteeMutation = {
  readonly __typename?: "Mutation";
  readonly updateGuarantee?: {
    readonly __typename?: "UpdateGuaranteePayload";
    readonly guarantee?: {
      readonly __typename?: "Guarantee";
      readonly id: number;
      readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
      readonly status?: SchemaTypes.RequestStatus | null;
    } | null;
  } | null;
};

export type AddProjectNoteMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateNoteInput;
}>;

export type AddProjectNoteMutation = {
  readonly __typename?: "Mutation";
  readonly createNote?: {
    readonly __typename?: "CreateNotePayload";
    readonly note?: {
      readonly __typename?: "Note";
      readonly id: number;
    } | null;
  } | null;
};

export type DeleteProjectMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.DeleteProjectMemberInput;
}>;

export type DeleteProjectMemberMutation = {
  readonly __typename?: "Mutation";
  readonly deleteProjectMember?: {
    readonly __typename?: "DeleteProjectMemberPayload";
    readonly projectMember?: {
      readonly __typename?: "ProjectMember";
      readonly id: number;
      readonly accountId?: number | null;
      readonly isResponsibleInstaller?: boolean | null;
      readonly account?: {
        readonly __typename?: "Account";
        readonly id: number;
        readonly firstName?: string | null;
        readonly lastName?: string | null;
        readonly role?: SchemaTypes.Role | null;
        readonly certificationsByDoceboUserId: {
          readonly __typename?: "CertificationsConnection";
          readonly nodes: ReadonlyArray<{
            readonly __typename?: "Certification";
            readonly name?: string | null;
            readonly technology?: string | null;
          }>;
        };
      } | null;
    } | null;
  } | null;
};

export type GetProjectCompanyMembersQueryVariables = SchemaTypes.Exact<{
  existAccounts?: SchemaTypes.InputMaybe<
    ReadonlyArray<SchemaTypes.Scalars["Int"]> | SchemaTypes.Scalars["Int"]
  >;
}>;

export type GetProjectCompanyMembersQuery = {
  readonly __typename?: "Query";
  readonly companyMembers?: {
    readonly __typename?: "CompanyMembersConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CompanyMember";
      readonly id: number;
      readonly accountId: number;
      readonly account?: {
        readonly __typename?: "Account";
        readonly id: number;
        readonly firstName?: string | null;
        readonly lastName?: string | null;
        readonly email: string;
        readonly certificationsByDoceboUserId: {
          readonly __typename?: "CertificationsConnection";
          readonly nodes: ReadonlyArray<{
            readonly __typename?: "Certification";
            readonly technology?: string | null;
          }>;
        };
      } | null;
    }>;
  } | null;
};

export type CreateProjectMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateProjectMemberInput;
}>;

export type CreateProjectMemberMutation = {
  readonly __typename?: "Mutation";
  readonly createProjectMember?: {
    readonly __typename?: "CreateProjectMemberPayload";
    readonly projectMember?: {
      readonly __typename?: "ProjectMember";
      readonly id: number;
      readonly accountId?: number | null;
      readonly isResponsibleInstaller?: boolean | null;
      readonly account?: {
        readonly __typename?: "Account";
        readonly id: number;
        readonly firstName?: string | null;
        readonly lastName?: string | null;
        readonly role?: SchemaTypes.Role | null;
        readonly certificationsByDoceboUserId: {
          readonly __typename?: "CertificationsConnection";
          readonly nodes: ReadonlyArray<{
            readonly __typename?: "Certification";
            readonly name?: string | null;
            readonly technology?: string | null;
          }>;
        };
      } | null;
    } | null;
  } | null;
};

export type AddProjectsMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.ProjectMembersAddInput;
}>;

export type AddProjectsMemberMutation = {
  readonly __typename?: "Mutation";
  readonly projectMembersAdd?: {
    readonly __typename?: "ProjectMembersAddPayload";
    readonly projectMembers?: ReadonlyArray<{
      readonly __typename?: "ProjectMember";
      readonly projectId: number;
      readonly accountId?: number | null;
    }> | null;
  } | null;
};

export type UpdateProjectMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProjectMemberInput;
  projectId: SchemaTypes.Scalars["Int"];
}>;

export type UpdateProjectMemberMutation = {
  readonly __typename?: "Mutation";
  readonly updateProjectMember?: {
    readonly __typename?: "UpdateProjectMemberPayload";
    readonly projectMember?: {
      readonly __typename?: "ProjectMember";
      readonly id: number;
      readonly projectId: number;
      readonly isResponsibleInstaller?: boolean | null;
    } | null;
    readonly query?: {
      readonly __typename?: "Query";
      readonly projectMembers?: {
        readonly __typename?: "ProjectMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "ProjectMember";
          readonly id: number;
          readonly accountId?: number | null;
          readonly isResponsibleInstaller?: boolean | null;
          readonly account?: {
            readonly __typename?: "Account";
            readonly id: number;
            readonly firstName?: string | null;
            readonly lastName?: string | null;
            readonly role?: SchemaTypes.Role | null;
            readonly certificationsByDoceboUserId: {
              readonly __typename?: "CertificationsConnection";
              readonly nodes: ReadonlyArray<{
                readonly __typename?: "Certification";
                readonly name?: string | null;
                readonly technology?: string | null;
              }>;
            };
          } | null;
        }>;
      } | null;
    } | null;
  } | null;
};

export type ProjectMemberDetailsFragmentFragment = {
  readonly __typename?: "ProjectMember";
  readonly id: number;
  readonly accountId?: number | null;
  readonly isResponsibleInstaller?: boolean | null;
  readonly account?: {
    readonly __typename?: "Account";
    readonly id: number;
    readonly firstName?: string | null;
    readonly lastName?: string | null;
    readonly role?: SchemaTypes.Role | null;
    readonly certificationsByDoceboUserId: {
      readonly __typename?: "CertificationsConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "Certification";
        readonly name?: string | null;
        readonly technology?: string | null;
      }>;
    };
  } | null;
};

export type AddEvidencesMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.EvidenceItemsAddInput;
}>;

export type AddEvidencesMutation = {
  readonly __typename?: "Mutation";
  readonly evidenceItemsAdd?: {
    readonly __typename?: "EvidenceItemsAddPayload";
    readonly evidenceItems?: ReadonlyArray<{
      readonly __typename?: "EvidenceItem";
      readonly id: number;
      readonly name: string;
    }> | null;
  } | null;
};

export type ContentfulEvidenceCategoriesQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type ContentfulEvidenceCategoriesQuery = {
  readonly __typename?: "Query";
  readonly evidenceCategoryCollection?: {
    readonly __typename?: "EvidenceCategoryCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "EvidenceCategory";
      readonly name?: string | null;
      readonly referenceCode?: string | null;
      readonly minimumUploads?: number | null;
      readonly sys: { readonly __typename?: "Sys"; readonly id: string };
    } | null>;
  } | null;
};

export type DeleteEvidenceItemMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.DeleteEvidenceItemInput;
}>;

export type DeleteEvidenceItemMutation = {
  readonly __typename?: "Mutation";
  readonly deleteEvidenceItem?: {
    readonly __typename?: "DeleteEvidenceItemPayload";
    readonly evidenceItem?: {
      readonly __typename?: "EvidenceItem";
      readonly id: number;
      readonly name: string;
      readonly attachment: string;
      readonly guaranteeId?: number | null;
      readonly evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
    } | null;
  } | null;
};

export type GetGuaranteeTemplatesQueryVariables = SchemaTypes.Exact<{
  technology: SchemaTypes.Scalars["String"];
  coverage: SchemaTypes.Scalars["String"];
  language?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["String"]>;
}>;

export type GetGuaranteeTemplatesQuery = {
  readonly __typename?: "Query";
  readonly guaranteeTemplateCollection?: {
    readonly __typename?: "GuaranteeTemplateCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "GuaranteeTemplate";
      readonly displayName?: string | null;
      readonly languageCode?: string | null;
      readonly languageDescriptor?: string | null;
      readonly coverage?: string | null;
      readonly sys: { readonly __typename?: "Sys"; readonly id: string };
    } | null>;
  } | null;
};

export type SearchProductsQueryVariables = SchemaTypes.Exact<{
  query: SchemaTypes.Scalars["String"];
  technology: SchemaTypes.Technology;
}>;

export type SearchProductsQuery = {
  readonly __typename?: "Query";
  readonly searchProducts?: {
    readonly __typename?: "ProductsConnection";
    readonly totalCount: number;
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Product";
      readonly id: number;
      readonly technology: SchemaTypes.Technology;
      readonly name: string;
      readonly description?: string | null;
      readonly published: boolean;
      readonly brand: string;
      readonly family: string;
      readonly bmiRef: string;
    }>;
  } | null;
};

export type SearchSystemsQueryVariables = SchemaTypes.Exact<{
  query: SchemaTypes.Scalars["String"];
  technology: SchemaTypes.Technology;
}>;

export type SearchSystemsQuery = {
  readonly __typename?: "Query";
  readonly searchSystems?: {
    readonly __typename?: "SystemsConnection";
    readonly totalCount: number;
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "System";
      readonly id: number;
      readonly technology: SchemaTypes.Technology;
      readonly name: string;
      readonly description?: string | null;
      readonly bmiRef: string;
      readonly systemMembersBySystemBmiRef: {
        readonly __typename?: "SystemMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "SystemMember";
          readonly id: number;
          readonly productByProductBmiRef?: {
            readonly __typename?: "Product";
            readonly id: number;
            readonly name: string;
            readonly family: string;
            readonly brand: string;
          } | null;
        }>;
      };
    }>;
  } | null;
};

export type GetProductGuaranteeTypesQueryVariables = SchemaTypes.Exact<{
  technology?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["String"]>;
}>;

export type GetProductGuaranteeTypesQuery = {
  readonly __typename?: "Query";
  readonly guaranteeTypeCollection?: {
    readonly __typename?: "GuaranteeTypeCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "GuaranteeType";
      readonly guaranteeReferenceCode?: string | null;
      readonly name?: string | null;
      readonly displayName?: string | null;
      readonly technology?: string | null;
      readonly coverage?: string | null;
      readonly ranking?: number | null;
      readonly tiersAvailable?: ReadonlyArray<string | null> | null;
      readonly sys: { readonly __typename?: "Sys"; readonly id: string };
      readonly evidenceCategoriesCollection?: {
        readonly __typename?: "GuaranteeTypeEvidenceCategoriesCollection";
        readonly items: ReadonlyArray<{
          readonly __typename?: "EvidenceCategory";
          readonly name?: string | null;
          readonly referenceCode?: string | null;
          readonly minimumUploads?: number | null;
        } | null>;
      } | null;
    } | null>;
  } | null;
};

export type AccountByEmailQueryVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type AccountByEmailQuery = {
  readonly __typename?: "Query";
  readonly accountByEmail?: {
    readonly __typename?: "Account";
    readonly id: number;
    readonly role?: SchemaTypes.Role | null;
    readonly marketId?: number | null;
    readonly firstName?: string | null;
    readonly lastName?: string | null;
    readonly email: string;
    readonly doceboUserId?: number | null;
    readonly market?: {
      readonly __typename?: "Market";
      readonly id: number;
      readonly domain: string;
      readonly language: SchemaTypes.Language;
      readonly projectsEnabled?: boolean | null;
      readonly doceboCompanyAdminBranchId?: string | null;
      readonly doceboInstallersBranchId?: string | null;
    } | null;
    readonly companyMembers: {
      readonly __typename?: "CompanyMembersConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "CompanyMember";
        readonly company?: {
          readonly __typename?: "Company";
          readonly id: number;
          readonly status?: SchemaTypes.CompanyStatus | null;
          readonly name?: string | null;
          readonly tier?: SchemaTypes.Tier | null;
        } | null;
      }>;
    };
    readonly projectMembers: {
      readonly __typename?: "ProjectMembersConnection";
      readonly totalCount: number;
    };
  } | null;
};

export type CreateAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateAccountInput;
}>;

export type CreateAccountMutation = {
  readonly __typename?: "Mutation";
  readonly createAccount?: {
    readonly __typename?: "CreateAccountPayload";
    readonly account?: {
      readonly __typename?: "Account";
      readonly id: number;
      readonly role?: SchemaTypes.Role | null;
      readonly email: string;
      readonly firstName?: string | null;
      readonly lastName?: string | null;
      readonly marketId?: number | null;
      readonly market?: {
        readonly __typename?: "Market";
        readonly language: SchemaTypes.Language;
        readonly doceboCompanyAdminBranchId?: string | null;
        readonly doceboInstallersBranchId?: string | null;
      } | null;
      readonly companyMembers: {
        readonly __typename?: "CompanyMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyMember";
          readonly company?: {
            readonly __typename?: "Company";
            readonly id: number;
            readonly status?: SchemaTypes.CompanyStatus | null;
          } | null;
        }>;
      };
    } | null;
  } | null;
};

export type CreateDoceboUserMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UserCreateInput;
}>;

export type CreateDoceboUserMutation = {
  readonly __typename?: "Mutation";
  readonly createDoceboUser?: {
    readonly __typename?: "UserCreateResponse";
    readonly success?: boolean | null;
    readonly user_id?: number | null;
  } | null;
};

export type UpdateAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateAccountMutation = {
  readonly __typename?: "Mutation";
  readonly updateAccount?: {
    readonly __typename?: "UpdateAccountPayload";
    readonly account?: {
      readonly __typename?: "Account";
      readonly id: number;
      readonly doceboUserId?: number | null;
    } | null;
  } | null;
};

export type UserByEmailQueryVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type UserByEmailQuery = {
  readonly __typename?: "Query";
  readonly userByEmail?: {
    readonly __typename?: "UserData";
    readonly user_id?: string | null;
  } | null;
};

export type InvitationsQueryVariables = SchemaTypes.Exact<{
  invitee: SchemaTypes.Scalars["String"];
}>;

export type InvitationsQuery = {
  readonly __typename?: "Query";
  readonly invitations?: {
    readonly __typename?: "InvitationsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Invitation";
      readonly id: number;
      readonly status: SchemaTypes.InvitationStatus;
      readonly invitee: string;
      readonly senderAccountId?: number | null;
    }>;
  } | null;
};

export type CompleteInvitationMutationVariables = SchemaTypes.Exact<{
  companyId: SchemaTypes.Scalars["Int"];
}>;

export type CompleteInvitationMutation = {
  readonly __typename?: "Mutation";
  readonly completeInvitation?: {
    readonly __typename?: "Account";
    readonly id: number;
    readonly role?: SchemaTypes.Role | null;
    readonly email: string;
    readonly firstName?: string | null;
    readonly lastName?: string | null;
    readonly marketId?: number | null;
    readonly market?: {
      readonly __typename?: "Market";
      readonly language: SchemaTypes.Language;
      readonly domain: string;
      readonly doceboCompanyAdminBranchId?: string | null;
      readonly doceboInstallersBranchId?: string | null;
    } | null;
  } | null;
};

export type CreateSsoUrlMutationVariables = SchemaTypes.Exact<{
  username: SchemaTypes.Scalars["String"];
  path?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["String"]>;
}>;

export type CreateSsoUrlMutation = {
  readonly __typename?: "Mutation";
  readonly createSSOUrl?: {
    readonly __typename?: "SSOUrlOutput";
    readonly url?: string | null;
  } | null;
};

export type GetMarketsByDomainQueryVariables = SchemaTypes.Exact<{
  domain: SchemaTypes.Scalars["String"];
}>;

export type GetMarketsByDomainQuery = {
  readonly __typename?: "Query";
  readonly markets?: {
    readonly __typename?: "MarketsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Market";
      readonly id: number;
      readonly name?: string | null;
      readonly cmsSpaceId?: string | null;
      readonly language: SchemaTypes.Language;
      readonly domain: string;
      readonly doceboCatalogueId?: number | null;
      readonly doceboCatalogueIdT2?: number | null;
      readonly doceboCatalogueIdT3?: number | null;
      readonly doceboCatalogueIdT4?: number | null;
      readonly doceboInstallersBranchId?: string | null;
      readonly doceboCompanyAdminBranchId?: string | null;
      readonly merchandisingUrl?: string | null;
      readonly projectsEnabled?: boolean | null;
      readonly gtag?: string | null;
      readonly gtagMarketMedia?: string | null;
      readonly sendName?: string | null;
      readonly sendMailbox?: string | null;
      readonly locationBiasRadiusKm?: number | null;
      readonly geoMiddle?: {
        readonly __typename?: "Point";
        readonly x: number;
        readonly y: number;
      } | null;
    }>;
  } | null;
};

export type ImageFragmentFragment = {
  readonly __typename?: "Asset";
  readonly title?: string | null;
  readonly description?: string | null;
  readonly contentType?: string | null;
  readonly fileName?: string | null;
  readonly size?: number | null;
  readonly url?: string | null;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly sys: { readonly __typename?: "Sys"; readonly id: string };
};

export type GetMediaFoldersQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetMediaFoldersQuery = {
  readonly __typename?: "Query";
  readonly marketContentCollection?: {
    readonly __typename?: "MarketContentCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "MarketContent";
      readonly mediaLibraryRootCollection?: {
        readonly __typename?: "MarketContentMediaLibraryRootCollection";
        readonly items: ReadonlyArray<{
          readonly __typename: "MediaFolder";
          readonly name?: string | null;
          readonly sys: { readonly __typename?: "Sys"; readonly id: string };
        } | null>;
      } | null;
    } | null>;
  } | null;
  readonly mediaFolderCollection?: {
    readonly __typename?: "MediaFolderCollection";
    readonly total: number;
    readonly items: ReadonlyArray<{
      readonly __typename: "MediaFolder";
      readonly name?: string | null;
      readonly sys: { readonly __typename?: "Sys"; readonly id: string };
      readonly childrenCollection?: {
        readonly __typename?: "MediaFolderChildrenCollection";
        readonly total: number;
        readonly items: ReadonlyArray<
          | {
              readonly __typename: "MediaFolder";
              readonly name?: string | null;
              readonly sys: {
                readonly __typename?: "Sys";
                readonly id: string;
              };
            }
          | {
              readonly __typename: "MediaTool";
              readonly name?: string | null;
              readonly sys: {
                readonly __typename?: "Sys";
                readonly id: string;
              };
            }
          | null
        >;
      } | null;
    } | null>;
  } | null;
};

export type MediaToolDetailsFragment = {
  readonly __typename: "MediaTool";
  readonly name?: string | null;
  readonly url?: string | null;
  readonly sys: { readonly __typename?: "Sys"; readonly id: string };
  readonly media?: {
    readonly __typename?: "Asset";
    readonly title?: string | null;
    readonly description?: string | null;
    readonly contentType?: string | null;
    readonly fileName?: string | null;
    readonly size?: number | null;
    readonly url?: string | null;
    readonly width?: number | null;
    readonly height?: number | null;
    readonly sys: { readonly __typename?: "Sys"; readonly id: string };
  } | null;
  readonly thumbnail?: {
    readonly __typename?: "Asset";
    readonly title?: string | null;
    readonly description?: string | null;
    readonly contentType?: string | null;
    readonly fileName?: string | null;
    readonly size?: number | null;
    readonly url?: string | null;
    readonly width?: number | null;
    readonly height?: number | null;
    readonly sys: { readonly __typename?: "Sys"; readonly id: string };
  } | null;
};

export type GetMediaFolderContentsQueryVariables = SchemaTypes.Exact<{
  mediaFolderId: SchemaTypes.Scalars["String"];
}>;

export type GetMediaFolderContentsQuery = {
  readonly __typename?: "Query";
  readonly mediaFolderCollection?: {
    readonly __typename?: "MediaFolderCollection";
    readonly items: ReadonlyArray<{
      readonly __typename: "MediaFolder";
      readonly name?: string | null;
      readonly sys: { readonly __typename?: "Sys"; readonly id: string };
      readonly childrenCollection?: {
        readonly __typename?: "MediaFolderChildrenCollection";
        readonly total: number;
        readonly items: ReadonlyArray<
          | {
              readonly __typename: "MediaFolder";
              readonly name?: string | null;
              readonly sys: {
                readonly __typename?: "Sys";
                readonly id: string;
              };
            }
          | {
              readonly __typename: "MediaTool";
              readonly name?: string | null;
              readonly url?: string | null;
              readonly sys: {
                readonly __typename?: "Sys";
                readonly id: string;
              };
              readonly media?: {
                readonly __typename?: "Asset";
                readonly title?: string | null;
                readonly description?: string | null;
                readonly contentType?: string | null;
                readonly fileName?: string | null;
                readonly size?: number | null;
                readonly url?: string | null;
                readonly width?: number | null;
                readonly height?: number | null;
                readonly sys: {
                  readonly __typename?: "Sys";
                  readonly id: string;
                };
              } | null;
              readonly thumbnail?: {
                readonly __typename?: "Asset";
                readonly title?: string | null;
                readonly description?: string | null;
                readonly contentType?: string | null;
                readonly fileName?: string | null;
                readonly size?: number | null;
                readonly url?: string | null;
                readonly width?: number | null;
                readonly height?: number | null;
                readonly sys: {
                  readonly __typename?: "Sys";
                  readonly id: string;
                };
              } | null;
            }
          | null
        >;
      } | null;
    } | null>;
  } | null;
};

export type AccountInfoByEmailQueryVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type AccountInfoByEmailQuery = {
  readonly __typename?: "Query";
  readonly accountByEmail?: {
    readonly __typename?: "Account";
    readonly id: number;
    readonly role?: SchemaTypes.Role | null;
    readonly marketId?: number | null;
    readonly firstName?: string | null;
    readonly lastName?: string | null;
    readonly email: string;
    readonly doceboUserId?: number | null;
    readonly market?: {
      readonly __typename?: "Market";
      readonly id: number;
      readonly domain: string;
      readonly projectsEnabled?: boolean | null;
    } | null;
    readonly companyMembers: {
      readonly __typename?: "CompanyMembersConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "CompanyMember";
        readonly company?: {
          readonly __typename?: "Company";
          readonly id: number;
          readonly status?: SchemaTypes.CompanyStatus | null;
          readonly name?: string | null;
          readonly tier?: SchemaTypes.Tier | null;
        } | null;
      }>;
    };
    readonly projectMembers: {
      readonly __typename?: "ProjectMembersConnection";
      readonly totalCount: number;
    };
  } | null;
};

export type GetGlobalDataPublicQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetGlobalDataPublicQuery = {
  readonly __typename?: "Query";
  readonly marketContentCollection?: {
    readonly __typename?: "MarketContentCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "MarketContent";
      readonly externalLinkUrl?: string | null;
      readonly externalLinkLabel?: string | null;
      readonly footerLinksCollection?: {
        readonly __typename?: "MarketContentFooterLinksCollection";
        readonly items: ReadonlyArray<{
          readonly __typename?: "ContentArticle";
          readonly title?: string | null;
          readonly relativePath?: string | null;
        } | null>;
      } | null;
      readonly contactUsPage?: {
        readonly __typename?: "ContentArticle";
        readonly title?: string | null;
        readonly relativePath?: string | null;
      } | null;
    } | null>;
  } | null;
};

export type GetContentArticleContentQueryVariables = SchemaTypes.Exact<{
  relativePath: SchemaTypes.Scalars["String"];
}>;

export type GetContentArticleContentQuery = {
  readonly __typename?: "Query";
  readonly contentArticleCollection?: {
    readonly __typename?: "ContentArticleCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "ContentArticle";
      readonly title?: string | null;
      readonly body?: {
        readonly __typename?: "ContentArticleBody";
        readonly json: any;
      } | null;
    } | null>;
  } | null;
};

export type MarketsQueryVariables = SchemaTypes.Exact<{ [key: string]: never }>;

export type MarketsQuery = {
  readonly __typename?: "Query";
  readonly markets?: {
    readonly __typename?: "MarketsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Market";
      readonly id: number;
      readonly language: SchemaTypes.Language;
      readonly domain: string;
      readonly cmsSpaceId?: string | null;
      readonly name?: string | null;
      readonly sendName?: string | null;
      readonly sendMailbox?: string | null;
      readonly doceboInstallersBranchId?: string | null;
      readonly doceboCompanyAdminBranchId?: string | null;
      readonly doceboCatalogueId?: number | null;
      readonly doceboCatalogueIdT2?: number | null;
      readonly doceboCatalogueIdT3?: number | null;
      readonly doceboCatalogueIdT4?: number | null;
      readonly merchandisingUrl?: string | null;
      readonly projectsEnabled?: boolean | null;
      readonly gtag?: string | null;
      readonly gtagMarketMedia?: string | null;
      readonly locationBiasRadiusKm?: number | null;
    }>;
  } | null;
};

export type ProductsAndSystemsQueryVariables = SchemaTypes.Exact<{
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type ProductsAndSystemsQuery = {
  readonly __typename?: "Query";
  readonly products?: {
    readonly __typename?: "ProductsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Product";
      readonly id: number;
      readonly name: string;
      readonly brand: string;
      readonly family: string;
      readonly bmiRef: string;
      readonly updatedAt: any;
      readonly published: boolean;
      readonly technology: SchemaTypes.Technology;
      readonly description?: string | null;
      readonly maximumValidityYears: number;
    }>;
  } | null;
  readonly systems?: {
    readonly __typename?: "SystemsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "System";
      readonly id: number;
      readonly name: string;
      readonly bmiRef: string;
      readonly published: boolean;
      readonly updatedAt: any;
      readonly technology: SchemaTypes.Technology;
      readonly description?: string | null;
      readonly maximumValidityYears: number;
    }>;
  } | null;
};

export type CompanyPageDetailsFragmentFragment = {
  readonly __typename?: "Company";
  readonly id: number;
  readonly status?: SchemaTypes.CompanyStatus | null;
  readonly isProfileComplete: boolean;
  readonly name?: string | null;
  readonly businessType?: SchemaTypes.BusinessType | null;
  readonly logo?: string | null;
  readonly aboutUs?: string | null;
  readonly ownerFullname?: string | null;
  readonly ownerPhone?: string | null;
  readonly ownerEmail?: string | null;
  readonly phone?: string | null;
  readonly publicEmail?: string | null;
  readonly website?: string | null;
  readonly facebook?: string | null;
  readonly linkedIn?: string | null;
  readonly referenceNumber: number;
  readonly taxNumber?: string | null;
  readonly tier?: SchemaTypes.Tier | null;
  readonly certifications: ReadonlyArray<SchemaTypes.Technology | null>;
  readonly tradingAddress?: {
    readonly __typename?: "Address";
    readonly id: number;
    readonly firstLine?: string | null;
    readonly secondLine?: string | null;
    readonly town?: string | null;
    readonly region?: string | null;
    readonly country?: string | null;
    readonly postcode?: string | null;
    readonly coordinates?: {
      readonly __typename?: "Point";
      readonly x: number;
      readonly y: number;
    } | null;
  } | null;
  readonly registeredAddress?: {
    readonly __typename?: "Address";
    readonly id: number;
    readonly firstLine?: string | null;
    readonly secondLine?: string | null;
    readonly town?: string | null;
    readonly region?: string | null;
    readonly country?: string | null;
    readonly postcode?: string | null;
    readonly coordinates?: {
      readonly __typename?: "Point";
      readonly x: number;
      readonly y: number;
    } | null;
  } | null;
  readonly companyOperationsByCompany: {
    readonly __typename?: "CompanyOperationsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CompanyOperation";
      readonly id: number;
      readonly operation: SchemaTypes.Operation;
    }>;
  };
  readonly companyMembers: {
    readonly __typename?: "CompanyMembersConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CompanyMember";
      readonly account?: {
        readonly __typename?: "Account";
        readonly role?: SchemaTypes.Role | null;
        readonly id: number;
        readonly firstName?: string | null;
        readonly lastName?: string | null;
        readonly phone?: string | null;
        readonly email: string;
        readonly photo?: string | null;
      } | null;
    }>;
  };
  readonly companyDocuments: {
    readonly __typename?: "CompanyDocumentsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CompanyDocument";
      readonly id: number;
      readonly document?: string | null;
      readonly name?: string | null;
      readonly documentType?: SchemaTypes.CompanyDocumentType | null;
      readonly size?: number | null;
      readonly signedDocumentUrl?: string | null;
      readonly createdAt: any;
      readonly updatedAt: any;
    }>;
  };
};

export type GetCompaniesByMarketQueryVariables = SchemaTypes.Exact<{
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompaniesByMarketQuery = {
  readonly __typename?: "Query";
  readonly companies?: {
    readonly __typename?: "CompaniesConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Company";
      readonly id: number;
      readonly status?: SchemaTypes.CompanyStatus | null;
      readonly isProfileComplete: boolean;
      readonly name?: string | null;
      readonly businessType?: SchemaTypes.BusinessType | null;
      readonly logo?: string | null;
      readonly aboutUs?: string | null;
      readonly ownerFullname?: string | null;
      readonly ownerPhone?: string | null;
      readonly ownerEmail?: string | null;
      readonly phone?: string | null;
      readonly publicEmail?: string | null;
      readonly website?: string | null;
      readonly facebook?: string | null;
      readonly linkedIn?: string | null;
      readonly referenceNumber: number;
      readonly taxNumber?: string | null;
      readonly tier?: SchemaTypes.Tier | null;
      readonly certifications: ReadonlyArray<SchemaTypes.Technology | null>;
      readonly tradingAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly registeredAddress?: {
        readonly __typename?: "Address";
        readonly id: number;
        readonly firstLine?: string | null;
        readonly secondLine?: string | null;
        readonly town?: string | null;
        readonly region?: string | null;
        readonly country?: string | null;
        readonly postcode?: string | null;
        readonly coordinates?: {
          readonly __typename?: "Point";
          readonly x: number;
          readonly y: number;
        } | null;
      } | null;
      readonly companyOperationsByCompany: {
        readonly __typename?: "CompanyOperationsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyOperation";
          readonly id: number;
          readonly operation: SchemaTypes.Operation;
        }>;
      };
      readonly companyMembers: {
        readonly __typename?: "CompanyMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyMember";
          readonly account?: {
            readonly __typename?: "Account";
            readonly role?: SchemaTypes.Role | null;
            readonly id: number;
            readonly firstName?: string | null;
            readonly lastName?: string | null;
            readonly phone?: string | null;
            readonly email: string;
            readonly photo?: string | null;
          } | null;
        }>;
      };
      readonly companyDocuments: {
        readonly __typename?: "CompanyDocumentsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyDocument";
          readonly id: number;
          readonly document?: string | null;
          readonly name?: string | null;
          readonly documentType?: SchemaTypes.CompanyDocumentType | null;
          readonly size?: number | null;
          readonly signedDocumentUrl?: string | null;
          readonly createdAt: any;
          readonly updatedAt: any;
        }>;
      };
    }>;
  } | null;
  readonly contactDetailsCollection?: {
    readonly __typename?: "ContactDetailsCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "ContactDetails";
      readonly fullName?: string | null;
      readonly subHeading?: string | null;
      readonly email?: string | null;
      readonly phoneNumber?: string | null;
    } | null>;
  } | null;
};

export type GetCompanyQueryVariables = SchemaTypes.Exact<{
  companyId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompanyQuery = {
  readonly __typename?: "Query";
  readonly company?: {
    readonly __typename?: "Company";
    readonly id: number;
    readonly status?: SchemaTypes.CompanyStatus | null;
    readonly isProfileComplete: boolean;
    readonly name?: string | null;
    readonly businessType?: SchemaTypes.BusinessType | null;
    readonly logo?: string | null;
    readonly aboutUs?: string | null;
    readonly ownerFullname?: string | null;
    readonly ownerPhone?: string | null;
    readonly ownerEmail?: string | null;
    readonly phone?: string | null;
    readonly publicEmail?: string | null;
    readonly website?: string | null;
    readonly facebook?: string | null;
    readonly linkedIn?: string | null;
    readonly referenceNumber: number;
    readonly taxNumber?: string | null;
    readonly tier?: SchemaTypes.Tier | null;
    readonly certifications: ReadonlyArray<SchemaTypes.Technology | null>;
    readonly tradingAddress?: {
      readonly __typename?: "Address";
      readonly id: number;
      readonly firstLine?: string | null;
      readonly secondLine?: string | null;
      readonly town?: string | null;
      readonly region?: string | null;
      readonly country?: string | null;
      readonly postcode?: string | null;
      readonly coordinates?: {
        readonly __typename?: "Point";
        readonly x: number;
        readonly y: number;
      } | null;
    } | null;
    readonly registeredAddress?: {
      readonly __typename?: "Address";
      readonly id: number;
      readonly firstLine?: string | null;
      readonly secondLine?: string | null;
      readonly town?: string | null;
      readonly region?: string | null;
      readonly country?: string | null;
      readonly postcode?: string | null;
      readonly coordinates?: {
        readonly __typename?: "Point";
        readonly x: number;
        readonly y: number;
      } | null;
    } | null;
    readonly companyOperationsByCompany: {
      readonly __typename?: "CompanyOperationsConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "CompanyOperation";
        readonly id: number;
        readonly operation: SchemaTypes.Operation;
      }>;
    };
    readonly companyMembers: {
      readonly __typename?: "CompanyMembersConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "CompanyMember";
        readonly account?: {
          readonly __typename?: "Account";
          readonly role?: SchemaTypes.Role | null;
          readonly id: number;
          readonly firstName?: string | null;
          readonly lastName?: string | null;
          readonly phone?: string | null;
          readonly email: string;
          readonly photo?: string | null;
        } | null;
      }>;
    };
    readonly companyDocuments: {
      readonly __typename?: "CompanyDocumentsConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "CompanyDocument";
        readonly id: number;
        readonly document?: string | null;
        readonly name?: string | null;
        readonly documentType?: SchemaTypes.CompanyDocumentType | null;
        readonly size?: number | null;
        readonly signedDocumentUrl?: string | null;
        readonly createdAt: any;
        readonly updatedAt: any;
      }>;
    };
  } | null;
  readonly contactDetailsCollection?: {
    readonly __typename?: "ContactDetailsCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "ContactDetails";
      readonly fullName?: string | null;
      readonly subHeading?: string | null;
      readonly email?: string | null;
      readonly phoneNumber?: string | null;
    } | null>;
  } | null;
};

export type GetPartnerBrandsQueryVariables = SchemaTypes.Exact<{
  role: SchemaTypes.Scalars["String"];
  tier: SchemaTypes.Scalars["String"];
}>;

export type GetPartnerBrandsQuery = {
  readonly __typename?: "Query";
  readonly marketContentCollection?: {
    readonly __typename?: "MarketContentCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "MarketContent";
      readonly newsItemUrl?: string | null;
      readonly newsItemCta?: string | null;
      readonly newsItemHeading?: string | null;
      readonly partnerBrandsCollection?: {
        readonly __typename?: "MarketContentPartnerBrandsCollection";
        readonly items: ReadonlyArray<{
          readonly __typename?: "PartnerBrand";
          readonly name?: string | null;
          readonly shortDescription?: string | null;
          readonly websiteUrl?: string | null;
          readonly description?: {
            readonly __typename?: "PartnerBrandDescription";
            readonly json: any;
          } | null;
          readonly image?: {
            readonly __typename?: "Asset";
            readonly title?: string | null;
            readonly description?: string | null;
            readonly contentType?: string | null;
            readonly fileName?: string | null;
            readonly size?: number | null;
            readonly url?: string | null;
            readonly width?: number | null;
            readonly height?: number | null;
            readonly sys: { readonly __typename?: "Sys"; readonly id: string };
          } | null;
          readonly logo?: {
            readonly __typename?: "Asset";
            readonly title?: string | null;
            readonly description?: string | null;
            readonly contentType?: string | null;
            readonly fileName?: string | null;
            readonly size?: number | null;
            readonly url?: string | null;
            readonly width?: number | null;
            readonly height?: number | null;
            readonly sys: { readonly __typename?: "Sys"; readonly id: string };
          } | null;
        } | null>;
      } | null;
    } | null>;
  } | null;
  readonly carouselCollection?: {
    readonly __typename?: "CarouselCollection";
    readonly total: number;
    readonly items: ReadonlyArray<{
      readonly __typename?: "Carousel";
      readonly audienceRole?: string | null;
      readonly listCollection?: {
        readonly __typename?: "CarouselListCollection";
        readonly total: number;
        readonly items: ReadonlyArray<{
          readonly __typename?: "CarouselItem";
          readonly header?: string | null;
          readonly body?: string | null;
          readonly cta?: string | null;
          readonly audienceTiers?: ReadonlyArray<string | null> | null;
          readonly image?: {
            readonly __typename?: "Asset";
            readonly title?: string | null;
            readonly description?: string | null;
            readonly url?: string | null;
          } | null;
        } | null>;
      } | null;
    } | null>;
  } | null;
  readonly tierBenefitCollection?: {
    readonly __typename?: "TierBenefitCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "TierBenefit";
      readonly name?: string | null;
      readonly description?: {
        readonly __typename?: "TierBenefitDescription";
        readonly json: any;
      } | null;
    } | null>;
  } | null;
};

export type AccountPageDetailsFragmentFragment = {
  readonly __typename?: "Account";
  readonly id: number;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly role?: SchemaTypes.Role | null;
  readonly email: string;
  readonly phone?: string | null;
  readonly photo?: string | null;
  readonly signedPhotoUrl?: string | null;
  readonly companyMembers: {
    readonly __typename?: "CompanyMembersConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CompanyMember";
      readonly company?: {
        readonly __typename?: "Company";
        readonly id: number;
        readonly name?: string | null;
        readonly businessType?: SchemaTypes.BusinessType | null;
        readonly logo?: string | null;
        readonly aboutUs?: string | null;
        readonly ownerFullname?: string | null;
        readonly ownerPhone?: string | null;
        readonly ownerEmail?: string | null;
        readonly phone?: string | null;
        readonly publicEmail?: string | null;
        readonly website?: string | null;
        readonly facebook?: string | null;
        readonly linkedIn?: string | null;
        readonly tradingAddress?: {
          readonly __typename?: "Address";
          readonly id: number;
          readonly firstLine?: string | null;
          readonly secondLine?: string | null;
          readonly town?: string | null;
          readonly region?: string | null;
          readonly country?: string | null;
          readonly postcode?: string | null;
          readonly coordinates?: {
            readonly __typename?: "Point";
            readonly x: number;
            readonly y: number;
          } | null;
        } | null;
      } | null;
    }>;
  };
  readonly certificationsByDoceboUserId: {
    readonly __typename?: "CertificationsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Certification";
      readonly id: number;
      readonly technology?: string | null;
      readonly expiryDate?: any | null;
      readonly name?: string | null;
    }>;
  };
};

export type GetUserProfileQueryVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
}>;

export type GetUserProfileQuery = {
  readonly __typename?: "Query";
  readonly account?: {
    readonly __typename?: "Account";
    readonly id: number;
    readonly firstName?: string | null;
    readonly lastName?: string | null;
    readonly role?: SchemaTypes.Role | null;
    readonly email: string;
    readonly phone?: string | null;
    readonly photo?: string | null;
    readonly signedPhotoUrl?: string | null;
    readonly companyMembers: {
      readonly __typename?: "CompanyMembersConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "CompanyMember";
        readonly company?: {
          readonly __typename?: "Company";
          readonly id: number;
          readonly name?: string | null;
          readonly businessType?: SchemaTypes.BusinessType | null;
          readonly logo?: string | null;
          readonly aboutUs?: string | null;
          readonly ownerFullname?: string | null;
          readonly ownerPhone?: string | null;
          readonly ownerEmail?: string | null;
          readonly phone?: string | null;
          readonly publicEmail?: string | null;
          readonly website?: string | null;
          readonly facebook?: string | null;
          readonly linkedIn?: string | null;
          readonly tradingAddress?: {
            readonly __typename?: "Address";
            readonly id: number;
            readonly firstLine?: string | null;
            readonly secondLine?: string | null;
            readonly town?: string | null;
            readonly region?: string | null;
            readonly country?: string | null;
            readonly postcode?: string | null;
            readonly coordinates?: {
              readonly __typename?: "Point";
              readonly x: number;
              readonly y: number;
            } | null;
          } | null;
        } | null;
      }>;
    };
    readonly certificationsByDoceboUserId: {
      readonly __typename?: "CertificationsConnection";
      readonly nodes: ReadonlyArray<{
        readonly __typename?: "Certification";
        readonly id: number;
        readonly technology?: string | null;
        readonly expiryDate?: any | null;
        readonly name?: string | null;
      }>;
    };
  } | null;
};

export type GetProjectsQueryVariables = SchemaTypes.Exact<{
  market: SchemaTypes.Scalars["Int"];
}>;

export type GetProjectsQuery = {
  readonly __typename?: "Query";
  readonly projectsByMarket?: {
    readonly __typename?: "ProjectsConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Project";
      readonly id: number;
      readonly name: string;
      readonly technology: SchemaTypes.Technology;
      readonly startDate: any;
      readonly endDate: any;
      readonly siteAddress?: {
        readonly __typename?: "Address";
        readonly town?: string | null;
        readonly postcode?: string | null;
      } | null;
      readonly company?: {
        readonly __typename?: "Company";
        readonly name?: string | null;
        readonly status?: SchemaTypes.CompanyStatus | null;
      } | null;
      readonly guarantees: {
        readonly __typename?: "GuaranteesConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Guarantee";
          readonly coverage?: SchemaTypes.GuaranteeCoverage | null;
          readonly status?: SchemaTypes.RequestStatus | null;
          readonly reviewerAccountId?: number | null;
        }>;
      };
    }>;
  } | null;
};

export type TeamMembersQueryVariables = SchemaTypes.Exact<{
  expiryDate?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Datetime"]>;
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type TeamMembersQuery = {
  readonly __typename?: "Query";
  readonly accounts?: {
    readonly __typename?: "AccountsConnection";
    readonly totalCount: number;
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "Account";
      readonly id: number;
      readonly role?: SchemaTypes.Role | null;
      readonly email: string;
      readonly phone?: string | null;
      readonly photo?: string | null;
      readonly signedPhotoUrl?: string | null;
      readonly lastName?: string | null;
      readonly firstName?: string | null;
      readonly formattedRole?: string | null;
      readonly status?: SchemaTypes.AccountStatus | null;
      readonly certificationsByDoceboUserId: {
        readonly __typename?: "CertificationsConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "Certification";
          readonly id: number;
          readonly name?: string | null;
          readonly technology?: string | null;
          readonly expiryDate?: any | null;
        }>;
      };
      readonly companyMembers: {
        readonly __typename?: "CompanyMembersConnection";
        readonly nodes: ReadonlyArray<{
          readonly __typename?: "CompanyMember";
          readonly id: number;
          readonly company?: {
            readonly __typename?: "Company";
            readonly name?: string | null;
          } | null;
        }>;
      };
    }>;
  } | null;
};

export type UpdateRoleAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateRoleAccountMutation = {
  readonly __typename?: "Mutation";
  readonly updateAccount?: {
    readonly __typename?: "UpdateAccountPayload";
    readonly account?: {
      readonly __typename?: "Account";
      readonly id: number;
    } | null;
  } | null;
};

export type TrainingQueryVariables = SchemaTypes.Exact<{
  catalogueId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
  userId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type TrainingQuery = {
  readonly __typename?: "Query";
  readonly trainingContentCollection?: {
    readonly __typename?: "TrainingContentCollection";
    readonly items: ReadonlyArray<{
      readonly __typename?: "TrainingContent";
      readonly pageHeading?: string | null;
      readonly description?: string | null;
      readonly lmsCtaLabel?: string | null;
      readonly pageSubHeading?: string | null;
      readonly step1Heading?: string | null;
      readonly step1SubHeading?: string | null;
      readonly step1Description?: string | null;
      readonly step2Heading?: string | null;
      readonly step2SubHeading?: string | null;
      readonly step2Description?: string | null;
      readonly step3Heading?: string | null;
      readonly step3SubHeading?: string | null;
      readonly step3Description?: string | null;
      readonly live?: string | null;
      readonly image?: {
        readonly __typename?: "Asset";
        readonly url?: string | null;
      } | null;
    } | null>;
  } | null;
  readonly courseCatalogues?: {
    readonly __typename?: "CourseCataloguesConnection";
    readonly nodes: ReadonlyArray<{
      readonly __typename?: "CourseCatalogue";
      readonly course?: {
        readonly __typename?: "Course";
        readonly courseId?: number | null;
        readonly name?: string | null;
        readonly slug?: string | null;
        readonly technology?: string | null;
        readonly image?: string | null;
        readonly promoted?: boolean | null;
        readonly trainingType?: string | null;
        readonly description?: string | null;
        readonly courseEnrollments: {
          readonly __typename?: "CourseEnrollmentsConnection";
          readonly nodes: ReadonlyArray<{
            readonly __typename?: "CourseEnrollment";
            readonly id: number;
            readonly status?: string | null;
            readonly url?: string | null;
            readonly courseId?: number | null;
          }>;
        };
      } | null;
    }>;
  } | null;
};

export type DoceboCatalogIdByMarketDomainQueryVariables = SchemaTypes.Exact<{
  domain: SchemaTypes.Scalars["String"];
}>;

export type DoceboCatalogIdByMarketDomainQuery = {
  readonly __typename?: "Query";
  readonly marketByDomain?: {
    readonly __typename?: "Market";
    readonly doceboCatalogueId?: number | null;
    readonly doceboCatalogueIdT2?: number | null;
    readonly doceboCatalogueIdT3?: number | null;
    readonly doceboCatalogueIdT4?: number | null;
  } | null;
};
