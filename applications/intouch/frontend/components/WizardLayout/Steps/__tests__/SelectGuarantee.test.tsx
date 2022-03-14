import React from "react";
import { useMarketContext } from "../../../../context/MarketContext";
import { projectMembers } from "../../../../fixtures/projectMembers";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import { generateProduct } from "../../../../lib/tests/factories/product";
import { generateProject } from "../../../../lib/tests/factories/project";
import Apollo from "../../../../lib/tests/fixtures/apollo";
import I18nProvider from "../../../../lib/tests/fixtures/i18n";
import {
  fireEvent,
  renderWithThemeProvider,
  screen
} from "../../../../lib/tests/utils";
import SelectGuarantee from "../SelectGuarantee";

const useWizardContextSpy = jest.fn();
jest.mock("../../WizardContext", () => ({
  useWizardContext: () => useWizardContextSpy()
}));
jest.mock("../../../../context/MarketContext.tsx", () => ({
  useMarketContext: jest.fn()
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
    (useMarketContext as jest.Mock).mockImplementation(() => ({
      market: { id: 1, domain: "en" }
    }));
    useWizardContextSpy.mockReturnValue({
      project: mockProject,
      setData: jest.fn(),
      data: mockData
    });
    const { container } = renderWithThemeProvider(
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
    (useMarketContext as jest.Mock).mockImplementation(() => ({
      market: { id: 1, domain: "en" }
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
    renderWithThemeProvider(
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
    (useMarketContext as jest.Mock).mockImplementation(() => ({
      market: { id: 1, domain: "en" }
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
    renderWithThemeProvider(
      <Apollo>
        <I18nProvider>
          <SelectGuarantee />
        </I18nProvider>
      </Apollo>
    );
    expect(useWizardContextSpy).toHaveBeenCalledTimes(2);
  });
});
