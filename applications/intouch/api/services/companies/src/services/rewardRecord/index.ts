import { PostGraphileContext } from "../../types";

export const getCompanyRewardRecord = async (
  _query,
  args: { input },
  context: PostGraphileContext
) => {
  const { pgClient } = context;
  const logger = context.logger("service:rewardRecord");
  const { companyId, rewardEffectiveDate } = args.input;

  await pgClient.query("SAVEPOINT graphql_get_company_reward_record");

  try {
    const { rows: rewardRecords } = await pgClient.query(
      `SELECT * FROM reward_record WHERE company_id = $1 AND created_at > $2`,
      [companyId, rewardEffectiveDate]
    );
    const { rows: recordSummary } = await pgClient.query(
      `SELECT count(id) as total, SUM(reward_point) as points FROM reward_record WHERE company_id = $1 AND created_at > $2`,
      [companyId, rewardEffectiveDate]
    );

    return {
      total: recordSummary[0].total,
      points: recordSummary[0].points,
      records: rewardRecords.map(
        ({
          id,
          market_id: marketId,
          account_id: accountId,
          company_id: companyId,
          reward_tier: rewardTier,
          reward_point: rewardPoint,
          created_at: createdAt,
          updated_at: updatedAt
        }) => ({
          id,
          marketId,
          accountId,
          companyId,
          rewardTier,
          rewardPoint,
          createdAt,
          updatedAt
        })
      )
    };
  } catch (e) {
    const message = `Error fetching reward_record table for company with id ${companyId}, ${e}`;
    logger.error({ message });

    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_get_company_reward_record"
    );
    throw message;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_get_company_reward_record");
  }
};

export const addRewardRecord = async (
  _query,
  args: { input },
  context: PostGraphileContext
) => {
  const { pgClient } = context;
  const logger = context.logger("service:rewardRequest");
  const { accountId, rewardCategory } = args.input;

  await pgClient.query("SAVEPOINT graphql_create_reward_request");

  try {
    const {
      rows: [company]
    } = await pgClient.query(
      "SELECT c.tier, c.market_id, c.id FROM company_member m LEFT JOIN account a ON a.id = m.account_id JOIN company c ON m.company_id = c.id WHERE a.id = $1",
      [accountId]
    );

    if (company) {
      const {
        rows: [rewardTier]
      } = await pgClient.query(
        "SELECT id, reward_point FROM reward_tier WHERE reward_category = $1 AND tier_code = $2",
        [rewardCategory, company.tier]
      );

      if (rewardTier) {
        const {
          rows: [
            {
              id,
              market_id,
              account_id,
              company_id,
              reward_tier,
              reward_point,
              created_at,
              updated_at
            }
          ]
        } = await pgClient.query(
          "INSERT INTO reward_record (market_id, account_id, company_id, reward_tier, reward_point) VALUES ($1,$2,$3,$4,$5) RETURNING *",
          [
            company.market_id,
            accountId,
            company.id,
            rewardTier.id,
            rewardTier.reward_point
          ]
        );

        return {
          id,
          marketId: market_id,
          accountId: account_id,
          companyId: company_id,
          rewardTier: reward_tier,
          rewardPoint: reward_point,
          createdAt: created_at,
          updatedAt: updated_at
        };
      } else {
        const message = `No reward_tier found for rewardCategory ${rewardCategory} with tier ${company.tier}`;
        logger.error({
          message
        });
        return null;
      }
    } else {
      const message = `No company found for account with id ${accountId}`;
      logger.error({
        message
      });
      return null;
    }
  } catch (e) {
    const message = `Error creating record in reward_request table for account with id ${accountId}, ${e}`;
    logger.error({
      message
    });

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_create_reward_request");
    throw message;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_create_reward_request");
  }
};
