import crypto from "crypto";
import { FileUpload } from "graphql-upload";
import {
  CreateGuaranteeInput,
  EvidenceCategoryType,
  Guarantee,
  UpdateGuaranteeInput
} from "@bmi/intouch-api-types";
import { PoolClient } from "pg";
import StorageClient from "../storage-client";
import { PostGraphileContext } from "../../types";
import { sendEmailWithTemplate } from "../mailer";

export const createGuarantee = async (
  resolve,
  source,
  args: { input: CreateGuaranteeInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { GCP_PRIVATE_BUCKET_NAME } = process.env;
  const { pgClient, logger: Logger, user } = context;

  const logger = Logger("service:guarantee");

  await pgClient.query("SAVEPOINT graphql_create_guarantee_mutation");

  try {
    const { guarantee } = args.input;
    const { projectId, coverage, evidenceItemsUsingId } = guarantee;

    guarantee.requestorAccountId = +user.id;
    guarantee.bmiReferenceId = `${crypto.randomBytes(10).toString("hex")}`;
    guarantee.status = "NEW";

    const evidenceCategoryType: EvidenceCategoryType = "PROOF_OF_PURCHASE";

    if (evidenceItemsUsingId?.create?.length > 0) {
      const storageClient = new StorageClient();
      for (const evidence of evidenceItemsUsingId.create) {
        const uploadedFile: FileUpload = await evidence.attachmentUpload;
        evidence.name = uploadedFile.filename;
        evidence.projectId = projectId;
        evidence.evidenceCategoryType = evidenceCategoryType;
        evidence.attachment = `evidence/${projectId}/${evidenceCategoryType}-${Date.now()}`;

        await storageClient.uploadFileByStream(
          GCP_PRIVATE_BUCKET_NAME,
          evidence.attachment,
          uploadedFile
        );
      }
    }

    if (coverage !== "SOLUTION") {
      guarantee.status = "APPROVED";

      const {
        rows: [{ name: projectName }]
      } = await pgClient.query("select name from project where project.id=$1", [
        projectId
      ]);

      await sendEmailWithTemplate(context, "REQUEST_APPROVED", {
        email: user.email,
        firstname: user.firstName,
        role: user.role,
        project: `${projectName}`
      });

      //Get all company admins and send mail
      const { rows: accounts } = await pgClient.query(
        `select account.* from account 
      join company_member on company_member.account_id =account.id 
      where company_member.company_id=$1 and account.role='COMPANY_ADMIN'`,
        [user.company.id]
      );

      for (let i = 0; i < accounts?.length; i++) {
        const account = accounts[+i];
        await sendEmailWithTemplate(context, "REQUEST_APPROVED", {
          email: account.email,
          firstname: account.first_name,
          role: account.role,
          project: `${projectName}`
        });
      }
    }

    return await resolve(source, args, context, resolveInfo);
  } catch (e) {
    logger.error("Error creating guarantee evidence");

    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_create_guarantee_mutation"
    );
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_create_guarantee_mutation");
  }
};

export const updateGuarantee = async (
  resolve,
  source,
  args: { input: UpdateGuaranteeInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgClient, logger: Logger, user } = context;

  const logger = Logger("service:guarantee");

  await pgClient.query("SAVEPOINT graphql_update_guarantee_mutation");

  try {
    if (!user.can("update:guarantee")) {
      logger.error(
        `User with id: ${user.id} and role: ${user.role} is trying to update guarantee ${args.input.id}`
      );
      throw new Error("unauthorized");
    }

    const { id, patch, guaranteeEventType } = args.input;

    const currentGuarantee = await getGuarantee(id, pgClient);

    if (
      guaranteeEventType === "SUBMIT_SOLUTION" &&
      currentGuarantee.status === "NEW"
    ) {
      patch.requestorAccountId = +user.id;
      patch.bmiReferenceId = `${crypto.randomBytes(10).toString("hex")}`;
      patch.status = "SUBMITTED";
    }

    if (
      guaranteeEventType === "SUBMIT_SOLUTION" &&
      currentGuarantee.status === "REJECTED"
    ) {
      patch.requestorAccountId = +user.id;
      patch.status = "SUBMITTED";
    }

    if (
      guaranteeEventType === "ASSIGN_SOLUTION" &&
      currentGuarantee.status === "SUBMITTED"
    ) {
      patch.reviewerAccountId = +user.id;
      patch.status = "REVIEW";
    }

    if (
      guaranteeEventType === "REASSIGN_SOLUTION" &&
      currentGuarantee.status === "REVIEW"
    ) {
      patch.reviewerAccountId = +user.id;
      patch.status = "REVIEW";
    }

    if (
      guaranteeEventType === "UNASSIGN_SOLUTION" &&
      currentGuarantee.status === "REVIEW"
    ) {
      patch.reviewerAccountId = null;
      patch.status = "SUBMITTED";
    }

    if (
      guaranteeEventType === "APPROVE_SOLUTION" &&
      currentGuarantee.status === "REVIEW"
    ) {
      patch.status = "APPROVED";
    }
    if (
      guaranteeEventType === "REJECT_SOLUTION" &&
      currentGuarantee.status === "REVIEW"
    ) {
      //TODO: The Requestor receives a message telling them that their request has been rejected.
      patch.reviewerAccountId = null;
      patch.status = "REJECTED";
    }

    return await resolve(source, args, context, resolveInfo);
  } catch (e) {
    logger.error("Error update guarantee");

    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_update_guarantee_mutation"
    );
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_update_guarantee_mutation");
  }
};

const getGuarantee = async (
  id: number,
  pgClient: PoolClient
): Promise<Guarantee> => {
  const { rows } = await pgClient.query<Guarantee>(
    "SELECT guarantee.* FROM guarantee where guarantee.id=$1",
    [id]
  );
  //TODO:We have to map
  return rows[0];
};
