import { ThemeProvider } from "@bmi-digital/components";
import { LocationProvider } from "@reach/router";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Data as SiteData } from "../../../components/Site";
import { createMockSiteData } from "../../../test/mockSiteData";
import { DoceboCourse } from "../../../types/pim";
import TrainingDetailsPage, {
  Props as TrainingProps
} from "../training-details-page";
import createCourse from "../../../__tests__/helpers/DoceboCourseHelper";

const mockPageContext: TrainingProps["pageContext"] = {
  productCode: "test-training-code",
  siteId: "test-site-id",
  countryCode: "test-country-code"
};

const mockResources = createMockSiteData();
const mockCourse = createCourse();
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

const renderTrainingDetailsPage = ({
  course = mockCourse,
  contentfulSite = mockSiteData
}: {
  course?: DoceboCourse;
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
    renderTrainingDetailsPage({});

    expect(screen.getByTestId("training-name")).toBeInTheDocument();
    expect(screen.queryByTestId("training-id")).not.toBeInTheDocument();
    expect(screen.getByTestId("training-description")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should render training id label if code exists for course", () => {
    renderTrainingDetailsPage({
      course: { ...mockCourse, code: "DK_TEST_01" }
    });
    expect(screen.getByTestId("training-id")).toBeInTheDocument();
    expect(screen.getByTestId("training-id")).toHaveTextContent("DK_TEST_01");
  });
});
