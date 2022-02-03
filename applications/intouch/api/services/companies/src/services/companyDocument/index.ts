import {
  CompanyDocument,
  CreateCompanyDocumentsInput,
  DeleteCompanyDocumentInput
} from "@bmi/intouch-api-types";
import { FileUpload } from "graphql-upload";
import { PoolClient } from "pg";
import { filesTypeValidate } from "../../utils/file";
import { PostGraphileContext } from "../../types";

export const createCompanyDocuments = async (
  resolve,
  source,
  args: { input: CreateCompanyDocumentsInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { GCP_PRIVATE_BUCKET_NAME } = process.env;
  const { pgClient, logger: Logger, storageClient, user } = context;

  const logger = Logger("service:companyDocuments");
  const savepoint = "graphql_createCompanyDocuments_mutation";

  await pgClient.query(`SAVEPOINT ${savepoint}`);

  try {
    if (!user.can("add:companyDocument")) {
      logger.error(
        `User with id: ${user.id} and role: ${user.role} is trying to add company document`
      );
      throw new Error("unauthorized");
    }

    if (args.input.documents.length > 0) {
      await filesTypeValidate(
        args.input.documents.map((doc) => doc.attachmentUpload)
      );

      for (const document of args.input.documents) {
        const uploadedFile: FileUpload = await document.attachmentUpload;

        const newFileName = `company/${document.companyId}/${uploadedFile.filename}`;

        const { rows } = await pgClient.query(
          "SELECT id FROM company_document WHERE document = $1 AND company_id = $2",
          [newFileName, document.companyId]
        );

        if (rows.length > 0) {
          throw new Error("fileAlreadyExisting");
        }

        await storageClient.uploadFileByStream(
          GCP_PRIVATE_BUCKET_NAME,
          newFileName,
          uploadedFile
        );
        document.document = newFileName;
      }
    }
    return await resolve(source, args, context, resolveInfo);
  } catch (e) {
    logger.error("Error creating company documents ", e);

    await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
    throw e;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${savepoint}`);
  }
};

export const deleteCompanyDocument = async (
  resolve,
  source,
  args: { input: DeleteCompanyDocumentInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { GCP_PRIVATE_BUCKET_NAME } = process.env;
  const { pgClient, logger: Logger, storageClient, user } = context;

  const logger = Logger("service:companyDocument");
  const savepoint = "graphql_deleteCompanyDocuments_mutation";

  await pgClient.query(`SAVEPOINT ${savepoint}`);

  try {
    const { id } = args.input;

    if (!user.can("delete:companyDocument")) {
      logger.error(
        `User with id: ${user.id} and role: ${user.role} is trying to delete company document - ${id}`
      );
      throw new Error("unauthorized");
    }

    const companyDocument = await getCompanyDocument(id, pgClient);

    const deletedDocument = await resolve(source, args, context, resolveInfo);

    await storageClient.deleteFile(
      GCP_PRIVATE_BUCKET_NAME,
      companyDocument.document
    );
    return deletedDocument;
  } catch (e) {
    logger.error("Error deleting document: ", e);

    await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
    throw e;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${savepoint}`);
  }
};

const getCompanyDocument = async (
  id: number,
  pgClient: PoolClient
): Promise<CompanyDocument> => {
  const { rows } = await pgClient.query<CompanyDocument>(
    `select cd.id,cd.document from company_document cd 
    where cd.id =$1
    `,
    [id]
  );
  if (!rows.length) {
    throw new Error("The company document not exist");
  }

  return rows[0];
};
