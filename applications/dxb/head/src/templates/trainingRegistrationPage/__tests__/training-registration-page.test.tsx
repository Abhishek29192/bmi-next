import ThemeProvider from "@bmi-digital/components/theme-provider";
import { createTraining } from "@bmi/elasticsearch-types";
import { LocationProvider } from "@reach/router";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { sectionClasses } from "@bmi-digital/components/section";
import createBreadcrumbItem from "../../../__tests__/helpers/BreadcrumbItemHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import { trainingRegistrationPageData } from "../__mocks__/trainingRegistrationPage";
import { UseShowWarningModal } from "../hooks/useShowWarningModal";
import TrainingRegistrationPage from "../training-registration-page";
import type { UseRegistration } from "../hooks/useRegistration";
import type { TrainingRegistrationPageProps } from "../types";

let defaultProps: TrainingRegistrationPageProps;

beforeEach(() => {
  defaultProps = {
    data: {
      contentfulSite: createMockSiteData(),
      contentfulTrainingRegistrationPage: trainingRegistrationPageData,
      contentfulTrainingListerPage: {
        path: "training-lister-page",
        breadcrumbs: [
          createBreadcrumbItem({
            label: "Training lister page",
            slug: "training-lister-page"
          })
        ]
      }
    }
  };
});

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

  describe("Breadcrumbs", () => {
    describe("Top", () => {
      it("should render with a white background", () => {
        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbSection = screen.getByTestId("breadcrumbs-section-top");
        expect(breadcrumbSection).toHaveClass(sectionClasses.white);
      });

      it("should render the current page breadcrumb item correctly when the breadcrumb title is defined", () => {
        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-top");
        const currentBreadcrumbWithTitle = within(
          breadcrumbsElement
        ).getByTestId("bread-crumb-Training-Registration-Page");

        expect(currentBreadcrumbWithTitle).toHaveTextContent(
          /Training Registration Page/
        );
      });

      it("should render the current page breadcrumb item correctly when the breadcrumb title is undefined", () => {
        defaultProps.data.contentfulTrainingRegistrationPage.breadcrumbTitle =
          null;

        defaultProps.data.contentfulTrainingRegistrationPage.breadcrumbs = [
          {
            id: "2",
            label: "breadcrumb-example-label",
            slug: "breadcrumb-example-slug"
          }
        ];

        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-top");
        const currentBreadcrumbWithTitle = within(
          breadcrumbsElement
        ).getByTestId("bread-crumb-breadcrumb-example-label");

        expect(currentBreadcrumbWithTitle).toHaveTextContent(
          /breadcrumb-example-label/
        );
      });

      it("should render the training page breadcrumb item correctly when training is defined", () => {
        useRegistrationResults.training = createTraining();

        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-top");
        const trainingPageBreadcrumb = within(breadcrumbsElement).getByTestId(
          "bread-crumb-training-name"
        );

        expect(trainingPageBreadcrumb).toHaveTextContent(
          useRegistrationResults.training.courseName
        );
        expect(trainingPageBreadcrumb).toHaveAttribute(
          "href",
          "/en/t/training-slug"
        );
        expect(trainingPageBreadcrumb).toHaveAttribute(
          "data-gtm",
          '{"id":"cta-click1","action":"/en/t/training-slug","label":"training name"}'
        );
      });

      it("should not render the training page breadcrumb item when training is undefined", () => {
        useRegistrationResults.training = undefined;
        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-top");
        const trainingPageBreadcrumb = within(breadcrumbsElement).queryByTestId(
          "bread-crumb-training-name"
        );

        expect(trainingPageBreadcrumb).not.toBeInTheDocument();
      });

      it("should render the training lister page breadcrumb item correctly when contentfulTrainingListerPage is defined", () => {
        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-top");
        const trainingListerPageBreadcrumb = within(
          breadcrumbsElement
        ).getByTestId("bread-crumb-Training-lister-page");

        expect(trainingListerPageBreadcrumb).toHaveTextContent(
          /Training lister pag\.\.\./
        );
        expect(trainingListerPageBreadcrumb).toHaveAttribute(
          "href",
          "/en/training-lister-page"
        );
        expect(trainingListerPageBreadcrumb).toHaveAttribute(
          "data-gtm",
          '{"id":"cta-click1","action":"/en/training-lister-page","label":"Training lister page"}'
        );
      });

      it("should not render the training lister page breadcrumb item when contentfulTrainingListerPage is null", () => {
        defaultProps.data.contentfulTrainingListerPage = null;

        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-top");
        const trainingListerPageBreadcrumb = within(
          breadcrumbsElement
        ).queryByTestId("bread-crumb-Training-lister-page");

        expect(trainingListerPageBreadcrumb).not.toBeInTheDocument();
      });
    });

    describe("Bottom", () => {
      it("should render with a white background", () => {
        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbSection = screen.getByTestId(
          "breadcrumbs-section-bottom"
        );
        expect(breadcrumbSection).toHaveClass(sectionClasses.white);
      });

      it("should render the current page breadcrumb item correctly when the breadcrumb title is defined", () => {
        defaultProps.data.contentfulTrainingRegistrationPage.breadcrumbTitle =
          "Training Registration Page";

        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-bottom");
        const currentBreadcrumbWithTitle = within(
          breadcrumbsElement
        ).getByTestId("bread-crumb-Training-Registration-Page");

        expect(currentBreadcrumbWithTitle).toHaveTextContent(
          /Training Registration Page/
        );
      });

      it("should render the current page breadcrumb item correctly when the breadcrumb title is undefined", () => {
        defaultProps.data.contentfulTrainingRegistrationPage.breadcrumbTitle =
          null;

        defaultProps.data.contentfulTrainingRegistrationPage.breadcrumbs = [
          {
            id: "2",
            label: "breadcrumb-example-label",
            slug: "breadcrumb-example-slug"
          }
        ];

        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-bottom");
        const currentBreadcrumbWithTitle = within(
          breadcrumbsElement
        ).getByTestId("bread-crumb-breadcrumb-example-label");

        expect(currentBreadcrumbWithTitle).toHaveTextContent(
          /breadcrumb-example-label/
        );
      });

      it("should render the training page breadcrumb item correctly when training is defined", () => {
        useRegistrationResults.training = createTraining();

        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-bottom");
        const trainingPageBreadcrumb = within(breadcrumbsElement).getByTestId(
          "bread-crumb-training-name"
        );

        expect(trainingPageBreadcrumb).toHaveTextContent(
          useRegistrationResults.training.courseName
        );
        expect(trainingPageBreadcrumb).toHaveAttribute(
          "href",
          "/en/t/training-slug"
        );
        expect(trainingPageBreadcrumb).toHaveAttribute(
          "data-gtm",
          '{"id":"cta-click1","action":"/en/t/training-slug","label":"training name"}'
        );
      });

      it("should not render the training page breadcrumb item when training is undefined", () => {
        useRegistrationResults.training = undefined;
        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-bottom");
        const trainingPageBreadcrumb = within(breadcrumbsElement).queryByTestId(
          "bread-crumb-training-name"
        );

        expect(trainingPageBreadcrumb).not.toBeInTheDocument();
      });

      it("should render the training lister page breadcrumb item correctly when contentfulTrainingListerPage is defined", () => {
        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-bottom");
        const trainingListerPageBreadcrumb = within(
          breadcrumbsElement
        ).getByTestId("bread-crumb-Training-lister-page");

        expect(trainingListerPageBreadcrumb).toHaveTextContent(
          /Training lister pag\.\.\./
        );
        expect(trainingListerPageBreadcrumb).toHaveAttribute(
          "href",
          "/en/training-lister-page"
        );
        expect(trainingListerPageBreadcrumb).toHaveAttribute(
          "data-gtm",
          '{"id":"cta-click1","action":"/en/training-lister-page","label":"Training lister page"}'
        );
      });

      it("should not render the training lister page breadcrumb item when contentfulTrainingListerPage is null", () => {
        defaultProps.data.contentfulTrainingListerPage = null;

        render(
          <ThemeProvider>
            <LocationProvider>
              <TrainingRegistrationPage {...defaultProps} />
            </LocationProvider>
          </ThemeProvider>
        );
        const breadcrumbsElement = screen.getByTestId("breadcrumbs-bottom");
        const trainingListerPageBreadcrumb = within(
          breadcrumbsElement
        ).queryByTestId("bread-crumb-Training-lister-page");

        expect(trainingListerPageBreadcrumb).not.toBeInTheDocument();
      });
    });
  });
});
