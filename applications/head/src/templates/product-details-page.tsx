import React from "react";
import { graphql } from "gatsby";
import { uniqBy, flatten, map } from "lodash";
import Container from "@bmi/container";
import Section from "@bmi/section";
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
import Grid, { GridSize } from "@bmi/grid";
import CTACard from "@bmi/cta-card";
import { getCTA } from "../components/Link";
import ExploreBar from "../components/ExploreBar";
import { Data as PIMDocumentData } from "../components/PIMDocument";
import { Data as PIMLinkDocumentData } from "../components/PIMLinkDocument";
import Breadcrumbs from "../components/Breadcrumbs";

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
  code?: string; // This doesn't exist on some Features... perhaps we can be more specific with the types
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
};

type Props = {
  pageContext: {
    productId: string;
    variantCode?: string;
    siteId: string;
    countryCode: string;
    relatedProductCodes: ReadonlyArray<string>;
    pimClassificationCatalogueNamespace: string;
  };
  data: {
    product: Product;
    relatedProducts: {
      nodes: ReadonlyArray<Product>; // TODO: match type correctly
    };
    contentfulSite: SiteData;
  };
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
  const pageData: PageData = {
    slug: null,
    inputBanner: resources.pdpInputBanner
  };

  const breadcrumbs = <Breadcrumbs title={product.name} slug={pageData.slug} />;

  return (
    <Page title={product.name} pageData={pageData} siteData={contentfulSite}>
      <Section backgroundColor="pearl" isSlim>
        {breadcrumbs}
      </Section>
      <Container>
        <SiteContext.Consumer>
          {({ getMicroCopy }) => {
            return (
              <ProductOverview
                data={{
                  name: product.name,
                  brandName: brandCode || "",
                  nobb: selfProduct.externalProductCode || "n/a",
                  images: mapGalleryImages([
                    ...(selfProduct.images || []),
                    ...(product.images || [])
                  ]),
                  attributes: getProductAttributes(
                    productClassifications,
                    selfProduct,
                    pageContext,
                    {
                      size: getMicroCopy("pdp.overview.size")
                    }
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
              ({ title, featuredImage, ...data }, index, cards) => {
                const { action } = getCTA(data, countryCode);
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
                      imageSource={featuredImage?.resized?.src}
                      action={action}
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
      <Section backgroundColor="alabaster" isSlim>
        {breadcrumbs}
      </Section>
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
