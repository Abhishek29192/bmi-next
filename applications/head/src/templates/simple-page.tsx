import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

// TODO: Type this
type Props = {
  data: null | any;
};

const SimplePage = ({ data }: Props) => {
  if (!data) {
    // TODO: Have this logic elsewhere
    return <p>Something went wrong</p>;
  }
  const {
    site,
    contentfulSimplePage: { title, content }
  } = data;
  return (
    <>
      <Helmet title={`${title} | ${site.siteMetadata.title}`} />
      <h1>{title}</h1>
      <p>{documentToReactComponents(content.json)}</p>
    </>
  );
};

export default SimplePage;

export const pageQuery = graphql`
  query SimplePageById($id: String!) {
    site {
      siteMetadata {
        title
      }
    }

    contentfulSimplePage(id: { eq: $id }) {
      title
      content {
        json
      }
    }
  }
`;
