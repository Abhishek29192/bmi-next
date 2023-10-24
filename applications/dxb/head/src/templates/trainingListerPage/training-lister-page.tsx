import { graphql } from "gatsby";
import React from "react";
import { Hero, Grid, Section } from "@bmi-digital/components";
import { microCopy } from "@bmi/microcopies";
import {
  Search,
  Button,
  ButtonProps,
  Typography
} from "@bmi-digital/components";
import Page from "../../components/Page";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import Image from "../../components/Image";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import ProgressIndicator from "../../components/ProgressIndicator";
import Scrim from "../../components/Scrim";
import withGTM from "../../utils/google-tag-manager";
import { generateGetMicroCopy } from "../../components/MicroCopy";
import { TrainingListerPageProps } from "./types";
import TrainingCatalogue from "./components/training-catalogue";
import TrainingNoResults from "./components/training-no-results";
import { useTrainings } from "./hooks/useTrainings";

const TrainingListerPage = ({ data }: TrainingListerPageProps) => {
  const {
    breadcrumbs,
    breadcrumbTitle,
    featuredMedia,
    path,
    seo,
    subtitle,
    title,
    searchTips
  } = data.contentfulTrainingListerPage;

  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs || [],
    breadcrumbTitle
  );

  const {
    groupedTrainings,
    fetchPaginatedTrainings,
    collapseCatalogueCourses,
    initialLoading,
    total,
    searchQuery
  } = useTrainings();

  const GTMButton = withGTM<ButtonProps>(Button);

  const getMicroCopy = generateGetMicroCopy(
    data.contentfulSite.resources?.microCopy
  );

  const searchLabel = getMicroCopy(microCopy.TRAINING_LISTING_SEARCH_LABEL);
  const searchPlaceholder = getMicroCopy(
    microCopy.TRAINING_LISTING_SEARCH_PLACEHOLDER
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
          <Grid xs={12} md={12} lg={3}>
            {/** placeholder for the filters */}
            {/** p={0} needs to be removed once we add search or filters */}
            <Typography component="h3" variant="h6">
              {searchLabel}
            </Typography>
            <Search
              buttonComponent={(props) => (
                <GTMButton
                  gtm={{
                    id: "training-list-search",
                    label: { searchLabel }
                  }}
                  {...props}
                />
              )}
              label={searchLabel}
              value={searchQuery}
              placeholder={searchPlaceholder}
            />
          </Grid>
          <Grid xs={12} md={12} lg={9}>
            {Object.entries(groupedTrainings).length > 0 &&
              Object.entries(groupedTrainings).map(([catalogueId, courses]) => (
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
            {Object.entries(groupedTrainings).length === 0 &&
              !initialLoading && <TrainingNoResults searchTips={searchTips} />}
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
      searchTips {
        ...TitleWithContentFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
