import React from "react";
import { render } from "@testing-library/react";
import SelectGuarantee from "../SelectGuarantee";
import { generateProject } from "../../../../lib/tests/factories/project";
import { generateProduct } from "../../../../lib/tests/factories/product";
import { projectMembers } from "../../../../fixtures/projectMembers";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import { useAccountContext } from "../../../../context/AccountContext";
import Apollo from "../../../../lib/tests/fixtures/apollo";
import I18nProvider from "../../../../lib/tests/fixtures/i18n";
import { fireEvent, screen } from "../../../../lib/tests/utils";

const useWizardContextSpy = jest.fn();
jest.mock("../../WizardContext", () => ({
  useWizardContext: () => useWizardContextSpy()
}));
jest.mock("../../../../context/AccountContext", () => ({
  useAccountContext: jest.fn()
}));

const mockApolloData = {
  guaranteeTypeCollection: {
    items: [
      {
        sys: {
          id: 1
        },
        name: "test",
        displayName: "test",
        technology: "test",
        coverage: "SOLUTION",
        tiersAvailable: ["T1"]
      }
    ]
  }
};
jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useLazyQuery: (_, { onCompleted }) => [
    jest.fn(() => {
      onCompleted(mockApolloData);
    })
  ]
}));

const guaranteeType = {
  evidenceCategoriesCollection: {
    items: []
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

const mockProject = generateProject({
  projectMembers: {
    nodes: projectMembers
  },
  guarantees: {
    nodes: [
      {
        id: 1,
        guaranteeReferenceCode: "PITCHED_PRODUCT",
        languageCode: "EN",
        status: "APPROVED",
        guaranteeType: {
          coverage: "PRODUCT"
        }
      }
    ]
  }
});

const mockData = {
  guaranteeType,
  product: generateProduct(),
  system: mockSystem
};

describe("SelectGuarantee", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should render correct", () => {
    (useAccountContext as jest.Mock).mockImplementation(() => ({
      account: { id: 1, role: "COMPANY_ADMIN" }
    }));
    useWizardContextSpy.mockReturnValue({
      project: mockProject,
      setData: jest.fn(),
      data: mockData
    });
    const { container } = render(
      <Apollo>
        <I18nProvider>
          <SelectGuarantee />
        </I18nProvider>
      </Apollo>
    );
    expect(container).toMatchSnapshot();
    expect(useWizardContextSpy).toHaveBeenCalledTimes(2);
  });

  it("Case when product guarantee exists", () => {
    (useAccountContext as jest.Mock).mockImplementation(() => ({
      account: { id: 1, role: "COMPANY_ADMIN" }
    }));
    const mockProject = generateProject({
      projectMembers: {
        nodes: projectMembers
      },
      guarantees: {
        nodes: [
          {
            id: 1,
            guaranteeReferenceCode: "PITCHED_PRODUCT",
            languageCode: "EN",
            status: "APPROVED",
            guaranteeType: {
              coverage: "SOLUTION"
            }
          }
        ]
      }
    });
    useWizardContextSpy.mockReturnValue({
      project: mockProject,
      setData: jest.fn(),
      data: mockData
    });
    render(
      <Apollo>
        <I18nProvider>
          <SelectGuarantee />
        </I18nProvider>
      </Apollo>
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(useWizardContextSpy).toHaveBeenCalledTimes(2);
  });

  it("missing company tier case", () => {
    (useAccountContext as jest.Mock).mockImplementation(() => ({
      account: { id: 1, role: "COMPANY_ADMIN" }
    }));
    const mockProject = generateProject({
      projectMembers: {
        nodes: projectMembers
      },
      company: null,
      guarantees: {
        nodes: [
          {
            id: 1,
            guaranteeReferenceCode: "PITCHED_PRODUCT",
            languageCode: "EN",
            status: "APPROVED",
            guaranteeType: {
              coverage: "PRODUCT"
            }
          }
        ]
      }
    });
    useWizardContextSpy.mockReturnValue({
      project: mockProject,
      setData: jest.fn(),
      data: mockData
    });
    render(
      <Apollo>
        <I18nProvider>
          <SelectGuarantee />
        </I18nProvider>
      </Apollo>
    );
    expect(useWizardContextSpy).toHaveBeenCalledTimes(2);
  });
});
