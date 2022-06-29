import merge from "lodash/merge";
import { Project } from "@bmi/intouch-api-types";
import {
  GetProjectQuery,
  GetProjectsQuery
} from "../../../graphql/generated/operations";
import { DeepPartial } from "../../utils/types";
import { generateGuarantee } from "./guarantee";

export type MockProject = Partial<
  | GetProjectQuery["project"]
  | {
      company?: Partial<GetProjectQuery["project"]["company"]>;
      guarantees?: Partial<GetProjectQuery["project"]["guarantees"]>;
      siteAddress?: Partial<GetProjectQuery["project"]["siteAddress"]>;
      buildingOwnerAddress?: Partial<
        GetProjectQuery["project"]["buildingOwnerAddress"]
      >;
    }
>;

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
    country: "UK",
    postcode: "12345"
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

export const projectFactory = (
  project: MockProject = {}
): GetProjectQuery["project"] => {
  const {
    company,
    guarantees,
    siteAddress,
    buildingOwnerAddress,
    ...restProject
  } = project;
  const {
    company: defaultCompany,
    guarantees: { nodes: defaultGuarantees },
    siteAddress: defaultSiteAddress,
    buildingOwnerAddress: defaultBuildingOwnerAddress,
    ...rest
  } = defaultProject;
  return {
    ...rest,
    ...restProject,
    company: { ...defaultProject.company, ...company },
    guarantees: {
      nodes: [...defaultGuarantees, ...(guarantees?.nodes || [])]
    },
    siteAddress: {
      ...defaultSiteAddress,
      ...siteAddress
    },
    buildingOwnerAddress: {
      ...defaultBuildingOwnerAddress,
      ...buildingOwnerAddress
    }
  };
};

export const ssrProjectFactory = (project: MockProject = {}) => {
  return {
    __typename: "ProjectsConnection",
    nodes: [{ ...projectFactory(project) }]
  } as GetProjectsQuery["projectsByMarket"];
};
