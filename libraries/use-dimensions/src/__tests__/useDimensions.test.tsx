import React from "react";
import { renderHook as clientRenderHook } from "@testing-library/react-hooks";
import { renderHook as renderHookServer } from "@testing-library/react-hooks/server";
import { render } from "@testing-library/react";

import useDimensions from "..";

describe("useDimensions helper", () => {
  beforeEach(() => {
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return default values", () => {
    const { result } = clientRenderHook(() =>
      useDimensions({
        liveMeasure: false
      })
    );
    expect(typeof result.current[0]).toEqual("function");
    expect(result.current[1]).toEqual({});
    expect(result.current[2]).toEqual(null);
  });
  it("should return node element and values of dimensions if assigned to element", () => {
    const { result } = clientRenderHook(() => useDimensions());
    const node = <div ref={result.current[0]}>test</div>;
    render(node);
    expect(typeof result.current[0]).toEqual("function");
    expect(result.current[1]).toEqual({
      bottom: 0,
      height: 0,
      right: 0,
      width: 0
    });
    expect(result.current[2]?.innerHTML).toEqual("test");
  });
  it("should return node element and values of dimensions if assigned to element without liveMeasure", () => {
    const { result } = clientRenderHook(() =>
      useDimensions({
        liveMeasure: false
      })
    );
    const node = <div ref={result.current[0]}>test</div>;
    render(node);
    expect(typeof result.current[0]).toEqual("function");
    expect(result.current[1]).toEqual({
      bottom: 0,
      height: 0,
      right: 0,
      width: 0
    });
    expect(result.current[2]?.innerHTML).toEqual("test");
  });
  it("should call useEffect hook if window is undefined", () => {
    Object.defineProperty(global, "window", { value: undefined });
    const { result } = renderHookServer(() => useDimensions());
    expect(typeof result.current[0]).toEqual("function");
    expect(result.current[1]).toEqual({});
    expect(result.current[2]).toEqual(null);
  });
});
