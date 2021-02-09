import React from "react";
import { graphql } from "gatsby";
import Hero, { HeroItem } from "@bmi/hero";
import Section from "@bmi/section";
import SpotlightHero from "@bmi/spotlight-hero";
import TableOfContent from "@bmi/table-of-content";
import AnchorLink from "@bmi/anchor-link";
import Breadcrumbs, {
  Data as BreadcrumbsData,
  findPath
} from "../components/Breadcrumbs";
import Page, { Data as PageData } from "../components/Page";
import { Data as SiteData } from "../components/Site";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Data as PageInfoData } from "../components/PageInfo";
import NextBestActions, {
  Data as NextBestActionsData
} from "../components/NextBestActions";
import ExploreBar, { Data as ExploreBarData } from "../components/ExploreBar";
import LeadBlockSection, {
  Data as LeadBlockSectionData
} from "../components/LeadBlockSection";
import LinkColumnsSection, {
  Data as LinkColumnsSectionData
} from "../components/LinkColumnsSection";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../components/ShareWidgetSection";

type Data = BreadcrumbsData &
  PageInfoData &
  PageData & {
    __typename: "ContentfulSimplePage";
    leadBlock: LeadBlockSectionData | null;
    shareWidget: ShareWidgetSectionData | null;
    sections: SectionsData | null;
    nextBestActions: NextBestActionsData | null;
    exploreBar: ExploreBarData | null;
    linkColumns: LinkColumnsSectionData | null;
    heroType:
      | "Hierarchy"
      | "Spotlight"
      | "Level 1"
      | "Level 2"
      | "Level 3"
      | null;
    parentPage: PageInfoData | null;
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
    slug,
    featuredImage,
    leadBlock,
    shareWidget,
    sections,
    nextBestActions,
    exploreBar,
    linkColumns,
    heroType,
    parentPage
  } = data.contentfulSimplePage;
  const heroProps: HeroItem = {
    title,
    children: subtitle,
    imageSource: featuredImage?.resize.src
  };
  const parentSlug = parentPage?.slug;
  let heroLevel;
  if (heroType == "Spotlight" || heroType == "Hierarchy") {
    heroLevel = (Math.min(
      findPath(parentSlug || slug, data.contentfulSite.menuNavigation).length +
        (parentSlug ? 2 : 1),
      3
    ) || 1) as 1 | 2 | 3;
  } else {
    const levelMap = {
      "Level 1": 1,
      "Level 2": 2,
      "Level 3": 3
    };
    heroLevel = levelMap[heroType] as 1 | 2 | 3;
  }

  const breadcrumbs = (
    <Breadcrumbs
      data={{ title, slug, parentPage }}
      menuNavigation={data.contentfulSite.menuNavigation}
      isDarkThemed={heroType === "Spotlight" || heroLevel !== 3}
    />
  );
  const pageData: PageData = {
    slug,
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
            data={{ title, slug, parentPage }}
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
      ...PageFragment
      ...BreadcrumbsFragment
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
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
