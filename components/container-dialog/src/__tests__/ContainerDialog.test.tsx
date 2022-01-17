import React from "react";
import { render } from "@testing-library/react";
import ContainerDialog from "../";

describe("ContainerDialog component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ContainerDialog
        open
        allowOverflow
        onCloseClick={console.log}
        maxWidth="lg"
        color="pearl"
        areaLabelledby="area-label"
        areaDescribedby="area-describe"
        className="test-className"
      >
        <div>Some content</div>
      </ContainerDialog>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders correctly with disabledPortal", () => {
    const { container } = render(
      <ContainerDialog open disablePortal onCloseClick={console.log}>
        <div>Some content</div>
      </ContainerDialog>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders correctly when closed", () => {
    const { container } = render(
      <ContainerDialog open={false} onCloseClick={console.log}>
        <div>Some content</div>
      </ContainerDialog>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders correctly with Header child", () => {
    const { container } = render(
      <ContainerDialog onCloseClick={console.log}>
        <ContainerDialog.Header>Header</ContainerDialog.Header>
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
    backdrop!.click();
    expect(onBackdropClick).toHaveBeenCalled();
  });
});
