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

  it("renders correctly with recaptcha", () => {
    const { container } = render(
      <InputBanner
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputLabel="Label"
        inputCallToAction="CTA"
        useRecaptcha={true}
        reCaptchaKey="Test Recaptcha Key"
        useRecaptchaNet={false}
        language="en-GB"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
