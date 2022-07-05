import React from "react";
import "@testing-library/jest-dom";
import { pdf } from "@bmi-digital/react-pdf-maker";
import { PdfDocument } from "../PdfDocument";
import { mockGuarantee, mockSolutionGuarantee } from "../../../mocks/guarantee";
import { base64_encode } from "../../util/imageUtil";

describe("PdfDocument", () => {
  describe("Product Guarantee", () => {
    const mock = mockGuarantee;
    const template = mock.guaranteeType.guaranteeTemplatesCollection.items[0];

    it("pdf", async () => {
      const logoEncoded = await base64_encode(
        mock.guaranteeType.guaranteeTemplatesCollection.items[0].logo.url
      );
      const signatureEncoded = await base64_encode(
        mock.guaranteeType.signature.url
      );
      const pdfDocument = pdf(
        <PdfDocument
          template={template}
          guaranteeData={mock}
          logoEncoded={logoEncoded}
          signatureEncoded={signatureEncoded}
        />
      );

      expect(pdfDocument).toMatchSnapshot();
    });
  });

  describe("Solution Guarantee", () => {
    const mock = mockSolutionGuarantee;
    const template = mock.guaranteeType.guaranteeTemplatesCollection.items[0];

    it("pdf", async () => {
      const logoEncoded = await base64_encode(
        mock.guaranteeType.guaranteeTemplatesCollection.items[0].logo.url
      );
      const signatureEncoded = await base64_encode(
        mock.guaranteeType.signature.url
      );
      const pdfDocument = pdf(
        <PdfDocument
          template={template}
          guaranteeData={mock}
          logoEncoded={logoEncoded}
          signatureEncoded={signatureEncoded}
        />
      );

      expect(pdfDocument).toMatchSnapshot();
    });
  });

  describe("exceptional", () => {
    it("doesn't have a language code", async () => {
      const mock = JSON.parse(JSON.stringify(mockGuarantee));
      const template = mock.guaranteeType.guaranteeTemplatesCollection.items[0];
      const logoEncoded = await base64_encode(
        mock.guaranteeType.guaranteeTemplatesCollection.items[0].logo.url
      );
      const signatureEncoded = await base64_encode(
        mock.guaranteeType.signature.url
      );
      delete mock.languageCode;

      const pdfDocument = pdf(
        <PdfDocument
          template={template}
          guaranteeData={mock}
          logoEncoded={logoEncoded}
          signatureEncoded={signatureEncoded}
        />
      );

      expect(pdfDocument).toMatchSnapshot();
    });

    it("doesn't have a buildingOwnerCompany", async () => {
      const mock = JSON.parse(JSON.stringify(mockGuarantee));
      const template = mock.guaranteeType.guaranteeTemplatesCollection.items[0];
      const logoEncoded = await base64_encode(
        mock.guaranteeType.guaranteeTemplatesCollection.items[0].logo.url
      );
      const signatureEncoded = await base64_encode(
        mock.guaranteeType.signature.url
      );
      delete mock.project.buildingOwnerCompany;

      const pdfDocument = pdf(
        <PdfDocument
          template={template}
          guaranteeData={mock}
          logoEncoded={logoEncoded}
          signatureEncoded={signatureEncoded}
        />
      );

      expect(pdfDocument).toMatchSnapshot();
    });

    it("doesn't have a site address", async () => {
      const mock = JSON.parse(JSON.stringify(mockGuarantee));
      const template = mock.guaranteeType.guaranteeTemplatesCollection.items[0];
      const logoEncoded = await base64_encode(
        mock.guaranteeType.guaranteeTemplatesCollection.items[0].logo.url
      );
      const signatureEncoded = await base64_encode(
        mock.guaranteeType.signature.url
      );
      delete mock.project.siteAddress;

      expect(() =>
        pdf(
          <PdfDocument
            template={template}
            guaranteeData={mock}
            logoEncoded={logoEncoded}
            signatureEncoded={signatureEncoded}
          />
        )
      ).toThrow("project site address can not be undefined");
    });

    it("doesn't have company", async () => {
      const mock = JSON.parse(JSON.stringify(mockGuarantee));
      const template = mock.guaranteeType.guaranteeTemplatesCollection.items[0];
      const logoEncoded = await base64_encode(
        mock.guaranteeType.guaranteeTemplatesCollection.items[0].logo.url
      );
      const signatureEncoded = await base64_encode(
        mock.guaranteeType.signature.url
      );
      delete mock.project.company;

      expect(() =>
        pdf(
          <PdfDocument
            template={template}
            guaranteeData={mock}
            logoEncoded={logoEncoded}
            signatureEncoded={signatureEncoded}
          />
        )
      ).toThrow("project company missing");
    });
  });
});
