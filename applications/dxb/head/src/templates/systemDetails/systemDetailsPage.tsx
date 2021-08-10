import React, { useContext } from "react";
import { graphql } from "gatsby";
import Tabs from "@bmi/tabs";
import { Tab, TabProps } from "@material-ui/core";
import Section from "@bmi/section";
import Page from "../../components/Page";
import { Data as SiteData, SiteContext } from "../../components/Site";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../../components/ShareWidgetSection";
import withGTM from "../../utils/google-tag-manager";
import LeadBlockSection from "./leadBlockSection";
import ImageGallerySection from "./imageGallerySection";
import { SystemDetails } from "./types";
import AboutLeadBlock from "./aboutLeadBlock";

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

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

const SystemDetailsPage = ({ data }: Props) => {
  const { getMicroCopy } = useContext(SiteContext);
  const { contentfulSite, dataJson } = data;
  const { resources } = contentfulSite;
  const { name, categories, classifications, images, assets, longDescription } =
    dataJson;

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
      <Section backgroundColor="white">
        <Tabs
          initialValue="one"
          tabComponent={(props: TabProps) => (
            <GTMTab
              gtm={{ id: "selector-tabs1", action: "Selector – Tabs" }}
              {...props}
            />
          )}
        >
          <Tabs.TabPanel
            heading={getMicroCopy("sdp.leadBlock.about")}
            index="one"
          >
            <AboutLeadBlock
              longDescription={longDescription}
              guaranteesAndWarranties={assets.filter(
                ({ assetType }) =>
                  assetType === "GUARANTIES" || assetType === "WARRANTIES"
              )}
              awardsAndCertificates={assets.filter(
                ({ assetType }) =>
                  assetType === "AWARDS" || assetType === "CERTIFICATES"
              )}
            />
          </Tabs.TabPanel>
        </Tabs>
      </Section>
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
