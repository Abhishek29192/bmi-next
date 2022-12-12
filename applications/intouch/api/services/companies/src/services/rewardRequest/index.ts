import { PostGraphileContext } from "../../types";
import {
  sendMessageWithTemplate,
  sendMailToMarketAdmins
} from "../../services/mailer";

export const createRewardRequest = async (
  resolve,
  source,
  args,
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgClient, logger: Logger } = context;
  const logger = Logger("service:reward_request");

  try {
    await pgClient.query("SAVEPOINT graphql_create_reward_request_mutation");

    const result = await resolve(source, args, context, resolveInfo);
    logger.info(
      `Reward request has been created for company with id: ${result.data.$companyId}`
    );
    const { rows: companyAdmins } = await pgClient.query(
      `SELECT a.*, c.name as company_name from account a JOIN company_member m on m.account_id = a.id JOIN company c ON m.company_id = c.id WHERE m.company_id=$1 and a.role=$2`,
      [result.data.$companyId, "COMPANY_ADMIN"]
    );
    const dynamicContent = {
      redemptionCode: result.data.$redemptionCode
    };

    await Promise.allSettled([
      ...companyAdmins.map(({ email, company_name }) => {
        return sendMessageWithTemplate(context, "REWARD_REQUESTED", {
          email,
          company: company_name,
          ...dynamicContent
        });
      })
    ]);

    await sendMailToMarketAdmins(context, "REWARD_REQUESTED", {
      ...dynamicContent
    });

    return result;
  } catch (error) {
    const message = `Error creating a reward request, ${error}`;
    logger.error({ message });

    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_create_reward_request_mutation"
    );

    throw message;
  } finally {
    await pgClient.query(
      "RELEASE SAVEPOINT graphql_create_reward_request_mutation"
    );
  }
};
