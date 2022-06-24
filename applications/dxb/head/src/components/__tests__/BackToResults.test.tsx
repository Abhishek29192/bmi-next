import { QUERY_KEY } from "@bmi/components";
import { useMediaQuery } from "@material-ui/core";
import { render } from "@testing-library/react";
import QueryString from "query-string";
import React from "react";
import { FILTER_KEY, PATHNAME_KEY, SEARCHTAB_KEY } from "../../utils/filters";
import BackToResults from "../BackToResults";
import { SiteContextProvider } from "../Site";

const getLocation = (search: unknown): Location =>
  ({
    search: `?${QueryString.stringify(search)}`
  } as Location);

const getSiteContext = (countryCode = "en", nodeLocale = "en-GB") => ({
  countryCode: countryCode,
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: nodeLocale,
  homePage: {
    title: "Home page title"
  }
});

jest.mock("@material-ui/core", () => ({
  ...(jest.requireActual("@material-ui/core") as any),
  useMediaQuery: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;

describe("BackToResults component", () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;

    window.location = getLocation({});
  });

  afterAll(() => {
    window.location = location;
  });

  it("renders children if no url query params provided", () => {
    const { container } = render(
      <BackToResults>
        <h1>Rest of Breadcrumbs</h1>
      </BackToResults>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders children if url query params is not related to search", () => {
    window.location = getLocation({ test: "test" });

    const { container } = render(
      <BackToResults>
        <h1>Rest of Breadcrumbs</h1>
      </BackToResults>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders cta if url query params includes search request", () => {
    window.location = getLocation({ [QUERY_KEY]: "query" });

    const { container, getByRole } = render(
      <SiteContextProvider value={getSiteContext()}>
        <BackToResults>
          <h1>Rest of Breadcrumbs</h1>
        </BackToResults>
      </SiteContextProvider>
    );

    const cta = getByRole("link") as HTMLLinkElement;

    expect(cta.href).toBe("http://localhost/en/search/?q=query");
    expect(cta.attributes.getNamedItem("data-gtm").value).toBe(
      JSON.stringify({
        id: "nav-breadcrumb-back-to-results",
        label: "MC: searchPage.backToResults",
        action: "/en/search/?q=query"
      })
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders cta if url query params includes filters values", () => {
    window.location = getLocation({
      [FILTER_KEY]: JSON.stringify({ brands: ["BRAND_1"] })
    });

    const { container, getByRole } = render(
      <SiteContextProvider value={getSiteContext()}>
        <BackToResults>
          <h1>Rest of Breadcrumbs</h1>
        </BackToResults>
      </SiteContextProvider>
    );

    const cta = getByRole("link") as HTMLLinkElement;

    expect(cta.href).toBe(
      "http://localhost/en/search/?filters=%7B%22brands%22%3A%5B%22BRAND_1%22%5D%7D"
    );
    expect(cta.attributes.getNamedItem("data-gtm").value).toBe(
      JSON.stringify({
        id: "nav-breadcrumb-back-to-results",
        label: "MC: searchPage.backToResults",
        action: "/en/search/?filters=%7B%22brands%22%3A%5B%22BRAND_1%22%5D%7D"
      })
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders cta if url query params includes previous page (for plp)", () => {
    window.location = getLocation({
      [PATHNAME_KEY]: "/en/plp-page"
    });

    const { container, getByRole } = render(
      <SiteContextProvider value={getSiteContext()}>
        <BackToResults>
          <h1>Rest of Breadcrumbs</h1>
        </BackToResults>
      </SiteContextProvider>
    );

    const cta = getByRole("link") as HTMLLinkElement;

    expect(cta.href).toBe("http://localhost/en/plp-page");
    expect(cta.attributes.getNamedItem("data-gtm").value).toBe(
      JSON.stringify({
        id: "nav-breadcrumb-back-to-results",
        label: "MC: searchPage.backToResults",
        action: "/en/plp-page"
      })
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  describe("when url search param has more than one parameters along with pathname param", () => {
    it("renders removes only path name parameter and keeps other parameters", () => {
      window.location = getLocation({
        [PATHNAME_KEY]: "/en/plp-page",
        [SEARCHTAB_KEY]: "pages"
      });

      const { container, getByRole } = render(
        <SiteContextProvider value={getSiteContext()}>
          <BackToResults>
            <h1>Rest of Breadcrumbs</h1>
          </BackToResults>
        </SiteContextProvider>
      );

      const cta = getByRole("link") as HTMLLinkElement;

      expect(cta.href).toBe("http://localhost/en/plp-page?tab=pages");
      expect(cta.attributes.getNamedItem("data-gtm").value).toBe(
        JSON.stringify({
          id: "nav-breadcrumb-back-to-results",
          label: "MC: searchPage.backToResults",
          action: "/en/plp-page?tab=pages"
        })
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it("renders cta if url query params includes search tab", () => {
    window.location = getLocation({
      [SEARCHTAB_KEY]: "pages"
    });

    const { container, getByRole } = render(
      <SiteContextProvider value={getSiteContext()}>
        <BackToResults>
          <h1>Rest of Breadcrumbs</h1>
        </BackToResults>
      </SiteContextProvider>
    );

    const cta = getByRole("link") as HTMLLinkElement;

    expect(cta.href).toBe("http://localhost/en/search/?tab=pages");
    expect(cta.attributes.getNamedItem("data-gtm").value).toBe(
      JSON.stringify({
        id: "nav-breadcrumb-back-to-results",
        label: "MC: searchPage.backToResults",
        action: "/en/search/?tab=pages"
      })
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly", () => {
    window.location = getLocation({
      [SEARCHTAB_KEY]: "pages",
      [FILTER_KEY]: JSON.stringify({ brand: "BRAND_1" }),
      [QUERY_KEY]: "query"
    });

    const { container, getByRole } = render(
      <SiteContextProvider value={getSiteContext()}>
        <BackToResults>
          <h1>Rest of Breadcrumbs</h1>
        </BackToResults>
      </SiteContextProvider>
    );

    const cta = getByRole("link") as HTMLLinkElement;

    expect(cta.href).toBe(
      "http://localhost/en/search/?filters=%7B%22brand%22%3A%22BRAND_1%22%7D&q=query&tab=pages"
    );
    expect(cta.attributes.getNamedItem("data-gtm").value).toBe(
      JSON.stringify({
        id: "nav-breadcrumb-back-to-results",
        label: "MC: searchPage.backToResults",
        action:
          "/en/search/?filters=%7B%22brand%22%3A%22BRAND_1%22%7D&q=query&tab=pages"
      })
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders cta without children if mobile", () => {
    mockUseMediaQuery.mockReturnValue(true);
    window.location = getLocation({
      [SEARCHTAB_KEY]: "pages",
      [FILTER_KEY]: JSON.stringify({ brand: "BRAND_1" }),
      [QUERY_KEY]: "query"
    });

    const { container } = render(
      <SiteContextProvider value={getSiteContext()}>
        <BackToResults>
          <h1>Rest of Breadcrumbs</h1>
        </BackToResults>
      </SiteContextProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
