import ThemeProvider from "@bmi-digital/components/theme-provider";
import { screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import createBreadcrumbItem from "../../../__tests__/helpers/BreadcrumbItemHelper";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import { renderWithRouter } from "../../../test/renderWithRouter";
import MyAccountPage from "../my-account";
import type { SiteDataWithAccountPage } from "../my-account";

const createMockSiteDataWithAccountPage = (): SiteDataWithAccountPage => ({
  ...createMockSiteData(),
  accountPage: {
    title: "Page Title",
    slug: "account",
    featuredMedia: createImageData(),
    salutation: "salutation",
    roleDescription: "roleDescription",
    description: "description",
    titleForToolSection: "titleForToolSection",
    titleForServiceSupportSection: "titleForServiceSupportSection",
    serviceSupportCards: [
      {
        __typename: "ContentfulContactDetails",
        title: "BMI Group Corporate Headquarters",
        address:
          "Thames Tower, 4th Floor, Station Rd, Reading, United Kingdom, RG1 1LX",
        phoneNumber: "0370 560 1000",
        email: "contactus@bmigroup.com",
        otherInformation: {
          raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Monday - Friday 8:00 - 16:00","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
          references: []
        }
      }
    ],
    allowTools: ["My profile"],
    breadcrumbTitle: "Breadcrumb Title",
    path: "/my-account",
    breadcrumbs: [createBreadcrumbItem()]
  }
});

afterEach(() => {
  jest.clearAllMocks();
});
jest.mock("../../../pages/protected", () => {
  const protectedPage = ({ children }: { children: ReactNode }) => (
    <>{children}</>
  );

  return {
    __esModule: true,
    default: protectedPage
  };
});

describe("MyAccountPage", () => {
  it("should render the page with data", () => {
    const contentfulSite = createMockSiteDataWithAccountPage();

    renderWithRouter(
      <ThemeProvider>
        <MyAccountPage data={{ contentfulSite: contentfulSite }} />
      </ThemeProvider>
    );

    expect(
      screen.getByText(contentfulSite.accountPage.breadcrumbTitle!)
    ).toBeInTheDocument();
    expect(screen.getByText("titleForToolSection")).toBeInTheDocument();
    expect(screen.getByTestId("PersonIcon")).toBeInTheDocument();
  });

  it("should use the breadcrumb label for the breadcrumb if breadcrumbTitle is not provided", () => {
    const contentfulSite = createMockSiteDataWithAccountPage();
    contentfulSite.accountPage.breadcrumbTitle = null;

    renderWithRouter(
      <ThemeProvider>
        <MyAccountPage data={{ contentfulSite: contentfulSite }} />
      </ThemeProvider>
    );

    expect(
      screen.getByText(contentfulSite.accountPage.breadcrumbs[0].label)
    ).toBeInTheDocument();
  });
});
