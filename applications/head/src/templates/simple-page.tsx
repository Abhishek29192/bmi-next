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
  contentfulSimplePage: ContentfulSimplePage;
};

type ContentfulSimplePage = {
  title: string;
  content: Json;
};

const SimplePage = ({ data }: Page<Props>) => {
  if (!data) {
    // TODO: Have this logic elsewhere
    return <p>Something went wrong</p>;
  }
  const {
    site,
    contentfulSimplePage: { title, content }
  } = data;
  return (
    <Page>
      <Helmet title={`${title} | ${site.siteMetadata.title}`} />
      <h1>{title}</h1>
      <p>{documentToReactComponents(content.json)}</p>
    </Page>
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
