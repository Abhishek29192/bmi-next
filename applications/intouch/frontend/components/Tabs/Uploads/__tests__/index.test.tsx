import React, { useRef } from "react";
import { fireEvent, screen } from "@testing-library/react";
import { EvidenceCategoryType } from "@bmi/intouch-api-types";
import {
  renderWithI18NProvider,
  renderWithUserProvider
} from "../../../../lib/tests/utils";
import { generateProject } from "../../../../lib/tests/factories/project";
import { generateGuarantee } from "../../../../lib/tests/factories/guarantee";
import { generateAccount } from "../../../../lib/tests/factories/account";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import ApolloProvider from "../../../../lib/tests/fixtures/apollo";

import { UploadsTab } from "..";
import { GetProjectQuery } from "../../../../graphql/generated/operations";

jest.mock("@bmi-digital/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

const addEvidencesSpy = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useAddEvidencesMutation: () => [addEvidencesSpy, { loading: false }],
  useContentfulEvidenceCategoriesLazyQuery: () => [
    jest.fn(),
    { loading: false }
  ],
  useDeleteEvidenceItemMutation: () => [jest.fn(), { loading: false }]
}));

describe("Uploads Components", () => {
  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("render no uploads", () => {
    const project = generateProject();
    renderWithI18NProvider(
      <AccountContextWrapper>
        <UploadsTab project={project} />
      </AccountContextWrapper>
    );
    expect(screen.queryByTestId("uploads-item")).toBeFalsy();
    expect(screen.findByLabelText("upload_tab.noContent")).toBeTruthy();
  });
  describe("render correct categories", () => {
    it("MISCELLANEOUS category", () => {
      const project = generateProject();
      renderWithI18NProvider(
        <AccountContextWrapper>
          <UploadsTab project={project} />
        </AccountContextWrapper>
      );
      expect(screen.getByTestId("uploads-category")).toHaveTextContent(
        "MISCELLANEOUS"
      );
    });

    it("multiple categories", () => {
      const guarantee = generateGuarantee({
        status: "NEW",
        guaranteeType: {
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
        }
      });
      const project = generateProject({
        guarantees: {
          nodes: [guarantee]
        }
      });

      renderWithI18NProvider(
        <AccountContextWrapper>
          <UploadsTab project={project} />
        </AccountContextWrapper>
      );
      const allCategories = screen
        .getAllByTestId("uploads-category")
        .map((category) => category.textContent);
      expect(allCategories).toEqual([
        "Waterproofing",
        "Drainage",
        "MISCELLANEOUS"
      ]);
    });
    it("missing guaranteeType", () => {
      const emptyNodes = {
        nodes: []
      };
      const defaultProject: GetProjectQuery["project"] = {
        __typename: "Project",
        id: 1,
        evidenceItems: emptyNodes,
        name: "Project",
        notes: emptyNodes,
        projectMembers: emptyNodes,
        roofArea: 0,
        technology: "PITCHED",
        guarantees: null,
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

      renderWithI18NProvider(
        <AccountContextWrapper>
          <UploadsTab project={defaultProject} />
        </AccountContextWrapper>
      );
    });
  });
  describe("render correct number of upload", () => {
    it("none", () => {
      const project = generateProject();
      renderWithI18NProvider(
        <AccountContextWrapper>
          <UploadsTab project={project} />
        </AccountContextWrapper>
      );
      expect(screen.queryByTestId("uploads-item")).toBeNull();
    });

    it("multiple upload items", () => {
      const project = generateProject({
        evidenceItems: {
          nodes: [
            {
              id: 1,
              name: "450px-Interior_drain_replacement.jpg",
              signedUrl: "signedUrl",
              evidenceCategoryType: "MISCELLANEOUS",
              customEvidenceCategory: null
            },
            {
              id: 2,
              name: "450px-Interior_drain_replacement_2.pdf",
              signedUrl: "signedUrl",
              evidenceCategoryType: "MISCELLANEOUS",
              customEvidenceCategory: null
            },
            {
              id: 3,
              name: "name3",
              signedUrl: "signedUrl",
              evidenceCategoryType: "CUSTOM",
              customEvidenceCategory: {
                name: "name"
              }
            },
            {
              id: 4,
              name: "name4",
              signedUrl: "signedUrl",
              evidenceCategoryType: "CUSTOM"
            }
          ]
        }
      });
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper>
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(screen.getAllByTestId("uploads-item").length).toEqual(
        project.evidenceItems.nodes.length
      );
    });
  });
  describe("render delete button", () => {
    it("should not render delete button", () => {
      const project = generateProject();
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper>
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );
      expect(screen.queryByTestId("upload-item-delete")).toBeNull();
    });

    it("should render delete buttons", () => {
      const project = generateProject();
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper
            account={generateAccount({ role: "COMPANY_ADMIN" })}
          >
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );
      const deleteButtons = screen.getAllByTestId("upload-item-delete");
      fireEvent.click(deleteButtons[0]);
      expect(deleteButtons).toHaveLength(4);
    });
    it("should render required buttons", () => {
      const project = generateProject();
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper
            account={generateAccount({ role: "COMPANY_ADMIN" })}
          >
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );
      const requiredButtons = screen.getAllByText(
        "upload_tab.requirementModal.title"
      );
      fireEvent.click(requiredButtons[0]);
      fireEvent.click(screen.getAllByText("upload_tab.header")[1]);
      expect(requiredButtons).toHaveLength(1);
    });
    it("should render required buttons with missing categories data", () => {
      const guarantee = generateGuarantee({
        status: "NEW",
        guaranteeType: {
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
        }
      });
      const project = generateProject({
        guarantees: {
          nodes: [guarantee]
        }
      });
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper
            account={generateAccount({ role: "COMPANY_ADMIN" })}
          >
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );
      const requiredButtons = screen.getAllByText(
        "upload_tab.requirementModal.title"
      );
      fireEvent.click(requiredButtons[0]);
      expect(requiredButtons).toHaveLength(1);
    });
    it("should close required dialog", () => {
      const project = generateProject();
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper
            account={generateAccount({ role: "COMPANY_ADMIN" })}
          >
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );
      const requiredButtons = screen.getAllByText(
        "upload_tab.requirementModal.title"
      );
      fireEvent.click(requiredButtons[0]);
      const closeTags = screen.getAllByRole("button")[0].querySelector("svg");
      fireEvent.click(closeTags);
      expect(screen.getByTestId("requirement-modal-content")).not.toBeVisible();
    });
    it("should open carousel", () => {
      const project = generateProject();
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper
            account={generateAccount({ role: "COMPANY_ADMIN" })}
          >
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );
      const carouselButtons = screen.getAllByTestId("upload-item-view");
      fireEvent.click(carouselButtons[0]);

      const closeTag = screen.getAllByRole("button")[4].querySelector("svg");
      fireEvent.click(closeTag);
      const closeTagCarousel = screen
        .getAllByRole("button")[0]
        .querySelector("svg");
      fireEvent.click(closeTagCarousel);
      expect(carouselButtons).toHaveLength(4);
    });
  });
  describe("render evidence modal", () => {
    it("should open evidence modal", () => {
      const guarantee = generateGuarantee({
        coverage: "PRODUCT"
      });
      const project = generateProject({
        guarantees: {
          nodes: [guarantee]
        }
      });
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper>
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      fireEvent.click(screen.getByText("upload_tab.header"));
      screen.getByText("upload_tab.add_evidence_modal.confirm_label");

      const addEvidence = screen.queryByTestId("add-evidence");

      const files = [new File([], "name1", { type: "pdf" })];

      const evidenceCategoryType: EvidenceCategoryType = "MISCELLANEOUS";
      const customEvidenceCategoryKey: string = null;
      fireEvent.change(addEvidence, {
        target: {
          evidenceCategoryType,
          customEvidenceCategoryKey,
          files
        }
      });

      const confirmButton = screen.getByText(
        "upload_tab.add_evidence_modal.confirm_label"
      );
      fireEvent.click(confirmButton);
      expect(addEvidence).toBeTruthy();
    });
    it("should open evidence modal with missing current guaranty with coverage SOLUTION", () => {
      const guarantee = generateGuarantee({
        coverage: "SOLUTION"
      });
      const project = generateProject({
        guarantees: {
          nodes: [guarantee]
        }
      });
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper>
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      fireEvent.click(screen.getByText("upload_tab.header"));

      const addEvidence = screen.queryByTestId("add-evidence");
      expect(addEvidence).toBeTruthy();

      const files = [new File([], "name1", { type: "pdf" })];

      const evidenceCategoryType: EvidenceCategoryType = "MISCELLANEOUS";
      const customEvidenceCategoryKey: string = null;
      fireEvent.change(addEvidence, {
        target: {
          evidenceCategoryType,
          customEvidenceCategoryKey,
          files
        }
      });

      const confirmButton = screen.getByText(
        "upload_tab.add_evidence_modal.confirm_label"
      );
      confirmButton.click();
      expect(addEvidence).toBeTruthy();
      expect(addEvidencesSpy).toHaveBeenCalledWith({
        variables: {
          input: {
            evidences: [
              {
                attachment: "",
                attachmentUpload: expect.any(File),
                customEvidenceCategoryKey: null,
                evidenceCategoryType,
                guaranteeId: 1,
                projectId: 1,
                name: "name1",
                uploaderAccountId: 1
              }
            ]
          }
        }
      });
    });
    it("should open evidence modal with missing current guaranty", () => {
      const project = generateProject({
        guarantees: {
          nodes: [null]
        }
      });
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper>
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      fireEvent.click(screen.getByText("upload_tab.header"));

      const addEvidence = screen.queryByTestId("add-evidence");
      expect(addEvidence).toBeTruthy();

      const files = [new File([], "name1", { type: "pdf" })];

      const evidenceCategoryType: EvidenceCategoryType = "MISCELLANEOUS";
      const customEvidenceCategoryKey: string = null;
      fireEvent.change(addEvidence, {
        target: {
          evidenceCategoryType,
          customEvidenceCategoryKey,
          files
        }
      });

      const confirmButton = screen.getByText(
        "upload_tab.add_evidence_modal.confirm_label"
      );
      confirmButton.click();
      expect(addEvidence).toBeTruthy();
    });
    it("should open and close evidence modal", () => {
      const project = generateProject();
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper>
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      fireEvent.click(screen.getByText("upload_tab.header"));

      const closeTags = screen.getAllByRole("button")[0].querySelector("svg");
      fireEvent.click(closeTags);
      expect(
        screen.getByText("upload_tab.add_evidence_modal.confirm_label")
      ).not.toBeVisible();
    });
    it("should hide upload button when role is auditor", () => {
      const project = generateProject();
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={generateAccount({ role: "AUDITOR" })}>
            <UploadsTab project={project} />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(screen.queryByText("upload_tab.header")).toBeFalsy();
    });
  });
});
