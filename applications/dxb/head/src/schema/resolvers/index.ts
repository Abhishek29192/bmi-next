import ContentfulDocumentLibraryPage from "./ContentfulDocumentLibraryPage";
import ContentfulFormSection from "./ContentfulFormSection";
import ContentfulHomePage from "./ContentfulHomePage";
import ContentfulImage from "./ContentfulImage";
import ContentfulLink from "./ContentfulLink";
import ContentfulPage from "./ContentfulPage";
import ContentfulServiceLocatorSection from "./ContentfulServiceLocatorSection";
import ContentfulSite from "./ContentfulSite";
import ContentfulSystemConfiguratorSection from "./ContentfulSystemConfiguratorSection";
import ContentfulVideo from "./ContentfulVideo";
import Product from "./Product";
import Query from "./Query";
import System from "./System";

const {
  ContentfulBrandLandingPage,
  ContentfulContactUsPage,
  ContentfulDocumentLibraryPage: ContentfulDocumentLibraryPageCommon,
  ContentfulProductListerPage,
  ContentfulSimplePage
} = ContentfulPage;

/**
 * These resolvers need to be exported at the level of the parent type. For
 * example, to have a resolver for System.SystemLayer.Field, it has to be
 * exported for SystemLayer.
 */
export default {
  ContentfulBrandLandingPage,
  ContentfulContactUsPage,
  ContentfulDocumentLibraryPage: {
    ...ContentfulDocumentLibraryPage,
    ...ContentfulDocumentLibraryPageCommon
  },
  ContentfulFormSection,
  ContentfulHomePage,
  ContentfulProductListerPage,
  ContentfulServiceLocatorSection,
  ContentfulSimplePage,
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
    relatedSystems: System.relatedSystems
  },
  SystemLayer: {
    relatedProducts: System.relatedProducts,
    relatedOptionalProducts: System.relatedOptionalProducts
  }
};
