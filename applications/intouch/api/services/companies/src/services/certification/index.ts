import format from "pg-format";
import { PostGraphileContext } from "../../types";

export const truncateAndInsertCertification = async (
  _query,
  args: { input },
  context: PostGraphileContext,
  resolveInfo,
  auth0
) => {
  const { pgClient } = context;
  const logger = context.logger("service:certification");
  const { certificates } = args.input;
  const savepointName = "graphql_truncate_and_insert_certification_mutation";

  try {
    await pgClient.query(`SAVEPOINT ${savepointName}`);
    if (certificates.length) {
      const result = await pgClient.query(
        format(
          `TRUNCATE TABLE certification; INSERT INTO certification (docebo_user_id,technology,name,expiry_date) VALUES %L RETURNING *;`,
          certificates.map(({ userId, code, title, toNewIn }) => [
            userId,
            code,
            title,
            toNewIn
          ])
        )
      );
      if (result[1].rows.length) {
        const message = `Certificate table has truncated and ${result[1].rows.length} certificates have been inserted`;
        logger.info({ message });

        return message;
      }
    } else {
      const message = `No certificate to be inserted`;
      logger.info({ message });

      return message;
    }
  } catch (error) {
    logger.info(`Failed to tuncate and insert certifications`);
    await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);

    throw error;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
  }
};
