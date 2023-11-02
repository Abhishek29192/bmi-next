import { ThemeProvider } from "@bmi-digital/components";
import { LocationProvider } from "@reach/router";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  createCourseWithSession,
  createSession,
  CourseWithSessions
} from "@bmi/docebo-types";
import { Data as SiteData } from "../../../components/Site";
import { createMockSiteData } from "../../../test/mockSiteData";
import TrainingDetailsPage, {
  Props as TrainingProps
} from "../training-details-page";

const mockPageContext: TrainingProps["pageContext"] = {
  productCode: "test-training-code",
  siteId: "test-site-id",
  countryCode: "test-country-code"
};

const mockResources = createMockSiteData();
const mockCourse = createCourseWithSession();
const mockSiteData = createMockSiteData({
  resources: {
    ...mockResources.resources!,
    pdpShareWidget: {
      email: null,
      facebook: null,
      copy: null,
      __typename: "ShareWidgetSection",
      title: "My Title",
      message: null,
      clipboardSuccessMessage: null,
      clipboardErrorMessage: null,
      twitter: null,
      linkedin: null,
      pinterest: null,
      isLeftAligned: null
    }
  }
});
const sessions = createSession();

const renderTrainingDetailsPage = ({
  course = mockCourse,
  contentfulSite = mockSiteData
}: {
  course?: CourseWithSessions;
  contentfulSite?: SiteData;
}) => {
  return render(
    <ThemeProvider>
      <LocationProvider>
        <TrainingDetailsPage
          data={{
            doceboCourses: { ...course },
            contentfulSite
          }}
          pageContext={mockPageContext}
        />
      </LocationProvider>
    </ThemeProvider>
  );
};

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("Training DetailsPage", () => {
  it("should render correctly", () => {
    renderTrainingDetailsPage({
      course: {
        ...mockCourse,
        code: "",
        sessions: []
      }
    });
    expect(screen.getByTestId("training-name")).toBeInTheDocument();
    expect(screen.queryByTestId("training-id")).not.toBeInTheDocument();
    expect(screen.getByTestId("training-description")).toBeInTheDocument();
    expect(screen.getByTestId("sessions-title")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should render training id label if code exists for course", () => {
    renderTrainingDetailsPage({
      course: { ...mockCourse, code: "DK_TEST_01", sessions: [] }
    });
    expect(screen.getByTestId("training-id")).toBeInTheDocument();
    expect(screen.getByTestId("training-id")).toHaveTextContent("DK_TEST_01");
  });

  it("should not render sessions if no sessions available for the course", () => {
    renderTrainingDetailsPage({});
    expect(screen.queryByTestId("sessions-container")).not.toBeInTheDocument();
    expect(screen.getByTestId("no-available-sessions")).toBeInTheDocument();
  });

  it("should render sessions if sessions are available for the course", () => {
    renderTrainingDetailsPage({
      course: { ...mockCourse, sessions }
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
});
