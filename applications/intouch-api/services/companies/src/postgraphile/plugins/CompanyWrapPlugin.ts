import { makeExtendSchemaPlugin, gql } from "graphile-utils";

/** This is an example to prove to extend schema capability with Postgraphile */

const MarketWrapPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    extend type Query {
      me: User
    }
    type User {
      nodeId: ID!
      id: Int!
      name: String
      username: String
    }
  `
});
export default MarketWrapPlugin;
