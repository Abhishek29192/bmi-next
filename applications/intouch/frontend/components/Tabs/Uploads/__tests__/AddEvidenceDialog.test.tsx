import React from "react";
import { EvidenceCategoryType } from "@bmi/intouch-api-types";
import { AddEvidenceDialog } from "../AddEvidenceDialog";
import {
  renderWithI18NProvider,
  screen,
  fireEvent
} from "../../../../lib/tests/utils";

describe("AddEvidenceDialog Components", () => {
  it("should not show upload", () => {
    renderWithI18NProvider(
      <AddEvidenceDialog
        isOpen={false}
        onCloseClick={jest.fn()}
        onConfirmClick={jest.fn()}
        loading={false}
      />
    );
    expect(screen.queryByTestId("add-evidence")).toBeNull();
  });

  it("should close modal window", () => {
    const onCloseClick = jest.fn();
    renderWithI18NProvider(
      <AddEvidenceDialog
        isOpen={true}
        onCloseClick={onCloseClick}
        onConfirmClick={jest.fn()}
        loading={false}
      />
    );

    const closeButton = screen.getByText(
      "upload_tab.add_evidence_modal.cancel_label"
    );
    closeButton.click();
    expect(onCloseClick).toBeCalledTimes(1);
  });

  it("should upload files on confirmClick event triggered", () => {
    const onConfirmClick = jest.fn(() => {});
    renderWithI18NProvider(
      <AddEvidenceDialog
        isOpen={true}
        onCloseClick={jest.fn()}
        onConfirmClick={onConfirmClick}
        loading={false}
      />
    );
    const addEvidence = screen.queryByTestId("add-evidence");
    expect(addEvidence).toBeTruthy();

    const files = [
      new File([], "name1", { type: "pdf" }),
      new File([], "name2", { type: "pdf" })
    ];
    const evidenceCategoryType: EvidenceCategoryType = "MISCELLANEOUS";
    const customEvidenceCategoryKey: string = null;
    fireEvent.change(addEvidence, {
      target: {
        evidenceCategoryType,
        customEvidenceCategoryKey,
        files
      }
    });

    const confirmButton = screen.getByText(
      "upload_tab.add_evidence_modal.confirm_label"
    );
    confirmButton.click();
    expect(onConfirmClick).toHaveBeenCalledWith("MISCELLANEOUS", null, files);
  });

  it("cover different category types", () => {
    const onConfirmClick = jest.fn(() => {});
    renderWithI18NProvider(
      <AddEvidenceDialog
        isOpen={true}
        onCloseClick={jest.fn()}
        onConfirmClick={onConfirmClick}
        loading={false}
        defaultEvidenceCategory="FLAT_BASE"
      />
    );
    const addEvidence = screen.queryByTestId("add-evidence");
    expect(addEvidence).toBeTruthy();

    const files = [
      new File([""], "name1", { type: "pdf" }),
      new File([""], "name2", { type: "pdf" })
    ];

    const evidenceCategoryType: EvidenceCategoryType = "MISCELLANEOUS";
    const customEvidenceCategoryKey: string = null;
    fireEvent.change(addEvidence, {
      target: {
        evidenceCategoryType,
        customEvidenceCategoryKey,
        files
      }
    });

    const confirmButton = screen.getByText(
      "upload_tab.add_evidence_modal.confirm_label"
    );
    confirmButton.click();
    expect(onConfirmClick).toHaveBeenCalledWith("CUSTOM", "FLAT_BASE", files);
  });

  it("validate big files size", () => {
    const onConfirmClick = jest.fn(() => {});
    renderWithI18NProvider(
      <AddEvidenceDialog
        isOpen={true}
        onCloseClick={jest.fn()}
        onConfirmClick={onConfirmClick}
        loading={false}
      />
    );
    const addEvidence = screen.queryByTestId("add-evidence");
    expect(addEvidence).toBeTruthy();
    const MAX_FILE_SIZE = 40;
    const files = [
      new File([""], "name1", { type: "pdf" }),
      new File([""], "name2", { type: "pdf" })
    ];
    Object.defineProperty(files[0], "size", {
      value: MAX_FILE_SIZE * 1024 * 1024 * 2
    });
    Object.defineProperty(files[1], "size", {
      value: MAX_FILE_SIZE * 1024 * 1024 * 2
    });
    const evidenceCategoryType: EvidenceCategoryType = "MISCELLANEOUS";
    const customEvidenceCategoryKey: string = null;
    fireEvent.change(addEvidence, {
      target: {
        evidenceCategoryType,
        customEvidenceCategoryKey,
        files
      }
    });
    const confirmButton = screen.getByText(
      "upload_tab.add_evidence_modal.confirm_label"
    );
    confirmButton.click();
    expect(onConfirmClick).toBeCalledTimes(0);
  });

  it("should behave properly on category change", () => {
    const onConfirmClick = jest.fn(() => {});
    renderWithI18NProvider(
      <AddEvidenceDialog
        isOpen={true}
        onCloseClick={jest.fn()}
        onConfirmClick={onConfirmClick}
        loading={false}
        evidenceCategories={[{ name: "Waterproofing", referenceCode: "TEST1" }]}
      />
    );

    const selectList = screen
      .getByTestId("evidence-categories-list")
      .querySelector("input");
    fireEvent.change(selectList, {
      target: { value: "TEST1" }
    });
  });
});
