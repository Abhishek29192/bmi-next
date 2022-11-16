import React from "react";
import "@testing-library/jest-dom/extend-expect";
import dayjs from "dayjs";
import { generateMarketContext } from "../../../../../lib/tests/factories/market";
import { screen, render, fireEvent } from "../../../../../lib/tests/utils";
import { RewardSystemForm } from "../";

const useUpdateMarketMutationSpy = jest.fn();
const useUpdateMarketMutationLoading = jest
  .fn()
  .mockImplementation(() => false);
jest.mock("../../../../../graphql/generated/hooks", () => ({
  useUpdateMarketMutation: ({ onCompleted, onError }) => [
    ({ variables }) =>
      useUpdateMarketMutationSpy({ onCompleted, onError, variables }),
    useUpdateMarketMutationLoading
  ]
}));
const logSpy = jest.fn();
jest.mock("../../../../../lib/logger", () => (log) => logSpy(log));

afterEach(() => {
  jest.clearAllMocks();
});

describe("RewardSummary", () => {
  const updatedMarketFactory = (data = {}) => ({
    updateMarket: {
      query: { markets: { nodes: [{ ...generateMarketContext(), ...data }] } }
    }
  });

  it("render correctly", async () => {
    const market = generateMarketContext();
    const { container } = render(<RewardSystemForm market={market} />);

    expect(container).toMatchSnapshot();
    expect(screen.queryByText("Reward System")).toBeTruthy();
    expect(screen.queryByTestId("reward-category-btn-edit")).toBeTruthy();
    expect(screen.queryByText("Reward System Enabled")).toBeTruthy();
    expect(screen.queryByText("enabled")).toBeTruthy();
    expect(screen.queryByText("Reward Effective Date")).toBeTruthy();
    expect(
      screen.queryByText(dayjs(market.rewardEffectiveDate).format("MM-DD-YYYY"))
    ).toBeTruthy();
  });

  describe("edit", () => {
    it("enable reward system", async () => {
      const market = generateMarketContext({ rewardEffectiveDate: null });
      const rewardEffectiveDate = "01-02-2022";
      useUpdateMarketMutationSpy.mockImplementationOnce(({ onCompleted }) =>
        onCompleted(
          updatedMarketFactory({ rewardEffectiveDate: rewardEffectiveDate })
        )
      );
      const { container } = render(<RewardSystemForm market={market} />);

      expect(screen.queryByText("edit")).toBeTruthy();
      expect(screen.queryByText("disabled")).toBeTruthy();

      fireEvent.click(screen.queryByTestId("reward-category-btn-edit"));

      expect(screen.queryByText("show")).toBeTruthy();
      expect(screen.queryByTestId("reward-system-form")).toBeTruthy();

      fireEvent.click(screen.queryByLabelText("Reward System Enabled"));

      const input = container.querySelector(
        "input[name='rewardEffectiveDate']"
      );
      expect(input).not.toBeDisabled();

      fireEvent.change(input, { target: { value: rewardEffectiveDate } });
      fireEvent.click(screen.queryByTestId("btn-save"));

      expect(useUpdateMarketMutationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: {
              id: market.id,
              patch: {
                rewardEffectiveDate: new Date(rewardEffectiveDate)
              }
            }
          }
        })
      );

      expect(screen.queryByText("edit")).toBeTruthy();
      expect(screen.queryByText("enabled")).toBeTruthy();
      expect(screen.queryByText(rewardEffectiveDate)).toBeTruthy();
    });

    it("disable reward system", async () => {
      const rewardEffectiveDate = "01-02-2022";
      const market = generateMarketContext({
        rewardEffectiveDate: rewardEffectiveDate
      });
      useUpdateMarketMutationSpy.mockImplementationOnce(({ onCompleted }) =>
        onCompleted(updatedMarketFactory({ rewardEffectiveDate: null }))
      );
      render(<RewardSystemForm market={market} />);

      fireEvent.click(screen.queryByTestId("reward-category-btn-edit"));
      fireEvent.click(screen.queryByLabelText("Reward System Enabled"));
      fireEvent.click(screen.queryByTestId("btn-save"));

      expect(useUpdateMarketMutationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: {
              id: market.id,
              patch: {
                rewardEffectiveDate: null
              }
            }
          }
        })
      );

      expect(screen.queryByText("edit")).toBeTruthy();
      expect(screen.queryByText("disabled")).toBeTruthy();
      expect(screen.queryByText("null")).toBeTruthy();
    });

    it("failed to update reward system", async () => {
      const rewardEffectiveDate = "01-02-2022";
      const market = generateMarketContext({
        rewardEffectiveDate: rewardEffectiveDate
      });
      const message = "error Message";
      const error = new Error(message);
      useUpdateMarketMutationSpy.mockImplementationOnce(({ onError }) =>
        onError(error)
      );
      render(<RewardSystemForm market={market} />);

      fireEvent.click(screen.queryByTestId("reward-category-btn-edit"));
      fireEvent.click(screen.queryByLabelText("Reward System Enabled"));
      fireEvent.click(screen.queryByTestId("btn-save"));

      expect(logSpy).toHaveBeenCalledWith({
        severity: "ERROR",
        message: `There was an error fetching reward tiers: ${error.toString()}`
      });
    });
  });
});
