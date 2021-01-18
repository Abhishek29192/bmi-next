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
import { generateGetMicroCopy } from "../components/MicroCopy";
import NextBestActions from "../components/NextBestActions";
import Page from "../components/Page";
import ProgressIndicator from "../components/ProgressIndicator";
import RichText from "../components/RichText";
import Scrim from "../components/Scrim";
import { Data as SiteData } from "../components/Site";
import { Data as TitleWithContentData } from "../components/TitleWithContent";

type Props = {
  data: {
    contentfulSite: SiteData;
  };
};

type PageState = "default" | "hasResults" | "hasNoResults";

type Results = any[]; // @todo

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
  const [pageState, setPageState] = useState<PageState>("default");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Results>([]);
  const { countryCode, menuNavigation, resources } = contentfulSite;
  const getMicroCopy = generateGetMicroCopy(resources.microCopy);
  const defaultTitle = getMicroCopy("searchPage.title");

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

  const getTitle = () => {
    switch (pageState) {
      case "hasResults":
        return getMicroCopy("searchPage.title.withQuery").replace(
          "{{query}}",
          query
        );
      case "hasNoResults":
        return getMicroCopy("searchPage.noResultsTitle").replace(
          "{{query}}",
          query
        );
      case "default":
      default:
        return defaultTitle;
    }
  };

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      setTimeout(() => {
        // @todo: Send off search query, DEMO PURPOSES ONLY.
        if (query === "demo") {
          setResults([1, 2, 3]);
          setPageState("hasResults");
        } else {
          setResults([]);
          setPageState("hasNoResults");
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [query]);

  return (
    <Page
      title={getTitle()}
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
        title={getTitle()}
        breadcrumbs={
          <Breadcrumbs
            title={getTitle()}
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
                  query ? getMicroCopy("searchPage.searchText") : defaultTitle
                }
                defaultValue={query || null}
                fieldName={QUERY_KEY}
                onSubmit={handleSubmit}
                helperText={getMicroCopy("searchPage.helperText")}
                placeholder={getMicroCopy("searchPage.placeholder")}
              />
            </LeadBlock.Content.Section>
            {pageState === "hasNoResults" && resources.searchPageSearchTips && (
              <SearchTips
                title={resources.searchPageSearchTips.title}
                content={resources.searchPageSearchTips.content}
              />
            )}
          </LeadBlock.Content>
          {pageState === "hasNoResults" && resources.searchPageSidebarItems && (
            <SearchSidebarItems
              title={resources.searchPageSidebarItems.title}
              content={resources.searchPageSidebarItems.content}
            />
          )}
        </LeadBlock>
      </Section>
      {pageState === "hasResults" ? (
        <Section isSlim>
          Results
          {results.map((result) => {
            {
              /* @todo: Display results */
            }
          })}
        </Section>
      ) : null}
      {pageState === "hasNoResults"
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
};

export default SearchPage;

export const pageQuery = graphql`
  query SearchPageBySiteId($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
