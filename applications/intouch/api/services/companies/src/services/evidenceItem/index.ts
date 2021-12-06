import {
  DeleteEvidenceItemInput,
  EvidenceCategoryType,
  EvidenceItemsAddInput,
  RequestStatus
} from "@bmi/intouch-api-types";
import { FileUpload } from "graphql-upload";
import { PoolClient } from "pg";
import { companyDocumentsTypeValidate } from "../../utils/companyDocument";
import { PostGraphileContext } from "../../types";

export const evidenceItemsAdd = async (
  resolve,
  source,
  args: { input: EvidenceItemsAddInput },
  context,
  resolveInfo
) => {
  const { GCP_PRIVATE_BUCKET_NAME } = process.env;
  const { pgClient, logger: Logger, storageClient } = context;

  const logger = Logger("service:evidence");

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    const {
      input: { evidences }
    } = args;
    if (evidences.length > 0) {
      companyDocumentsTypeValidate(evidences.map((evidence) => evidence.name));

      for (const evidence of evidences) {
        const newFileName = `evidence/${evidence.projectId}/${
          evidence.evidenceCategoryType
        }-${Date.now()}`;

        const uploadedFile: FileUpload = await evidence.attachmentUpload;
        await storageClient.uploadFileByStream(
          GCP_PRIVATE_BUCKET_NAME,
          newFileName,
          uploadedFile
        );
        evidence.attachment = newFileName;
        evidence.name = uploadedFile.filename;
      }
    }
    return await resolve(source, args, context, resolveInfo);
  } catch (e) {
    logger.error("Error creating evidence");

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};

export const deleteEvidenceItem = async (
  resolve,
  source,
  args: { input: DeleteEvidenceItemInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { GCP_PRIVATE_BUCKET_NAME } = process.env;
  const { pgClient, logger: Logger, storageClient, user } = context;

  const logger = Logger("service:evidence");

  await pgClient.query("SAVEPOINT graphql_delete_evidence_mutation");

  try {
    const { id } = args.input;
    if (!user.can("delete:evidence")) {
      logger.error(
        `User with id: ${user.id} and role: ${user.role} is trying to delete evidence item ${id}`
      );
      throw new Error("unauthorized");
    }

    const evidenceDetail = await getEvidenceDetails(id, pgClient);

    //cannot delete PROOF_OF_PURCHASE evidence items once they are uploaded
    if (evidenceDetail.evidenceCategoryType === "PROOF_OF_PURCHASE") {
      throw new Error("You can not delete Proof of purchase evidences");
    }
    //Can not delete custom evidences if Guarantee status is in the REVIEW or APPROVED.
    if (
      evidenceDetail.evidenceCategoryType === "CUSTOM" &&
      ["REVIEW", "APPROVED"].includes(evidenceDetail.guaranteeStatus)
    ) {
      throw new Error(
        "You can't delete the evidence item which the guarantee status is in the REVIEW or APPROVED"
      );
    }

    const deletedEvidence = await resolve(source, args, context, resolveInfo);

    await storageClient.deleteFile(
      GCP_PRIVATE_BUCKET_NAME,
      evidenceDetail.attachment
    );
    return deletedEvidence;
  } catch (e) {
    logger.error("Error deleting evidence: ", e);

    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_delete_evidence_mutation"
    );
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_delete_evidence_mutation");
  }
};

const getEvidenceDetails = async (
  id: number,
  pgClient: PoolClient
): Promise<EvidenceDetail> => {
  const { rows } = await pgClient.query<EvidenceDetail>(
    `select evidence_item.id, evidence_item.evidence_category_type as "evidenceCategoryType",
    evidence_item.attachment, evidence_item.guarantee_id as "guaranteeId", guarantee.status as "guaranteeStatus" from evidence_item 
    left join guarantee on evidence_item.guarantee_id=guarantee.id 
    where evidence_item.id=$1
    `,
    [id]
  );
  if (!rows.length) {
    throw new Error("The evidence not exist");
  }

  return rows[0];
};

type EvidenceDetail = {
  id: number;
  evidenceCategoryType: EvidenceCategoryType;
  attachment: string;
  guaranteeId: number;
  guaranteeStatus: RequestStatus;
};
