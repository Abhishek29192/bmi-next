import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import Clickable from "../../clickable/Clickable";
import { Arrow } from "../../icon";
import languages from "../../language-selection/__tests__/languages";
import { renderWithThemeProvider } from "../../__tests__/helper";
import Header from "../Header";

const productsLabel = "Products";
const roofLabel = "Roof";
const languageLabel = "Language";

const utilities = [
  {
    label: "Find a stockist",
    action: { model: "htmlLink" as const, href: "#" }
  },
  {
    label: "Find a roofer",
    action: { model: "htmlLink" as const, href: "#" }
  },
  {
    label: "Partner portals",
    action: { model: "htmlLink" as const, href: "#" }
  }
];

const navigation = [
  {
    label: productsLabel,
    menu: [
      { label: "Products by type", isHeading: true },
      { label: "This is a paragraph", isParagraph: true },
      {
        label: roofLabel,
        menu: [
          { label: "Roof", isHeading: true },
          { label: "Some image", image: "http://some/image.png" },
          {
            label: "Tiles",
            menu: [
              { label: "Tiles", isHeading: true },
              { label: "Tiles overview", href: "#tiles-overview" }
            ]
          },
          { label: "Turf Roofs" }
        ]
      },
      {
        label: "View all our products",
        icon: Arrow,
        hasSeparator: true
      },
      { label: "Wall" },
      {
        label: "Documentation",
        action: {
          model: "routerLink" as const,
          to: "/documentation/",
          linkComponent: Clickable
        }
      }
    ]
  },
  {
    label: "Tiles",
    menu: [
      {
        label: "Clay",
        action: {
          model: "routerLink" as const,
          to: "/clay/",
          linkComponent: Clickable
        }
      }
    ]
  }
];

afterEach(() => {
  document.getElementsByTagName("html")[0].innerHTML = "";
});

describe("Header component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        useGTM={jest.fn}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("opens menu when clicked", () => {
    const { container, getAllByText } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        useGTM={jest.fn}
      />
    );

    const menuButton = getAllByText(productsLabel)[0];
    fireEvent.click(menuButton);
    expect(container).toMatchSnapshot();
  });

  it("opens menu two deep", () => {
    const { container, getAllByText } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        useGTM={jest.fn}
      />
    );

    const menuButton = getAllByText(productsLabel)[0];
    const nestedMenuButton = getAllByText(roofLabel)[0];
    fireEvent.click(menuButton);
    fireEvent.click(nestedMenuButton);
    expect(container).toMatchSnapshot();
  });

  it("closes menu on same tab click", () => {
    const { container, getAllByText } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        useGTM={jest.fn}
      />
    );

    const menuButton = getAllByText(productsLabel)[0];
    menuButton.click();
    menuButton.click();
    expect(container).toMatchSnapshot();
  });

  it("toggle menu with buttons", () => {
    const closeLabel = "Close";
    const openLabel = "Open";

    const { container, getByTestId } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        closeLabel={closeLabel}
        openLabel={openLabel}
        useGTM={jest.fn}
      />
    );

    const openButton = getByTestId("open-button");
    fireEvent.click(openButton);
    expect(container).toMatchSnapshot();

    const closeButton = getByTestId("language-close-button");
    fireEvent.click(closeButton);
    expect(container).toMatchSnapshot();
  });

  it("toggle search", () => {
    const searchLabel = "Search";

    const { container, getByTestId } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        searchLabel={searchLabel}
        useGTM={jest.fn}
      />
    );

    const searchButton = getByTestId("search-button");
    fireEvent.click(searchButton);
    expect(container).toMatchSnapshot();

    fireEvent.click(searchButton);
    expect(container).toMatchSnapshot();
  });

  it("toggles language selection", () => {
    const { container, getByTestId } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        useGTM={(gtm) => ({
          pushGTMEvent: jest.fn(),
          dataGTM: gtm
        })}
      />
    );

    const languageButton = getByTestId("language-button");
    fireEvent.click(languageButton);
    expect(container).toMatchSnapshot("Language selection open");

    fireEvent.click(languageButton);
    expect(container).toMatchSnapshot("Language selection closed");
  });

  it("clicking backdrop hides everything", async () => {
    const openLabel = "Open";

    const { getByTestId } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        openLabel={openLabel}
        useGTM={(gtm) => ({
          pushGTMEvent: jest.fn(),
          dataGTM: gtm
        })}
      />
    );

    const openButton = getByTestId("open-button");
    fireEvent.click(openButton);
    expect(document.body.classList.toString()).toContain("Header-menuIsOpen");

    const backdrop = getByTestId("backdrop");
    fireEvent.click(backdrop);
    expect(document.body.classList.toString()).not.toContain(
      "Header-menuIsOpen"
    );
  });

  it("sets default language when it's empty", () => {
    const { findByText } = renderWithThemeProvider(
      <Header utilities={utilities} navigation={navigation} useGTM={jest.fn} />
    );

    expect(findByText("EN")).not.toBeNull();
  });

  it("show basket icon if basket is not empty", () => {
    const { queryByRole } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        useGTM={jest.fn}
        basketLabel={"basketLabel"}
        isBasketEmpty={false}
      />
    );

    expect(queryByRole("button", { name: "basketLabel" })).toBeInTheDocument();
  });

  it("toggle sample basket dialog", async () => {
    const { getByRole, queryByText } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        basketLabel={"basketLabel"}
        languageIntroduction={<p>Select a language</p>}
        useGTM={jest.fn}
        isBasketEmpty={false}
        SampleBasketDialog={(props) => <div {...props}>renders cart</div>}
      />
    );

    const basketButton = getByRole("button", { name: "basketLabel" });
    expect(queryByText("renders cart")).not.toBeVisible();
    basketButton.click();
    expect(queryByText("renders cart")).toBeVisible();
    basketButton.click();
    await waitFor(() => expect(queryByText("renders cart")).not.toBeVisible());
  });

  it("no search input when ES is disabled", () => {
    const searchLabel = "Search";

    const { container } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        searchLabel={searchLabel}
        useGTM={jest.fn}
        isGatsbyDisabledElasticSearch={true}
      />
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByText(searchLabel)).not.toBeInTheDocument();
  });

  it("render language code for bilingual sites", () => {
    const { container, getByLabelText } = renderWithThemeProvider(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[2]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        useGTM={jest.fn}
        isGatsbyDisabledElasticSearch={true}
      />
    );
    const languageBtn = getByLabelText(languageLabel);
    expect(languageBtn).toHaveTextContent("FR-CH");
    expect(container).toMatchSnapshot();
  });
});
