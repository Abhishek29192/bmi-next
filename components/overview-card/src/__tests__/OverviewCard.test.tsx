import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Button from "@bmi/button";
import mockImage from "path-to-image.jpg";
import mockLogo from "mock-to-logo.svg";
import OverviewCard from "../";

describe("OverviewCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
      >
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with a string brandImageSource prop", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        brandImageSource={"image/source.jpg"}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
      >
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly without optional props", () => {
    const { container } = render(
      <OverviewCard title="Heading">We do the things</OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with a subtitle", () => {
    const { container } = render(
      <OverviewCard title="Heading" subtitle="Subtitle" subtitleVariant="h5">
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with contain image", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        imageSize="contain"
      >
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders as a flat card", () => {
    const onClick = jest.fn();
    const { container, getByText } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
        isFlat
        onClick={onClick}
      >
        We do the things
      </OverviewCard>
    );

    const title = getByText("Heading");

    fireEvent.click(title);

    expect(container).toMatchSnapshot();
    expect(onClick.mock.calls.length).toEqual(1);
  });
  it("accpets onClick", () => {
    const onClick = jest.fn();

    const { getByText } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
        onClick={onClick}
      >
        We do the things
      </OverviewCard>
    );

    const title = getByText("Heading");

    fireEvent.click(title);

    expect(onClick.mock.calls).toMatchSnapshot();
  });

  it("removes clickable class when the area is none", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
        buttonComponent="div"
        clickableArea="none"
      >
        We do the things
      </OverviewCard>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly if clickableArea === body", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        clickableArea="body"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
      >
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if moreOptionsAvailable === true", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        moreOptionsAvailable
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
      >
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if hasChildrenWithoutMargin  === true", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        hasChildrenWithoutMargin
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
      >
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if imageSize === contain", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        imageSize="contain"
        imageSource="imageSource"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
      >
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if imageSource !== string", () => {
    const { container } = render(
      <OverviewCard
        title="Heading"
        titleVariant="h4"
        imageSource={<img />}
        media={<img src={mockImage} alt="Lorem ipsum" />}
        brandImageSource={mockLogo}
        footer={
          <Button component="span" variant="outlined">
            Go to this
          </Button>
        }
      >
        We do the things
      </OverviewCard>
    );
    expect(container).toMatchSnapshot();
  });
});
