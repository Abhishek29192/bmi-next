import {
  EntryIdFragment,
  BrandLandingPageParentPageFragment,
  SimplePageParentPageFragment,
  ContactUsPageParentPageFragment,
  DocumentLibraryPageParentPageFragment,
  ProductListerPageParentPageFragment,
  TrainingListerPageParentPageFragment
} from "../fragments/contentfulFragments";

export default `
query ($entryId: String!) {
  entryCollection(where: { sys: { id: $entryId } }) {
    items {
      __typename
      ... on HomePage {
        title
        ...ContentfulEntryId
      }
      ... on Page {
        ...SimplePageParentPageFragment
        parentPage {
          ...SimplePageParentPageFragment
        }
      }
      ... on BrandLandingPage {
        ...BrandLandingPageParentPageFragment
        parentPage {
          ...BrandLandingPageParentPageFragment
        }
      }
      ... on ContactUsPage {
        ...ContactUsPageParentPageFragment
        parentPage {
          ...ContactUsPageParentPageFragment
        }
      }
      ... on DocumentLibraryPage {
        ...DocumentLibraryPageParentPageFragment
        parentPage {
          ...DocumentLibraryPageParentPageFragment
        }
      }
      ... on ProductListerPage {
        ...ProductListerPageParentPageFragment
        parentPage {
          ...ProductListerPageParentPageFragment
        }
      }
      ... on TrainingListerPage {
        ...TrainingListerPageParentPageFragment
        parentPage {
          ...TrainingListerPageParentPageFragment
        }
      }
    }
  }
}
${EntryIdFragment}
${BrandLandingPageParentPageFragment}
${SimplePageParentPageFragment}
${ContactUsPageParentPageFragment}
${DocumentLibraryPageParentPageFragment}
${ProductListerPageParentPageFragment}
${TrainingListerPageParentPageFragment}
`;
