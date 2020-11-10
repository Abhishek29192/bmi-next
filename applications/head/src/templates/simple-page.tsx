import React from "react";
import { graphql } from "gatsby";
import Breadcrumbs, { findPath } from "../components/Breadcrumbs";
import Page, { Data as PageData } from "../components/Page";
import Hero, { HeroItem } from "@bmi/hero";
import { Data as SiteData } from "../components/Site";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Data as PageInfoData } from "../components/PageInfo";
import NextBestActions, {
  Data as NextBestActionsData
} from "../components/NextBestActions";
import ExploreBar, { Data as ExploreBarData } from "../components/ExploreBar";
import Section from "@bmi/section";

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulSimplePage";
    sections: SectionsData | null;
    nextBestActions: NextBestActionsData | null;
    exploreBar: ExploreBarData | null;
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
    sections,
    nextBestActions,
    exploreBar
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
      {nextBestActions && <NextBestActions data={nextBestActions} />}
      {exploreBar && (
        <Section backgroundColor="alabaster">
          <ExploreBar data={exploreBar} />
        </Section>
      )}
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
      nextBestActions {
        ...NextBestActionsFragment
      }
      exploreBar {
        ...ExploreBarFragment
      }
      showSignUpBanner
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
