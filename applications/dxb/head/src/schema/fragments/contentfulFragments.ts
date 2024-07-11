export const EntryIdFragment = `
fragment ContentfulEntryId on Entry {
  sys {
    id
  }
}`;

export const PageLinkData = `
fragment BrandLandingPageLinkDataFragment on BrandLandingPage {
  slug
  title
  parentPage {
    ...BrandLandingPageParentPageFragment
  }
}

fragment ContactUsPageLinkDataFragment on ContactUsPage {
  slug
  title
  parentPage {
    ...ContactUsPageParentPageFragment
  }
}

fragment CookiePolicyPageLinkDataFragment on CookiePolicyPage {
  title
  slug
}

fragment DocumentLibraryPageLinkDataFragment on DocumentLibraryPage {
  slug
  title
  parentPage {
    ...DocumentLibraryPageParentPageFragment
  }
}

fragment HomePageLinkDataFragment on HomePage {
  title
}

fragment ProductListerPageLinkDataFragment on ProductListerPage {
  slug
  title
  parentPage {
    ...ProductListerPageParentPageFragment
  }
}

fragment SimplePageLinkDataFragment on Page {
  slug
  title
  parentPage {
    ...SimplePageParentPageFragment
  }
}

fragment TrainingListerPageLinkDataFragment on TrainingListerPage {
  slug
  title
  parentPage {
    ...TrainingListerPageParentPageFragment
  }
}
`;

export const LinkedPageFragment = `
fragment LinkedPageFragment on LinkLinkedPage {
  __typename
  ...ContentfulEntryId
  ...BrandLandingPageLinkDataFragment
  ...ContactUsPageLinkDataFragment
  ...CookiePolicyPageLinkDataFragment
  ...DocumentLibraryPageLinkDataFragment
  ...HomePageLinkDataFragment
  ...ProductListerPageLinkDataFragment
  ...SimplePageLinkDataFragment
  ...TrainingListerPageLinkDataFragment
}`;

export const AssetFragment = `
fragment ContentfulAssetFragment on Asset {
  __typename
  sys {
    id
  }
  title
  description
  contentType
  fileName
  url
  size
  width
  height
}`;

export const ImageFragment = `
fragment ImageFragment on Image {
  __typename
  type
  altText
  image {
    ...ContentfulAssetFragment
  }
  caption
  focalPoint
}`;

export const LinkNonRecursiveFragment = `
fragment LinkNonRecursiveFragment on Link {
  __typename
  label
  icon
  isLabelHidden
  url
  type
  parameters
  queryParams
  asset {
    url
  }
  linkedPage {
    ...LinkedPageFragment
  }
  ...ContentfulEntryId
}`;

export const LinkFragment = `
fragment LinkFragment on Link {
  ...LinkNonRecursiveFragment
  dialogContent {
    ...FormSectionFragment
  }
}`;

export const VideoFragment = `
fragment VideoFragment on Video {
  __typename
  title
  label
  subtitle
  youtubeId
  previewMedia {
    ...ImageFragment
  }
}`;

export const PromoFragment = `
fragment PromoFragment on Promo {
  __typename
  name
  title
  featuredMedia {
    ...ImageFragment
  }
  brandLogo
  subtitle
  body {
    json
  }
  tagsCollection {
    items {
      title
      type
    }
  }
  cta {
    ...LinkFragment
  }
  featuredVideo {
    ...VideoFragment
  }
  backgroundColor
}`;

export const pageInfoBaseFields = `
  __typename
  title
  subtitle
  slug
  tagsCollection {
    items {
      title
      type
    }
  }
  featuredMedia {
    ...ImageFragment
  }
  featuredVideo {
    ...VideoFragment
  }
`;

export const SimplePageInfoFragment = `
 fragment SimplePageInfoFragment on Page {
      ...ContentfulEntryId
      ${pageInfoBaseFields}
      date
      brandLogo
      parentPage {
            ...SimplePageParentPageFragment
      }
 }`;

export const ContactUsPageInfoFragment = `
 fragment ContactUsPageInfoFragment on ContactUsPage {
      ...ContentfulEntryId
      ${pageInfoBaseFields}
      parentPage {
            ...ContactUsPageParentPageFragment
      }
}`;

export const DocumentLibraryPageInfoFragment = `
fragment DocumentLibraryPageInfoFragment on DocumentLibraryPage {
  ...ContentfulEntryId
  __typename
  title
  subtitle
  slug
  tagsCollection {
    items {
      title
      type
    }
  }
  parentPage {
    ...DocumentLibraryPageParentPageFragment
  }
}`;

export const TrainingListerPageInfoFragment = `
fragment TrainingListerPageInfoFragment on TrainingListerPage {
  ...ContentfulEntryId
  __typename
  title
  subtitle
  slug
  parentPage {
    ...TrainingListerPageParentPageFragment
  }
  featuredMedia {
    ...ImageFragment
  }
}`;

export const ProductListerPageInfoFragment = `
fragment ProductListerPageInfoFragment on ProductListerPage {
  ...ContentfulEntryId
   ${pageInfoBaseFields}
  brandLogo
  parentPage {
    ...ProductListerPageParentPageFragment
  }
}`;

export const ExploreBarFragment = `
fragment ExploreBarFragment on Navigation {
  ...ContentfulEntryId
  label
  linksCollection {
    items {
      ...LinkFragment
    }
  }
}`;

export const ShareWidgetSectionFragment = `
fragment ShareWidgetSectionFragment on ShareWidgetSection {
  title
  message
  clipboardSuccessMessage
  clipboardErrorMessage
  isLeftAligned
  copy
  email
  facebook
  linkedin
  pinterest
  twitter
}`;

export const TitleWithContentFragment = `
fragment TitleWithContentFragment on TitleWithContent {
  __typename
  name
  title
  content {
    json
  }
}`;

export const FormSectionFragment = `
fragment FormSectionFragment on Form {
  __typename
  title
  showTitle
  description {
    json
  }
  recipients
  inputs
  submitText
  successRedirect {
    ...LinkNonRecursiveFragment
  }
  source
  hubSpotFormGuid
  emailSubjectFormat
}`;

export const SignUpBlockFragment = `
fragment SignUpBlockFragment on SignupBlock {
  __typename
  title
  #signUpBlockDescription: description is needed to avoid conflicts between description field of other content types
  signUpBlockDescription: description 
  signupLabel
  signupDialogContent {
    ...FormSectionFragment
  }
}`;

export const SpecificationNotesFragment = `
fragment SpecificationNotesFragment on SpecificationNotes {
  __typename
  title
  name
  description {
    json
  }
  cta {
    ...LinkFragment
  }
}`;

export const SeoFragment = `
  fragment SEOContentFragment on SeoContent {
    metaTitle
    metaDescription
    noIndex
    sameAs
  }
`;

export const HeaderUtilitiesFragment = `
      fragment HeaderUtilitiesFragment on Navigation {
            label
            linksCollection(limit: 20) {
                  items {
                        __typename
                        ...LinkFragment
                  }
            }
      }     
`;

export const FooterMainNavigationFragment = `
fragment FooterMainNavigationFragment on Navigation {
            label
            linksCollection(limit: 30) {
                  items {
                  __typename
                        ...LinkFragment
                        ... on Navigation {
                              label
                              linksCollection(limit: 20) {
                                    items {
                                      ...LinkFragment
                                    }
                              }
                        }
                  }
            }
      }
`;

export const FooterSecondaryNavigationFragment = `
      fragment FooterSecondaryNavigationFragment on Navigation {
            label
            linksCollection(limit: 30) {
                  items {
                    ...LinkFragment
                  }
            }
      }
`;

export const SimplePageParentPageFragment = `
fragment SimplePageParentPageFragment on PageParentPage {
    __typename
    ...ContentfulEntryId
    ... on BrandLandingPage {
        slug
        title
    }
    ... on ContactUsPage {
        slug
        title
    }
    ... on DocumentLibraryPage {
        slug
        title
    }
    ... on HomePage {
        title
    }
    ... on Page {
        slug
        title
    }
    ... on ProductListerPage {
        slug
        title
    }
}
`;

export const ContactUsPageParentPageFragment = `
fragment ContactUsPageParentPageFragment on ContactUsPageParentPage {
    __typename
    ...ContentfulEntryId
    ... on BrandLandingPage {
        slug
        title
    }
    ... on ContactUsPage {
        slug
        title
    }
    ... on DocumentLibraryPage {
        slug
        title
    }
    ... on HomePage {
        title
    }
    ... on Page {
        slug
        title
    }
    ... on ProductListerPage {
        slug
        title
    }
}
`;

export const DocumentLibraryPageParentPageFragment = `
fragment DocumentLibraryPageParentPageFragment on DocumentLibraryPageParentPage {
    __typename
    ...ContentfulEntryId
    ... on BrandLandingPage {
        slug
        title
    }
    ... on ContactUsPage {
        slug
        title
    }
    ... on DocumentLibraryPage {
        slug
        title
    }
    ... on HomePage {
        title
    }
    ... on Page {
        slug
        title
    }
    ... on ProductListerPage {
        slug
        title
    }
}
`;

export const ProductListerPageParentPageFragment = `
fragment ProductListerPageParentPageFragment on ProductListerPageParentPage {
    __typename
    ...ContentfulEntryId
    ... on BrandLandingPage {
        slug
        title
    }
    ... on ContactUsPage {
        slug
        title
    }
    ... on DocumentLibraryPage {
        slug
        title
    }
    ... on HomePage {
        title
    }
    ... on Page {
        slug
        title
    }
    ... on ProductListerPage {
        slug
        title
    }
}
`;

export const BrandLandingPageParentPageFragment = `
fragment BrandLandingPageParentPageFragment on BrandLandingPageParentPage {
    __typename
    ...ContentfulEntryId
    ... on BrandLandingPage {
        slug
        title
    }
    ... on ContactUsPage {
        slug
        title
    }
    ... on DocumentLibraryPage {
        slug
        title
    }
    ... on HomePage {
        title
    }
    ... on Page {
        slug
        title
    }
    ... on ProductListerPage {
        slug
        title
    }
}
`;

export const TrainingListerPageParentPageFragment = `
fragment TrainingListerPageParentPageFragment on TrainingListerPageParentPage {
    __typename
    ...ContentfulEntryId
    ... on BrandLandingPage {
        slug
        title
    }
    ... on ContactUsPage {
        slug
        title
    }
    ... on DocumentLibraryPage {
        slug
        title
    }
    ... on HomePage {
        title
    }
    ... on Page {
        slug
        title
    }
    ... on ProductListerPage {
        slug
        title
    }
    ... on TrainingListerPage {
      slug
      title
    }
}
`;

export const CardCollectionSectionFragment = `
fragment CardCollectionSectionFragment on CardCollectionSection {
  __typename
  title
  description {
    json
  }
  cardType
  cardLabel
  link {
    ...LinkFragment
  }
  justifyCenter
  displaySingleRow
  sortOrder
  groupCards
  # limit:30 is needed to not hit the Contentful's query complexity limit
  cardsCollection(limit: 30) {
    items {
      __typename
      ...PromoFragment
      ...SimplePageInfoFragment
      ...DocumentLibraryPageInfoFragment
      ...ProductListerPageInfoFragment
      ...TrainingListerPageInfoFragment
    }
  }
}`;

export const IframeSectionFragment = `
fragment IframeSectionFragment on Iframe {
  __typename
  title
  summary {
    json
  }
  url
  height
  allowCookieClasses
}
`;

export const CarouselSectionFragment = `
fragment CarouselSectionFragment on CarouselSection {
  __typename
  title
  variant
  link {
    ...LinkFragment
  }
  slidesCollection {
    items {
      __typename
      ...PromoFragment
      ...ContactUsPageInfoFragment
      ...SimplePageInfoFragment
      ...ProductListerPageInfoFragment
    }
  }
}`;

export const EmbeddedScriptSectionFragment = `
fragment EmbeddedScriptSectionFragment on EmbeddedScriptSection {
  __typename
  title
  scriptSectionId
  url
  ecmaScript
}`;

export const LeadBlockSectionFragment = `
  fragment LeadBlockSectionFragment on LeadBlockSection {
    title
    text {
      json
    }
    link {
      ...LinkFragment
    }
    postItCard {
      json
    }
  }
`;

export const TableFragment = `
 fragment TableFragment on Table {
  __typename
  ...ContentfulEntryId
  data
 }`;

export const VideoSectionFragment = `
 fragment VideoSectionFragment on VideoSection {
  __typename
  name
  title
  description {
    json
  }
  video {
    ...VideoFragment
  }
 }`;

export const SyndicateSectionFragment = `
fragment SyndicateSectionFragment on VillainSection {
  title
  isReversed
   # syndicateSectionDescription: description is needed to avoid conflicts between description field of other content types
  syndicateSectionDescription: description
   # limit:50 is needed to not hit the Contentful's query complexity limit
  villainsCollection(limit: 50) {
    items {
      __typename
      ...PromoFragment
      ...ContactUsPageInfoFragment
      ...SimplePageInfoFragment
      ...TrainingListerPageInfoFragment
    }
  }
}`;

export const ServiceLocatorSectionFragment = `
 fragment ServiceLocatorSectionFragment on ServiceLocatorSection {
  __typename
  type
  showDefaultResultList
  label
  body {
    json
  }
  centre {
    lat
    lon
  }
  zoom
 }`;
