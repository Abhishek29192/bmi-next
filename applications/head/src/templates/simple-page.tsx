import React from "react";
import { graphql } from "gatsby";
import Page, { Data as PageData } from "../components/Page";
import Hero, { Data as HeroData } from "../components/Hero";
import { Data as SiteData } from "../components/Site";
import Sections, { Data as SectionsData } from "../components/Sections";

type PageInfoData = {
  title: string;
  subtitle: string | null;
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
    hero: HeroData | null;
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
  const hero: HeroData = {
    title,
    subtitle: {
      subtitle
    },
    image: featuredImage,
    cta: null,
    // TODO: Remove the following?
    brandLogo: null
  };

  return (
    <Page
      title={title}
      pageData={data.contentfulSimplePage}
      siteData={data.contentfulSite}
    >
      <Hero data={[hero]} />
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
