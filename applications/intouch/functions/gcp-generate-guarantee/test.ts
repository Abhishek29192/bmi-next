import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { getGuarantee } from "./mocks/data";
import GuaranteePdf from "./src/GuaranteePdf";

const start = async () => {
  const result = await getGuarantee();
  const guaranteePdf = new GuaranteePdf(result);

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

start();
