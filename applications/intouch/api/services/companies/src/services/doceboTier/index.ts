import {} from "@bmi/intouch-api-types";
import { PostGraphileContext } from "../../types";

export const updateDoceboTiersByMarket = async (
  resolve,
  source,
  args: { input },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgClient } = context;
  const logger = context.logger("service:doceboTier");
  const { marketId, ...rest } = args.input;
  const catelogueIds = Object.entries(rest);
  const queryValues = catelogueIds
    .map((_, id) => `(${marketId}, '${catelogueIds[`${id}`][0]}', $${id + 1})`)
    .join(",");

  await pgClient.query("SAVEPOINT graphql_update_docebo_tiers");

  try {
    const { rows: doceboTiers } = await pgClient.query(
      `INSERT INTO docebo_tier (market_id, tier_code, docebo_catalogue_id) VALUES ${queryValues}
      ON CONFLICT (market_id, tier_code) DO UPDATE SET docebo_catalogue_id = EXCLUDED.docebo_catalogue_id RETURNING *`,
      catelogueIds.map((item) => item[1])
    );
    logger.info({
      message: `Sucessfully create or update docebo tier with id ${doceboTiers.map(
        ({ id }) => id
      )}`
    });
    return doceboTiers;
  } catch (e) {
    const message = `Error updating docebo_tier table for market with ${marketId}, ${e}`;
    logger.error({
      message
    });

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_update_docebo_tiers");
    throw message;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_update_docebo_tiers");
  }
};
