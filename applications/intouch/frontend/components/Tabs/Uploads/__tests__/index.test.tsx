import React from "react";
import { render, screen } from "@testing-library/react";
import { UploadsTab } from "..";

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
      render(<UploadsTab uploads={null} />);
      expect(screen.queryByTestId("uploads-category")).toBeNull();
    });
    it("two categories", () => {
      render(<UploadsTab uploads={files} />);
      expect(screen.getAllByTestId("uploads-category").length).toEqual(2);
    });
  });
  describe("render correct number of upload", () => {
    it("none", () => {
      render(<UploadsTab uploads={null} />);
      expect(screen.queryByTestId("uploads-item")).toBeNull();
    });
    it("six upload items", () => {
      render(<UploadsTab uploads={files} />);
      expect(screen.getAllByTestId("uploads-item").length).toEqual(6);
    });
  });
});
