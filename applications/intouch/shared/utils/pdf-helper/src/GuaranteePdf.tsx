import { PDFDocument as PdfLibDocument } from "pdf-lib";
import * as React from "react";
import { pdf } from "react-pdf-maker";
import { GuaranteeData, GuaranteeTemplate } from "../../../types/GuaranteeType";
import { GuaranteeFileType } from "../../../types/GuaranteeFileType";
import { vfs } from "./vfs_fonts";
import { PdfDocument } from "./components";
import { buffer_encode, toArrayBuffer } from "./util/bufferUtil";

const fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Regular.ttf"
  }
};
export default class GuaranteePdf {
  readonly guaranteeData: GuaranteeData;
  constructor(guaranteeData: GuaranteeData) {
    this.guaranteeData = guaranteeData;
  }

  async create() {
    return this.getGuaranteeTemplatesPdf();
  }

  private async mergePdf(...files: ArrayBuffer[]): Promise<Uint8Array> {
    // Create a new document
    const mergedPdf = await PdfLibDocument.create();

    for (const file of files) {
      const pdf = await PdfLibDocument.load(file);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return mergedPdf.save();
  }

  private async getGuaranteePdf(template: GuaranteeTemplate): Promise<any> {
    const pdfDoc = (
      <PdfDocument template={template} data={this.guaranteeData} />
    );
    const pdfDocGenerator = pdf(pdfDoc, null, fonts, vfs);

    return new Promise((resolve, reject) => {
      pdfDocGenerator.getBuffer(
        async (buffer: Buffer) => {
          const pdfDocBuffer = await toArrayBuffer(buffer);
          resolve(pdfDocBuffer);
        },
        (errorResponse) => {
          reject(errorResponse);
        }
      );
    });
  }

  private getGuaranteeTemplatesPdf(): Promise<GuaranteeFileType>[] {
    const templates = this.guaranteeData.guaranteeType
      .guaranteeTemplatesCollection;

    return templates.map(async (template) => {
      const guaranteePdf = await this.getGuaranteePdf(template);
      const maintanance = await this.getPdfFromUrl(
        template.maintenanceTemplate.url
      );
      const termAndCondition = await this.getPdfFromUrl(template.terms.url);
      const data = await this.mergePdf(
        guaranteePdf,
        maintanance,
        termAndCondition
      );

      return {
        name: template.maintenanceTemplate.fileName,
        data
      };
    });
  }

  private async getPdfFromUrl(url: string): Promise<ArrayBuffer> {
    return await buffer_encode(url);
  }
}
