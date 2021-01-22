/* This is provisional schema to test Apollo Gateway.*/

import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    topBmiProducts(first: Int = 5): [BmiProduct]
  }

  type BmiProduct @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }
`;
export { typeDefs };
