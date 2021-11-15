import { PoolClient } from "pg";
import { FindIncompleteCompanyProfile } from "@bmi/intouch-api-types";
import { sendMessageWithTemplate } from "../../services/mailer";
import { PostGraphileContext } from "../../types";

export const sendReminderToIncompleteCompanyProfile = async (
  resolve,
  args,
  context: PostGraphileContext,
  resolveInfo
): Promise<string> => {
  const { pgClient, user } = context;
  const logger = context.logger("sendReminder:company");
  const savepointName = "graphql_send_reminder_mutation";
  try {
    await pgClient.query(`SAVEPOINT ${savepointName}`);

    const accounts = await getIncompleteAccounts(pgClient, user.marketId);

    for (const account of accounts) {
      await sendMessageWithTemplate(context, "PROFILE_REMINDER", {
        email: account.email,
        firstname: [account.firstName, account.lastName]
          .filter(Boolean)
          .join(" "),
        accountId: account.id
      });
    }
    logger.info(`Email sent to the user which incomplete company profile`);

    return "success";
  } catch (error) {
    logger.error(
      "Error sending reminder to incomplete company profile:",
      error
    );
    await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
    throw error;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
  }
};

const getIncompleteAccounts = async (
  pgClient: PoolClient,
  markedId: string
): Promise<FindIncompleteCompanyProfile[]> => {
  const { rows } = await pgClient.query<FindIncompleteCompanyProfile>(
    `select * from find_incomplete_company_profiles where marketId=$1`,
    [markedId]
  );

  return rows;
};
