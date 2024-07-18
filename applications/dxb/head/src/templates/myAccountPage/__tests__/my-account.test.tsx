import ThemeProvider from "@bmi-digital/components/theme-provider";
import { screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import createBreadcrumbItem from "../../../__tests__/helpers/BreadcrumbItemHelper";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import { renderWithRouter } from "../../../test/renderWithRouter";
import MyAccountPage from "../my-account";
import createRichText from "../../../__tests__/helpers/RichTextHelper";
import type { SiteDataWithAccountPage } from "../my-account";

const supportCards: SiteDataWithAccountPage["accountPage"]["serviceSupportCards"] =
  [
    {
      __typename: "ContentfulContactDetails",
      title: "BMI Group Corporate Headquarters",
      address:
        "Thames Tower, 4th Floor, Station Rd, Reading, United Kingdom, RG1 1LX",
      phoneNumber: "0370 560 1000",
      email: "contactus@bmigroup.com",
      otherInformation: createRichText()
    }
  ];

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
    serviceSupportCards: supportCards,
    globalTools: ["My profile"],
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

  it("should not render ServiceSupportSection if serviceSupportCards is null ", () => {
    const contentfulSite = createMockSiteDataWithAccountPage();
    contentfulSite.accountPage.breadcrumbTitle = null;

    renderWithRouter(
      <ThemeProvider>
        <MyAccountPage
          data={{
            contentfulSite: {
              ...contentfulSite,
              accountPage: {
                ...contentfulSite.accountPage,
                serviceSupportCards: null
              }
            }
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("account-page-service-support-section")
    ).not.toBeInTheDocument();
  });

  it("should render ServiceSupportSection if serviceSupportCards is provided", () => {
    const contentfulSite = createMockSiteDataWithAccountPage();
    contentfulSite.accountPage.breadcrumbTitle = null;

    renderWithRouter(
      <ThemeProvider>
        <MyAccountPage
          data={{
            contentfulSite: {
              ...contentfulSite,
              accountPage: {
                ...contentfulSite.accountPage,
                serviceSupportCards: supportCards
              }
            }
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("account-page-service-support-section")
    ).toBeInTheDocument();
  });
});
