import { InputValue } from "@bmi/form";
import Hero from "@bmi/hero";
import LeadBlock from "@bmi/lead-block";
import Search from "@bmi/search";
import Section from "@bmi/section";
import Typography from "@bmi/typography";
import { graphql } from "gatsby";
import React, { FormEvent, useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import ExploreBar from "../components/ExploreBar";
import NextBestActions from "../components/NextBestActions";
import Page from "../components/Page";
import ProgressIndicator from "../components/ProgressIndicator";
import RichText from "../components/RichText";
import Scrim from "../components/Scrim";
import { Data as SiteData, SiteContext } from "../components/Site";
import { Data as TitleWithContentData } from "../components/TitleWithContent";

type Props = {
  data: {
    contentfulSite: SiteData;
  };
};

type QueryInput = Extract<string, InputValue>;

const SearchTips = ({
  title,
  content
}: Omit<TitleWithContentData, "__typename">) => (
  <LeadBlock.Content.Section>
    <Typography variant="h5">{title}</Typography>
    <RichText document={content} />
  </LeadBlock.Content.Section>
);

const SearchSidebarItems = ({
  title,
  content
}: Omit<TitleWithContentData, "__typename">) => (
  <LeadBlock.Card theme="pearl">
    <LeadBlock.Card.Section>
      <LeadBlock.Card.Heading hasUnderline>{title}</LeadBlock.Card.Heading>
      <LeadBlock.Card.Content>
        <RichText document={content} />
      </LeadBlock.Card.Content>
    </LeadBlock.Card.Section>
  </LeadBlock.Card>
);

const SearchPage = ({ data: { contentfulSite } }: Props) => {
  const QUERY_KEY = "q";
  const params = new URLSearchParams(
    typeof window !== `undefined` ? window.location.search : ""
  );
  const [query, setQuery] = useState<QueryInput>(params.get(QUERY_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState([]);
  const { countryCode, menuNavigation, resources } = contentfulSite;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
    values: Record<typeof QUERY_KEY, QueryInput>
  ) => {
    event.preventDefault();
    params.set(QUERY_KEY, values[QUERY_KEY]);
    setQuery(values[QUERY_KEY]);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  };

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      setTimeout(() => {
        // @todo: Send off search query.
        setResults(query === "demo" ? [1, 2, 3] : []);
        setIsLoading(false);
      }, 1000);
    }
  }, [query]);

  return (
    <SiteContext.Consumer>
      {({ getMicroCopy }) => {
        const title = query
          ? getMicroCopy("searchPage.title.withQuery").replace(
              "{{query}}",
              query
            )
          : getMicroCopy("searchPage.title");
        const noResultsTitle = getMicroCopy(
          "searchPage.noResultsTitle"
        ).replace("{{query}}", query);

        return (
          <Page
            title={query && results.length ? title : noResultsTitle}
            pageData={{ slug: "search", inputBanner: null }}
            siteData={contentfulSite}
          >
            {isLoading ? (
              <Scrim theme="light">
                <ProgressIndicator theme="light" />
              </Scrim>
            ) : null}
            <Hero
              level={3}
              title={query && !results.length ? noResultsTitle : title}
              breadcrumbs={
                <Breadcrumbs
                  title={title}
                  slug="search"
                  menuNavigation={menuNavigation}
                />
              }
            />
            <Section isSlim>
              <LeadBlock>
                <LeadBlock.Content>
                  <LeadBlock.Content.Section>
                    <Search
                      action={`/${countryCode}/search`}
                      buttonText={
                        query
                          ? getMicroCopy("searchPage.searchText")
                          : getMicroCopy("searchPage.title")
                      }
                      defaultValue={query || null}
                      fieldName={QUERY_KEY}
                      onSubmit={handleSubmit}
                      helperText={getMicroCopy("searchPage.helperText")}
                      placeholder={getMicroCopy("searchPage.placeholder")}
                    />
                  </LeadBlock.Content.Section>
                  {query &&
                    !results.length &&
                    resources.searchPageSearchTips && (
                      <SearchTips
                        title={resources.searchPageSearchTips.title}
                        content={resources.searchPageSearchTips.content}
                      />
                    )}
                </LeadBlock.Content>
                {query &&
                  !results.length &&
                  resources.searchPageSidebarItems && (
                    <SearchSidebarItems
                      title={resources.searchPageSidebarItems.title}
                      content={resources.searchPageSidebarItems.content}
                    />
                  )}
              </LeadBlock>
            </Section>
            {query && results.length ? (
              <Section isSlim>
                Results
                {/* @todo: Display results */}
              </Section>
            ) : null}
            {query && !results.length
              ? resources.searchPageNextBestActions && (
                  <NextBestActions data={resources.searchPageNextBestActions} />
                )
              : resources.searchPageExploreBar && (
                  <Section backgroundColor="pearl" isSlim>
                    <ExploreBar data={resources.searchPageExploreBar} />
                  </Section>
                )}
          </Page>
        );
      }}
    </SiteContext.Consumer>
  );
};

export default SearchPage;

export const pageQuery = graphql`
  query SearchPageBySiteId($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
