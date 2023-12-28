import ThemeProvider from "@bmi-digital/components/theme-provider";
import { LocationProvider } from "@reach/router";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from "@testing-library/react";
import React from "react";
import { trainingRegistrationPageData } from "../__mocks__/trainingRegistrationPage";
import TrainingRegistrationForm from "../components/TrainingRegistrationForm";
import type { NavigateFn } from "@reach/router";

const navigateMock = jest.fn();
jest.mock("gatsby", () => ({
  graphql: jest.fn(),
  navigate: (...args: Parameters<NavigateFn>) => navigateMock(...args)
}));

const getCookieMock = jest.fn();
jest.mock("../../../utils/getCookie", () => ({
  __esModule: true,
  default: (cookieName: string) => getCookieMock(cookieName)
}));

const executeRecaptchaMock = jest.fn();
jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => executeRecaptchaMock()
  })
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

const renderTrainingRegistrationPage = () =>
  render(
    <ThemeProvider>
      <LocationProvider>
        <TrainingRegistrationForm
          {...trainingRegistrationPageData}
          trainingDetailsPageUrl="/no/t/training-details-page-utl"
        />
      </LocationProvider>
    </ThemeProvider>
  );

describe("TrainingRegistrationForm", () => {
  [
    "firstName",
    "lastName",
    "email",
    "position",
    "street",
    "postalCode"
  ].forEach((fieldName) => {
    it(`renders an error if "${fieldName}" field is empty on blur`, () => {
      renderTrainingRegistrationPage();
      const positionLabel = screen.getByLabelText(
        // eslint-disable-next-line security/detect-object-injection
        trainingRegistrationPageData[fieldName],
        {
          exact: false
        }
      );
      fireEvent.change(positionLabel, { target: { value: "" } });
      fireEvent.blur(positionLabel);
      expect(
        screen.getByText("MC: validation.errors.fieldRequired")
      ).toBeInTheDocument();
    });
  });

  it("renders an error if 'Email' is not valid on blur", () => {
    renderTrainingRegistrationPage();

    const emailLabel = screen.getByLabelText(
      trainingRegistrationPageData.email,
      {
        exact: false
      }
    );
    fireEvent.change(emailLabel, { target: { value: "test-email" } });
    fireEvent.blur(emailLabel);
    expect(screen.getByText("MC: errors.emailInvalid")).toBeInTheDocument();
  });

  it("disables submit button if the form is empty", () => {
    renderTrainingRegistrationPage();
    expect(
      screen.getByRole("button", {
        name: trainingRegistrationPageData.registerButton
      })
    ).toBeDisabled();
  });

  it("submits the form if all the required fields are filled in correctly", async () => {
    renderTrainingRegistrationPage();

    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.firstName, {
        exact: false
      }),
      { target: { value: "First name" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.lastName, {
        exact: false
      }),
      { target: { value: "Last name" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.email, {
        exact: false
      }),
      { target: { value: "test@bmigroup.com" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.position, {
        exact: false
      }),
      { target: { value: "Developer" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.street, {
        exact: false
      }),
      { target: { value: "Street name" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.postalCode, {
        exact: false
      }),
      { target: { value: "Postal code" } }
    );
    fireEvent.click(
      within(screen.getByTestId("terms-of-use-checkbox")).getByRole("checkbox")
    );

    const submitButton = screen.getByRole("button", {
      name: trainingRegistrationPageData.registerButton
    });
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        "/no/t/training-details-page-utl",
        {
          state: { showResultsModal: true },
          replace: true
        }
      )
    );
    expect(executeRecaptchaMock).toHaveBeenCalled();
  });

  it("should not execute recatpcha checks if 'getCookieMock' returns a value", async () => {
    getCookieMock.mockReturnValue("qa-auth-token");
    renderTrainingRegistrationPage();

    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.firstName, {
        exact: false
      }),
      { target: { value: "First name" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.lastName, {
        exact: false
      }),
      { target: { value: "Last name" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.email, {
        exact: false
      }),
      { target: { value: "test@bmigroup.com" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.position, {
        exact: false
      }),
      { target: { value: "Developer" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.street, {
        exact: false
      }),
      { target: { value: "Street name" } }
    );
    fireEvent.change(
      screen.getByLabelText(trainingRegistrationPageData.postalCode, {
        exact: false
      }),
      { target: { value: "Postal code" } }
    );
    fireEvent.click(
      within(screen.getByTestId("terms-of-use-checkbox")).getByRole("checkbox")
    );

    const submitButton = screen.getByRole("button", {
      name: trainingRegistrationPageData.registerButton
    });
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    expect(navigateMock).toHaveBeenCalledWith(
      "/no/t/training-details-page-utl",
      {
        state: { showResultsModal: true },
        replace: true
      }
    );
    expect(executeRecaptchaMock).not.toHaveBeenCalled();
  });
});
