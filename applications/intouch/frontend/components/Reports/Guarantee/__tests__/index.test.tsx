import React from "react";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";
import GuaranteeReport from "..";

describe("GuaranteeReport Component", () => {
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<GuaranteeReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
