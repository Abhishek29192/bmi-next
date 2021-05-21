import {
  GraphQLSchema,
  GraphQLFieldResolver,
  GraphQLTypeResolver,
  Source
} from "graphql";
import { ExecutionResult, Maybe } from "@graphql-tools/utils";
import { Guarantee } from "@bmi/intouch-api-types";

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
  const document = `
    query GuaranteeQuery($id: Int!) {
      guarantee(id: $id) {
        id
        status
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
          }
          addresses {
            nodes {
              firstLine
              secondLine
              town
              country
              postcode
              addressType
            }
          }
        }
        guaranteedProducts {
          nodes {
            product {
              id
              name
              technology
            }
          }
        }
        startDate
        expiry
        issueNumber
        guaranteeTypeId
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
            }
          }
        }
      }
    }
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
