import {
  ApolloGateway,
  RemoteGraphQLDataSource,
  LocalGraphQLDataSource
} from "@apollo/gateway";
import { ContentfulSchema } from "./local-services";

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
      else
        return new RemoteGraphQLDataSource({
          url,
          willSendRequest({ request, context }) {
            if (context.authorization) {
              request.http.headers.set("authorization", context.authorization);
              request.http.headers.set(
                "x-apigateway-api-userinfo",
                context["x-apigateway-api-userinfo"]
              );
            }
            request.http.headers.set("x-request-id", context["x-request-id"]);
          }
        });
    },
    // Experimental: Enabling this enables the query plan view in Playground.
    __exposeQueryPlanExperimental: false
  });
  return gateway;
};

export default createGateway;
