import {
  CompanyDocument,
  CreateCompanyDocumentsInput,
  CompanyDocumentType,
  DeleteCompanyDocumentInput
} from "@bmi/intouch-api-types";
import { FileUpload } from "graphql-upload";
import { PoolClient } from "pg";
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
      for (const document of args.input.documents) {
        const uploadedFile: FileUpload = await document.attachmentUpload;

        const newFileName = `company/${document.companyId}/${uploadedFile.filename}`;

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

export const getDocumentType = (documentPath: string): CompanyDocumentType => {
  const fileExtention: string = (documentPath || "")
    .split(/[\\/]/)
    .pop()
    .split(".")
    .pop();

  const fileExtentions: { [K in string]: CompanyDocumentType } = {
    PDF: "PDF",
    JPG: "JPG",
    JPEG: "JPEG",
    PNG: "PNG"
  };

  return fileExtentions[fileExtention.toUpperCase()];
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
