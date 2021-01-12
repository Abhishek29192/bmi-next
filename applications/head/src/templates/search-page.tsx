import { InputValue } from "@bmi/form";
import Hero from "@bmi/hero";
import Search from "@bmi/search";
import Section from "@bmi/section";
import { graphql } from "gatsby";
import React, { FormEvent, useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Page from "../components/Page";
import ProgressIndicator from "../components/ProgressIndicator";
import Scrim from "../components/Scrim";
import { Data as SiteData, SiteContext } from "../components/Site";

type Props = {
  data: {
    contentfulSite: SiteData;
  };
};

type QueryInput = Extract<string, InputValue>;

const SearchPage = ({ data: { contentfulSite } }: Props) => {
  const QUERY_KEY = "q";
  const params = new URLSearchParams(
    typeof window !== `undefined` ? window.location.search : ""
  );
  const [query, setQuery] = useState<QueryInput>(params.get(QUERY_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

        return (
          <Page
            title={title}
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
              title={title}
              breadcrumbs={
                <Breadcrumbs
                  title={title}
                  slug="search"
                  menuNavigation={contentfulSite.menuNavigation}
                />
              }
            />
            <Section>
              <Search
                action={`/${contentfulSite.countryCode}/search`}
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
            </Section>
            {/* @todo: Display results */}
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
