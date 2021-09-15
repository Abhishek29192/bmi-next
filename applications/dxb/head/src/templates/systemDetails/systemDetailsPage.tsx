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
import RelatedSystems from "../../components/RelatedSystems";
import LeadBlockSection from "./leadBlockSection";
import ImageGallerySection from "./imageGallerySection";
import { SystemDetails, Assets, Feature, Classification } from "./types";
import TabLeadBlock from "./tabLeadBlock";
import SystemLayersSection from "./systemLayersSection";
import styles from "./styles/systemDetailsPage.module.scss";
import { BimContent } from "./tabLeadBlock";

type Props = {
  pageContext: {
    systemPageId: string;
    siteId: string;
    countryCode?: string;
    relatedSystemCodes?: ReadonlyArray<string>;
  };
  data: {
    contentfulSite: SiteData;
    dataJson: SystemDetails;
    relatedSystems?: {
      nodes: ReadonlyArray<SystemDetails>;
    };
    shareWidget: ShareWidgetSectionData | null;
  };
};

const IGNORED_ATTRIBUTES = [
  "scoringweight",
  "uniquesellingpropositions",
  "promotionalcontent",
  "keyfeatures"
];

const SystemDetailsPage = ({ data }: Props) => {
  const { contentfulSite, dataJson, relatedSystems } = data;
  const { countryCode, resources } = contentfulSite;
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
      />
      {relatedSystems?.nodes && (
        <RelatedSystems
          systems={relatedSystems.nodes}
          countryCode={countryCode}
        />
      )}
    </Page>
  );
};

export default SystemDetailsPage;

export const systemsQuery = graphql`
  query SystemDetailsPage(
    $siteId: String!
    $systemPageId: String!
    $relatedSystemCodes: [String]
  ) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    dataJson(id: { eq: $systemPageId }) {
      name
      shortDescription
      longDescription
      systemBenefits
      systemReferences {
        preselected
        referenceType
        target {
          code
          name
        }
      }
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

    relatedSystems: allDataJson(filter: { code: { in: $relatedSystemCodes } }) {
      nodes {
        ...RelatedSystemsFragment
      }
    }
  }
`;
