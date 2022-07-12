import { Grid, MediaGallery, Section, Thumbnail } from "@bmi/components";
import { ThumbnailProps } from "@bmi/components/src";
import { graphql } from "gatsby";
import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { iconMap } from "../../components/Icon";
import Page from "../../components/Page";
import RelatedSystems from "../../components/RelatedSystems";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../../components/ShareWidgetSection";
import { Data as SiteData } from "../../components/Site";
import { System } from "../../types/pim";
import withGTM from "../../utils/google-tag-manager";
import { transformMediaSrc } from "../../utils/media";
import { transformImages } from "../../utils/product-details-transforms";
import LeadBlockSection from "./leadBlockSection";
import styles from "./styles/systemDetailsPage.module.scss";
import SystemLayersSection from "./systemLayersSection";
import TabLeadBlock from "./tabLeadBlock";

type Props = {
  pageContext: {
    systemCode: string;
    siteId: string;
    countryCode?: string;
    relatedSystemCodes?: readonly string[];
  };
  data: {
    contentfulSite: SiteData;
    system: System;
    shareWidget: ShareWidgetSectionData | null;
    allContentfulAssetType: {
      nodes: readonly {
        name: string;
        pimCode: string;
      }[];
    };
  };
};

const SystemDetailsPage = ({ pageContext, data }: Props) => {
  const { contentfulSite, system } = data;
  const { countryCode, resources } = contentfulSite;

  const breadcrumbs = (
    <Section backgroundColor="pearl" isSlim>
      <Breadcrumbs
        data={[
          {
            id: pageContext.systemCode,
            label: system.name,
            slug: null
          }
        ]}
      />
    </Section>
  );

  const media = [
    ...transformImages(system.images),
    //TODO: check if it doesnt work on system detals page!!!
    ...transformMediaSrc(
      system.videos.map((video) => {
        return {
          __typename: "PimVideo",
          previewMedia: video.previewMedia,
          videoRatio: video.videoRatio,
          title: video.title,
          label: video.label,
          subtitle: video.subtitle,
          videoUrl: video.youtubeId
        };
      })
    )
  ];

  const GTMThumbnail = withGTM<ThumbnailProps>(Thumbnail, {
    label: "media",
    action: "media"
  });
  return (
    <Page
      brand={system.brand?.code}
      title={system.name}
      pageData={{ breadcrumbs: null, signupBlock: null, seo: null, path: null }}
      siteData={contentfulSite}
    >
      {breadcrumbs}
      {resources?.sdpShareWidget && (
        <ShareWidgetSection data={resources.sdpShareWidget} />
      )}
      <LeadBlockSection
        name={system.name}
        cta={resources?.sdpLeadBlockCta}
        promotionalContent={system.promotionalContent}
        uniqueSellingPropositions={system.uniqueSellingPropositions}
        // eslint-disable-next-line security/detect-object-injection
        brandLogo={iconMap[system.brand?.code]}
      />
      <Section
        backgroundColor="alabaster"
        className={styles["imageGallery-systemLayers-section"]}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={8}>
            <MediaGallery
              className={styles["gallery"]}
              media={media}
              layout="short"
              thumbnailComponent={(props: ThumbnailProps) => (
                <GTMThumbnail gtm={{ id: "media-gallery1" }} {...props} />
              )}
            />
          </Grid>
          {system && system.systemLayers && system.systemLayers.length > 0 && (
            <Grid item xs={12} md={12} lg={4}>
              <SystemLayersSection systemLayers={system.systemLayers} />
            </Grid>
          )}
        </Grid>
      </Section>
      <TabLeadBlock
        system={system}
        aboutLeadBlockGenericContent={resources?.sdpSidebarItems?.[0]}
        bimDescription={resources?.sdpBimDescription}
        specificationNotes={resources?.sdpSpecificationNotesCta}
      />
      {system.relatedSystems.length > 0 && (
        <RelatedSystems
          systems={system.relatedSystems}
          countryCode={countryCode}
        />
      )}
      {breadcrumbs}
    </Page>
  );
};

export default SystemDetailsPage;

export const systemQuery = graphql`
  query SystemDetailsPage($siteId: String!, $systemCode: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    system(code: { eq: $systemCode }) {
      awardsAndCertificateDocuments {
        ...PIMAssetFragment
      }
      awardsAndCertificateImages {
        ...PIMAssetFragment
      }
      bim {
        name
        url
      }
      brand {
        ...PIMBrandFragment
      }
      categories {
        ...CategoryFragment
      }
      classifications {
        ...ClassificationFragment
      }
      code
      description
      documents {
        ...PIMSystemDocumentFragment
      }
      guaranteesAndWarrantiesImages {
        ...PIMAssetFragment
      }
      guaranteesAndWarrantiesLinks {
        ...PIMAssetFragment
      }
      keyFeatures {
        name
        values
      }
      images {
        ...PIMImageFragment
      }
      layerCodes
      name
      promotionalContent
      relatedSystems {
        ...RelatedSystemFragment
      }
      specification {
        ...PIMAssetFragment
      }
      systemBenefits
      systemLayers {
        layerNumber
        name
        relatedProducts {
          name
          path
        }
        relatedOptionalProducts {
          name
          path
        }
        shortDescription
        type
      }
      uniqueSellingPropositions
      videos {
        ...PIMVideoFragment
      }
    }
  }
`;
