import { PDFDocument as PdfLibDocument } from "pdf-lib";
import * as React from "react";
import { pdf } from "@bmi-digital/react-pdf-maker";
import {
  Guarantee,
  ContentfulGuaranteeTemplate,
  ContentfulGuaranteeType
} from "@bmi/intouch-api-types";
import { vfs } from "./vfs_fonts";
import { PdfDocument } from "./components";
import { buffer_encode, toArrayBuffer } from "./util/bufferUtil";
import { base64_encode } from "./util/imageUtil";

const fonts = {
  Effra: {
    normal: "Effra_Rg.ttf",
    bold: "Effra_Bd.ttf"
  }
};

type GuaranteeFileType = {
  name: string;
  data: Uint8Array;
};

export default class GuaranteePdfGenerator {
  readonly guaranteeData: Guarantee;

  constructor(guaranteeData: Guarantee) {
    this.guaranteeData = guaranteeData;
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

  private async getGuaranteePdf(
    guaranteeType: ContentfulGuaranteeType,
    template: ContentfulGuaranteeTemplate
  ): Promise<any> {
    const logoEncoded = await base64_encode(template.logo.url);
    const signatureEncoded = await base64_encode(guaranteeType.signature.url);

    const pdfDoc = (
      <PdfDocument
        template={template}
        guaranteeData={this.guaranteeData}
        logoEncoded={logoEncoded}
        signatureEncoded={signatureEncoded}
      />
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

  public async create(): Promise<GuaranteeFileType> {
    const { id, guaranteeType } = this.guaranteeData;
    const template = guaranteeType.guaranteeTemplatesCollection.items[0];

    const guaranteePdf = await this.getGuaranteePdf(guaranteeType, template);

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
      name: `${template.filenamePrefix} ${id}.pdf`,
      data
    };
  }

  private async getPdfFromUrl(url: string): Promise<ArrayBuffer> {
    return await buffer_encode(url);
  }
}
