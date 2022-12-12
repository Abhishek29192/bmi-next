import format from "pg-format";
import { PostGraphileContext } from "../../types";
import { addRewardRecord } from "../rewardRecord";

export const addRewardPointByNewAwardedCertificate = async (
  _query,
  args: { input },
  context: PostGraphileContext
) => {
  const { pgClient } = context;
  const logger = context.logger("service:certification");
  const { certificates } = args.input;
  const savepointName =
    "graphql_add_reward_point_by_new_awarded_certificate_mutation";

  try {
    await pgClient.query(`SAVEPOINT ${savepointName}`);
    const { rows: dbCertificates } = await pgClient.query(
      `SELECT * FROM certification`
    );
    const dbCertificationByDoceboUserId = dbCertificates.reduce(
      (acc, cur) => ({
        ...acc,
        [`${cur.docebo_user_id}`]: [
          ...(acc?.[`${cur.docebo_user_id}`] || []),
          cur
        ]
      }),
      {}
    );
    const newAwardedCertificates = certificates.filter(({ userId, title }) => {
      return dbCertificationByDoceboUserId[`${userId}`]
        ? !dbCertificationByDoceboUserId[`${userId}`].some(
            ({ name }) => name === title
          )
        : true;
    });
    const { rows: accounts } = await pgClient.query(
      `SELECT * FROM account WHERE docebo_user_id in (${newAwardedCertificates.map(
        (_, id) => `$${id + 1}`
      )})`,
      newAwardedCertificates.map(({ userId }) => userId)
    );
    await Promise.allSettled([
      ...newAwardedCertificates.map(({ userId }) =>
        addRewardRecord(
          null,
          {
            input: {
              accountId: accounts.find(
                ({ docebo_user_id }) => docebo_user_id === parseInt(userId)
              ).id,
              rewardCategory: "rc2"
            }
          },
          context
        )
      )
    ]).then((value) => {
      value.map((result) => {
        if (result.status === "rejected") {
          logger.error({
            message: `Failed to add reward point, ${result.reason}`
          });
        }
      });
    });

    return "ok";
  } catch (error) {
    logger.info(`Failed to add reward point based on new awarded certificates`);
    await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);

    throw error;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
  }
};

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
    await addRewardPointByNewAwardedCertificate(_query, args, context);
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
