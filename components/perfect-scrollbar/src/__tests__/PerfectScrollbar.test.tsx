import React from "react";
import { render } from "@testing-library/react";
import PerfectScrollbar from "..";

describe("PerfectScrollbar component ", () => {
  it("renders correctly", () => {
    const { container } = render(
      <PerfectScrollbar> some content </PerfectScrollbar>
    );
    expect(container).toMatchSnapshot();
  });
});
