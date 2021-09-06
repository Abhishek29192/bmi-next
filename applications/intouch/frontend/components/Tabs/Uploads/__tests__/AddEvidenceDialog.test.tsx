import React, { useRef } from "react";
import { EvidenceCategoryType } from "@bmi/intouch-api-types";
import { AddEvidenceDialog } from "../AddEvidenceDialog";
import {
  renderWithI18NProvider,
  screen,
  fireEvent
} from "../../../../lib/tests/utils";

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

  it("should upload files on confirmClick event triggered", () => {
    const onConfirmClick = jest.fn((files) => {});
    renderWithI18NProvider(
      <AddEvidenceDialog
        isOpen={true}
        onCloseClick={jest.fn()}
        onConfirmClick={onConfirmClick}
      />
    );
    const addEvidence = screen.queryByTestId("add-evidence");
    expect(addEvidence).toBeTruthy();

    const files = [
      new File([], "name1", { type: "pdf" }),
      new File([], "name2", { type: "pdf" })
    ];
    const evidenceCategoryType: EvidenceCategoryType = "MISCELLANEOUS";
    const customEvidenceCategoryId: string = null;
    fireEvent.change(addEvidence, {
      target: {
        evidenceCategoryType,
        customEvidenceCategoryId,
        files
      }
    });

    const confirmButton = screen.getByText(
      "upload_tab.add_evidence_modal.confirm_label"
    );
    confirmButton.click();
    expect(onConfirmClick).toHaveBeenCalledWith("MISCELLANEOUS", null, files);
  });
});
