import { graphql } from "gatsby";
import React from "react";
import { Hero, Grid, Section } from "@bmi-digital/components";
import Page from "../../components/Page";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import Image from "../../components/Image";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import ProgressIndicator from "../../components/ProgressIndicator";
import Scrim from "../../components/Scrim";
import { TrainingListerPageProps } from "./types";
import TrainingCatalogue from "./components/training-catalogue";
import { useTrainings } from "./hooks/useTrainings";

const TrainingListerPage = ({ data }: TrainingListerPageProps) => {
  const {
    breadcrumbs,
    breadcrumbTitle,
    featuredMedia,
    path,
    seo,
    subtitle,
    title
  } = data.contentfulTrainingListerPage;

  const {
    groupedTrainings,
    fetchPaginatedTrainings,
    collapseCatalogueCourses,
    initialLoading,
    total
  } = useTrainings();

  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs || [],
    breadcrumbTitle
  );

  return (
    <Page
      title={title}
      siteData={data.contentfulSite}
      ogImageUrl={featuredMedia.image.file.url}
      pageData={{
        seo,
        path,
        signupBlock: null,
        breadcrumbs: enhancedBreadcrumbs
      }}
    >
      {initialLoading && (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      )}
      <Hero
        level={1}
        title={title}
        media={<Image {...featuredMedia} size="cover" />}
        breadcrumbs={
          <BackToResults isDarkThemed data-testid="breadcrumbs-hero-section">
            <Breadcrumbs
              data={enhancedBreadcrumbs}
              isDarkThemed
              data-testid="training-landing-page-hero-breadcrumbs"
            />
          </BackToResults>
        }
      >
        {subtitle}
      </Hero>
      <Section>
        <Grid container spacing={3}>
          <Grid xs={12} md={12} lg={3} p={0}>
            {/** placeholder for the filters */}
            {/** p={0} needs to be removed once we add search or filters */}
          </Grid>
          <Grid xs={12} md={12} lg={9}>
            {Object.entries(groupedTrainings).map(([catalogueId, courses]) => (
              <TrainingCatalogue
                key={`training-catalogue-${catalogueId}`}
                defaultImageUrl={featuredMedia.image.file.url}
                courses={courses}
                countryCode={data.contentfulSite.countryCode}
                fetchPaginatedTrainings={fetchPaginatedTrainings}
                collapseCatalogueCourses={collapseCatalogueCourses}
                // eslint-disable-next-line security/detect-object-injection
                total={total[catalogueId]}
              />
            ))}
          </Grid>
        </Grid>
      </Section>
      <Section data-testid="training-lister-page-breadcrumbs-section-bottom">
        <BackToResults>
          <Breadcrumbs
            data={enhancedBreadcrumbs}
            data-testid="training-lister-page-breadcrumbs-bottom"
          />
        </BackToResults>
      </Section>
    </Page>
  );
};

export default TrainingListerPage;

export const pageQuery = graphql`
  query TrainingListerPageById($pageId: String!, $siteId: String!) {
    contentfulTrainingListerPage(id: { eq: $pageId }) {
      ...BreadcrumbsFragment
      path
      slug
      title
      subtitle
      featuredMedia {
        ...ImageDocumentFragment
      }
      seo {
        ...SEOContentFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
