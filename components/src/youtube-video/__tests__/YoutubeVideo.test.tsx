import React from "react";
import * as all from "@bmi-digital/use-dimensions";
import { render, screen, fireEvent } from "@testing-library/react";
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

describe("YoutubeVideo component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  describe("dialog layout", () => {
    const props = {
      label: "test video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720,
      dataGTM: {
        id: "test-id",
        label: "test-label",
        action: "Play"
      },
      onGTMEvent: jest.fn()
    };

    it("should render correctly", () => {
      const { container } = render(<YoutubeVideo layout="dialog" {...props} />);
      expect(container).toMatchSnapshot();
    });

    it("should add data-gtm attribute to wrapper", () => {
      render(<YoutubeVideo layout="dialog" {...props} />);
      expect(screen.getByTestId("youtube-dialog-wrapper")).toHaveAttribute(
        "data-gtm",
        JSON.stringify(props.dataGTM)
      );
    });

    describe("when onGTMEvent passed", () => {
      describe("and dialog opened", () => {
        it("should trigger onGTMEvent", () => {
          render(<YoutubeVideo layout="dialog" {...props} />);
          fireEvent.click(screen.getByAltText(props.label));
          expect(props.onGTMEvent).toBeCalled();
        });
      });
    });
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
  describe("inline layout", () => {
    const props = {
      label: "test inline video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720,
      dataGTM: {
        id: "test-id",
        label: "test-label",
        action: "Play"
      },
      onGTMEvent: jest.fn()
    };
    it("should render correctly", () => {
      const { container } = render(<YoutubeVideo layout="inline" {...props} />);
      expect(container).toMatchSnapshot();
    });

    describe("when onGTMEvent passed", () => {
      describe("and video played for the first time", () => {
        it("should trigger onGTMEvent", () => {
          render(<YoutubeVideo layout="inline" {...props} />);
          fireEvent.click(screen.getByTestId("youtube-inline-wrapper"));
          expect(props.onGTMEvent).toBeCalled();
        });
      });

      describe("and video played for the second time", () => {
        it("should trigger onGTMEvent only once", () => {
          render(<YoutubeVideo layout="inline" {...props} />);
          fireEvent.click(screen.getByTestId("youtube-inline-wrapper"));
          fireEvent.click(screen.getByTestId("youtube-inline-wrapper"));
          expect(props.onGTMEvent).toBeCalledTimes(1);
        });
      });
    });
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
