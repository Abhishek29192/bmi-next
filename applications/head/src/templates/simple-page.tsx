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
import SpotlightHero from "@bmi/spotlight-hero";
import LeadBlockSection, {
  Data as LeadBlockSectionData
} from "../components/LeadBlockSection";
import LinkColumnsSection, {
  Data as LinkColumnsSectionData
} from "../components/LinkColumnsSection";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../components/ShareWidgetSection";
import TableOfContent from "@bmi/table-of-content";
import AnchorLink from "@bmi/anchor-link";

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulSimplePage";
    leadBlock: LeadBlockSectionData | null;
    shareWidget: ShareWidgetSectionData | null;
    sections: SectionsData | null;
    nextBestActions: NextBestActionsData | null;
    exploreBar: ExploreBarData | null;
    linkColumns: LinkColumnsSectionData | null;
    heroType: "Hierarchy" | "Spotlight" | null;
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
    leadBlock,
    shareWidget,
    sections,
    nextBestActions,
    exploreBar,
    linkColumns,
    heroType
  } = data.contentfulSimplePage;
  const heroProps: HeroItem = {
    title,
    children: subtitle,
    imageSource: featuredImage?.resize.src
  };
  const heroLevel = (Math.min(
    findPath(data.contentfulSimplePage.slug, data.contentfulSite.menuNavigation)
      .length + 1,
    3
  ) || 1) as 1 | 2 | 3;
  const breadcrumbs = (
    <Breadcrumbs
      title={title}
      slug={data.contentfulSimplePage.slug}
      menuNavigation={data.contentfulSite.menuNavigation}
      isDarkThemed={heroType === "Spotlight" || heroLevel !== 3}
    />
  );
  const pageData: PageData = {
    slug: data.contentfulSimplePage.slug,
    inputBanner: data.contentfulSimplePage.inputBanner
  };

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      {heroType === "Spotlight" ? (
        <SpotlightHero {...heroProps} breadcrumbs={breadcrumbs} />
      ) : (
        <Hero level={heroLevel} {...heroProps} breadcrumbs={breadcrumbs} />
      )}
      <TableOfContent
        renderLink={(sectionId, title) => (
          <AnchorLink
            action={{
              model: "htmlLink",
              href: `#${sectionId}`
            }}
          >
            {title}
          </AnchorLink>
        )}
      >
        {shareWidget && <ShareWidgetSection data={shareWidget} />}
        {leadBlock && <LeadBlockSection data={leadBlock} />}
        {sections && <Sections data={sections} startIndex={+!!leadBlock} />}
        {linkColumns && <LinkColumnsSection data={linkColumns} />}
        {shareWidget && <ShareWidgetSection data={shareWidget} />}
        {nextBestActions && <NextBestActions data={nextBestActions} />}
        {exploreBar && (
          <Section backgroundColor="alabaster">
            <ExploreBar data={exploreBar} />
          </Section>
        )}
        <Section backgroundColor="alabaster" isSlim>
          <Breadcrumbs
            title={title}
            slug={data.contentfulSimplePage.slug}
            menuNavigation={data.contentfulSite.menuNavigation}
          />
        </Section>
      </TableOfContent>
    </Page>
  );
};

export default SimplePage;

export const pageQuery = graphql`
  query SimplePageById($pageId: String!, $siteId: String!) {
    contentfulSimplePage(id: { eq: $pageId }) {
      ...PageInfoFragment
      heroType
      leadBlock {
        ...LeadBlockSectionFragment
      }
      shareWidget {
        ...ShareWidgetSectionFragment
      }
      sections {
        ...SectionsFragment
      }
      nextBestActions {
        ...NextBestActionsFragment
      }
      exploreBar {
        ...ExploreBarFragment
      }
      linkColumns {
        ...LinkColumnsSectionFragment
      }
      ...PageFragment
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
