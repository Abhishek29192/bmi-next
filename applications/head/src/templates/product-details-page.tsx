import React from "react";
import { graphql } from "gatsby";
import _ from "lodash";
import Container from "@bmi/container";
import Section from "@bmi/section";
import Page, { Data as PageData } from "../components/Page";
import { Data as SiteData } from "../components/Site";
import ProductOverview, {
  Data as ProductOverviewData
} from "../components/ProductOverview";
import ProductLeadBlock from "../components/ProductLeadBlock";
import {
  getProductAttributes,
  mapGalleryImages,
  mapProductClassifications,
  getProductTechnicalSpecifications
} from "../utils/product-details-transforms";

type Data = PageData & {
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
  format: string;
};

type ClassificationFeatureValue = {
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
  featureUnit: ClassificationFeatureUnit;
};

type Classification = {
  name: string;
  code: string;
  features: ClassificationFeature[];
};

type VariantOption = {
  isSampleOrderAllowed: boolean;
  images: ReadonlyArray<Image>;
  code: string;
  classifications?: ReadonlyArray<Classification>;
  approvalStatus: string;
  shortDescription: string;
  longDescription: string;
};

type Category = {
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
  format: string;
};

// TODO: perhaps should be stored somewhere else to export
export type Product = {
  code: string;
  name: string;
  description: string;
  images?: ReadonlyArray<ProductImage>;
  productBenefits?: ReadonlyArray<string>;
  categories?: ReadonlyArray<Category>;
  classifications?: ReadonlyArray<Classification>;
  variantOptions?: ReadonlyArray<VariantOption>;
};

type Props = {
  pageContext: {
    // productId: string;
    variantCode?: string;
    siteId: string;
    countryCode: string;
    pimClassificationCatalogueNamespace: string;
  };
  data: {
    product: Product;
    relatedProducts: {
      nodes: ReadonlyArray<any>; // TODO
    };
    contentfulSite: SiteData;
  };
};

const ProductDetailsPage = ({ pageContext, data }: Props) => {
  const { product, relatedProducts, contentfulSite } = data;

  const pageData: PageData = {
    showSignUpBanner: false
  };

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
    product.categories.find(({ categoryType }) => {
      return categoryType === "Brand";
    }) || {}
  ).code;

  const productClassifications = mapProductClassifications(
    product,
    pageContext.pimClassificationCatalogueNamespace
  );

  const uniqueClassifications = _.uniqBy(
    _.flatten(
      _.map(
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

  const productData = {
    name: product.name,
    brandName: brandCode || "",
    nobb: selfProduct.code,
    images: mapGalleryImages([
      ...(selfProduct.images || []),
      ...(product.images || [])
    ]),
    attributes: getProductAttributes(
      productClassifications,
      selfProduct,
      pageContext
    )
  };

  return (
    <Page title={product.name} pageData={pageData} siteData={contentfulSite}>
      <Container>
        <ProductOverview data={productData} />
      </Container>
      <Section>
        <ProductLeadBlock
          description={product.description}
          keyFeatures={product.productBenefits}
          technicalSpecifications={technicalSpecifications}
        />
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
    }
    relatedProducts: allProducts(
      filter: { code: { in: $relatedProductCodes } }
    ) {
      nodes {
        code
        name
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
