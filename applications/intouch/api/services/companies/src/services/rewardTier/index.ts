import { PostGraphileContext } from "../../types";

export const updateRewardTiers = async (
  _query,
  args: { input },
  context: PostGraphileContext
) => {
  const { pgClient } = context;
  const logger = context.logger("service:rewardTier");
  const { rewardTiers } = args.input;

  await pgClient.query("SAVEPOINT graphql_update_reward_tiers");

  try {
    const { rows } = await pgClient.query(
      `UPDATE reward_tier as r set id = c.id, reward_point = c.reward_point from (values ${rewardTiers
        .map(({ id, rewardPoint }) => `(${id}, ${rewardPoint})`)
        .join(",")}) AS c(id, reward_point) WHERE c.id = r.id RETURNING r.*`
    );
    return rows.map(
      ({
        id,
        market_id,
        reward_category,
        reward_point,
        tier_code,
        created_at,
        updated_at
      }) => ({
        id,
        marketId: market_id,
        rewardCategory: reward_category,
        rewardPoint: reward_point,
        tierCode: tier_code,
        createdAt: created_at,
        updatedAt: updated_at
      })
    );
  } catch (e) {
    const message = `Error updating reward_tier table for reward_category(${rewardTiers[0].rewardCategory}), ${e}`;
    logger.error({
      message
    });

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_update_reward_tiers");
    throw message;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_update_reward_tiers");
  }
};
