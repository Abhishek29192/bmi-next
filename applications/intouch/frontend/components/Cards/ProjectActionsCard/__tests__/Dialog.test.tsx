import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import Dialog from "../Dialog";

describe("Dialog", () => {
  const onCancelSpy = jest.fn();
  const onConfirmSpy = jest.fn();
  const generateInitialProp = (dialogState = {}) => ({
    dialogState: {
      title: "title",
      description: "description",
      open: true,
      onConfirm: onConfirmSpy,
      ...dialogState
    },
    onCancel: onCancelSpy
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
});
