import { render, fireEvent } from "@testing-library/react";
import React from "react";
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
    const { container } = render(<SignupBlock data={data} />);
    expect(container).toMatchSnapshot();
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
});
