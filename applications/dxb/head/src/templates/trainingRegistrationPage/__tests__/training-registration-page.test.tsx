import React from "react";
import { render, screen } from "@testing-library/react";
import { createTraining } from "@bmi/elasticsearch-types";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { LocationProvider } from "@reach/router";
import TrainingRegistrationPage from "../training-registration-page";
import { createMockSiteData } from "../../../test/mockSiteData";
import { trainingRegistrationPageData } from "../__mocks__/trainingRegistrationPage";
import createBreadcrumbItem from "../../../__tests__/helpers/BreadcrumbItemHelper";
import type { TrainingRegistrationPageProps } from "../types";
import type { UseRegistration } from "../hooks/useRegistration";

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

const useRegistrationResults: ReturnType<UseRegistration> = {
  loading: false,
  training: undefined
};
jest.mock("../hooks/useRegistration", () => ({
  useRegistration: () => useRegistrationResults
}));

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
});
