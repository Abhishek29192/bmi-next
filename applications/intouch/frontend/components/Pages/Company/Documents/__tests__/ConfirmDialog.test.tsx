import React from "react";
import { renderWithI18NProvider, screen } from "../../../../../lib/tests/utils";

import ConfirmDialog from "../ConfirmDialog";

describe("ConfirmDialog Components", () => {
  it("show dialog", () => {
    renderWithI18NProvider(
      <ConfirmDialog
        state={{
          isOpen: true,
          id: 1
        }}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByTestId("company-document-confirm-dialog")).toBeTruthy();
  });
  it("hide dialog", () => {
    renderWithI18NProvider(
      <ConfirmDialog
        state={{
          isOpen: false,
          id: null
        }}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.queryByTestId("company-document-confirm-dialog")).toBeFalsy();
  });
});
