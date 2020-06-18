import React from "react";
import { Helmet } from "react-helmet";

// TODO: Type this
type Page<T> = {
  data: null | T;
};

const ProductDetailsPage = ({ data }: Page<any>) => {
  return (
    <>
      <Helmet title={`Product Name`} />
      <h1>Product Name</h1>
      <p>Product description</p>
    </>
  );
};

export default ProductDetailsPage;
