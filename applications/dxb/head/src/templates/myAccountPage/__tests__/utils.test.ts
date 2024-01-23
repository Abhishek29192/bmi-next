import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import RoofMeasurement from "@bmi-digital/components/icon/RoofMeasurement";
import UserIcon from "@bmi-digital/components/icon/User";
import { microCopy } from "@bmi/microcopies";
import { describe, it, jest } from "@jest/globals";
import { GetMicroCopy } from "../../../components/MicroCopy";
import { getUserInfo, transformToolCard } from "../utils";
import createAuth0IdTokenPayload from "./helpers/Auth0IdTokenPayloadHelper";

describe("getUserInfo", () => {
  it("should replace the name template", () => {
    const user = createAuth0IdTokenPayload();

    const userInfo = getUserInfo(
      user,
      "Hi {{name}}.",
      "You have the role {{role}}."
    );

    expect(userInfo.salutation).toEqual(
      `Hi ${user["https://intouch/first_name"]} ${user["https://intouch/last_name"]}.`
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
    const result = transformToolCard(tools, mockGetMicroCopy);
    expect(result).toEqual([
      {
        icon: UserIcon,
        title: "Profile label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT}`
      },
      {
        icon: OtherTraining,
        title: "Training label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT}`
      },
      {
        icon: RoofMeasurement,
        title: "Roof measurement label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT}`
      }
    ]);
  });

  it("orders the returned array", () => {
    process.env.GATSBY_INTOUCH_ORIGIN = "https://fake";
    process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT = "/profile";
    process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT = "/training";
    process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT = "/roof-measurement";
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
    const result = transformToolCard(tools, mockGetMicroCopy);
    expect(result).toEqual([
      {
        icon: UserIcon,
        title: "Profile label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT}`
      },
      {
        icon: OtherTraining,
        title: "Training label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT}`
      },
      {
        icon: RoofMeasurement,
        title: "Roof measurement label",
        url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT}`
      }
    ]);
  });
});
