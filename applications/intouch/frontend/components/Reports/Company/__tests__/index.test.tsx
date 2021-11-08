import React from "react";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";
import CompanyReport from "..";

describe("CompanyReport Component", () => {
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<CompanyReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
