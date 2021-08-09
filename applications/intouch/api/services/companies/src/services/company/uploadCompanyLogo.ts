import { FileUpload } from "graphql-upload";
import StorageClient from "../storage-client";

export const uploadCompanyLogo = async (
  companyId: number,
  logoUpload: FileUpload
): Promise<string> => {
  const { GCP_PUBLIC_BUCKET_NAME } = process.env;

  const fileName = `companies/logos/${companyId}-${Date.now()}`;

  const uploadedFile = await logoUpload;

  const storageClient = new StorageClient();
  await storageClient.uploadFileByStream(
    GCP_PUBLIC_BUCKET_NAME,
    fileName,
    uploadedFile
  );
  return fileName;
};
