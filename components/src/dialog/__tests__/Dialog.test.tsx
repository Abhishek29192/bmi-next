import React from "react";
import Dialog from "../Dialog";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Dialog component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Dialog open onCloseClick={console.log}>
        <Dialog.Title hasUnderline>Heading</Dialog.Title>
        <Dialog.Content>Some content</Dialog.Content>
        <Dialog.Actions confirmLabel={"Close"} />
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("renders without confirm label", () => {
    const { container } = renderWithThemeProvider(
      <Dialog open onCloseClick={console.log}>
        <Dialog.Title hasUnderline>Heading</Dialog.Title>
        <Dialog.Content>Some content</Dialog.Content>
        <Dialog.Actions />
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("renders without close icon", () => {
    const { container } = renderWithThemeProvider(
      <Dialog>
        <Dialog.Title hasUnderline>Heading</Dialog.Title>
        <Dialog.Content>Some content</Dialog.Content>
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("renders closed", () => {
    const { container } = renderWithThemeProvider(
      <Dialog onCloseClick={console.log}>
        <Dialog.Title hasUnderline>Heading</Dialog.Title>
        <Dialog.Content>Some content</Dialog.Content>
        <Dialog.Actions confirmLabel={"Close"} />
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("renders without a heading", () => {
    const { container } = renderWithThemeProvider(
      <Dialog open onCloseClick={console.log}>
        <Dialog.Content>Some content</Dialog.Content>
        <Dialog.Actions confirmLabel={"Close"} />
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("calls all events", () => {
    const closeLabel = "Close";
    const confirmLabel = "Confirm";
    const cancelLabel = "Cancel";
    const backdropClassName = "test-backdrop";

    const onCloseClick = jest.fn();
    const onBackdropClick = jest.fn();
    const onConfirmClick = jest.fn();
    const onCancelClick = jest.fn();

    const { container, getByLabelText, getByText } = renderWithThemeProvider(
      <Dialog
        open
        onCloseClick={onCloseClick}
        onBackdropClick={onBackdropClick}
        backdropProps={{
          className: backdropClassName
        }}
      >
        <Dialog.Actions
          confirmLabel={confirmLabel}
          onConfirmClick={onConfirmClick}
          cancelLabel={cancelLabel}
          onCancelClick={onCancelClick}
        />
      </Dialog>
    );

    const closeButton = getByLabelText(closeLabel);
    closeButton.click();
    expect(onCloseClick).toHaveBeenCalled();

    const confirmButton = getByText(confirmLabel);
    confirmButton.click();
    expect(onConfirmClick).toHaveBeenCalled();

    const cancelButton = getByText(cancelLabel);
    cancelButton.click();
    expect(onCancelClick).toHaveBeenCalled();

    const backdrop = container.parentElement!.querySelector<HTMLDivElement>(
      `.${backdropClassName}`
    );
    backdrop!.click();
    expect(onBackdropClick).toHaveBeenCalled();
  });
});
