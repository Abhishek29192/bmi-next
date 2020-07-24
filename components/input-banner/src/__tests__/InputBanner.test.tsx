import React from "react";
import InputBanner from "../";
import { render } from "@testing-library/react";

describe("InputBanner component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <InputBanner
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputLabel="Label"
        inputCallToAction="CTA"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
