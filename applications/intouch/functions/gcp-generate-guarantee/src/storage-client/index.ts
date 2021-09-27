import { Storage } from "@google-cloud/storage";

export interface StorageClientType {
  readonly constructor: Function;

  uploadFile(
    bucketName: string,
    fileName: string,
    data: Uint8Array
  ): Promise<boolean>;
}

export default class StorageClient implements StorageClientType {
  private readonly storage: Storage;

  constructor() {
    this.storage = new Storage();
  }

  async uploadFile(
    bucketName: string,
    fileName: string,
    data: Uint8Array
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const file = this.storage.bucket(bucketName).file(fileName);
      if (!file) {
        throw new Error("You have to add a file");
      }

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      file
        .createWriteStream({
          contentType: "application/pdf"
        })
        .on("finish", () => resolve(true))
        .on("error", (err) => reject(err))
        .end(data);
    });
  }
}
