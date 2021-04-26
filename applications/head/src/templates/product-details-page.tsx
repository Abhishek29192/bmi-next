import React from "react";
import { graphql } from "gatsby";
import { uniqBy, flatten, map } from "lodash";
import Container from "@bmi/container";
import Section from "@bmi/section";
import Grid, { GridSize } from "@bmi/grid";
import CTACard from "@bmi/cta-card";
import Page, { Data as PageData } from "../components/Page";
import { Data as SiteData, SiteContext } from "../components/Site";
import ProductOverview, {
  Data as ProductOverviewData
} from "../components/ProductOverview";
import ProductLeadBlock from "../components/ProductLeadBlock";
import ShareWidgetSection from "../components/ShareWidgetSection";
import {
  getProductAttributes,
  mapGalleryImages,
  mapProductClassifications,
  getProductTechnicalSpecifications
} from "../utils/product-details-transforms";
import RelatedProducts from "../components/RelatedProducts";
import { getCTA } from "../components/Link";
import ExploreBar from "../components/ExploreBar";
import { Data as PIMDocumentData } from "../components/PIMDocument";
import { Data as PIMLinkDocumentData } from "../components/PIMLinkDocument";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";

export type Data = PageData & {
  productData: ProductOverviewData;
};

type Image = {
  realFileName: string;
  assetType: string;
  mime: string;
  url: string;
  allowedToDownload: boolean;
  containerId: string;
  fileSize: number;
  name: string;
};

type Asset = {
  realFileName: string;
  assetType: string;
  url: string;
  name: string;
  format?: string;
};

export type ClassificationFeatureValue = {
  value: string;
  code: string | null; // This doesn't exist on some Features... perhaps we can be more specific with the types
};

type ClassificationFeatureUnit = {
  name: string;
  symbol: string;
  unitType: string;
};

type ClassificationFeature = {
  name: string;
  code: string;
  featureValues: ClassificationFeatureValue[];
  featureUnit?: ClassificationFeatureUnit;
};

export type Classification = {
  name: string;
  code: string;
  features: ClassificationFeature[];
};

export type VariantOption = {
  code: string;
  externalProductCode: string | null;
  isSampleOrderAllowed: boolean;
  images: ReadonlyArray<Image>;
  classifications?: ReadonlyArray<Classification>;
  approvalStatus: string;
  shortDescription: string;
  longDescription: string;
  breadcrumbs: BreadcrumbsData;
  path: string;
};

export type Category = {
  name: string;
  categoryType: string; // ENUM?
  code: string;
  parentCategoryCode: string;
};

type ProductImage = {
  allowedToDownload: boolean;
  assetType: string;
  fileSize: number;
  name: string;
  url: string;
  containerId: string;
  mime: string;
  realFileName: string;
  format?: string;
};

// TODO: perhaps should be stored somewhere else to export
export type Product = {
  code: string;
  externalProductCode: string | null;
  name: string;
  description: string;
  images?: ReadonlyArray<ProductImage>;
  assets?: ReadonlyArray<Asset>;
  productBenefits?: ReadonlyArray<string>;
  categories?: ReadonlyArray<Category>;
  classifications?: ReadonlyArray<Classification>;
  variantOptions?: ReadonlyArray<VariantOption>;
  documents: (PIMDocumentData | PIMLinkDocumentData)[];
  breadcrumbs: null;
};

type Props = {
  pageContext: {
    productId: string;
    variantCode?: string;
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

const ProductDetailsPage = ({ pageContext, data }: Props) => {
  const { product, relatedProducts, contentfulSite } = data;

  // Which variant (including base) are we looking at
  // TODO: Merge data here!
  const selfProduct = pageContext.variantCode
    ? product.variantOptions.find(
        ({ code }) => code === pageContext.variantCode
      )
    : product;

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

  const uniqueClassifications = uniqBy(
    flatten(
      map(
        [
          ...(selfProduct.classifications || []),
          ...(product.classifications || [])
        ],
        "features"
      )
    ),
    "code"
  );

  const technicalSpecifications = getProductTechnicalSpecifications(
    pageContext.pimClassificationCatalogueNamespace,
    uniqueClassifications
  );

  const { resources, countryCode } = contentfulSite;
  const { breadcrumbs } = selfProduct;
  const pageData: PageData = {
    breadcrumbs,
    inputBanner: resources.pdpInputBanner,
    seo: null
  };

  return (
    <Page
      title={product.name}
      pageData={pageData}
      siteData={contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
    >
      {breadcrumbs && (
        <Section backgroundColor="pearl" isSlim>
          <Breadcrumbs data={breadcrumbs} />
        </Section>
      )}
      <Container>
        <SiteContext.Consumer>
          {({ getMicroCopy }) => {
            return (
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
                    pageContext,
                    {
                      size: getMicroCopy("pdp.overview.size")
                    },
                    product.variantOptions.reduce(
                      (carry, { code, path }) => ({ ...carry, [code]: path }),
                      {}
                    )
                  )
                }}
              >
                {resources?.pdpShareWidget && (
                  <ShareWidgetSection
                    data={{ ...resources?.pdpShareWidget, isLeftAligned: true }}
                    hasNoPadding={true}
                  />
                )}
              </ProductOverview>
            );
          }}
        </SiteContext.Consumer>
      </Container>
      <Section backgroundColor="white">
        <ProductLeadBlock
          description={product.description}
          keyFeatures={product.productBenefits}
          technicalSpecifications={technicalSpecifications}
          sidebarItems={resources?.pdpSidebarItems}
          guaranteesAndWarranties={product.assets?.filter(
            (asset) =>
              asset.assetType === "GUARANTIES" ||
              asset.assetType === "WARRANTIES"
          )}
          awardsAndCertificates={product.assets?.filter(
            (asset) =>
              asset.assetType === "AWARDS" || asset.assetType === "CERTIFICATES"
          )}
          documents={product.documents}
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
    </Page>
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
