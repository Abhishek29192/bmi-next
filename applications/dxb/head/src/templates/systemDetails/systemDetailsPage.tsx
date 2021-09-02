import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { compact, first } from "lodash";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import Page from "../../components/Page";
import { Data as SiteData } from "../../components/Site";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../../components/ShareWidgetSection";
import { getBimIframeUrl } from "../../components/BimIframe";
import { Data as TitleWithContentData } from "../../components/TitleWithContent";
import LeadBlockSection from "./leadBlockSection";
import ImageGallerySection from "./imageGallerySection";
import {
  SystemDetails,
  Assets,
  Feature,
  Classification,
  DocumentData
} from "./types";
import TabLeadBlock from "./tabLeadBlock";
import SystemLayersSection from "./systemLayersSection";
import styles from "./styles/systemDetailsPage.module.scss";
import { BimContent } from "./tabLeadBlock";

type Props = {
  pageContext: {
    systemPageId: string;
    siteId: string;
  };
  data: {
    contentfulSite: SiteData;
    dataJson: SystemDetails;
    shareWidget: ShareWidgetSectionData | null;
    allContentfulAssetType: {
      nodes: ReadonlyArray<{
        name: string;
        pimCode: string;
      }>;
    };
  };
};

const IGNORED_ATTRIBUTES = [
  "scoringweight",
  "uniquesellingpropositions",
  "promotionalcontent",
  "keyfeatures"
];

export const IGNORED_DOCUMENTS_ASSETS = [
  "BIM",
  "CERTIFICATES",
  "AWARDS",
  "GUARANTIES",
  "WARRANTIES"
];

const SystemDetailsPage = ({ data }: Props) => {
  const { contentfulSite, dataJson, allContentfulAssetType } = data;
  const { resources } = contentfulSite;
  const {
    name,
    categories,
    classifications,
    images,
    longDescription,
    assets,
    systemBenefits,
    systemLayers
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
  const keyFeatures: Feature = useMemo(() => {
    return first(
      compact(
        classifications.map(({ features }) => {
          return (
            features &&
            features.find(({ code }) => code.includes("keyfeatures"))
          );
        })
      )
    );
  }, []);
  const specification: Assets = useMemo(() => {
    return assets.find(({ assetType }) => assetType === "SPECIFICATION");
  }, []);
  const technicalSpecClassifications: Classification[] = useMemo(() => {
    return classifications
      .filter(
        ({ code }) =>
          !IGNORED_ATTRIBUTES.some((attribute) =>
            code.toLowerCase().includes(attribute)
          )
      )
      .map((classification) => {
        const filteredClassification = Object.assign({}, classification);
        filteredClassification.features = filteredClassification.features
          .filter(({ code }) => {
            return !IGNORED_ATTRIBUTES.some((att) => {
              return code.toLowerCase().includes(att);
            });
          })
          .sort((a, b) => (a.name < b.name ? -1 : 1));
        return filteredClassification;
      })
      .filter(({ features }) => features.length > 0)
      .sort((a, b) => (a.name < b.name ? -1 : 1));
  }, []);
  const uniqueSellingPropositions: Feature = useMemo(() => {
    return first(
      compact(
        classifications.map(({ features }) => {
          return (
            features &&
            features.find(({ code }) =>
              code.toLocaleLowerCase().includes("uniquesellingpropositions")
            )
          );
        })
      )
    );
  }, []);
  const brandName = useMemo(
    () =>
      (categories || []).find(({ categoryType }) => {
        return categoryType === "Brand";
      }).name,
    [categories]
  );
  const aboutLeadBlockGenericContent: TitleWithContentData =
    resources?.sdpSidebarItems?.length > 0 && resources?.sdpSidebarItems[0];
  const bimContent: BimContent = useMemo(() => {
    return {
      title: assets.find(({ assetType }) => assetType === "BIM")?.name,
      description: resources?.sdpBimDescription,
      bimIframeUrl
    };
  }, []);
  const documentsAndDownloads: DocumentData[] = useMemo(() => {
    return assets
      .filter(
        ({ assetType, allowedToDownload }) =>
          !IGNORED_DOCUMENTS_ASSETS.includes(assetType) && allowedToDownload
      )
      .map((asset, index) => {
        const assetTypeDisplayName = allContentfulAssetType.nodes.find(
          ({ pimCode }) => pimCode === asset.assetType
        )?.name;
        return Object.assign(
          {},
          {
            __typename: "SDPDocument",
            id: index.toString(),
            assetTypeDisplayName,
            ...asset
          }
        ) as DocumentData;
      });
  }, []);

  return (
    <Page
      brand={brandName}
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
        uniqueSellingPropositions={uniqueSellingPropositions}
      />

      <Section
        backgroundColor="pearl"
        className={styles["imageGallery-systemLayers-section"]}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={8}>
            <ImageGallerySection images={images || []} />
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            <SystemLayersSection systemLayers={systemLayers || []} />
          </Grid>
        </Grid>
      </Section>

      <TabLeadBlock
        longDescription={longDescription}
        guaranteesAndWarranties={guaranteesAndWarranties}
        awardsAndCertificates={awardsAndCertificates}
        keyFeatures={keyFeatures}
        systemBenefits={systemBenefits}
        specification={specification}
        technicalSpecClassifications={technicalSpecClassifications}
        aboutLeadBlockGenericContent={aboutLeadBlockGenericContent}
        bimContent={bimContent}
        documentsAndDownloads={documentsAndDownloads}
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
    allContentfulAssetType {
      nodes {
        name
        pimCode
      }
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
          featureUnit {
            symbol
          }
        }
        name
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
      systemLayers {
        layerNumber
        type
        name
        shortDescription
        relatedProducts {
          name
          variantOptions {
            path
          }
        }
        relatedOptionalProducts {
          name
          code
          variantOptions {
            path
          }
        }
      }
    }
  }
`;
