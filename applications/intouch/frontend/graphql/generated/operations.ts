import type * as SchemaTypes from "@bmi/intouch-api-types";

export type AddressLinesFragmentFragment = {
  __typename?: "Address";
  id: number;
  firstLine?: string | null;
  secondLine?: string | null;
  town?: string | null;
  region?: string | null;
  country?: string | null;
  postcode?: string | null;
  coordinates?: { __typename?: "Point"; x: number; y: number } | null;
};

export type CompanyCertificationsFragment = {
  __typename?: "Company";
  certifications: Array<SchemaTypes.Technology | null>;
};

export type UpdateProjectHiddenMutationVariables = SchemaTypes.Exact<{
  projectId: SchemaTypes.Scalars["Int"];
  hidden: SchemaTypes.Scalars["Boolean"];
}>;

export type UpdateProjectHiddenMutation = {
  __typename?: "Mutation";
  updateProject?: {
    __typename?: "UpdateProjectPayload";
    project?: {
      __typename?: "Project";
      id: number;
      hidden?: boolean | null;
    } | null;
  } | null;
};

export type UpdateProjectInspectionMutationVariables = SchemaTypes.Exact<{
  projectId: SchemaTypes.Scalars["Int"];
  inspection: SchemaTypes.Scalars["Boolean"];
}>;

export type UpdateProjectInspectionMutation = {
  __typename?: "Mutation";
  updateProject?: {
    __typename?: "UpdateProjectPayload";
    project?: {
      __typename?: "Project";
      id: number;
      inspection?: boolean | null;
    } | null;
  } | null;
};

export type RestartGuaranteeMutationVariables = SchemaTypes.Exact<{
  projectId: SchemaTypes.Scalars["Int"];
}>;

export type RestartGuaranteeMutation = {
  __typename?: "Mutation";
  restartGuarantee?: string | null;
};

export type ContactDetailsCollectionFragmentFragment = {
  __typename?: "ContactDetailsCollection";
  items: Array<{
    __typename?: "ContactDetails";
    fullName?: string | null;
    subHeading?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  } | null>;
};

export type MarkAllNotificationsAsReadMutationVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
}>;

export type MarkAllNotificationsAsReadMutation = {
  __typename?: "Mutation";
  markAllNotificationsAsRead?: {
    __typename?: "MarkAllNotificationsAsReadPayload";
    notifications?: Array<{
      __typename?: "Notification";
      id: number;
      read: boolean;
    }> | null;
  } | null;
};

export type GetGlobalDataQueryVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
}>;

export type GetGlobalDataQuery = {
  __typename?: "Query";
  marketContentCollection?: {
    __typename?: "MarketContentCollection";
    items: Array<{
      __typename?: "MarketContent";
      externalLinkUrl?: string | null;
      externalLinkLabel?: string | null;
      footerLinksCollection?: {
        __typename?: "MarketContentFooterLinksCollection";
        items: Array<{
          __typename?: "ContentArticle";
          title?: string | null;
          relativePath?: string | null;
        } | null>;
      } | null;
      contactUsPage?: {
        __typename?: "ContentArticle";
        title?: string | null;
        relativePath?: string | null;
      } | null;
    } | null>;
  } | null;
  notifications?: {
    __typename?: "NotificationsConnection";
    nodes: Array<{
      __typename?: "Notification";
      body?: string | null;
      sendDate: any;
      read: boolean;
      id: number;
    }>;
  } | null;
};

export type CompanyAdminsFragmentFragment = {
  __typename?: "Company";
  companyMembers: {
    __typename?: "CompanyMembersConnection";
    nodes: Array<{
      __typename?: "CompanyMember";
      account?: {
        __typename?: "Account";
        role?: SchemaTypes.Role | null;
        id: number;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        email: string;
        photo?: string | null;
        signedPhotoUrl?: string | null;
      } | null;
    }>;
  };
};

export type CompanyDetailsFragmentFragment = {
  __typename?: "Company";
  name?: string | null;
  businessType?: SchemaTypes.BusinessType | null;
  logo?: string | null;
  aboutUs?: string | null;
  ownerFullname?: string | null;
  ownerPhone?: string | null;
  ownerEmail?: string | null;
  phone?: string | null;
  publicEmail?: string | null;
  website?: string | null;
  facebook?: string | null;
  linkedIn?: string | null;
  tradingAddress?: {
    __typename?: "Address";
    id: number;
    firstLine?: string | null;
    secondLine?: string | null;
    town?: string | null;
    region?: string | null;
    country?: string | null;
    postcode?: string | null;
    coordinates?: { __typename?: "Point"; x: number; y: number } | null;
  } | null;
};

export type CompanyDocumentFragmentFragment = {
  __typename?: "CompanyDocument";
  id: number;
  document?: string | null;
  name?: string | null;
  documentType?: SchemaTypes.CompanyDocumentType | null;
  size?: number | null;
  signedDocumentUrl?: string | null;
  createdAt: any;
  updatedAt: any;
};

export type CompanyDocumentsFragmentFragment = {
  __typename?: "Company";
  companyDocuments: {
    __typename?: "CompanyDocumentsConnection";
    nodes: Array<{
      __typename?: "CompanyDocument";
      id: number;
      document?: string | null;
      name?: string | null;
      documentType?: SchemaTypes.CompanyDocumentType | null;
      size?: number | null;
      signedDocumentUrl?: string | null;
      createdAt: any;
      updatedAt: any;
    }>;
  };
};

export type CreateCompanyDocumentsMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateCompanyDocumentsInput;
}>;

export type CreateCompanyDocumentsMutation = {
  __typename?: "Mutation";
  createCompanyDocuments?: {
    __typename?: "CreateCompanyDocumentsPayload";
    companyDocuments?: Array<{
      __typename?: "CompanyDocument";
      id: number;
      document?: string | null;
      name?: string | null;
      documentType?: SchemaTypes.CompanyDocumentType | null;
      size?: number | null;
      signedDocumentUrl?: string | null;
      createdAt: any;
      updatedAt: any;
    }> | null;
  } | null;
};

export type DeleteCompanyDocumentMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.DeleteCompanyDocumentInput;
}>;

export type DeleteCompanyDocumentMutation = {
  __typename?: "Mutation";
  deleteCompanyDocument?: {
    __typename?: "DeleteCompanyDocumentPayload";
    companyDocument?: {
      __typename?: "CompanyDocument";
      id: number;
      document?: string | null;
      createdAt: any;
    } | null;
  } | null;
};

export type UpdateCompanyDetailsMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateCompanyInput;
}>;

export type UpdateCompanyDetailsMutation = {
  __typename?: "Mutation";
  updateCompany?: {
    __typename?: "UpdateCompanyPayload";
    company?: {
      __typename?: "Company";
      id: number;
      status?: SchemaTypes.CompanyStatus | null;
      isProfileComplete: boolean;
      name?: string | null;
      businessType?: SchemaTypes.BusinessType | null;
      logo?: string | null;
      aboutUs?: string | null;
      ownerFullname?: string | null;
      ownerPhone?: string | null;
      ownerEmail?: string | null;
      phone?: string | null;
      publicEmail?: string | null;
      website?: string | null;
      facebook?: string | null;
      linkedIn?: string | null;
      referenceNumber: number;
      taxNumber?: string | null;
      tier?: SchemaTypes.Tier | null;
      certifications: Array<SchemaTypes.Technology | null>;
      tradingAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      registeredAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      companyOperationsByCompany: {
        __typename?: "CompanyOperationsConnection";
        nodes: Array<{
          __typename?: "CompanyOperation";
          id: number;
          operation: SchemaTypes.Operation;
        }>;
      };
      companyMembers: {
        __typename?: "CompanyMembersConnection";
        nodes: Array<{
          __typename?: "CompanyMember";
          account?: {
            __typename?: "Account";
            role?: SchemaTypes.Role | null;
            id: number;
            firstName?: string | null;
            lastName?: string | null;
            phone?: string | null;
            email: string;
            photo?: string | null;
            signedPhotoUrl?: string | null;
          } | null;
        }>;
      };
      companyDocuments: {
        __typename?: "CompanyDocumentsConnection";
        nodes: Array<{
          __typename?: "CompanyDocument";
          id: number;
          document?: string | null;
          name?: string | null;
          documentType?: SchemaTypes.CompanyDocumentType | null;
          size?: number | null;
          signedDocumentUrl?: string | null;
          createdAt: any;
          updatedAt: any;
        }>;
      };
    } | null;
  } | null;
};

export type InviteMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.InviteInput;
}>;

export type InviteMutation = {
  __typename?: "Mutation";
  invite?: Array<{
    __typename?: "Invitation";
    id: number;
    invitee: string;
    senderAccount?: { __typename?: "Account"; email: string } | null;
  } | null> | null;
};

export type DeleteCompanyMemberMutationVariables = SchemaTypes.Exact<{
  id: SchemaTypes.Scalars["Int"];
}>;

export type DeleteCompanyMemberMutation = {
  __typename?: "Mutation";
  deleteCompanyMember?: {
    __typename?: "DeleteCompanyMemberPayload";
    clientMutationId?: string | null;
  } | null;
};

export type CompanyRegisteredDetailsFragmentFragment = {
  __typename?: "Company";
  name?: string | null;
  referenceNumber: number;
  taxNumber?: string | null;
  tier?: SchemaTypes.Tier | null;
  registeredAddress?: {
    __typename?: "Address";
    id: number;
    firstLine?: string | null;
    secondLine?: string | null;
    town?: string | null;
    region?: string | null;
    country?: string | null;
    postcode?: string | null;
    coordinates?: { __typename?: "Point"; x: number; y: number } | null;
  } | null;
  companyOperationsByCompany: {
    __typename?: "CompanyOperationsConnection";
    nodes: Array<{
      __typename?: "CompanyOperation";
      id: number;
      operation: SchemaTypes.Operation;
    }>;
  };
};

export type ImportAccountsCompaniesFromCvsMutationVariables =
  SchemaTypes.Exact<{
    input: SchemaTypes.ImportAccountsCompaniesFromCsvInput;
  }>;

export type ImportAccountsCompaniesFromCvsMutation = {
  __typename?: "Mutation";
  importAccountsCompaniesFromCVS?: {
    __typename?: "ImportAccountsCompaniesFromCSVResult";
    auth0Job?: { __typename?: "Auth0ImportResult"; id?: string | null } | null;
    accounts?: Array<{
      __typename?: "Account";
      email: string;
      role?: SchemaTypes.Role | null;
      phone?: string | null;
      status?: SchemaTypes.AccountStatus | null;
      firstName?: string | null;
      lastName?: string | null;
      created?: any | null;
      doceboUserId?: number | null;
      doceboUsername?: string | null;
    } | null> | null;
    companies?: Array<{
      __typename?: "Company";
      businessType?: SchemaTypes.BusinessType | null;
      name?: string | null;
      tier?: SchemaTypes.Tier | null;
      status?: SchemaTypes.CompanyStatus | null;
      taxNumber?: string | null;
      aboutUs?: string | null;
      logo?: string | null;
      phone?: string | null;
      publicEmail?: string | null;
      website?: string | null;
      linkedIn?: string | null;
      registeredAddress?: {
        __typename?: "Address";
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      companyMembers: {
        __typename?: "CompanyMembersConnection";
        nodes: Array<{
          __typename?: "CompanyMember";
          account?: {
            __typename?: "Account";
            role?: SchemaTypes.Role | null;
            email: string;
            status?: SchemaTypes.AccountStatus | null;
            phone?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            created?: any | null;
            doceboUserId?: number | null;
            doceboUsername?: string | null;
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
  __typename?: "Mutation";
  updateMarket?: {
    __typename?: "UpdateMarketPayload";
    query?: {
      __typename?: "Query";
      markets?: {
        __typename?: "MarketsConnection";
        nodes: Array<{
          __typename?: "Market";
          id: number;
          language: SchemaTypes.Language;
          domain: string;
          cmsSpaceId?: string | null;
          name?: string | null;
          sendName?: string | null;
          sendMailbox?: string | null;
          doceboInstallersBranchId?: string | null;
          doceboCompanyAdminBranchId?: string | null;
          merchandisingUrl?: string | null;
          projectsEnabled?: boolean | null;
          locationBiasRadiusKm?: number | null;
          gtag?: string | null;
          gtagMarketMedia?: string | null;
        }>;
      } | null;
    } | null;
  } | null;
};

export type UpdateDoceboTiersByMarketMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateDoceboTiersByMarketInput;
}>;

export type UpdateDoceboTiersByMarketMutation = {
  __typename?: "Mutation";
  updateDoceboTiersByMarket?: Array<{
    __typename?: "UpdateDoceboTiersByMarketResult";
    id?: number | null;
    docebo_catalogue_id?: number | null;
    market_id?: number | null;
    tier_code?: SchemaTypes.Tier | null;
  } | null> | null;
};

export type BulkImportMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.BulkImportInput;
}>;

export type BulkImportMutation = {
  __typename?: "Mutation";
  bulkImport?: {
    __typename?: "ImportOutput";
    systemsToInsert?: Array<{ __typename?: "System"; bmiRef: string }> | null;
    systemsToUpdate?: Array<{ __typename?: "System"; bmiRef: string }> | null;
    productsToInsert?: Array<{ __typename?: "Product"; bmiRef: string }> | null;
    productsToUpdate?: Array<{ __typename?: "Product"; bmiRef: string }> | null;
    errorSystemsToUpdate?: Array<{
      __typename?: "ImportError";
      ref?: string | null;
      message?: string | null;
    }> | null;
    errorSystemsToInsert?: Array<{
      __typename?: "ImportError";
      ref?: string | null;
      message?: string | null;
    }> | null;
    errorProductsToUpdate?: Array<{
      __typename?: "ImportError";
      ref?: string | null;
      message?: string | null;
    }> | null;
    errorProductsToInsert?: Array<{
      __typename?: "ImportError";
      ref?: string | null;
      message?: string | null;
    }> | null;
    errorSystemMembersInsert?: Array<{
      __typename?: "ImportError";
      ref?: string | null;
      message?: string | null;
    }> | null;
  } | null;
};

export type UpdateProductMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProductInput;
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type UpdateProductMutation = {
  __typename?: "Mutation";
  updateProduct?: {
    __typename?: "UpdateProductPayload";
    query?: {
      __typename?: "Query";
      products?: {
        __typename?: "ProductsConnection";
        nodes: Array<{
          __typename?: "Product";
          id: number;
          name: string;
          brand: string;
          family: string;
          bmiRef: string;
          updatedAt: any;
          published: boolean;
          technology: SchemaTypes.Technology;
          description?: string | null;
          maximumValidityYears: number;
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
  __typename?: "Mutation";
  updateSystem?: {
    __typename?: "UpdateSystemPayload";
    query?: {
      __typename?: "Query";
      systems?: {
        __typename?: "SystemsConnection";
        nodes: Array<{
          __typename?: "System";
          id: number;
          name: string;
          bmiRef: string;
          updatedAt: any;
          published: boolean;
          technology: SchemaTypes.Technology;
          description?: string | null;
          maximumValidityYears: number;
        }>;
      } | null;
    } | null;
  } | null;
};

export type CreateProjectMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateProjectInput;
}>;

export type CreateProjectMutation = {
  __typename?: "Mutation";
  createProject?: {
    __typename?: "CreateProjectPayload";
    project?: {
      __typename?: "Project";
      id: number;
      hidden?: boolean | null;
      name: string;
      technology: SchemaTypes.Technology;
      roofArea: number;
      startDate: any;
      endDate: any;
      description?: string | null;
      buildingOwnerFirstname?: string | null;
      buildingOwnerLastname?: string | null;
      buildingOwnerCompany?: string | null;
      buildingOwnerMail?: string | null;
      inspection?: boolean | null;
      inspectedAt?: any | null;
      siteAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      buildingOwnerAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      guarantees: {
        __typename?: "GuaranteesConnection";
        nodes: Array<{
          __typename?: "Guarantee";
          id: number;
          guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
          reviewerAccountId?: number | null;
          coverage?: SchemaTypes.GuaranteeCoverage | null;
          languageCode?: SchemaTypes.Language | null;
          fileStorageId?: string | null;
          signedFileStorageUrl?: string | null;
          status?: SchemaTypes.RequestStatus | null;
          guaranteeType?: {
            __typename?: "ContentfulGuaranteeType";
            name?: string | null;
            coverage?: SchemaTypes.ContentfulGuaranteeCoverageType | null;
            displayName?: string | null;
            technology?: SchemaTypes.ContentfulTechnologyType | null;
            tiersAvailable?: Array<SchemaTypes.ContentfulTiers | null> | null;
            sys: { __typename?: "ContentfulSys"; id: string };
            evidenceCategoriesCollection?: {
              __typename?: "ContentfulEvidenceCategoryCollection";
              items?: Array<{
                __typename?: "ContentfulEvidenceCategory";
                referenceCode?: string | null;
                name?: string | null;
                minimumUploads?: number | null;
                sys: { __typename?: "ContentfulSys"; id: string };
                description?: {
                  __typename?: "ContentfulEvidenceCategoryDescription";
                  json: any;
                } | null;
              } | null> | null;
            } | null;
          } | null;
          productByProductBmiRef?: {
            __typename?: "Product";
            id: number;
            name: string;
            brand: string;
            family: string;
            description?: string | null;
          } | null;
          systemBySystemBmiRef?: {
            __typename?: "System";
            id: number;
            name: string;
            description?: string | null;
            systemMembersBySystemBmiRef: {
              __typename?: "SystemMembersConnection";
              nodes: Array<{
                __typename?: "SystemMember";
                id: number;
                productByProductBmiRef?: {
                  __typename?: "Product";
                  id: number;
                  name: string;
                  brand: string;
                  family: string;
                  description?: string | null;
                } | null;
              }>;
            };
          } | null;
        }>;
      };
      evidenceItems: {
        __typename?: "EvidenceItemsConnection";
        nodes: Array<{
          __typename?: "EvidenceItem";
          id: number;
          name: string;
          signedUrl?: string | null;
          guaranteeId?: number | null;
          evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
          customEvidenceCategoryKey?: SchemaTypes.CustomEvidenceCategoryKey | null;
          customEvidenceCategory?: {
            __typename?: "ContentfulEvidenceCategory";
            name?: string | null;
            minimumUploads?: number | null;
          } | null;
        }>;
      };
      notes: {
        __typename?: "NotesConnection";
        nodes: Array<{
          __typename?: "Note";
          id: number;
          body?: string | null;
          senderName?: string | null;
          createdAt: any;
        }>;
      };
      projectMembers: {
        __typename?: "ProjectMembersConnection";
        nodes: Array<{
          __typename?: "ProjectMember";
          id: number;
          accountId?: number | null;
          isResponsibleInstaller?: boolean | null;
          account?: {
            __typename?: "Account";
            id: number;
            firstName?: string | null;
            lastName?: string | null;
            role?: SchemaTypes.Role | null;
            certificationsByDoceboUserId: {
              __typename?: "CertificationsConnection";
              nodes: Array<{
                __typename?: "Certification";
                name?: string | null;
                technology?: string | null;
              }>;
            };
          } | null;
        }>;
      };
      company?: {
        __typename?: "Company";
        id: number;
        name?: string | null;
        tier?: SchemaTypes.Tier | null;
      } | null;
    } | null;
  } | null;
};

export type UpdateProjectMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProjectInput;
}>;

export type UpdateProjectMutation = {
  __typename?: "Mutation";
  updateProject?: {
    __typename?: "UpdateProjectPayload";
    project?: {
      __typename?: "Project";
      id: number;
      hidden?: boolean | null;
      name: string;
      technology: SchemaTypes.Technology;
      roofArea: number;
      startDate: any;
      endDate: any;
      description?: string | null;
      buildingOwnerFirstname?: string | null;
      buildingOwnerLastname?: string | null;
      buildingOwnerCompany?: string | null;
      buildingOwnerMail?: string | null;
      inspection?: boolean | null;
      inspectedAt?: any | null;
      siteAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      buildingOwnerAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      guarantees: {
        __typename?: "GuaranteesConnection";
        nodes: Array<{
          __typename?: "Guarantee";
          id: number;
          guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
          reviewerAccountId?: number | null;
          coverage?: SchemaTypes.GuaranteeCoverage | null;
          languageCode?: SchemaTypes.Language | null;
          fileStorageId?: string | null;
          signedFileStorageUrl?: string | null;
          status?: SchemaTypes.RequestStatus | null;
          guaranteeType?: {
            __typename?: "ContentfulGuaranteeType";
            name?: string | null;
            coverage?: SchemaTypes.ContentfulGuaranteeCoverageType | null;
            displayName?: string | null;
            technology?: SchemaTypes.ContentfulTechnologyType | null;
            tiersAvailable?: Array<SchemaTypes.ContentfulTiers | null> | null;
            sys: { __typename?: "ContentfulSys"; id: string };
            evidenceCategoriesCollection?: {
              __typename?: "ContentfulEvidenceCategoryCollection";
              items?: Array<{
                __typename?: "ContentfulEvidenceCategory";
                referenceCode?: string | null;
                name?: string | null;
                minimumUploads?: number | null;
                sys: { __typename?: "ContentfulSys"; id: string };
                description?: {
                  __typename?: "ContentfulEvidenceCategoryDescription";
                  json: any;
                } | null;
              } | null> | null;
            } | null;
          } | null;
          productByProductBmiRef?: {
            __typename?: "Product";
            id: number;
            name: string;
            brand: string;
            family: string;
            description?: string | null;
          } | null;
          systemBySystemBmiRef?: {
            __typename?: "System";
            id: number;
            name: string;
            description?: string | null;
            systemMembersBySystemBmiRef: {
              __typename?: "SystemMembersConnection";
              nodes: Array<{
                __typename?: "SystemMember";
                id: number;
                productByProductBmiRef?: {
                  __typename?: "Product";
                  id: number;
                  name: string;
                  brand: string;
                  family: string;
                  description?: string | null;
                } | null;
              }>;
            };
          } | null;
        }>;
      };
      evidenceItems: {
        __typename?: "EvidenceItemsConnection";
        nodes: Array<{
          __typename?: "EvidenceItem";
          id: number;
          name: string;
          signedUrl?: string | null;
          guaranteeId?: number | null;
          evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
          customEvidenceCategoryKey?: SchemaTypes.CustomEvidenceCategoryKey | null;
          customEvidenceCategory?: {
            __typename?: "ContentfulEvidenceCategory";
            name?: string | null;
            minimumUploads?: number | null;
          } | null;
        }>;
      };
      notes: {
        __typename?: "NotesConnection";
        nodes: Array<{
          __typename?: "Note";
          id: number;
          body?: string | null;
          senderName?: string | null;
          createdAt: any;
        }>;
      };
      projectMembers: {
        __typename?: "ProjectMembersConnection";
        nodes: Array<{
          __typename?: "ProjectMember";
          id: number;
          accountId?: number | null;
          isResponsibleInstaller?: boolean | null;
          account?: {
            __typename?: "Account";
            id: number;
            firstName?: string | null;
            lastName?: string | null;
            role?: SchemaTypes.Role | null;
            certificationsByDoceboUserId: {
              __typename?: "CertificationsConnection";
              nodes: Array<{
                __typename?: "Certification";
                name?: string | null;
                technology?: string | null;
              }>;
            };
          } | null;
        }>;
      };
      company?: {
        __typename?: "Company";
        id: number;
        name?: string | null;
        tier?: SchemaTypes.Tier | null;
      } | null;
    } | null;
  } | null;
};

export type UpdateAccountProfileMutationVariables = SchemaTypes.Exact<{
  updateAccountInput: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateAccountProfileMutation = {
  __typename?: "Mutation";
  updateAccount?: {
    __typename?: "UpdateAccountPayload";
    account?: {
      __typename?: "Account";
      id: number;
      firstName?: string | null;
      lastName?: string | null;
      role?: SchemaTypes.Role | null;
      email: string;
      phone?: string | null;
      photo?: string | null;
      signedPhotoUrl?: string | null;
      companyMembers: {
        __typename?: "CompanyMembersConnection";
        nodes: Array<{
          __typename?: "CompanyMember";
          company?: {
            __typename?: "Company";
            id: number;
            name?: string | null;
            businessType?: SchemaTypes.BusinessType | null;
            logo?: string | null;
            aboutUs?: string | null;
            ownerFullname?: string | null;
            ownerPhone?: string | null;
            ownerEmail?: string | null;
            phone?: string | null;
            publicEmail?: string | null;
            website?: string | null;
            facebook?: string | null;
            linkedIn?: string | null;
            tradingAddress?: {
              __typename?: "Address";
              id: number;
              firstLine?: string | null;
              secondLine?: string | null;
              town?: string | null;
              region?: string | null;
              country?: string | null;
              postcode?: string | null;
              coordinates?: {
                __typename?: "Point";
                x: number;
                y: number;
              } | null;
            } | null;
          } | null;
        }>;
      };
      certificationsByDoceboUserId: {
        __typename?: "CertificationsConnection";
        nodes: Array<{
          __typename?: "Certification";
          id: number;
          technology?: string | null;
          expiryDate?: any | null;
          name?: string | null;
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
  __typename?: "Mutation";
  deleteCompanyMemberByMarketIdAndAccountIdAndCompanyId?: {
    __typename?: "DeleteCompanyMemberPayload";
    clientMutationId?: string | null;
    account?: {
      __typename?: "Account";
      id: number;
      firstName?: string | null;
      lastName?: string | null;
      role?: SchemaTypes.Role | null;
      email: string;
      phone?: string | null;
      photo?: string | null;
      signedPhotoUrl?: string | null;
      companyMembers: {
        __typename?: "CompanyMembersConnection";
        nodes: Array<{
          __typename?: "CompanyMember";
          company?: {
            __typename?: "Company";
            id: number;
            name?: string | null;
            businessType?: SchemaTypes.BusinessType | null;
            logo?: string | null;
            aboutUs?: string | null;
            ownerFullname?: string | null;
            ownerPhone?: string | null;
            ownerEmail?: string | null;
            phone?: string | null;
            publicEmail?: string | null;
            website?: string | null;
            facebook?: string | null;
            linkedIn?: string | null;
            tradingAddress?: {
              __typename?: "Address";
              id: number;
              firstLine?: string | null;
              secondLine?: string | null;
              town?: string | null;
              region?: string | null;
              country?: string | null;
              postcode?: string | null;
              coordinates?: {
                __typename?: "Point";
                x: number;
                y: number;
              } | null;
            } | null;
          } | null;
        }>;
      };
      certificationsByDoceboUserId: {
        __typename?: "CertificationsConnection";
        nodes: Array<{
          __typename?: "Certification";
          id: number;
          technology?: string | null;
          expiryDate?: any | null;
          name?: string | null;
        }>;
      };
    } | null;
  } | null;
};

export type ResetPasswordMutationVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type ResetPasswordMutation = {
  __typename?: "Mutation";
  resetPassword?: string | null;
};

export type CreateCompanyMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateCompanyInput;
}>;

export type CreateCompanyMutation = {
  __typename?: "Mutation";
  createCompany?: {
    __typename?: "CreateCompanyPayload";
    company?: { __typename?: "Company"; id: number } | null;
  } | null;
};

export type ProjectDetailsFragmentFragment = {
  __typename?: "Project";
  id: number;
  hidden?: boolean | null;
  name: string;
  technology: SchemaTypes.Technology;
  roofArea: number;
  startDate: any;
  endDate: any;
  description?: string | null;
  buildingOwnerFirstname?: string | null;
  buildingOwnerLastname?: string | null;
  buildingOwnerCompany?: string | null;
  buildingOwnerMail?: string | null;
  inspection?: boolean | null;
  inspectedAt?: any | null;
  siteAddress?: {
    __typename?: "Address";
    id: number;
    firstLine?: string | null;
    secondLine?: string | null;
    town?: string | null;
    region?: string | null;
    country?: string | null;
    postcode?: string | null;
    coordinates?: { __typename?: "Point"; x: number; y: number } | null;
  } | null;
  buildingOwnerAddress?: {
    __typename?: "Address";
    id: number;
    firstLine?: string | null;
    secondLine?: string | null;
    town?: string | null;
    region?: string | null;
    country?: string | null;
    postcode?: string | null;
    coordinates?: { __typename?: "Point"; x: number; y: number } | null;
  } | null;
  guarantees: {
    __typename?: "GuaranteesConnection";
    nodes: Array<{
      __typename?: "Guarantee";
      id: number;
      guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
      reviewerAccountId?: number | null;
      coverage?: SchemaTypes.GuaranteeCoverage | null;
      languageCode?: SchemaTypes.Language | null;
      fileStorageId?: string | null;
      signedFileStorageUrl?: string | null;
      status?: SchemaTypes.RequestStatus | null;
      guaranteeType?: {
        __typename?: "ContentfulGuaranteeType";
        name?: string | null;
        coverage?: SchemaTypes.ContentfulGuaranteeCoverageType | null;
        displayName?: string | null;
        technology?: SchemaTypes.ContentfulTechnologyType | null;
        tiersAvailable?: Array<SchemaTypes.ContentfulTiers | null> | null;
        sys: { __typename?: "ContentfulSys"; id: string };
        evidenceCategoriesCollection?: {
          __typename?: "ContentfulEvidenceCategoryCollection";
          items?: Array<{
            __typename?: "ContentfulEvidenceCategory";
            referenceCode?: string | null;
            name?: string | null;
            minimumUploads?: number | null;
            sys: { __typename?: "ContentfulSys"; id: string };
            description?: {
              __typename?: "ContentfulEvidenceCategoryDescription";
              json: any;
            } | null;
          } | null> | null;
        } | null;
      } | null;
      productByProductBmiRef?: {
        __typename?: "Product";
        id: number;
        name: string;
        brand: string;
        family: string;
        description?: string | null;
      } | null;
      systemBySystemBmiRef?: {
        __typename?: "System";
        id: number;
        name: string;
        description?: string | null;
        systemMembersBySystemBmiRef: {
          __typename?: "SystemMembersConnection";
          nodes: Array<{
            __typename?: "SystemMember";
            id: number;
            productByProductBmiRef?: {
              __typename?: "Product";
              id: number;
              name: string;
              brand: string;
              family: string;
              description?: string | null;
            } | null;
          }>;
        };
      } | null;
    }>;
  };
  evidenceItems: {
    __typename?: "EvidenceItemsConnection";
    nodes: Array<{
      __typename?: "EvidenceItem";
      id: number;
      name: string;
      signedUrl?: string | null;
      guaranteeId?: number | null;
      evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
      customEvidenceCategoryKey?: SchemaTypes.CustomEvidenceCategoryKey | null;
      customEvidenceCategory?: {
        __typename?: "ContentfulEvidenceCategory";
        name?: string | null;
        minimumUploads?: number | null;
      } | null;
    }>;
  };
  notes: {
    __typename?: "NotesConnection";
    nodes: Array<{
      __typename?: "Note";
      id: number;
      body?: string | null;
      senderName?: string | null;
      createdAt: any;
    }>;
  };
  projectMembers: {
    __typename?: "ProjectMembersConnection";
    nodes: Array<{
      __typename?: "ProjectMember";
      id: number;
      accountId?: number | null;
      isResponsibleInstaller?: boolean | null;
      account?: {
        __typename?: "Account";
        id: number;
        firstName?: string | null;
        lastName?: string | null;
        role?: SchemaTypes.Role | null;
        certificationsByDoceboUserId: {
          __typename?: "CertificationsConnection";
          nodes: Array<{
            __typename?: "Certification";
            name?: string | null;
            technology?: string | null;
          }>;
        };
      } | null;
    }>;
  };
  company?: {
    __typename?: "Company";
    id: number;
    name?: string | null;
    tier?: SchemaTypes.Tier | null;
  } | null;
};

export type GetProjectQueryVariables = SchemaTypes.Exact<{
  projectId: SchemaTypes.Scalars["Int"];
}>;

export type GetProjectQuery = {
  __typename?: "Query";
  project?: {
    __typename?: "Project";
    id: number;
    hidden?: boolean | null;
    name: string;
    technology: SchemaTypes.Technology;
    roofArea: number;
    startDate: any;
    endDate: any;
    description?: string | null;
    buildingOwnerFirstname?: string | null;
    buildingOwnerLastname?: string | null;
    buildingOwnerCompany?: string | null;
    buildingOwnerMail?: string | null;
    inspection?: boolean | null;
    inspectedAt?: any | null;
    siteAddress?: {
      __typename?: "Address";
      id: number;
      firstLine?: string | null;
      secondLine?: string | null;
      town?: string | null;
      region?: string | null;
      country?: string | null;
      postcode?: string | null;
      coordinates?: { __typename?: "Point"; x: number; y: number } | null;
    } | null;
    buildingOwnerAddress?: {
      __typename?: "Address";
      id: number;
      firstLine?: string | null;
      secondLine?: string | null;
      town?: string | null;
      region?: string | null;
      country?: string | null;
      postcode?: string | null;
      coordinates?: { __typename?: "Point"; x: number; y: number } | null;
    } | null;
    guarantees: {
      __typename?: "GuaranteesConnection";
      nodes: Array<{
        __typename?: "Guarantee";
        id: number;
        guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
        reviewerAccountId?: number | null;
        coverage?: SchemaTypes.GuaranteeCoverage | null;
        languageCode?: SchemaTypes.Language | null;
        fileStorageId?: string | null;
        signedFileStorageUrl?: string | null;
        status?: SchemaTypes.RequestStatus | null;
        guaranteeType?: {
          __typename?: "ContentfulGuaranteeType";
          name?: string | null;
          coverage?: SchemaTypes.ContentfulGuaranteeCoverageType | null;
          displayName?: string | null;
          technology?: SchemaTypes.ContentfulTechnologyType | null;
          tiersAvailable?: Array<SchemaTypes.ContentfulTiers | null> | null;
          sys: { __typename?: "ContentfulSys"; id: string };
          evidenceCategoriesCollection?: {
            __typename?: "ContentfulEvidenceCategoryCollection";
            items?: Array<{
              __typename?: "ContentfulEvidenceCategory";
              referenceCode?: string | null;
              name?: string | null;
              minimumUploads?: number | null;
              sys: { __typename?: "ContentfulSys"; id: string };
              description?: {
                __typename?: "ContentfulEvidenceCategoryDescription";
                json: any;
              } | null;
            } | null> | null;
          } | null;
        } | null;
        productByProductBmiRef?: {
          __typename?: "Product";
          id: number;
          name: string;
          brand: string;
          family: string;
          description?: string | null;
        } | null;
        systemBySystemBmiRef?: {
          __typename?: "System";
          id: number;
          name: string;
          description?: string | null;
          systemMembersBySystemBmiRef: {
            __typename?: "SystemMembersConnection";
            nodes: Array<{
              __typename?: "SystemMember";
              id: number;
              productByProductBmiRef?: {
                __typename?: "Product";
                id: number;
                name: string;
                brand: string;
                family: string;
                description?: string | null;
              } | null;
            }>;
          };
        } | null;
      }>;
    };
    evidenceItems: {
      __typename?: "EvidenceItemsConnection";
      nodes: Array<{
        __typename?: "EvidenceItem";
        id: number;
        name: string;
        signedUrl?: string | null;
        guaranteeId?: number | null;
        evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
        customEvidenceCategoryKey?: SchemaTypes.CustomEvidenceCategoryKey | null;
        customEvidenceCategory?: {
          __typename?: "ContentfulEvidenceCategory";
          name?: string | null;
          minimumUploads?: number | null;
        } | null;
      }>;
    };
    notes: {
      __typename?: "NotesConnection";
      nodes: Array<{
        __typename?: "Note";
        id: number;
        body?: string | null;
        senderName?: string | null;
        createdAt: any;
      }>;
    };
    projectMembers: {
      __typename?: "ProjectMembersConnection";
      nodes: Array<{
        __typename?: "ProjectMember";
        id: number;
        accountId?: number | null;
        isResponsibleInstaller?: boolean | null;
        account?: {
          __typename?: "Account";
          id: number;
          firstName?: string | null;
          lastName?: string | null;
          role?: SchemaTypes.Role | null;
          certificationsByDoceboUserId: {
            __typename?: "CertificationsConnection";
            nodes: Array<{
              __typename?: "Certification";
              name?: string | null;
              technology?: string | null;
            }>;
          };
        } | null;
      }>;
    };
    company?: {
      __typename?: "Company";
      id: number;
      name?: string | null;
      tier?: SchemaTypes.Tier | null;
    } | null;
  } | null;
};

export type ProjectDetailsProductFragmentFragment = {
  __typename?: "Product";
  id: number;
  name: string;
  brand: string;
  family: string;
  description?: string | null;
};

export type GetCompaniesReportQueryVariables = SchemaTypes.Exact<{
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompaniesReportQuery = {
  __typename?: "Query";
  companies?: {
    __typename?: "CompaniesConnection";
    nodes: Array<{
      __typename?: "Company";
      referenceNumber: number;
      name?: string | null;
      tier?: SchemaTypes.Tier | null;
      logo?: string | null;
      aboutUs?: string | null;
      businessType?: SchemaTypes.BusinessType | null;
      isProfileComplete: boolean;
      phone?: string | null;
      publicEmail?: string | null;
      website?: string | null;
      facebook?: string | null;
      linkedIn?: string | null;
      ownerFullname?: string | null;
      ownerEmail?: string | null;
      status?: SchemaTypes.CompanyStatus | null;
      taxNumber?: string | null;
      updatedAt: any;
      registeredAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      tradingAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      companyOperationsByCompany: {
        __typename?: "CompanyOperationsConnection";
        nodes: Array<{
          __typename?: "CompanyOperation";
          id: number;
          operation: SchemaTypes.Operation;
        }>;
      };
    }>;
  } | null;
};

export type GetGuaranteesReportQueryVariables = SchemaTypes.Exact<{
  market: SchemaTypes.Scalars["Int"];
}>;

export type GetGuaranteesReportQuery = {
  __typename?: "Query";
  guaranteesByMarket?: {
    __typename?: "GuaranteesConnection";
    nodes: Array<{
      __typename?: "Guarantee";
      id: number;
      bmiReferenceId?: string | null;
      requestorAccountId?: number | null;
      coverage?: SchemaTypes.GuaranteeCoverage | null;
      status?: SchemaTypes.RequestStatus | null;
      languageCode?: SchemaTypes.Language | null;
      guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
      startDate?: any | null;
      expiryDate?: any | null;
      signedFileStorageUrl?: string | null;
      fileStorageId?: string | null;
      project?: {
        __typename?: "Project";
        name: string;
        technology: SchemaTypes.Technology;
        roofArea: number;
        hidden?: boolean | null;
        inspection?: boolean | null;
        company?: { __typename?: "Company"; name?: string | null } | null;
      } | null;
      requestorAccount?: {
        __typename?: "Account";
        firstName?: string | null;
        lastName?: string | null;
      } | null;
      guaranteeType?: {
        __typename?: "ContentfulGuaranteeType";
        name?: string | null;
        maximumValidityYears?: number | null;
      } | null;
      systemBySystemBmiRef?: { __typename?: "System"; name: string } | null;
      productByProductBmiRef?: { __typename?: "Product"; name: string } | null;
    }>;
  } | null;
};

export type GetProductsReportQueryVariables = SchemaTypes.Exact<{
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type GetProductsReportQuery = {
  __typename?: "Query";
  products?: {
    __typename?: "ProductsConnection";
    nodes: Array<{
      __typename?: "Product";
      id: number;
      bmiRef: string;
      name: string;
      description?: string | null;
      technology: SchemaTypes.Technology;
      family: string;
      brand: string;
      maximumValidityYears: number;
      published: boolean;
      updatedAt: any;
    }>;
  } | null;
};

export type GetProjectsReportQueryVariables = SchemaTypes.Exact<{
  market: SchemaTypes.Scalars["Int"];
}>;

export type GetProjectsReportQuery = {
  __typename?: "Query";
  projectsByMarket?: {
    __typename?: "ProjectsConnection";
    nodes: Array<{
      __typename?: "Project";
      id: number;
      name: string;
      technology: SchemaTypes.Technology;
      roofArea: number;
      buildingOwnerFirstname?: string | null;
      buildingOwnerLastname?: string | null;
      buildingOwnerCompany?: string | null;
      startDate: any;
      endDate: any;
      hidden?: boolean | null;
      createdAt: any;
      updatedAt: any;
      siteAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      company?: {
        __typename?: "Company";
        name?: string | null;
        status?: SchemaTypes.CompanyStatus | null;
      } | null;
      guarantees: {
        __typename?: "GuaranteesConnection";
        nodes: Array<{
          __typename?: "Guarantee";
          id: number;
          coverage?: SchemaTypes.GuaranteeCoverage | null;
          languageCode?: SchemaTypes.Language | null;
          guaranteeReferenceCode: SchemaTypes.GuaranteeReferenceCode;
          guaranteeType?: {
            __typename?: "ContentfulGuaranteeType";
            name?: string | null;
          } | null;
          guaranteeTypes?: {
            __typename?: "ContentfulGuaranteeTypeCollection";
            items?: Array<{
              __typename?: "ContentfulGuaranteeType";
              name?: string | null;
            } | null> | null;
          } | null;
        }>;
      };
      projectMembers: {
        __typename?: "ProjectMembersConnection";
        nodes: Array<{
          __typename?: "ProjectMember";
          id: number;
          account?: { __typename?: "Account"; email: string } | null;
        }>;
      };
    }>;
  } | null;
};

export type GetSystemsReportQueryVariables = SchemaTypes.Exact<{
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type GetSystemsReportQuery = {
  __typename?: "Query";
  systems?: {
    __typename?: "SystemsConnection";
    nodes: Array<{
      __typename?: "System";
      id: number;
      bmiRef: string;
      name: string;
      description?: string | null;
      technology: SchemaTypes.Technology;
      maximumValidityYears: number;
      published: boolean;
      updatedAt: any;
      systemMembersBySystemBmiRef: {
        __typename?: "SystemMembersConnection";
        nodes: Array<{ __typename?: "SystemMember"; productBmiRef: string }>;
      };
    }>;
  } | null;
};

export type GetTeamsReportQueryVariables = SchemaTypes.Exact<{
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type GetTeamsReportQuery = {
  __typename?: "Query";
  accounts?: {
    __typename?: "AccountsConnection";
    nodes: Array<{
      __typename?: "Account";
      id: number;
      email: string;
      phone?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      role?: SchemaTypes.Role | null;
      status?: SchemaTypes.AccountStatus | null;
      doceboUserId?: number | null;
      doceboUsername?: string | null;
      photo?: string | null;
      signedPhotoUrl?: string | null;
      migrationId?: string | null;
      migratedToAuth0?: boolean | null;
      createdAt: any;
      updatedAt: any;
      companyMembers: {
        __typename?: "CompanyMembersConnection";
        nodes: Array<{
          __typename?: "CompanyMember";
          company?: {
            __typename?: "Company";
            name?: string | null;
            tier?: SchemaTypes.Tier | null;
          } | null;
        }>;
      };
    }>;
  } | null;
};

export type GetEvidenceItemsReportQueryVariables = SchemaTypes.Exact<{
  market: SchemaTypes.Scalars["Int"];
}>;

export type GetEvidenceItemsReportQuery = {
  __typename?: "Query";
  evidenceItemsByMarket?: {
    __typename?: "EvidenceItemsConnection";
    nodes: Array<{
      __typename?: "EvidenceItem";
      evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
      name: string;
      uploaderAccountId?: number | null;
      createdAt: any;
      project?: {
        __typename?: "Project";
        name: string;
        roofArea: number;
        company?: {
          __typename?: "Company";
          name?: string | null;
          tier?: SchemaTypes.Tier | null;
        } | null;
      } | null;
      guarantee?: {
        __typename?: "Guarantee";
        coverage?: SchemaTypes.GuaranteeCoverage | null;
      } | null;
      uploaderAccount?: {
        __typename?: "Account";
        lastName?: string | null;
        firstName?: string | null;
        email: string;
      } | null;
    }>;
  } | null;
};

export type GetTierBenefitQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetTierBenefitQuery = {
  __typename?: "Query";
  tierBenefitCollection?: {
    __typename?: "TierBenefitCollection";
    items: Array<{
      __typename?: "TierBenefit";
      tier?: string | null;
      name?: string | null;
    } | null>;
  } | null;
};

export type CreateGuaranteeMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateGuaranteeInput;
}>;

export type CreateGuaranteeMutation = {
  __typename?: "Mutation";
  createGuarantee?: {
    __typename?: "CreateGuaranteePayload";
    guarantee?: {
      __typename?: "Guarantee";
      id: number;
      coverage?: SchemaTypes.GuaranteeCoverage | null;
      status?: SchemaTypes.RequestStatus | null;
    } | null;
  } | null;
};

export type CreateGuaranteePdfMutationVariables = SchemaTypes.Exact<{
  id: SchemaTypes.Scalars["Int"];
}>;

export type CreateGuaranteePdfMutation = {
  __typename?: "Mutation";
  createGuaranteePdf?: {
    __typename?: "PublishOutput";
    messageId?: string | null;
  } | null;
};

export type UpdateGuaranteeMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateGuaranteeInput;
}>;

export type UpdateGuaranteeMutation = {
  __typename?: "Mutation";
  updateGuarantee?: {
    __typename?: "UpdateGuaranteePayload";
    guarantee?: {
      __typename?: "Guarantee";
      id: number;
      coverage?: SchemaTypes.GuaranteeCoverage | null;
      status?: SchemaTypes.RequestStatus | null;
    } | null;
  } | null;
};

export type AddProjectNoteMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateNoteInput;
}>;

export type AddProjectNoteMutation = {
  __typename?: "Mutation";
  createNote?: {
    __typename?: "CreateNotePayload";
    note?: { __typename?: "Note"; id: number } | null;
  } | null;
};

export type DeleteProjectMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.DeleteProjectMemberInput;
}>;

export type DeleteProjectMemberMutation = {
  __typename?: "Mutation";
  deleteProjectMember?: {
    __typename?: "DeleteProjectMemberPayload";
    projectMember?: {
      __typename?: "ProjectMember";
      id: number;
      accountId?: number | null;
      isResponsibleInstaller?: boolean | null;
      account?: {
        __typename?: "Account";
        id: number;
        firstName?: string | null;
        lastName?: string | null;
        role?: SchemaTypes.Role | null;
        certificationsByDoceboUserId: {
          __typename?: "CertificationsConnection";
          nodes: Array<{
            __typename?: "Certification";
            name?: string | null;
            technology?: string | null;
          }>;
        };
      } | null;
    } | null;
  } | null;
};

export type GetProjectCompanyMembersQueryVariables = SchemaTypes.Exact<{
  existAccounts?: SchemaTypes.InputMaybe<
    Array<SchemaTypes.Scalars["Int"]> | SchemaTypes.Scalars["Int"]
  >;
  companyId: SchemaTypes.Scalars["Int"];
}>;

export type GetProjectCompanyMembersQuery = {
  __typename?: "Query";
  companyMembers?: {
    __typename?: "CompanyMembersConnection";
    nodes: Array<{
      __typename?: "CompanyMember";
      id: number;
      accountId: number;
      account?: {
        __typename?: "Account";
        id: number;
        firstName?: string | null;
        lastName?: string | null;
        email: string;
        certificationsByDoceboUserId: {
          __typename?: "CertificationsConnection";
          nodes: Array<{
            __typename?: "Certification";
            technology?: string | null;
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
  __typename?: "Mutation";
  createProjectMember?: {
    __typename?: "CreateProjectMemberPayload";
    projectMember?: {
      __typename?: "ProjectMember";
      id: number;
      accountId?: number | null;
      isResponsibleInstaller?: boolean | null;
      account?: {
        __typename?: "Account";
        id: number;
        firstName?: string | null;
        lastName?: string | null;
        role?: SchemaTypes.Role | null;
        certificationsByDoceboUserId: {
          __typename?: "CertificationsConnection";
          nodes: Array<{
            __typename?: "Certification";
            name?: string | null;
            technology?: string | null;
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
  __typename?: "Mutation";
  projectMembersAdd?: {
    __typename?: "ProjectMembersAddPayload";
    projectMembers?: Array<{
      __typename?: "ProjectMember";
      projectId: number;
      accountId?: number | null;
    }> | null;
  } | null;
};

export type UpdateProjectMemberMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateProjectMemberInput;
  projectId: SchemaTypes.Scalars["Int"];
}>;

export type UpdateProjectMemberMutation = {
  __typename?: "Mutation";
  updateProjectMember?: {
    __typename?: "UpdateProjectMemberPayload";
    projectMember?: {
      __typename?: "ProjectMember";
      id: number;
      projectId: number;
      isResponsibleInstaller?: boolean | null;
    } | null;
    query?: {
      __typename?: "Query";
      projectMembers?: {
        __typename?: "ProjectMembersConnection";
        nodes: Array<{
          __typename?: "ProjectMember";
          id: number;
          accountId?: number | null;
          isResponsibleInstaller?: boolean | null;
          account?: {
            __typename?: "Account";
            id: number;
            firstName?: string | null;
            lastName?: string | null;
            role?: SchemaTypes.Role | null;
            certificationsByDoceboUserId: {
              __typename?: "CertificationsConnection";
              nodes: Array<{
                __typename?: "Certification";
                name?: string | null;
                technology?: string | null;
              }>;
            };
          } | null;
        }>;
      } | null;
    } | null;
  } | null;
};

export type ProjectMemberDetailsFragmentFragment = {
  __typename?: "ProjectMember";
  id: number;
  accountId?: number | null;
  isResponsibleInstaller?: boolean | null;
  account?: {
    __typename?: "Account";
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    role?: SchemaTypes.Role | null;
    certificationsByDoceboUserId: {
      __typename?: "CertificationsConnection";
      nodes: Array<{
        __typename?: "Certification";
        name?: string | null;
        technology?: string | null;
      }>;
    };
  } | null;
};

export type AddEvidencesMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.EvidenceItemsAddInput;
}>;

export type AddEvidencesMutation = {
  __typename?: "Mutation";
  evidenceItemsAdd?: {
    __typename?: "EvidenceItemsAddPayload";
    evidenceItems?: Array<{
      __typename?: "EvidenceItem";
      id: number;
      name: string;
    }> | null;
  } | null;
};

export type ContentfulEvidenceCategoriesQueryVariables = SchemaTypes.Exact<{
  tag: SchemaTypes.Scalars["String"];
}>;

export type ContentfulEvidenceCategoriesQuery = {
  __typename?: "Query";
  evidenceCategoryCollection?: {
    __typename?: "EvidenceCategoryCollection";
    items: Array<{
      __typename?: "EvidenceCategory";
      name?: string | null;
      referenceCode?: string | null;
      minimumUploads?: number | null;
      sys: { __typename?: "Sys"; id: string };
    } | null>;
  } | null;
};

export type DeleteEvidenceItemMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.DeleteEvidenceItemInput;
}>;

export type DeleteEvidenceItemMutation = {
  __typename?: "Mutation";
  deleteEvidenceItem?: {
    __typename?: "DeleteEvidenceItemPayload";
    evidenceItem?: {
      __typename?: "EvidenceItem";
      id: number;
      name: string;
      attachment: string;
      guaranteeId?: number | null;
      evidenceCategoryType?: SchemaTypes.EvidenceCategoryType | null;
    } | null;
  } | null;
};

export type GetGuaranteeTemplatesQueryVariables = SchemaTypes.Exact<{
  technology: SchemaTypes.Scalars["String"];
  coverage: SchemaTypes.Scalars["String"];
  language?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["String"]>;
}>;

export type GetGuaranteeTemplatesQuery = {
  __typename?: "Query";
  guaranteeTemplateCollection?: {
    __typename?: "GuaranteeTemplateCollection";
    items: Array<{
      __typename?: "GuaranteeTemplate";
      displayName?: string | null;
      languageCode?: string | null;
      languageDescriptor?: string | null;
      coverage?: string | null;
      sys: { __typename?: "Sys"; id: string };
    } | null>;
  } | null;
};

export type SearchProductsQueryVariables = SchemaTypes.Exact<{
  query: SchemaTypes.Scalars["String"];
  technology: SchemaTypes.Technology;
}>;

export type SearchProductsQuery = {
  __typename?: "Query";
  searchProducts?: {
    __typename?: "ProductsConnection";
    totalCount: number;
    nodes: Array<{
      __typename?: "Product";
      id: number;
      technology: SchemaTypes.Technology;
      name: string;
      description?: string | null;
      published: boolean;
      brand: string;
      family: string;
      bmiRef: string;
    }>;
  } | null;
};

export type SearchSystemsQueryVariables = SchemaTypes.Exact<{
  query: SchemaTypes.Scalars["String"];
  technology: SchemaTypes.Technology;
}>;

export type SearchSystemsQuery = {
  __typename?: "Query";
  searchSystems?: {
    __typename?: "SystemsConnection";
    totalCount: number;
    nodes: Array<{
      __typename?: "System";
      id: number;
      technology: SchemaTypes.Technology;
      name: string;
      description?: string | null;
      bmiRef: string;
      systemMembersBySystemBmiRef: {
        __typename?: "SystemMembersConnection";
        nodes: Array<{
          __typename?: "SystemMember";
          id: number;
          productByProductBmiRef?: {
            __typename?: "Product";
            id: number;
            name: string;
            family: string;
            brand: string;
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
  __typename?: "Query";
  guaranteeTypeCollection?: {
    __typename?: "GuaranteeTypeCollection";
    items: Array<{
      __typename?: "GuaranteeType";
      guaranteeReferenceCode?: string | null;
      name?: string | null;
      displayName?: string | null;
      technology?: string | null;
      coverage?: string | null;
      ranking?: number | null;
      tiersAvailable?: Array<string | null> | null;
      sys: { __typename?: "Sys"; id: string };
      evidenceCategoriesCollection?: {
        __typename?: "GuaranteeTypeEvidenceCategoriesCollection";
        items: Array<{
          __typename?: "EvidenceCategory";
          name?: string | null;
          referenceCode?: string | null;
          minimumUploads?: number | null;
        } | null>;
      } | null;
    } | null>;
  } | null;
};

export type AccountByEmailQueryVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type AccountByEmailQuery = {
  __typename?: "Query";
  accountByEmail?: {
    __typename?: "Account";
    id: number;
    role?: SchemaTypes.Role | null;
    marketId?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    doceboUserId?: number | null;
    market?: {
      __typename?: "Market";
      id: number;
      domain: string;
      language: SchemaTypes.Language;
      projectsEnabled?: boolean | null;
      doceboCompanyAdminBranchId?: string | null;
      doceboInstallersBranchId?: string | null;
    } | null;
    companyMembers: {
      __typename?: "CompanyMembersConnection";
      nodes: Array<{
        __typename?: "CompanyMember";
        company?: {
          __typename?: "Company";
          id: number;
          status?: SchemaTypes.CompanyStatus | null;
          name?: string | null;
          tier?: SchemaTypes.Tier | null;
        } | null;
      }>;
    };
    projectMembers: {
      __typename?: "ProjectMembersConnection";
      totalCount: number;
    };
  } | null;
};

export type CreateAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.CreateAccountInput;
}>;

export type CreateAccountMutation = {
  __typename?: "Mutation";
  createAccount?: {
    __typename?: "CreateAccountPayload";
    account?: {
      __typename?: "Account";
      id: number;
      role?: SchemaTypes.Role | null;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      marketId?: number | null;
      market?: {
        __typename?: "Market";
        language: SchemaTypes.Language;
        doceboCompanyAdminBranchId?: string | null;
        doceboInstallersBranchId?: string | null;
      } | null;
      companyMembers: {
        __typename?: "CompanyMembersConnection";
        nodes: Array<{
          __typename?: "CompanyMember";
          company?: {
            __typename?: "Company";
            id: number;
            status?: SchemaTypes.CompanyStatus | null;
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
  __typename?: "Mutation";
  createDoceboUser?: {
    __typename?: "UserCreateResponse";
    success?: boolean | null;
    user_id?: number | null;
  } | null;
};

export type UpdateAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateAccountMutation = {
  __typename?: "Mutation";
  updateAccount?: {
    __typename?: "UpdateAccountPayload";
    account?: {
      __typename?: "Account";
      id: number;
      doceboUserId?: number | null;
    } | null;
  } | null;
};

export type UserByEmailQueryVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type UserByEmailQuery = {
  __typename?: "Query";
  userByEmail?: { __typename?: "UserData"; user_id?: string | null } | null;
};

export type InvitationsQueryVariables = SchemaTypes.Exact<{
  invitee: SchemaTypes.Scalars["String"];
}>;

export type InvitationsQuery = {
  __typename?: "Query";
  invitations?: {
    __typename?: "InvitationsConnection";
    nodes: Array<{
      __typename?: "Invitation";
      id: number;
      status: SchemaTypes.InvitationStatus;
      invitee: string;
      senderAccountId?: number | null;
    }>;
  } | null;
};

export type CompleteInvitationMutationVariables = SchemaTypes.Exact<{
  companyId: SchemaTypes.Scalars["Int"];
}>;

export type CompleteInvitationMutation = {
  __typename?: "Mutation";
  completeInvitation?: {
    __typename?: "Account";
    id: number;
    role?: SchemaTypes.Role | null;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    marketId?: number | null;
    market?: {
      __typename?: "Market";
      language: SchemaTypes.Language;
      domain: string;
      doceboCompanyAdminBranchId?: string | null;
      doceboInstallersBranchId?: string | null;
    } | null;
  } | null;
};

export type CreateSsoUrlMutationVariables = SchemaTypes.Exact<{
  username: SchemaTypes.Scalars["String"];
  path?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["String"]>;
}>;

export type CreateSsoUrlMutation = {
  __typename?: "Mutation";
  createSSOUrl?: { __typename?: "SSOUrlOutput"; url?: string | null } | null;
};

export type GetMarketsByDomainQueryVariables = SchemaTypes.Exact<{
  domain: SchemaTypes.Scalars["String"];
}>;

export type GetMarketsByDomainQuery = {
  __typename?: "Query";
  markets?: {
    __typename?: "MarketsConnection";
    nodes: Array<{
      __typename?: "Market";
      id: number;
      name?: string | null;
      cmsSpaceId?: string | null;
      language: SchemaTypes.Language;
      domain: string;
      doceboCatalogueId?: number | null;
      doceboCatalogueIdT2?: number | null;
      doceboCatalogueIdT3?: number | null;
      doceboCatalogueIdT4?: number | null;
      doceboInstallersBranchId?: string | null;
      doceboCompanyAdminBranchId?: string | null;
      merchandisingUrl?: string | null;
      projectsEnabled?: boolean | null;
      gtag?: string | null;
      gtagMarketMedia?: string | null;
      sendName?: string | null;
      sendMailbox?: string | null;
      locationBiasRadiusKm?: number | null;
      geoMiddle?: { __typename?: "Point"; x: number; y: number } | null;
    }>;
  } | null;
};

export type ImageFragmentFragment = {
  __typename?: "Asset";
  title?: string | null;
  description?: string | null;
  contentType?: string | null;
  fileName?: string | null;
  size?: number | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  sys: { __typename?: "Sys"; id: string };
};

export type GetMediaFoldersQueryVariables = SchemaTypes.Exact<{
  tag: SchemaTypes.Scalars["String"];
}>;

export type GetMediaFoldersQuery = {
  __typename?: "Query";
  marketContentCollection?: {
    __typename?: "MarketContentCollection";
    items: Array<{
      __typename?: "MarketContent";
      mediaLibraryRootCollection?: {
        __typename?: "MarketContentMediaLibraryRootCollection";
        items: Array<{
          __typename: "MediaFolder";
          name?: string | null;
          sys: { __typename?: "Sys"; id: string };
        } | null>;
      } | null;
    } | null>;
  } | null;
  mediaFolderCollection?: {
    __typename?: "MediaFolderCollection";
    total: number;
    items: Array<{
      __typename: "MediaFolder";
      name?: string | null;
      sys: { __typename?: "Sys"; id: string };
      childrenCollection?: {
        __typename?: "MediaFolderChildrenCollection";
        total: number;
        items: Array<
          | {
              __typename: "MediaFolder";
              name?: string | null;
              sys: { __typename?: "Sys"; id: string };
            }
          | {
              __typename: "MediaTool";
              name?: string | null;
              sys: { __typename?: "Sys"; id: string };
            }
          | null
        >;
      } | null;
    } | null>;
  } | null;
};

export type MediaToolDetailsFragment = {
  __typename: "MediaTool";
  name?: string | null;
  url?: string | null;
  sys: { __typename?: "Sys"; id: string };
  media?: {
    __typename?: "Asset";
    title?: string | null;
    description?: string | null;
    contentType?: string | null;
    fileName?: string | null;
    size?: number | null;
    url?: string | null;
    width?: number | null;
    height?: number | null;
    sys: { __typename?: "Sys"; id: string };
  } | null;
  thumbnail?: {
    __typename?: "Asset";
    title?: string | null;
    description?: string | null;
    contentType?: string | null;
    fileName?: string | null;
    size?: number | null;
    url?: string | null;
    width?: number | null;
    height?: number | null;
    sys: { __typename?: "Sys"; id: string };
  } | null;
};

export type GetMediaFolderContentsQueryVariables = SchemaTypes.Exact<{
  mediaFolderId: SchemaTypes.Scalars["String"];
  tag: SchemaTypes.Scalars["String"];
}>;

export type GetMediaFolderContentsQuery = {
  __typename?: "Query";
  mediaFolderCollection?: {
    __typename?: "MediaFolderCollection";
    items: Array<{
      __typename: "MediaFolder";
      name?: string | null;
      sys: { __typename?: "Sys"; id: string };
      childrenCollection?: {
        __typename?: "MediaFolderChildrenCollection";
        total: number;
        items: Array<
          | {
              __typename: "MediaFolder";
              name?: string | null;
              sys: { __typename?: "Sys"; id: string };
            }
          | {
              __typename: "MediaTool";
              name?: string | null;
              url?: string | null;
              sys: { __typename?: "Sys"; id: string };
              media?: {
                __typename?: "Asset";
                title?: string | null;
                description?: string | null;
                contentType?: string | null;
                fileName?: string | null;
                size?: number | null;
                url?: string | null;
                width?: number | null;
                height?: number | null;
                sys: { __typename?: "Sys"; id: string };
              } | null;
              thumbnail?: {
                __typename?: "Asset";
                title?: string | null;
                description?: string | null;
                contentType?: string | null;
                fileName?: string | null;
                size?: number | null;
                url?: string | null;
                width?: number | null;
                height?: number | null;
                sys: { __typename?: "Sys"; id: string };
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
  __typename?: "Query";
  accountByEmail?: {
    __typename?: "Account";
    id: number;
    role?: SchemaTypes.Role | null;
    marketId?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    doceboUserId?: number | null;
    market?: {
      __typename?: "Market";
      id: number;
      domain: string;
      projectsEnabled?: boolean | null;
    } | null;
    companyMembers: {
      __typename?: "CompanyMembersConnection";
      nodes: Array<{
        __typename?: "CompanyMember";
        company?: {
          __typename?: "Company";
          id: number;
          status?: SchemaTypes.CompanyStatus | null;
          name?: string | null;
          tier?: SchemaTypes.Tier | null;
        } | null;
      }>;
    };
    projectMembers: {
      __typename?: "ProjectMembersConnection";
      totalCount: number;
    };
  } | null;
};

export type GetGlobalDataPublicQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type GetGlobalDataPublicQuery = {
  __typename?: "Query";
  marketContentCollection?: {
    __typename?: "MarketContentCollection";
    items: Array<{
      __typename?: "MarketContent";
      externalLinkUrl?: string | null;
      externalLinkLabel?: string | null;
      footerLinksCollection?: {
        __typename?: "MarketContentFooterLinksCollection";
        items: Array<{
          __typename?: "ContentArticle";
          title?: string | null;
          relativePath?: string | null;
        } | null>;
      } | null;
      contactUsPage?: {
        __typename?: "ContentArticle";
        title?: string | null;
        relativePath?: string | null;
      } | null;
    } | null>;
  } | null;
};

export type GetContentArticleContentQueryVariables = SchemaTypes.Exact<{
  relativePath: SchemaTypes.Scalars["String"];
  tag: SchemaTypes.Scalars["String"];
}>;

export type GetContentArticleContentQuery = {
  __typename?: "Query";
  contentArticleCollection?: {
    __typename?: "ContentArticleCollection";
    items: Array<{
      __typename?: "ContentArticle";
      title?: string | null;
      body?: {
        __typename?: "ContentArticleBody";
        json: any;
        links: {
          __typename?: "ContentArticleBodyLinks";
          assets: {
            __typename?: "ContentArticleBodyAssets";
            block: Array<{
              __typename?: "Asset";
              url?: string | null;
              title?: string | null;
              width?: number | null;
              height?: number | null;
              description?: string | null;
              sys: { __typename?: "Sys"; id: string };
            } | null>;
          };
        };
      } | null;
    } | null>;
  } | null;
};

export type ArticleContentLinksFragmentFragment = {
  __typename?: "ContentArticleBodyLinks";
  assets: {
    __typename?: "ContentArticleBodyAssets";
    block: Array<{
      __typename?: "Asset";
      url?: string | null;
      title?: string | null;
      width?: number | null;
      height?: number | null;
      description?: string | null;
      sys: { __typename?: "Sys"; id: string };
    } | null>;
  };
};

export type MarketsQueryVariables = SchemaTypes.Exact<{ [key: string]: never }>;

export type MarketsQuery = {
  __typename?: "Query";
  markets?: {
    __typename?: "MarketsConnection";
    nodes: Array<{
      __typename?: "Market";
      id: number;
      language: SchemaTypes.Language;
      domain: string;
      cmsSpaceId?: string | null;
      name?: string | null;
      sendName?: string | null;
      sendMailbox?: string | null;
      doceboInstallersBranchId?: string | null;
      doceboCompanyAdminBranchId?: string | null;
      merchandisingUrl?: string | null;
      projectsEnabled?: boolean | null;
      gtag?: string | null;
      gtagMarketMedia?: string | null;
      locationBiasRadiusKm?: number | null;
    }>;
  } | null;
  doceboTiers?: {
    __typename?: "DoceboTiersConnection";
    nodes: Array<{
      __typename?: "DoceboTier";
      id: number;
      marketId: number;
      tierCode: SchemaTypes.Tier;
      doceboCatalogueId?: number | null;
    }>;
  } | null;
};

export type ProductsAndSystemsQueryVariables = SchemaTypes.Exact<{
  marketId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type ProductsAndSystemsQuery = {
  __typename?: "Query";
  products?: {
    __typename?: "ProductsConnection";
    nodes: Array<{
      __typename?: "Product";
      id: number;
      name: string;
      brand: string;
      family: string;
      bmiRef: string;
      updatedAt: any;
      published: boolean;
      technology: SchemaTypes.Technology;
      description?: string | null;
      maximumValidityYears: number;
    }>;
  } | null;
  systems?: {
    __typename?: "SystemsConnection";
    nodes: Array<{
      __typename?: "System";
      id: number;
      name: string;
      bmiRef: string;
      published: boolean;
      updatedAt: any;
      technology: SchemaTypes.Technology;
      description?: string | null;
      maximumValidityYears: number;
    }>;
  } | null;
  systemMembers?: {
    __typename?: "SystemMembersConnection";
    nodes: Array<{
      __typename?: "SystemMember";
      systemBmiRef: string;
      productByProductBmiRef?: {
        __typename?: "Product";
        id: number;
        name: string;
      } | null;
    }>;
  } | null;
};

export type DeleteInvitedUserMutationVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type DeleteInvitedUserMutation = {
  __typename?: "Mutation";
  deleteInvitedUser?: string | null;
};

export type ValidateSignupUserMutationVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars["String"];
}>;

export type ValidateSignupUserMutation = {
  __typename?: "Mutation";
  validateSignupUser?: boolean | null;
};

export type CompanyPageDetailsFragmentFragment = {
  __typename?: "Company";
  id: number;
  status?: SchemaTypes.CompanyStatus | null;
  isProfileComplete: boolean;
  name?: string | null;
  businessType?: SchemaTypes.BusinessType | null;
  logo?: string | null;
  aboutUs?: string | null;
  ownerFullname?: string | null;
  ownerPhone?: string | null;
  ownerEmail?: string | null;
  phone?: string | null;
  publicEmail?: string | null;
  website?: string | null;
  facebook?: string | null;
  linkedIn?: string | null;
  referenceNumber: number;
  taxNumber?: string | null;
  tier?: SchemaTypes.Tier | null;
  certifications: Array<SchemaTypes.Technology | null>;
  tradingAddress?: {
    __typename?: "Address";
    id: number;
    firstLine?: string | null;
    secondLine?: string | null;
    town?: string | null;
    region?: string | null;
    country?: string | null;
    postcode?: string | null;
    coordinates?: { __typename?: "Point"; x: number; y: number } | null;
  } | null;
  registeredAddress?: {
    __typename?: "Address";
    id: number;
    firstLine?: string | null;
    secondLine?: string | null;
    town?: string | null;
    region?: string | null;
    country?: string | null;
    postcode?: string | null;
    coordinates?: { __typename?: "Point"; x: number; y: number } | null;
  } | null;
  companyOperationsByCompany: {
    __typename?: "CompanyOperationsConnection";
    nodes: Array<{
      __typename?: "CompanyOperation";
      id: number;
      operation: SchemaTypes.Operation;
    }>;
  };
  companyMembers: {
    __typename?: "CompanyMembersConnection";
    nodes: Array<{
      __typename?: "CompanyMember";
      account?: {
        __typename?: "Account";
        role?: SchemaTypes.Role | null;
        id: number;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        email: string;
        photo?: string | null;
        signedPhotoUrl?: string | null;
      } | null;
    }>;
  };
  companyDocuments: {
    __typename?: "CompanyDocumentsConnection";
    nodes: Array<{
      __typename?: "CompanyDocument";
      id: number;
      document?: string | null;
      name?: string | null;
      documentType?: SchemaTypes.CompanyDocumentType | null;
      size?: number | null;
      signedDocumentUrl?: string | null;
      createdAt: any;
      updatedAt: any;
    }>;
  };
};

export type GetCompaniesByMarketQueryVariables = SchemaTypes.Exact<{
  marketId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompaniesByMarketQuery = {
  __typename?: "Query";
  companies?: {
    __typename?: "CompaniesConnection";
    nodes: Array<{
      __typename?: "Company";
      updatedAt: any;
      id: number;
      status?: SchemaTypes.CompanyStatus | null;
      isProfileComplete: boolean;
      name?: string | null;
      businessType?: SchemaTypes.BusinessType | null;
      logo?: string | null;
      aboutUs?: string | null;
      ownerFullname?: string | null;
      ownerPhone?: string | null;
      ownerEmail?: string | null;
      phone?: string | null;
      publicEmail?: string | null;
      website?: string | null;
      facebook?: string | null;
      linkedIn?: string | null;
      referenceNumber: number;
      taxNumber?: string | null;
      tier?: SchemaTypes.Tier | null;
      certifications: Array<SchemaTypes.Technology | null>;
      tradingAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      registeredAddress?: {
        __typename?: "Address";
        id: number;
        firstLine?: string | null;
        secondLine?: string | null;
        town?: string | null;
        region?: string | null;
        country?: string | null;
        postcode?: string | null;
        coordinates?: { __typename?: "Point"; x: number; y: number } | null;
      } | null;
      companyOperationsByCompany: {
        __typename?: "CompanyOperationsConnection";
        nodes: Array<{
          __typename?: "CompanyOperation";
          id: number;
          operation: SchemaTypes.Operation;
        }>;
      };
      companyMembers: {
        __typename?: "CompanyMembersConnection";
        nodes: Array<{
          __typename?: "CompanyMember";
          account?: {
            __typename?: "Account";
            role?: SchemaTypes.Role | null;
            id: number;
            firstName?: string | null;
            lastName?: string | null;
            phone?: string | null;
            email: string;
            photo?: string | null;
            signedPhotoUrl?: string | null;
          } | null;
        }>;
      };
      companyDocuments: {
        __typename?: "CompanyDocumentsConnection";
        nodes: Array<{
          __typename?: "CompanyDocument";
          id: number;
          document?: string | null;
          name?: string | null;
          documentType?: SchemaTypes.CompanyDocumentType | null;
          size?: number | null;
          signedDocumentUrl?: string | null;
          createdAt: any;
          updatedAt: any;
        }>;
      };
    }>;
  } | null;
  contactDetailsCollection?: {
    __typename?: "ContactDetailsCollection";
    items: Array<{
      __typename?: "ContactDetails";
      fullName?: string | null;
      subHeading?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
    } | null>;
  } | null;
};

export type GetCompanyQueryVariables = SchemaTypes.Exact<{
  companyId: SchemaTypes.Scalars["Int"];
}>;

export type GetCompanyQuery = {
  __typename?: "Query";
  company?: {
    __typename?: "Company";
    id: number;
    status?: SchemaTypes.CompanyStatus | null;
    isProfileComplete: boolean;
    name?: string | null;
    businessType?: SchemaTypes.BusinessType | null;
    logo?: string | null;
    aboutUs?: string | null;
    ownerFullname?: string | null;
    ownerPhone?: string | null;
    ownerEmail?: string | null;
    phone?: string | null;
    publicEmail?: string | null;
    website?: string | null;
    facebook?: string | null;
    linkedIn?: string | null;
    referenceNumber: number;
    taxNumber?: string | null;
    tier?: SchemaTypes.Tier | null;
    certifications: Array<SchemaTypes.Technology | null>;
    tradingAddress?: {
      __typename?: "Address";
      id: number;
      firstLine?: string | null;
      secondLine?: string | null;
      town?: string | null;
      region?: string | null;
      country?: string | null;
      postcode?: string | null;
      coordinates?: { __typename?: "Point"; x: number; y: number } | null;
    } | null;
    registeredAddress?: {
      __typename?: "Address";
      id: number;
      firstLine?: string | null;
      secondLine?: string | null;
      town?: string | null;
      region?: string | null;
      country?: string | null;
      postcode?: string | null;
      coordinates?: { __typename?: "Point"; x: number; y: number } | null;
    } | null;
    companyOperationsByCompany: {
      __typename?: "CompanyOperationsConnection";
      nodes: Array<{
        __typename?: "CompanyOperation";
        id: number;
        operation: SchemaTypes.Operation;
      }>;
    };
    companyMembers: {
      __typename?: "CompanyMembersConnection";
      nodes: Array<{
        __typename?: "CompanyMember";
        account?: {
          __typename?: "Account";
          role?: SchemaTypes.Role | null;
          id: number;
          firstName?: string | null;
          lastName?: string | null;
          phone?: string | null;
          email: string;
          photo?: string | null;
          signedPhotoUrl?: string | null;
        } | null;
      }>;
    };
    companyDocuments: {
      __typename?: "CompanyDocumentsConnection";
      nodes: Array<{
        __typename?: "CompanyDocument";
        id: number;
        document?: string | null;
        name?: string | null;
        documentType?: SchemaTypes.CompanyDocumentType | null;
        size?: number | null;
        signedDocumentUrl?: string | null;
        createdAt: any;
        updatedAt: any;
      }>;
    };
  } | null;
  contactDetailsCollection?: {
    __typename?: "ContactDetailsCollection";
    items: Array<{
      __typename?: "ContactDetails";
      fullName?: string | null;
      subHeading?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
    } | null>;
  } | null;
};

export type GetPartnerBrandsQueryVariables = SchemaTypes.Exact<{
  role: SchemaTypes.Scalars["String"];
  tier: SchemaTypes.Scalars["String"];
  tag: SchemaTypes.Scalars["String"];
}>;

export type GetPartnerBrandsQuery = {
  __typename?: "Query";
  marketContentCollection?: {
    __typename?: "MarketContentCollection";
    items: Array<{
      __typename?: "MarketContent";
      newsItemUrl?: string | null;
      newsItemCta?: string | null;
      newsItemHeading?: string | null;
      partnerBrandsCollection?: {
        __typename?: "MarketContentPartnerBrandsCollection";
        items: Array<{
          __typename?: "PartnerBrand";
          name?: string | null;
          shortDescription?: string | null;
          websiteUrl?: string | null;
          description?: {
            __typename?: "PartnerBrandDescription";
            json: any;
          } | null;
          image?: {
            __typename?: "Asset";
            title?: string | null;
            description?: string | null;
            contentType?: string | null;
            fileName?: string | null;
            size?: number | null;
            url?: string | null;
            width?: number | null;
            height?: number | null;
            sys: { __typename?: "Sys"; id: string };
          } | null;
          logo?: {
            __typename?: "Asset";
            title?: string | null;
            description?: string | null;
            contentType?: string | null;
            fileName?: string | null;
            size?: number | null;
            url?: string | null;
            width?: number | null;
            height?: number | null;
            sys: { __typename?: "Sys"; id: string };
          } | null;
        } | null>;
      } | null;
    } | null>;
  } | null;
  carouselCollection?: {
    __typename?: "CarouselCollection";
    total: number;
    items: Array<{
      __typename?: "Carousel";
      audienceRole?: string | null;
      listCollection?: {
        __typename?: "CarouselListCollection";
        total: number;
        items: Array<{
          __typename?: "CarouselItem";
          header?: string | null;
          body?: string | null;
          cta?: string | null;
          customUrl?: string | null;
          customUrlButtonText?: string | null;
          audienceTiers?: Array<string | null> | null;
          image?: {
            __typename?: "Asset";
            title?: string | null;
            description?: string | null;
            url?: string | null;
          } | null;
        } | null>;
      } | null;
    } | null>;
  } | null;
  tierBenefitCollection?: {
    __typename?: "TierBenefitCollection";
    items: Array<{
      __typename?: "TierBenefit";
      name?: string | null;
      description?: { __typename?: "TierBenefitDescription"; json: any } | null;
    } | null>;
  } | null;
};

export type AccountPageDetailsFragmentFragment = {
  __typename?: "Account";
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  role?: SchemaTypes.Role | null;
  email: string;
  phone?: string | null;
  photo?: string | null;
  signedPhotoUrl?: string | null;
  companyMembers: {
    __typename?: "CompanyMembersConnection";
    nodes: Array<{
      __typename?: "CompanyMember";
      company?: {
        __typename?: "Company";
        id: number;
        name?: string | null;
        businessType?: SchemaTypes.BusinessType | null;
        logo?: string | null;
        aboutUs?: string | null;
        ownerFullname?: string | null;
        ownerPhone?: string | null;
        ownerEmail?: string | null;
        phone?: string | null;
        publicEmail?: string | null;
        website?: string | null;
        facebook?: string | null;
        linkedIn?: string | null;
        tradingAddress?: {
          __typename?: "Address";
          id: number;
          firstLine?: string | null;
          secondLine?: string | null;
          town?: string | null;
          region?: string | null;
          country?: string | null;
          postcode?: string | null;
          coordinates?: { __typename?: "Point"; x: number; y: number } | null;
        } | null;
      } | null;
    }>;
  };
  certificationsByDoceboUserId: {
    __typename?: "CertificationsConnection";
    nodes: Array<{
      __typename?: "Certification";
      id: number;
      technology?: string | null;
      expiryDate?: any | null;
      name?: string | null;
    }>;
  };
};

export type GetUserProfileQueryVariables = SchemaTypes.Exact<{
  accountId: SchemaTypes.Scalars["Int"];
}>;

export type GetUserProfileQuery = {
  __typename?: "Query";
  account?: {
    __typename?: "Account";
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    role?: SchemaTypes.Role | null;
    email: string;
    phone?: string | null;
    photo?: string | null;
    signedPhotoUrl?: string | null;
    companyMembers: {
      __typename?: "CompanyMembersConnection";
      nodes: Array<{
        __typename?: "CompanyMember";
        company?: {
          __typename?: "Company";
          id: number;
          name?: string | null;
          businessType?: SchemaTypes.BusinessType | null;
          logo?: string | null;
          aboutUs?: string | null;
          ownerFullname?: string | null;
          ownerPhone?: string | null;
          ownerEmail?: string | null;
          phone?: string | null;
          publicEmail?: string | null;
          website?: string | null;
          facebook?: string | null;
          linkedIn?: string | null;
          tradingAddress?: {
            __typename?: "Address";
            id: number;
            firstLine?: string | null;
            secondLine?: string | null;
            town?: string | null;
            region?: string | null;
            country?: string | null;
            postcode?: string | null;
            coordinates?: { __typename?: "Point"; x: number; y: number } | null;
          } | null;
        } | null;
      }>;
    };
    certificationsByDoceboUserId: {
      __typename?: "CertificationsConnection";
      nodes: Array<{
        __typename?: "Certification";
        id: number;
        technology?: string | null;
        expiryDate?: any | null;
        name?: string | null;
      }>;
    };
  } | null;
};

export type GetProjectsQueryVariables = SchemaTypes.Exact<{
  market: SchemaTypes.Scalars["Int"];
}>;

export type GetProjectsQuery = {
  __typename?: "Query";
  projectsByMarket?: {
    __typename?: "ProjectsConnection";
    nodes: Array<{
      __typename?: "Project";
      id: number;
      name: string;
      technology: SchemaTypes.Technology;
      startDate: any;
      endDate: any;
      buildingOwnerFirstname?: string | null;
      buildingOwnerLastname?: string | null;
      buildingOwnerCompany?: string | null;
      buildingOwnerMail?: string | null;
      hidden?: boolean | null;
      siteAddress?: {
        __typename?: "Address";
        town?: string | null;
        postcode?: string | null;
      } | null;
      company?: {
        __typename?: "Company";
        name?: string | null;
        status?: SchemaTypes.CompanyStatus | null;
      } | null;
      guarantees: {
        __typename?: "GuaranteesConnection";
        nodes: Array<{
          __typename?: "Guarantee";
          coverage?: SchemaTypes.GuaranteeCoverage | null;
          status?: SchemaTypes.RequestStatus | null;
          reviewerAccountId?: number | null;
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
  __typename?: "Query";
  accounts?: {
    __typename?: "AccountsConnection";
    totalCount: number;
    nodes: Array<{
      __typename?: "Account";
      id: number;
      role?: SchemaTypes.Role | null;
      email: string;
      phone?: string | null;
      photo?: string | null;
      signedPhotoUrl?: string | null;
      lastName?: string | null;
      firstName?: string | null;
      formattedRole?: string | null;
      status?: SchemaTypes.AccountStatus | null;
      marketId?: number | null;
      certificationsByDoceboUserId: {
        __typename?: "CertificationsConnection";
        nodes: Array<{
          __typename?: "Certification";
          id: number;
          name?: string | null;
          technology?: string | null;
          expiryDate?: any | null;
        }>;
      };
      projectMembers: {
        __typename?: "ProjectMembersConnection";
        nodes: Array<{
          __typename?: "ProjectMember";
          project?: {
            __typename?: "Project";
            id: number;
            technology: SchemaTypes.Technology;
            name: string;
            startDate: any;
            endDate: any;
            hidden?: boolean | null;
            company?: {
              __typename?: "Company";
              marketId?: number | null;
            } | null;
          } | null;
        }>;
      };
      companyMembers: {
        __typename?: "CompanyMembersConnection";
        nodes: Array<{
          __typename?: "CompanyMember";
          id: number;
          company?: { __typename?: "Company"; name?: string | null } | null;
        }>;
      };
    }>;
  } | null;
};

export type UpdateRoleAccountMutationVariables = SchemaTypes.Exact<{
  input: SchemaTypes.UpdateAccountInput;
}>;

export type UpdateRoleAccountMutation = {
  __typename?: "Mutation";
  updateAccount?: {
    __typename?: "UpdateAccountPayload";
    account?: { __typename?: "Account"; id: number } | null;
  } | null;
};

export type TrainingQueryVariables = SchemaTypes.Exact<{
  catalogueId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
  userId?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
  tag: SchemaTypes.Scalars["String"];
}>;

export type TrainingQuery = {
  __typename?: "Query";
  trainingContentCollection?: {
    __typename?: "TrainingContentCollection";
    items: Array<{
      __typename?: "TrainingContent";
      pageHeading?: string | null;
      description?: string | null;
      lmsCtaLabel?: string | null;
      pageSubHeading?: string | null;
      step1Heading?: string | null;
      step1SubHeading?: string | null;
      step1Description?: string | null;
      step2Heading?: string | null;
      step2SubHeading?: string | null;
      step2Description?: string | null;
      step3Heading?: string | null;
      step3SubHeading?: string | null;
      step3Description?: string | null;
      live?: string | null;
      image?: { __typename?: "Asset"; url?: string | null } | null;
    } | null>;
  } | null;
  courseCatalogues?: {
    __typename?: "CourseCataloguesConnection";
    nodes: Array<{
      __typename?: "CourseCatalogue";
      course?: {
        __typename?: "Course";
        courseId?: number | null;
        name?: string | null;
        slug?: string | null;
        technology?: string | null;
        image?: string | null;
        promoted?: boolean | null;
        trainingType?: string | null;
        description?: string | null;
        courseEnrollments: {
          __typename?: "CourseEnrollmentsConnection";
          nodes: Array<{
            __typename?: "CourseEnrollment";
            id: number;
            status?: string | null;
            url?: string | null;
            courseId?: number | null;
          }>;
        };
      } | null;
    }>;
  } | null;
};
