import StorageClient from "..";

describe("Google Storage", () => {
  describe("shouldn't get the signed url", () => {
    it("if no bucket name", async () => {
      try {
        const client = new StorageClient();
        await client.getFileSignedUrl(null, "", new Date());
      } catch (error) {
        expect(error.message).toEqual(
          "A bucket name is needed to use Cloud Storage."
        );
      }
    });
    it("if no file name", async () => {
      try {
        const client = new StorageClient();
        await client.getFileSignedUrl("bucket", null, new Date());
      } catch (error) {
        expect(error.message).toEqual("A file name must be specified.");
      }
    });
  });
  describe("shouldn't upload File", () => {
    it("if no bucket name", async () => {
      try {
        const client = new StorageClient();
        await client.uploadFileByStream(null, null, null);
      } catch (error) {
        expect(error.message).toEqual(
          "A bucket name is needed to use Cloud Storage."
        );
      }
    });
    it("if no file name", async () => {
      try {
        const client = new StorageClient();
        await client.uploadFileByStream("bucket", null, null);
      } catch (error) {
        expect(error.message).toEqual("A file name must be specified.");
      }
    });

    it("if no file upload", async () => {
      try {
        const client = new StorageClient();
        await client.uploadFileByStream("bucket", "file", null);
      } catch (error) {
        expect(error.message).toEqual("You have to add a file");
      }
    });
  });
});
