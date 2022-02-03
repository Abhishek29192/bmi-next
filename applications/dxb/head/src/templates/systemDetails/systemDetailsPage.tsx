import React, { useMemo } from "react";
import { graphql } from "gatsby";
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
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  System,
  Asset,
  Feature,
  Classification
} from "../../components/types/pim";
import { iconMap } from "../../components/Icon";
import LeadBlockSection from "./leadBlockSection";
import ImageGallerySection from "./imageGallerySection";
import { DocumentData } from "./types";
import TabLeadBlock, { BimContent } from "./tabLeadBlock";
import SystemLayersSection from "./systemLayersSection";
import styles from "./styles/systemDetailsPage.module.scss";

type Props = {
  pageContext: {
    systemPageId: string;
    siteId: string;
    countryCode?: string;
    relatedSystemCodes?: ReadonlyArray<string>;
  };
  data: {
    contentfulSite: SiteData;
    systems: System;
    relatedSystems?: {
      nodes: ReadonlyArray<System>;
    };
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

const SystemDetailsPage = ({ pageContext, data }: Props) => {
  const { contentfulSite, systems, relatedSystems, allContentfulAssetType } =
    data;
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
  } = systems;
  const bimIframeUrl = getBimIframeUrl(assets);
  const guaranteesAndWarranties: Asset[] = useMemo(() => {
    return (assets || []).filter(
      ({ assetType }) =>
        assetType === "GUARANTIES" || assetType === "WARRANTIES"
    );
  }, [assets]);
  const awardsAndCertificates: Asset[] = useMemo(() => {
    return (assets || []).filter(
      ({ assetType }) => assetType === "AWARDS" || assetType === "CERTIFICATES"
    );
  }, [assets]);
  const keyFeatures: Feature = useMemo(() => {
    return classifications
      ?.map(({ features }) => {
        return (
          features && features.find(({ code }) => code.includes("keyfeatures"))
        );
      })
      .filter(Boolean)
      .shift();
  }, [classifications]);
  const specification: Asset | undefined = useMemo(
    () => assets?.find(({ assetType }) => assetType === "SPECIFICATION"),
    [assets]
  );
  const technicalSpecClassifications: Classification[] = useMemo(() => {
    return (classifications || [])
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
  }, [classifications]);
  const uniqueSellingPropositions: Feature = useMemo(() => {
    return (classifications || [])
      .map(({ features }) => {
        return (
          features &&
          features.find(({ code }) =>
            code.toLocaleLowerCase().includes("uniquesellingpropositions")
          )
        );
      })
      .filter(Boolean)
      .shift();
  }, [classifications]);
  const brandName = useMemo(
    () =>
      (categories || []).find(({ categoryType }) => {
        return categoryType === "Brand";
      })?.name,
    [categories]
  );
  const aboutLeadBlockGenericContent: TitleWithContentData =
    resources?.sdpSidebarItems?.length > 0 && resources?.sdpSidebarItems[0];
  const bimContent: BimContent = useMemo(() => {
    return {
      title: assets?.find(({ assetType }) => assetType === "BIM")?.name,
      description: resources?.sdpBimDescription,
      bimIframeUrl
    };
  }, [assets, bimIframeUrl, resources?.sdpBimDescription]);
  const documentsAndDownloads: DocumentData[] = useMemo(() => {
    return (assets || [])
      .filter(
        ({ assetType, allowedToDownload }) =>
          !IGNORED_DOCUMENTS_ASSETS.includes(assetType) && allowedToDownload
      )
      .map(({ name, assetType, url, fileSize, realFileName, mime }, index) => {
        const contentfulAssetType = allContentfulAssetType.nodes.find(
          ({ pimCode }) => pimCode === assetType
        );
        return Object.assign(
          {},
          {
            __typename: "SDPDocument" as const,
            id: index.toString(),
            title: name,
            assetType: {
              pimCode: contentfulAssetType?.pimCode,
              name: contentfulAssetType?.name
            },
            asset: {
              file: {
                url,
                fileName: realFileName,
                contentType: mime,
                details: {
                  size: fileSize
                }
              }
            }
          }
        );
      });
  }, [assets, allContentfulAssetType.nodes]);

  const breadcrumbs = (
    <Section backgroundColor="pearl" isSlim>
      <Breadcrumbs
        data={[
          {
            id: pageContext.systemPageId,
            label: name,
            slug: null
          }
        ]}
      />
    </Section>
  );

  return (
    <Page
      brand={brandName}
      title={name}
      pageData={{ breadcrumbs: null, inputBanner: null, seo: null, path: null }}
      siteData={contentfulSite}
    >
      {breadcrumbs}
      {resources?.sdpShareWidget && (
        <ShareWidgetSection data={resources.sdpShareWidget} />
      )}
      <LeadBlockSection
        name={name}
        categories={categories}
        classifications={classifications}
        cta={resources?.sdpLeadBlockCta}
        uniqueSellingPropositions={uniqueSellingPropositions}
        // eslint-disable-next-line security/detect-object-injection
        brandLogo={iconMap[brandName]}
      />
      <Section
        backgroundColor="alabaster"
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
      {relatedSystems?.nodes && (
        <RelatedSystems
          systems={relatedSystems.nodes}
          countryCode={countryCode}
        />
      )}
      {breadcrumbs}
    </Page>
  );
};

export default SystemDetailsPage;

export const systemsQuery = graphql`
  query SystemDetailsPage(
    $siteId: String!
    $systemPageId: String!
    $relatedSystemCodes: [String]!
  ) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    allContentfulAssetType {
      nodes {
        name
        pimCode
      }
    }
    systems(id: { eq: $systemPageId }, approvalStatus: { eq: "approved" }) {
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
        approvalStatus
        products {
          name
          variantOptions {
            path
          }
        }
        optionalProducts {
          name
          code
          variantOptions {
            path
          }
        }
        relatedProducts {
          name
          variantOptions {
            path
          }
        }
        relatedOptionalProducts {
          name
          variantOptions {
            path
          }
        }
      }
    }

    relatedSystems: allSystems(
      filter: {
        approvalStatus: { eq: "approved" }
        code: { in: $relatedSystemCodes }
      }
    ) {
      nodes {
        ...RelatedSystemsFragment
      }
    }
  }
`;
