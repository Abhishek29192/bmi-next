import {
  Grid,
  MediaGallery,
  Section,
  Thumbnail,
  ThumbnailProps
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import BrandLogo from "../../components/BrandLogo";
import Breadcrumbs from "../../components/Breadcrumbs";
import { generateGetMicroCopy } from "../../components/MicroCopy";
import Page from "../../components/Page";
import RelatedSystems from "../../components/RelatedSystems";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../../components/ShareWidgetSection";
import { Data as SiteData } from "../../components/Site";
import { microCopy } from "../../constants/microCopies";
import { System } from "../../types/pim";
import withGTM from "../../utils/google-tag-manager";
import { transformMediaSrc } from "../../utils/media";
import { transformImages } from "../../utils/product-details-transforms";
import LeadBlockSection from "./leadBlockSection";
import SystemLayersSection from "./systemLayersSection";
import TabLeadBlock from "./tabLeadBlock";
import { StyledImageGalarySection } from "./styles/systemDetailsPage.styles";

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

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  const BreadcrumbSection = ({ location }: { location: "top" | "bottom" }) => (
    <Section
      backgroundColor="pearl"
      isSlim
      data-testid={`system-details-page-breadcrumbs-section${location}`}
    >
      <Breadcrumbs
        data={[
          {
            id: pageContext.systemCode,
            label: system.name,
            slug: null
          }
        ]}
        data-testid={`system-details-page-breadcrumbs-${location}`}
      />
    </Section>
  );

  const media = [
    ...transformImages(
      [system.masterImage, ...system.galleryImages].filter(Boolean)
    ),
    //TODO: check if it doesnt work on system detals page!!!
    ...transformMediaSrc(system.videos)
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
      <BreadcrumbSection location="top" />
      {resources?.sdpShareWidget && (
        <ShareWidgetSection data={resources.sdpShareWidget} />
      )}
      <LeadBlockSection
        name={system.name}
        cta={resources?.sdpLeadBlockCta}
        promotionalContent={system.promotionalContent}
        uniqueSellingPropositions={system.uniqueSellingPropositions}
        brandLogo={<BrandLogo brandName={system.brand?.code} />}
        goodBetterBest={system.goodBetterBest}
      />
      <StyledImageGalarySection
        backgroundColor="alabaster"
        data-testid="system-details-page-image-gallary-section"
      >
        <Grid container spacing={3}>
          <Grid xs={12} md={12} lg={8}>
            <MediaGallery
              media={media}
              layout="short"
              thumbnailComponent={(props: ThumbnailProps) => (
                <GTMThumbnail gtm={{ id: "media-gallery1" }} {...props} />
              )}
              videoButtonLabel={getMicroCopy(microCopy.MEDIA_VIDEO)}
            />
          </Grid>
          {system && system.systemLayers && system.systemLayers.length > 0 && (
            <Grid xs={12} md={12} lg={4}>
              <SystemLayersSection systemLayers={system.systemLayers} />
            </Grid>
          )}
        </Grid>
      </StyledImageGalarySection>
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
      <BreadcrumbSection location="bottom" />
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
      goodBetterBest
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
      galleryImages {
        ...PIMImageFragment
      }
      masterImage {
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
