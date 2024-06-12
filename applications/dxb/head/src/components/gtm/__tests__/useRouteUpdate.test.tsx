import { renderHook } from "@testing-library/react-hooks";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams
} from "next/navigation";
import useRouteUpdate from "../useRouteUpdate";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn()
}));

describe("useRouteUpdate", () => {
  let onRouteUpdate: jest.Mock<any, any, any>;
  let usePathnameMock: { (): string; (): string; mockReturnValue?: any };
  let useSearchParamsMock: {
    (): ReadonlyURLSearchParams;
    (): ReadonlyURLSearchParams;
    mockReturnValue?: any;
  };

  beforeEach(() => {
    onRouteUpdate = jest.fn();
    usePathnameMock = usePathname;
    useSearchParamsMock = useSearchParams;

    // Reset the mocks before each test
    usePathnameMock.mockReturnValue("/initial-path");
    useSearchParamsMock.mockReturnValue({
      toString: () => "initial=params"
    });

    jest.clearAllMocks();
  });

  it("should call onRouteUpdate on initial render", () => {
    renderHook(() => useRouteUpdate(onRouteUpdate));

    expect(onRouteUpdate).toHaveBeenCalledWith("/initial-path");
  });

  it("should call onRouteUpdate when pathname changes", () => {
    const { rerender } = renderHook(() => useRouteUpdate(onRouteUpdate));

    // Change the pathname mock return value
    usePathnameMock.mockReturnValue("/new-path");

    rerender();

    expect(onRouteUpdate).toHaveBeenCalledWith("/new-path");
  });

  it("should call onRouteUpdate when searchParams change", () => {
    const { rerender } = renderHook(() => useRouteUpdate(onRouteUpdate));

    expect(onRouteUpdate).toHaveBeenCalledWith("/initial-path");
    expect(onRouteUpdate).toHaveBeenCalledTimes(1);
    // Change the searchParams mock return value
    useSearchParamsMock.mockReturnValue({
      toString: () => "new=params"
    });

    rerender();

    expect(onRouteUpdate).toHaveBeenCalledWith("/initial-path");
    expect(onRouteUpdate).toHaveBeenCalledTimes(2);
  });

  it("should add and remove the hashchange event listener", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useRouteUpdate(onRouteUpdate));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "hashchange",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "hashchange",
      expect.any(Function)
    );
  });

  it("should handle hashchange event", () => {
    renderHook(() => useRouteUpdate(onRouteUpdate));

    expect(onRouteUpdate).toHaveBeenCalledWith("/initial-path");
    expect(onRouteUpdate).toHaveBeenCalledTimes(1);

    const hashChangeEvent = new Event("hashchange");
    window.dispatchEvent(hashChangeEvent);

    expect(onRouteUpdate).toHaveBeenCalledWith("/initial-path");
    expect(onRouteUpdate).toHaveBeenCalledTimes(2);
  });
});
