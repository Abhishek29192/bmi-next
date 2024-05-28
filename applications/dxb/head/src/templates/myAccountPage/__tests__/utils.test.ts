import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import RoofMeasurement from "@bmi-digital/components/icon/RoofMeasurement";
import UserIcon from "@bmi-digital/components/icon/User";
import { microCopy } from "@bmi/microcopies";
import { describe, it, jest } from "@jest/globals";
import { GetMicroCopy } from "../../../components/MicroCopy";
import {
  constructUrlWithPrevPage,
  getUserInfo,
  transformToolCard
} from "../utils";
import createAuth0IdTokenPayload from "./helpers/Auth0IdTokenPayloadHelper";

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
    process.env.GATSBY_INTOUCH_ORIGIN = "https://fake";
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
    const result = transformToolCard(currentPageUrl, tools, mockGetMicroCopy);
    expect(result).toEqual([
      {
        icon: UserIcon,
        title: "Profile label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`
      },
      {
        icon: OtherTraining,
        title: "Training label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`
      },
      {
        icon: RoofMeasurement,
        title: "Roof measurement label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`
      }
    ]);
  });

  it("orders the returned array", () => {
    process.env.GATSBY_INTOUCH_ORIGIN = "https://fake";
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
    const result = transformToolCard(currentPageUrl, tools, mockGetMicroCopy);
    expect(result).toEqual([
      {
        icon: UserIcon,
        title: "Profile label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`
      },
      {
        icon: OtherTraining,
        title: "Training label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`
      },
      {
        icon: RoofMeasurement,
        title: "Roof measurement label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${
          process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT
        }?prev_page=${encodeURIComponent(currentPageUrl)}`
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