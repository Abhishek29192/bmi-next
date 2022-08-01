import { HeroItem, Section, TableOfContent } from "@bmi/components";
import { graphql } from "gatsby";
import React from "react";
import BackToResults from "../../../components/BackToResults";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../../../components/Breadcrumbs";
import ExploreBar, {
  Data as ExploreBarData
} from "../../../components/ExploreBar";
import { Data as LinkData } from "../../../components/Link";
import LinkColumnsSection, {
  Data as LinkColumnsSectionData
} from "../../../components/LinkColumnsSection";
import NextBestActions, {
  Data as NextBestActionsData
} from "../../../components/NextBestActions";
import Page, { Data as PageData } from "../../../components/Page";
import { Data as PageInfoData } from "../../../components/PageInfo";
import Sections, { Data as SectionsData } from "../../../components/Sections";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../../../components/ShareWidgetSection";
import { Data as SiteData } from "../../../components/Site";
import { useConfig } from "../../../contexts/ConfigProvider";
import { updateBreadcrumbTitleFromContentful } from "../../../utils/breadcrumbUtils";
import {
  generateHeroLevel,
  generateHeroProps
} from "../../../utils/heroLevelUtils";
import { renderHero } from "../../../utils/heroTypesUI";
import LeadBlockSection, {
  Data as LeadBlockSectionData
} from "./LeadBlockSection";

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

export type Props = {
  data: {
    contentfulSimplePage: Data;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap?: Record<string, string>;
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
  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  const {
    config: { isBrandProviderEnabled }
  } = useConfig();
  const heroProps: HeroItem = generateHeroProps(
    title,
    subtitle,
    featuredVideo,
    featuredMedia,
    cta
  );
  const heroLevel = generateHeroLevel(heroType, enhancedBreadcrumbs);

  const isDarkThemed = heroType === "Spotlight" || heroLevel !== 3;
  const breadcrumbsNode = (
    <BackToResults isDarkThemed={isDarkThemed}>
      <Breadcrumbs data={enhancedBreadcrumbs} isDarkThemed={isDarkThemed} />
    </BackToResults>
  );

  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    signupBlock: data.contentfulSimplePage.signupBlock,
    seo,
    path: data.contentfulSimplePage.path
  };

  const isHeroKeyLine = Boolean(isBrandProviderEnabled && brandLogo);

  return (
    <Page
      brand={brandLogo}
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext.variantCodeToPathMap}
      ogImageUrl={featuredMedia?.image?.file.url}
    >
      {renderHero(heroProps, breadcrumbsNode, heroLevel, heroType, {
        isHeroKeyLine: isHeroKeyLine
      })}
      <TableOfContent>
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
          <BackToResults>
            <Breadcrumbs data={enhancedBreadcrumbs} />
          </BackToResults>
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
