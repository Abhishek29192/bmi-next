import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import CompanyProfile from "@bmi-digital/components/icon/CompanyProfile";
import RoofMeasurement from "@bmi-digital/components/icon/RoofMeasurement";
import UserIcon from "@bmi-digital/components/icon/User";
import BMIGuarantees from "@bmi-digital/components/icon/BMIGuarantees";
import Calculator from "@bmi-digital/components/icon/Calculator";
import Visualiser from "@bmi-digital/components/icon/Visualiser";
import { microCopy } from "@bmi/microcopies";
import { isDefined } from "@bmi/utils";
import Team from "@bmi-digital/components/icon/Team";
import { toAnchorLinkActionProps } from "../../components/link/utils";
import type { ToolCardItemProps } from "@bmi-digital/components/tool-cards";
import type { GetMicroCopy } from "../../components/MicroCopy";
import type { Auth0IdTokenPayload } from "../../types/auth0";
import type { GlobalTools, LocalToolType, ToolSectionProps } from "./types";

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

export const transformGlobalTools = (
  currentPageUrl: string,
  tools: ToolSectionProps["globalTools"],
  getMicroCopy: GetMicroCopy
): [ToolCardItemProps, ...ToolCardItemProps[]] => {
  const sortedTools: [
    ToolCardItemProps | undefined,
    ToolCardItemProps | undefined,
    ToolCardItemProps | undefined
  ] = [undefined, undefined, undefined];
  tools.forEach((tool: GlobalTools): void => {
    switch (tool) {
      case "My profile":
        sortedTools[0] = {
          title: getMicroCopy(microCopy.PROFILE_LABEL),
          icon: UserIcon,
          href: getInTouchUrl(
            process.env.GATSBY_INTOUCH_MY_PROFILE_ENDPOINT!,
            currentPageUrl
          ),
          external: true
        };
        break;
      case "Trainings":
        sortedTools[1] = {
          title: getMicroCopy(microCopy.TRAINING_LABEL),
          icon: OtherTraining,
          href: getInTouchUrl(
            process.env.GATSBY_INTOUCH_TRAININGS_ENDPOINT!,
            currentPageUrl
          ),
          external: true
        };
        break;
      case "Roof measurement":
        sortedTools[2] = {
          title: getMicroCopy(microCopy.ROOF_MEASUREMENT_LABEL),
          icon: RoofMeasurement,
          href: getInTouchUrl(
            process.env.GATSBY_INTOUCH_ROOF_MEASUREMENTS_ENDPOINT!,
            currentPageUrl
          ),
          external: true
        };
    }
  });
  return sortedTools.filter(isDefined) as [
    ToolCardItemProps,
    ...ToolCardItemProps[]
  ];
};

const getInTouchUrl = (inTouchPageUrl: string, currentPageUrl: string) => {
  return `${
    process.env.GATSBY_INTOUCH_ORIGIN
  }${inTouchPageUrl}?prev_page=${encodeURIComponent(currentPageUrl)}`;
};

export const constructUrlWithPrevPage = (uri: string) => {
  const prevPage = `${window.location.origin}${window.location.pathname}`;
  return `${uri}?prev_page=${encodeURIComponent(prevPage)}`;
};

const getLocalToolCardIcon = (
  toolType: LocalToolType
): ToolCardItemProps["icon"] => {
  switch (toolType) {
    case "Calculator":
      return Calculator;
    case "Company Profile":
      return CompanyProfile;
    case "Guarantees":
      return BMIGuarantees;
    case "Team":
      return Team;
    default:
      return Visualiser;
  }
};

export const transformLocalTools = (
  tools: ToolSectionProps["tools"],
  countryCode: string
): ToolCardItemProps[] => {
  if (!tools) {
    return [];
  }

  return tools.map(({ link, title, type }) => ({
    icon: getLocalToolCardIcon(type),
    title,
    ...toAnchorLinkActionProps(link, countryCode)
  }));
};
