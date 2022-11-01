import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
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

beforeEach(() => {
  jest.clearAllMocks();
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

describe("SignupBlock component", () => {
  it("renders correctly", () => {
    const { container, queryAllByRole } = render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveClass("SignupBlock");
    expect(queryAllByRole("button", { name: "sign up" }).length).toBe(1);
  });

  it("renders correctly when no data is given", () => {
    const { container } = render(
      <ThemeProvider>
        <SignupBlock />
      </ThemeProvider>
    );
    expect(container.children.length).toBe(0);
  });

  it("renders dialog correctly when clicked on sign up button", () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );
    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);

    expect(document.querySelectorAll("[class*='Dialog-root']").length).toBe(1);
  });
  it("closes dialog correctly when clicked on close button", () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );
    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    expect(document.querySelector("[class*='Dialog-root']")).toBeFalsy();
  });

  it("renders correctly when clicked on cancel button", () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );
    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    const cancelButton = screen.getByRole("button", {
      name: `MC: ${microCopy.DIALOG_CANCEL}`
    });
    fireEvent.click(cancelButton);
    expect(
      screen.queryByRole("button", { name: `MC: ${microCopy.DIALOG_CANCEL}` })
    ).toBeFalsy();
  });
  it("disables sign up button on load", () => {
    const { getByRole } = render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );

    const signupButton = getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    const dialogSignupBtn = getByRole("button", { name: /sign up/ });
    expect(dialogSignupBtn).toBeDisabled();
  });

  it("enables sign up button on valid email and both legal check boxes checked ", () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );

    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);

    const hsForm = document.querySelector<HTMLFormElement>("form");
    const emailInput = hsForm.querySelector("input[name=email]");
    const legalConsentSubscription = hsForm.querySelectorAll(
      "input[type=checkbox]"
    )[0];

    const legalConsentProcessing = hsForm.querySelectorAll(
      "input[type=checkbox]"
    )[1];

    fireEvent.input(emailInput, { target: { value: "test123@gmail.com" } });
    fireEvent.click(legalConsentSubscription);
    fireEvent.click(legalConsentProcessing);

    const dialogSignupBtn = document.querySelectorAll(
      "[class*='actions'] button"
    )[1];
    expect(dialogSignupBtn).toBeEnabled();
  });
  it("disables sign up button on invalid email but both legal check boxes checked ", () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );

    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);

    const hsForm = document.querySelector<HTMLFormElement>("form");
    const emailInput = hsForm.querySelector("input[name=email]");
    const legalConsentSubscription = hsForm.querySelectorAll(
      "input[type=checkbox]"
    )[0];

    const legalConsentProcessing = hsForm.querySelectorAll(
      "input[type=checkbox]"
    )[1];

    fireEvent.input(emailInput, { target: { value: "test123.com" } });
    fireEvent.click(legalConsentSubscription);
    fireEvent.click(legalConsentProcessing);

    const dialogSignupBtn = document.querySelectorAll(
      "[class*='actions'] button"
    )[1];
    expect(dialogSignupBtn).toBeDisabled();
  });

  it("disables sign up button on valid email but legal check boxes not checked ", () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );

    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);

    const hsForm = document.querySelector<HTMLFormElement>("form");
    const emailInput = hsForm.querySelector("input[name=email]");

    fireEvent.input(emailInput, { target: { value: "test123@gmail.com" } });

    const dialogSignupBtn = document.querySelectorAll(
      "[class*='actions'] button"
    )[1];
    expect(dialogSignupBtn).toBeDisabled();
  });

  it("renders correctly when clicked on close button once the form is submitted", () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );

    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);

    const hsForm = document.querySelector<HTMLFormElement>("form");
    const emailInput = hsForm.querySelector("input[name=email]");
    const legalConsentSubscription = hsForm.querySelectorAll(
      "input[type=checkbox]"
    )[0];

    const legalConsentProcessing = hsForm.querySelectorAll(
      "input[type=checkbox]"
    )[1];

    fireEvent.input(emailInput, { target: { value: "test123@gmail.com" } });
    fireEvent.click(legalConsentSubscription);
    fireEvent.click(legalConsentProcessing);

    const dialogSignupBtn = document.querySelectorAll(
      "[class*='actions'] button"
    )[1];

    fireEvent.click(dialogSignupBtn);

    expect(document.querySelectorAll("[class*='actions'] button").length).toBe(
      1
    );
    const cancelButton = screen.getByRole("button", {
      name: `MC: ${microCopy.DIALOG_CLOSE}`
    });
    fireEvent.click(cancelButton);
    expect(document.querySelector("[class*='Dialog']")).toBeFalsy();
  });
});
