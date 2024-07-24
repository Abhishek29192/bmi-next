import { Data as ContactDetailsData } from "../../components/ContactDetails";
import type { Data as BreadcrumbsData } from "../../components/Breadcrumbs";
import type { Data as SiteData } from "../../components/Site";
import type { HeroProps } from "./Hero";
import type { Data as LinkData } from "../../components/link/types";

export type ServiceSupportSectionProps = {
  titleForServiceSupportSection: string;
  serviceSupportCards: [ContactDetailsData, ...ContactDetailsData[]];
};

export type GlobalTools = "My profile" | "Trainings" | "Roof measurement";

export type LocalToolType =
  | "Calculator"
  | "Company Profile"
  | "Guarantees"
  | "Team"
  | "Visualiser";

export type LocalTool = {
  title: string;
  type: LocalToolType;
  link: LinkData;
};

export type ToolSectionProps = {
  titleForToolSection: string;
  globalTools: readonly [GlobalTools, ...GlobalTools[]];
  tools: readonly [LocalTool, ...LocalTool[]] | null;
  path: string;
};

export type AccountPage = {
  title: string;
  breadcrumbTitle: string | null;
  breadcrumbs: BreadcrumbsData;
} & ToolSectionProps &
  Omit<ServiceSupportSectionProps, "serviceSupportCards"> &
  HeroProps & {
    path: string;
    serviceSupportCards:
      | ServiceSupportSectionProps["serviceSupportCards"]
      | null;
  };

export type SiteDataWithAccountPage = Omit<SiteData, "accountPage"> & {
  accountPage: AccountPage;
};
