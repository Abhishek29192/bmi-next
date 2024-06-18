import { CookieHookOptions } from "@lilib/hooks";
import { renderHook } from "@testing-library/react-hooks";
import { useHasOptanonBoxClosed } from "../../utils/useHasOptanonBoxClosed";

const useCookie = jest.fn().mockImplementation(() => ["", () => ""]);
jest.mock("@lilib/hooks", () => ({
  useCookie: (
    name: string,
    options: CookieHookOptions & {
      defaultValue: string;
    }
  ) => useCookie(name, options)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("when isClient = true", () => {
  describe("And configuredCookieClasses is an empty list", () => {
    it("should return hasAcceptedOptanonCookie = true", async () => {
      const configuredClasses = [] as string[];
      const { result } = renderHook(() =>
        useHasOptanonBoxClosed(configuredClasses)
      );
      const { hasAcceptedOptanonCookie } = result.current;
      expect(hasAcceptedOptanonCookie).toEqual(true);
    });
  });

  describe("And configuredCookieClasses is NOT empty list", () => {
    describe("And OptanonAlertBoxClosed cookie returns NON empty value", () => {
      it("should return hasAcceptedOptanonCookie = true", async () => {
        useCookie.mockImplementationOnce(() => [
          "2023-04-03T16:44:45.955Z",
          () => ""
        ]);

        const configuredClasses = ["CC001"];
        const { result } = renderHook(() =>
          useHasOptanonBoxClosed(configuredClasses)
        );

        const { hasAcceptedOptanonCookie } = result.current;
        expect(hasAcceptedOptanonCookie).toEqual(true);
      });
    });

    describe("And OptanonAlertBoxClosed cookie returns empty value", () => {
      it("should return hasAcceptedOptanonCookie = false", async () => {
        useCookie.mockImplementation(() => ["", () => ""]);

        const configuredClasses = ["CC001"];
        const { result } = renderHook(() =>
          useHasOptanonBoxClosed(configuredClasses)
        );

        const { hasAcceptedOptanonCookie } = result.current;
        expect(hasAcceptedOptanonCookie).toEqual(false);
      });
    });
  });
});
