import React from "react";
import { graphql } from "gatsby";
import Hero, { HeroItem } from "@bmi/hero";
import Section from "@bmi/section";
import SpotlightHero from "@bmi/spotlight-hero";
import TableOfContent from "@bmi/table-of-content";
import AnchorLink from "@bmi/anchor-link";
import Breadcrumbs, {
  Data as BreadcrumbsData
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
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";
import { getCTA, LinkData } from "../components/Link";

export type Data = PageInfoData &
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
    breadcrumbs: BreadcrumbsData;
    cta: LinkData | null;
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
    featuredMedia,
    leadBlock,
    shareWidget,
    sections,
    nextBestActions,
    exploreBar,
    linkColumns,
    heroType,
    breadcrumbs,
    seo,
    featuredVideo,
    cta
  } = data.contentfulSimplePage;

  const heroProps: HeroItem = {
    title,
    children: subtitle,
    media: featuredVideo
      ? renderVideo(featuredVideo)
      : renderImage(featuredMedia, { size: "cover" }),
    CTA:
      cta &&
      getCTA(
        data.contentfulSimplePage,
        data.contentfulSite.countryCode,
        cta.label
      )
  };
  let heroLevel;
  if (heroType == "Spotlight" || heroType == "Hierarchy") {
    heroLevel = (Math.min(breadcrumbs.filter(({ slug }) => slug).length, 3) ||
      1) as 1 | 2 | 3;
  } else {
    const levelMap = {
      "Level 1": 1,
      "Level 2": 2,
      "Level 3": 3
    };
    heroLevel = levelMap[heroType] as 1 | 2 | 3;
  }

  const breadcrumbsNode = (
    <Breadcrumbs
      data={breadcrumbs}
      isDarkThemed={heroType === "Spotlight" || heroLevel !== 3}
    />
  );
  const pageData: PageData = {
    breadcrumbs,
    inputBanner: data.contentfulSimplePage.inputBanner,
    seo
  };

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      {heroType === "Spotlight" ? (
        <SpotlightHero {...heroProps} breadcrumbs={breadcrumbsNode} />
      ) : (
        <Hero level={heroLevel} {...heroProps} breadcrumbs={breadcrumbsNode} />
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
          <Breadcrumbs data={breadcrumbs} />
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
      cta {
        ...LinkFragment
      }
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
