import { DocumentNode } from "graphql";
import { gql } from "apollo-server";

// NOTE: this should be in a schema library

export type Product = {
  name: string;
  description: string;
};

const typeDefs: DocumentNode = gql`
  type Product {
    name: String
    description: String
  }

  type Query {
    products: [Product]
  }
`;

export default typeDefs;
