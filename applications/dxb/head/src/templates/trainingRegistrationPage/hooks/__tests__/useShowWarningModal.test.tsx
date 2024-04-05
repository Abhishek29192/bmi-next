import {
  LocationProvider,
  createHistory,
  createMemorySource,
  globalHistory
} from "@reach/router";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormStatus } from "../../types";
import {
  UseShowWarningModalData,
  useShowWarningModal
} from "../useShowWarningModal";

const render = ({
  data,
  route = "jest-test-page"
}: {
  data: UseShowWarningModalData;
  route?: string;
}) => {
  const history = createHistory(createMemorySource(route));
  const Wrapper = ({ children }: { children: JSX.Element }) => (
    <LocationProvider history={history}>{children}</LocationProvider>
  );

  const utils = renderHook(() => useShowWarningModal(data), {
    wrapper: Wrapper
  });

  return { ...utils, history };
};

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe("useShowWarningModal hook", () => {
  it("should not block 'beforeunload' event if formState==='Initialized'", () => {
    render({
      data: { formStatus: FormStatus.Initialized, isSubmitting: false }
    });

    const beforeUnloadEvent = new Event("beforeunload");
    beforeUnloadEvent.preventDefault = jest.fn();
    window.dispatchEvent(beforeUnloadEvent);
    expect(beforeUnloadEvent.preventDefault).not.toHaveBeenCalled();
  });

  it("should not block 'beforeunload' event if formState==='Edited'", () => {
    render({
      data: { formStatus: FormStatus.Edited, isSubmitting: false }
    });

    const beforeUnloadEvent = new Event("beforeunload");
    beforeUnloadEvent.preventDefault = jest.fn();
    window.dispatchEvent(beforeUnloadEvent);
    expect(beforeUnloadEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("should not block 'beforeunload' when isSubmitting === true", () => {
    const initialRoute = "/initial-route";
    render({
      data: { formStatus: FormStatus.Edited, isSubmitting: true },
      route: initialRoute
    });

    const beforeUnloadEvent = new Event("beforeunload");
    beforeUnloadEvent.preventDefault = jest.fn();

    window.dispatchEvent(beforeUnloadEvent);
    expect(beforeUnloadEvent.preventDefault).not.toHaveBeenCalled();
  });

  it("removes 'beforeunload' event listener on unmount", () => {
    const originalRemoveEventListener = window.removeEventListener;
    window.removeEventListener = jest.fn();

    const { unmount } = render({
      data: { formStatus: FormStatus.Edited, isSubmitting: false }
    });

    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    window.removeEventListener = originalRemoveEventListener;
  });

  it("should not block navigation if formState==='Initialized'", () => {
    const { history } = render({
      data: { formStatus: FormStatus.Initialized, isSubmitting: false }
    });

    const newRoute = "/updated-route";
    history.navigate(newRoute);
    expect(history.location.pathname).toBe(newRoute);
  });

  it("should block navigation if formState==='Edited'", () => {
    const initialRoute = "/initial-route";
    const { history, result } = render({
      data: { formStatus: FormStatus.Edited, isSubmitting: false },
      route: initialRoute
    });

    const newRoute = "/updated-route";
    globalHistory.navigate(newRoute);
    expect(history.location.pathname).toBe(initialRoute);
    expect(result.current.blockedLocation?.pathname).toBe(newRoute);
  });

  it("should not block the navigation when isSubmitting === true", () => {
    const initialRoute = "/initial-route";
    const { history } = render({
      data: { formStatus: FormStatus.Edited, isSubmitting: true },
      route: initialRoute
    });

    const newRoute = "/updated-route";
    history.navigate(newRoute);
    expect(history.location.pathname).toBe(newRoute);
  });

  it("unblocks navigation on unmount", () => {
    const initialHistoryListener = globalHistory.listen;
    const unblockFunction = jest.fn();
    globalHistory.listen = jest.fn().mockReturnValue(unblockFunction);

    const { unmount } = render({
      data: { formStatus: FormStatus.Edited, isSubmitting: false }
    });

    unmount();
    expect(unblockFunction).toHaveBeenCalled();

    globalHistory.listen = initialHistoryListener;
  });

  it("removes blocked location after closing the dialog", () => {
    const initialRoute = "/initial-route";
    const { result } = render({
      data: { formStatus: FormStatus.Edited, isSubmitting: false },
      route: initialRoute
    });

    const newRoute = "/updated-route";
    globalHistory.navigate(newRoute);
    expect(result.current.blockedLocation?.pathname).toBe(newRoute);

    result.current.closeWarningDialog();
    expect(result.current.blockedLocation).toBeUndefined();
  });
});
