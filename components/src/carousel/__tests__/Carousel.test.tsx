import React from "react";
import { cleanup, fireEvent } from "@testing-library/react";
import snapshotDiff from "snapshot-diff";
import mockConsole from "jest-mock-console";
import { useMediaQuery } from "@material-ui/core";
import Carousel, { getPageFromAbsoluteIndex } from "../Carousel";
import { renderWithThemeProvider } from "../../__tests__/helper";

jest.mock("@material-ui/core", () => ({
  ...(jest.requireActual("@material-ui/core") as any),
  useMediaQuery: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;

beforeAll(() => {
  mockConsole();
});

afterEach(cleanup);

describe("Carousel component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Carousel isSwipeDisabled>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );
    expect(container).toMatchSnapshot();
  });

  it("navigates to next page", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = renderWithThemeProvider(
      <div>
        <Carousel isSwipeDisabled>
          <Carousel.Slide>First slide</Carousel.Slide>
          <Carousel.Slide>Second slide</Carousel.Slide>
          <Carousel.Slide>Third slide</Carousel.Slide>
          <Carousel.Controls nextLabel={nextLabel} />
        </Carousel>
      </div>
    );
    const containerBeforeClick = container!.cloneNode(true);

    fireEvent.click(getByLabelText(nextLabel));

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });

  it("navigates to previous page", () => {
    const previousLabel = "previous";
    const { container, getByLabelText } = renderWithThemeProvider(
      <div>
        <Carousel isSwipeDisabled>
          <Carousel.Slide>First slide</Carousel.Slide>
          <Carousel.Slide>Second slide</Carousel.Slide>
          <Carousel.Slide>Third slide</Carousel.Slide>
          <Carousel.Controls previousLabel={previousLabel} />
        </Carousel>
      </div>
    );
    const containerBeforeClick = container!.cloneNode(true);

    fireEvent.click(getByLabelText(previousLabel));

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });

  it("works when controlled", () => {
    const { container, rerender } = renderWithThemeProvider(
      <Carousel initialPage={0}>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );
    const containerBeforeClick = container!.cloneNode(true);

    rerender(
      <Carousel initialPage={1}>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });
  // TODO: The way react-swiplable-views tests this is forcing the function call
  // which is not ideal. I wasn't able to figure out what event would trigger the function.
  it.skip("triggers an onPageChange event", () => {
    const onPageChange = jest.fn();

    const { rerender, getByText } = renderWithThemeProvider(
      <Carousel initialPage={0} onPageChange={onPageChange}>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );

    rerender(
      <Carousel initialPage={1} onPageChange={onPageChange}>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );

    fireEvent.touchEnd(getByText("Second slide"));

    expect(onPageChange.mock.calls).toMatchSnapshot();
  });

  it("starts and stops autoplay when interacting with the carousel", async () => {
    const nextLabel = "next";
    const { getByTestId } = renderWithThemeProvider(
      <div>
        <Carousel isSwipeDisabled hasAutoPlay pauseAutoPlayOnHover>
          <Carousel.Slide>First slide</Carousel.Slide>
          <Carousel.Slide>Second slide</Carousel.Slide>
          <Carousel.Slide>Third slide</Carousel.Slide>
          <Carousel.Controls nextLabel={nextLabel} />
        </Carousel>
      </div>
    );

    // Stops
    fireEvent.mouseOver(getByTestId("carousel"));
    expect(getByTestId("carousel-interacted")).toBeTruthy();

    // Starts
    fireEvent.mouseOut(getByTestId("carousel-interacted"));
    expect(getByTestId("carousel")).toBeTruthy();
  });

  it("renders correctly with arrow controls", () => {
    const { container } = renderWithThemeProvider(
      <Carousel
        slidesPerPage={{
          xs: 1,
          sm: 2,
          lg: 4
        }}
      >
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls type="arrows" />
      </Carousel>
    );
    expect(container).toMatchSnapshot();
  });

  it("doesn't render controls when scroll is finite and pages per slides = total slides", () => {
    const { container } = renderWithThemeProvider(
      <Carousel
        scroll="finite"
        slidesPerPage={{
          xs: 1,
          sm: 2,
          lg: 4
        }}
        hasGutter
      >
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls type="arrows" />
      </Carousel>
    );
    expect(container).toMatchSnapshot();
  });

  describe("in mobile view", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(true);
    });

    it("should render slides with equal height", () => {
      const { container } = renderWithThemeProvider(
        <Carousel
          scroll="finite"
          slidesPerPage={{
            xs: 1,
            sm: 2,
            lg: 4
          }}
          hasGutter
          enableAnimateHeightMobile={false}
        >
          <Carousel.Slide>First slide</Carousel.Slide>
          <Carousel.Slide>Second slide</Carousel.Slide>
          <Carousel.Slide>Third slide</Carousel.Slide>
          <Carousel.Controls type="arrows" />
        </Carousel>
      );
      expect(
        container.querySelectorAll("[class*='Carousel-slideConstantHeight-']")
      ).toHaveLength(1);
    });
  });

  describe("getPageFromAbsoluteIndex function", () => {
    it("returns page number from index >= 0 and <= total", () => {
      expect(getPageFromAbsoluteIndex(0, 3)).toBe(1);

      expect(getPageFromAbsoluteIndex(1, 3)).toBe(2);

      expect(getPageFromAbsoluteIndex(2, 3)).toBe(3);
    });

    it("returns page number from index > total", () => {
      expect(getPageFromAbsoluteIndex(3, 3)).toBe(1);

      expect(getPageFromAbsoluteIndex(4, 3)).toBe(2);

      expect(getPageFromAbsoluteIndex(5, 3)).toBe(3);
    });

    it("returns page number from index < 0", () => {
      expect(getPageFromAbsoluteIndex(-1, 3)).toBe(3);

      expect(getPageFromAbsoluteIndex(-2, 3)).toBe(2);

      expect(getPageFromAbsoluteIndex(-3, 3)).toBe(1);
    });
  });
});
