export default `#graphql
type ContentfulMetadata @dontInfer {
  tags: [ContentfulTag]
}

interface ContentfulObject implements Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
}

interface ContentfulFormInputs implements Node @dontInfer {
  id: ID!
  name: String
  type: String
  label: String
  width: String
  required: Boolean
  options: String
  accept: String
  maxSize: Int
}

type ContentfulFormSectionInputsJsonNode implements ContentfulFormInputs & Node @dontInfer {
  id: ID!
  name: String
  type: String
  label: String
  width: String
  required: Boolean
  options: String
  accept: String
  maxSize: Int
}

interface ContentfulPage implements ContentfulObject & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  title: String
  slug: String!
  path: String!
  breadcrumbs: [BreadcrumbItem]
  breadcrumbTitle: String
  brandLogo: String
  subtitle: String
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  featuredVideo: ContentfulVideo @link(from: "featuredVideo___NODE")
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
}

type FilterOption @dontInfer {
  label: String!
  value: String!
}

type Filter @dontInfer {
  filterCode: String!
  name: String
  value: String!
  code: String!
  groupLabel: String
  parentFilterCode: String!
  unit: String
  isCategory: Boolean!
}

type PLPFilter @dontInfer {
  filterCode: String!
  label: String!
  name: String!
  options: [FilterOption]!
  value: [String] # Should value be mandatory?
}

type PLPFilterResponse @dontInfer {
  filters: [PLPFilter]
  allowFilterBy: [String]
}

type FourOFourResponse @dontInfer {
  errorPageData: ContentfulPromo
  siteData: ContentfulSite
}

type BreadcrumbItem @dontInfer {
  id: String
  label: String
  slug: String
}

type ContentfulSimplePage implements ContentfulObject & ContentfulPage & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  title: String
  slug: String!
  path: String!
  breadcrumbs: [BreadcrumbItem]
  breadcrumbTitle: String
  brandLogo: String
  subtitle: String
  heroType: String
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  shareWidget: ContentfulShareWidgetSection @link(from: "shareWidget___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  nextBestActions: [ContentfulPromoOrPage] @link(from: "nextBestActions___NODE")
  exploreBar: ContentfulNavigation @link(from: "exploreBar___NODE")
  linkColumns: ContentfulLinkColumnsSection @link(from: "linkColumns___NODE")
  leadBlock: ContentfulLeadBlockSection @link(from: "leadBlock___NODE")
  date: String
  sections: [ContentfulSection] @link(from: "sections___NODE")
  parentPage: LinkedPage @link(from: "parentPage___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
  featuredVideo: ContentfulVideo @link(from: "featuredVideo___NODE")
  sampleBasketSection: ContentfulSampleBasketSection @link(from: "sampleBasketSection___NODE")
  cta: ContentfulLink @link(from: "cta___NODE")
}

type ContentfulContactUsPage implements ContentfulObject & ContentfulPage & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  title: String
  slug: String!
  path: String!
  breadcrumbs: [BreadcrumbItem]
  breadcrumbTitle: String
  brandLogo: String
  subtitle: String
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  featuredVideo: ContentfulVideo @link(from: "featuredVideo___NODE")
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  queriesTitle: String
  queriesSubtitle: String
  locationsTitle: String
  locations: [ContentfulContactDetails] @link(from: "locations___NODE")
  iframe: ContentfulIframe @link(from: "iframe___NODE")
  sections: [ContentfulSection] @link(from: "sections___NODE")
  contentTopics: [ContentfulContactTopic] @link(from: "contentTopics___NODE")
  nextBestActions: [ContentfulPromoOrPage] @link(from: "nextBestActions___NODE")
  parentPage: LinkedPage @link(from: "parentPage___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
}

type ContentfulHomePage implements ContentfulObject & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  title: String
  slug: String!
  path: String!
  breadcrumbs: [BreadcrumbItem]
  spaBrands: [ContentfulBrand] @link(from: "spaBrands___NODE")
  brands: [ContentfulBrandLandingPage]!
  slides: [ContentfulPromoOrPage] @link(from: "slides___NODE")
  overlapCards: [ContentfulPromoOrPage] @link(from: "overlapCards___NODE")
  sections: [ContentfulSection] @link(from: "sections___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
}

type ContentfulProductListerPage implements ContentfulObject & ContentfulPage & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  title: String
  slug: String!
  path: String!
  breadcrumbs: [BreadcrumbItem]
  breadcrumbTitle: String
  brandLogo: String
  content: ContentfulRichText
  features: [String]
  featuresLink: ContentfulLink @link(from: "featuresLink___NODE")
  subtitle: String
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  featuredVideo: ContentfulVideo @link(from: "featuredVideo___NODE")
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  parentPage: LinkedPage @link(from: "parentPage___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
  cta: ContentfulLink @link(from: "cta___NODE")
  heroType: String
  categoryCodes: [String!]
  allowFilterBy: [String!]
}

type ContentfulPromo implements ContentfulObject & Node @dontInfer {
  name: String!
  metadata: ContentfulMetadata!
  title: String
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  brandLogo: String
  subtitle: String
  body: ContentfulRichText
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  cta: ContentfulLink @link(from: "cta___NODE")
  featuredVideo: ContentfulVideo @link(from: "featuredVideo___NODE")
  backgroundColor: String
}

type ContentfulCategory implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String!
  type: String!
}

union ContentfulPromoOrPage =
  ContentfulPromo
  | ContentfulContactUsPage
  | ContentfulSimplePage
  | ContentfulProductListerPage
  | ContentfulDocumentLibraryPage

union ContentfulRichTextReference =
  ContentfulAsset
  | ContentfulTable
  | ContentfulLink
  | ContentfulHomePage
  | ContentfulContactUsPage
  | ContentfulSimplePage
  | ContentfulProductListerPage
  | ContentfulDocumentLibraryPage
  | ContentfulBrandLandingPage

union ContentfulMediasTypes = ContentfulImage | ContentfulVideo

type ContentfulRichText implements Node @dontInfer {
  id: ID!
  raw: String!
  references: [ContentfulRichTextReference] @link(from: "references___NODE")
}

type ContentfulCalculatorRoofShape implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  name: String!
  roofShapeId: String!
  media: ContentfulAsset! @link(by: "id", from: "media___NODE")
}

type ContentfulWebToolCalculator implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  roofShapes: [ContentfulCalculatorRoofShape!]! @link(from: "roofShapes___NODE")
  hubSpotFormId: String
  needHelpSection: ContentfulTitleWithContent! @link(from: "needHelpSection___NODE")
}

type ContentfulVisualiserHouseType implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  name: String!
  previewImage: ContentfulAsset! @link(by: "id", from: "previewImage___NODE")
  houseModel: ContentfulAsset! @link(by: "id", from: "houseModel___NODE")
}

type ContentfulCardCollectionSection implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  description: ContentfulRichText
  cardType: String!
  cardLabel: String
  groupCards: Boolean
  link: ContentfulLink @link(from: "link___NODE")
  cards: [ContentfulPromoOrPage] @link(from: "cards___NODE")
  justifyCenter: Boolean
  displaySingleRow: Boolean
  sortOrder: String
}

type ContentfulCarouselSection implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  description: ContentfulRichText
  variant: String!
  slides: [ContentfulPromoOrPage] @link(from: "slides___NODE")
  link: ContentfulLink @link(from: "link___NODE")
}

type ContentfulFormSection implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  showTitle: Boolean
  description: ContentfulRichText
  recipients: String
  inputs: [ContentfulFormInputs] @link(from: "inputs___NODE")
  submitText: String
  successRedirect: ContentfulLink @link(from: "successRedirect___NODE")
  source: String!
  hubSpotFormGuid: String
  emailSubjectFormat: String
}

type ContentfulSampleBasketSection implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  description: ContentfulRichText
  checkoutFormSection: ContentfulFormSection @link(from: "checkoutFormSection___NODE")
  emptyBasketMessage: ContentfulRichText
  browseProductsCTALabel: String
  browseProductsCTA: LinkedPage @link(from: "browseProductsCTA___NODE")
}

type ContentfulShareWidgetSection implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  message: String
  clipboardSuccessMessage: String
  clipboardErrorMessage: String
  isLeftAligned: Boolean
  copy: Boolean
  email: Boolean
  facebook: Boolean
  linkedin: Boolean
  pinterest: Boolean
  twitter: Boolean
}

type ContentfulLeadBlockSection implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  title: String
  text: ContentfulRichText
  link: ContentfulLink @link(from: "link___NODE")
  postItCard: ContentfulRichText
}

type ContentfulSyndicateSection implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  villains: [ContentfulPromoOrPage] @link(from: "villains___NODE")
  isReversed: Boolean
}

type ContentfulTabsOrAccordionSectionDescriptionTextNode implements Node @dontInfer {
  description: String
}

type ContentfulTabsOrAccordionSection implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  title: String
  description: ContentfulTabsOrAccordionSectionDescriptionTextNode @link(from: "description___NODE")
  items: [ContentfulTitleWithContent] @link(from: "items___NODE")
  type: String
}

type ContentfulMediaGallerySection implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  longDescription: ContentfulRichText
  medias: [ContentfulMediasTypes!]! @link(from: "medias___NODE")
}

type ContentfulDocumentDownloadSection implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  title: String
  description: ContentfulRichText
  documents: [ContentfulDocument!]! @link(from: "documents___NODE")
}

type ContentfulServiceLocatorSection implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  type: String
  showDefaultResultList: Boolean
  title: String
  label: String
  body: ContentfulRichText
  services: [ContentfulService] @link(from: "services___NODE")
  centre: Location
  zoom: Int
}

type ContentfulVideoSection implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  name: String!
  title: String
  description: ContentfulRichText
  video: ContentfulVideo @link(from: "video___NODE")
}

union ContentfulNavigationEntity =
  ContentfulNavigation
  | ContentfulNavigationItem
  | ContentfulLink

type ContentfulNavigation implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  label: String
  links: [ContentfulNavigationEntity] @link(from: "links___NODE")
  link: ContentfulLink @link(from: "link___NODE")
  promos: [ContentfulPromoOrPage] @link(from: "promos___NODE")
}

type ContentfulNavigationItem implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  type: String
  value: String
}

type ContentfulTitleWithContent implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  name: String!
  title: String
  content: ContentfulRichText!
}

type ContentfulSpecificationNotesWithCta implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  name: String!
  title: String
  description: ContentfulRichText!
  cta: ContentfulLink @link(from: "cta___NODE")
}

type ContentfulTeamMember implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  name: String!
  profileImage: ContentfulImage @link(from: "profileImage___NODE")
  jobTitle: String
  links: [ContentfulLink] @link(from: "links___NODE")
}

type ContentfulTeamCategory implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  description: ContentfulRichText
  team_member: [ContentfulTeamMember] @link(from: "teamMembers___NODE")
}

union ContentfulSection =
  ContentfulCardCollectionSection
  | ContentfulCarouselSection
  | ContentfulFormSection
  | ContentfulNavigation
  | ContentfulTabsOrAccordionSection
  | ContentfulSyndicateSection
  | ContentfulTitleWithContent
  | ContentfulPromo
  | ContentfulMediaGallerySection
  | ContentfulDocumentDownloadSection
  | ContentfulServiceLocatorSection
  | ContentfulVideoSection
  | ContentfulIframe
  | ContentfulSystemConfiguratorSection
  | ContentfulTeamSection
  | ContentfulSampleBasketSection
  | ContentfulSignupBlock
  | ContentfulLeadBlockSection

type ContentfulMicroCopy implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  key: String!
  value: String!
}

type ContentfulResources implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  microCopy: [ContentfulMicroCopy] @link(by: "id", from: "microCopy___NODE")
  pdpSidebarItems: [ContentfulTitleWithContent] @link(from: "pdpSidebarItems___NODE")
  maximumSamples: Int
  pdpCardsTitle: String
  pdpCards: [ContentfulPromoOrPage] @link(from: "pdpCards___NODE")
  pdpExploreBar: ContentfulNavigation @link(from: "pdpExploreBar___NODE")
  pdpShareWidget: ContentfulShareWidgetSection @link(from: "pdpShareWidget___NODE")
  sdpShareWidget: ContentfulShareWidgetSection @link(from: "sdpShareWidget___NODE")
  sdpLeadBlockCta: ContentfulLink @link(from: "sdpLeadBlockCta___NODE")
  sdpSidebarItems: [ContentfulTitleWithContent] @link(from: "sdpSidebarItems___NODE")
  sdpBimDescription: ContentfulRichText
  pdpSignupBlock: ContentfulSignupBlock @link(from: "pdpSignupBlock___NODE")
  errorFourOFour: ContentfulPromo @link(from: "errorFourOFour___NODE")
  errorGeneral: ContentfulPromo @link(from: "errorGeneral___NODE")
  searchPageSearchTips: ContentfulTitleWithContent @link(from: "searchPageSearchTips___NODE")
  searchPageSidebarItems: ContentfulTitleWithContent @link(from: "searchPageSidebarItems___NODE")
  searchPageNextBestActions: [ContentfulPromoOrPage] @link(from: "searchPageNextBestActions___NODE")
  searchPageExploreBar: ContentfulNavigation @link(from: "searchPageExploreBar___NODE")
  welcomeDialogTitle: String
  welcomeDialogBody: ContentfulRichText
  welcomeDialogBrands: [String]
  ieDialogTitle: String
  ieDialogBody: ContentfulRichText
  ieDialogActionLabel: String
  ieDialogActionLink: String
  productDocumentNameMap: String
  visualiserShareWidget: ContentfulShareWidgetSection @link(from: "visualiserShareWidget___NODE")
  countryNavigationIntroduction: ContentfulRichText
  sampleBasketLink: ContentfulSimplePage @link(from: "sampleBasketLink___NODE")
  keyAssetTypes: [String]
  pdpFixingToolTitle: String
  pdpFixingToolDescription: ContentfulRichText
  pdpSpecificationTitle: String
  pdpSpecificationDescription: ContentfulRichText
  sdpSpecificationNotesCta: ContentfulSpecificationNotesWithCta @link(from: "sdpSpecificationNotesCta___NODE")
  documentDisplayFormat: String
}

union ContentfulContactDetailsOrTitleWithContent =
  ContentfulContactDetails
  | ContentfulTitleWithContent

type ContentfulContactTopic implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  icon: String
  title: String
  bodyTitle: String
  bodyList: [ContentfulTitleWithContent] @link(from: "bodyList___NODE")
  footerTitle: String
  footerList: [ContentfulContactDetailsOrTitleWithContent] @link(from: "footerList___NODE")
}

type ContentfulSignupBlockDescriptionTextNode implements Node @dontInfer {
  description: String
}

type ContentfulSignupBlock implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String
  description: ContentfulSignupBlockDescriptionTextNode @link(from: "description___NODE")
  signupLabel: String
  signupDialogContent: ContentfulFormSection @link(from: "signupDialogContent___NODE")
}

type ContentfulSite implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  node_locale: String!
  countryCode: String!
  menuUtilities: ContentfulNavigation @link(from: "menuUtilities___NODE")
  menuNavigation: ContentfulNavigation! @link(from: "menuNavigation___NODE")
  homePage: ContentfulHomePage! @link(from: "homePage___NODE")
  pages: [ContentfulPage] @link(from: "pages___NODE")
  footerMainNavigation: ContentfulNavigation @link(from: "footerMainNavigation___NODE")
  footerSecondaryNavigation: ContentfulNavigation @link(from: "footerSecondaryNavigation___NODE")
  resources: ContentfulResources @link(from: "resources___NODE")
  headScripts: ContentfulSiteHeadScriptsTextNode @link(from: "headScripts___NODE")
  regions: [RegionJson]! @link(from: "regions___NODE")
  pitchedRoofCalculatorConfig: ContentfulWebToolCalculator @link(from: "pitchedRoofCalculatorConfig___NODE")
  visualiserHouseTypes: [ContentfulVisualiserHouseType!] @link(from: "visualiserHouseTypes___NODE")
}

type ContentfulSiteHeadScriptsTextNode implements Node @dontInfer {
  headScripts: String
}

union LinkedPage =
  ContentfulContactUsPage
  | ContentfulSimplePage
  | ContentfulProductListerPage
  | ContentfulDocumentLibraryPage
  | ContentfulHomePage
  | ContentfulBrandLandingPage

type ContentfulLink implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  label: String
  icon: String
  isLabelHidden: Boolean
  url: String
  linkedPage: LinkedPage @link(from: "linkedPage___NODE")
  asset: ContentfulAsset @link(by: "id", from: "asset___NODE")
  type: String
  parameters: ContentfulLinkParametersJsonNode @link(by: "id", from: "parameters___NODE")
  queryParams: String
  dialogContent: ContentfulSection @link(from: "dialogContent___NODE")
  hubSpotCTAID: String
}

type ContentfulLinkParametersJsonNode implements Node @dontInfer {
  id: ID!
  tileId: Int
  colourId: Int
  sidingId: Int
  viewMode: String
}

type ContentfulLinkColumnsSection implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  title: String
  columns: [ContentfulNavigation] @link(from: "columns___NODE")
}

type ContentfulTeamSection implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  title: String
  teamCategories: [ContentfulTeamCategory] @link(from: "teamCategories___NODE")
  backgroundColor: String
}

type ContentfulAssetType implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  name: String!
  code: String!
  description: ContentfulRichText
  pimCode: String
}

type ContentfulDocument implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String!
  asset: ContentfulAsset! @link(by: "id", from: "asset___NODE")
  description: ContentfulRichText
  assetType: ContentfulAssetType! @link(from: "assetType___NODE")
  brand: String
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  noIndex: Boolean
}

union Document = ContentfulDocument | PIMDocument

type AssetType @dontInfer {
  name: String!
  code: String!
  description: ContentfulRichText
  pimCode: String
}

type ContentfulDocumentLibraryPage implements ContentfulObject & ContentfulPage & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  title: String
  slug: String!
  categoryCodes: [String!]
  path: String!
  breadcrumbs: [BreadcrumbItem]
  breadcrumbTitle: String
  brandLogo: String
  subtitle: String
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  featuredVideo: ContentfulVideo @link(from: "featuredVideo___NODE")
  description: ContentfulRichText
  source: String
  contentfulAssetTypes: [AssetType]!
  resultsType: String
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  documentsFilters: DocumentsFiltersResponse!
  pimCodes: [String]
  allowFilterBy: [String!]
  parentPage: LinkedPage @link(from: "parentPage___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
}

type System implements Node @dontInfer {
  awardsAndCertificateDocuments: [PIMAsset]!
  awardsAndCertificateImages: [PIMAsset]!
  bim: BIM
  brand: Brand
  categories: [Category]!
  classifications: [Classification]!
  code: String!
  description: String
  documents: [PIMSystemDocument]!
  guaranteesAndWarrantiesImages: [PIMAsset]!
  guaranteesAndWarrantiesLinks: [PIMAsset]!
  keyFeatures: KeyFeatures
  images: [PIMImage]!
  layerCodes: [String]!
  name: String!
  path: String!
  promotionalContent: String
  scoringWeight: Int!
  shortDescription: String
  specification: PIMAsset
  systemBenefits: [String]
  systemLayers: [SystemLayer]
  systemReferences: [String]!
  uniqueSellingPropositions: [String]!
  videos: [PimVideo]!
  relatedSystems: [System]!
}

type BIM @dontInfer {
  name: String!
  url: String!
}

type PIMSystemDocument @dontInfer {
  title: String!
  url: String!
  isLinkDocument: Boolean!
  assetType: ContentfulAssetType! @link(by: "pimCode", from: "assetType")
  realFileName: String
  fileSize: Int
  format: String
  id: ID!
}

type KeyFeatures @dontInfer {
  name: String!
  values: [String]!
}

type PIMAsset @dontInfer {
  allowedToDownload: Boolean
  assetType: ContentfulAssetType @link(by: "pimCode", from: "assetType")
  fileSize: Int
  format: String
  mime: String
  name: String
  realFileName: String
  url: String
}

type SystemLayer @dontInfer {
  layerNumber: String!
  name: String!
  relatedProducts: [Product]! @link(from: "products___NODE")
  relatedOptionalProducts: [Product]! @link(from: "products___NODE")
  shortDescription: String
  type: String
}

type PimSystemReference @dontInfer {
  referenceType: String
  target: PimSystemReferenceTarget
}

type PimSystemReferenceTarget @dontInfer {
  code: String!
}

type SystemProduct @dontInfer {
  code: String!
  name: String
  path: String!
}

type SystemImage @dontInfer {
  allowedToDownload: Boolean
  assetType: String
  containerId: String
  fileSize: Int
  format: String
  mime: String
  name: String
  realFileName: String
  url: String
}

type KeyAssetDocument @dontInfer {
  assetType: String
  documents: [PIMDocument]
}

type CategoryGroup @dontInfer {
  label: String!
  code: String!
}

type PIMDocumentWithPseudoZip @dontInfer {
  assetType: ContentfulAssetType! @link(by: "pimCode", from: "assetType")
  documentList: [PIMDocument]!
  fileSize: Int
  format: String
  id: ID!
  isLinkDocument: Boolean!
  productBaseCode: String!
  productName: String!
  title: String!
}

union ProductDocumentResponse = PIMDocument | PIMDocumentWithPseudoZip

type Product implements Node @dontInfer {
  awardsAndCertificateDocuments: [PIMAsset]!
  awardsAndCertificateImages: [PIMAsset]!
  baseCode: String!
  baseScoringWeight: Int!
  bimIframeUrl: String
  brand: Brand
  categories: [Category]!
  classifications: [Classification]!
  code: String
  colour: String
  colourMicrocopy: String
  colourFamily: String
  description: String
  documents: [ProductDocument]
  productDocuments: [ProductDocumentResponse] @link(from: "documents___NODE")
  externalProductCode: String
  filters: [Filter]!
  fixingToolIframeUrl: String
  galleryImages: [PIMImage]!
  groups: [CategoryGroup]!
  guaranteesAndWarrantiesImages: [PIMAsset]!
  guaranteesAndWarrantiesLinks: [PIMAsset]!
  hashedCode: String!
  isSampleOrderAllowed: Boolean
  isVisualiserAvailable: Boolean
  keyAssetDocuments: [KeyAssetDocument]
  masterImage: PIMImage
  materials: String
  measurements: Measurements
  name: String
  path: String!
  productBenefits: [String]
  relatedVariants: [RelatedVariant]!
  specificationIframeUrl: String
  techDrawings: [PIMImage]!
  textureFamily: String
  textureFamilyMicrocopy: String
  variantAttribute: String
  videos: [PimVideo]!
  weight: Weight
  breadcrumbs: [Path]!
  oldPath: String!
  relatedProducts: [Product]!
}

type ProductDocument @dontInfer {
  assetType: String
  extension: String
  fileSize: Int
  format: String
  id: String!
  isLinkDocument: Boolean!
  realFileName: String
  title: String!
  url: String!
  productBaseCode: String!
  productName: String!
}

type ProductDocumentCategory @dontInfer {
  code: String!
  parentCategoryCode: String!
}

type Path @dontInfer {
  id: String
  path: String
  label: String
  queryParams: String
  slug: String
}

type Brand @dontInfer {
  code: String!
  name: String!
  logo: String
}

type Category @dontInfer {
  categoryType: String!
  code: String!
  image: PIMAsset
  name: String!
  parentCategoryCode: String
}

type Classification @dontInfer {
  name: String!
  features: [Feature]
}

type Feature @dontInfer {
  name: String!
  value: String!
}

type DocumentsFiltersResponse @dontInfer {
  filters: [PLPFilter]!
}


type PIMDocument @dontInfer {
  title: String!
  url: String!
  isLinkDocument: Boolean!
  assetType: ContentfulAssetType! @link(by: "pimCode", from: "assetType")
  realFileName: String
  fileSize: Int
  format: String
  extension: String
  id: ID!
  productBaseCode: String!
  productName: String!
  productCategories: [PIMDocumentProductCategories]!
  productFilters: [Filter]!
}

type PIMDocumentProductCategories @dontInfer {
  code: String!
  parentCategoryCode: String
}

type PIMImage @dontInfer {
  mainSource: String
  thumbnail: String
  altText: String
}

type Measurements @dontInfer {
  length: UnitValue
  width: UnitValue
  height: UnitValue
  thickness: UnitValue
  volume: UnitValue
  label: String
}

type UnitValue @dontInfer {
  value: String!
  unit: String!
}

type RelatedVariant @dontInfer {
  code: String!
  thumbnail: String
  colour: String
  colourFamily: String
  textureFamily: String
  materials: String
  measurements: Measurements
  variantAttribute: String
  path: String!
}

type PimVideo @dontInfer {
  title: String!
  label: String!
  subtitle: String # Always null
  previewMedia: String # Always null
  videoRatio: String # Always null
  videoUrl: String
}

type Weight @dontInfer {
  grossWeight: UnitValue
  netWeight: UnitValue
  weightPerPallet: UnitValue
  weightPerPiece: UnitValue
  weightPerSqm: UnitValue
}

type ContentfulContactDetails implements Node @dontInfer {
  title: String
  address: String
  phoneNumber: String
  email: String
  otherInformation: ContentfulRichText
}

type ContentfulBrandLandingPageDescriptionTextNode implements Node @dontInfer {
  description: String
}

type ContentfulBrandLandingPage implements ContentfulObject & ContentfulPage & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  contentful_id: String!
  title: String
  cta: ContentfulLink @link(from: "cta___NODE")
  slug: String!
  path: String!
  breadcrumbs: [BreadcrumbItem]
  breadcrumbTitle: String
  subtitle: String
  description: ContentfulBrandLandingPageDescriptionTextNode @link(from: "description___NODE")
  brandLogo: String
  slides: [ContentfulPromoOrPage] @link(from: "slides___NODE")
  overlapCards: [ContentfulPromoOrPage] @link(from: "overlapCards___NODE")
  sections: [ContentfulSection] @link(from: "sections___NODE")
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  featuredVideo: ContentfulVideo @link(from: "featuredVideo___NODE")
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  parentPage: LinkedPage @link(from: "parentPage___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
}

type ContentfulBrand implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  title: String!
  brandLogo: String!
  subtitle: String
  path: String
}

type ContentfulTableDataJsonNode implements Node @dontInfer {
  tableData: [[String]]
}

type ContentfulTable implements ContentfulObject & Node @dontInfer {
  contentful_id: String!
  metadata: ContentfulMetadata!
  data: ContentfulTableDataJsonNode @link(by: "id", from: "data___NODE")
}

type ContentfulServiceType implements ContentfulObject & Node @dontInfer {
  metadata: ContentfulMetadata!
  name: String!
}

type ContentfulService implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  entryType: String
  name: String!
  location: Location
  address: String
  phone: String
  email: String
  website: String
  websiteLinkAsLabel: Boolean
  fax: String
  serviceTypes: [ContentfulServiceType] @link(from: "serviceTypes___NODE")
  certification: String
  summary: String
}

type Location implements Node {
  lat: Float!
  lon: Float!
}

type ContentfulSeoContent implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  metaTitle: String
  metaDescription: String
  noIndex: Boolean
}

type VideoRatio @dontInfer {
  width: Int!
  height: Int!
}

type ContentfulVideo implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  title: String!
  label: String!
  subtitle: String
  youtubeId: String!
  previewMedia: ContentfulImage @link(by: "id", from: "previewMedia___NODE")
  videoRatio: VideoRatio
  defaultYouTubePreviewImage: String!
}

type ContentfulImageCaptionTextNode implements Node @dontInfer {
  caption: String
}

type FocalPoint {
  x: Int
  y: Int
}

type ContentfulImage implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  type: String
  altText: String
  image: ContentfulAsset! @link(by: "id", from: "image___NODE")
  caption: ContentfulImageCaptionTextNode @link(by: "id", from: "caption___NODE")
  focalPoint: FocalPoint
  thumbnail: ContentfulAsset
}

type ContentfulIframe implements ContentfulObject & Node @dontInfer {
  id: ID!
  metadata: ContentfulMetadata!
  name: String!
  title: String
  summary: ContentfulRichText
  url: String!
  height: String!
}

type CountryJSON @dontInfer {
  code: String!
  label: String!
  icon: String
}

type RegionJson implements Node @dontInfer {
  label: String!
  menu: [CountryJSON]!
}

union NextStep = ContentfulSystemConfiguratorResult | ContentfulTitleWithContent | ContentfulSystemConfiguratorQuestion

type ContentfulSystemConfiguratorResult implements ContentfulObject & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  node_locale: String!
  label: String!
  title: String!
  description: ContentfulRichText
  recommendedSystems: [String!]!
}

type ContentfulSystemConfiguratorAnswer implements ContentfulObject & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  node_locale: String!
  label: String!
  title: String!
  description: ContentfulRichText
  nextStep: NextStep! @link(from: "nextStep___NODE")
}

type ContentfulSystemConfiguratorQuestion implements ContentfulObject & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  node_locale: String!
  label: String!
  title: String!
  description: ContentfulRichText
  answers: [ContentfulSystemConfiguratorAnswer!]! @link(from: "answers___NODE")
}

type ContentfulSystemConfiguratorSection implements ContentfulObject & Node @dontInfer {
  id: ID!
  contentful_id: String!
  metadata: ContentfulMetadata!
  node_locale: String!
  label: String
  title: String
  description: ContentfulRichText
  question: ContentfulSystemConfiguratorQuestion! @link(from: "question___NODE")
}
`;
