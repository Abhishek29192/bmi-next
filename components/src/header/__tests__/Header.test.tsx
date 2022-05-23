import React from "react";
import { render } from "@testing-library/react";
import { Arrow } from "../../icon";
import Clickable from "../../clickable/Clickable";
import languages from "../../language-selection/languages";
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

describe("Header component", () => {
  it("renders correctly", () => {
    const { container } = render(
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
    const { container, getAllByText } = render(
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
    expect(container).toMatchSnapshot();
  });

  it("opens menu two deep", () => {
    const { container, getAllByText } = render(
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
    menuButton.click();
    nestedMenuButton.click();
    expect(container).toMatchSnapshot();
  });

  it("closes menu on same tab click", () => {
    const { container, getAllByText } = render(
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

    const { container, getByRole } = render(
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

    const openButton = getByRole("button", { name: openLabel });
    openButton.click();
    expect(container).toMatchSnapshot();

    const closeButton = getByRole("button", { name: closeLabel });
    closeButton.click();
    expect(container).toMatchSnapshot();
  });

  it("toggle search", () => {
    const searchLabel = "Search";

    const { container, getByRole } = render(
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

    const searchButton = getByRole("button", { name: searchLabel });
    searchButton.click();
    expect(container).toMatchSnapshot();

    searchButton.click();
    expect(container).toMatchSnapshot();
  });

  it("toggles language selection", () => {
    const { container, getByRole } = render(
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

    const languageButton = getByRole("button", { name: languageLabel });

    languageButton.click();

    expect(container).toMatchSnapshot("Language selection open");

    languageButton.click();

    expect(container).toMatchSnapshot("Language selection closed");
  });

  it("clicking backdrop hides everything", () => {
    const openLabel = "Open";

    const { container, getByRole } = render(
      <Header
        utilities={utilities}
        navigation={navigation}
        language={languages[0].menu[0]}
        languages={languages}
        languageLabel={languageLabel}
        languageIntroduction={<p>Select a language</p>}
        openLabel={openLabel}
        useGTM={jest.fn}
      />
    );

    const openButton = getByRole("button", { name: openLabel });
    openButton.click();
    expect(document.body).toHaveClass("MenuIsOpen");

    const backdrop = container.querySelector(".backdrop") as HTMLElement;
    backdrop.click();
    expect(document.body).not.toHaveClass("MenuIsOpen");
  });

  it("sets default language when it's empty", () => {
    const { findByText } = render(
      <Header utilities={utilities} navigation={navigation} useGTM={jest.fn} />
    );

    expect(findByText("EN")).not.toBeNull();
  });
});
