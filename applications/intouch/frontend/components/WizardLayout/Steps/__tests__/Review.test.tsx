import React from "react";
import { ProjectMember } from "@bmi/intouch-api-types";
import Review from "../Review";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";
import { generateProject } from "../../../../lib/tests/factories/project";
import { generateProduct } from "../../../../lib/tests/factories/product";
import { projectMembers } from "../../../../fixtures/projectMembers";
import { GetProjectQuery } from "../../../../graphql/generated/operations";

const useWizardContextSpy = jest.fn();
jest.mock("../../WizardContext", () => ({
  useWizardContext: () => useWizardContextSpy()
}));

const guaranteeType = {
  evidenceCategoriesCollection: {
    items: [
      {
        name: "Waterproofing",
        minimumUploads: 1,
        description: null
      },
      {
        name: "Drainage",
        description: {
          json: {}
        }
      }
    ]
  }
};

const mockSystem: GetProjectQuery["project"]["guarantees"]["nodes"][0]["systemBySystemBmiRef"] =
  {
    id: 1,
    name: "BMI-NO-PROD-001",
    description: "",
    systemMembersBySystemBmiRef: {
      nodes: [
        {
          id: 1,
          productByProductBmiRef: generateProduct()
        }
      ]
    }
  };

describe("Review", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("should render correct", () => {
    useWizardContextSpy.mockReturnValue({
      project: generateProject({
        projectMembers: {
          nodes: projectMembers
        }
      }),
      data: {
        guaranteeType: guaranteeType,
        guaranteeTemplate: {
          languageDescriptor: "EN"
        },
        product: generateProduct(),
        system: mockSystem,
        evidences: [
          {
            name: "test"
          }
        ]
      }
    });
    const { container } = renderWithI18NProvider(<Review />);
    expect(container).toMatchSnapshot();
    expect(useWizardContextSpy).toHaveBeenCalledTimes(1);
  });
  it("empty project members", () => {
    useWizardContextSpy.mockReturnValue({
      project: generateProject({
        projectMembers: null
      }),
      data: {
        guaranteeType: guaranteeType,
        guaranteeTemplate: {
          languageDescriptor: "EN"
        },
        system: null,
        evidences: [
          {
            name: "test"
          }
        ]
      }
    });
    const { container } = renderWithI18NProvider(<Review />);
    expect(container).toMatchSnapshot();
    expect(useWizardContextSpy).toHaveBeenCalledTimes(1);
  });
  it("installer is responsible", () => {
    const projectMember = {
      nodeId: "1",
      id: 1,
      createdAt: "01/01/01",
      updatedAt: "01/01/01",
      isResponsibleInstaller: true,
      account: {
        nodeId: "1",
        id: 1,
        firstName: "",
        lastName: "",
        role: "INSTALLER",
        certificationsByDoceboUserId: {
          nodes: [
            {
              nodeId: "1",
              id: 1,
              technology: "PITCHED",
              createdAt: "01/01/01",
              updatedAt: "01/01/01"
            }
          ]
        }
      }
    } as ProjectMember;
    useWizardContextSpy.mockReturnValue({
      project: generateProject({
        projectMembers: {
          nodes: [projectMember]
        }
      }),
      data: {
        guaranteeType: guaranteeType,
        guaranteeTemplate: {
          languageDescriptor: "EN"
        },
        system: {
          systemMembersBySystemBmiRef: {
            nodes: []
          }
        },
        evidences: [
          {
            name: "test"
          }
        ]
      }
    });
    const { container } = renderWithI18NProvider(<Review />);
    expect(container).toMatchSnapshot();
    expect(useWizardContextSpy).toHaveBeenCalledTimes(1);
  });
});
