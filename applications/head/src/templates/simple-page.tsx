import React from "react";
import { graphql } from "gatsby";
import Breadcrumbs, { findPath } from "../components/Breadcrumbs";
import Page, { Data as PageData } from "../components/Page";
import Hero, { HeroItem } from "@bmi/hero";
import { Data as SiteData } from "../components/Site";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Data as PageInfoData } from "../components/PageInfo";

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulSimplePage";
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
  const heroLevel = (Math.min(
    findPath(data.contentfulSimplePage.slug, data.contentfulSite.menuNavigation)
      .length + 1,
    3
  ) || 1) as 1 | 2 | 3;

  return (
    <Page
      title={title}
      pageData={data.contentfulSimplePage}
      siteData={data.contentfulSite}
    >
      <Hero
        level={heroLevel}
        {...heroProps}
        breadcrumbs={
          <Breadcrumbs
            title={title}
            slug={data.contentfulSimplePage.slug}
            menuNavigation={data.contentfulSite.menuNavigation}
            isDarkThemed={heroLevel !== 3}
          />
        }
      />
      {sections && <Sections data={sections} />}
    </Page>
  );
};

export default SimplePage;

export const pageQuery = graphql`
  query SimplePageById($pageId: String!, $siteId: String!) {
    contentfulSimplePage(id: { eq: $pageId }) {
      ...PageInfoFragment
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
