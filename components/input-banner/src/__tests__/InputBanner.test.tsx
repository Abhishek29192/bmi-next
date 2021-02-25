import React from "react";
import { render } from "@testing-library/react";
import InputBanner from "../";

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
