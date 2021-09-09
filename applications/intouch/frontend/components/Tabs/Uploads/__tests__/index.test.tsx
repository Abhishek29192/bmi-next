import React, { useRef } from "react";
import { screen } from "@testing-library/react";
import { UploadsTab } from "..";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

jest.mock("../../../../graphql/generated/hooks", () => ({
  useAddEvidencesMutation: () => [jest.fn()],
  useContentfulEvidenceCategoriesLazyQuery: () => [jest.fn()]
}));

describe("Uploads Components", () => {
  const files = new Map<string, string[]>([
    [
      "Ventilation systems",
      ["Ventilation systemfile 1", "Ventilation systemfile 2"]
    ],
    [
      "Roof corners",
      ["Roof corners 1", "Roof corners 2", "Roof corners 3", "Roof corners 4"]
    ]
  ]);

  describe("render correct number of category", () => {
    it("none", () => {
      renderWithI18NProvider(<UploadsTab projectId={1} uploads={null} />);
      expect(screen.queryByTestId("uploads-category")).toBeNull();
    });
    it("two categories", () => {
      renderWithI18NProvider(<UploadsTab projectId={1} uploads={files} />);
      expect(screen.getAllByTestId("uploads-category").length).toEqual(2);
    });
  });
  describe("render correct number of upload", () => {
    it("none", () => {
      renderWithI18NProvider(<UploadsTab projectId={1} uploads={null} />);
      expect(screen.queryByTestId("uploads-item")).toBeNull();
    });
    it("six upload items", () => {
      renderWithI18NProvider(<UploadsTab projectId={1} uploads={files} />);
      expect(screen.getAllByTestId("uploads-item").length).toEqual(6);
    });
  });
});
