import React from "react";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";
import TeamReport from "..";

describe("TeamReport Component", () => {
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<TeamReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
