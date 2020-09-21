import React from "react";
import Pagination from "../";
import { render } from "@testing-library/react";
import * as all from "@bmi/use-dimensions";

function mockAvailableWidth(width) {
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
  it("renders without go-to-first, go-to-last double arrow buttons with less than 10 pages", () => {
    mockAvailableWidth(11 * 48);
    const { container } = render(<Pagination page={1} count={9} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with page buttons, go-to-first, go-to-last double arrow buttons and ellipses with >= 10 pages", () => {
    mockAvailableWidth(11 * 48);
    const { container } = render(<Pagination page={1} count={10} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with only prev and next buttons", () => {
    mockAvailableWidth(2 * 48);
    const { container } = render(<Pagination page={1} count={10} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with only prev, next and current page button only", () => {
    mockAvailableWidth(3 * 48);
    const { container } = render(<Pagination page={4} count={10} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders without first and last page buttons", () => {
    mockAvailableWidth(7 * 48);
    const { container } = render(<Pagination page={4} count={10} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders all buttons without go-to-first, go-to-last double arrow buttons", () => {
    mockAvailableWidth(7 * 48);
    const { container } = render(<Pagination page={1} count={5} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
