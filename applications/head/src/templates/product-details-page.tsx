import React from "react";
// import { graphql } from "gatsby";
import Container from "@bmi/container";
import Page, { Data as PageData } from "../components/Page";
import { Data as SiteData } from "../components/Site";
import ProductOverview, {
  Data as ProductOverviewData
} from "../components/ProductOverview";

type Data = PageData & {
  productData: ProductOverviewData;
};

type Props = {
  data: {
    productDetailsPage: Data;
    contentfulSite: SiteData;
  };
};

const ProductDetailsPage = ({ data }: Props) => {
  const { productData, ...pageData } = data.productDetailsPage;

  return (
    <Page pageData={pageData} siteData={data.contentfulSite}>
      <Container>
        <ProductOverview data={productData} />
      </Container>
      {/* LEAD BLOCK HERE */}
    </Page>
  );
};

export default ProductDetailsPage;
