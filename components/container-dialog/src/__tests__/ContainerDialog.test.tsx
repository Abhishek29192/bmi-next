import React from "react";
import { render } from "@testing-library/react";
import ContainerDialog from "../";

describe("ContainerDialog component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ContainerDialog open onCloseClick={console.log}>
        <div>Some content</div>
      </ContainerDialog>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("calls all events", () => {
    const closeLabel = "Close";
    const backdropClassName = "test-backdrop";

    const onCloseClick = jest.fn();
    const onBackdropClick = jest.fn();

    const { container, getByLabelText } = render(
      <ContainerDialog
        open
        onCloseClick={onCloseClick}
        onBackdropClick={onBackdropClick}
        backdropProps={{
          className: backdropClassName
        }}
      >
        <div>Some content</div>
      </ContainerDialog>
    );

    const closeButton = getByLabelText(closeLabel);
    closeButton.click();
    expect(onCloseClick).toHaveBeenCalled();

    const backdrop = container.parentElement!.querySelector(
      `.${backdropClassName}`
    );
    // @ts-ignore
    backdrop.click();
    expect(onBackdropClick).toHaveBeenCalled();
  });
});
