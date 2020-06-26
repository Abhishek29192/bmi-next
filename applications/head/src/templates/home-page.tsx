import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Json, Site } from "./types";
import Page from "../components/Page";

type Page<T> = {
  data: null | T;
};

type Props = {
  site: Site;
  contentfulHomepage: ContentfulHomePage;
};

type ContentfulHomePage = {
  title: string;
  content: Json;
};

const HomePage = ({ data }: Page<Props>) => {
  if (!data) {
    // TODO: Have this logic elsewhere
    return <p>Something went wrong</p>;
  }
  const {
    site,
    contentfulHomepage: { title, content }
  } = data;

  return (
    <Page>
      <Helmet title={site.siteMetadata.title} />
      <h1>{title}</h1>
      <div>{documentToReactComponents(content.json)}</div>
    </Page>
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
