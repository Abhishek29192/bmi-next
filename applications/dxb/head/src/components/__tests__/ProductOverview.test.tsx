import React from "react";
import { render } from "@testing-library/react";
import ProductOverview from "../ProductOverview";

describe("ProductOverview component", () => {
  const data = {
    name: "name",
    brandName: "brandName",
    nobb: null,
    images: [
      { mainSource: "mainSource", caption: "caption" },
      { mainSource: "mainSource2", caption: "caption2" }
    ],
    attributes: null,
    isRecapchaShown: true
  };
  it("renders correctly with Recapcha", () => {
    const { container } = render(
      <ProductOverview data={data}>
        <div>block</div>
        <p>text</p>
      </ProductOverview>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly without Recapcha", () => {
    const localData = { ...data, isRecapchaShown: false };
    const { container } = render(
      <ProductOverview data={localData}>
        <div>block</div>
        <p>text</p>
      </ProductOverview>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
