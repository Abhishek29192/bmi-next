import * as path from "path";
import { Storage, UploadResponse, StorageOptions } from "@google-cloud/storage";
import { BucketHelper } from "./bucket-helper";

const { GCP_PROJECT_ID } = process.env;
export default class StorageClient {
  readonly storage: Storage;
  readonly bucketHelper: BucketHelper;

  constructor() {
    //Defaults options
    //TODO:Maybe we can use credential instead of keyFilename
    const options: StorageOptions = {
      projectId: GCP_PROJECT_ID,
      keyFilename: "./storage-keyFile.json"
    };

    this.storage = new Storage(options);
    this.bucketHelper = new BucketHelper(this.storage);
  }
  /**
   * @param destination Name of bucket to upload file/dir.
   * @param filePath Path of the file/dir to upload.
   * @param fileName Optional file name when uploading to GCS.
   * @returns uploaded file.
   */
  async upload(
    destination: string,
    filePath: string,
    fileName?: string
  ): Promise<UploadResponse> {
    let bucketName = destination;

    let prefix = "";
    // If destination of the form bucket-name/subfolder get bucket and prefix.
    const idx = destination.indexOf("/");
    if (idx > -1) {
      bucketName = destination.substring(0, idx);
      prefix = destination.substring(idx + 1);
    }

    //If file name is not set get uploaded filename
    fileName = fileName || `${path.posix.basename(filePath)}`;

    const uploadedFile = await this.bucketHelper.uploadFile(
      bucketName,
      filePath,
      fileName,
      prefix
    );
    return uploadedFile;
  }

  async getDownloadLink(
    bucketName: string,
    fileName: string,
    expireDate: Date
  ) {
    const url = await this.bucketHelper.getDownloadLink(
      bucketName,
      fileName,
      expireDate
    );
    return url;
  }
}
