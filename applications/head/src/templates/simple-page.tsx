import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Json, Site } from "./types";

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

const Page = ({ data }: Page<HomePageProps>) =>
  data ? <HomePage {...data} /> : <p>Something went wrong</p>;

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
