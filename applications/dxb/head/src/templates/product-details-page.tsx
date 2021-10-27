import React, { useReducer } from "react";
import { graphql } from "gatsby";
import Container from "@bmi/container";
import Section from "@bmi/section";
import Grid, { GridSize } from "@bmi/grid";
import CTACard from "@bmi/cta-card";
import Page, { Data as PageData } from "../components/Page";
import { Data as SiteData } from "../components/Site";
import ProductOverview, {
  Data as ProductOverviewData
} from "../components/ProductOverview";
import ProductLeadBlock from "../components/ProductLeadBlock";
import ShareWidgetSection from "../components/ShareWidgetSection";
import {
  getProductAttributes,
  mapGalleryImages,
  mapProductClassifications,
  getMergedClassifications,
  VariantCodeToPathMap
} from "../utils/product-details-transforms";
import RelatedProducts from "../components/RelatedProducts";
import { getCTA } from "../components/Link";
import ExploreBar from "../components/ExploreBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";
import { Product } from "../components/types/pim";
import SampleOrderSection from "../components/SampleOrderSection";
import { getBimIframeUrl } from "../components/BimIframe";
import {
  BasketContextProvider,
  basketReducer,
  initialBasketState
} from "../contexts/SampleBasketContext";

export type Data = PageData & {
  productData: ProductOverviewData;
};

type Props = {
  pageContext: {
    productId: string;
    variantCode: string;
    siteId: string;
    countryCode: string;
    relatedProductCodes: ReadonlyArray<string>;
    pimClassificationCatalogueNamespace: string;
    variantCodeToPathMap: Record<string, string>;
  };
  data: {
    product: Product;
    relatedProducts: {
      nodes: ReadonlyArray<Product>; // TODO: match type correctly
    };
    contentfulSite: SiteData;
  };
};

const transformImages = (images) => {
  return images.map(({ mainSource, thumbnail, altText }) => ({
    media: <img src={mainSource} alt={altText} />,
    thumbnail
  }));
};

const getDescription = (product: Product, variantCode?: string): string => {
  if (!variantCode) return product.description;

  const variantProduct = getVariant(product, variantCode);

  if (variantProduct) return variantProduct.longDescription;
  return product.description;
};

const getKeyBenefits = (
  product: Product,
  variantCode?: string
): readonly string[] => {
  const variantProduct = getVariant(product, variantCode);

  //found variant and it has `productBenefits` populated!
  if (variantProduct && variantProduct.productBenefits?.length) {
    return variantProduct.productBenefits;
  }

  return product.productBenefits?.length ? product.productBenefits : null;
};

const getVariant = (product: Product, variantCode: string) => {
  const variantProduct = product.variantOptions.find(
    ({ code }) => code === variantCode
  );
  return variantProduct;
};

const ProductDetailsPage = ({ pageContext, data }: Props) => {
  const { product, relatedProducts, contentfulSite } = data;

  //for context setup for sample shopping basket
  const [basketState, basketDispatch] = useReducer(
    basketReducer,
    initialBasketState,
    () => {
      return typeof window !== "undefined" &&
        localStorage.getItem("basketItems")
        ? { products: JSON.parse(localStorage.getItem("basketItems")) }
        : { products: [] };
    }
  );

  const basketContextValues = {
    basketState,
    basketDispatch
  };

  // Which variant (including base) are we looking at
  // TODO: Merge data here!
  const selfProduct = product.variantOptions.find(
    ({ code }) => code === pageContext.variantCode
  );

  if (!selfProduct) {
    throw new Error("Could not find product");
  }
  // TODO: NO BMI BRAND LOGO??
  const brandCode = (
    (product.categories || []).find(({ categoryType }) => {
      return categoryType === "Brand";
    }) || {}
  ).code;

  const productClassifications = mapProductClassifications(
    product,
    pageContext.pimClassificationCatalogueNamespace
  );

  const validClassifications = getMergedClassifications(
    pageContext.pimClassificationCatalogueNamespace,
    selfProduct,
    product
  );

  const { resources, countryCode } = contentfulSite;
  const { breadcrumbs } = selfProduct;
  const pageData: PageData = {
    breadcrumbs,
    inputBanner: resources.pdpInputBanner,
    seo: null
  };

  const bimIframeUrl = getBimIframeUrl(product.assets);

  const variantCodeToPathMap: VariantCodeToPathMap =
    product.variantOptions.reduce(
      (carry, { code, path }) => ({ ...carry, [code]: path }),
      {}
    );

  const getSampleOrderAllowed = () => {
    if (process.env.GATSBY_ENABLE_SAMPLE_ORDERING === "true") {
      return selfProduct.isSampleOrderAllowed ?? product.isSampleOrderAllowed;
    }
    return false;
  };

  return (
    <BasketContextProvider value={basketContextValues}>
      <Page
        brand={brandCode}
        title={product.name}
        pageData={pageData}
        siteData={contentfulSite}
        variantCodeToPathMap={pageContext?.variantCodeToPathMap}
        ogImageUrl={selfProduct?.images?.[0].url}
      >
        {({ siteContext: { getMicroCopy } }) => (
          <>
            {breadcrumbs && (
              <Section backgroundColor="pearl" isSlim>
                <Breadcrumbs data={breadcrumbs} />
              </Section>
            )}

            <Container>
              <ProductOverview
                data={{
                  name: product.name,
                  brandName: brandCode || "",
                  nobb: selfProduct.externalProductCode || null,
                  images: transformImages(
                    mapGalleryImages([
                      ...(selfProduct.images || []),
                      ...(product.images || [])
                    ])
                  ),
                  attributes: getProductAttributes(
                    productClassifications,
                    selfProduct,
                    pageContext.countryCode,
                    {
                      size: getMicroCopy("pdp.overview.size")
                    },
                    variantCodeToPathMap
                  )
                }}
              >
                {(getSampleOrderAllowed() && (
                  <SampleOrderSection
                    variant={getVariant(product, pageContext.variantCode)}
                  />
                )) ||
                  (basketState.products.length > 0 && (
                    <SampleOrderSection onlyDisplayCompleteOrder={true} />
                  ))}
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
                description={getDescription(product, pageContext.variantCode)}
                keyFeatures={getKeyBenefits(product, pageContext.variantCode)}
                sidebarItems={resources?.pdpSidebarItems}
                guaranteesAndWarranties={product.assets?.filter(
                  (asset) =>
                    asset.assetType === "GUARANTIES" ||
                    asset.assetType === "WARRANTIES"
                )}
                awardsAndCertificates={product.assets?.filter(
                  (asset) =>
                    asset.assetType === "AWARDS" ||
                    asset.assetType === "CERTIFICATES"
                )}
                documents={product.documents}
                validClassifications={validClassifications}
                classificationNamespace={
                  pageContext.pimClassificationCatalogueNamespace
                }
                bimIframeUrl={bimIframeUrl}
              />
            </Section>
            <RelatedProducts
              countryCode={pageContext.countryCode}
              classificationNamespace={
                pageContext.pimClassificationCatalogueNamespace
              }
              products={relatedProducts.nodes}
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
                      const cta = getCTA(data, countryCode);
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
            {breadcrumbs && (
              <Section backgroundColor="pearl" isSlim>
                <Breadcrumbs data={breadcrumbs} />
              </Section>
            )}
          </>
        )}
      </Page>
    </BasketContextProvider>
  );
};

export default ProductDetailsPage;

export const pageQuery = graphql`
  query ProductDetailsPage(
    $productId: String!
    $siteId: String!
    $relatedProductCodes: [String]
  ) {
    product: products(id: { eq: $productId }) {
      code
      externalProductCode
      name
      approvalStatus
      description
      isSampleOrderAllowed
      images {
        allowedToDownload
        assetType
        fileSize
        name
        url
        containerId
        mime
        realFileName
        format
      }
      assets {
        name
        url
        assetType
        realFileName
      }
      categories {
        name
        categoryType
        code
        parentCategoryCode
      }
      classifications {
        name
        code
        features {
          name
          code
          featureValues {
            value
            code
          }
          featureUnit {
            symbol
          }
        }
      }
      productBenefits
      variantOptions {
        path
        breadcrumbs
        isSampleOrderAllowed
        code
        externalProductCode
        approvalStatus
        shortDescription
        longDescription
        productBenefits
        images {
          realFileName
          assetType
          mime
          url
          allowedToDownload
          containerId
          fileSize
          name
          format
        }
        classifications {
          name
          code
          features {
            name
            code
            featureValues {
              value
              code
            }
            featureUnit {
              symbol
            }
          }
        }
      }
      documents {
        ...PIMDocumentFragment
        ...PIMLinkDocumentFragment
      }
    }
    relatedProducts: allProducts(
      filter: { code: { in: $relatedProductCodes } }
    ) {
      nodes {
        ...RelatedProductsFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
