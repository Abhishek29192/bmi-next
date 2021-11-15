import React from "react";
import { graphql } from "gatsby";
import Button from "@bmi/button";
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
import Link, { Data as LinkData } from "../components/Link";
import { updateBreadcrumbTitleFromContentfull } from "../utils/updateBreadcrumbTitle";

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
    breadcrumbTitle: string;
    cta: LinkData | null;
  };

type Props = {
  data: {
    contentfulSimplePage: Data;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap: Record<string, string>;
  };
};

const SimplePage = ({ data, pageContext }: Props) => {
  const {
    brandLogo,
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
    breadcrumbTitle,
    seo,
    featuredVideo,
    cta
  } = data.contentfulSimplePage;
  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentfull(
    breadcrumbs,
    breadcrumbTitle
  );
  const heroProps: HeroItem = {
    title,
    children: subtitle,
    media: featuredVideo
      ? renderVideo(featuredVideo)
      : renderImage(featuredMedia, { size: "cover" }),
    cta: cta && (
      <Link component={Button} data={cta}>
        {cta.label}
      </Link>
    )
  };
  let heroLevel;
  if (heroType == "Spotlight" || heroType == "Hierarchy") {
    heroLevel = (Math.min(
      enhancedBreadcrumbs.filter(({ slug }) => slug).length,
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

  const breadcrumbsNode = (
    <Breadcrumbs
      data={enhancedBreadcrumbs}
      isDarkThemed={heroType === "Spotlight" || heroLevel !== 3}
    />
  );
  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    inputBanner: data.contentfulSimplePage.inputBanner,
    seo
  };

  return (
    <Page
      brand={brandLogo}
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={featuredMedia?.image?.file.url}
    >
      {heroType === "Spotlight" ? (
        <SpotlightHero
          {...heroProps}
          brand={brandLogo}
          breadcrumbs={breadcrumbsNode}
        />
      ) : (
        <Hero
          brand={brandLogo}
          level={heroLevel}
          {...heroProps}
          breadcrumbs={breadcrumbsNode}
        />
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
          <Breadcrumbs data={enhancedBreadcrumbs} />
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
      date
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
