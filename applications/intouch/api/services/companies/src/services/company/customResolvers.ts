import {
  GraphQLSchema,
  GraphQLFieldResolver,
  GraphQLTypeResolver,
  Source
} from "graphql";
import { ExecutionResult, Maybe } from "@graphql-tools/utils";
import {
  Address,
  Company,
  Guarantee,
  Technology
} from "@bmi/intouch-api-types";

type guaranteeResolverParams = {
  graphql: <TData = ExecutionResult["data"]>(
    schema: GraphQLSchema,
    source: Source | string,
    rootValue?: any,
    contextValue?: any,
    variableValues?: Maybe<{ [key: string]: any }>,
    operationName?: Maybe<string>,
    fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
    typeResolver?: Maybe<GraphQLTypeResolver<any, any>>
  ) => Promise<ExecutionResult<TData>>;
  args: any;
  context: any;
  resolverInfo: any;
};

export const guaranteeResolver = async ({
  graphql,
  args,
  context,
  resolverInfo
}: guaranteeResolverParams) => {
  const operationName = "GuaranteeQuery";

  const CONTENTFUL_GUARANTEE_TEMPLATE_DETAIL_FRAGMENT = `
  fragment GuaranteeTemplateDetailFragment on ContentfulGuaranteeTemplate {
    displayName
    technology
    coverage
    languageCode
    languageDescriptor
    approvalMessage {
      event
      #format
      subject
      notificationBody
      emailBody
    }
    rejectionMessage {
      event
      #format
      subject
      notificationBody
      emailBody
    }
    logo {
      title
      url
    }
    maintenanceTemplate {
      fileName
      url
    }
    terms {
      fileName
      url
    }
    guaranteeScope
    signatory
    headingGuarantee
    headingScope
    headingProducts
    headingBeneficiary
    headingBuildingOwnerName
    headingBuildingAddress
    headingRoofArea
    headingRoofType
    headingContractor
    headingContractorName
    headingContractorId
    headingStartDate
    headingGuaranteeId
    headingValidity
    headingExpiry
    footer
    mailSubject
    mailBody
    filenamePrefix
    titleLine1
    titleLine2
    roofType
    onerousConditionsSummary
    onerousConditionsText {
      json
    }
  }
  
  `;

  const document = `
    query GuaranteeQuery($id: Int!) {
      guarantee(id: $id) {
        id
        status
        coverage
        requestorAccount {
          id
          firstName
          lastName
          email
          phone
        }
        project {
          id
          name
          technology
          buildingOwnerFirstname
          buildingOwnerLastname
          buildingOwnerCompany
          buildingOwnerMail
          roofArea
          company {
            id
            name
            referenceNumber
            market {
              domain
            }
          }
          siteAddress {
            firstLine
            secondLine
            town
            country
            postcode
          }
          buildingOwnerAddress {
            firstLine
            secondLine
            town
            country
            postcode
          }
          
        }
        productByProductBmiRef{
          id
          name
          technology
        }
        systemBySystemBmiRef {
          bmiRef
          name
          systemMembersBySystemBmiRef {
            nodes {
              productBmiRef
              productByProductBmiRef {
                name
              }
            }
          }
        }
        startDate
        expiryDate
        bmiReferenceId
        languageCode
        guaranteeReferenceCode
        guaranteeType {
          name
          displayName
          technology
          coverage
          signature {
            fileName
            url
          }
          guaranteeTemplatesCollection {
            items {
              ...GuaranteeTemplateDetailFragment
            }
          }
        }
        fileStorageId
        signedFileStorageUrl
      }
    }
    ${CONTENTFUL_GUARANTEE_TEMPLATE_DETAIL_FRAGMENT}
  `;

  const variables = { id: args.id };

  const { data } = await graphql<{ guarantee: Guarantee }>(
    resolverInfo.schema,
    document,
    null,
    context,
    variables,
    operationName
  );

  return data.guarantee;
};

export const getCompanyCertifications = async (
  { id: companyId },
  _args,
  { pgClient }
): Promise<Technology[]> => {
  const { rows } = await pgClient.query(
    "SELECT * FROM get_company_certifications($1) as technology;",
    [companyId]
  );
  return rows.map(({ technology }) => technology as Technology);
};

const isAddressComplete = (
  address: Address,
  requireCoordinates: boolean
): boolean => {
  return !!(address?.firstLine &&
  address?.postcode &&
  address?.town &&
  address?.country &&
  requireCoordinates
    ? address?.coordinates?.x && address?.coordinates.y
    : true);
};

export const getCompanyIsProfileComplete = (company: Company): boolean => {
  return !!(
    // These are the mandatory fields during registration
    (
      company.name &&
      company.businessType &&
      isAddressComplete(company.registeredAddress, false) &&
      company.taxNumber &&
      // Aside from mandatory fields during registrtion we also need to check for the following
      // which will place the company in find a roofer
      company.aboutUs &&
      company.phone &&
      company.publicEmail &&
      company.logo &&
      isAddressComplete(company.tradingAddress, true)
    )
  );
};
