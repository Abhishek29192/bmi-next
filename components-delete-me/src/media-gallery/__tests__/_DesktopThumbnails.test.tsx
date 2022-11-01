import { fireEvent } from "@testing-library/react";
import React from "react";
import Thumbnail from "../../thumbnail/Thumbnail";
import { renderWithThemeProvider } from "../../__tests__/helper";
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
  renderWithThemeProvider(
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
    const { container, getAllByTestId, getByTestId, findByText } =
      renderedComponent();

    const thumbnails = getAllByTestId("default-thumbnail");
    expect(container.firstChild).toMatchSnapshot();
    expect(getByTestId("thumbnail-scroller-left")).toBeTruthy();
    expect(getByTestId("thumbnail-scroller-right")).toBeTruthy();
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[1].classList.toString()).toContain("Thumbnail-selected");
    expect(
      await (await findByText(images[0].altText as string)).classList.toString()
    ).toContain("Thumbnail-accessibilityText");

    fireEvent.click(thumbnails[1]);
    expect(onThumbnailClick).toHaveBeenCalledWith(expect.any(Object), 1);
  });
  it("renders correctly with media prop", async () => {
    const { container, getAllByTestId, getByTestId } = renderedComponent(true);

    const thumbnails = getAllByTestId("default-thumbnail");
    expect(container.firstChild).toMatchSnapshot();
    expect(getByTestId("thumbnail-scroller-left")).toBeTruthy();
    expect(getByTestId("thumbnail-scroller-right")).toBeTruthy();
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[1].classList.toString()).toContain("Thumbnail-selected");
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
      const { getByTestId } = renderedComponent();
      const scrollerButtonLeft = getByTestId(
        "thumbnail-scroller-left"
      ) as Element;
      const scrollerButtonRight = getByTestId(
        "thumbnail-scroller-right"
      ) as Element;
      const scroller = getByTestId("thumbnail-scroller") as Element;
      const parentElement = scroller?.parentElement as HTMLElement;

      Object.defineProperty(parentElement, "offsetWidth", {
        configurable: true,
        value: parentOffsetWidth
      });
      expect(getByTestId("thumbnail-scroller")).toHaveStyle("margin-right: 0%");

      fireEvent.click(scrollerButtonLeft);
      expect(scroller).toHaveStyle(`margin-right: ${expectedMarginRight}%`);

      fireEvent.transitionEnd(scroller);
      fireEvent.click(scrollerButtonRight);
      expect(scroller).toHaveStyle(`margin-right: ${expectedMarginRight * 2}%`);
    });

    it("should not scroll if isTransitioning", async () => {
      const { getByTestId } = renderedComponent();
      const scrollerButtonLeft = getByTestId(
        "thumbnail-scroller-left"
      ) as Element;
      const scrollerButtonRight = getByTestId(
        "thumbnail-scroller-right"
      ) as Element;
      const scroller = getByTestId("thumbnail-scroller") as Element;
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
      const { getByTestId } = renderedComponent();
      const scrollerButtonLeft = getByTestId(
        "thumbnail-scroller-left"
      ) as Element;
      const scrollerButtonRight = getByTestId(
        "thumbnail-scroller-right"
      ) as Element;
      const scroller = getByTestId("thumbnail-scroller") as Element;

      expect(getByTestId("thumbnail-scroller")).toHaveStyle("margin-right: 0%");

      fireEvent.click(scrollerButtonLeft);
      expect(scroller).toHaveStyle(`margin-right: -100%`);

      fireEvent.transitionEnd(scroller);
      fireEvent.click(scrollerButtonRight);
      expect(scroller).toHaveStyle(`margin-right: 0%`);
    });
  });

  it("shoule run calculateLeftRightVisibility correctly when thumbnailsElement offsetWidth is not 0 or undefined", async () => {
    const { getByTestId } = renderedComponent();
    const scroller = getByTestId("thumbnail-scroller") as Element;
    const scrollerButtonLeft = getByTestId(
      "thumbnail-scroller-left"
    ) as Element;

    Object.defineProperty(scroller, "offsetWidth", {
      configurable: true,
      value: 50
    });

    fireEvent.click(scrollerButtonLeft);
    expect(
      getByTestId("thumbnail-scroller-left").classList.toString()
    ).not.toContain("Thumbnails-thumbScrollerHidden");
    expect(
      getByTestId("thumbnail-scroller-right").classList.toString()
    ).toContain("Thumbnails-thumbScrollerHidden");

    fireEvent.transitionEnd(scroller);

    expect(
      getByTestId("thumbnail-scroller-left").classList.toString()
    ).not.toContain("Thumbnails-thumbScrollerHidden");
    expect(
      getByTestId("thumbnail-scroller-right").classList.toString()
    ).not.toContain("Thumbnails-thumbScrollerHidden");
  });

  it("should run calculateLeftRightVisibility correctly when no parentElement", async () => {
    const { getByTestId } = renderedComponent();
    const scrollerButtonLeft = getByTestId(
      "thumbnail-scroller-left"
    ) as Element;
    const scroller = getByTestId("thumbnail-scroller") as Element;

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
      getByTestId("thumbnail-scroller-left").classList.toString()
    ).not.toContain("Thumbnails-thumbScrollerHidden");
    expect(
      getByTestId("thumbnail-scroller-right").classList.toString()
    ).toContain("Thumbnails-thumbScrollerHidden");

    fireEvent.transitionEnd(scroller);

    expect(
      getByTestId("thumbnail-scroller-left").classList.toString()
    ).not.toContain("Thumbnails-thumbScrollerHidden");
    expect(
      getByTestId("thumbnail-scroller-right").classList.toString()
    ).toContain("Thumbnails-thumbScrollerHidden");
  });
});
