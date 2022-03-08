import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import MediaGallery from "../MediaGallery";
import YoutubeVideo from "../../youtube-video/YoutubeVideo";

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

const mockMedia = [
  {
    media: (
      <img src="https://bmipimngqa.azureedge.net/sys-master-hybris-media/hcd/h0e/8974987690014/TBK-SN-403-Tjpg" />
    ),
    thumbnail: "",
    caption: "This is image caption",
    altText: "test alt text",
    isVideo: false
  },
  {
    media: (
      <YoutubeVideo
        label="test video"
        videoId="A-RfHC91Ewc"
        embedHeight={720}
        embedWidth={1280}
        layout="dialog"
      />
    ),
    thumbnail: "",
    caption: "This is videos caption",
    isVideo: true
  }
];
describe("MediaGallery component", () => {
  it("renders correctly with full data", () => {
    const { container } = render(<MediaGallery media={mockMedia} />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with no data", () => {
    const { container } = render(<MediaGallery media={[]} />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with no media", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { container } = render(<MediaGallery media={undefined} />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with no media data", () => {
    const mockMedia = [
      {
        media: null,
        isVideo: false
      }
    ];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { container } = render(<MediaGallery media={mockMedia} />);
    expect(container).toMatchSnapshot();
  });

  it("test click on thumbnail", () => {
    const a = [
      {
        media: (
          <YoutubeVideo
            label="test video 1"
            videoId="A-RfHC91Ewc"
            embedHeight={720}
            embedWidth={1280}
            layout="dialog"
          />
        ),
        thumbnail: "https://thumbnail1.jpg",
        caption: undefined,
        isVideo: true
      },
      {
        media: (
          <YoutubeVideo
            label="test video 2"
            videoId="A-RfHC91Awc"
            embedHeight={720}
            embedWidth={1280}
            layout="dialog"
          />
        ),
        thumbnail: "https://thumbnail2.jpg",
        caption: "This is videos caption  2",
        altText: "test alt text 2",
        isVideo: true
      }
    ];
    const wrapper = render(<MediaGallery media={a} />);
    const thumbnails = wrapper.container.querySelectorAll(".Thumbnail");
    const previewImage = wrapper.container.querySelector(".preview-image");
    expect(previewImage).toHaveAttribute("alt", "test video 1");
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[1]).toHaveClass("Thumbnail--selected");
    fireEvent.click(thumbnails[0]);
    expect(thumbnails[0]).toHaveClass("Thumbnail--selected");
    expect(thumbnails[1]).toHaveClass("Thumbnail--large");
    expect(previewImage).toHaveAttribute("alt", "test video 2");
    expect(wrapper.container).toMatchSnapshot();
  });

  it("test click on play icon", () => {
    const wrapper = render(<MediaGallery media={mockMedia} />);
    const playIcon = wrapper.container.querySelector(".play-icon");
    const thumbnails = wrapper.container.querySelectorAll(".Thumbnail");
    expect(thumbnails[1]).toHaveClass("Thumbnail--selected");
    fireEvent.click(thumbnails[1]);
    fireEvent.click(playIcon as Element);
    waitFor(() =>
      expect(document.querySelector(".ContainerDialog")).toBeInTheDocument()
    );
  });

  it("renders MobileThumbnails if isTouchDevice is true", () => {
    Object.defineProperty(document.documentElement, "ontouchstart", jest.fn());
    const { container } = render(<MediaGallery media={mockMedia} />);
    expect(container.querySelector(".thumbnails--touch")).toBeTruthy();
  });

  it("renders with main-image-wrapper--cover style if imageSize is not contain", () => {
    const { container } = render(
      <MediaGallery media={mockMedia} mediaSize="cover" />
    );

    expect(container.querySelector(".main-image-wrapper--cover")).toBeTruthy();
  });
});
