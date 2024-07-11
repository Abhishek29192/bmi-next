import {
  SeoFragment,
  SignUpBlockFragment,
  FormSectionFragment,
  LinkNonRecursiveFragment,
  SimplePageInfoFragment,
  DocumentLibraryPageInfoFragment,
  ContactUsPageInfoFragment,
  ProductListerPageInfoFragment,
  AssetFragment,
  ImageFragment,
  VideoFragment,
  ContactUsPageParentPageFragment,
  DocumentLibraryPageParentPageFragment,
  SimplePageParentPageFragment,
  EntryIdFragment,
  PromoFragment,
  LinkedPageFragment,
  LinkFragment,
  ProductListerPageParentPageFragment,
  BrandLandingPageParentPageFragment,
  TrainingListerPageParentPageFragment,
  PageLinkData
} from "../fragments/contentfulFragments";

export default `
  query($homePageId: String!) {
    homePage(id: $homePageId) {
      __typename
      title
      seo {
        ...SEOContentFragment
      }
      signupBlock {
        ...SignUpBlockFragment
      }
      slidesCollection(limit: 20) {
        items {
          ... on HomePageSlidesItem {
             __typename
             ...on Promo {
                ...PromoFragment
             }
             ...on Page {
                ...SimplePageInfoFragment
             }
             ...on ContactUsPage {
                ...ContactUsPageInfoFragment
             }
             ...on ProductListerPage {
                ...ProductListerPageInfoFragment
             }
           }
        }
      }
      overlapCardsCollection {
        items {
          __typename
          ...on Page {
             ...SimplePageInfoFragment
          }
          ...on ContactUsPage {
            ...ContactUsPageInfoFragment
          }
          ...on DocumentLibraryPage {
            ...DocumentLibraryPageInfoFragment
          }
        }
      }
      sectionsCollection {
        items {
          ... on Entry {
            sys {
              id
            }
          }
        }
      }
    }
    
    brandLandingPageCollection {
      items {
        title
        slug
        subtitle
        brandLogo
        sys {
          id
        }
        parentPage {
          __typename
          ...on HomePage {
            title
        ...ContentfulEntryId
          }
          ... on Page {
            title
            slug
            ...ContentfulEntryId
          }
          ... on BrandLandingPage {
            title
            slug
            ...ContentfulEntryId
          }
          ... on ContactUsPage {
            title
            slug
            ...ContentfulEntryId
          }
          ... on DocumentLibraryPage {
            title
            slug
            ...ContentfulEntryId
          }
          ... on ProductListerPage {
            title
            slug
            ...ContentfulEntryId
          }
        }
      }
    }
  }
  ${SeoFragment}
  ${SignUpBlockFragment}
  ${FormSectionFragment}
  ${LinkNonRecursiveFragment}
  ${SimplePageInfoFragment}
  ${DocumentLibraryPageInfoFragment}
  ${ContactUsPageInfoFragment}
  ${AssetFragment}
  ${ImageFragment}
  ${VideoFragment}
  ${ContactUsPageParentPageFragment}
  ${DocumentLibraryPageParentPageFragment}
  ${SimplePageParentPageFragment}
  ${EntryIdFragment}
  ${ProductListerPageInfoFragment}
  ${PromoFragment}
  ${LinkedPageFragment}
  ${LinkFragment}
  ${ProductListerPageParentPageFragment}
  ${BrandLandingPageParentPageFragment}
  ${TrainingListerPageParentPageFragment}
  ${PageLinkData}
`;
