import React from "react";
import { graphql } from "gatsby";
import Page, { Data as PageData } from "../components/Page";
import Hero, { Data as HeroData } from "../components/Hero";
import { Data as SiteData } from "../components/Site";
import Sections, { Data as SectionsData } from "../components/Sections";

type Data = PageData & {
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
  const { hero, sections } = data.contentfulSimplePage;

  return (
    <Page pageData={data.contentfulSimplePage} siteData={data.contentfulSite}>
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
      showSignUpBanner
      hero {
        ...HeroFragment
      }
      sections {
        ...SectionsFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
