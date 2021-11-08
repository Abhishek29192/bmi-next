import React from "react";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";
import SystemReport from "..";

describe("SystemReport Component", () => {
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<SystemReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
