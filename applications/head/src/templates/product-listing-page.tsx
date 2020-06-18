import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { Json, Site } from "./types";

type Page<T> = {
  data: null | T;
};

type Props = {
  site: Site;
  contentfulProductListing: ContentfulProductListingPage;
};

type ContentfulProductListingPage = {
  title: string;
  category: Json;
};

const ProductListingPage = ({ data }: Page<Props>) => {
  if (!data) {
    // TODO: Have this logic elsewhere
    return <p>Something went wrong</p>;
  }
  const {
    site,
    contentfulProductListing: { title, category }
  } = data;
  return (
    <>
      <Helmet title={`${title} | ${site.siteMetadata.title}`} />
      <h1>{title}</h1>
      <p>Category: {category}</p>
    </>
  );
};

export default ProductListingPage;

export const pageQuery = graphql`
  query ProductListingById($id: String!) {
    site {
      siteMetadata {
        title
      }
    }

    contentfulProductListing(id: { eq: $id }) {
      title
      category
    }
  }
`;
