import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@bmi/components";
import { QueryRewardTierByMarketIdQuery } from "../../../../graphql/generated/operations";
import { useQueryRewardTierByMarketIdLazyQuery } from "../../../../graphql/generated/hooks";
import log from "../../../../lib/logger";
import { MarketList } from "..";
import { RewardCategoryForm } from "./RewardCategoryForm";

export type RewardCategoryFormProps = {
  market: MarketList["nodes"][0];
};

export type RewardTier = {
  [key: string]: QueryRewardTierByMarketIdQuery["rewardTiers"]["nodes"];
};

export const RewardCategory = ({ market }: RewardCategoryFormProps) => {
  const [rewardCategories, setRewardCategories] = useState<RewardTier>(null);
  const [getRewardTiers] = useQueryRewardTierByMarketIdLazyQuery({
    variables: {
      marketId: market.id
    },
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error fetching reward tiers: ${error.toString()}`
      });
    },
    onCompleted: ({ rewardTiers: { nodes } }) => {
      const groupByRewardCategory = nodes.reduce((prev, cur) => {
        return {
          ...prev,
          [`${cur.rewardCategory}`]: [
            ...(prev[`${cur.rewardCategory}`] || []),
            cur
          ]
        };
      }, {});
      setRewardCategories(groupByRewardCategory);
    }
  });

  useEffect(() => {
    getRewardTiers();
  }, [getRewardTiers, market]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>
          Reward Category
        </Typography>
      </Grid>
      {rewardCategories &&
        Object.keys(rewardCategories).map((category) => (
          <RewardCategoryForm
            category={category}
            data={rewardCategories[`${category}`]}
            getRewardTiers={getRewardTiers}
            key={`reward-category-${category}`}
          />
        ))}
    </Grid>
  );
};
