import { gql } from "@apollo/client";

export const queryMarketsByDomain = gql`
  query getMarketsByDomain($domain: String!) {
    markets(condition: { domain: $domain }) {
      nodes {
        id
        name
        cmsSpaceId
        language
        domain
        doceboCatalogueId
        doceboCatalogueIdT2
        doceboCatalogueIdT3
        doceboCatalogueIdT4
        doceboInstallersBranchId
        doceboCompanyAdminBranchId
        merchandisingUrl
        projectsEnabled
        gtag
        gtagMarketMedia
        sendName
        sendMailbox
        locationBiasRadiusKm
        geoMiddle {
          x
          y
        }
      }
    }
  }
`;
