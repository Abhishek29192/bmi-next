import { renderHook } from "@testing-library/react-hooks";
import React, { MutableRefObject } from "react";

import { useScrollTo } from "../components";

describe("useScrollTo", () => {
  it("should execute scrollTo function if card expansion completed", () => {
    React.useState = jest.fn().mockReturnValueOnce([true, {}]);
    const ref = {
      current: {
        parentElement: { scrollTo: jest.fn() }
      }
    };
    renderHook(() =>
      useScrollTo(true, ref as unknown as MutableRefObject<HTMLElement>)
    );
    expect(ref.current.parentElement.scrollTo).toHaveBeenCalledTimes(1);
  });
  it("shouldn't execute scrollTo function if card expansion didn't completed", () => {
    React.useState = jest.fn().mockReturnValueOnce([false, {}]);
    const ref = {
      current: {
        parentElement: { scrollTo: jest.fn() }
      }
    };
    renderHook(() =>
      useScrollTo(true, ref as unknown as MutableRefObject<HTMLElement>)
    );
    expect(ref.current.parentElement.scrollTo).toHaveBeenCalledTimes(0);
  });
});
