import { makeExtendSchemaPlugin } from "graphile-utils";
import { publish, TOPICS } from "../../services/events";
import { getGuarantee } from "../../services/contentful";
import { GuaranteeQuery } from "../../../../../../shared/types/GuaranteeType";
import typeDefs from "./typeDefs";

const ExtendSchemaPlugin = makeExtendSchemaPlugin((build) => {
  const {
    graphql: { graphql }
  } = build;

  const guaranteeResolver = async (args, context, info) => {
    // The name of the operation in your query document (optional)
    const operationName = "GuaranteeQuery";

    // Whatever GraphQL query you wish to issue:
    const document = /* GraphQL */ `
      query GuaranteeQuery($id: Int!) {
        guarantee(id: $id) {
          id
          status
          requestorAccountId
          requestorAccount {
            id
            firstName
            lastName
            email
            phone
          }
          projectId
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
                projectId
                companyId
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
              productId
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
    // The variables for the query
    const variables = { id: args.id };

    const { data, errors } = await graphql<GuaranteeQuery>(
      info.schema,
      document,
      null,
      context,
      variables,
      operationName
    );

    // TODO: error handling

    return data.guarantee;
  };

  return {
    typeDefs,
    resolvers: {
      Guarantee: {
        guaranteeType: async (_query, args, context) => {
          const { guaranteeTypeId } = _query;
          const {
            data: { guaranteeType }
          } = await getGuarantee(guaranteeTypeId);

          return guaranteeType;
        }
      },

      Mutation: {
        publishMessage: async (_query, args, context, resolveInfo) => {
          const { input } = args;
          const { pubSub } = context;

          await publish(pubSub, TOPICS.TRANSACTIONAL_EMAIL, input);

          return input;
        },
        createGuaranteePdf: async (_query, args, context, resolveInfo) => {
          const data = await guaranteeResolver(args, context, resolveInfo);
          //TODO: Send guarantee data to google function(create file and send mail)
          return data;
        }
      }
    }
  };
});

export default ExtendSchemaPlugin;
