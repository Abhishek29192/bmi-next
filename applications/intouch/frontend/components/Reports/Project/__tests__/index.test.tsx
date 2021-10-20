import React from "react";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";
import ProjectReport from "..";

describe("ProjectReport Component", () => {
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<ProjectReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
