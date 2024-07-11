import {
  LinkFragment,
  LinkedPageFragment,
  PromoFragment,
  ImageFragment,
  VideoFragment,
  AssetFragment,
  FormSectionFragment,
  LinkNonRecursiveFragment,
  ContactUsPageParentPageFragment,
  DocumentLibraryPageParentPageFragment,
  SimplePageParentPageFragment,
  ProductListerPageParentPageFragment,
  EntryIdFragment,
  BrandLandingPageParentPageFragment,
  TrainingListerPageParentPageFragment,
  PageLinkData
} from "../fragments/contentfulFragments";

export const menuNavigationTopLevelQuery = `
  query( $countryCode: String! ) {
    siteCollection(where: {countryCode: $countryCode}, limit: 1) {
        items {
            menuNavigation {
                __typename
                ...ContentfulEntryId
                label
                linksCollection {
                    items {
                        __typename
                        ... on Entry {
                            sys {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
}
${EntryIdFragment}`;

export const nestedNavigationItemWithPromo = `
  query($navigationItemId: String!) {
    entryCollection(where: {sys: {id: $navigationItemId}}, limit: 1){
        items {
            __typename
            ...ContentfulEntryId
            ... on NavigationItem {
                type
                value
            }
            ... on Link {
                ...LinkNonRecursiveFragment
            }
            ... on Navigation {
                ...ContentfulEntryId
                link {
                    ...LinkNonRecursiveFragment
                }
                label
                promosCollection {
                    items {
                        __typename
                        ... on Promo {
                            ... PromoFragment
                        }
                        ... on ContactUsPage {
                            ...ContactUsPageInfoFragment
                        }
                        ... on Page {
                            ...SimplePageInfoFragment
                        }
                        ... on ProductListerPage {
                            ... ProductListerPageInfoFragment
                        }
                        ... on DocumentLibraryPage {
                            ...DocumentLibraryPageInfoFragment
                        }
                    }
                }
                linksCollection {
                    items {
                        __typename
                        ... on Entry {
                            sys {
                                id
                            }    
                        }
                    }
                }
            }
        }
    }
}

fragment SimplePageInfoFragment on Page {
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
  date
  brandLogo
}
    
fragment ContactUsPageInfoFragment on ContactUsPage {
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
 }
    
fragment ProductListerPageInfoFragment on ProductListerPage {
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
  brandLogo
}

fragment DocumentLibraryPageInfoFragment on DocumentLibraryPage {
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
}

${LinkNonRecursiveFragment}
${LinkFragment}
${LinkedPageFragment}
${PromoFragment}
${ImageFragment}
${VideoFragment}
${AssetFragment}
${FormSectionFragment}
${ContactUsPageParentPageFragment}
${DocumentLibraryPageParentPageFragment}
${SimplePageParentPageFragment}
${ProductListerPageParentPageFragment}
${EntryIdFragment}
${BrandLandingPageParentPageFragment}
${TrainingListerPageParentPageFragment}
${PageLinkData}
`;

export const nestedNavigationItem = `
  query($navigationItemId: String!) {
    entryCollection(where: {sys: {id: $navigationItemId}}, limit: 1){
        items {
            __typename
            ...ContentfulEntryId
            ... on NavigationItem {
                type
                value
            }
            ... on Link {
                ...LinkNonRecursiveFragment
            }
            ... on Navigation {
                ...ContentfulEntryId
                link {
                    ...LinkNonRecursiveFragment
                }
                label
                linksCollection {
                    items {
                        __typename
                        ... on Entry {
                            sys {
                                id
                            }    
                        }
                    }
                }
            }
        }
    }
}
${LinkNonRecursiveFragment}
${LinkedPageFragment}
${ContactUsPageParentPageFragment}
${DocumentLibraryPageParentPageFragment}
${SimplePageParentPageFragment}
${ProductListerPageParentPageFragment}
${EntryIdFragment}
${BrandLandingPageParentPageFragment}
${TrainingListerPageParentPageFragment}
${PageLinkData}
`;
