import React from "react";
import { render } from "@testing-library/react";
import * as all from "@bmi-digital/use-dimensions";
import Pagination from "../Pagination";

const firstPageLabel = "Go to first page";
const lastPageLabel = "Go to last page";
const prevPageLabel = "Go to previous page";
const nextPageLabel = "Go to next page";
const page10Label = "Go to page 10";

function mockAvailableWidth(width: number) {
  jest
    .spyOn(all, "default")
    .mockImplementation(() => [
      () => ({}),
      { width, height: 0 },
      document.createElement("div")
    ]);
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Pagination component", () => {
  it("renders correctly", () => {
    mockAvailableWidth(11 * 48);
    const { getByLabelText } = render(<Pagination page={1} count={10} />);
    expect(getByLabelText(firstPageLabel).children[0].children[0]).toHaveStyle(
      "font-size: 16px"
    );
    expect(getByLabelText(lastPageLabel).children[0].children[0]).toHaveStyle(
      "font-size: 16px"
    );
  });

  it("renders without go-to-first, go-to-last double arrow buttons with less than 10 pages", () => {
    mockAvailableWidth(11 * 48);
    const { container, queryByLabelText } = render(
      <Pagination page={1} count={9} />
    );
    expect(container).toMatchSnapshot();
    expect(queryByLabelText(firstPageLabel)).toBeFalsy();
    expect(queryByLabelText(lastPageLabel)).toBeFalsy();
  });

  it("renders with page buttons, go-to-first, go-to-last double arrow buttons and ellipses with >= 10 pages", () => {
    mockAvailableWidth(11 * 48);
    const { container, queryByLabelText } = render(
      <Pagination page={1} count={10} />
    );
    const page10Button = container.querySelector(
      `*[aria-label^="${page10Label}"]`
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ellipsisContainer =
      page10Button &&
      ((page10Button as Element)?.parentElement as HTMLElement)
        ?.previousSibling;
    const ellipsis = ellipsisContainer?.firstChild?.firstChild as HTMLElement;
    expect(container).toMatchSnapshot();
    expect(queryByLabelText(firstPageLabel)).toBeTruthy();
    expect(queryByLabelText(lastPageLabel)).toBeTruthy();
    expect(queryByLabelText(prevPageLabel)).toBeTruthy();
    expect(queryByLabelText(nextPageLabel)).toBeTruthy();
    expect(queryByLabelText(page10Label)).toBeTruthy();
    expect(ellipsisContainer?.childNodes[0].childNodes[0]).toBeTruthy();
    expect(ellipsis).toHaveStyle("font-size: 16px");
    expect(ellipsis.tagName).toBe("svg");
  });

  it("renders with only prev and next buttons", () => {
    mockAvailableWidth(2 * 48);
    const { container, queryByLabelText } = render(
      <Pagination page={1} count={10} />
    );
    expect(container).toMatchSnapshot();
    expect(queryByLabelText(firstPageLabel)).toBeFalsy();
    expect(queryByLabelText(lastPageLabel)).toBeFalsy();
    expect(queryByLabelText(prevPageLabel)).toBeTruthy();
    expect(queryByLabelText(nextPageLabel)).toBeTruthy();
  });

  it("renders with only prev, next and current page button only", () => {
    mockAvailableWidth(3 * 48);
    const { container, queryByLabelText } = render(
      <Pagination page={4} count={10} />
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentPage = queryByLabelText("page 4");
    expect(container).toMatchSnapshot();
    expect(queryByLabelText(firstPageLabel)).toBeFalsy();
    expect(queryByLabelText(lastPageLabel)).toBeFalsy();
    expect(queryByLabelText(prevPageLabel)).toBeTruthy();
    expect(queryByLabelText(nextPageLabel)).toBeTruthy();
    expect(currentPage?.getAttribute("aria-current")).toBe("true");
  });

  it("renders without first and last page buttons", () => {
    mockAvailableWidth(7 * 48);
    const { container, queryByLabelText } = render(
      <Pagination page={4} count={5} />
    );
    expect(container).toMatchSnapshot();
    expect(queryByLabelText(firstPageLabel)).toBeFalsy();
    expect(queryByLabelText(lastPageLabel)).toBeFalsy();
  });

  it("renders all buttons without go-to-first, go-to-last double arrow buttons", () => {
    mockAvailableWidth(7 * 48);
    const { container, queryByLabelText } = render(
      <Pagination page={1} count={5} />
    );
    expect(container).toMatchSnapshot();
    expect(queryByLabelText(firstPageLabel)).toBeFalsy();
    expect(queryByLabelText(lastPageLabel)).toBeFalsy();
  });

  it("has no width in dimensions", () => {
    jest
      .spyOn(all, "default")
      .mockImplementation(() => [
        () => ({}),
        { height: 0 },
        document.createElement("div")
      ]);
    const setStateSpy = jest.spyOn(React, "useState");
    render(<Pagination page={1} count={5} />);
    expect(setStateSpy).lastCalledWith(11);
  });

  it("renders correctly under hideAllPages condition", () => {
    mockAvailableWidth(2 * 48);
    const { container } = render(<Pagination page={1} count={2} />);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const paginationContainer = container.querySelector(".MuiPagination-ul");
    expect(container).toMatchSnapshot();
    expect(paginationContainer?.childNodes[1].childNodes.length).toBe(0);
    expect(paginationContainer?.childNodes[2].childNodes.length).toBe(0);
  });

  it("renders correctly under reducedMode", () => {
    mockAvailableWidth(5 * 48);
    const { container, queryByText, queryByLabelText } = render(
      <Pagination page={1} count={7} />
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const paginationContainer = container.querySelector(".MuiPagination-ul");
    expect(container).toMatchSnapshot();
    expect(queryByText(1)).toBeTruthy();
    expect(paginationContainer?.childNodes[3].childNodes.length).toBe(0);
    expect(paginationContainer?.childNodes[4].childNodes.length).toBe(0);
    expect(paginationContainer?.childNodes[5].childNodes.length).toBe(0);
    expect(paginationContainer?.childNodes[6].childNodes.length).toBe(0);
    expect(queryByLabelText(firstPageLabel)).toBeTruthy();
    expect(queryByLabelText(prevPageLabel)).toBeTruthy();
  });

  it("covers test for count is not provided", () => {
    mockAvailableWidth(5 * 48);
    const { container, queryByLabelText } = render(<Pagination page={1} />);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const paginationContainer = container.querySelector(".MuiPagination-ul");
    expect(container).toMatchSnapshot();
    expect(paginationContainer?.children.length).toBe(3);
    expect(queryByLabelText("page 1")).toBeTruthy();
  });
});
