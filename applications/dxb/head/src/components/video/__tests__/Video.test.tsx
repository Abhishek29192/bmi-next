import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import NextImage from "next/image";
import Video from "../Video";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";
import { createVideoProps } from "../../../__tests__/helpers/VideoHelper";

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
        {...createVideoProps({
          className: "example-classname",
          "data-testid": "example-data-test-id"
        })}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with minimum populated", () => {
    const { container } = renderWithProviders(
      <Video
        {...createVideoProps({
          className: undefined,
          "data-testid": undefined,
          previewMedia: {
            component: NextImage,
            title: null,
            subtitle: null,
            previewMedia: null,
            videoRatio: null,
            layout: undefined
          }
        })}
      />
    );
    expect(container).toMatchSnapshot();
  });

  describe("Preview Media", () => {
    it("should render correctly if 'type' is descriptive", () => {
      const videoProps = createVideoProps({
        className: undefined,
        "data-testid": undefined
      });

      const { container } = renderWithProviders(
        <Video
          {...videoProps}
          previewMedia={{
            ...videoProps.previewMedia,
            type: "Descriptive"
          }}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'type' is null", () => {
      const videoProps = createVideoProps({
        className: undefined,
        "data-testid": undefined
      });

      const { container } = renderWithProviders(
        <Video
          {...videoProps}
          previewMedia={{
            ...videoProps.previewMedia,
            type: null
          }}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'src' is undefined", () => {
      const videoProps = createVideoProps({
        className: undefined,
        "data-testid": undefined
      });

      const { container } = renderWithProviders(
        <Video
          {...videoProps}
          previewMedia={{
            ...videoProps.previewMedia,
            src: undefined
          }}
        />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'previewMedia' is undefined", () => {
      const { container } = renderWithProviders(
        <Video {...createVideoProps({ previewMedia: undefined })} />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly if 'focalPoint' is null", () => {
      const videoProps = createVideoProps({
        className: undefined,
        "data-testid": undefined
      });

      const { container } = renderWithProviders(
        <Video
          {...videoProps}
          previewMedia={{ ...videoProps.previewMedia, focalPoint: null }}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe("Layout", () => {
    it("should render correctly when layout is in-place", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoProps({
            layout: "in-place"
          })}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("should render correctly when layout is dialog", () => {
      const { container } = renderWithProviders(
        <Video
          {...createVideoProps({
            layout: "dialog"
          })}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe("pushGTMEvent", () => {
    it("should call pushGTMEvent when the user clicks the video play button", () => {
      renderWithProviders(<Video {...createVideoProps()} />);

      fireEvent.click(screen.getByRole("button"));
      expect(mockPushGTMEvent).toHaveBeenCalled();
    });
  });
});
