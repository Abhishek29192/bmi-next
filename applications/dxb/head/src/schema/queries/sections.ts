import {
  EntryIdFragment,
  CardCollectionSectionFragment,
  LinkFragment,
  LinkedPageFragment,
  LinkNonRecursiveFragment,
  BrandLandingPageParentPageFragment,
  ContactUsPageParentPageFragment,
  DocumentLibraryPageParentPageFragment,
  ProductListerPageParentPageFragment,
  SimplePageParentPageFragment,
  TrainingListerPageParentPageFragment,
  PromoFragment,
  AssetFragment,
  VideoFragment,
  ImageFragment,
  FormSectionFragment,
  SimplePageInfoFragment,
  DocumentLibraryPageInfoFragment,
  ProductListerPageInfoFragment,
  TrainingListerPageInfoFragment,
  IframeSectionFragment,
  CarouselSectionFragment,
  ContactUsPageInfoFragment,
  EmbeddedScriptSectionFragment,
  LeadBlockSectionFragment,
  PageLinkData,
  SignUpBlockFragment,
  TitleWithContentFragment,
  VideoSectionFragment,
  SyndicateSectionFragment,
  ServiceLocatorSectionFragment
} from "../fragments/contentfulFragments";

export default `
query ($id: String!) {
  entryCollection(where: { sys: { id: $id } }, limit: 1) {
    items {
      __typename
      ... on Entry {
        sys {
          id
        }
      }
      ...CardCollectionSectionFragment
      ...IframeSectionFragment
      ...CarouselSectionFragment
      ...EmbeddedScriptSectionFragment
      ...LeadBlockSectionFragment
      ...PromoFragment
      ...SignUpBlockFragment
      ...TitleWithContentFragment
      ...VideoSectionFragment
      ...SyndicateSectionFragment
      ...ServiceLocatorSectionFragment
    }
  }
}
${EntryIdFragment}
${CardCollectionSectionFragment}
${LinkFragment}
${LinkedPageFragment}
${LinkNonRecursiveFragment}
${BrandLandingPageParentPageFragment}
${ContactUsPageParentPageFragment}
${DocumentLibraryPageParentPageFragment}
${ProductListerPageParentPageFragment}
${SimplePageParentPageFragment}
${TrainingListerPageParentPageFragment}
${PromoFragment}
${AssetFragment}
${VideoFragment}
${ImageFragment}
${FormSectionFragment}
${SimplePageInfoFragment}
${DocumentLibraryPageInfoFragment}
${ProductListerPageInfoFragment}
${TrainingListerPageInfoFragment}
${IframeSectionFragment}
${CarouselSectionFragment}
${ContactUsPageInfoFragment}
${EmbeddedScriptSectionFragment}
${LeadBlockSectionFragment}
${PageLinkData}
${SignUpBlockFragment}
${TitleWithContentFragment}
${VideoSectionFragment}
${SyndicateSectionFragment}
${ServiceLocatorSectionFragment}
`;
