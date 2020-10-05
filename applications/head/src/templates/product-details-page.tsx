import React from "react";
// import { graphql } from "gatsby";
import Container from "@bmi/container";
import Section from "@bmi/section";
import Page, { Data as PageData } from "../components/Page";
import { Data as SiteData } from "../components/Site";
import ProductOverview, {
  Data as ProductOverviewData
} from "../components/ProductOverview";
import ProductLeadBlock from "../components/ProductLeadBlock";

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
      <Section>
        <ProductLeadBlock />
      </Section>
    </Page>
  );
};

export default ProductDetailsPage;
