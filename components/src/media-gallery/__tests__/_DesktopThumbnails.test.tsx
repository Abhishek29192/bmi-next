import { fireEvent, render } from "@testing-library/react";
import React from "react";
import Thumbnail from "../../thumbnail/Thumbnail";
import DesktopThumbnails from "../_DesktopThumbnails";
import mockImage from "./images/demo-tiles.jpg";

const onThumbnailClick = jest.fn();
const THUMBNAIL_WIDTH = 86;
export const getImages = (isMedia: boolean) => [
  {
    media: isMedia ? <img src={mockImage} alt="Lorem ipsum 1" /> : undefined,
    thumbnail: mockImage,
    altText: "test alt text 1",
    isVideo: false
  },
  {
    media: isMedia ? <img src={mockImage} alt="Lorem ipsum 2" /> : undefined,
    altText: "test alt text 2",
    thumbnail: mockImage,
    isVideo: false
  }
];
const renderedComponent = (isMedia = false) =>
  render(
    <DesktopThumbnails
      media={getImages(isMedia)}
      component={(props) => (
        <Thumbnail data-testid="default-thumbnail" {...props} />
      )}
      activeImageIndex={1}
      onThumbnailClick={onThumbnailClick}
    />
  );

beforeAll(() => {
  jest.clearAllMocks();
});

describe("_DesktopThumbnails component", () => {
  it("renders correctly without media prop", async () => {
    const images = getImages(false);
    const { container, getAllByTestId, findByText } = renderedComponent();

    const thumbnails = getAllByTestId("default-thumbnail");
    const scrollerButtons = container.querySelectorAll(".thumb-scroller");
    expect(container.firstChild).toMatchSnapshot();
    expect(scrollerButtons).toHaveLength(2);
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[1]).toHaveClass("Thumbnail--selected");
    expect(await findByText(images[0].altText as string)).toHaveClass(
      "accessibility-text"
    );

    fireEvent.click(thumbnails[1]);
    expect(onThumbnailClick).toHaveBeenCalledWith(expect.any(Object), 1);
  });
  it("renders correctly with media prop", async () => {
    const { container, getAllByTestId } = renderedComponent(true);

    const thumbnails = getAllByTestId("default-thumbnail");
    const scrollerButtons = container.querySelectorAll(".thumb-scroller");
    expect(container.firstChild).toMatchSnapshot();
    expect(scrollerButtons).toHaveLength(2);
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[1]).toHaveClass("Thumbnail--selected");
    expect(container.getElementsByTagName("img")).toHaveLength(2);

    fireEvent.click(thumbnails[1]);
    expect(onThumbnailClick).toHaveBeenCalledWith(expect.any(Object), 1);
  });

  describe("when click on the ThumbScrollerButton", () => {
    const parentOffsetWidth = 200;
    const images = getImages(false);
    const expectedMarginRight =
      -(THUMBNAIL_WIDTH * images.length - parentOffsetWidth) / 2;

    it("should scroll correctly", async () => {
      const { container } = renderedComponent();
      const scrollerButtonLeft = container.querySelector(
        ".thumb-scroller--left"
      ) as Element;
      const scrollerButtonRight = container.querySelector(
        ".thumb-scroller--right"
      ) as Element;
      const scroller = container.querySelector(".scroller") as Element;
      const parentElement = scroller?.parentElement as HTMLElement;

      Object.defineProperty(parentElement, "offsetWidth", {
        configurable: true,
        value: parentOffsetWidth
      });
      expect(container.querySelector(".scroller")).toHaveStyle(
        "margin-right: 0%"
      );

      fireEvent.click(scrollerButtonLeft);
      expect(scroller).toHaveStyle(`margin-right: ${expectedMarginRight}%`);

      fireEvent.transitionEnd(scroller);
      fireEvent.click(scrollerButtonRight);
      expect(scroller).toHaveStyle(`margin-right: ${expectedMarginRight * 2}%`);
    });

    it("should not scroll if isTransitioning", async () => {
      const { container } = renderedComponent();
      const scrollerButtonLeft = container.querySelector(
        ".thumb-scroller--left"
      ) as Element;
      const scrollerButtonRight = container.querySelector(
        ".thumb-scroller--right"
      ) as Element;
      const scroller = container.querySelector(".scroller") as Element;
      const parentElement = scroller?.parentElement as HTMLElement;

      Object.defineProperty(parentElement, "offsetWidth", {
        configurable: true,
        value: parentOffsetWidth
      });

      fireEvent.click(scrollerButtonLeft);
      expect(scroller).toHaveStyle(`margin-right: ${expectedMarginRight}%`);

      fireEvent.click(scrollerButtonRight);
      expect(scroller).toHaveStyle(`margin-right: ${expectedMarginRight}%`);
    });

    it("should scroll correctly when no parentElement offsetWidth", () => {
      const { container } = renderedComponent();
      const scrollerButtonLeft = container.querySelector(
        ".thumb-scroller--left"
      ) as Element;
      const scrollerButtonRight = container.querySelector(
        ".thumb-scroller--right"
      ) as Element;
      const scroller = container.querySelector(".scroller") as Element;

      expect(container.querySelector(".scroller")).toHaveStyle(
        "margin-right: 0%"
      );

      fireEvent.click(scrollerButtonLeft);
      expect(scroller).toHaveStyle(`margin-right: -100%`);

      fireEvent.transitionEnd(scroller);
      fireEvent.click(scrollerButtonRight);
      expect(scroller).toHaveStyle(`margin-right: 0%`);
    });
  });

  it("shoule run calculateLeftRightVisibility correctly when thumbnailsElement offsetWidth is not 0 or undefined", async () => {
    const { container } = renderedComponent();
    const scroller = container.querySelector(".scroller") as Element;
    const scrollerButtonLeft = container.querySelector(
      ".thumb-scroller--left"
    ) as Element;

    Object.defineProperty(scroller, "offsetWidth", {
      configurable: true,
      value: 50
    });

    fireEvent.click(scrollerButtonLeft);
    expect(
      container.querySelector(".thumb-scroller--left.thumb-scroller--hidden")
    ).toBeFalsy();
    expect(
      container.querySelector(".thumb-scroller--right.thumb-scroller--hidden")
    ).toBeTruthy();

    fireEvent.transitionEnd(scroller);

    expect(
      container.querySelector(".thumb-scroller--left.thumb-scroller--hidden")
    ).toBeFalsy();
    expect(
      container.querySelector(".thumb-scroller--right.thumb-scroller--hidden")
    ).toBeFalsy();
  });

  it("should run calculateLeftRightVisibility correctly when no parentElement", async () => {
    const { container } = renderedComponent();
    const scrollerButtonLeft = container.querySelector(
      ".thumb-scroller--left"
    ) as Element;
    const scroller = container.querySelector(".scroller") as Element;

    Object.defineProperty(scroller, "offsetWidth", {
      configurable: true,
      value: 50
    });
    fireEvent.click(scrollerButtonLeft);
    Object.defineProperty(scroller, "parentElement", {
      configurable: true,
      value: null
    });
    Object.defineProperty(scroller, "offsetWidth", {
      configurable: true,
      value: 0
    });

    expect(
      container.querySelector(".thumb-scroller--left.thumb-scroller--hidden")
    ).toBeFalsy();
    expect(
      container.querySelector(".thumb-scroller--right.thumb-scroller--hidden")
    ).toBeTruthy();

    fireEvent.transitionEnd(scroller);

    expect(
      container.querySelector(".thumb-scroller--left.thumb-scroller--hidden")
    ).toBeFalsy();
    expect(
      container.querySelector(".thumb-scroller--right.thumb-scroller--hidden")
    ).toBeTruthy();
  });
});
