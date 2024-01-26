import { ToolCardItemProps } from "@bmi-digital/components";
import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import RoofMeasurement from "@bmi-digital/components/icon/RoofMeasurement";
import UserIcon from "@bmi-digital/components/icon/User";
import { microCopy } from "@bmi/microcopies";
import { isDefined } from "@bmi/utils";
import { GetMicroCopy } from "../../components/MicroCopy";
import { Auth0IdTokenPayload } from "../../types/auth0";
import { AllowTools } from "./my-account";

const nameTemplate = "{{name}}";
const roleTemplate = "{{role}}";

export const getUserInfo = (
  user: Auth0IdTokenPayload,
  salutation: string,
  roleDescription: string
): { salutation: string; roleDescription: string } => ({
  salutation: salutation.replace(
    nameTemplate,
    `${user["https://intouch/first_name"]}`
  ),
  roleDescription: roleDescription.replace(
    roleTemplate,
    user["https://intouch/intouch_role"]
  )
});

export const transformToolCard = (
  tools: readonly [AllowTools, ...AllowTools[]],
  getMicroCopy: GetMicroCopy
): [ToolCardItemProps, ...ToolCardItemProps[]] => {
  const sortedTools: [
    ToolCardItemProps | undefined,
    ToolCardItemProps | undefined,
    ToolCardItemProps | undefined
  ] = [undefined, undefined, undefined];
  tools.forEach((tool: AllowTools): void => {
    switch (tool) {
      case "My profile":
        sortedTools[0] = {
          title: getMicroCopy(microCopy.PROFILE_LABEL),
          icon: UserIcon,
          url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT}`
        };
        break;
      case "Trainings":
        sortedTools[1] = {
          title: getMicroCopy(microCopy.TRAINING_LABEL),
          icon: OtherTraining,
          url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT}`
        };
        break;
      case "Roof measurement":
        sortedTools[2] = {
          title: getMicroCopy(microCopy.ROOF_MEASUREMENT_LABEL),
          icon: RoofMeasurement,
          url: `${process.env.GATSBY_INTOUCH_ORIGIN}${process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT}`
        };
    }
  });
  return sortedTools.filter(isDefined) as [
    ToolCardItemProps,
    ...ToolCardItemProps[]
  ];
};
