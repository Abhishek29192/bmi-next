import React from "react";
import { render, screen } from "@testing-library/react";
import { createTraining } from "@bmi/elasticsearch-types";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { LocationProvider } from "@reach/router";
import TrainingRegistrationPage from "../training-registration-page";
import { createMockSiteData } from "../../../test/mockSiteData";
import type { TrainingRegistrationPageProps } from "../types";
import type { UseRegistration } from "../hooks/useRegistration";

const defaultProps: TrainingRegistrationPageProps = {
  data: {
    contentfulSite: createMockSiteData(),
    contentfulTrainingRegistrationPage: {
      __typename: "ContentfulTrainingRegistrationPage",
      path: "training-registration-page/"
    }
  },
  pageContext: {
    variantCodeToPathMap: {},
    siteId: "fake-site-id",
    pageId: "fake-page-id"
  }
};

jest.mock("../components/TrainingRegistrationHeader", () => ({
  __esModule: true,
  default: () => <div>Training registration page</div>
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
      screen.queryByText("Training registration page")
    ).not.toBeInTheDocument();
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
    expect(screen.getByText("Training registration page")).toBeInTheDocument();
  });
});
