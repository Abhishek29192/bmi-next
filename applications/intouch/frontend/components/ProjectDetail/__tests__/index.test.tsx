import React from "react";
import ProjectDetail from "..";
import { renderWithUserProvider, screen } from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";

const mockGetProjectQuery = jest.fn();
jest.mock("../../../graphql/generated/hooks", () => ({
  __esModule: true,
  GetProjectDocument: () => [jest.fn()],
  useCreateGuaranteePdfMutation: () => [jest.fn()],
  useGetProjectQuery: () => mockGetProjectQuery(),
  useUpdateGuaranteeMutation: () => [jest.fn()]
}));

jest.mock("../../../lib/logger", () => jest.fn());

describe("ProjectDetail component", () => {
  it("should show NoProjectsCard", () => {
    renderWithUserProvider(
      <AccountContextWrapper>
        <ProjectDetail projectId={null} />
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
        <ProjectDetail projectId={1} />
      </AccountContextWrapper>
    );
    expect(screen.getByText("projectDetails.loading")).toBeInTheDocument();
  });
  it("should show error", () => {
    mockGetProjectQuery.mockImplementation(() => ({
      data: { project: {} },
      loading: false,
      error: true
    }));

    renderWithUserProvider(
      <AccountContextWrapper>
        <ProjectDetail projectId={1} />
      </AccountContextWrapper>
    );
    expect(screen.getByText("projectDetails.error")).toBeInTheDocument();
  });
});
