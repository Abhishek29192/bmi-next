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
        We do the things
      </OverviewCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly without optional props", () => {
    const { container } = render(
      <OverviewCard title="Heading">We do the things</OverviewCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with a subtitle", () => {
    const { container } = render(
      <OverviewCard title="Heading" subtitle="Subtitle" subtitleVariant="h5">
        We do the things
      </OverviewCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with contain image", () => {
    const { container } = render(
      <OverviewCard title="Heading" imageSource={mockImage} imageSize="contain">
        We do the things
      </OverviewCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
