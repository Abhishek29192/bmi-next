import ThemeProvider from "@bmi-digital/components/theme-provider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { render, screen } from "@testing-library/react";
import QueryString from "query-string";
import React from "react";
import { PATHNAME_KEY, SEARCHTAB_KEY } from "../../utils/filters";
import BackToResults from "../BackToResults";
import { SiteContextProvider } from "../Site";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const getLocation = (search: unknown): Location =>
  ({
    search: `?${QueryString.stringify(search)}`
  }) as Location;

jest.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;
const { location } = window;

beforeAll(() => {
  delete window.location;

  window.location = getLocation({});
});

afterAll(() => {
  window.location = location;
});

const renderBackToResults = (locationProps) => {
  window.location = getLocation(locationProps);

  render(
    <ThemeProvider>
      <SiteContextProvider value={getMockSiteContext()}>
        <BackToResults>
          <h1>Rest of Breadcrumbs</h1>
        </BackToResults>
      </SiteContextProvider>
    </ThemeProvider>
  );

  return render;
};

describe("BackToResults component", () => {
  it("always renders the BackToResults cta in light theme", () => {
    renderBackToResults({
      [PATHNAME_KEY]: "/en/pathname"
    });

    expect(screen.getByTestId("back-to-results-button")).not.toHaveClass(
      "Button-textDarkBg"
    );
  });

  it("does render the BackToResults cta when url pathname params are present", () => {
    renderBackToResults({
      [PATHNAME_KEY]: "/en/pathname"
    });

    const cta = screen.getByRole("link");
    expect(cta).toHaveAttribute("href", "/en/pathname");
    expect(cta).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "nav-breadcrumb-back-to-results",
        label: "MC: searchPage.backToResults",
        action: "/en/pathname"
      })
    );
  });

  it("does not render the BackToResults cta component when url pathname params are not present", () => {
    renderBackToResults({
      [SEARCHTAB_KEY]: "pages"
    });

    expect(
      screen.queryByTestId("back-to-results-section")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("back-to-results-separator")
    ).not.toBeInTheDocument();
  });

  it("renders correctly when user's screen width is desktop", () => {
    mockUseMediaQuery.mockReturnValue(true);
    renderBackToResults({
      [PATHNAME_KEY]: "/en/pathname"
    });

    expect(screen.getByTestId("back-to-results-button")).toBeInTheDocument();
    expect(screen.getByTestId("back-to-results-separator")).toBeInTheDocument();
  });

  it("renders correctly when user's screen width is mobile", () => {
    mockUseMediaQuery.mockReturnValue(false);
    renderBackToResults({
      [PATHNAME_KEY]: "/en/pathname"
    });

    expect(screen.getByTestId("back-to-results-section")).toBeInTheDocument();
    expect(screen.getByTestId("back-to-results-button")).toBeInTheDocument();
    expect(
      screen.queryByTestId("back-to-results-separator")
    ).not.toBeInTheDocument();
  });
});
