import { Hero, Section, Typography } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import BackToResults from "../components/BackToResults";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import ContactTopics, {
  Data as ContactTopicsData
} from "../components/ContactTopics";
import IframeSection, {
  Data as IframeSectionData
} from "../components/IframeSection";
import { renderImage } from "../components/Image";
import Locations, { Data as LocationsData } from "../components/Locations";
import NextBestActions, {
  Data as NextBestActionsData
} from "../components/NextBestActions";
import Page, { Data as PageData } from "../components/Page";
import { Data as PageInfoData } from "../components/PageInfo";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Data as SiteData } from "../components/Site";
import { renderVideo } from "../components/Video";
import { updateBreadcrumbTitleFromContentful } from "../utils/breadcrumbUtils";

export type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulContactUsPage";
    queriesTitle: string;
    queriesSubtitle: string;
    contentTopics: ContactTopicsData[] | null;
    sections: SectionsData | null;
    locationsTitle: string | null;
    locations: LocationsData | null;
    iframe: IframeSectionData | null;
    nextBestActions: NextBestActionsData | null;
    breadcrumbs: BreadcrumbsData;
    breadcrumbTitle: string;
  };

type Props = {
  data: {
    contentfulContactUsPage: Data;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap?: Record<string, string>;
  };
};

const ContactUsPage = ({ data, pageContext }: Props) => {
  const {
    title,
    subtitle,
    featuredMedia,
    queriesTitle,
    queriesSubtitle,
    contentTopics,
    signupBlock,
    sections,
    locationsTitle,
    locations,
    iframe,
    nextBestActions,
    breadcrumbs,
    breadcrumbTitle,
    seo,
    featuredVideo
  } = data.contentfulContactUsPage;
  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    signupBlock,
    seo,
    path: data.contentfulContactUsPage.path
  };

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={featuredMedia?.image?.file.url}
    >
      <Hero
        level={1}
        title={title}
        media={
          featuredVideo
            ? renderVideo(featuredVideo)
            : renderImage(featuredMedia, { size: "cover" })
        }
        breadcrumbs={
          <BackToResults isDarkThemed>
            <Breadcrumbs data={enhancedBreadcrumbs} isDarkThemed />
          </BackToResults>
        }
      >
        {subtitle}
      </Hero>
      <Section backgroundColor="pearl" overflowVisible>
        <Section.Title>{queriesTitle}</Section.Title>
        <Typography variant="h4" component="p">
          {queriesSubtitle}
        </Typography>
        {contentTopics && (
          <div style={{ marginTop: "40px" }}>
            <ContactTopics topics={contentTopics} />
          </div>
        )}
      </Section>
      {iframe && <IframeSection data={iframe} />}
      {sections && <Sections data={sections} />}
      {locations && (
        <Section backgroundColor="white">
          <Section.Title>{locationsTitle}</Section.Title>
          <div>
            <Locations data={locations} />
          </div>
        </Section>
      )}
      {nextBestActions && <NextBestActions data={nextBestActions} />}
      <Section backgroundColor="alabaster" isSlim>
        <Breadcrumbs data={breadcrumbs} />
      </Section>
    </Page>
  );
};

export default ContactUsPage;

export const pageQuery = graphql`
  query ContactUsPageById($pageId: String!, $siteId: String!) {
    contentfulContactUsPage(id: { eq: $pageId }) {
      ...PageInfoFragment
      ...BreadcrumbsFragment
      queriesTitle
      queriesSubtitle
      contentTopics {
        ...ContactTopicsFragment
      }
      ...PageFragment
      sections {
        ...SectionsFragment
      }
      locationsTitle
      locations {
        ...LocationsFragment
      }
      iframe {
        ...IframeSectionFragment
      }
      nextBestActions {
        ...NextBestActionsFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
