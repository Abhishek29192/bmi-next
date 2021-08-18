import crypto from "crypto";
import { FileUpload } from "graphql-upload";
import {
  CreateGuaranteeInput,
  EvidenceCategoryType
} from "@bmi/intouch-api-types";
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
    args.input.guarantee.requestorAccountId = +user.id;
    args.input.guarantee.bmiReferenceId = `${crypto
      .randomBytes(10)
      .toString("hex")}`;

    const { projectId, evidenceItemsUsingId } = args.input.guarantee;

    const {
      rows: [{ name: projectName }]
    } = await pgClient.query("select name from project where project.id=$1", [
      projectId
    ]);

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
