import merge from "lodash/merge";
import { Project } from "@bmi/intouch-api-types";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { DeepPartial } from "../../utils/types";
import { generateGuarantee } from "./guarantee";

const emptyNodes = {
  nodes: []
};

const defaultGuarantee = generateGuarantee();
const defaultProject: GetProjectQuery["project"] = {
  __typename: "Project",
  id: 1,
  evidenceItems: emptyNodes,
  name: "Project",
  notes: emptyNodes,
  projectMembers: emptyNodes,
  roofArea: 0,
  technology: "PITCHED",
  guarantees: {
    nodes: [defaultGuarantee]
  },
  company: {
    id: 1,
    tier: "T1"
  },
  siteAddress: {
    id: 1,
    country: "UK"
  },
  buildingOwnerMail: "buildingOwnerMail",
  buildingOwnerFirstname: "buildingOwnerFirstname",
  buildingOwnerLastname: "",
  buildingOwnerAddress: {
    id: 1
  },
  startDate: "12/12/2021",
  endDate: "12/12/2022"
};

export const generateProject = (
  project: DeepPartial<Project> = {}
): GetProjectQuery["project"] => merge(defaultProject, project);
