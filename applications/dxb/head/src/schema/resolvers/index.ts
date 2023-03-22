import ContentfulDocumentLibraryPage from "./ContentfulDocumentLibraryPage";
import ContentfulFormSection from "./ContentfulFormSection";
import ContentfulHomePage from "./ContentfulHomePage";
import ContentfulImage from "./ContentfulImage";
import ContentfulLink from "./ContentfulLink";
import ContentfulPage from "./ContentfulPage";
import ContentfulPromo from "./ContentfulPromo";
import ContentfulServiceLocatorSection from "./ContentfulServiceLocatorSection";
import ContentfulSimplePage from "./ContentfulSimplePage";
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
  ContentfulSimplePage: ContentfulSimplePageCommon
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
  ContentfulPromo,
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
  }
};
