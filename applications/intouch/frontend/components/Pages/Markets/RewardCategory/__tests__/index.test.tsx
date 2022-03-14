import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { ThemeProvider } from "@bmi/components";
import { generateMarketContext } from "../../../../../lib/tests/factories/market";
import { screen, render } from "../../../../../lib/tests/utils";
import { RewardCategory } from "../";

const useQueryRewardTierByMarketIdLazyQuerySpy = jest.fn();
jest.mock("../../../../../graphql/generated/hooks", () => ({
  useQueryRewardTierByMarketIdLazyQuery: ({
    onCompleted,
    onError,
    variables
  }) => [
    () =>
      useQueryRewardTierByMarketIdLazyQuerySpy({
        onCompleted,
        onError,
        variables
      })
  ]
}));
const logSpy = jest.fn();
jest.mock("../../../../../lib/logger", () => (log) => logSpy(log));

const mockRewardCategoryForm = jest
  .fn()
  .mockReturnValue(
    <div data-testid="reward-category-form-mock">Reward Category From</div>
  );
jest.mock("../RewardCategoryForm", () => ({
  RewardCategoryForm: ({ ...props }) => mockRewardCategoryForm(props)
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("RewardCategory", () => {
  const generateRewardTierFactory = (data = {}) => ({
    id: 1,
    tierCode: "T1",
    rewardCategory: "rc1",
    rewardPoint: 10,
    ...data
  });

  it("render correctly", async () => {
    const market = generateMarketContext();
    const rewardTiers = [generateRewardTierFactory()];
    useQueryRewardTierByMarketIdLazyQuerySpy.mockImplementationOnce(
      ({ onCompleted }) => onCompleted({ rewardTiers: { nodes: rewardTiers } })
    );
    const { container } = render(
      <ThemeProvider>
        <RewardCategory market={market} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByText("Reward Category")).toBeTruthy();
    expect(screen.queryByTestId("reward-category-form-mock")).toBeTruthy();
    expect(useQueryRewardTierByMarketIdLazyQuerySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          marketId: market.id
        }
      })
    );
    Object.keys(rewardTiers).map((_, id) =>
      expect(mockRewardCategoryForm).toHaveBeenCalledWith(
        expect.objectContaining({
          category: rewardTiers[`${id}`].rewardCategory,
          data: rewardTiers,
          getRewardTiers: expect.anything()
        })
      )
    );
  });

  it("failed to get rewardTiers", async () => {
    const rewardEffectiveDate = "01-02-2022";
    const market = generateMarketContext({
      rewardEffectiveDate: rewardEffectiveDate
    });
    const message = "error Message";
    const error = new Error(message);
    useQueryRewardTierByMarketIdLazyQuerySpy.mockImplementationOnce(
      ({ onError }) => onError(error)
    );
    render(
      <ThemeProvider>
    <RewardCategory market={market} />
    </ThemeProvider>);

    expect(logSpy).toHaveBeenCalledWith({
      severity: "ERROR",
      message: `There was an error fetching reward tiers: ${error.toString()}`
    });
  });
});
