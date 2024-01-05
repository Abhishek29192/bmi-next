import { HeroProps } from "@bmi-digital/components/hero";
import Section from "@bmi-digital/components/section";
import { SpotlightHeroProps } from "@bmi-digital/components/spotlight-hero";
import TableOfContent from "@bmi-digital/components/table-of-content";
import { graphql } from "gatsby";
import React from "react";
import BackToResults from "../../../components/BackToResults";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../../../components/Breadcrumbs";
import ExploreBar, {
  Data as ExploreBarData
} from "../../../components/ExploreBar";
import LeadBlockSection, {
  Data as LeadBlockSectionData
} from "../../../components/LeadBlockSection";
import LinkColumnsSection, {
  Data as LinkColumnsSectionData
} from "../../../components/LinkColumnsSection";
import Page, { Data as PageData } from "../../../components/Page";
import { Data as PageInfoData } from "../../../components/PageInfo";
import Sections, { Data as SectionsData } from "../../../components/Sections";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../../../components/ShareWidgetSection";
import { Data as SiteData } from "../../../components/Site";
import { Data as LinkData } from "../../../components/link/types";
import NextBestActions, {
  Data as NextBestActionsData
} from "../../../components/next-best-actions/NextBestActions";
import { useConfig } from "../../../contexts/ConfigProvider";
import { updateBreadcrumbTitleFromContentful } from "../../../utils/breadcrumbUtils";
import {
  generateHeroLevel,
  generateHeroProps
} from "../../../utils/heroLevelUtils";
import { renderHero } from "../../../utils/heroTypesUI";
import Protected from "../../../pages/protected";

export type Data = Omit<PageInfoData, "sections"> &
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
    isSimplePageProtected?: boolean;
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
  const { contentfulSimplePage: simplePageData } = data;
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
  const { isBrandProviderEnabled } = useConfig();

  const heroLevel = generateHeroLevel(heroType, enhancedBreadcrumbs);
  const heroProps: HeroProps | SpotlightHeroProps = generateHeroProps(
    title,
    heroLevel,
    subtitle,
    featuredVideo,
    featuredMedia,
    cta
  );

  const isDarkThemed = heroType === "Spotlight" || heroLevel !== 3;
  const breadcrumbsNode = (
    <BackToResults isDarkThemed={isDarkThemed}>
      <Breadcrumbs
        data={enhancedBreadcrumbs}
        isDarkThemed={isDarkThemed}
        data-testid="simple-page-breadcrumbs-top"
      />
    </BackToResults>
  );

  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    signupBlock: data.contentfulSimplePage.signupBlock,
    seo: simplePageData.isSimplePageProtected
      ? {
          ...seo,
          noIndex: true,
          metaTitle: seo?.metaTitle ?? "",
          metaDescription: seo?.metaDescription ?? ""
        }
      : seo,
    path: data.contentfulSimplePage.path
  };

  const isHeroKeyLine = Boolean(isBrandProviderEnabled && brandLogo);

  return (
    <Protected isPageProtected={simplePageData.isSimplePageProtected}>
      <Page
        brand={brandLogo}
        title={title}
        pageData={pageData}
        siteData={data.contentfulSite}
        variantCodeToPathMap={pageContext.variantCodeToPathMap}
        ogImageUrl={featuredMedia?.src}
      >
        {renderHero(heroProps, breadcrumbsNode, heroType, {
          isHeroKeyLine: isHeroKeyLine
        })}
        <TableOfContent>
          {shareWidget && (
            <ShareWidgetSection
              data={shareWidget}
              data-testid="share-widget-section-top"
            />
          )}
          {leadBlock && <LeadBlockSection data={leadBlock} />}
          {sections && <Sections data={sections} startIndex={+!!leadBlock} />}
          {linkColumns && <LinkColumnsSection data={linkColumns} />}
          {shareWidget && (
            <ShareWidgetSection
              data={shareWidget}
              data-testid="share-widget-section-bottom"
            />
          )}
          {nextBestActions && <NextBestActions data={nextBestActions} />}
          {exploreBar && (
            <Section
              backgroundColor="alabaster"
              data-testid="explorer-bar-section"
            >
              <ExploreBar data={exploreBar} />
            </Section>
          )}
          <Section
            backgroundColor="alabaster"
            isSlim
            data-testid="breadcrumbs-section-bottom"
          >
            <BackToResults>
              <Breadcrumbs
                data={enhancedBreadcrumbs}
                data-testid="simple-page-breadcrumbs-bottom"
              />
            </BackToResults>
          </Section>
        </TableOfContent>
      </Page>
    </Protected>
  );
};

export default SimplePage;

export const pageQuery = graphql`
  query SimplePageById($pageId: String!, $siteId: String!) {
    contentfulSimplePage(id: { eq: $pageId }) {
      ...PageInfoHeroFragment
      ...PageFragment
      ...BreadcrumbsFragment
      heroType
      isSimplePageProtected
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
