import React from "react";
import { graphql } from "gatsby";
import Page, { Data as PageData } from "../components/Page";
import Hero, { HeroItem } from "@bmi/hero";
import { Data as SiteData } from "../components/Site";
import Sections, { Data as SectionsData } from "../components/Sections";

export type PageInfoData = {
  __typename: "ContentfulSimplePage";
  title: string;
  subtitle: string | null;
  slug: string;
  featuredImage: {
    title: string;
    file: {
      fileName: string;
      url: string;
    };
  } | null;
};

type Data = PageInfoData &
  PageData & {
    sections: SectionsData | null;
  };

type Props = {
  data: {
    contentfulSimplePage: Data;
    contentfulSite: SiteData;
  };
};

const SimplePage = ({ data }: Props) => {
  const {
    title,
    subtitle,
    featuredImage,
    sections
  } = data.contentfulSimplePage;
  const heroProps: HeroItem = {
    title,
    children: subtitle,
    imageSource: featuredImage?.file.url
  };

  return (
    <Page
      title={title}
      pageData={data.contentfulSimplePage}
      siteData={data.contentfulSite}
    >
      {/* TODO: Level depends on page rank, see and share breadcrumbs logic */}
      <Hero level={1} {...heroProps} />
      {sections && <Sections data={sections} />}
    </Page>
  );
};

export default SimplePage;

export const pageQuery = graphql`
  query SimplePageById($pageId: String!, $siteId: String!) {
    contentfulSimplePage(id: { eq: $pageId }) {
      title
      slug
      # Check length allowed and define right field type
      subtitle
      featuredImage {
        title
        file {
          fileName
          url
        }
      }
      sections {
        ...SectionsFragment
      }
      showSignUpBanner
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;

export const promoQuery = graphql`
  fragment SimplePageInfoFragment on ContentfulSimplePage {
    title
    subtitle
    slug
    featuredImage {
      file {
        fileName
        url
      }
    }
  }
`;
