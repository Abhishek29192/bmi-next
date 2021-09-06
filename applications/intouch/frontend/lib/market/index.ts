import { gql } from "@apollo/client";

export const queryMarketsByDomain = gql`
  query getMarketsByDomain($domain: String!) {
    markets(condition: { domain: $domain }) {
      nodes {
        id
        cmsSpaceId
        domain
        merchandisingUrl
        projectsEnabled
        locationBiasRadiusKm
        geoMiddle {
          x
          y
        }
      }
    }
  }
`;
