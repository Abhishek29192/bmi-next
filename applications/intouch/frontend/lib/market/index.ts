import { gql } from "@apollo/client";

export const markets = gql`
  query markets {
    markets {
      nodes {
        id
        language
        domain
        cmsSpaceId
        name
        sendName
        sendMailbox
        doceboInstallersBranchId
        doceboCompanyAdminBranchId
        merchandisingUrl
        merchandiseSso
        projectsEnabled
        gtag
        gtagMarketMedia
        optanonClass
        locationBiasRadiusKm
        rewardEffectiveDate
      }
    }
    doceboTiers {
      nodes {
        id
        marketId
        tierCode
        doceboCatalogueId
      }
    }
    merchandiseTiers {
      nodes {
        id
        marketId
        tierCode
        merchandiseDivisionId
      }
    }
  }
`;

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
        optanonClass
        sendName
        sendMailbox
        locationBiasRadiusKm
        geoMiddle {
          x
          y
        }
        rewardEffectiveDate
      }
    }
  }
`;

export const updateMarket = gql`
  mutation updateMarket($input: UpdateMarketInput!) {
    updateMarket(input: $input) {
      query {
        markets {
          nodes {
            id
            language
            domain
            cmsSpaceId
            name
            sendName
            sendMailbox
            doceboInstallersBranchId
            doceboCompanyAdminBranchId
            merchandisingUrl
            merchandiseSso
            projectsEnabled
            locationBiasRadiusKm
            gtag
            gtagMarketMedia
            optanonClass
            rewardEffectiveDate
          }
        }
      }
    }
  }
`;
