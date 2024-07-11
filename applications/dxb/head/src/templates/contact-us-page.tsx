import React from "react";
import Hero from "@bmi-digital/components/hero";
import Section from "@bmi-digital/components/section";
import Typography from "@bmi-digital/components/typography";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { graphql } from "gatsby";
import BackToResults from "../components/BackToResults";
import Breadcrumbs from "../components/Breadcrumbs";
import ContactTopics from "../components/ContactTopics";
import IframeSection from "../components/IframeSection";
import Locations from "../components/Locations";
import Page from "../components/Page";
import Sections from "../components/Sections";
import NextBestActions from "../components/next-best-actions/NextBestActions";
import { updateBreadcrumbTitleFromContentful } from "../utils/breadcrumbUtils";
import createImageProps from "../components/image/createImageProps";
import createVideoProps from "../components/video/createVideoProps";
import type { Data as BreadcrumbsData } from "../components/Breadcrumbs";
import type { Data as ContactTopicsData } from "../components/ContactTopics";
import type { Data as IframeSectionData } from "../components/IframeSection";
import type { Data as LocationsData } from "../components/Locations";
import type { Data as PageData } from "../components/Page";
import type { Data as PageInfoData } from "../components/PageInfo";
import type { Data as SectionsData } from "../components/Sections";
import type { Data as SiteData } from "../components/Site";
import type { Data as NextBestActionsData } from "../components/next-best-actions/NextBestActions";
import type { ImageWidths } from "../components/image/types";

export type Data = Omit<PageInfoData, "__typename" | "sections"> &
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

const mediaWidths: ImageWidths = [593, 713, 408, 708, 988];

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
      ogImageUrl={featuredMedia?.image.url}
    >
      <Hero
        level={1}
        title={title}
        media={
          featuredVideo
            ? createVideoProps({
                ...featuredVideo,
                previewMediaWidths: mediaWidths
              })
            : featuredMedia
              ? createImageProps({
                  ...featuredMedia,
                  size: "cover",
                  loading: "eager",
                  widths: mediaWidths
                })
              : undefined
        }
        breadcrumbs={
          <BackToResults isDarkThemed data-testid="breadcrumbs-section-top">
            <Breadcrumbs
              data={enhancedBreadcrumbs}
              isDarkThemed
              data-testid="contact-us-page-breadcrumbs-top"
            />
          </BackToResults>
        }
      >
        {subtitle}
      </Hero>
      <Section
        backgroundColor="pearl"
        overflowVisible
        data-testid={`contact-us-page-queries-section-${replaceSpaces(
          queriesTitle
        )}`}
      >
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
        <Section
          backgroundColor="white"
          data-testid={`contact-us-page-locations-section-${replaceSpaces(
            queriesTitle
          )}`}
        >
          <Section.Title>{locationsTitle}</Section.Title>
          <div>
            <Locations data={locations} />
          </div>
        </Section>
      )}
      {nextBestActions && <NextBestActions data={nextBestActions} />}
      <Section
        backgroundColor="alabaster"
        isSlim
        data-testid="breadcrumbs-section-bottom"
      >
        <Breadcrumbs
          data={breadcrumbs}
          data-testid="contact-us-page-breadcrumbs-bottom"
        />
      </Section>
    </Page>
  );
};

export default ContactUsPage;

export const pageQuery = graphql`
  query ContactUsPageById($pageId: String!, $siteId: String!) {
    contentfulContactUsPage(id: { eq: $pageId }) {
      ...PageInfoHeroFragment
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
