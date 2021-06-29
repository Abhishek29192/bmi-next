import { Arrow } from "@bmi/icon";
import Clickable from "@bmi/clickable";
import { languages } from "@bmi/language-selection";
import { render } from "@testing-library/react";
import React from "react";
import Header from "../";

const productsLabel = "Products";

const utilities = [
  {
    label: "Find a stockist",
    action: { model: "htmlLink" as "htmlLink", href: "#" }
  },
  {
    label: "Find a roofer",
    action: { model: "htmlLink" as "htmlLink", href: "#" }
  },
  {
    label: "Partner portals",
    action: { model: "htmlLink" as "htmlLink", href: "#" }
  }
];

const navigation = [
  {
    label: productsLabel,
    menu: [
      { label: "Products by type", isHeading: true },
      {
        label: "Roof",
        menu: [
          { label: "Roof", isHeading: true },
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
          model: "routerLink" as "routerLink",
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
          model: "routerLink" as "routerLink",
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
        languages={languages}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("opens menu when clicked", () => {
    const { container, getAllByText } = render(
      <Header
        utilities={utilities}
        navigation={navigation}
        languages={languages}
      />
    );

    const menuButton = getAllByText(productsLabel)[0];
    menuButton.click();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("closes menu on same tab click", () => {
    const { container, getAllByText } = render(
      <Header
        utilities={utilities}
        navigation={navigation}
        languages={languages}
      />
    );

    const menuButton = getAllByText(productsLabel)[0];
    menuButton.click();
    menuButton.click();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("toggle menu with buttons", () => {
    const closeLabel = "Close";
    const openLabel = "Open";

    const { container, getByRole } = render(
      <Header
        utilities={utilities}
        navigation={navigation}
        languages={languages}
        closeLabel={closeLabel}
        openLabel={openLabel}
      />
    );

    const openButton = getByRole("button", { name: openLabel });
    openButton.click();
    expect(container.firstChild).toMatchSnapshot();

    const closeButton = getByRole("button", { name: closeLabel });
    closeButton.click();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("toggle search", () => {
    const searchLabel = "Search";

    const { container, getByRole } = render(
      <Header
        utilities={utilities}
        navigation={navigation}
        languages={languages}
        searchLabel={searchLabel}
      />
    );

    const searchButton = getByRole("button", { name: searchLabel });
    searchButton.click();
    expect(container.firstChild).toMatchSnapshot();

    searchButton.click();
    expect(container.firstChild).toMatchSnapshot();
  });
});
