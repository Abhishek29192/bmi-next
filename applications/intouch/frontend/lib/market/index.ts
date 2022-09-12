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
        doceboInstallersBranchId
        doceboCompanyAdminBranchId
        merchandisingUrl
        merchandiseSso
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
