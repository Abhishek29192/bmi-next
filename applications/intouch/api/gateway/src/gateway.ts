import { ApolloGateway, LocalGraphQLDataSource } from "@apollo/gateway";
import FileUploadDataSource from "@profusion/apollo-federation-upload";
import { ContentfulSchema } from "./local-services";
import { getGCPToken } from "./utils/google-auth";

const { COMPANY_SERVICE_URL, TRAINING_SERVICE_URL } = process.env;
const LOCAL_SERVICE_URL = "localService";
const serviceList = [
  { name: "companies", url: COMPANY_SERVICE_URL },
  { name: "training", url: TRAINING_SERVICE_URL },
  { name: "contentful", url: LOCAL_SERVICE_URL }
];

const createGateway = async () => {
  const contentfulSchema = await ContentfulSchema();

  const gateway = new ApolloGateway({
    serviceList: serviceList,
    buildService({ url }) {
      if (url === LOCAL_SERVICE_URL)
        return new LocalGraphQLDataSource(contentfulSchema);
      else {
        return new FileUploadDataSource({
          url,
          willSendRequest: async ({ request, context }) => {
            const bearer = await getGCPToken(url);

            // Send gcp auth token to comunicate between services in gcp
            if (bearer) {
              request.http.headers.set("authorization", bearer);
            }

            // Send the user token information
            if (context["x-apigateway-api-userinfo"]) {
              request.http.headers.set(
                "x-apigateway-api-userinfo",
                context["x-apigateway-api-userinfo"]
              );
            }

            // Send a uuid throught the request to track it
            if (context["x-request-id"]) {
              request.http.headers.set("x-request-id", context["x-request-id"]);
            }

            // Send the user id in order to track the request
            if (context["x-authenticated-user-id"]) {
              request.http.headers.set(
                "x-authenticated-user-id",
                context["x-authenticated-user-id"]
              );
            }

            // Send the market throught the request
            if (context.market) {
              request.http.headers.set(
                "x-request-market-domain",
                context.market
              );
            }
          }
        });
      }
    },
    // Experimental: Enabling this enables the query plan view in Playground.
    __exposeQueryPlanExperimental: false
  });
  return gateway;
};

export default createGateway;
