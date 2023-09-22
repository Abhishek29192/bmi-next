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
    ...mockResources.resources,
    pdpShareWidget: {
      ...mockResources.resources!.pdpShareWidget,
      email: true,
      facebook: true,
      copy: true
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
    expect(screen.getByTestId("training-id")).toBeInTheDocument();
    expect(screen.getByTestId("training-description")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
