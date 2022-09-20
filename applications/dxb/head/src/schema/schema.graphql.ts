export default `#graphql
interface ContentfulFormInputs implements Node {
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

type contentfulFormSectionInputsJsonNode implements ContentfulFormInputs & Node {
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

interface ContentfulPage implements Node {
  id: ID!
  contentful_id: String!
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

type FilterOption {
  label: String!
  value: String!
}

type Filter {
  filterCode: String!
  name: String
  value: String!
  code: String!
  groupLabel: String
  parentFilterCode: String!
  unit: String
  isCategory: Boolean!
}

type PLPFilter {
  filterCode: String!
  label: String!
  name: String!
  options: [FilterOption]!
  value: [String] # Should value be mandatory?
}

type PLPFilterResponse {
  filters: [PLPFilter]
  allowFilterBy: [String]
}

type FourOFourResponse {
  errorPageData: ContentfulPromo
  siteData: ContentfulSite
}

type BreadcrumbItem{
  id: String
  label: String
  slug: String
}

type ContentfulSimplePage implements ContentfulPage & Node {
  id: ID!
  contentful_id: String!
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

type ContentfulContactUsPage implements ContentfulPage & Node {
  id: ID!
  contentful_id: String!
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

type ContentfulHomePage implements Node {
  id: ID!
  contentful_id: String!
  title: String
  slug: String!
  path: String!
  breadcrumbs: [BreadcrumbItem]
  spaBrands: [ContentfulBrand] @link(from:"spaBrands___NODE")
  brands: [ContentfulBrandLandingPage]! @link(from: "brands___NODE")
  slides: [ContentfulPromoOrPage] @link(from: "slides___NODE")
  overlapCards: [ContentfulPromoOrPage] @link(from: "overlapCards___NODE")
  sections: [ContentfulSection] @link(from: "sections___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
}

type ContentfulProductListerPage implements ContentfulPage & Node {
  id: ID!
  contentful_id: String!
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

type ContentfulPromo implements Node {
  name: String!
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

type ContentfulCategory implements Node {
  id: ID!
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

type ContentfulRichText implements Node {
  id: ID!
  raw: String!
  references: [ContentfulRichTextReference] @link(from: "references___NODE")
}

type ContentfulCalculatorRoofShape implements Node {
  id: ID!
  name: String!
  roofShapeId: String!
  media: ContentfulAsset! @link(by: "id", from: "media___NODE")
}

type ContentfulWebToolCalculator implements Node {
  id: ID!
  roofShapes: [ContentfulCalculatorRoofShape!]! @link(from: "roofShapes___NODE")
  hubSpotFormId: String
  needHelpSection: ContentfulTitleWithContent! @link(from: "needHelpSection___NODE")
}

type ContentfulVisualiserHouseType implements Node {
  id: ID!
  name: String!
  previewImage: ContentfulAsset! @link(by: "id", from: "previewImage___NODE")
  houseModel: ContentfulAsset! @link(by: "id", from: "houseModel___NODE")
}

type ContentfulCardCollectionSection implements Node {
  id: ID!
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

type ContentfulCarouselSection implements Node {
  id: ID!
  title: String
  description: ContentfulRichText
  variant: String!
  slides: [ContentfulPromoOrPage] @link(from: "slides___NODE")
  link: ContentfulLink @link(from: "link___NODE")
}

type ContentfulFormSection implements Node {
  id: ID!
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

type ContentfulSampleBasketSection implements Node {
  id: ID!
  title: String
  description: ContentfulRichText
  checkoutFormSection: ContentfulFormSection @link(from: "checkoutFormSection___NODE")
  emptyBasketMessage: ContentfulRichText
  browseProductsCTALabel: String
  browseProductsCTA: LinkedPage @link(from: "browseProductsCTA___NODE")
}

type ContentfulShareWidgetSection implements Node {
  id: ID!
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

type ContentfulLeadBlockSection implements Node {
  title: String
  text: ContentfulRichText
  link: ContentfulLink @link(from: "link___NODE")
  postItCard: ContentfulRichText
}

type ContentfulSyndicateSection implements Node {
  id: ID!
  title: String
  villains: [ContentfulPromoOrPage] @link(from: "villains___NODE")
  isReversed: Boolean
}

type contentfulTabsOrAccordionSectionDescriptionTextNode implements Node {
  description: String
}

type ContentfulTabsOrAccordionSection implements Node {
  title: String
  description: contentfulTabsOrAccordionSectionDescriptionTextNode @link(from: "description___NODE")
  items: [ContentfulTitleWithContent] @link(from: "items___NODE")
  type: String
}

type ContentfulMediaGallerySection implements Node {
  id: ID!
  title: String
  longDescription: ContentfulRichText
  medias: [ContentfulMediasTypes!]! @link(from: "medias___NODE")
}

type ContentfulDocumentDownloadSection implements Node {
  title: String
  description: ContentfulRichText
  documents: [ContentfulDocument!]! @link(from: "documents___NODE")
}

type ContentfulServiceLocatorSection implements Node {
  type: String
  showDefaultResultList: Boolean
  title: String
  label: String
  body: ContentfulRichText
  services: [ContentfulService] @link(from: "services___NODE")
  centre: Location
  zoom: Int
}

type ContentfulVideoSection implements Node {
  name: String!
  title: String
  description: ContentfulRichText
  video: ContentfulVideo @link(from: "video___NODE")
}

union ContentfulNavigationEntity =
  ContentfulNavigation
  | ContentfulNavigationItem
  | ContentfulLink

type ContentfulNavigation implements Node {
  id: ID!
  title: String
  label: String
  links: [ContentfulNavigationEntity] @link(from: "links___NODE")
  link: ContentfulLink @link(from: "link___NODE")
  promos: [ContentfulPromoOrPage] @link(from: "promos___NODE")
}

type ContentfulNavigationItem implements Node {
  id: ID!
  title: String
  type: String
  value: String
}

# TODO: This is temp as it won't be necessary after Syndicate is in
type ContentfulVillainSection implements Node {
  id: ID!
  title: String
  description: String
  promo: ContentfulPromo @link(from: "promo___NODE")
}
#############

type ContentfulTitleWithContent implements Node {
  id: ID!
  name: String!
  title: String
  content: ContentfulRichText!
}

type ContentfulSpecificationNotesWithCta implements Node {
  id: ID!
  name: String!
  title: String
  description: ContentfulRichText!
  cta: ContentfulLink @link(from: "cta___NODE")
}

type ContentfulTeamMember implements Node {
  id: ID!
  name: String!
  profileImage: ContentfulImage @link(from: "profileImage___NODE")
  jobTitle: String
  links: [ContentfulLink] @link(from: "links___NODE")
}

type ContentfulTeamCategory implements Node {
  id: ID!
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
  | ContentfulSystemConfiguratorBlock
  | ContentfulTeamSection
  | ContentfulSampleBasketSection
  | ContentfulSignupBlock
  | ContentfulLeadBlockSection

type ContentfulMicroCopy implements Node {
  key: String!
  value: String!
}

type ContentfulResources implements Node {
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

type ContentfulContactTopic implements Node {
  id: ID!
  icon: String
  title: String
  bodyTitle: String
  bodyList: [ContentfulTitleWithContent] @link(from: "bodyList___NODE")
  footerTitle: String
  footerList: [ContentfulContactDetailsOrTitleWithContent] @link(from: "footerList___NODE")
}

type contentfulSignupBlockDescriptionTextNode implements Node {
  description: String
}

type ContentfulSignupBlock implements Node {
  id: ID!
  title: String
  description: contentfulSignupBlockDescriptionTextNode @link(from: "description___NODE")
  signupLabel: String
  signupDialogContent: ContentfulFormSection @link(from: "signupDialogContent___NODE")
}

type ContentfulSite implements Node {
  node_locale: String!
  countryCode: String!
  menuUtilities: ContentfulNavigation @link(from: "menuUtilities___NODE")
  menuNavigation: ContentfulNavigation! @link(from: "menuNavigation___NODE")
  homePage: ContentfulHomePage! @link(from: "homePage___NODE")
  pages: [ContentfulPage] @link(from: "pages___NODE")
  footerMainNavigation: ContentfulNavigation @link(from: "footerMainNavigation___NODE")
  footerSecondaryNavigation: ContentfulNavigation @link(from: "footerSecondaryNavigation___NODE")
  resources: ContentfulResources @link(from: "resources___NODE")
  headScripts: contentfulSiteHeadScriptsTextNode @link(from: "headScripts___NODE")
  regions: [RegionJson]! @link(from: "regions___NODE")
  pitchedRoofCalculatorConfig: ContentfulWebToolCalculator @link(from: "pitchedRoofCalculatorConfig___NODE")
  visualiserHouseTypes: [ContentfulVisualiserHouseType!] @link(from: "visualiserHouseTypes___NODE")
}

type contentfulSiteHeadScriptsTextNode implements Node {
  headScripts: String
}

union LinkedPage =
  ContentfulContactUsPage
  | ContentfulSimplePage
  | ContentfulProductListerPage
  | ContentfulDocumentLibraryPage
  | ContentfulHomePage
  | ContentfulBrandLandingPage

type ContentfulLink implements Node {
  id: ID!
  label: String
  icon: String
  isLabelHidden: Boolean
  url: String
  linkedPage: LinkedPage @link(from: "linkedPage___NODE")
  asset: ContentfulAsset @link(by: "id", from: "asset___NODE")
  type: String
  parameters: contentfulLinkParametersJsonNode @link(by: "id", from: "parameters___NODE")
  queryParams: String
  dialogContent: ContentfulSection @link(from: "dialogContent___NODE")
  hubSpotCTAID: String
}

type contentfulLinkParametersJsonNode implements Node @dontInfer {
  id: ID!
  tileId: Int
  colourId: Int
  sidingId: Int
  viewMode: String
}

type ContentfulLinkColumnsSection implements Node {
  title: String
  columns: [ContentfulNavigation] @link(from: "columns___NODE")
}

type ContentfulTeamSection implements Node {
  title: String
  teamCategories: [ContentfulTeamCategory] @link(from: "teamCategories___NODE")
  backgroundColor: String
}

type ContentfulAssetType implements Node {
  id: ID!
  name: String!
  code: String!
  description: ContentfulRichText
  pimCode: String
}

type ContentfulDocument implements Node {
  id: ID!
  title: String!
  asset: ContentfulAsset! @link(by: "id", from: "asset___NODE")
  description: ContentfulRichText
  assetType: ContentfulAssetType! @link(from: "assetType___NODE")
  brand: String
  featuredMedia: ContentfulImage @link(by: "id", from: "featuredMedia___NODE")
  noIndex: Boolean
}

union Document = ContentfulDocument | PIMDocument

type ContentfulDocumentLibraryPage implements ContentfulPage & Node {
  id: ID!
  contentful_id: String!
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
  assetTypes: [ContentfulAssetType] @link(from: "assetTypes___NODE")
  resultsType: String
  signupBlock: ContentfulSignupBlock @link(from: "signupBlock___NODE")
  tags: [ContentfulCategory] @link(from: "tags___NODE")
  documentsFilters: DocumentsFiltersResponse!
  pimCodes: [String]
  allowFilterBy: [String!]
  parentPage: LinkedPage @link(from: "parentPage___NODE")
  seo: ContentfulSeoContent @link(from: "seo___NODE")
}

type System implements Node {
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

type BIM {
  name: String!
  url: String!
}

type PIMSystemDocument {
  title: String!
  url: String!
  isLinkDocument: Boolean!
  assetType: ContentfulAssetType! @link(by: "pimCode", from: "assetType")
  realFileName: String
  fileSize: Int
  format: String
  id: ID!
}

type KeyFeatures {
  name: String!
  values: [String]!
}

type PIMAsset {
  allowedToDownload: Boolean
  assetType: ContentfulAssetType @link(by: "pimCode", from: "assetType")
  fileSize: Int
  format: String
  mime: String
  name: String
  realFileName: String
  url: String
}

type SystemLayer {
  layerNumber: String!
  name: String!
  relatedProducts: [Product]! @link(from: "products___NODE")
  relatedOptionalProducts: [Product]! @link(from: "products___NODE")
  shortDescription: String
  type: String
}

type PimSystemReference {
  referenceType: String
  target: PimSystemReferenceTarget
}

type PimSystemReferenceTarget {
  code: String!
}

type SystemProduct {
  code: String!
  name: String
  path: String!
}

type SystemImage {
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

type KeyAssetDocument {
  assetType: String
  documents: [PIMDocument]
}

type CategoryGroup {
  label: String!
  code: String!
}

type PIMDocumentWithPseudoZip {
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

type ProductDocument {
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
  # TODO: remove when document filtering is done with Elastic search
  productCategories: [ProductDocumentCategory]!
}

type ProductDocumentCategory {
  code: String!
  parentCategoryCode: String!
}

type Path {
  id: String
  path: String
  label: String
  queryParams: String
  slug: String
}

type Brand {
  code: String!
  name: String!
  logo: String
}

type Category {
  categoryType: String!
  code: String!
  image: PIMAsset
  name: String!
  parentCategoryCode: String
}

type Classification {
  name: String!
  features: [Feature]
}

type Feature {
  name: String!
  value: String!
}

type DocumentsFiltersResponse {
  filters: [PLPFilter]!
} 


type PIMDocument {
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

type PIMDocumentProductCategories {
  code: String!
  parentCategoryCode: String
}

type PIMImage {
  mainSource: String
  thumbnail: String
  altText: String
}

type Measurements {
  length: UnitValue
  width: UnitValue
  height: UnitValue
  thickness: UnitValue
  volume: UnitValue
  label: String
}

type UnitValue {
  value: String!
  unit: String!
}

type RelatedVariant {
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

type PimVideo {
  title: String!
  label: String!
  subtitle: String # Always null
  previewMedia: String # Always null
  videoRatio: String # Always null
  videoUrl: String
}

type Weight {
  grossWeight: UnitValue
  netWeight: UnitValue
  weightPerPallet: UnitValue
  weightPerPiece: UnitValue
  weightPerSqm: UnitValue
}

type ContentfulContactDetails implements Node {
  title: String
  address: String
  phoneNumber: String
  email: String
  otherInformation: ContentfulRichText
}

type contentfulBrandLandingPageDescriptionTextNode implements Node {
  description: String
}

type ContentfulBrandLandingPage implements ContentfulPage & Node {
  id: ID!
  contentful_id: String!
  title: String
  cta: ContentfulLink @link(from: "cta___NODE")
  slug: String!
  path: String!
  breadcrumbs: [BreadcrumbItem]
  breadcrumbTitle: String
  subtitle: String
  description: contentfulBrandLandingPageDescriptionTextNode @link(from: "description___NODE")
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

type ContentfulBrand implements Node {
  title: String!
  brandLogo: String!
  subtitle: String
  path: String
}

type contentfulTableDataJsonNode implements Node {
  tableData: [[String]]
}

type ContentfulTable implements Node {
  contentful_id: String!
  data: contentfulTableDataJsonNode @link(by: "id", from: "data___NODE")
}

type ContentfulServiceType implements Node {
  name: String!
}

type ContentfulService implements Node {
  id: ID!
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

type ContentfulSeoContent implements Node {
  id: ID!
  metaTitle: String
  metaDescription: String
  noIndex: Boolean
}

type VideoRatio {
  width: Int!
  height: Int!
}

type ContentfulVideo implements Node {
  id: ID!
  title: String!
  label: String!
  subtitle: String
  youtubeId: String!
  previewMedia: ContentfulImage @link(by: "id", from: "previewMedia___NODE")
  videoRatio: VideoRatio
}

type contentfulImageCaptionTextNode implements Node {
  caption: String
}

type FocalPoint {
  x: Int
  y: Int
}

type ContentfulImage implements Node {
  id: ID!
  type: String
  altText: String
  image: ContentfulAsset! @link(by: "id", from: "image___NODE")
  caption: contentfulImageCaptionTextNode @link(by: "id", from: "caption___NODE")
  focalPoint: FocalPoint
  thumbnail: ContentfulAsset
}

type ContentfulIframe implements Node {
  id: ID!
  name: String!
  title: String
  summary: ContentfulRichText
  url: String!
  height: String!
}

type CountryJSON {
  code: String!
  label: String!
  icon: String
}

type RegionJson implements Node @dontInfer {
  label: String!
  menu: [CountryJSON]!
}

union NextStep = ContentfulSystemConfiguratorBlock | ContentfulTitleWithContent

type ContentfulSystemConfiguratorBlock implements Node {
  id: ID!
  node_locale: String!
  label: String
  title: String
  description: ContentfulRichText
  type: String
  question: ContentfulSystemConfiguratorBlock @link(from: "question___NODE")
  answers: [ContentfulSystemConfiguratorBlock] @link(from: "answers___NODE")
  noResultItems: [ContentfulTitleWithContent] @link(from: "noResultItems___NODE")
  recommendedSystems: [String!]
  nextStep: NextStep @link(from: "nextStep___NODE")
}
`;
