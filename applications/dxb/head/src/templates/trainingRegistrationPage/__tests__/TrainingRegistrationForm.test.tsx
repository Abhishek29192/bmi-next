import ThemeProvider from "@bmi-digital/components/theme-provider";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import { createTraining } from "@bmi/elasticsearch-types";
import { microCopy } from "@bmi/microcopies";
import { LocationProvider } from "@reach/router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import fetchMockJest = require("fetch-mock-jest");
import { fallbackGetMicroCopy as getMicroCopy } from "../../../components/MicroCopy";
import { SiteContextProvider } from "../../../components/Site";
import { getMockSiteContext } from "../../../components/__tests__/utils/SiteContextProvider";
import { ConfigProvider } from "../../../contexts/ConfigProvider";
import { trainingRegistrationPageData } from "../__mocks__/trainingRegistrationPage";
import TrainingRegistrationForm from "../components/TrainingRegistrationForm";

import type { NavigateFn } from "@reach/router";

const navigateMock = jest.fn();

const fetchMock = fetchMockJest.sandbox();
global.fetch = fetchMock;

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

jest.mock("../components/ExtraParticipants", () => ({
  __esModule: true,
  default: () => <>Extra participants section</>
}));

beforeEach(() => {
  fetchMock.reset();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContextProvider
      value={{
        ...getMockSiteContext("no"),
        reCaptchaKey: "1234",
        reCaptchaNet: false
      }}
    >
      {children}
    </SiteContextProvider>
  );
};

const renderTrainingRegistrationPage = () => {
  render(
    <ConfigProvider
      configOverride={{
        gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
      }}
    >
      <MockSiteContext>
        <ThemeProvider>
          <LocationProvider>
            <TrainingRegistrationForm
              {...trainingRegistrationPageData}
              trainingDetailsPageUrl="/no/t/training-details-page-utl"
              courseCode={"IT-TEST08"}
              training={createTraining()}
            />
          </LocationProvider>
        </ThemeProvider>
      </MockSiteContext>
    </ConfigProvider>
  );
};

describe("TrainingRegistrationForm", () => {
  it("submits the form and trigger the email", async () => {
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: "OK"
    });

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
    fireEvent.click(screen.getByTestId("terms-of-use-checkbox"));
    fireEvent.click(screen.getByTestId("consent-text-checkbox"));

    const submitButton = screen.getByRole("button", {
      name: trainingRegistrationPageData.registerButton
    });
    fireEvent.click(submitButton);

    const emailDateLabel = getMicroCopy(microCopy.TRAINING_EMAIL_START_DATE);
    const emailLabel = getMicroCopy(microCopy.TRAINING_EMAIL_LABEL);
    const emailConsentLabel = getMicroCopy(
      microCopy.TRAINING_EMAIL_DATA_CONSENT_LABEL
    );
    const emailTermsOfUseLabel = getMicroCopy(
      microCopy.TRAINING_EMAIL_TERM_OF_USE_LABEL
    );
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          method: "POST",
          body: JSON.stringify({
            locale: "en-GB",
            title: "",
            recipients: "test@bmigroup.com",
            values: {
              [emailLabel]: "training code - training name, session name",
              [emailDateLabel]: "2023-12-29 00:00:00",
              [emailTermsOfUseLabel]: "Terms of use",
              [emailConsentLabel]: "Consent text",
              Salutation: "Mr",
              "First name": "First name",
              "Last name": "Last name",
              Email: "test@bmigroup.com",
              Position: "Developer",
              Street: "Street name",
              "Postal code": "Postal code",
              "Are you a member of the [BMI SystemPartner Club](https://fake-url.com/) (subject to a fee)?":
                "Yes",
              "How did you find out about this event": "Brochure"
            },
            emailSubjectFormat: "Sample subject IT-TEST08"
          }),
          headers: {
            "X-Recaptcha-Token": undefined,
            "Content-Type": "application/json"
          }
        }
      )
    );
  }, 10000);

  (
    [
      "firstName",
      "lastName",
      "email",
      "position",
      "street",
      "postalCode"
    ] as const
  ).forEach((fieldName) => {
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
    fireEvent.click(screen.getByTestId("terms-of-use-checkbox"));
    fireEvent.click(screen.getByTestId("consent-text-checkbox"));

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
    fireEvent.click(screen.getByTestId("terms-of-use-checkbox"));
    fireEvent.click(screen.getByTestId("consent-text-checkbox"));

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
    expect(executeRecaptchaMock).not.toHaveBeenCalled();
  });

  it("renders extra participants section", () => {
    renderTrainingRegistrationPage();
    expect(screen.getByText("Extra participants section")).toBeInTheDocument();
  });
});
