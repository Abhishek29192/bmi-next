import { renderHook } from "@testing-library/react";
import useHasScrollbar from "../useHasScrollbar";

describe("useHasScrollbar", () => {
  const originalWindowWidth = window.innerWidth;
  const originalBodyWidth = document.body.offsetWidth;

  afterEach(() => {
    window.innerWidth = originalWindowWidth;
    Object.defineProperty(document.body, "offsetWidth", {
      value: originalBodyWidth,
      writable: true
    });
  });

  it("Works correctly if there is no scrollbar", () => {
    window.innerWidth = 1600;
    Object.defineProperty(document.body, "offsetWidth", {
      value: 1600,
      writable: true
    });

    const { result } = renderHook(useHasScrollbar);
    expect(result.current).toBeFalsy();
  });

  it("Works correctly if there is a scrollbar", () => {
    window.innerWidth = 1600;
    Object.defineProperty(document.body, "offsetWidth", {
      value: 1594,
      writable: true
    });

    const { result } = renderHook(useHasScrollbar);
    expect(result.current).toBeTruthy();
  });
});
