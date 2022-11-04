import { PostGraphileContext } from "../../types";
import { sendMessageWithTemplate } from "../mailer";
import { getTargetDomain } from "../../utils/account";
import { EventMessage } from "../contentful";
import { publish, TOPICS } from "../../services/events";

const { FRONTEND_URL } = process.env;

const sendMessage = async (
  guaranteeId: number,
  context: PostGraphileContext,
  template: EventMessage,
  emailBody?: {
    tempToken?: string;
  }
) => {
  const { pgClient, protocol } = context;
  const {
    rows: [guarantee]
  } = await pgClient.query(
    `SELECT m.domain, p.building_owner_mail FROM guarantee g JOIN project p ON p.id = g.project_id JOIN company c ON c.id = p.company_id JOIN market m ON c.market_id = m.id WHERE g.id = $1`,
    [guaranteeId]
  );

  if (context.user?.market) {
    context.user.market.domain = guarantee.domain;
  }

  await sendMessageWithTemplate(context, template, {
    email: guarantee.building_owner_mail,
    doubleAcceptanceLink: emailBody.tempToken
      ? `${protocol}://${getTargetDomain(
          guarantee.domain
        )}.${FRONTEND_URL}/double-acceptance/${emailBody.tempToken}`
      : ""
  });
};

export const createDoubleAcceptance = async (
  resolve,
  source,
  args,
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgClient, logger: Logger } = context;
  const logger = Logger("service:double_acceptance");

  await pgClient.query("SAVEPOINT graphql_create_double_acceptance");

  try {
    const doubleAcceptance = await resolve(source, args, context, resolveInfo);

    await sendMessage(
      doubleAcceptance.data.$guaranteeId,
      context,
      "DOUBLE_ACCEPTANCE",
      {
        tempToken: doubleAcceptance.data.$tempToken
      }
    );

    return doubleAcceptance;
  } catch (e) {
    logger.error({
      message: `Error insert data into double_acceptance, ${e}`
    });

    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_create_double_acceptance"
    );
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_create_double_acceptance");
  }
};

export const updateDoubleAcceptance = async (
  resolve,
  source,
  args,
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgRootPool, logger: Logger } = context;
  const {
    input: {
      id,
      patch: { signature, acceptance, acceptanceDate }
    }
  } = args;
  const logger = Logger("service:double_acceptance");
  try {
    const {
      rows: [doubleAcceptance]
    } = await pgRootPool.query(
      `UPDATE double_acceptance SET signature=$1, acceptance=$2, acceptance_date=$3 WHERE id=$4 RETURNING *`,
      [signature, acceptance, acceptanceDate, id]
    );

    if (acceptance === false) {
      await pgRootPool.query(
        `UPDATE guarantee SET status=$1 WHERE id = $2 RETURNING id`,
        ["DECLINED", doubleAcceptance.guarantee_id]
      );
    }

    return { updateDoubleAcceptance: { doubleAcceptance } };
  } catch (e) {
    logger.error({
      message: `Error update data for double acceptance or related guarantee, ${e}`
    });
    throw e;
  }
};

export const getDoubleAcceptanceByValidTempToken = async (
  resolve,
  source,
  args,
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgRootPool, logger: Logger } = context;
  const {
    input: { tempToken }
  } = args;
  const logger = Logger("service:double_acceptance");

  try {
    const {
      rows: [
        {
          guarantee_id,
          temp_token,
          expiry_date,
          acceptance_date,
          language_code,
          coverage,
          technology,
          id,
          signature,
          acceptance
        }
      ]
    } = await pgRootPool.query(
      `SELECT d.*, g.language_code, g.coverage, p.technology FROM double_acceptance d JOIN guarantee g ON g.id = d.guarantee_id JOIN project p ON g.project_id = p.id WHERE d.temp_token = $1`,
      [tempToken]
    );

    const {
      rows: [{ maximum_validity_years }]
    } = await pgRootPool.query(
      `SELECT pt.maximum_validity_years FROM guarantee g JOIN product pt ON pt.bmi_ref = g.product_bmi_ref WHERE g.id = $1 UNION SELECT s.maximum_validity_years FROM guarantee g JOIN system s ON g.system_bmi_ref = s.bmi_ref WHERE g.id = $1`,
      [guarantee_id]
    );

    return {
      guaranteeId: guarantee_id,
      tempToken: temp_token,
      expiryDate: expiry_date,
      acceptanceDate: acceptance_date,
      maximumValidityYears: maximum_validity_years,
      languageCode: language_code,
      id,
      signature,
      acceptance,
      technology,
      coverage
    };
  } catch (e) {
    logger.error({
      message: `Error fetching double acceptance data, ${e}`
    });
    throw e;
  }
};

export const autoRejectDoubleAcceptance = async (
  resolve,
  source,
  args,
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgClient, logger: Logger } = context;
  const logger = Logger("service:double_acceptance");

  await pgClient.query("SAVEPOINT graphql_auto_reject_double_acceptance");

  try {
    const { rows } = await pgClient.query(
      `UPDATE double_acceptance SET acceptance=$1 WHERE expiry_date < NOW() AND signature is NULL RETURNING *`,
      [false]
    );

    if (rows.length) {
      await pgClient.query(
        `UPDATE guarantee SET status=$1 WHERE id in (${rows
          .map(({ guarantee_id }) => guarantee_id)
          .join(",")})`,
        ["EXPIRED"]
      );

      const message = `Double Acceptance(s) with id(s) ${rows.map(
        ({ id }) => id
      )} has been auto rejected and related guarantee(s) status have been set to EXPIRED`;
      logger.info({ message });

      return message;
    }
    const message = `No double Acceptance to be auto reject`;
    logger.info({ message });

    return message;
  } catch (e) {
    logger.error({
      message: `Error updating data for double acceptance, ${e}`
    });

    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_auto_reject_double_acceptance"
    );

    throw e;
  } finally {
    await pgClient.query(
      "RELEASE SAVEPOINT graphql_auto_reject_double_acceptance"
    );
  }
};

export const releaseGuaranteePdf = async (
  resolve,
  source,
  args,
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgRootPool, logger: Logger } = context;
  const {
    input: { id, template }
  } = args;
  const logger = Logger("service:double_acceptance");

  try {
    const {
      rows: [{ status, building_owner_mail, file_storage_id, coverage, domain }]
    } = await pgRootPool.query(
      `SELECT g.*, p.building_owner_mail, m.domain FROM guarantee g JOIN project p ON g.project_id = p.id JOIN company c ON p.company_id = c.id JOIN market m ON c.market_id = m.id WHERE g.id = $1`,
      [id]
    );

    const {
      rows: [{ system_name, product_name }]
    } = await pgRootPool.query(
      `SELECT g.system_bmi_ref as system_name, p.name as product_name FROM guarantee g JOIN product p ON p.bmi_ref = g.product_bmi_ref WHERE g.id = $1 UNION SELECT s.name as system_name, g.product_bmi_ref as product_name FROM guarantee g JOIN system_member sm ON g.system_bmi_ref = sm.system_bmi_ref JOIN system s ON sm.system_bmi_ref = s.bmi_ref WHERE g.id = $1`,
      [id]
    );

    await pgRootPool.query(`SELECT FROM guarantee g `, []);

    const signedFileStorageUrl =
      await context.storageClient.getPrivateAssetSignedUrl(file_storage_id);
    const data = {
      id,
      status,
      project: {
        buildingOwnerMail: building_owner_mail,
        company: {
          market: {
            domain
          }
        }
      },
      guaranteeType: {
        coverage,
        guaranteeTemplatesCollection: {
          items: [template]
        }
      },
      productByProductBmiRef: {
        name: product_name
      },
      systemBySystemBmiRef: {
        name: system_name
      },
      fileStorageId: file_storage_id,
      signedFileStorageUrl
    };

    const messageId = await publish(context, TOPICS.GUARANTEE_PDF, data);
    return { messageId };
  } catch (e) {
    logger.error({
      message: `Error getting guarantee data for release guarantee pdf, ${e}`
    });

    throw e;
  }
};
