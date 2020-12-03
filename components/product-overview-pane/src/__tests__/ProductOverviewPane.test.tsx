import React from "react";
import ProductOverviewPane, { Props } from "..";
import { render } from "@testing-library/react";
import MockLogo from "path-to-logo.svg";
import mockImage from "path-to-image.png";

const attributes: Props["attributes"] = [
  {
    name: "Colour",
    type: "thumbnails",
    variants: [
      {
        label: "Black",
        isSelected: true,
        thumbnail: mockImage
      },
      {
        label: "Brown",
        thumbnail: mockImage,
        action: { model: "htmlLink", href: "#" }
      }
    ]
  },
  {
    name: "Size",
    variants: [
      {
        label: "22cm x 42cm",
        isSelected: true
      },
      {
        label: "12cm x 22cm",
        action: { model: "htmlLink", href: "#" }
      },
      {
        label: "30cm x 62cm"
      }
    ]
  }
];

describe("ProductOverviewPane component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb="1394983720195"
        attributes={attributes}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with empty variants", () => {
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb="1394983720195"
        attributes={[
          {
            name: "Size",
            variants: []
          }
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
