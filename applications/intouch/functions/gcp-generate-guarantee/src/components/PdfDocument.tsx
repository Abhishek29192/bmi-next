import React from "react";
import { Document, Img } from "@bmi-digital/react-pdf-maker";
import { ContentfulGuaranteeTemplate, Guarantee } from "@bmi/intouch-api-types";
import { Typography } from "./Typography";
import { LessWidth } from "./LessWidth";

export const PdfDocument = ({
  template,
  guaranteeData,
  logoEncoded,
  signatureEncoded
}: {
  template: ContentfulGuaranteeTemplate;
  guaranteeData: Guarantee;
  logoEncoded: string;
  signatureEncoded: string;
}) => {
  const {
    guaranteeType,
    productByProductBmiRef,
    project,
    bmiReferenceId,
    startDate,
    expiryDate
  } = guaranteeData;

  const address = project.siteAddress;

  if (!address) {
    throw new Error("project site address can not be undefined");
  }
  const addressLine = `${address.firstLine} ${address.secondLine} ${address.town} ${address.country} ${address.postcode}`;

  const { company } = project;
  if (!company) {
    throw new Error("project company missing");
  }

  return (
    <Document
      images={{
        signature: ``
      }}
      defaultStyle={{
        font: "Effra"
      }}
    >
      <LessWidth>
        <Img src={logoEncoded} width={20} height={90} />
      </LessWidth>
      <Typography variant={"h1"} marginBottom={20}>
        {guaranteeType.displayName}
      </Typography>

      <Typography headlineLevel={2} variant={"h6"} marginBottom={10}>
        {guaranteeType.name}
      </Typography>

      <Typography variant={"h6"} marginBottom={10}>
        {template.headingGuarantee}: {project.name}
      </Typography>

      <Typography variant={"h6"} marginBottom={10}>
        {template.headingScope}: {template.guaranteeScope}
      </Typography>

      <Typography variant={"h6"} marginBottom={10}>
        {template.headingProducts}: {productByProductBmiRef?.name}
      </Typography>

      <Typography variant={"h1"} marginBottom={20}>
        {template.headingBeneficiary}
      </Typography>

      <Typography variant={"h6"} marginBottom={10}>
        {template.headingBuildingOwnerName}:{project.buildingOwnerFirstname}{" "}
        {project.buildingOwnerLastname}
      </Typography>

      <Typography variant={"h6"} marginBottom={10}>
        {template.headingBuildingAddress}:{addressLine}
      </Typography>

      <Typography variant={"h6"} marginBottom={10}>
        {template.headingRoofArea}: {project.roofArea}
      </Typography>

      <Typography variant={"h6"} marginBottom={10}>
        {template.headingRoofType}: {guaranteeType.technology}
      </Typography>

      <Typography variant={"h1"} marginBottom={20}>
        {template.headingContractor}
      </Typography>

      <Typography variant={"h6"} marginTop={5} marginBottom={3}>
        {template.headingContractorName}:{company.name}
      </Typography>

      <Typography variant={"h6"} marginBottom={3}>
        {template.headingContractorId}: {company.referenceNumber}
      </Typography>

      <Typography variant={"h6"} marginBottom={5}>
        {template.headingStartDate} :{startDate}
      </Typography>

      <Typography variant={"h6"} marginBottom={5}>
        {template.headingGuaranteeId} :{bmiReferenceId}
      </Typography>

      <Typography variant={"h6"} marginBottom={5}>
        {template.headingValidity}:
        {new Date(expiryDate).getFullYear() - new Date(startDate).getFullYear()}
      </Typography>

      <Typography variant={"h6"} marginBottom={5}>
        {template.headingExpiry}:{expiryDate}
      </Typography>

      <Typography variant={"h6"} marginBottom={5}>
        {template.signatory}
      </Typography>

      <LessWidth>
        <Img src={signatureEncoded} width={20} height={20} />
      </LessWidth>
    </Document>
  );
};
