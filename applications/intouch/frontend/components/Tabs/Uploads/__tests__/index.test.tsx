import React, { useRef } from "react";
import { screen } from "@testing-library/react";
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

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

jest.mock("../../../../graphql/generated/hooks", () => ({
  useAddEvidencesMutation: () => [jest.fn(), { loading: false }],
  useContentfulEvidenceCategoriesLazyQuery: () => [
    jest.fn(),
    { loading: false }
  ],
  useDeleteEvidenceItemMutation: () => [jest.fn(), { loading: false }]
}));

describe("Uploads Components", () => {
  it("render no uploads", () => {
    const project = generateProject();
    renderWithI18NProvider(<UploadsTab project={project} />);
    expect(screen.queryByTestId("uploads-item")).toBeFalsy();
    expect(screen.findByLabelText("upload_tab.noContent")).toBeTruthy();
  });
  describe("render correct categories", () => {
    it("MISCELLANEOUS category", () => {
      const project = generateProject();
      renderWithI18NProvider(<UploadsTab project={project} />);
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
                name: "Waterproofing"
              },
              {
                name: "Drainage"
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

      renderWithI18NProvider(<UploadsTab project={project} />);
      const allCategories = screen
        .getAllByTestId("uploads-category")
        .map((category) => category.textContent);
      expect(allCategories).toEqual([
        "Waterproofing",
        "Drainage",
        "MISCELLANEOUS"
      ]);
    });
  });
  describe("render correct number of upload", () => {
    it("none", () => {
      const project = generateProject();
      renderWithI18NProvider(<UploadsTab project={project} />);
      expect(screen.queryByTestId("uploads-item")).toBeNull();
    });

    it("multiple upload items", () => {
      const project = generateProject({
        evidenceItems: {
          nodes: [
            {
              id: 1,
              name: "name",
              signedUrl: "signedUrl",
              evidenceCategoryType: "MISCELLANEOUS",
              customEvidenceCategory: null
            },
            {
              id: 2,
              name: "name2",
              signedUrl: "signedUrl",
              evidenceCategoryType: "MISCELLANEOUS",
              customEvidenceCategory: null
            },
            {
              id: 3,
              name: "name3",
              signedUrl: "signedUrl",
              evidenceCategoryType: "CUSTOM",
              customEvidenceCategory: null
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
      expect(screen.getAllByTestId("upload-item-delete")).toHaveLength(3);
    });
  });
});
