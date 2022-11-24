import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, render, fireEvent } from "../../../../../lib/tests/utils";
import { RewardCategoryForm } from "../RewardCategoryForm";

const useUpdateRewardTiersMutationSpy = jest.fn();
const useUpdateRewardTiersMutationLoadingSpy = jest
  .fn()
  .mockImplementation(() => false);
jest.mock("../../../../../graphql/generated/hooks", () => ({
  useUpdateRewardTiersMutation: ({ onCompleted, onError }) => [
    ({ variables }) =>
      useUpdateRewardTiersMutationSpy({
        onCompleted,
        onError,
        variables
      }),
    useUpdateRewardTiersMutationLoadingSpy
  ]
}));
const logSpy = jest.fn();
jest.mock("../../../../../lib/logger", () => (log) => logSpy(log));

afterEach(() => {
  jest.clearAllMocks();
});

describe("RewardCategory", () => {
  const generateRewardTierFactory = (data = {}) => ({
    id: 1,
    tierCode: "T1" as const,
    rewardCategory: "rc1",
    rewardPoint: 10,
    ...data
  });

  const props = {
    category: "rc1",
    getRewardTiers: jest.fn()
  };

  describe("render correctly", () => {
    it("signle rewardTier", async () => {
      const rewardTiers = [generateRewardTierFactory()];
      const { container } = render(
        <RewardCategoryForm {...{ ...props, data: rewardTiers }} />
      );

      expect(container).toMatchSnapshot();
      expect(screen.queryByText(props.category)).toBeTruthy();
      expect(screen.queryByTestId("reward-category-btn-edit")).toBeTruthy();
      expect(screen.queryByText("Tier")).toBeTruthy();
      expect(screen.queryByText("Point Awarded")).toBeTruthy();
      expect(screen.queryByText(rewardTiers[0].tierCode)).toBeTruthy();
      expect(screen.queryByText(rewardTiers[0].rewardPoint)).toBeTruthy();
    });

    it("Multiple rewardTier", async () => {
      const rewardTiers = [
        generateRewardTierFactory(),
        generateRewardTierFactory({ tierCode: "T2", id: 2, rewardPoint: 5 })
      ];
      render(<RewardCategoryForm {...{ ...props, data: rewardTiers }} />);

      rewardTiers.map(({ tierCode, rewardPoint }) => {
        expect(screen.queryByText(tierCode)).toBeTruthy();
        expect(screen.queryByText(rewardPoint)).toBeTruthy();
      });
    });
  });

  describe("edit", () => {
    it("update rewardTier", async () => {
      const rewardTiers = [
        generateRewardTierFactory(),
        generateRewardTierFactory({ tierCode: "T2", id: 2, rewardPoint: 5 }),
        generateRewardTierFactory({ tierCode: "T3", id: 3, rewardPoint: null })
      ];
      useUpdateRewardTiersMutationSpy.mockImplementationOnce(
        ({ onCompleted }) => onCompleted()
      );
      const { container } = render(
        <RewardCategoryForm {...{ ...props, data: rewardTiers }} />
      );

      expect(screen.queryByText("edit")).toBeTruthy();

      fireEvent.click(screen.queryByTestId("reward-category-btn-edit"));

      expect(screen.queryByText("show")).toBeTruthy();

      rewardTiers.map(({ tierCode }, id) => {
        fireEvent.change(
          container.querySelector(
            `input[name="${props.category}-${tierCode}-reward-point"]`
          ),
          {
            target: {
              value: id
            }
          }
        );
      });
      fireEvent.click(screen.getByTestId("btn-save"));

      expect(useUpdateRewardTiersMutationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: {
              rewardTiers: rewardTiers.map(({ id }) => ({
                id,
                rewardPoint: id - 1
              }))
            }
          }
        })
      );
      expect(props.getRewardTiers).toHaveBeenCalledTimes(1);
    });

    it("failed to update rewardTier", async () => {
      const rewardTiers = [generateRewardTierFactory()];
      const message = "error Message";
      const error = new Error(message);
      useUpdateRewardTiersMutationSpy.mockImplementationOnce(({ onError }) =>
        onError(error)
      );
      const { container } = render(
        <RewardCategoryForm {...{ ...props, data: rewardTiers }} />
      );

      expect(screen.queryByText("edit")).toBeTruthy();

      fireEvent.click(screen.queryByTestId("reward-category-btn-edit"));

      expect(screen.queryByText("show")).toBeTruthy();

      rewardTiers.map(({ tierCode }, id) => {
        fireEvent.change(
          container.querySelector(
            `input[name="${props.category}-${tierCode}-reward-point"]`
          ),
          {
            target: {
              value: id
            }
          }
        );
      });
      fireEvent.click(screen.getByTestId("btn-save"));

      expect(logSpy).toHaveBeenCalledWith({
        severity: "ERROR",
        message: `There was an error updating reward tiers: ${error.toString()}`
      });
    });
  });
});
