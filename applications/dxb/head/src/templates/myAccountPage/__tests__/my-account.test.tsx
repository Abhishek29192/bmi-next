import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import RoofMeasurement from "@bmi-digital/components/icon/RoofMeasurement";
import UserIcon from "@bmi-digital/components/icon/User";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { screen } from "@testing-library/react";
import { Auth0UserProfile } from "auth0-js";
import React, { ReactNode } from "react";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import { renderWithRouter } from "../../../test/renderWithRouter";
import MyAccountPage from "../my-account";
import { getUserInfo, transformToolCar } from "../utils";

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
  it("render page with data", () => {
    const contentfulSite = createMockSiteData({
      accountPage: {
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
        allowTools: ["My profile"]
      }
    });
    renderWithRouter(
      <ThemeProvider>
        <MyAccountPage data={{ contentfulSite: contentfulSite }} />
      </ThemeProvider>
    );

    expect(screen.getByText("titleForToolSection")).toBeInTheDocument();
    expect(
      screen.getByTestId("my-acc-page-breadcrumbs-top")
    ).toBeInTheDocument();
    expect(screen.getByTestId("PersonIcon")).toBeInTheDocument();
  });

  it("transforms tools correctly", () => {
    process.env.GATSBY_INTOUCH_LOGIN_ENDPOINT = "https://fake";
    process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT = "/profile";
    process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT = "/training";
    process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT = "/roof-measurement";
    const mockGetMicroCopy = jest.fn(() => "Microcopy");
    const tools = ["My profile", "Trainings", "Roof measurement"];
    const result = transformToolCar(tools, mockGetMicroCopy);
    expect(result[0].icon).toBe(UserIcon);
    expect(result[1].icon).toBe(OtherTraining);
    expect(result[2].icon).toBe(RoofMeasurement);
    expect(result[0].title).toBe("Microcopy");
    expect(result[0].url).toBe("https://fake/profile");
    expect(result[1].url).toBe("https://fake/training");
    expect(result[2].url).toBe("https://fake/roof-measurement");
  });

  it("transforms tools cards not from the list", () => {
    process.env.GATSBY_INTOUCH_LOGIN_ENDPOINT = "https://fake";
    process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT = "/profile";
    process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT = "/training";
    process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT = "/roof-measurement";
    const mockGetMicroCopy = jest.fn(() => "Microcopy");
    const tools = ["test"];
    const result = transformToolCar(tools, mockGetMicroCopy);
    expect(result[0].icon).toBe(null);
    expect(result[0].url).toBe("");
    expect(result[0].title).toBe("");
  });

  it("gets user info correctly", () => {
    const user = {
      name: "John Doe",
      "https://intouch/intouch_role": "Tester"
    };
    const salutationTemplate = "{{name}} is a great";
    const roleDescriptionTemplate = "Role: {{role}}";

    const result = getUserInfo(
      user as unknown as Auth0UserProfile,
      salutationTemplate,
      roleDescriptionTemplate
    );

    expect(result).toEqual({
      salutation: "John Doe is a great",
      roleDescription: "Role: Tester"
    });
  });
});
