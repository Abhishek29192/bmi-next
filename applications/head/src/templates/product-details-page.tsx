import React from "react";
import { Helmet } from "react-helmet";
import Page from "../components/Page";

// TODO: Type this
type Page<T> = {
  data: null | T;
};

const ProductDetailsPage = ({ data }: Page<any>) => {
  return (
    <Page>
      <Helmet title={`Product Name`} />
      <h1>Product Name</h1>
      <p>Product description</p>
    </Page>
  );
};

export default ProductDetailsPage;
