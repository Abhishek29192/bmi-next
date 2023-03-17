import { render } from "@testing-library/react";
import React from "react";
import AssetsIframe from "../AssetsIframe";

describe("AssetsIframe component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <AssetsIframe url="https://google.com" title={"Assets iFrame"} />
    );
    expect(container).toMatchSnapshot();
  });
});
