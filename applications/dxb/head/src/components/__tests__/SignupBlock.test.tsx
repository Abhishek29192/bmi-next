import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { microCopy } from "../../constants/microCopies";
import SignupBlock, { Data } from "../SignupBlock";

const data: Data = {
  __typename: "ContentfulSignupBlock",
  title: "Newsletter signup block section",
  description: {
    description: "if it doesnt u it makes u stronger"
  },
  signupLabel: "sign up",
  signupDialogContent: {
    __typename: "ContentfulFormSection",
    title: "Test form",
    showTitle: null,
    description: null,
    recipients: "recipient@mail.com",
    inputs: [
      {
        label: "Email",
        name: "email",
        required: true,
        type: "email",
        width: "half"
      }
    ],
    submitText: "signmeup",
    successRedirect: null,
    source: null
  }
};
describe("SignupBlock component", () => {
  it("renders correctly", () => {
    const { container, queryAllByRole } = render(<SignupBlock data={data} />);
    expect(container.firstChild).toHaveClass("SignupBlock");
    expect(queryAllByRole("button", { name: "sign up" }).length).toBe(1);
  });
  it("renders correctly when no data is given", () => {
    const { container } = render(<SignupBlock />);
    expect(container.children.length).toBe(0);
  });
  it("renders dialog correctly when signup button", () => {
    const { getByRole, getByText } = render(<SignupBlock data={data} />);
    const signupButton = getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    expect(getByText("signmeup")).toBeInTheDocument();
  });
  it("closes dialog correctly when clicked on close button", () => {
    const { getByRole, queryByText } = render(<SignupBlock data={data} />);
    const signupButton = getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    const closeButton = getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    expect(queryByText("signmeup")).toBeNull();
  });
  it("renders correctly when clicked on cancel button", () => {
    const { getByRole, queryByRole } = render(<SignupBlock data={data} />);
    const signupButton = getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    const cancelButton = getByRole("button", {
      name: `MC: ${microCopy.DIALOG_CANCEL}`
    });
    fireEvent.click(cancelButton);
    expect(
      queryByRole("button", { name: `MC: ${microCopy.DIALOG_CANCEL}` })
    ).toBeFalsy();
  });
  it("renders correctly when clicked on close button once the form is submitted", () => {
    const onFormSubmittedEvent = new MessageEvent("message", {
      data: {
        eventName: "onFormSubmitted"
      }
    });
    const { container, getByRole, queryByRole } = render(
      <SignupBlock data={data} />
    );
    const signupButton = getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);

    window.dispatchEvent(onFormSubmittedEvent);
    waitFor(() => {
      expect(
        container.querySelectorAll(".Dialog-module__actions button").length
      ).toBe(1);
      const cancelButton = getByRole("button", {
        name: `MC: ${microCopy.DIALOG_CLOSE}`
      });
      fireEvent.click(cancelButton);
      expect(
        queryByRole("button", { name: `MC: ${microCopy.DIALOG_CLOSE}` })
      ).toBeFalsy();
    });
  });
});
