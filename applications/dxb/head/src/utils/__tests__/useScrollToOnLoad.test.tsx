import React from "react";
import { render, waitFor } from "@testing-library/react";
import { useScrollToOnLoad } from "../useScrollToOnLoad";

const SCROLL_Y = 500;

const defaultScrollY = window.screenY;
const defaultScrollTo = window.scrollTo;

const scrollTo = jest.fn();

const nodePosition = {
  top: 100,
  left: 0,
  right: 0,
  bottom: 0
};

const node = {
  getBoundingClientRect: jest.fn().mockReturnValue(nodePosition)
};

let setRef;

const Component = ({ skip, wait }: { skip?: boolean; wait?: number }) => {
  setRef = useScrollToOnLoad(skip, wait);

  return null;
};

beforeEach(() => {
  jest.clearAllMocks();
  window.scrollTo = scrollTo;
  Object.defineProperty(window, "scrollY", {
    value: SCROLL_Y,
    configurable: true,
    writable: true
  });
});

afterEach(() => {
  window.scrollTo = defaultScrollTo;
  Object.defineProperty(window, "scrollY", {
    value: defaultScrollY,
    configurable: true,
    writable: true
  });
});

describe("useScrollToOnLoad hook", () => {
  it("calls window.scrollTo", async () => {
    render(<Component />);
    setRef(node);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalled();
    });

    expect(scrollTo.mock.calls).toMatchSnapshot();
  });

  it("waits before scrolling", async () => {
    const defaultSetTimeout = window.setTimeout;
    window.setTimeout = jest.fn() as any;
    render(<Component wait={1000} />);
    setRef(node);

    expect(
      (window.setTimeout as unknown as jest.Mock).mock.calls
    ).toMatchSnapshot();

    window.setTimeout = defaultSetTimeout;
  });

  it("can skip scrolling then do it later", async () => {
    const { rerender } = render(<Component skip />);
    setRef(node);

    expect(scrollTo).not.toHaveBeenCalled();

    rerender(<Component skip={false} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalled();
    });

    expect(scrollTo.mock.calls).toMatchSnapshot();
  });
});
