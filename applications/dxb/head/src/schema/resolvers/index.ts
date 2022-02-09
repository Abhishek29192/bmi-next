import ContentfulDocumentLibraryPage from "./ContentfulDocumentLibraryPage";
import ContentfulPage from "./ContentfulPage";
import ContentfulHomePage from "./ContentfulHomePage";
import ContentfulServiceLocatorSection from "./ContentfulServiceLocatorSection";
import ContentfulSite from "./ContentfulSite";
import ContentfulSystemConfiguratorBlock from "./ContentfulSystemConfiguratorBlock";
import ContentfulVideo from "./ContentfulVideo";
import ContentfulFormSection from "./ContentfulFormSection";
import Products from "./Products";
import ContentfulLink from "./ContentfulLink";
import ContentfulImage from "./ContentfulImage";
import Query from "./Query";
import Systems from "./Systems";

const {
  ContentfulDocumentLibraryPage: ContentfulDocumentLibraryPageCommon,
  ContentfulSimplePage,
  ContentfulContactUsPage,
  ContentfulProductListerPage,
  ContentfulBrandLandingPage
} = ContentfulPage;

/**
 * These resolvers need to be exported at the level of the parent type. For
 * example, to have a resolver for System.SystemLayer.Field, it has to be
 * exported for SystemLayer.
 */
export default {
  ContentfulDocumentLibraryPage: {
    ...ContentfulDocumentLibraryPage,
    ...ContentfulDocumentLibraryPageCommon
  },
  ContentfulSimplePage,
  ContentfulContactUsPage,
  ContentfulProductListerPage,
  ContentfulBrandLandingPage,
  ContentfulServiceLocatorSection,
  ContentfulSite,
  ContentfulSystemConfiguratorBlock,
  ContentfulHomePage,
  ContentfulVideo,
  ContentfulFormSection,
  Products,
  ContentfulLink,
  ContentfulImage,
  Query,
  Systems: { path: Systems.path },
  SystemLayer: {
    relatedProducts: Systems.relatedProducts,
    relatedOptionalProducts: Systems.relatedOptionalProducts
  }
};
