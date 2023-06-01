import { YoutubeVideoProps } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Data as ContentfulImageData } from "../Image";
import Video from "../Video";

const mockPushGTMEvent = jest.fn();

jest.mock("../../utils/google-tag-manager", () => ({
  useGTM: (gtm: unknown) => ({
    pushGTMEvent: mockPushGTMEvent,
    dataGTM: gtm
  })
}));

jest.mock("../Image", () => ({
  __esModule: true,
  default: () => <div data-testid="image"></div>
}));

jest.mock("@bmi-digital/components", () => ({
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
  previewMedia: null,
  defaultYouTubePreviewImage: "https://i.ytimg.com/vi/testId/maxresdefault.jpg"
};

describe("Video", () => {
  it("should pass correct GTM data", () => {
    const expectedGTM = JSON.stringify({
      id: "cta-click--video-youtube",
      label: "https://www.youtube.com/watch?v=testId-mockLabel",
      action: "Play"
    });
    render(<Video {...mockData} />);
    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).toHaveAttribute("data-gtm", expectedGTM);
  });

  describe("when GTM event triggered", () => {
    it("should call pushGTMEvent", () => {
      render(<Video {...mockData} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockPushGTMEvent).toBeCalled();
    });
  });

  describe("when previewMedia is passed", () => {
    it("should render previewImageSource", () => {
      const imageData = {} as ContentfulImageData;
      render(<Video {...mockData} previewMedia={imageData} />);
      expect(screen.getByTestId("image")).toBeInTheDocument();
    });
  });

  describe("when previewMedia is not passed", () => {
    it("shouldn't render previewImageSource", () => {
      render(<Video {...mockData} />);
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

    render(<Video {...localData} />);
    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).toHaveAttribute("embedheight", "100");
    expect(wrapper).toHaveAttribute("embedwidth", "200");
  });
});
