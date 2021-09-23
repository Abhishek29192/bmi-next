import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { mockGuarantee } from "./mocks/guarantee";
import GuaranteePdf from "./src/GuaranteePdf";
import { sendGuaranteePdf } from "./src";
import StorageClient from "./src/storage-client";

export const pdfCreate = async () => {
  const guaranteePdf = new GuaranteePdf(mockGuarantee);

  const filePath = resolve(".", "pdf");
  if (!existsSync(filePath)) {
    mkdirSync(filePath);
  }
  const file = await guaranteePdf.create();

  writeFileSync(`${filePath}/${file.name}`, file.data);
};

export const pdfUpload = async () => {
  const guaranteePdf = new GuaranteePdf(mockGuarantee);
  const storageClient = new StorageClient();
  const file = await guaranteePdf.create();

  await storageClient.uploadFile(
    "intouch-file-storage-bucket",
    `guaranteePdf/${file.name}`,
    file.data
  );
};

export const sendMail = async () => {
  const event = {
    data: Buffer.from(JSON.stringify(mockGuarantee)).toString("base64")
  };
  sendGuaranteePdf(event);
};

// uncomment any of these lines to try out the code
// (async () => await pdfCreate())();
// (async () => await sendMail())();
// (async () => await pdfUpload())();
