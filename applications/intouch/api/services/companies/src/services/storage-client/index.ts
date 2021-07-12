import { Storage } from "@google-cloud/storage";
import { FileUpload } from "graphql-upload";

export default class StorageClient {
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

  async getFileSignedUrl(
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
