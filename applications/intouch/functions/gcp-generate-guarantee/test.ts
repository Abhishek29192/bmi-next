import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { mockGuarantee } from "./mocks/guarantee";
import GuaranteePdf from "./src/GuaranteePdf";
import { sendGuaranteePdf } from "./src";

export const pdfCreate = async () => {
  const guaranteePdf = new GuaranteePdf(mockGuarantee);

  const filePath = resolve(".", "pdf");
  if (!existsSync(filePath)) {
    mkdirSync(filePath);
  }
  const pdfs = await guaranteePdf.create();

  pdfs.forEach(async (pdf) => {
    const file = await pdf;
    writeFileSync(`${filePath}/${file.name}`, file.data);
  });
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
