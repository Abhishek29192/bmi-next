import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { YoutubeVideoProps } from "@bmi/components/src";
import * as Video from "../Video";
import { Data } from "../Image";

const VideoRenderComponent = Video.renderVideo;
const VideoComponent = Video.default;
const mockPushGTMEvent = jest.fn();

jest.mock("../../utils/google-tag-manager", () => ({
  useGTM: (gtm) => ({
    pushGTMEvent: mockPushGTMEvent,
    dataGTM: gtm
  })
}));

jest.mock("../Image", () => ({
  __esModule: true,
  default: () => <div data-testid="image"></div>
}));

jest.mock("@bmi/components", () => ({
  YoutubeVideo: (props: YoutubeVideoProps) => (
    <div
      data-testid="wrapper"
      data-gtm={JSON.stringify(props.dataGTM)}
      {...props}
    >
      <button onClick={props.onGTMEvent}>GTM Event button</button>
      {props.previewImageSource}
    </div>
  )
}));

const mockData = {
  title: "testTitle",
  label: "mockLabel",
  subtitle: "mockSubtitle",
  videoUrl: "https://www.youtube.com/watch?v=testId",
  videoRatio: null,
  previewMedia: null
};

describe("Video", () => {
  it("should call renderVideo function", () => {
    jest.spyOn(Video, "renderVideo");
    render(<VideoComponent data={mockData} />);
    expect(Video.renderVideo).toBeCalled();
  });
});

describe("renderVideo", () => {
  it("should pass correct GTM data", () => {
    const expectedGTM = JSON.stringify({
      id: "cta-click--video-youtube",
      label: "https://www.youtube.com/watch?v=testId-mockLabel",
      action: "Play"
    });
    render(<VideoRenderComponent {...mockData} />);
    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).toHaveAttribute("data-gtm", expectedGTM);
  });

  describe("when GTM event triggered", () => {
    it("should call pushGTMEvent", () => {
      render(<VideoRenderComponent {...mockData} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockPushGTMEvent).toBeCalled();
    });
  });

  describe("when previewMedia is passed", () => {
    it("should render previewImageSource", () => {
      const imageData = {} as Data;
      render(<VideoRenderComponent {...mockData} previewMedia={imageData} />);
      expect(screen.queryByTestId("image")).toBeInTheDocument();
    });
  });

  describe("when previewMedia is not passed", () => {
    it("shouldn't render previewImageSource", () => {
      render(<VideoRenderComponent {...mockData} />);
      expect(screen.queryByTestId("image")).not.toBeInTheDocument();
    });
  });

  it("should assign correct videoRatio", () => {
    const localData = {
      ...mockData,
      videoRatio: {
        width: 200,
        height: 100
      }
    };

    render(<VideoRenderComponent {...localData} />);
    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).toHaveAttribute("embedheight", "100");
    expect(wrapper).toHaveAttribute("embedwidth", "200");
  });
});
