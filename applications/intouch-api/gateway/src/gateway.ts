import { ApolloGateway } from "@apollo/gateway";

const { COMPANY_SERVICE } = process.env;
const serviceList = [{ name: "companies", url: COMPANY_SERVICE }];
const gateway = new ApolloGateway({
  serviceList: serviceList,
  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false
});

export default gateway;
