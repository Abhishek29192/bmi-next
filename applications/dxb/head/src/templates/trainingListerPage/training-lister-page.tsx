import { graphql } from "gatsby";
import React, { useMemo } from "react";
import { Hero, Grid, Section } from "@bmi-digital/components";
import { microCopy } from "@bmi/microcopies";
import { Search, Typography } from "@bmi-digital/components";
import Page from "../../components/Page";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import Image from "../../components/Image";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import ProgressIndicator from "../../components/ProgressIndicator";
import Scrim from "../../components/Scrim";
import Filters from "../../components/FiltersSidebar";
import { generateGetMicroCopy } from "../../components/MicroCopy";
import { TrainingListerPageProps } from "./types";
import TrainingCatalogue from "./components/training-catalogue";
import TrainingNoResults from "./components/training-no-results";
import { useTrainings } from "./hooks/useTrainings";
import { CataloguesContainer, SearchWrapper } from "./styles";

const TrainingListerPage = ({ data }: TrainingListerPageProps) => {
  const {
    breadcrumbs,
    breadcrumbTitle,
    featuredMedia,
    filters: defaultFilters,
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
    filters,
    handleFiltersChange,
    handleResetFilters,
    groupedTrainings,
    fetchPaginatedTrainings,
    collapseCatalogueCourses,
    initialLoading,
    total,
    searchQuery
  } = useTrainings({ defaultFilters });

  const getMicroCopy = generateGetMicroCopy(
    data.contentfulSite.resources?.microCopy
  );

  const searchLabel = getMicroCopy(microCopy.TRAINING_LISTING_SEARCH_LABEL);
  const searchPlaceholder = getMicroCopy(
    microCopy.TRAINING_LISTING_SEARCH_PLACEHOLDER
  );

  const disabledClearAllButton = useMemo(() => {
    return filters.every((filter) => !filter.value?.length);
  }, [filters]);

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
            <SearchWrapper>
              <Typography component="h3" variant="h6">
                {searchLabel}
              </Typography>
              <Search
                label={searchLabel}
                value={searchQuery}
                placeholder={searchPlaceholder}
                data-testid="training-list-search-form"
              />
            </SearchWrapper>
            <Filters
              filters={filters}
              disableClearAllBtn={disabledClearAllButton}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleResetFilters}
              filtersTitle={getMicroCopy(microCopy.TRAINING_FILTERS_TITLE)}
              clearAllBtnLabel={getMicroCopy(
                microCopy.TRAINING_FILTERS_CLEAR_ALL_LABEL
              )}
            />
          </Grid>
          <CataloguesContainer xs={12} md={12} lg={9}>
            {Object.keys(groupedTrainings).length > 0 &&
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
            {Object.keys(groupedTrainings).length === 0 && !initialLoading && (
              <TrainingNoResults searchTips={searchTips} />
            )}
          </CataloguesContainer>
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
      filters {
        filterCode
        label
        name
        options {
          label
          value
        }
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
