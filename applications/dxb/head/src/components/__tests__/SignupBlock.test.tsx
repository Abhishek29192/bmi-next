import { fireEvent, render, waitFor } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import React, { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { microCopy } from "../../constants/microCopies";
import SignupBlock, { Data } from "../SignupBlock";
import { SourceType } from "../types/FormSectionTypes";

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
    source: SourceType.HubSpot,
    hubSpotFormGuid: "abc123"
  }
};
beforeAll(() => {
  mockConsole();
});

jest.mock("../FormSection", () => {
  const formSection = jest.requireActual("../FormSection");

  const HubSpotFormMock = (props: {
    onSuccess: () => void;
    onFormReady?: (_, form: HTMLElement) => void;
  }) => {
    const ref = useRef<HTMLFormElement>(null);

    useEffect(() => {
      // inserts content into iframe document
      ref.current.innerHTML = renderToString(<HSForm />);
      props.onFormReady?.({}, ref.current);
      // tracks submit event of iframe form
      ref.current.onsubmit = props.onSuccess;
    }, []);

    const HSForm = () => (
      <form>
        <input type="email" name="email" />
        <input type="checkbox" id="LEGAL_CONSENT.subscription" />
        <input type="checkbox" id="LEGAL_CONSENT.processing" />
      </form>
    );

    return <form ref={ref} />;
  };

  return {
    __esModule: true,
    ...formSection,
    default: HubSpotFormMock
  };
});
beforeEach(() => {
  jest.clearAllMocks();
});

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

  it("renders dialog correctly when click on signup button", async () => {
    const { getByRole, queryByRole } = render(<SignupBlock data={data} />);
    const signupButton = getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    await waitFor(() => {
      expect(queryByRole("button", { name: /sign up/ })).toBeTruthy();
      expect(queryByRole("button", { name: "MC: dialog.cancel" })).toBeTruthy();
    });
  });

  it("closes dialog correctly when clicked on close button", () => {
    const { getByRole, container } = render(<SignupBlock data={data} />);
    const signupButton = getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    const closeButton = getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    expect(container.querySelector(".Dialog")).toBeFalsy();
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
  //TODO fix test - once the form is submitted cancel button becomes close and submit button disappears from dialog
  // it("renders correctly when clicked on close button once the form is submitted", async () => {
  //   jest.clearAllMocks();
  //   const onFormSubmittedEvent = new MessageEvent("message", {
  //     data: {
  //       eventName: "onFormSubmitted"
  //     }
  //   });
  //   const { container, getByRole, queryByRole } = render(
  //     <SignupBlock data={data} />
  //   );
  //   const signupButton = getByRole("button", { name: "sign up" });
  //   fireEvent.click(signupButton);

  //   window.dispatchEvent(onFormSubmittedEvent);

  //   await waitFor(() => {
  //     expect(
  //       container.querySelectorAll(".Dialog-module__actions button").length
  //     ).toBe(1);
  //     const cancelButton = getByRole("button", {
  //       name: `MC: ${microCopy.DIALOG_CLOSE}`
  //     });
  //     fireEvent.click(cancelButton);
  //     expect(
  //       queryByRole("button", { name: `MC: ${microCopy.DIALOG_CLOSE}` })
  //     ).toBeFalsy();
  //   });
  // });
  it("disables sign up button on load", () => {
    const { getByRole } = render(<SignupBlock data={data} />);

    const signupButton = getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    const dialogSignupBtn = getByRole("button", { name: /sign up/ });
    expect(dialogSignupBtn).toBeDisabled();
  });
  //TODO tests
  //1.enables sign up button when all three condtions i.e. checked both legal check boxes and is valid email
});