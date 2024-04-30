import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import RegistrationCompletedDialog, {
  RegistrationCompetedDialogProps
} from "../RegistrationCompletedDialog";

const registrationCompetedDialogProps: RegistrationCompetedDialogProps = {
  closeButtonLabel: "Close",
  title: "Thank you for registration",
  description:
    "We have received your registration and we’ll get in touch with you shortly.",
  open: true
};

describe("Registration completed dialog", () => {
  it("should not open dialog if 'open' prop is set to false", () => {
    const { container } = render(
      <ThemeProvider>
        <RegistrationCompletedDialog
          {...registrationCompetedDialogProps}
          open={false}
        />
      </ThemeProvider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should open the dialog if 'open' prop is set to true", () => {
    render(
      <ThemeProvider>
        <RegistrationCompletedDialog
          {...registrationCompetedDialogProps}
          open={true}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText(registrationCompetedDialogProps.title)
    ).toBeInTheDocument();
    expect(
      screen.getByText(registrationCompetedDialogProps.description)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dialog-action-button-confirm")
    ).toBeInTheDocument();
  });

  it("closes the model on 'Close' button click", () => {
    const { container } = render(
      <ThemeProvider>
        <RegistrationCompletedDialog
          {...registrationCompetedDialogProps}
          open={true}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("dialog-action-button-confirm"));
    expect(container).toBeEmptyDOMElement();
  });

  it("closes the model on 'X' button click", () => {
    const { container } = render(
      <ThemeProvider>
        <RegistrationCompletedDialog
          {...registrationCompetedDialogProps}
          open={true}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("dialog-header-icon-button"));
    expect(container).toBeEmptyDOMElement();
  });
});
