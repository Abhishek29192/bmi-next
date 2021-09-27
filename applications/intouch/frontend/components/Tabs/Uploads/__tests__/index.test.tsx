import React, { useRef } from "react";
import { screen } from "@testing-library/react";
import { UploadsTab, Evidence } from "..";
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
  const files = new Map<string, Evidence[]>([
    [
      "Ventilation systems",
      [
        { name: "Ventilation systemfile 1", url: "http://image.png" },
        { name: "Ventilation systemfile 2", url: "http://image.png" }
      ]
    ],
    [
      "Roof corners",
      [
        { name: "Roof corners 1", url: "https://image.png" },
        { name: "Roof corners 2", url: "https://image.png" },
        { name: "Roof corners 3", url: "https://image.png" },
        { name: "Roof corners 4", url: "https://image.png" }
      ]
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
