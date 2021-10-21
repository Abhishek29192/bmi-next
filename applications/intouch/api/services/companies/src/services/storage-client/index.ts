import { Storage } from "@google-cloud/storage";
import { FileUpload } from "graphql-upload";

export interface StorageClientType {
  readonly constructor: Function;

  uploadFileByStream(
    bucketName: string,
    fileName: string,
    uploadFile: FileUpload
  ): Promise<boolean>;

  deleteFile(bucketName: string, fileName: string): Promise<any>;

  getPublicFileUrl(fileName: string): string;
  getFileNameFromPublicUrl(url: string): string;

  getFileSignedUrl(
    bucketName: string,
    fileName: string,
    expiryDate?: Date
  ): Promise<string | undefined>;

  getPrivateAssetSignedUrl(
    fileName: string,
    expiryDate?: Date
  ): Promise<string | undefined>;
}

const STORAGE_BASE_URL = "https://storage.googleapis.com";
export default class StorageClient implements StorageClientType {
  private readonly storage: Storage;

  constructor() {
    this.storage = new Storage();
  }

  async uploadFileByStream(
    bucketName: string,
    fileName: string,
    uploadFile: FileUpload
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const file = this.storage.bucket(bucketName).file(fileName);

      if (!uploadFile) {
        throw new Error("You have to add a file");
      }

      const { createReadStream, mimetype } = uploadFile;

      createReadStream()
        .pipe(
          file.createWriteStream({
            resumable: false,
            gzip: true,
            contentType: mimetype
          })
        )
        .on("finish", () => resolve(true))
        .on("error", (err) => reject(err));
    });
  }

  async deleteFile(bucketName: string, fileName: string): Promise<any> {
    return !this.isExternal(fileName)
      ? await this.storage.bucket(bucketName).file(fileName).delete()
      : null;
  }

  getPublicFileUrl(fileName: string): string {
    return `${STORAGE_BASE_URL}/${process.env.GCP_PUBLIC_BUCKET_NAME}/${fileName}`;
  }

  getFileNameFromPublicUrl(url: string): string {
    return url.replace(
      `${STORAGE_BASE_URL}/${process.env.GCP_PUBLIC_BUCKET_NAME}/`,
      ""
    );
  }

  async getFileSignedUrl(
    bucketName: string,
    fileName: string,
    expiryDate?: Date
  ): Promise<string | undefined> {
    // if we try to sign an externally hosted image
    // Cloud Storage wouldn't find the image
    if (
      !fileName ||
      // externally-hosted or null images should not be signed
      fileName.startsWith("http")
    ) {
      return fileName;
    }
    if (!expiryDate) {
      expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);
    }

    const [url] = await this.storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl({
        expires: expiryDate,
        action: "read"
      });
    return url;
  }

  async getPrivateAssetSignedUrl(
    fileName: string,
    expiryDate?: Date
  ): Promise<string | undefined> {
    return this.getFileSignedUrl(
      process.env.GCP_PRIVATE_BUCKET_NAME,
      fileName,
      expiryDate
    );
  }

  isExternal(filePath: string) {
    // if we try to delete an externally hosted file
    // Cloud Storage wouldn't find the file
    return !filePath || filePath.startsWith("http");
  }
}
