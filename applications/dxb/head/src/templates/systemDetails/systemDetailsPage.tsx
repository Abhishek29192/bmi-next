import React, { useMemo } from "react";
import { graphql } from "gatsby";
import Page from "../../components/Page";
import { Data as SiteData } from "../../components/Site";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../../components/ShareWidgetSection";

import { getBimIframeUrl } from "../../components/BimIframe";
import LeadBlockSection from "./leadBlockSection";
import ImageGallerySection from "./imageGallerySection";
import { SystemDetails, Assets, Classification, Feature } from "./types";
import TabLeadBlock from "./tabLeadBlock";

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
  const {
    name,
    categories,
    classifications,
    images,
    longDescription,
    assets,
    systemBenefits
  } = dataJson;
  const bimIframeUrl = getBimIframeUrl(assets);
  const guaranteesAndWarranties: Assets[] = useMemo(() => {
    return assets.filter(
      ({ assetType }) =>
        assetType === "GUARANTIES" || assetType === "WARRANTIES"
    );
  }, []);
  const awardsAndCertificates: Assets[] = useMemo(() => {
    return assets.filter(
      ({ assetType }) => assetType === "AWARDS" || assetType === "CERTIFICATES"
    );
  }, []);
  const systemAttributes: Classification = useMemo(() => {
    return classifications.find(({ code }) => code === "systemAttributes");
  }, []);
  const keyFeatures: Feature = useMemo(() => {
    const { features } = systemAttributes;
    return features.find(
      ({ code }) =>
        code ===
        "bmiSystemsClassificationCatalog/1.0/systemAttributes.keyfeatures"
    );
  }, []);
  const specification: Assets = useMemo(() => {
    return assets.find(({ assetType }) => assetType === "SPECIFICATION");
  }, []);

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
        cta={resources?.sdpLeadBlockCta}
      />

      <ImageGallerySection images={images || []} />

      <TabLeadBlock
        longDescription={longDescription}
        guaranteesAndWarranties={guaranteesAndWarranties}
        awardsAndCertificates={awardsAndCertificates}
        bimIframeUrl={bimIframeUrl}
        keyFeatures={keyFeatures}
        systemBenefits={systemBenefits}
        specification={specification}
      />
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
      systemBenefits
      assets {
        allowedToDownload
        assetType
        fileSize
        mime
        name
        realFileName
        url
      }
      categories {
        categoryType
        name
        image {
          url
          name
          mime
          fileSize
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
          name
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
