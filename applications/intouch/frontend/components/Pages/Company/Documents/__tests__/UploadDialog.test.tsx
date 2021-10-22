import React from "react";
import {
  fireEvent,
  renderWithI18NProvider,
  screen
} from "../../../../../lib/tests/utils";
import { UploadDialog } from "../UploadDialog";

describe("UploadDialog Components", () => {
  const closeMock = jest.fn();
  it("should not show upload dialog", () => {
    renderWithI18NProvider(
      <UploadDialog
        isOpen={false}
        onConfirmClick={() => jest.fn()}
        onCloseClick={closeMock}
      />
    );
    expect(screen.queryByTestId("add-company-document")).toBeNull();
  });

  it("should upload files on confirmClick event triggered", () => {
    const confirmMock = jest.fn((files) => {});
    renderWithI18NProvider(
      <UploadDialog
        isOpen={true}
        onConfirmClick={confirmMock}
        onCloseClick={closeMock}
      />
    );
    const uploadDocument = screen.getByTestId("add-company-document");
    expect(uploadDocument).toBeTruthy();

    const files = [
      new File([], "name1", { type: "pdf" }),
      new File([], "name2", { type: "pdf" })
    ];
    fireEvent.change(uploadDocument, {
      target: {
        files
      }
    });

    const confirmButton = screen.getByText(
      "document.uploadDialog.confirmLabel"
    );
    confirmButton.click();
    expect(confirmMock).toHaveBeenCalledWith(files);
  });
});
