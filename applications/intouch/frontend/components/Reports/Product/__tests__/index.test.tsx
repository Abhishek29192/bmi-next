import React from "react";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";
import ProductReport from "..";

describe("ProductReport Component", () => {
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<ProductReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
