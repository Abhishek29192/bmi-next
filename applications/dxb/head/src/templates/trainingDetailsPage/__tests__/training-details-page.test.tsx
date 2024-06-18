import ThemeProvider from "@bmi-digital/components/theme-provider";
import {
  createHistory,
  createMemorySource,
  History,
  LocationProvider
} from "@reach/router";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import {
  createSession,
  createTraining
} from "../../../__tests__/helpers/TrainingHelper";
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

const trainingRegistrationPageData = {
  path: "training-registration-page/",
  registrationCompletedDialogCloseButton: "Close",
  successTitle: "Thank you for registration",
  successDescription: {
    successDescription:
      "We have received your registration and we’ll get in touch with you shortly."
  }
};

jest.mock("../components/RegistrationCompletedDialog", () => ({
  __esModule: true,
  default: () => <>Success training registration modal</>
}));

const useIsClientMock = jest.fn();

jest.mock("@bmi-digital/components/hooks", () => ({
  useIsClient: () => useIsClientMock()
}));

const scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

window.history.replaceState = jest.fn();

const renderTrainingDetailsPage = ({
  course,
  history: customHistory
}: {
  course: Course;
  history?: History;
}) => {
  const history =
    customHistory ||
    createHistory(createMemorySource(`/no/t/${course.slug_name}`));

  return render(
    <ThemeProvider>
      <LocationProvider history={history}>
        <TrainingDetailsPage
          data={{
            doceboCourses: course,
            contentfulSite: createMockSiteData(),
            contentfulTrainingRegistrationPage: trainingRegistrationPageData
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

  useIsClientMock.mockReturnValue({ isClient: true });
});

describe("Training DetailsPage", () => {
  it("should render correctly", () => {
    const course = createTraining();
    renderTrainingDetailsPage({
      course
    });
    expect(screen.getAllByTestId("training-code")[0]).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs-section-top")).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("training-name")[0]).toBeInTheDocument();
    expect(screen.getByTestId("training-description")).toBeInTheDocument();
    expect(screen.getByTestId("sessions-title")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByText("Success training registration modal")
    ).toBeInTheDocument();
  });

  it("should not render sessions if no sessions available for the course", () => {
    renderTrainingDetailsPage({
      course: createTraining({ sessions: [] })
    });
    expect(screen.queryByTestId("sessions-container")).not.toBeInTheDocument();
    expect(screen.getByTestId("no-available-sessions")).toBeInTheDocument();
  });

  it("should render sessions if sessions are planned for the future", () => {
    const sessionStartDate = new Date();
    sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
    renderTrainingDetailsPage({
      course: createTraining({
        sessions: [
          createSession({
            date_start: sessionStartDate.getTime()
          })
        ]
      })
    });

    expect(screen.getByTestId("sessions-container")).toBeInTheDocument();
    expect(screen.getByTestId("available-session")).toBeInTheDocument();
    expect(screen.getByTestId("session-name")).toBeInTheDocument();
    expect(screen.getByTestId("session-name")).toHaveTextContent(
      "Test course session"
    );
    expect(screen.getByTestId("session-date")).toBeInTheDocument();
    expect(screen.getByTestId("session-cta-button")).toBeInTheDocument();
    expect(screen.queryByTestId("progress-indicator")).not.toBeInTheDocument();
  });

  it("should not render sessions planned for the past", () => {
    const sessionStartDate = new Date();
    sessionStartDate.setSeconds(sessionStartDate.getSeconds() - 3600);
    renderTrainingDetailsPage({
      course: createTraining({
        sessions: [createSession({ date_start: sessionStartDate.getTime() })]
      })
    });

    expect(screen.queryByTestId("sessions-container")).not.toBeInTheDocument();
    expect(screen.getByTestId("no-available-sessions")).toBeInTheDocument();
  });

  it("replaces history state if 'showResultsModal' is set to true", () => {
    const historyMemorySource = createMemorySource("/no/t/course-slug-name");
    historyMemorySource.history.pushState({ showResultsModal: true }, "", "");
    const history = createHistory(historyMemorySource);

    renderTrainingDetailsPage({ history, course: createTraining() });
    expect(window.history.replaceState).toHaveBeenCalledWith(
      {
        showResultsModal: false
      },
      ""
    );
  });

  it("should not render sessions on server side", () => {
    useIsClientMock.mockReturnValue({ isClient: false });
    const sessionStartDate = new Date();
    sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
    renderTrainingDetailsPage({
      course: createTraining({
        sessions: [
          createSession({
            date_start: sessionStartDate.getTime()
          })
        ]
      })
    });

    expect(screen.getByTestId("progress-indicator")).toBeInTheDocument();
    expect(screen.queryByTestId("sessions-container")).not.toBeInTheDocument();
    expect(screen.getByTestId("no-available-sessions")).toBeInTheDocument();
  });

  it("calls 'scrollIntoView' on 'Scroll to sessions' button click", () => {
    const sessionStartDate = new Date();
    sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
    renderTrainingDetailsPage({
      course: createTraining({
        sessions: [createSession({ date_start: sessionStartDate.getTime() })]
      })
    });

    fireEvent.click(screen.getByTestId("scroll-to-available-sessions-button"));
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
  });

  it("the sticky footer button should be disabled if the are no sessions planned for the future", () => {
    const sessionStartDate = new Date();
    sessionStartDate.setSeconds(sessionStartDate.getSeconds() - 3600);
    renderTrainingDetailsPage({
      course: createTraining({
        sessions: [createSession({ date_start: sessionStartDate.getTime() })]
      })
    });

    expect(
      screen.getByTestId("scroll-to-available-sessions-button")
    ).toBeDisabled();
  });

  it("the sticky footer button should be disabled if the are no sessions", () => {
    renderTrainingDetailsPage({
      course: createTraining({
        sessions: []
      })
    });

    expect(
      screen.getByTestId("scroll-to-available-sessions-button")
    ).toBeDisabled();
  });

  it("the sticky footer button should not be disabled if there are available sessions", () => {
    const sessionStartDate = new Date();
    sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
    renderTrainingDetailsPage({
      course: createTraining({
        sessions: [createSession({ date_start: sessionStartDate.getTime() })]
      })
    });

    expect(
      screen.getByTestId("scroll-to-available-sessions-button")
    ).not.toBeDisabled();
  });
});
