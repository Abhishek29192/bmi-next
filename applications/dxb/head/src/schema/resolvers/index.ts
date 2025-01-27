import ContentfulDocumentDownloadSection from "./ContentfulDocumentDownloadSection";
import ContentfulDocumentLibraryPage from "./ContentfulDocumentLibraryPage";
import ContentfulFormSection from "./ContentfulFormSection";
import ContentfulImage from "./ContentfulImage";
import ContentfulLink from "./ContentfulLink";
import ContentfulPage from "./ContentfulPage";
import ContentfulServiceLocatorSection from "./ContentfulServiceLocatorSection";
import ContentfulSimplePage from "./ContentfulSimplePage";
import ContentfulSite from "./ContentfulSite";
import ContentfulSystemConfiguratorSection from "./ContentfulSystemConfiguratorSection";
import ContentfulTrainingListerPage from "./ContentfulTrainingListerPage";
import ContentfulVideo from "./ContentfulVideo";
import Product from "./Product";
import Query from "./Query";
import System from "./System";
import TrainingDetailsPage from "./TrainingDetailsPage";

const {
  ContentfulBrandLandingPage,
  ContentfulContactUsPage,
  ContentfulDocumentLibraryPage: ContentfulDocumentLibraryPageCommon,
  ContentfulProductListerPage,
  ContentfulSimplePage: ContentfulSimplePageCommon,
  ContentfulCookiePolicyPage,
  ContentfulTrainingListerPage: ContentfulTrainingListerPageCommon,
  ContentfulTrainingRegistrationPage,
  ContentfulAccountPage
} = ContentfulPage;

/**
 * These resolvers need to be exported at the level of the parent type. For
 * example, to have a resolver for System.SystemLayer.Field, it has to be
 * exported for SystemLayer.
 */
export default {
  ContentfulAccountPage,
  ContentfulBrandLandingPage,
  ContentfulContactUsPage,
  ContentfulDocumentDownloadSection,
  ContentfulDocumentLibraryPage: {
    ...ContentfulDocumentLibraryPage,
    ...ContentfulDocumentLibraryPageCommon
  },
  ContentfulFormSection,
  ContentfulProductListerPage,
  ContentfulServiceLocatorSection,
  ContentfulSimplePage: {
    ...ContentfulSimplePage,
    ...ContentfulSimplePageCommon
  },
  ContentfulSite,
  ContentfulSystemConfiguratorSection,
  ContentfulVideo,
  Product,
  RelatedVariant: {
    path: Product.path
  },
  ContentfulLink,
  ContentfulImage,
  Query,
  System: {
    documents: System.documents,
    relatedSystems: System.relatedSystems,
    videos: System.videos
  },
  SystemLayer: {
    relatedProducts: System.relatedProducts,
    relatedOptionalProducts: System.relatedOptionalProducts
  },
  ContentfulCookiePolicyPage,
  ContentfulTrainingListerPage: {
    ...ContentfulTrainingListerPage,
    ...ContentfulTrainingListerPageCommon
  },
  DoceboCourses: TrainingDetailsPage,
  ContentfulTrainingRegistrationPage
};
