import React from "react";
import { graphql } from "gatsby";
import Page from "../components/Page";
import { Data as SiteData } from "../components/Site";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../components/ShareWidgetSection";
import LeadBlockSection from "./system-details/LeadBlockSection";
import ImageGallerySection from "./system-details/image-gallery-section";
import { SystemDetails } from "./system-details/types";

type Props = {
  pageContext: {
    systemPageId: string;
    siteId: string;
  };
  data: {
    contentfulSite: SiteData;
    dataJson: SystemDetails;
    shareWidget: ShareWidgetSectionData | null;
  };
};

const SystemDetailsPage = ({ data }: Props) => {
  const { contentfulSite, dataJson } = data;
  const { resources } = contentfulSite;
  const { name, categories, classifications, images } = dataJson;

  return (
    <Page
      title="System Details Page Demo"
      pageData={{ breadcrumbs: null, inputBanner: null, seo: null }}
      siteData={contentfulSite}
    >
      {resources?.sdpShareWidget && (
        <ShareWidgetSection data={resources.sdpShareWidget} />
      )}
      <LeadBlockSection
        name={name}
        categories={categories}
        classifications={classifications}
      />
      <ImageGallerySection images={images} />
    </Page>
  );
};

export default SystemDetailsPage;

export const pageQuery = graphql`
  query SystemDetailsPage($siteId: String!, $systemPageId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    dataJson(id: { eq: $systemPageId }) {
      name
      shortDescription
      longDescription
      categories {
        categoryType
        name
        image {
          url
          name
          mime
          fileSize
          containerId
          assetType
          altText
          allowedToDownload
          realFileName
        }
      }
      classifications {
        code
        features {
          code
          featureValues {
            value
          }
        }
      }
      images {
        assetType
        fileSize
        mime
        name
        realFileName
        url
        format
        containerId
      }
    }
  }
`;
