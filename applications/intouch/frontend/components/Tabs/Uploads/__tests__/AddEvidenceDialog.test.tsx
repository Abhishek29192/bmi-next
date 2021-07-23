import React, { useRef } from "react";
import { AddEvidenceDialog } from "../AddEvidenceDialog";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));
describe("AddEvidenceDialog Components", () => {
  it("should not show upload", () => {
    renderWithI18NProvider(
      <AddEvidenceDialog
        isOpen={false}
        onCloseClick={jest.fn()}
        onConfirmClick={jest.fn()}
      />
    );
    expect(screen.queryByTestId("add-evidence")).toBeNull();
  });
});
