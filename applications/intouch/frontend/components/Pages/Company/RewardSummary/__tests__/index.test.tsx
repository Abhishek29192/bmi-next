import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { mockCompany } from "../../../../../fixtures/company";
import {
  screen,
  renderAsDeep,
  fireEvent,
  waitFor
} from "../../../../../lib/tests/utils";
import { RewardSummary } from "../";
import AccessControl from "../../../../../lib/permissions/AccessControl";

jest.mock("../../../../../lib/permissions/AccessControl", () => {
  const original = jest.requireActual(
    "../../../../../lib/permissions/AccessControl"
  );
  return {
    __esModule: true,
    default: jest.fn(original.default)
  };
});
const useGetCompanyRewardRecordMutationSpy = jest.fn();
const useCreateRewardRequestMutationSpy = jest.fn();
const useCreateRewardRequestMutationLoading = jest
  .fn()
  .mockImplementation(() => false);
const useGetRewardRequestsLazyQuerySpy = jest.fn();
jest.mock("../../../../../graphql/generated/hooks", () => ({
  useGetCompanyRewardRecordMutation: ({ onCompleted }) => [
    () => useGetCompanyRewardRecordMutationSpy({ onCompleted })
  ],
  useCreateRewardRequestMutation: ({ onCompleted }) => [
    ({ variables }) =>
      useCreateRewardRequestMutationSpy({ onCompleted, variables }),
    useCreateRewardRequestMutationLoading
  ],
  useGetRewardRequestsLazyQuery: ({ onCompleted }) => [
    () => useGetRewardRequestsLazyQuerySpy({ onCompleted })
  ]
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("RewardSummary", () => {
  const generateCompany = (data = {}) => ({ ...mockCompany, ...data });

  it("render correctly", () => {
    const { container } = renderAsDeep({
      market: { rewardEffectiveDate: "01-01-2022" },
      account: { role: "COMPANY_ADMIN" }
    })(<RewardSummary company={generateCompany()} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText("reward.title")).toBeTruthy();
    expect(screen.getByTestId("circular-progress")).toBeTruthy();
    expect(screen.getAllByTestId("linear-progress").length).toBe(4);
    expect(screen.getAllByText("reward.status.inProgress").length).toBe(1);
    expect(screen.getAllByText("reward.status.pending").length).toBe(3);
    expect(AccessControl).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        dataModel: "company",
        action: "viewReward",
        children: expect.anything()
      }),
      expect.anything()
    );
  });

  it("render different status correctly", () => {
    useGetCompanyRewardRecordMutationSpy.mockImplementationOnce(
      ({ onCompleted }) =>
        onCompleted({ getCompanyRewardRecord: { points: 500 } })
    );
    useGetRewardRequestsLazyQuerySpy.mockImplementationOnce(({ onCompleted }) =>
      onCompleted({
        rewardRequests: { nodes: [{ rewardPoint: 250 }] }
      })
    );
    renderAsDeep({
      market: { rewardEffectiveDate: "01-01-2022" },
      account: { role: "COMPANY_ADMIN" }
    })(<RewardSummary company={generateCompany()} />);

    expect(screen.getByText("50%")).toBeTruthy();
    expect(screen.getAllByText("reward.status.claimed").length).toBe(1);
    expect(screen.getAllByText("reward.status.completed").length).toBe(1);
    expect(screen.getAllByText("reward.status.inProgress").length).toBe(1);
    expect(screen.getAllByText("reward.status.pending").length).toBe(1);
  });

  it("onCloseClick", async () => {
    useGetCompanyRewardRecordMutationSpy.mockImplementationOnce(
      ({ onCompleted }) =>
        onCompleted({ getCompanyRewardRecord: { points: 250 } })
    );
    renderAsDeep({
      market: { rewardEffectiveDate: "01-01-2022" },
      account: { role: "COMPANY_ADMIN" }
    })(<RewardSummary company={generateCompany()} />);

    fireEvent.click(screen.getByText("reward.claimLabel"));
    fireEvent.click(screen.getByLabelText("Close"));

    await waitFor(() => {
      expect(screen.queryByText("reward.claimRewardDialog.title")).toBeFalsy();
    });
  });

  it("claim reward correctly", () => {
    useGetCompanyRewardRecordMutationSpy.mockImplementationOnce(
      ({ onCompleted }) =>
        onCompleted({ getCompanyRewardRecord: { points: 250 } })
    );
    useCreateRewardRequestMutationSpy.mockImplementationOnce(
      ({ onCompleted }) => onCompleted()
    );
    renderAsDeep({
      market: { rewardEffectiveDate: "01-01-2022" },
      account: { role: "COMPANY_ADMIN" }
    })(<RewardSummary company={generateCompany()} />);

    fireEvent.click(screen.getByText("reward.claimLabel"));

    expect(screen.getByText("reward.claimRewardDialog.title")).toBeTruthy();
    expect(
      screen.getByText("reward.claimRewardDialog.description")
    ).toBeTruthy();

    fireEvent.click(screen.getByText("reward.claimRewardDialog.confirmLabel"));

    expect(useCreateRewardRequestMutationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            rewardRequest: {
              marketId: 1,
              accountId: 1,
              companyId: 1,
              rewardPoint: 250
            }
          }
        }
      })
    );
    expect(
      screen.getByText("reward.claimRewardDialog.acknowledgement.title")
    ).toBeTruthy();
    expect(
      screen.getByText("reward.claimRewardDialog.acknowledgement.description")
    ).toBeTruthy();
  });

  it("Achieved beyond max point", async () => {
    useGetCompanyRewardRecordMutationSpy.mockImplementationOnce(
      ({ onCompleted }) =>
        onCompleted({ getCompanyRewardRecord: { points: 1250 } })
    );
    renderAsDeep({
      market: { rewardEffectiveDate: "01-01-2022" },
      account: { role: "COMPANY_ADMIN" }
    })(<RewardSummary company={generateCompany()} />);

    expect(screen.getByText("100%")).toBeTruthy();
  });
});
