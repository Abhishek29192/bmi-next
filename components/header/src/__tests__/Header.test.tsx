import { languages } from "@bmi/language-selection";
import { render } from "@testing-library/react";
import React from "react";
import Header from "../";

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
    label: "Products",
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
      { label: "Wall" }
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
});
