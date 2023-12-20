import { microCopy } from "@bmi/microcopies";
import UserIcon from "@bmi-digital/components/icon/User";
import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import RoofMeasurement from "@bmi-digital/components/icon/RoofMeasurement";
import { ToolCardItemProps } from "@bmi-digital/components";
import { Auth0UserProfile } from "auth0-js";
import { GetMicroCopy } from "../../components/MicroCopy";

const nameTemplate = "{{name}}";
const roleTemplate = "{{role}}";

export const getUserInfo = (
  user: Auth0UserProfile | null,
  salutation: string,
  description: string
): { salutation: string; description: string } => {
  const res = { salutation: "", description: "" };
  res.salutation = salutation.replace(nameTemplate, user["name"]);
  res.description = description.replace(
    roleTemplate,
    user["https://intouch/intouch_role"]
  );
  return res;
};

export const transformToolCar = (
  tools: string[],
  getMicroCopy: GetMicroCopy
): [ToolCardItemProps, ...ToolCardItemProps[]] => {
  const transformTools: ToolCardItemProps[] = [];
  tools.forEach((tool: string) => {
    switch (tool) {
      case "My profile":
        return transformTools.splice(0, 0, {
          title: getMicroCopy(microCopy.PROFILE_LABEL),
          icon: UserIcon,
          url: `${process.env.GATSBY_INTOUCH_LOGIN_ENDPOINT}${process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT}`
        });

      case "Trainings":
        return transformTools.splice(1, 0, {
          title: getMicroCopy(microCopy.TRAINING_LABEL),
          icon: OtherTraining,
          url: `${process.env.GATSBY_INTOUCH_LOGIN_ENDPOINT}${process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT}`
        });

      case "Roof measurement":
        return transformTools.splice(2, 0, {
          title: getMicroCopy(microCopy.ROOF_MEASUREMENT_LABEL),
          icon: RoofMeasurement,
          url: `${process.env.GATSBY_INTOUCH_LOGIN_ENDPOINT}${process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT}`
        });

      default:
        return transformTools.push({
          title: "",
          icon: null,
          url: ""
        });
    }
  });
  return [transformTools[0], ...transformTools.slice(1)];
};
