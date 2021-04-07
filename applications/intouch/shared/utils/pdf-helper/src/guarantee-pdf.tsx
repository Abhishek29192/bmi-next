import { existsSync, mkdirSync, writeFile } from "fs";
import { resolve } from "path";
import * as React from "react";
import { pdf } from "react-pdf-maker";
import { GuaranteeType } from "../../../types/GuaranteeType";
import { vfs } from "./vfs_fonts";
import { PdfDocument } from "./components";

const fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Regular.ttf"
  }
};
export default class GuaranteePdf {
  readonly guaranteeData: GuaranteeType;
  constructor(guaranteeData: GuaranteeType) {
    this.guaranteeData = guaranteeData;
  }

  createPdf(filename: string) {
    const pdfDoc = <PdfDocument data={this.guaranteeData} />;

    const filePath = resolve(".", "pdf");
    if (!existsSync(filePath)) {
      mkdirSync(filePath);
    }

    const result = pdf(pdfDoc, null, fonts, vfs);
    result.getBase64((data) => {
      writeFile(`${filePath}/${filename}.pdf`, data, "base64", (error) => {
        if (error) throw error;
      });
    });
  }
}
