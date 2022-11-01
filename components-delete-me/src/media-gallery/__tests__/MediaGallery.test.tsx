import { fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import YoutubeVideo from "../../youtube-video/YoutubeVideo";
import { renderWithThemeProvider } from "../../__tests__/helper";
import MediaGallery from "../MediaGallery";

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
        videoUrl="https://youtu.be/A-RfHC91Ewc"
        embedHeight={720}
        embedWidth={1280}
        layout="dialog"
        previewImageSource="https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
      />
    ),
    thumbnail: "",
    caption: "This is videos caption",
    isVideo: true
  }
];
describe("MediaGallery component", () => {
  it("renders correctly with full data", () => {
    const { container } = renderWithThemeProvider(
      <MediaGallery media={mockMedia} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with no data", () => {
    const { container } = renderWithThemeProvider(<MediaGallery media={[]} />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with no media data", () => {
    const mockMedia = [
      {
        media: undefined,
        isVideo: false
      }
    ];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { container } = renderWithThemeProvider(
      <MediaGallery media={mockMedia} />
    );
    expect(container).toMatchSnapshot();
  });

  it("test click on nonsortable thumbnails", () => {
    const data = [
      {
        media: (
          <YoutubeVideo
            label="test video 1"
            videoUrl="https://youtu.be/A-RfHC91Ewc"
            embedHeight={720}
            embedWidth={1280}
            layout="dialog"
            previewImageSource="https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
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
            videoUrl="https://youtu.be/A-RfHC91Awc"
            embedHeight={720}
            embedWidth={1280}
            layout="dialog"
            previewImageSource="https://i.ytimg.com/vi/A-RfHC91Awc/maxresdefault.jpg"
          />
        ),
        thumbnail: "https://thumbnail2.jpg",
        caption: "This is videos caption  2",
        altText: "test alt text 2",
        isVideo: true
      }
    ];
    const { container, getAllByTestId, getByTestId } = renderWithThemeProvider(
      <MediaGallery media={data} />
    );
    const thumbnails = getAllByTestId("default-thumbnail");
    const previewImage = getByTestId("youtube-preview-image");
    expect(previewImage).toHaveAttribute("alt", "test video 1");
    expect(thumbnails[0].classList.toString()).toContain("Thumbnail-selected");
    fireEvent.click(thumbnails[1]);
    expect(thumbnails[1].classList.toString()).toContain("Thumbnail-selected");
    expect(thumbnails[1].classList.toString()).toContain("Thumbnail-large");
    expect(previewImage).toHaveAttribute("alt", "test video 2");
    expect(container).toMatchSnapshot();
  });

  it("test click on play icon", async () => {
    const { container, getAllByTestId, getByTestId } = renderWithThemeProvider(
      <MediaGallery media={mockMedia} />
    );
    const playIcon = getByTestId("thumbnail-play-icon");
    const thumbnails = getAllByTestId("default-thumbnail");
    expect(thumbnails[0].classList.toString()).toContain("Thumbnail-selected");
    fireEvent.click(thumbnails[1]);
    fireEvent.click(playIcon as Element);
    expect(container).toMatchSnapshot();
    expect(
      await waitFor(() =>
        document.querySelector("[class*='ContainerDialog-root-']")
      )
    ).toBeInTheDocument();
  });

  it("test first element of media array is selected by default", () => {
    const { getAllByTestId } = renderWithThemeProvider(
      <MediaGallery media={mockMedia} />
    );
    const thumbnails = getAllByTestId("default-thumbnail");
    expect(thumbnails[0].classList.toString()).toContain("Thumbnail-selected");
  });

  it("renders MobileThumbnails if isTouchDevice is true", () => {
    Object.defineProperty(document.documentElement, "ontouchstart", jest.fn());
    const { container } = renderWithThemeProvider(
      <MediaGallery media={mockMedia} />
    );
    expect(
      container.querySelector("[class*='Thumbnails-touch-']")
    ).toBeTruthy();
  });

  it("renders with mainImageWrappercover style if mediaSize is not contain", () => {
    const { container } = renderWithThemeProvider(
      <MediaGallery media={mockMedia} mediaSize="cover" />
    );

    expect(
      container.querySelector("[class*=MediaGallery-mainImageWrapperCover-]")
    ).toBeTruthy();
  });
});
