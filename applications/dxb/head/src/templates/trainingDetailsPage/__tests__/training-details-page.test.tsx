import ThemeProvider from "@bmi-digital/components/theme-provider";
import { createSession } from "@bmi/docebo-types";
import { LocationProvider } from "@reach/router";
import { render, screen } from "@testing-library/react";
import React from "react";
import { createTraining } from "../../../__tests__/helpers/TrainingHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import TrainingDetailsPage, {
  Props as TrainingProps
} from "../training-details-page";
import type { TrainingDetailsCourseType as Course } from "../types";

const mockPageContext: TrainingProps["pageContext"] = {
  siteId: "site-id",
  countryCode: "no",
  courseId: 10
};

const renderTrainingDetailsPage = ({ course }: { course: Course }) => {
  return render(
    <ThemeProvider>
      <LocationProvider>
        <TrainingDetailsPage
          data={{
            doceboCourses: course,
            contentfulSite: createMockSiteData(),
            contentfulTrainingRegistrationPage: {
              path: "training-registration-page/"
            }
          }}
          pageContext={mockPageContext}
        />
      </LocationProvider>
    </ThemeProvider>
  );
};

jest.mock("../../../utils/useHeaderHeight", () => ({
  useHeaderHeight: jest.fn().mockReturnValue(100)
}));

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("Training DetailsPage", () => {
  it("should render correctly", () => {
    const course = createTraining();
    renderTrainingDetailsPage({
      course
    });
    expect(screen.getByTestId("training-id")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs-section-top")).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("training-card-sticky-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("training-name")).toBeInTheDocument();
    expect(screen.getByTestId("training-description")).toBeInTheDocument();
    expect(screen.getByTestId("sessions-title")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("MC: training.price.free")).toBeInTheDocument();
  });

  it("should render training id label if code does not exists for course", () => {
    renderTrainingDetailsPage({
      course: createTraining({ code: null })
    });
    expect(screen.queryByTestId("training-id")).not.toBeInTheDocument();
  });

  it("should not render sessions if no sessions available for the course", () => {
    renderTrainingDetailsPage({
      course: createTraining({ sessions: null })
    });
    expect(screen.queryByTestId("sessions-container")).not.toBeInTheDocument();
    expect(screen.getByTestId("no-available-sessions")).toBeInTheDocument();
  });

  it("should render sessions if sessions are available for the course", () => {
    renderTrainingDetailsPage({
      course: createTraining({ sessions: [createSession()] })
    });

    expect(screen.getByTestId("sessions-container")).toBeInTheDocument();
    expect(screen.getByTestId("available-session")).toBeInTheDocument();
    expect(screen.getByTestId("session-name")).toBeInTheDocument();
    expect(screen.getByTestId("session-name")).toHaveTextContent(
      "Test course session"
    );
    expect(screen.getByTestId("session-date")).toBeInTheDocument();
    expect(screen.getByTestId("session-cta-button")).toBeInTheDocument();
  });

  it("should render price if provided", () => {
    renderTrainingDetailsPage({
      course: createTraining({ price: "100" })
    });
    expect(screen.getByText("€100")).toBeInTheDocument();
  });
});
