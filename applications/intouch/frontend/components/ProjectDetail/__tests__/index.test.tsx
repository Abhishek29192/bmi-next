import React from "react";
import { fireEvent, waitFor, render } from "@testing-library/react";
import ProjectDetail from "..";
import { renderWithUserProvider, screen } from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import { generateProject } from "../../../lib/tests/factories/project";
import { generateGuarantee } from "../../../lib/tests/factories/guarantee";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { generateProduct } from "../../../lib/tests/factories/product";
import { generateAccount } from "../../../lib/tests/factories/account";

const mockGetProjectQuery = jest.fn();
const mockOnUpdateGuaranteeSpy = jest.fn();

const startPollingSpy = jest.fn();
const stopPollingSpy = jest.fn();

jest.mock("../../../graphql/generated/hooks", () => ({
  __esModule: false,
  useCreateGuaranteePdfMutation: () => [jest.fn()],
  useGetProjectQuery: ({ onCompleted }) => mockGetProjectQuery(onCompleted),
  useUpdateGuaranteeMutation: ({ onCompleted, onError }) => [
    jest.fn(() => {
      onError({ message: "error" });
      onCompleted({
        updateGuarantee: { guarantee: { status: "APPROVED", id: 1 } }
      });
    }),
    { loading: false }
  ],
  useAddEvidencesMutation: () => [jest.fn(), { loading: false }],
  useDeleteEvidenceItemMutation: () => [jest.fn(), { loading: false }],
  useCreateGuaranteeMutation: () => [jest.fn(), { loading: false }],
  useDeleteProjectMemberMutation: () => [jest.fn(), { loading: false }],
  useAddProjectsMemberMutation: () => [jest.fn(), { loading: false }],
  useGetProjectCompanyMembersLazyQuery: () => [jest.fn(), { loading: false }],
  useUpdateProjectMemberMutation: () => [jest.fn(), { loading: false }],
  useCreateProjectMutation: () => [jest.fn(), { loading: false }],
  useUpdateProjectHiddenMutation: () => [jest.fn(), { loading: false }],
  useAddProjectNoteMutation: () => [jest.fn(), { loading: false }],
  useRestartGuaranteeMutation: () => [jest.fn(), { loading: false }],
  useUpdateProjectMutation: () => [jest.fn(), { loading: false }],
  useUpdateProjectInspectionMutation: () => [jest.fn(), { loading: false }]
}));

const logSpy = jest.fn();
jest.mock("../../../lib/logger", () => (log) => logSpy(log));

const getProjectsCallBackSpy = jest.fn();
const useProjectPageContextSpy = jest.fn();
jest.mock("../../../context/ProjectPageContext", () => ({
  useProjectPageContext: () => useProjectPageContextSpy()
}));

const emptyNodes = {
  nodes: []
};

const product = generateProduct();

const mockSystem: GetProjectQuery["project"]["guarantees"]["nodes"][0]["systemBySystemBmiRef"] =
  {
    id: 1,
    name: "BMI-NO-PROD-001",
    description: "",
    systemMembersBySystemBmiRef: {
      nodes: [
        {
          id: 1,
          productByProductBmiRef: product
        }
      ]
    }
  };

const guarantee = generateGuarantee({
  id: 1,
  status: "REVIEW",
  guaranteeType: {
    coverage: "SOLUTION",
    tiersAvailable: ["T1"]
  },
  coverage: "SOLUTION",
  systemBySystemBmiRef: mockSystem,
  reviewerAccountId: 1,
  signedFileStorageUrl: null,
  guaranteeReferenceCode: null
});

const project = generateProject({
  guarantees: {
    nodes: [guarantee]
  },
  notes: {
    nodes: [
      {
        id: 1,
        body: "note body"
      }
    ]
  },
  evidenceItems: {
    nodes: [
      {
        id: 1,
        name: "450px-Interior_drain_replacement.jpg",
        signedUrl: "signedUrl",
        evidenceCategoryType: "MISCELLANEOUS",
        customEvidenceCategory: null
      }
    ]
  }
});

describe("ProjectDetail component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    useProjectPageContextSpy.mockReturnValue({
      getProjectsCallBack: () => getProjectsCallBackSpy()
    });
  });

  it("should show NoProjectsCard", () => {
    renderWithUserProvider(
      <AccountContextWrapper>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={null}
        />
      </AccountContextWrapper>
    );
    expect(screen.getByText("noProjecSelected.body2")).toBeInTheDocument();
  });
  it("should show loading", () => {
    mockGetProjectQuery.mockImplementation(() => ({
      data: { project: null },
      loading: true,
      error: false
    }));

    renderWithUserProvider(
      <AccountContextWrapper>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={1}
        />
      </AccountContextWrapper>
    );
    expect(screen.getByText("projectDetails.loading")).toBeInTheDocument();
  });
  it("should show error", () => {
    mockGetProjectQuery.mockImplementation(() => ({
      loading: false,
      error: true
    }));

    renderWithUserProvider(
      <AccountContextWrapper>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={1}
        />
      </AccountContextWrapper>
    );
    expect(screen.getByText("projectDetails.error")).toBeInTheDocument();
  });
  it("should show project details", () => {
    mockGetProjectQuery.mockImplementation(() => ({
      data: { project: project },
      loading: false,
      error: false
    }));

    renderWithUserProvider(
      <AccountContextWrapper>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={project.id}
        />
      </AccountContextWrapper>
    );
    expect(screen.getByText("projectDetails.roofArea")).toBeInTheDocument();
  });
  it("test memo", () => {
    mockGetProjectQuery.mockImplementation(() => ({
      data: { project: project },
      loading: false,
      error: false
    }));

    const res = render(
      <AccountContextWrapper>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={project.id}
        />
      </AccountContextWrapper>
    );
    project.id = 2;
    res.rerender(
      <AccountContextWrapper>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={project.id}
        />
      </AccountContextWrapper>
    );
    res.rerender(
      <AccountContextWrapper>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={project.id}
        />
      </AccountContextWrapper>
    );
    expect(screen.getByText("projectDetails.roofArea")).toBeInTheDocument();
  });
  it("update guarantee details", async () => {
    mockGetProjectQuery.mockImplementation((onCompleted) => {
      setTimeout(() => {
        onCompleted({ project });
        project.guarantees.nodes[0].signedFileStorageUrl = "url";
        project.guarantees.nodes[0].guaranteeReferenceCode = "PITCHED_SOLUTION";
        setTimeout(() => onCompleted({ project }), 500);
      }, 500);
      return {
        data: { project },
        loading: false,
        error: false,
        startPolling: startPollingSpy,
        stopPolling: stopPollingSpy
      };
    });

    renderWithUserProvider(
      <AccountContextWrapper account={generateAccount({ role: "SUPER_ADMIN" })}>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={project.id}
        />
      </AccountContextWrapper>
    );

    const guaranteeEventButton = screen.getByTestId("guarantee-event-button");
    fireEvent.click(guaranteeEventButton);

    const guaranteeEventButtonBottom = screen.getByText(
      "projectActions.cta.approveGuarantee"
    );
    fireEvent.click(guaranteeEventButtonBottom);

    await waitFor(() => expect(startPollingSpy).toBeCalled());
    await waitFor(() => expect(stopPollingSpy).toBeCalled());

    expect(screen.getByText("projectDetails.roofArea")).toBeInTheDocument();
  });
  it("empty guarantee", () => {
    const project = {
      id: 1,
      name: "test",
      roofArea: 0,
      technology: "PITCHED",
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
      endDate: "12/12/2022",
      guarantees: emptyNodes,
      projectMembers: emptyNodes,
      notes: emptyNodes,
      evidenceItems: emptyNodes
    };
    mockGetProjectQuery.mockImplementation(() => ({
      data: { project: project },
      loading: false,
      error: false
    }));

    renderWithUserProvider(
      <AccountContextWrapper>
        <ProjectDetail
          onUpdateGuarantee={mockOnUpdateGuaranteeSpy}
          projectId={project.id}
        />
      </AccountContextWrapper>
    );

    expect(screen.getByText("projectDetails.roofArea")).toBeInTheDocument();
  });
});
