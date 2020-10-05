import React from "react";
import OverviewCard from "../";
import { render } from "@testing-library/react";
import Button from "@bmi/button";
import mockImage from "path-to-image.jpg";
import mockLogo from "mock-to-logo.svg";

describe("OverviewCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        imageSource={mockImage}
        brandImageSource={mockLogo}
        hasTitleUnderline
        footer={<Button variant="outlined">Go to this</Button>}
      >
        <p>We do the things</p>
      </OverviewCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly without optional props", () => {
    const { container } = render(
      <OverviewCard title="Heading">
        <p>We do the things</p>
      </OverviewCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
