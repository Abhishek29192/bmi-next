import React, { useState } from "react";
import { render } from "@testing-library/react";
import Dialog from "../";

describe("Dialog component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Dialog open onCloseClick={console.log}>
        <Dialog.Title hasUnderline>Heading</Dialog.Title>
        <Dialog.Content>Some content</Dialog.Content>
        <Dialog.Actions confirmLabel={"Close"} />
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("renders without confirm label", () => {
    const { container } = render(
      <Dialog open onCloseClick={console.log}>
        <Dialog.Title hasUnderline>Heading</Dialog.Title>
        <Dialog.Content>Some content</Dialog.Content>
        <Dialog.Actions />
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("renders without close icon", () => {
    const { container } = render(
      <Dialog>
        <Dialog.Title hasUnderline>Heading</Dialog.Title>
        <Dialog.Content>Some content</Dialog.Content>
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("renders closed", () => {
    const { container } = render(
      <Dialog onCloseClick={console.log}>
        <Dialog.Title hasUnderline>Heading</Dialog.Title>
        <Dialog.Content>Some content</Dialog.Content>
        <Dialog.Actions confirmLabel={"Close"} />
      </Dialog>
    );
    expect(container.parentElement!).toMatchSnapshot();
  });

  it("renders without a heading", () => {
    const { container } = render(
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

    const { container, getByLabelText, getByText } = render(
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

    const backdrop = container.parentElement!.querySelector(
      `.${backdropClassName}`
    );
    // @ts-ignore
    backdrop.click();
    expect(onBackdropClick).toHaveBeenCalled();
  });

  it("aria-hidden should be false if disabled portal", () => {
    const TestComponent = () => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button onClick={setOpen.bind(null, true)} type="button">
            Open Dialog
          </button>
          <Dialog open={open} disablePortal>
            <Dialog.Title hasUnderline>Heading</Dialog.Title>
            <Dialog.Content>Some content</Dialog.Content>
            <Dialog.Actions confirmLabel={"Close"} />
          </Dialog>
        </>
      );
    };
    const { getByText } = render(<TestComponent />);

    const openDialog = getByText("Open Dialog");
    openDialog.click();
    const isAreaHiddenFalse = Array.from(document.body.children)
      .filter(
        (child) =>
          !["SCRIPT", "IFRAME", "NOSCRIPT"].some(
            (tagName) => child.tagName === tagName
          )
      )
      .every((child) => child.getAttribute("aria-hidden") === "false");
    expect(isAreaHiddenFalse).toBe(true);
  });
});
