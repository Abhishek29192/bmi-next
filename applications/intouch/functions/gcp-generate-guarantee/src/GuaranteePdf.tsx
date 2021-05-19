import { PDFDocument as PdfLibDocument } from "pdf-lib";
import * as React from "react";
import { pdf } from "react-pdf-maker";
import { Guarantee, GuaranteeTemplate } from "@bmi/intouch-api-types";
import { vfs } from "./vfs_fonts";
import { PdfDocument } from "./components";
import { buffer_encode, toArrayBuffer } from "./util/bufferUtil";
import { base64_encode } from "./util/imageUtil";

const fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Regular.ttf"
  }
};

export type GuaranteeFileType = {
  name: string;
  data: Uint8Array;
};

export default class GuaranteePdf {
  readonly guaranteeData: Guarantee;
  constructor(guaranteeData: Guarantee) {
    this.guaranteeData = guaranteeData;
  }

  async create() {
    await this.loadImages();

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
    const templates =
      this.guaranteeData.guaranteeType.guaranteeTemplatesCollection.items;

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

  private loadImages = async () => {
    this.guaranteeData.guaranteeType.signature.image = await base64_encode(
      this.guaranteeData.guaranteeType.signature.url
    );

    for (const template of this.guaranteeData.guaranteeType
      .guaranteeTemplatesCollection.items) {
      template.logo.image = await base64_encode(template.logo.url);
    }
    return this.guaranteeData;
  };
}
