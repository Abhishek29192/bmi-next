import {
  HeroProps,
  Section,
  SpotlightHeroProps,
  TableOfContent,
  useIsClient
} from "@bmi-digital/components";
import { styled } from "@mui/material/styles";
import { graphql, Script } from "gatsby";
import React from "react";
import BackToResults from "../../../components/BackToResults";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../../../components/Breadcrumbs";
import LeadBlockSection, {
  Data as LeadBlockSectionData
} from "../../../components/LeadBlockSection";
import Page, { Data as PageData } from "../../../components/Page";
import { Data as PageInfoData } from "../../../components/PageInfo";
import { Data as SEOContentData } from "../../../components/SEOContent";
import Sections, { Data as SectionsData } from "../../../components/Sections";
import { Data as SiteData } from "../../../components/Site";
import { useConfig } from "../../../contexts/ConfigProvider";
import { updateBreadcrumbTitleFromContentful } from "../../../utils/breadcrumbUtils";
import {
  generateHeroLevel,
  generateHeroProps
} from "../../../utils/heroLevelUtils";
import { renderHero } from "../../../utils/heroTypesUI";
import ProgressIndicator from "../../../components/ProgressIndicator";

export type Data = Pick<
  PageInfoData,
  "id" | "title" | "slug" | "path" | "subtitle"
> & {
  __typename: "ContentfulCookiePolicyPage";
  breadcrumbs: BreadcrumbsData;
  leadBlock: LeadBlockSectionData | null;
  sections: SectionsData | null;
  heroType: "Level 1" | "Level 2" | "Level 3" | null;
  seo: SEOContentData | null;
};

export type Props = {
  data: {
    contentfulCookiePolicyPage: Data;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap?: Record<string, string>;
  };
};

export const StyledSpinner = styled("div")(({ theme }) => ({
  backgroundColor: theme.colours.white,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "calc(100vh - 100px)" /* container margins and paddings */
}));

const Loading = () => (
  <StyledSpinner>
    <ProgressIndicator size={40} />
  </StyledSpinner>
);

export const StyledOnetrustContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.colours.white,
  padding: "0 !important",
  [`& > div`]: {
    display: "block"
  }
}));

const CookiePolicyPage = ({ data, pageContext }: Props) => {
  const { isClient } = useIsClient();
  const { title, subtitle, leadBlock, sections, heroType, breadcrumbs, seo } =
    data.contentfulCookiePolicyPage;
  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    ""
  );

  const { isBrandProviderEnabled } = useConfig();
  const heroLevel = generateHeroLevel(heroType, enhancedBreadcrumbs);
  const heroProps: HeroProps | SpotlightHeroProps = generateHeroProps(
    title,
    heroLevel,
    subtitle,
    null,
    null,
    undefined
  );

  const isDarkThemed = heroLevel !== 3;
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
    seo: seo,
    path: data.contentfulCookiePolicyPage.path,
    signupBlock: null
  };

  const isHeroKeyLine = Boolean(isBrandProviderEnabled);

  return (
    <Page
      brand={null}
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext.variantCodeToPathMap}
      ogImageUrl={""}
    >
      {renderHero(heroProps, breadcrumbsNode, heroType, {
        isHeroKeyLine: isHeroKeyLine
      })}
      <TableOfContent>
        {leadBlock && <LeadBlockSection data={leadBlock} />}
        {isClient && (
          <Section backgroundColor="white">
            <StyledOnetrustContainer
              id="ot-sdk-cookie-policy"
              data-testid="ot-sdk-cookie-policy"
            />
          </Section>
        )}
        {sections && <Sections data={sections} startIndex={+!!leadBlock} />}
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
      {!isClient && <Loading />}
    </Page>
  );
};

export const Head = () => {
  const { oneTrustId } = useConfig();
  return (
    <>
      {Boolean(oneTrustId) && (
        <Script
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          type="text/javascript"
          data-domain-script={oneTrustId}
          strategy="post-hydrate"
        />
      )}
    </>
  );
};

export default CookiePolicyPage;

export const pageQuery = graphql`
  query CookiePolicyPageById($pageId: String!, $siteId: String!) {
    contentfulCookiePolicyPage(id: { eq: $pageId }) {
      title
      slug
      path
      heroType
      subtitle
      seo {
        ...SEOContentFragment
      }
      ...BreadcrumbsFragment
      leadBlock {
        ...LeadBlockSectionFragment
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
