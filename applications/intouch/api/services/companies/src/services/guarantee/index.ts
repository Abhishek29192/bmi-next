import crypto from "crypto";
import { FileUpload } from "graphql-upload";
import {
  CreateGuaranteeInput,
  EvidenceCategoryType,
  EvidenceItemGuaranteeIdFkeyInverseInput,
  Guarantee,
  Tier,
  UpdateGuaranteeInput
} from "@bmi/intouch-api-types";
import { PoolClient } from "pg";
import StorageClient from "../storage-client";
import { PostGraphileContext } from "../../types";
import { filesTypeValidate } from "../../utils/file";
import { sendMessageWithTemplate } from "../mailer";
import { EventMessage, tierBenefit } from "../contentful";
import { solutionGuaranteeSubmitValidate } from "./validate";

export const createGuarantee = async (
  resolve,
  source,
  args: { input: CreateGuaranteeInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgClient, logger: Logger, user } = context;

  const logger = Logger("service:guarantee");

  await pgClient.query("SAVEPOINT graphql_create_guarantee_mutation");

  try {
    const { guarantee } = args.input;
    const {
      projectId,
      coverage,
      evidenceItemsUsingId,
      productBmiRef,
      systemBmiRef
    } = guarantee;

    guarantee.requestorAccountId = +user.id;
    guarantee.bmiReferenceId = `${crypto.randomBytes(10).toString("hex")}`;
    guarantee.status = "NEW";

    await uploadEvidence(evidenceItemsUsingId, projectId);

    if (coverage !== "SOLUTION") {
      guarantee.status = "APPROVED";
      guarantee.startDate = new Date();
      guarantee.expiryDate = new Date();

      const max =
        coverage === "PRODUCT"
          ? await getProductMaximumValidityYears(productBmiRef, pgClient)
          : await getSystemMaximumValidityYears(systemBmiRef, pgClient);
      guarantee.expiryDate.setFullYear(
        guarantee.expiryDate.getFullYear() + max
      );
      await sendMail(context, projectId, "REQUEST_APPROVED");
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
  const { pgClient, logger: Logger, user, clientGateway } = context;

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
    const { status, projectId, systemBmiRef, bmiReferenceId } =
      await getGuarantee(id, pgClient);

    if (guaranteeEventType === "SUBMIT_SOLUTION") {
      const isValid = await solutionGuaranteeSubmitValidate(
        clientGateway,
        projectId
      );

      if (!isValid) {
        logger.error(
          `User with id: ${user.id} and role: ${user.role} is trying to submit guarantee ${args.input.id}`
        );
        throw new Error("Validation Error");
      }

      patch.requestorAccountId = +user.id;
      patch.bmiReferenceId =
        status === "NEW"
          ? `${crypto.randomBytes(10).toString("hex")}`
          : bmiReferenceId;
      patch.status = "SUBMITTED";
    }

    if (guaranteeEventType === "ASSIGN_SOLUTION" && status === "SUBMITTED") {
      patch.reviewerAccountId = +user.id;
      patch.status = "REVIEW";
    }

    if (guaranteeEventType === "REASSIGN_SOLUTION" && status === "REVIEW") {
      patch.reviewerAccountId = +user.id;
      patch.status = "REVIEW";
    }

    if (guaranteeEventType === "UNASSIGN_SOLUTION" && status === "REVIEW") {
      patch.reviewerAccountId = null;
      patch.status = "SUBMITTED";
    }

    if (guaranteeEventType === "APPROVE_SOLUTION" && status === "REVIEW") {
      patch.status = "APPROVED";

      patch.startDate = new Date();
      patch.expiryDate = new Date();

      const projectCompanyDetail = await getProjectCompanyDetail(
        projectId,
        pgClient
      );
      const { guaranteeValidityOffsetYears = 0 } = await tierBenefit(
        context.clientGateway,
        projectCompanyDetail.tier
      );

      const max = await getSystemMaximumValidityYears(systemBmiRef, pgClient);

      patch.expiryDate.setFullYear(
        patch.expiryDate.getFullYear() + max - guaranteeValidityOffsetYears
      );
      sendMail(context, projectId, "REQUEST_APPROVED");
    }

    if (guaranteeEventType === "REJECT_SOLUTION" && status === "REVIEW") {
      //TODO: The Requestor receives a message telling them that their request has been rejected.
      patch.reviewerAccountId = null;
      patch.status = "REJECTED";
      sendMail(context, projectId, "REQUEST_REJECTED");
    }
    return await resolve(source, args, context, resolveInfo);
  } catch (e) {
    logger.error("Error update guarantee:", e);

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
    `SELECT g.id, g.project_id as "projectId", g.system_bmi_ref as "systemBmiRef", 
    g.bmi_reference_id as "bmiReferenceId", g.status FROM guarantee g where g.id=$1`,
    [id]
  );
  if (!rows.length) {
    throw new Error("The guarantee not exist");
  }
  return rows[0];
};

const getProductMaximumValidityYears = async (
  bmiRef: string,
  pgClient: PoolClient
): Promise<number> => {
  const {
    rows: [{ maximum_validity_years }]
  } = await pgClient.query(
    `select product.maximum_validity_years from product
    where product.bmi_ref=$1`,
    [bmiRef]
  );
  return maximum_validity_years || 0;
};

const getSystemMaximumValidityYears = async (
  bmiRef: string,
  pgClient: PoolClient
): Promise<number> => {
  const {
    rows: [{ maximum_validity_years }]
  } = await pgClient.query(
    `Select system.maximum_validity_years from system
    where system.bmi_ref=$1`,
    [bmiRef]
  );
  return maximum_validity_years || 0;
};

const getProjectCompanyDetail = async (
  projectId: number,
  pgClient: PoolClient
): Promise<ProjectCompanyDetail> => {
  const { rows } = await pgClient.query(
    `select project.name, project.company_id as "companyId", company.tier
    from project
    join company on company.id=project.company_id 
    where project.id=$1`,
    [projectId]
  );

  if (!rows.length) {
    throw new Error("The project not exist");
  }
  return rows[0];
};

const sendMail = async (
  context: PostGraphileContext,
  projectId: number,
  event: EventMessage
) => {
  const { pgClient } = context;

  const projectCompanyDetail = await getProjectCompanyDetail(
    projectId,
    pgClient
  );

  //Get all company admins and send mail
  const { rows: accounts } = await pgClient.query(
    `select account.* from account 
  join company_member on company_member.account_id =account.id 
  where company_member.company_id=$1 and account.role='COMPANY_ADMIN'`,
    [projectCompanyDetail.companyId]
  );

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[+i];
    await sendMessageWithTemplate(context, event, {
      accountId: account.id,
      email: account.email,
      firstname: account.first_name,
      role: account.role,
      project: `${projectCompanyDetail.name}`,
      projectId
    });
  }
};

const uploadEvidence = async (
  evidenceItemInput: EvidenceItemGuaranteeIdFkeyInverseInput,
  projectId: number
) => {
  const { GCP_PRIVATE_BUCKET_NAME } = process.env;
  const evidenceCategoryType: EvidenceCategoryType = "PROOF_OF_PURCHASE";

  if (evidenceItemInput?.create?.length > 0) {
    await filesTypeValidate(
      evidenceItemInput.create.map((evidence) => evidence.attachmentUpload)
    );

    const storageClient = new StorageClient();
    for (const evidence of evidenceItemInput.create) {
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
};

type ProjectCompanyDetail = {
  name: string;
  companyId: number;
  tier: Tier;
};
