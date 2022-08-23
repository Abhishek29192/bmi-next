import { gql } from "@apollo/client";

export const queryDoceboTiersByMarketId = gql`
  query queryDoceboTiersByMarketId($marketId: Int!) {
    doceboTiers(condition: { marketId: $marketId }) {
      nodes {
        tierCode
        doceboCatalogueId
      }
    }
  }
`;
