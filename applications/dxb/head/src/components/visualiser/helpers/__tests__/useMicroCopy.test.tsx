import { getMicroCopy as getMicroCopyOld } from "@bmi/components";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { useMicroCopy } from "../useMicroCopy";

function mock<T extends (...args: any[]) => any>(func: T) {
  return func as unknown as jest.Mock<ReturnType<T>>;
}
const mockNewMicroCopy = jest.fn();
const mockOldMicroCopy = mock(getMicroCopyOld);
jest.mock("../../../Site", () => ({
  useSiteContext: jest.fn().mockImplementation(() => ({
    getMicroCopy: mockNewMicroCopy
  }))
}));

jest.mock("@bmi/components", () => ({
  ...(jest.requireActual("@bmi/components") as any),
  getMicroCopy: jest.fn()
}));

function setEnvValue(value: string) {
  const original = process.env.GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR;
  process.env.GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR = value;

  return {
    reset: () => (process.env.GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR = original)
  };
}
describe("useMicroCopy", () => {
  describe("when new visualiser enabled", () => {
    let env;
    beforeAll(() => {
      env = setEnvValue("true");
    });

    afterAll(() => {
      env.reset();
    });

    it("should return getMicroCopy from siteContext", () => {
      const { result } = renderHook(useMicroCopy);
      expect(result.current.getMicroCopy).toBe(mockNewMicroCopy);
    });
  });

  describe("when new visualiser disabled", () => {
    let env;
    const copy = { label: "test" };
    beforeAll(() => {
      jest.spyOn(React, "useContext").mockImplementation(() => copy);
      env = setEnvValue("false");
    });

    afterAll(() => {
      jest.clearAllMocks();
      env.reset();
    });

    it("should return old getMicroCopyFunction with binded copy object", () => {
      const { result } = renderHook(useMicroCopy);
      result.current.getMicroCopy("path");
      expect(mockOldMicroCopy).toBeCalledWith(
        ...[copy, "path", undefined, undefined]
      );
    });
  });
});
