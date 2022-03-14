import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import EmailDialog from "../_EmailDialog";

const windowOpen = jest.fn();
Object.defineProperty(window, "open", {
  value: windowOpen
});

describe("EmailDialog component", () => {
  it("renders correctly", () => {
    const { getByText } = renderWithThemeProvider(
      <EmailDialog open={true} setOpen={() => {}} />
    );
    expect(getByText("Recipient's email address")).toBeInTheDocument();
    expect(getByText("Your name")).toBeInTheDocument();
    expect(getByText("Cancel")).toBeInTheDocument();
    expect(getByText("Send to email")).toBeInTheDocument();
  });
  it("submit form correctly", () => {
    const { getByText } = renderWithThemeProvider(
      <EmailDialog open={true} setOpen={() => {}} />
    );
    const br = "%0D%0A";

    const submitButton = getByText("Send to email");
    const email = screen.getAllByRole("textbox")[0];
    const name = screen.getAllByRole("textbox")[1];
    const message = screen.getAllByRole("textbox")[2];

    fireEvent.change(email, { target: { value: "test@gmail.com" } });
    fireEvent.change(name, { target: { value: "name" } });
    fireEvent.change(message, { target: { value: "message" } });
    fireEvent.click(submitButton);
    expect(windowOpen).toBeCalledWith(
      `mailto:test@gmail.com?subject=BMI&body=message${br}${br}name${br}${br}${location.href}`
    );
  });
  it("validate email correctly", () => {
    const { getByText } = renderWithThemeProvider(
      <EmailDialog open={true} setOpen={() => {}} />
    );

    const emailField = screen.getAllByRole(`textbox`)[0];

    fireEvent.change(emailField, { target: { value: "testgmail.com" } });
    fireEvent.blur(emailField);
    expect(getByText("Email addresses must have an '@'")).toBeInTheDocument();
  });

  it("should close dialog on cancel click ", () => {
    const { getByText, container } = renderWithThemeProvider(
      <EmailDialog open={true} setOpen={() => {}} />
    );

    const cancelButton = getByText("Cancel");

    fireEvent.click(cancelButton);
    expect(container.childElementCount).toBe(0);
  });
  it("should close dialog on close click ", () => {
    const { getByLabelText, container } = renderWithThemeProvider(
      <EmailDialog open={true} setOpen={() => {}} />
    );

    const closeButton = getByLabelText("Close");

    fireEvent.click(closeButton);
    expect(container.childElementCount).toBe(0);
  });
});
