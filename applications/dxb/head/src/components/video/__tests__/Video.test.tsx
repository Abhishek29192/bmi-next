import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import Video from "../Video";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";
import createVideoData from "../../../__tests__/helpers/VideoHelper";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createGatsbyImageData from "../../../__tests__/helpers/GatsbyImageDataHelper";

const mockPushGTMEvent = jest.fn();

jest.mock("../../../utils/google-tag-manager", () => ({
  useGTM: (gtm: unknown) => ({
    pushGTMEvent: mockPushGTMEvent,
    dataGTM: gtm
  })
}));

describe("Video", () => {
  it("renders correctly with everything populated", () => {
    const { container } = renderWithProviders(
      <Video
        {...createVideoData()}
        className="example-classname"
        data-testid="example-data-test-id"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with minimum populated", () => {
    const { container } = renderWithProviders(
      <Video
        {...createVideoData({
          title: null,
          subtitle: null,
          previewMedia: null,
          videoRatio: null,
          layout: undefined
        })}
        className={undefined}
        data-testid={undefined}
      />
    );
    expect(container).toMatchSnapshot();
  });

  describe("Preview Media", () => {
    it("should render correctly if 'type' is descriptive", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: createImageData({ type: "Descriptive" }),
            videoRatio: null,
            layout: undefined
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'type' is null", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: createImageData({ type: null }),
            videoRatio: null,
            layout: undefined
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'file.url' is undefined", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: createImageData({
              image: {
                file: { fileName: "example-filename" },
                gatsbyImageData: createGatsbyImageData()
              }
            }),
            videoRatio: null,
            layout: undefined
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'gatsbyImageData' is undefined", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: createImageData({
              image: {
                file: { fileName: "example-filename", url: "/example.url" }
              }
            }),
            videoRatio: null,
            layout: undefined
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'thumbnail' is undefined", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: createImageData({
              image: {
                file: { fileName: "example-filename" },
                gatsbyImageData: createGatsbyImageData(),
                thumbnail: undefined
              }
            }),
            videoRatio: null,
            layout: undefined
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'focalPoint' is null", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: createImageData({
              focalPoint: null
            }),
            videoRatio: null,
            layout: undefined
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'loading' is eager", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: createImageData({
              loading: "eager"
            }),
            videoRatio: null,
            layout: undefined
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'loading' is undefined", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: createImageData({
              loading: undefined
            }),
            videoRatio: null,
            layout: undefined
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe("Layout", () => {
    it("should render correctly when layout is in-place", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: null,
            videoRatio: null,
            layout: "in-place"
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly when layout is dialog", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoData({
            title: null,
            subtitle: null,
            previewMedia: null,
            videoRatio: null,
            layout: "dialog"
          })}
          className={undefined}
          data-testid={undefined}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe("pushGTMEvent", () => {
    it("should call pushGTMEvent when the user clicks the video play button", () => {
      renderWithProviders(<Video {...createVideoData()} />);

      fireEvent.click(screen.getByRole("button"));
      expect(mockPushGTMEvent).toHaveBeenCalled();
    });
  });
});
