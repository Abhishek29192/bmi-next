import { gql } from "apollo-server";

export default gql`
  type Product {
    name: String!
    description: String!
    approvalStatus: String
    code: String
    isSampleOrderAllowed: Boolean
    summary: String
  }

  type Query {
    products: [Product]
  }
`;
