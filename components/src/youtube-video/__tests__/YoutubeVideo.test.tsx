import React from "react";
import * as all from "@bmi-digital/use-dimensions";
import { render } from "@testing-library/react";
import YoutubeVideo from "../YoutubeVideo";

function getDimensionHookFn(width: number): () => all.UseDimensionsHook {
  return () => [() => {}, { width, height: 0 }, document.createElement("div")];
}

function mockUseDimensions({
  containerWidth,
  normalTableWidth,
  mediumTableWidth
}: {
  containerWidth: number;
  normalTableWidth: number;
  mediumTableWidth: number;
}) {
  let spy = jest.spyOn(all, "default");

  // NOTE: component re-renders at most three times in the test for three different size
  for (let i = 0; i < 3; i++) {
    spy = spy
      .mockImplementationOnce(getDimensionHookFn(containerWidth))
      .mockImplementationOnce(getDimensionHookFn(normalTableWidth))
      .mockImplementationOnce(getDimensionHookFn(mediumTableWidth));
  }
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("YoutubeVideo component", () => {
  it("renders in dialog layout correctly", () => {
    const props = {
      label: "test video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720
    };
    const { container } = render(<YoutubeVideo layout="dialog" {...props} />);
    expect(container).toMatchSnapshot();
  });
  it("renders in in-place layout correctly", () => {
    const props = {
      label: "test video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720
    };
    const { container } = render(<YoutubeVideo layout="in-place" {...props} />);
    expect(container).toMatchSnapshot();
  });
  it("renders inline layout correctly", () => {
    const props = {
      label: "test inline video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720
    };
    const { container } = render(<YoutubeVideo layout="inline" {...props} />);
    expect(container).toMatchSnapshot();
  });
  it("opens dialog on click", () => {
    const props = {
      label: "test video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720
    };
    const { container, getByRole } = render(
      <YoutubeVideo layout="dialog" {...props} />
    );
    const thumbnailButton = getByRole("button", { name: props.label });
    thumbnailButton.click();
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders with dimensions correctly", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 400
    });
    const { container } = render(
      <YoutubeVideo
        label="test video"
        videoId="A - RfHC91Ewc"
        embedWidth={1280}
        embedHeight={720}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
