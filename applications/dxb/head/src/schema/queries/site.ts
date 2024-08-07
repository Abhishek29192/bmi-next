import {
  AssetFragment,
  ContactUsPageInfoFragment,
  ContactUsPageParentPageFragment,
  EntryIdFragment,
  ExploreBarFragment,
  FooterMainNavigationFragment,
  FooterSecondaryNavigationFragment,
  FormSectionFragment,
  HeaderUtilitiesFragment,
  ImageFragment,
  LinkedPageFragment,
  LinkFragment,
  LinkNonRecursiveFragment,
  pageInfoBaseFields,
  ProductListerPageInfoFragment,
  PromoFragment,
  ShareWidgetSectionFragment,
  SignUpBlockFragment,
  SimplePageInfoFragment,
  SimplePageParentPageFragment,
  SpecificationNotesFragment,
  TitleWithContentFragment,
  VideoFragment,
  ProductListerPageParentPageFragment,
  DocumentLibraryPageParentPageFragment,
  BrandLandingPageParentPageFragment,
  TrainingListerPageParentPageFragment,
  PageLinkData
} from "../fragments/contentfulFragments";

export default `
query ($countryCode: String!) {
  siteCollection(where: { countryCode: $countryCode }, limit: 1) {
    items {
      sys {
        locale
      }
      countryCode
      accountPage {
        title
      }
      menuUtilities {
        ...HeaderUtilitiesFragment
      }
      footerMainNavigation {
        ...FooterMainNavigationFragment
      }
      footerSecondaryNavigation {
        ...FooterSecondaryNavigationFragment
      }
      homePage {
        title
        sys {
          id
        }
      }
      pitchedRoofCalculatorConfig {
        hubSpotFormId
        needHelpSection {
          ...TitleWithContentFragment
        }
        roofShapesCollection {
          items {
            roofShapeId
          }
        }
      }
      visualiserHouseTypesCollection {
        items {
          name
          houseModel {
            url
          }
        }
      }
      resources {
        pdpSidebarItemsCollection {
          items {
            ...TitleWithContentFragment
          }
        }
        maximumSamples
        pdpCardsTitle
        pdpCardsCollection {
          items {
            __typename
            ...PromoFragment
            ...SimplePageInfoFragment
            ...ContactUsPageInfoFragment
            ...ProductListerPageInfoFragment
          }
        }
        pdpExploreBar {
          ...ExploreBarFragment
        }
        pdpShareWidget {
          ...ShareWidgetSectionFragment
        }
        sdpShareWidget {
          ...ShareWidgetSectionFragment
        }
        sdpLeadBlockCta {
          ...LinkFragment
        }
        sdpSidebarItemsCollection {
          items {
            ...TitleWithContentFragment
          }
        }
        sdpBimDescription {
          json
        }
        pdpSignupBlock {
          ...SignUpBlockFragment
        }
        errorFourOFour {
          ...PromoFragment
        }
        errorGeneral {
          ...PromoFragment
        }
        searchPageSearchTips {
          ...TitleWithContentFragment
        }
        searchPageSidebarItems {
          ...TitleWithContentFragment
        }
        searchPageNextBestActionsCollection {
          items {
            __typename
            ...PromoFragment
            ...SimplePageInfoFragment
            ...ContactUsPageInfoFragment
            ...ProductListerPageInfoFragment
          }
        }
        searchPageExploreBar {
          ...ExploreBarFragment
        }
        welcomeDialogTitle
        welcomeDialogBody {
          json
        }
        welcomeDialogBrands
        ieDialogTitle
        ieDialogBody {
          json
        }
        ieDialogActionLabel
        productDocumentNameMap
        visualiserShareWidget {
          ...ShareWidgetSectionFragment
        }
        countryNavigationIntroduction {
          json
        }
        sampleBasketLink {
          ... on Page {
            ${pageInfoBaseFields}
            sectionsCollection {
              items {
                ... on SampleBasket {
                  title
                }
              }
            }
          }
        }
        keyAssetTypes
        pdpFixingToolTitle
        pdpFixingToolDescription {
          json
        }
        pdpSpecificationTitle
        pdpSpecificationDescription {
          json
        }
        sdpSpecificationNotesCta {
          ...SpecificationNotesFragment
        }
        documentDisplayFormat
        gbbGoodIndicator
        gbbBetterIndicator
        gbbBestIndicator
      }
    }
  }
}
${PromoFragment}
${LinkFragment}
${LinkedPageFragment}
${AssetFragment}
${ImageFragment}
${VideoFragment}
${SimplePageInfoFragment}
${ContactUsPageInfoFragment}
${ProductListerPageInfoFragment}
${ExploreBarFragment}
${ShareWidgetSectionFragment}
${TitleWithContentFragment}
${FormSectionFragment}
${SignUpBlockFragment}
${SpecificationNotesFragment}
${HeaderUtilitiesFragment}
${FooterMainNavigationFragment}
${FooterSecondaryNavigationFragment}
${LinkNonRecursiveFragment}
${EntryIdFragment}
${ContactUsPageParentPageFragment}
${SimplePageParentPageFragment}
${ProductListerPageParentPageFragment}
${DocumentLibraryPageParentPageFragment}
${BrandLandingPageParentPageFragment}
${TrainingListerPageParentPageFragment}
${PageLinkData}
`;
