import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

// TODO: Type this
type Props = {
  data: null | any;
};

const HomePage = ({ data }: Props) => {
  if (!data) {
    // TODO: Have this logic elsewhere
    return <p>Something went wrong</p>;
  }
  const {
    site,
    contentfulHomepage: { title, content }
  } = data;
  return (
    <>
      <Helmet title={site.siteMetadata.title} />
      <h1>{title}</h1>
      <p>{documentToReactComponents(content.json)}</p>
    </>
  );
};

export default HomePage;

export const pageQuery = graphql`
  query HomepageById($id: String!) {
    site {
      siteMetadata {
        title
      }
    }

    contentfulHomepage(id: { eq: $id }) {
      title
      content {
        json
      }
    }
  }
`;
