import { gql } from "@apollo/client";

export const queryMarketByDomain = gql`
  query getMarketsByDomain($domain: String!) {
    markets(condition: { domain: $domain }) {
      nodes {
        cmsSpaceId
        domain
        merchandisingUrl
        projectsEnabled
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
