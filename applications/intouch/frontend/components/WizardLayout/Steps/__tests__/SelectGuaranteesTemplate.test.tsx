import React from "react";
import { render, within } from "@testing-library/react";
import SelectGuaranteesTemplate from "../SelectGuaranteesTemplate";
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
  guaranteeTemplateCollection: {
    items: [
      {
        sys: {
          id: 1
        },
        languageDescriptor: "test"
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

const mockProject = generateProject({
  projectMembers: {
    nodes: projectMembers
  }
});

const mockData = {
  guaranteeType,
  product: generateProduct(),
  system: mockSystem,
  evidences: [
    {
      name: "test"
    }
  ]
};

describe("SelectGuaranteesTemplate", () => {
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
      gotoNext: jest.fn(),
      gotoBack: jest.fn(),
      setData: jest.fn(),
      previousStep: 0,
      data: mockData
    });
    const { container } = render(
      <Apollo>
        <I18nProvider>
          <SelectGuaranteesTemplate />
        </I18nProvider>
      </Apollo>
    );
    expect(container).toMatchSnapshot();
    expect(useWizardContextSpy).toHaveBeenCalledTimes(2);
  });

  it("should proceed with GoBack button", () => {
    (useAccountContext as jest.Mock).mockImplementation(() => ({
      account: { id: 1, role: "COMPANY_ADMIN" }
    }));
    useWizardContextSpy.mockReturnValue({
      project: mockProject,
      gotoNext: jest.fn(),
      gotoBack: jest.fn(),
      setData: jest.fn(),
      previousStep: 1,
      data: mockData
    });
    render(
      <Apollo>
        <I18nProvider>
          <SelectGuaranteesTemplate />
        </I18nProvider>
      </Apollo>
    );

    const selectCompoEl = screen.getByTestId("templates-select");
    const button = within(selectCompoEl).getByRole("button");
    fireEvent.mouseDown(button);

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox"
    );
    const options = within(listbox).getAllByRole("option");
    fireEvent.click(options[0]);

    expect(useWizardContextSpy).toHaveBeenCalledTimes(2);
  });
});
