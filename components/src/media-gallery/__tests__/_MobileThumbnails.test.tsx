import { ThemeProvider } from "@bmi/components";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import Thumbnail from "../../thumbnail/Thumbnail";
import MobileThumbnails from "../_MobileThumbnails";
import mockImage from "./images/demo-tiles.jpg";
import { getImages } from "./_DesktopThumbnails.test";

const onThumbnailClick = jest.fn();
const setTimeoutSpy = jest.spyOn(global, "setTimeout");
const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
const THUMBNAIL_WIDTH = 86;

beforeAll(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  Element.prototype.scrollTo = jest.fn();
});

const renderComponent = (images = getImages(false)) => {
  return render(
    <ThemeProvider>
      <MobileThumbnails
        media={images}
        component={(props) => (
          <Thumbnail data-testid="default-thumbnail" {...props} />
        )}
        activeImageIndex={1}
        onThumbnailClick={onThumbnailClick}
      />
    </ThemeProvider>
  );
};

describe("_MobileThumbnails component", () => {
  it("renders correctly", async () => {
    const images = getImages(false);

    const { container, getAllByTestId, getByTestId, findByText } =
      renderComponent(images);

    const thumbnails = getAllByTestId("default-thumbnail");
    const scroller = getByTestId("thumbnail-scroller");
    expect(container.firstChild).toMatchSnapshot();
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[0]).toHaveStyle(`background-image: url(${mockImage})`);
    expect(thumbnails[1]).toHaveStyle(`background-image: url(${mockImage})`);
    expect(thumbnails[1].className.includes("Thumbnail-selected-")).toBe(true);
    expect(scroller).toHaveStyle(`width: ${images.length * THUMBNAIL_WIDTH}px`);
    expect(
      await (
        await findByText(images[0].altText as string)
      ).className.includes("Thumbnail-accessibilityText")
    ).toBe(true);

    fireEvent.click(thumbnails[1]);
    expect(onThumbnailClick).toHaveBeenCalledWith(expect.any(Object), 1);
  });
  it("renders correctly with media prop component", async () => {
    const images = getImages(true);

    const { container, getAllByTestId, getByTestId } = renderComponent(images);

    const thumbnails = getAllByTestId("default-thumbnail");
    const scroller = getByTestId("thumbnail-scroller");
    expect(container.firstChild).toMatchSnapshot();
    expect(thumbnails).toHaveLength(2);
    expect(container.getElementsByTagName("img")).toHaveLength(2);
    expect(thumbnails[1].className.includes("Thumbnail-selected-")).toBe(true);
    expect(scroller).toHaveStyle(`width: ${images.length * THUMBNAIL_WIDTH}px`);

    fireEvent.click(thumbnails[1]);
    expect(onThumbnailClick).toHaveBeenCalledWith(expect.any(Object), 1);
  });

  it("scroll correctly", async () => {
    const { container, getByTestId } = renderComponent();
    const scroller = getByTestId("thumbnail-scroller");
    const scrollToSpy = jest.spyOn(scroller!.parentElement!, "scrollTo");
    expect(container.firstChild).toMatchSnapshot();
    expect(scroller).toBeTruthy();

    Object.defineProperty(scroller?.parentElement, "scrollLeft", { value: 1 });
    Object.defineProperty(scroller, "offsetWidth", { value: 10 });

    jest.clearAllMocks();
    fireEvent.scroll(scroller as Element, {
      target: { scrollX: 100 }
    });

    expect(clearTimeoutSpy.mock.calls.length).toBe(1);
    expect(setTimeoutSpy.mock.calls.length).toBe(1);
    await waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalledWith({ left: 10 });
    });
    expect(
      getByTestId("thumbnails-root").className.includes(
        "Thumbnails-leftGradient-"
      )
    ).toBe(true);
    expect(
      getByTestId("thumbnails-root").className.includes(
        "Thumbnails-rightGradient-"
      )
    ).toBe(true);
  });

  it("scroll correctly when parentScrollLeft, parentOffsetWidth and offsetWidth is 0", async () => {
    const images = [
      {
        media: <img src={mockImage} alt="Lorem ipsum 1" />,
        thumbnail: mockImage,
        altText: "test alt text",
        isVideo: false
      },
      {
        media: <img src={mockImage} alt="Lorem ipsum 2" />,
        thumbnail: mockImage,
        isVideo: false
      }
    ];

    const { container, getByTestId } = render(
      <ThemeProvider>
        <MobileThumbnails
          media={images}
          component={(props) => (
            <Thumbnail data-testid="default-thumbnail" {...props} />
          )}
          activeImageIndex={0}
          onThumbnailClick={onThumbnailClick}
        />
      </ThemeProvider>
    );
    const scroller = getByTestId("thumbnail-scroller");
    const scrollToSpy = jest.spyOn(scroller!.parentElement!, "scrollTo");
    expect(container.firstChild).toMatchSnapshot();
    expect(scroller).toBeTruthy();

    jest.clearAllMocks();
    fireEvent.scroll(scroller as Element, {
      target: { scrollX: 100 }
    });

    expect(clearTimeoutSpy.mock.calls.length).toBe(1);
    expect(setTimeoutSpy.mock.calls.length).toBe(1);
    await waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalledWith({ left: undefined });
    });
    expect(container.querySelector(".left-gradient")).toBeFalsy();
    expect(container.querySelector(".right-gradient")).toBeFalsy();
  });
});
