import {
  EntryIdFragment,
  LinkFragment,
  LinkedPageFragment,
  TableFragment,
  LinkNonRecursiveFragment,
  PageLinkData,
  FormSectionFragment,
  BrandLandingPageParentPageFragment,
  ContactUsPageParentPageFragment,
  DocumentLibraryPageParentPageFragment,
  ProductListerPageParentPageFragment,
  SimplePageParentPageFragment,
  TrainingListerPageParentPageFragment
} from "../fragments/contentfulFragments";

export const richTextEntryReferencesQuery = `
query ($entryIds: [String!]!) {
  entryCollection(where: { sys: { id_in: $entryIds } }) {
    items {
      __typename
      ...ContentfulEntryId
      ...LinkFragment
      ...TableFragment
      ...ContentfulEntryId
      ...BrandLandingPageLinkDataFragment
      ...ContactUsPageLinkDataFragment
      ...CookiePolicyPageLinkDataFragment
      ...DocumentLibraryPageLinkDataFragment
      ...HomePageLinkDataFragment
      ...ProductListerPageLinkDataFragment
      ...SimplePageLinkDataFragment
      ...TrainingListerPageLinkDataFragment
    }
  }
}
${EntryIdFragment}
${LinkFragment}
${LinkNonRecursiveFragment}
${LinkedPageFragment}
${TableFragment}
${PageLinkData}
${FormSectionFragment}
${BrandLandingPageParentPageFragment}
${ContactUsPageParentPageFragment}
${DocumentLibraryPageParentPageFragment}
${ProductListerPageParentPageFragment}
${SimplePageParentPageFragment}
${TrainingListerPageParentPageFragment}
`;

export const richTextAssetReferencesQuery = `
query ($assetIds: [String!]!) {
  assetCollection(where: { sys: { id_in: $assetIds } }) {
    items {
      __typename
      sys {
        id
      }
      title
      url
      contentType
    }
  }
}`;
