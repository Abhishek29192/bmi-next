import { EvidenceItemsAddInput } from "@bmi/intouch-api-types";
import { FileUpload } from "graphql-upload";

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
    if (args.input.evidences.length > 0) {
      for (const evidence of args.input.evidences) {
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
