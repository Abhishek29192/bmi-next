import { describe, it } from "@jest/globals";
import { render } from "@testing-library/react";
import React from "react";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import { Head } from "../Head";
import { Data as SEOContentData } from "../SEOContent";

// For some reason, setting htmlAttributes to be HelmetProps["htmlAttributes"]
// causes a type issue
const createHtmlAttributes = (htmlAttributes?: {
  lang: string;
}): { lang: string } => ({
  lang: "en-GB",
  ...htmlAttributes
});

const createSeoContentData = (
  seoContentData?: Partial<SEOContentData>
): SEOContentData => ({
  metaTitle: null,
  metaDescription: null,
  noIndex: null,
  sameAs: null,
  ...seoContentData
});

describe("Head", () => {
  it("should render both the localised and default alternate links if excludeLocalisedAlternate is false", () => {
    process.env.GATSBY_SITE_URL = "http://localhost";
    const countryCode = "uk";
    const locale = "en-GB";
    const path = "some-page";
    render(
      <ConfigProvider configOverride={{ excludeLocalisedAlternate: false }}>
        <Head
          title="Title"
          countryCode={countryCode}
          htmlAttributes={createHtmlAttributes({ lang: locale })}
          seo={createSeoContentData()}
          path={path}
        />
      </ConfigProvider>
    );

    // Only way to get head elements
    // eslint-disable-next-line testing-library/no-node-access
    const alternateLinks = document.querySelectorAll('link[rel="alternate"]');
    expect(alternateLinks).toMatchInlineSnapshot(`
      NodeList [
        <link
          data-react-helmet="true"
          href="http://localhost:8000/uk/some-page/"
          hreflang="en-GB"
          rel="alternate"
        />,
        <link
          data-react-helmet="true"
          href="http://localhost:8000/uk/some-page/"
          hreflang="x-default"
          rel="alternate"
        />,
      ]
    `);
  });

  it("should render only the default alternate link if excludeLocalisedAlternate is true", () => {
    process.env.GATSBY_SITE_URL = "http://localhost";
    const countryCode = "uk";
    const locale = "en-GB";
    const path = "some-page";
    render(
      <ConfigProvider configOverride={{ excludeLocalisedAlternate: true }}>
        <Head
          title="Title"
          countryCode={countryCode}
          htmlAttributes={createHtmlAttributes({ lang: locale })}
          seo={createSeoContentData()}
          path={path}
        />
      </ConfigProvider>
    );

    // Only way to get head elements
    // eslint-disable-next-line testing-library/no-node-access
    const alternateLinks = document.querySelectorAll('link[rel="alternate"]');
    expect(alternateLinks).toMatchInlineSnapshot(`
      NodeList [
        <link
          data-react-helmet="true"
          href="http://localhost:8000/uk/some-page/"
          hreflang="x-default"
          rel="alternate"
        />,
      ]
    `);
  });
});
