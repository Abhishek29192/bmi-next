import ThemeProvider from "@bmi-digital/components/theme-provider";
import { createTraining } from "@bmi/elasticsearch-types";
import { LocationProvider } from "@reach/router";
import { render, screen } from "@testing-library/react";
import React from "react";
import createBreadcrumbItem from "../../../__tests__/helpers/BreadcrumbItemHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import { trainingRegistrationPageData } from "../__mocks__/trainingRegistrationPage";
import { UseShowWarningModal } from "../hooks/useShowWarningModal";
import TrainingRegistrationPage from "../training-registration-page";
import type { UseRegistration } from "../hooks/useRegistration";
import type { TrainingRegistrationPageProps } from "../types";

const defaultProps: TrainingRegistrationPageProps = {
  data: {
    contentfulSite: createMockSiteData(),
    contentfulTrainingRegistrationPage: trainingRegistrationPageData,
    contentfulTrainingListerPage: {
      path: "/no/training-lister-page",
      breadcrumbs: [
        createBreadcrumbItem({
          label: "Training lister page",
          slug: "training-lister-page"
        })
      ]
    }
  }
};

jest.mock("../components/TrainingRegistrationHeader", () => ({
  __esModule: true,
  default: () => <div>Training registration page header</div>
}));

jest.mock("../components/TrainingRegistrationForm", () => ({
  __esModule: true,
  default: () => <div>Training registration form</div>
}));

jest.mock("../components/WarningDialog", () => ({
  __esModule: true,
  default: () => <div>Warning Dialog</div>
}));

const useShowWarningModalMock = jest.fn();
jest.mock("../hooks/useShowWarningModal", () => ({
  useShowWarningModal: (...args: Parameters<UseShowWarningModal>) =>
    useShowWarningModalMock(...args)
}));

const useRegistrationResults: ReturnType<UseRegistration> = {
  loading: false,
  training: undefined
};
jest.mock("../hooks/useRegistration", () => ({
  useRegistration: () => useRegistrationResults
}));

beforeEach(() => {
  useShowWarningModalMock.mockReturnValue({
    closeWarningDialog: jest.fn(),
    blockedLocation: undefined
  });
});

describe("TrainingRegistrationPage", () => {
  it("renders correctly if loading === true and training === undefined", () => {
    useRegistrationResults.loading = true;
    useRegistrationResults.training = undefined;
    render(
      <ThemeProvider>
        <LocationProvider>
          <TrainingRegistrationPage {...defaultProps} />
        </LocationProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId("progress-indicator")).toBeInTheDocument();
    expect(
      screen.queryByText("Training registration page header")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Training registration form")).toBeInTheDocument();
  });

  it("renders correctly if loading === false and training is defined", () => {
    useRegistrationResults.loading = false;
    useRegistrationResults.training = createTraining();
    render(
      <ThemeProvider>
        <LocationProvider>
          <TrainingRegistrationPage {...defaultProps} />
        </LocationProvider>
      </ThemeProvider>
    );

    expect(screen.queryByTestId("progress-indicator")).not.toBeInTheDocument();
    expect(
      screen.getByText("Training registration page header")
    ).toBeInTheDocument();
    expect(screen.getByText("Training registration form")).toBeInTheDocument();
  });

  it("should not render the form and training info section if the loading is completed and training is not defined", () => {
    useRegistrationResults.loading = false;
    useRegistrationResults.training = undefined;
    render(
      <ThemeProvider>
        <LocationProvider>
          <TrainingRegistrationPage {...defaultProps} />
        </LocationProvider>
      </ThemeProvider>
    );

    expect(
      screen.queryByText("Training registration page header")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Training registration form")
    ).not.toBeInTheDocument();
  });

  it("should not render 'Warning Dialog' if blockedLocation===undefined", () => {
    useShowWarningModalMock.mockReturnValue({
      blockedLocation: undefined,
      closeWarningDialog: jest.fn()
    });

    render(
      <ThemeProvider>
        <LocationProvider>
          <TrainingRegistrationPage {...defaultProps} />
        </LocationProvider>
      </ThemeProvider>
    );

    expect(screen.queryByText("Warning Dialog")).not.toBeInTheDocument();
  });

  it("should render 'Warning Dialog' if blockedLocation is provided", () => {
    useShowWarningModalMock.mockReturnValue({
      blockedLocation: window.location,
      closeWarningDialog: jest.fn()
    });

    render(
      <ThemeProvider>
        <LocationProvider>
          <TrainingRegistrationPage {...defaultProps} />
        </LocationProvider>
      </ThemeProvider>
    );

    expect(screen.getByText("Warning Dialog")).toBeInTheDocument();
  });
});
