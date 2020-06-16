import React from "react";
import { Helmet } from "react-helmet";

// TODO: Type this
type Props = {
  data: null | any;
};

const ProductDetailsPage = ({ data }: Props) => {
  return (
    <>
      <Helmet title={`Product Name`} />
      <h1>Product Name</h1>
      <p>Product description</p>
    </>
  );
};

export default ProductDetailsPage;
