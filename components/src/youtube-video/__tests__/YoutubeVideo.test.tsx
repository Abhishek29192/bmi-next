import * as all from "@bmi-digital/use-dimensions";
import { useMediaQuery } from "@material-ui/core";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import YoutubeVideo, { getSize } from "../YoutubeVideo";

jest.mock("@material-ui/core", () => ({
  ...(jest.requireActual("@material-ui/core") as any),
  useMediaQuery: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;

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

function mockUseDimensionsOnce(width: number) {
  jest
    .spyOn(all, "default")
    .mockImplementation(() => [
      () => ({}),
      { width, height: 0 },
      document.createElement("div")
    ]);
}

const getVideoRatio = (
  width: number,
  height: number,
  dimensions: { width: number; height: number }
) => {
  const widthRatio = width ? dimensions.width / width : 0;
  const heightRatio = height ? dimensions.height / height : 0;
  return Math.max(widthRatio, heightRatio);
};

describe("YoutubeVideo component", () => {
  const props = {
    label: "test video",
    videoUrl: "https://youtu.be/A-RfHC91Ewc",
    embedWidth: 1280,
    embedHeight: 720,
    previewImageSource: "https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg",
    dataGTM: {
      id: "test-id",
      label: "test-label",
      action: "Play"
    },
    onGTMEvent: jest.fn()
  };

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe("getSize", () => {
    it("should return with and height if no dimensions", () => {
      const size = getSize(1280, 720, {});
      expect(size).toMatchObject({ width: 1280, height: 720 });
    });

    it("should return correct sizes", () => {
      const dimensions = {
        width: 400,
        height: 401
      };
      const width = 1280;
      const height = 720;

      let videoRatio = getVideoRatio(width, height, dimensions);
      expect(getSize(width, height, dimensions)).toMatchObject({
        width: width * videoRatio,
        height: height * videoRatio
      });

      videoRatio = getVideoRatio(0, height, dimensions);
      expect(getSize(0, height, dimensions)).toMatchObject({
        width: 0,
        height: height * videoRatio
      });

      videoRatio = getVideoRatio(width, 0, dimensions);
      expect(getSize(width, 0, dimensions)).toMatchObject({
        width: width * videoRatio,
        height: 0
      });
    });
  });

  describe("InPlaceVideo", () => {
    it("should render InPlaceVideo component inside YoutubeVideo", () => {
      const { getByTestId } = render(
        <YoutubeVideo layout="in-place" {...props} />
      );
      const component = getByTestId("youtupe-inplace-wrapper");

      expect(component).toBeInTheDocument();
    });

    it("should render ReactPlayer if dimensions.width", () => {
      mockUseDimensionsOnce(400);

      const { getByTestId } = render(
        <YoutubeVideo layout="in-place" {...props} />
      );

      const component = getByTestId("react-player");
      expect(component).toBeInTheDocument();
    });
  });

  describe("InlineVideo", () => {
    it("should render InlineVideo component inside YoutubeVideo", () => {
      const { getByTestId } = render(
        <YoutubeVideo layout="inline" {...props} />
      );
      const component = getByTestId("youtube-inline-wrapper");
      expect(component).toBeInTheDocument();
    });

    it("should trigger onGTMEvent", () => {
      const { getByTestId } = render(
        <YoutubeVideo layout="inline" {...props} />
      );
      fireEvent.click(getByTestId("youtube-inline-wrapper"));
      expect(props.onGTMEvent).toBeCalled();
    });

    it("should trigger onGTMEvent only once", () => {
      const { getByTestId } = render(
        <YoutubeVideo layout="inline" {...props} />
      );
      fireEvent.click(getByTestId("youtube-inline-wrapper"));
      fireEvent.click(getByTestId("youtube-inline-wrapper"));
      expect(props.onGTMEvent).toBeCalledTimes(1);
    });
  });

  describe("DialogVideo", () => {
    it("should render DialogVideo component inside YoutubeVideo", () => {
      const { getByTestId } = render(<YoutubeVideo {...props} />);

      const component = getByTestId("youtube-dialog-wrapper");
      expect(component).toBeInTheDocument();
    });

    it("should add data-gtm attribute to wrapper", () => {
      const { getByTestId } = render(
        <YoutubeVideo layout="dialog" {...props} />
      );
      expect(getByTestId("youtube-dialog-wrapper")).toHaveAttribute(
        "data-gtm",
        JSON.stringify(props.dataGTM)
      );
    });

    test("should render correct previewImageSource", () => {
      const { getByAltText } = render(
        <YoutubeVideo
          {...props}
          layout="dialog"
          previewImageSource={<img src="" alt="previewImageSource" />}
        />
      );

      expect(getByAltText("previewImageSource")).toBeInTheDocument();
    });

    it("should trigger onGTMEvent", () => {
      const { getByAltText } = render(
        <YoutubeVideo layout="dialog" {...props} />
      );
      fireEvent.click(getByAltText(props.label));
      expect(props.onGTMEvent).toBeCalled();
    });

    it("opens and close dialog on click", () => {
      const { container, getByTestId, getByRole } = render(
        <YoutubeVideo layout="dialog" {...props} />
      );

      const thumbnailButton = getByTestId("thumbnail-button");
      thumbnailButton.click();
      expect(container.parentElement).toMatchSnapshot();

      const closeButton = getByRole("button", { name: "Close" });
      closeButton.click();
      expect(container.parentElement).toMatchSnapshot();
    });

    it("renders with dimensions correctly", () => {
      mockUseDimensions({
        containerWidth: 400,
        normalTableWidth: 401,
        mediumTableWidth: 400
      });
      const { container } = render(<YoutubeVideo {...props} />);
      expect(container).toMatchSnapshot();
    });

    it("should use fallback height if it can't get height from dimensions", () => {
      mockUseDimensionsOnce(0);

      const { container } = render(<YoutubeVideo {...props} embedHeight={0} />);
      expect(container).toMatchSnapshot();
    });

    it("shold render ReactPlayer with currect height", () => {
      mockUseDimensionsOnce(400);
      mockUseMediaQuery.mockReturnValueOnce(true);
      mockUseMediaQuery.mockReturnValueOnce(true);

      const { container } = render(<YoutubeVideo {...props} />);
      expect(container).toMatchSnapshot();
    });
  });
});
