import { Container, Section } from "@bmi/components";
import { useLocation } from "@reach/router";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import ExploreBar from "../../components/ExploreBar";

import KeyAssetTypesDownloadSection from "../../components/KeyAssetTypesDownloadSection";
import Page, { Data as PageData } from "../../components/Page";
import ProductLeadBlock from "../../components/ProductLeadBlock";
import ProductOverview, {
  Data as ProductOverviewData
} from "../../components/ProductOverview";
import RelatedProducts from "../../components/RelatedProducts";
import SampleOrderSection from "../../components/SampleOrderSection";
import ShareWidgetSection from "../../components/ShareWidgetSection";
import { Data as SiteData } from "../../components/Site";

import { microCopy } from "../../constants/microCopies";
import { Product } from "../../types/pim";
import { transformMediaSrc } from "../../utils/media";
import {
  getProductAttributes,
  transformImages,
  UnavailableMicroCopies,
  UnavailableMicroCopiesEnum
} from "../../utils/product-details-transforms";
import { PdpCardsSection } from "./components/pdp-cards";

export type Data = PageData & {
  productData: ProductOverviewData;
};

export type Props = {
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
  const { resources } = contentfulSite;
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
            <Section backgroundColor="pearl" isSlim>
              <BackToResults>
                <Breadcrumbs data={product.breadcrumbs} />
              </BackToResults>
            </Section>
            <Container>
              <ProductOverview
                data={{
                  name: product.name,
                  brandCode: product.brand?.code,
                  nobb: product.externalProductCode,
                  images,
                  videos: transformMediaSrc(product.videos),
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
                    Object.keys(product.keyAssetDocuments).length > 0,
                  isNavigationToVisualiserAvailable:
                    product.isVisualiserAvailable
                }}
              >
                <SampleOrderSection
                  isSampleOrderAllowed={product.isSampleOrderAllowed}
                  product={product}
                  maximumSamples={maximumSamples}
                  sampleBasketLinkInfo={sampleBasketLink}
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
            {product.relatedProducts && (
              <RelatedProducts
                countryCode={pageContext.countryCode}
                products={product.relatedProducts}
              />
            )}
            {resources?.pdpCardsTitle && resources.pdpCards && (
              <PdpCardsSection
                resources={{
                  pdpCards: resources.pdpCards,
                  pdpCardsTitle: resources?.pdpCardsTitle
                }}
                countryCode={pageContext.countryCode}
              />
            )}
            {resources?.pdpExploreBar && (
              <Section backgroundColor="alabaster" className="ExploreBar">
                <ExploreBar data={resources.pdpExploreBar} />
              </Section>
            )}
            <Section
              backgroundColor="pearl"
              isSlim
              className="ProductBreadcrumbs"
            >
              <Breadcrumbs data={product?.breadcrumbs} />
            </Section>
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
      isVisualiserAvailable
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
