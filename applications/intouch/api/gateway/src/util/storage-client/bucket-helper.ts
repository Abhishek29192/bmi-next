import { Storage, UploadResponse } from "@google-cloud/storage";

type UploadOptions = {
  gzip: boolean;
  destination: string;
};

/**
 * Wraps interactions with the the GCS library.
 *
 * @param storage The GCS Storage client.
 */
export class BucketHelper {
  readonly storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  async uploadFile(
    bucketName: string,
    filePath: string,
    fileName: string,
    destinationPrefix?: string
  ): Promise<UploadResponse> {
    const options: UploadOptions = {
      gzip: true,
      destination: destinationPrefix
        ? `${destinationPrefix}/${fileName}`
        : `${fileName}`
    };

    const uploadedFile = await this.storage
      .bucket(bucketName)
      .upload(filePath, options);

    return uploadedFile;
  }

  async getDownloadLink(
    bucketName: string,
    fileName: string,
    expireDate: Date
  ) {
    const [url] = await this.storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl({
        expires: expireDate,
        action: "read"
      });
    return url;
  }
}
