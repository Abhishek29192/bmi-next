import { Container, CTACard, Grid, GridSize, Section } from "@bmi/components";
import { useLocation } from "@reach/router";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import BackToResults from "../components/BackToResults";
import Breadcrumbs from "../components/Breadcrumbs";
import ExploreBar from "../components/ExploreBar";
import { renderImage } from "../components/Image";
import KeyAssetTypesDownloadSection from "../components/KeyAssetTypesDownloadSection";
import { getCTA } from "../components/Link";
import Page, { Data as PageData } from "../components/Page";
import ProductLeadBlock from "../components/ProductLeadBlock";
import ProductOverview, {
  Data as ProductOverviewData
} from "../components/ProductOverview";
import RelatedProducts from "../components/RelatedProducts";
import SampleOrderSection from "../components/SampleOrderSection";
import ShareWidgetSection from "../components/ShareWidgetSection";
import { Data as SiteData } from "../components/Site";
import { renderVideo } from "../components/Video";
import { microCopy } from "../constants/microCopies";
import { Product } from "../types/pim";
import { createActionLabel } from "../utils/createActionLabelForAnalytics";
import {
  getProductAttributes,
  transformImages,
  UnavailableMicroCopies,
  UnavailableMicroCopiesEnum
} from "../utils/product-details-transforms";
import { useTransformedMedias } from "../utils/useTransformedMedias";

export type Data = PageData & {
  productData: ProductOverviewData;
};

type Props = {
  pageContext: {
    productCode: string;
    siteId: string;
    countryCode: string;
    variantCodeToPathMap?: Record<string, string>;
  };
  data: {
    product: Product;
    contentfulSite: SiteData;
  };
};

const ProductDetailsPage = ({ pageContext, data }: Props) => {
  const { product, contentfulSite } = data;
  const { resources, countryCode } = contentfulSite;
  const pageData: PageData = {
    breadcrumbs: product.breadcrumbs,
    signupBlock: resources.pdpSignupBlock,
    seo: null,
    path: product.path
  };
  const {
    maximumSamples,
    sampleBasketLink,
    pdpFixingToolDescription,
    pdpFixingToolTitle,
    pdpSpecificationTitle,
    pdpSpecificationDescription
  } = resources;
  const transformedMedias = useTransformedMedias(product.videos);

  const location = useLocation();
  const isSSR = typeof window === "undefined";
  const queryParams = useMemo<string>(() => {
    return isSSR ? "" : window.location.search;
  }, [location]);

  const images = transformImages(
    [product.masterImage, ...product.galleryImages].filter(Boolean)
  );

  return (
    <Page
      brand={product.brand?.code}
      title={product.name}
      pageData={pageData}
      siteData={contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={product.masterImage?.mainSource}
      variantProduct={product}
    >
      {({ siteContext: { getMicroCopy } }) => {
        const attributeUnavailableMicroCopy: UnavailableMicroCopies = [
          UnavailableMicroCopiesEnum.COLOUR,
          UnavailableMicroCopiesEnum.SIZE,
          UnavailableMicroCopiesEnum.VARIANT_ATTRIBUTE,
          UnavailableMicroCopiesEnum.TEXTURE_FAMILY
        ].reduce(
          (carry, key) => ({
            ...carry,
            [key]: getMicroCopy(`pdp.unavailable.${key}`)
          }),
          {} as Record<keyof UnavailableMicroCopies, string>
        );

        return (
          <>
            {product.breadcrumbs.length > 0 && (
              <Section backgroundColor="pearl" isSlim>
                <BackToResults>
                  <Breadcrumbs data={product.breadcrumbs} />
                </BackToResults>
              </Section>
            )}
            <Container>
              <ProductOverview
                data={{
                  name: product.name,
                  brandCode: product.brand?.code,
                  nobb: product.externalProductCode,
                  images,
                  videos: transformedMedias,
                  attributes: getProductAttributes(
                    product,
                    pageContext.countryCode,
                    {
                      size: getMicroCopy(microCopy.PDP_OVERVIEW_SIZE),
                      variantAttribute: getMicroCopy(
                        microCopy.PDP_OVERVIEW_VARIANT_ATTRIBUTE
                      )
                    },
                    attributeUnavailableMicroCopy,
                    queryParams,
                    pageContext?.variantCodeToPathMap
                  ),
                  variantCode: pageContext.productCode,
                  isRecaptchaShown:
                    Object.keys(product.keyAssetDocuments).length > 0
                }}
              >
                <SampleOrderSection
                  isSampleOrderAllowed={product.isSampleOrderAllowed}
                  product={product}
                  maximumSamples={maximumSamples}
                  sampleBasketLinkInfo={sampleBasketLink}
                  actionLabel={createActionLabel(
                    product.name,
                    product.colour,
                    product.textureFamily,
                    product.measurements?.label
                  )}
                />
                {Object.keys(product.keyAssetDocuments).length > 0 && (
                  <KeyAssetTypesDownloadSection
                    keyAssetDocuments={product.keyAssetDocuments}
                  />
                )}
                {resources?.pdpShareWidget && (
                  <ShareWidgetSection
                    data={{ ...resources?.pdpShareWidget, isLeftAligned: true }}
                    hasNoPadding={true}
                  />
                )}
              </ProductOverview>
            </Container>
            <Section backgroundColor="white">
              <ProductLeadBlock
                product={product}
                sidebarItems={resources?.pdpSidebarItems}
                pdpFixingToolDescription={pdpFixingToolDescription}
                pdpFixingToolTitle={pdpFixingToolTitle}
                pdpSpecificationTitle={pdpSpecificationTitle}
                pdpSpecificationDescription={pdpSpecificationDescription}
                documentDisplayFormat={resources?.documentDisplayFormat}
              />
            </Section>
            <RelatedProducts
              countryCode={pageContext.countryCode}
              products={product.relatedProducts}
            />
            {resources?.pdpCardsTitle && resources.pdpCards && (
              <Section backgroundColor="alabaster">
                <Section.Title>{resources.pdpCardsTitle}</Section.Title>
                <Grid container spacing={3}>
                  {resources.pdpCards.map(
                    (
                      { title, featuredVideo, featuredMedia, ...data },
                      index,
                      cards
                    ) => {
                      const cta = getCTA(data, countryCode, title);
                      return (
                        <Grid
                          item
                          key={`card-${index}`}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={(12 / Math.max(cards.length, 3)) as GridSize}
                        >
                          <CTACard
                            title={title}
                            media={
                              featuredVideo
                                ? renderVideo(featuredVideo)
                                : renderImage(featuredMedia)
                            }
                            clickableArea={featuredVideo ? "heading" : "full"}
                            action={cta?.action}
                          />
                        </Grid>
                      );
                    }
                  )}
                </Grid>
              </Section>
            )}
            {resources?.pdpExploreBar && (
              <Section backgroundColor="alabaster">
                <ExploreBar data={resources.pdpExploreBar} />
              </Section>
            )}
            {product.breadcrumbs && (
              <Section backgroundColor="pearl" isSlim>
                <Breadcrumbs data={product.breadcrumbs} />
              </Section>
            )}
          </>
        );
      }}
    </Page>
  );
};

export default ProductDetailsPage;

export const pageQuery = graphql`
  query ProductDetailsPage($productCode: String!, $siteId: String!) {
    product(code: { eq: $productCode }) {
      awardsAndCertificateDocuments {
        ...PIMAssetFragment
      }
      awardsAndCertificateImages {
        ...PIMAssetFragment
      }
      baseCode
      baseScoringWeight
      bimIframeUrl
      brand {
        ...PIMBrandFragment
      }
      breadcrumbs {
        id
        label
        slug
      }
      categories {
        ...CategoryFragment
      }
      classifications {
        ...ClassificationFragment
      }
      code
      colour
      colourMicrocopy
      path
      colourFamily
      description
      productDocuments {
        ...PIMDocumentCommonFragment
      }
      externalProductCode
      fixingToolIframeUrl
      galleryImages {
        ...PIMImageFragment
      }
      guaranteesAndWarrantiesImages {
        ...PIMAssetFragment
      }
      guaranteesAndWarrantiesLinks {
        ...PIMAssetFragment
      }
      keyAssetDocuments {
        assetType
        documents {
          ...PIMDocumentFragment
        }
      }
      masterImage {
        ...PIMImageFragment
      }
      isSampleOrderAllowed
      materials
      measurements {
        ...MeasurementsFragment
      }
      name
      productBenefits
      relatedProducts {
        ...RelatedProductFragment
      }
      relatedVariants {
        code
        thumbnail
        colour
        colourFamily
        textureFamily
        materials
        measurements {
          ...MeasurementsFragment
        }
        variantAttribute
        path
      }
      specificationIframeUrl
      techDrawings {
        ...PIMImageFragment
      }
      textureFamily
      textureFamilyMicrocopy
      variantAttribute
      videos {
        ...PIMVideoFragment
      }
      weight {
        grossWeight {
          ...UnitValueFragment
        }
        netWeight {
          ...UnitValueFragment
        }
        weightPerPallet {
          ...UnitValueFragment
        }
        weightPerPiece {
          ...UnitValueFragment
        }
        weightPerSqm {
          ...UnitValueFragment
        }
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
