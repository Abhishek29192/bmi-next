import React from "react";
import ContainerDialog from "../ContainerDialog";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("ContainerDialog component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
      <ContainerDialog open disablePortal onCloseClick={console.log}>
        <div>Some content</div>
      </ContainerDialog>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders correctly when closed", () => {
    const { container } = renderWithThemeProvider(
      <ContainerDialog open={false} onCloseClick={console.log}>
        <div>Some content</div>
      </ContainerDialog>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders correctly with Header child", () => {
    const { container } = renderWithThemeProvider(
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

    const { container, getByLabelText } = renderWithThemeProvider(
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

    const backdrop = container.parentElement!.querySelector<HTMLDivElement>(
      `.${backdropClassName}`
    );
    backdrop!.click();
    expect(onBackdropClick).toHaveBeenCalled();
  });
});
