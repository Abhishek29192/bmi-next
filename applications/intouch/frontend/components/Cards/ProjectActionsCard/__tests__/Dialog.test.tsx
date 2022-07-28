import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import Dialog from "../Dialog";
import { renderWithUserProvider } from "../../../../lib/tests/utils";
import AccountProvider from "../../../../lib/tests/fixtures/account";
import { generateAccount } from "../../../../lib/tests/factories/account";

describe("Dialog", () => {
  const onCancelSpy = jest.fn();
  const onConfirmSpy = jest.fn();
  const onCheckBoxSpy = jest.fn();
  const generateInitialProp = (dialogState = {}) => ({
    dialogState: {
      title: "title",
      description: "description",
      open: true,
      onConfirm: onConfirmSpy,
      ...dialogState
    },
    onCancel: onCancelSpy,
    setInspectionState: onCheckBoxSpy
  });

  it("render correctly", async () => {
    render(<Dialog {...generateInitialProp({ open: true })} />);

    await waitFor(() => {
      expect(screen.getByText("title")).toBeTruthy();
      expect(screen.getByText("description")).toBeTruthy();
      expect(screen.getByText("projectActions.cta.confirm")).toBeTruthy();
      expect(screen.getByText("projectActions.cta.cancel")).toBeTruthy();
    });
  });

  it("render empty div when open is false ", async () => {
    render(<Dialog {...generateInitialProp({ open: false })} />);

    await waitFor(() => {
      expect(screen.queryByText("title")).toBeFalsy();
      expect(screen.queryByText("description")).toBeFalsy();
    });
  });

  it("run onConfirm when click on confirm button ", async () => {
    render(<Dialog {...generateInitialProp({ open: true })} />);

    const confirmButton = screen.getByText("projectActions.cta.confirm");
    fireEvent.click(confirmButton);

    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
  });

  it("run onCancel when click on cancel button", async () => {
    render(<Dialog {...generateInitialProp({ open: true })} />);

    const cancelButton = screen.getByText("projectActions.cta.cancel");
    fireEvent.click(cancelButton);

    expect(onCancelSpy).toHaveBeenCalledTimes(1);
  });

  it("run setInspectionState when click on inspection checkbox", async () => {
    renderWithUserProvider(
      <AccountProvider account={generateAccount({ role: "SUPER_ADMIN" })}>
        <Dialog
          {...generateInitialProp({ open: true, inspectionFlag: true })}
        />
      </AccountProvider>
    );
    const inspection = screen.getByText(
      "addProject.dialog.form.fields.inspection"
    );
    fireEvent.click(inspection);
    expect(onCheckBoxSpy).toHaveBeenCalledTimes(1);
  });
});
