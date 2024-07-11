import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import RoofMeasurement from "@bmi-digital/components/icon/RoofMeasurement";
import UserIcon from "@bmi-digital/components/icon/User";
import { microCopy } from "@bmi/microcopies";
import { describe, it, jest } from "@jest/globals";
import CompanyProfile from "@bmi-digital/components/icon/CompanyProfile";
import BMIGuarantee from "@bmi-digital/components/icon/BMIGuarantees";
import Calculator from "@bmi-digital/components/icon/Calculator";
import Visualiser from "@bmi-digital/components/icon/Visualiser";
import Team from "@bmi-digital/components/icon/Team";
import { GetMicroCopy } from "../../../components/MicroCopy";
import {
  constructUrlWithPrevPage,
  getUserInfo,
  transformGlobalTools,
  transformLocalTools
} from "../utils";
import { toAnchorLinkActionProps as originalToAnchorLinkActionProps } from "../../../components/link/utils";
import createAuth0IdTokenPayload from "./helpers/Auth0IdTokenPayloadHelper";
import createLocalTool from "./helpers/LocalToolHelper";

const mockToAnchorLinkActionProps = jest.fn();
jest.mock("../../../components/link/utils", () => ({
  toAnchorLinkActionProps: (
    ...args: Parameters<typeof originalToAnchorLinkActionProps>
  ) => mockToAnchorLinkActionProps(...args)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  mockToAnchorLinkActionProps.mockReturnValue({
    href: "http://localhost:8000"
  });
});

describe("getUserInfo", () => {
  it("should replace the name template with the user's first name", () => {
    const user = createAuth0IdTokenPayload();

    const userInfo = getUserInfo(
      user,
      "Hi {{name}}.",
      "You have the role {{role}}."
    );

    expect(userInfo.salutation).toEqual(
      `Hi ${user["https://intouch/first_name"]}.`
    );
    expect(userInfo.roleDescription).toEqual(
      `You have the role ${user["https://intouch/intouch_role"]}.`
    );
  });
});

describe("transformToolCard", () => {
  it("transforms tools correctly", () => {
    process.env.NEXT_PUBLIC_INTOUCH_ORIGIN = "https://fake";
    process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT = "/profile";
    process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT = "/training";
    process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT = "/roof-measurement";
    const currentPageUrl = "https://dxb-host.com/my-account";
    const mockGetMicroCopy = jest.fn<GetMicroCopy>((label: string) => {
      switch (label) {
        case microCopy.PROFILE_LABEL: {
          return "Profile label";
        }
        case microCopy.TRAINING_LABEL: {
          return "Training label";
        }
        case microCopy.ROOF_MEASUREMENT_LABEL: {
          return "Roof measurement label";
        }
      }
      throw Error(`Microcopy not found for unrecognised label ${label}`);
    });
    const tools = ["My profile", "Trainings", "Roof measurement"] as const;
    const result = transformGlobalTools(
      currentPageUrl,
      tools,
      mockGetMicroCopy
    );
    expect(result).toEqual([
      {
        icon: UserIcon,
        title: "Profile label",
        href: `${process.env.NEXT_PUBLIC_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`,
        external: true
      },
      {
        icon: OtherTraining,
        title: "Training label",
        href: `${process.env.NEXT_PUBLIC_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`,
        external: true
      },
      {
        icon: RoofMeasurement,
        title: "Roof measurement label",
        href: `${process.env.NEXT_PUBLIC_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`,
        external: true
      }
    ]);
  });

  it("orders the returned array", () => {
    process.env.NEXT_PUBLIC_INTOUCH_ORIGIN = "https://fake";
    process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT = "/profile";
    process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT = "/training";
    process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT = "/roof-measurement";
    const currentPageUrl = "https://dxb-host.com/my-account";
    const mockGetMicroCopy = jest.fn<GetMicroCopy>((label: string) => {
      switch (label) {
        case microCopy.PROFILE_LABEL: {
          return "Profile label";
        }
        case microCopy.TRAINING_LABEL: {
          return "Training label";
        }
        case microCopy.ROOF_MEASUREMENT_LABEL: {
          return "Roof measurement label";
        }
      }
      throw Error(`Microcopy not found for unrecognised label ${label}`);
    });
    const tools = ["Trainings", "Roof measurement", "My profile"] as const;
    const result = transformGlobalTools(
      currentPageUrl,
      tools,
      mockGetMicroCopy
    );
    expect(result).toEqual([
      {
        icon: UserIcon,
        title: "Profile label",
        href: `${process.env.NEXT_PUBLIC_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`,
        external: true
      },
      {
        icon: OtherTraining,
        title: "Training label",
        href: `${process.env.NEXT_PUBLIC_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`,
        external: true
      },
      {
        icon: RoofMeasurement,
        title: "Roof measurement label",
        href: `${process.env.NEXT_PUBLIC_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`,
        external: true
      }
    ]);
  });
});

describe("constructUrlWithPrevPage", () => {
  it("should construct URL with previous page correctly", () => {
    const mockLocation = {
      origin: "https://example.com",
      pathname: "/current-page"
    };
    Object.defineProperty(window, "location", {
      value: mockLocation
    });

    const uri = "https://example.com/new-page";

    const expectedUrl =
      "https://example.com/new-page?prev_page=https%3A%2F%2Fexample.com%2Fcurrent-page";

    const result = constructUrlWithPrevPage(uri);

    expect(result).toBe(expectedUrl);
  });
});

describe("transformLocalTools", () => {
  const countryCode = "dxb";

  it("should return an empty array if null", () => {
    expect(transformLocalTools(null, countryCode)).toEqual([]);
    expect(mockToAnchorLinkActionProps).not.toHaveBeenCalled();
  });

  it("should transform an entry of 'Calculator' type correctly", () => {
    const tool = createLocalTool({ type: "Calculator" });
    expect(transformLocalTools([tool], countryCode)).toEqual([
      {
        title: tool.title,
        href: "http://localhost:8000",
        icon: Calculator
      }
    ]);
    expect(mockToAnchorLinkActionProps).toHaveBeenCalledWith(
      tool.link,
      countryCode
    );
  });

  it("should transform an entry of 'Company Profile' type correctly", () => {
    const tool = createLocalTool({ type: "Company Profile" });
    expect(transformLocalTools([tool], countryCode)).toEqual([
      {
        title: tool.title,
        href: "http://localhost:8000",
        icon: CompanyProfile
      }
    ]);
    expect(mockToAnchorLinkActionProps).toHaveBeenCalledWith(
      tool.link,
      countryCode
    );
  });

  it("should transform an entry of 'Guarantees' type correctly", () => {
    const tool = createLocalTool({ type: "Guarantees" });
    expect(transformLocalTools([tool], countryCode)).toEqual([
      {
        title: tool.title,
        href: "http://localhost:8000",
        icon: BMIGuarantee
      }
    ]);
    expect(mockToAnchorLinkActionProps).toHaveBeenCalledWith(
      tool.link,
      countryCode
    );
  });

  it("should transform an entry of 'Team' type correctly", () => {
    const tool = createLocalTool({ type: "Team" });
    expect(transformLocalTools([tool], countryCode)).toEqual([
      {
        title: tool.title,
        href: "http://localhost:8000",
        icon: Team
      }
    ]);
    expect(mockToAnchorLinkActionProps).toHaveBeenCalledWith(
      tool.link,
      countryCode
    );
  });

  it("should transform an entry of 'Visualiser' type correctly", () => {
    const tool = createLocalTool({ type: "Visualiser" });
    expect(transformLocalTools([tool], countryCode)).toEqual([
      {
        title: tool.title,
        href: "http://localhost:8000",
        icon: Visualiser
      }
    ]);
    expect(mockToAnchorLinkActionProps).toHaveBeenCalledWith(
      tool.link,
      countryCode
    );
  });
});
