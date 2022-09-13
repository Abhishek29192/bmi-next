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
    `SELECT market_id, building_owner_mail FROM guarantee g JOIN project p ON p.id = g.project_id JOIN account a ON a.id = g.requestor_account_id WHERE g.id = $1`,
    [guaranteeId]
  );
  const { rows: markets } = await pgClient.query(
    `SELECT * FROM market WHERE id = $1`,
    [guarantee.market_id]
  );

  if (context.user?.market) {
    context.user.market.domain = markets[0].domain;
  }

  await sendMessageWithTemplate(context, template, {
    email: guarantee.building_owner_mail,
    doubleAcceptanceLink: emailBody.tempToken
      ? `${protocol}://${getTargetDomain(
          markets[0].domain
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
          maximum_validity_years,
          language_code,
          coverage,
          id,
          signature,
          acceptance,
          technology
        }
      ]
    } = await pgRootPool.query(
      `SELECT d.*, p.maximum_validity_years, p.technology, g.language_code, g.coverage FROM double_acceptance d JOIN guarantee g ON g.id = d.guarantee_id JOIN product p ON g.product_bmi_ref = p.bmi_ref WHERE d.temp_token = $1`,
      [tempToken]
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
      rows: [
        {
          status,
          building_owner_mail,
          file_storage_id,
          product_name,
          system_name,
          coverage
        }
      ]
    } = await pgRootPool.query(
      `SELECT g.*, p.building_owner_mail, pt.name as product_name, s.name as system_name FROM guarantee g JOIN project p ON g.project_id = p.id JOIN product pt ON g.product_bmi_ref = pt.bmi_ref JOIN system s ON g.system_bmi_ref = s.bmi_ref WHERE g.id = $1`,
      [id]
    );
    const signedFileStorageUrl =
      await context.storageClient.getPrivateAssetSignedUrl(file_storage_id);
    const data = {
      id,
      status,
      project: {
        buildingOwnerMail: building_owner_mail
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
