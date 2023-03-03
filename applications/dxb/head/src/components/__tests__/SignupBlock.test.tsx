import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
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
        <input type="email" name="email" data-testid={"form-email"} />
        <input
          type="checkbox"
          id="LEGAL_CONSENT.subscription"
          data-testid={"form-subscription"}
        />
        <input
          type="checkbox"
          id="LEGAL_CONSENT.processing"
          data-testid={"form-processing"}
        />
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
    const { baseElement } = render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("renders correctly when no data is given", () => {
    const { container } = render(
      <ThemeProvider>
        <SignupBlock />
      </ThemeProvider>
    );
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it("renders dialog correctly when clicked on sign up button", async () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );
    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);

    expect(await screen.findByTestId("dialog")).toBeInTheDocument();

    const dialogSignupBtn = screen.getByRole("button", {
      name: data.signupLabel
    });
    expect(dialogSignupBtn).toBeInTheDocument();
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
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
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
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );

    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);
    const dialogSignupBtn = screen.getByRole("button", { name: /sign up/ });
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

    const emailInput = screen.getByTestId("form-email");
    const legalConsentSubscription = screen.getByTestId("form-subscription");
    const legalConsentProcessing = screen.getByTestId("form-processing");

    fireEvent.input(emailInput, { target: { value: "test123@gmail.com" } });
    fireEvent.click(legalConsentSubscription);
    fireEvent.click(legalConsentProcessing);

    const dialogSignupBtn = screen.getByRole("button", {
      name: data.signupLabel
    });

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

    const emailInput = screen.getByTestId("form-email");
    const legalConsentSubscription = screen.getByTestId("form-subscription");
    const legalConsentProcessing = screen.getByTestId("form-processing");

    fireEvent.input(emailInput, { target: { value: "test123.com" } });
    fireEvent.click(legalConsentSubscription);
    fireEvent.click(legalConsentProcessing);

    const dialogSignupBtn = screen.getByRole("button", {
      name: data.signupLabel
    });
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

    const emailInput = screen.getByTestId("form-email");

    fireEvent.input(emailInput, { target: { value: "test123@gmail.com" } });

    const closeDialogButton = screen.getByRole("button", {
      name: data.signupLabel
    });

    expect(closeDialogButton).toBeDisabled();
  });

  it("renders correctly when clicked on close button once the form is submitted", () => {
    render(
      <ThemeProvider>
        <SignupBlock data={data} />
      </ThemeProvider>
    );

    const signupButton = screen.getByRole("button", { name: "sign up" });
    fireEvent.click(signupButton);

    const emailInput = screen.getByTestId("form-email");
    const legalConsentSubscription = screen.getByTestId("form-subscription");
    const legalConsentProcessing = screen.getByTestId("form-processing");

    fireEvent.input(emailInput, { target: { value: "test123@gmail.com" } });
    fireEvent.click(legalConsentSubscription);
    fireEvent.click(legalConsentProcessing);
    const dialogSignupBtn = screen.getByTestId("signup-button");
    fireEvent.click(dialogSignupBtn);
    const cancelButton = screen.getByTestId("dialog-action-button-cancel");
    fireEvent.click(cancelButton);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });
});
