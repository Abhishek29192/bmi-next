import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Thumbnail from "@bmi/thumbnail";
import MobileThumbnails from "../_MobileThumbnails";
import mockImage from "./images/demo-tiles.jpg";

const onThumbnailClick = jest.fn();
const setTimeoutSpy = jest.spyOn(global, "setTimeout");
const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
const THUMBNAIL_WIDTH = 86;

beforeAll(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe("_MobileThumbnails component", () => {
  it("renders correctly", async () => {
    const images = [
      {
        media: <img src={mockImage} alt="Lorem ipsum 1" />,
        thumbnail: mockImage,
        altText: "test alt text 1",
        isVideo: false
      },
      {
        media: <img src={mockImage} alt="Lorem ipsum 2" />,
        thumbnail: mockImage,
        altText: "test alt text 2",
        isVideo: false
      }
    ];

    const { container, getAllByTestId, findByText } = render(
      <MobileThumbnails
        images={images}
        component={(props) => (
          <Thumbnail data-testid="default-thumbnail" {...props} />
        )}
        activeImageIndex={1}
        onThumbnailClick={onThumbnailClick}
      />
    );

    const thumbnails = getAllByTestId("default-thumbnail");
    const scroller = container.querySelector(".scroller");
    expect(container.firstChild).toMatchSnapshot();
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[0]).toHaveStyle(`background-image: url(${mockImage})`);
    expect(thumbnails[1]).toHaveStyle(`background-image: url(${mockImage})`);
    expect(thumbnails[1]).toHaveClass("Thumbnail--selected");
    expect(scroller).toHaveStyle(`width: ${images.length * THUMBNAIL_WIDTH}px`);
    expect(await findByText(images[0].altText as string)).toHaveClass(
      "accessibility-text"
    );

    fireEvent.click(thumbnails[1]);
    expect(onThumbnailClick).toHaveBeenCalledWith(expect.any(Object), 1);
  });

  it("scroll correctly", async () => {
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

    const { container } = render(
      <MobileThumbnails
        images={images}
        activeImageIndex={0}
        onThumbnailClick={onThumbnailClick}
      />
    );
    const scroller = container.querySelector(".scroller");
    const scrollToSpy = ((scroller?.parentElement as HTMLElement).scrollTo =
      jest.fn());
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
    expect(container.querySelector(".thumbnails--left-gradient")).toBeTruthy();
    expect(container.querySelector(".thumbnails--right-gradient")).toBeTruthy();
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

    const { container } = render(
      <MobileThumbnails
        images={images}
        component={(props) => (
          <Thumbnail data-testid="default-thumbnail" {...props} />
        )}
        activeImageIndex={0}
        onThumbnailClick={onThumbnailClick}
      />
    );
    const scroller = container.querySelector(".scroller");
    const scrollToSpy = ((scroller?.parentElement as HTMLElement).scrollTo =
      jest.fn());
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
    expect(container.querySelector(".thumbnails--left-gradient")).toBeFalsy();
    expect(container.querySelector(".thumbnails--right-gradient")).toBeFalsy();
  });
});
