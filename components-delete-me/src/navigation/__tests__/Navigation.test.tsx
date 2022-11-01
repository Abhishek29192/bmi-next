import React from "react";
import Clickable from "../../clickable/Clickable";
import { Arrow } from "../../icon";
import { renderWithThemeProvider } from "../../__tests__/helper";
import Navigation from "../Navigation";

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
    label: "Products",
    menu: [
      { label: "Products by type", isHeading: true },
      { label: "This is a paragraph", isParagraph: true },
      {
        label: "Roof Top Item",
        setRootValue: () => {},
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

describe("Navigation component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Navigation menu={navigation} utilities={utilities} />
    );
    expect(container).toMatchSnapshot();
  });

  it("expands submenu", () => {
    const { container, getByText } = renderWithThemeProvider(
      <Navigation
        menu={navigation}
        utilities={utilities}
        initialValue={2}
        setRootValue={jest.fn}
      />
    );
    getByText("Roof Top Item").click();
    expect(container).toMatchSnapshot();

    getByText("Main menu").click();
    expect(container).toMatchSnapshot();

    getByText("Products").click();
    expect(container).toMatchSnapshot();
  });
});
