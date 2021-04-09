import React from "react";
import { Document, Img } from "react-pdf-maker";
import {
  GuaranteeType,
  GuaranteeData,
  GuaranteeTemplate
} from "../../../../types/GuaranteeType";
import { Typography } from "./Typography";
import { LessWidth } from "./LessWidth";

export const PdfDocument = ({
  template,
  data
}: {
  template: GuaranteeTemplate;
  data: GuaranteeData;
}) => (
  <Document
    images={{
      signature: ``
    }}
    defaultStyle={{
      font: "Roboto"
    }}
  >
    <Typography variant={"h1"} marginBottom={24}>
      {data.guaranteeType.displayName}
    </Typography>
    <Typography headlineLevel={2} variant={"h4"} marginBottom={12}>
      {data.guaranteeType.name}
    </Typography>
    <Typography variant={"h6"} marginBottom={10}>
      {template.headingGuarantee}: {data.guaranteeName}
    </Typography>
    <Typography variant={"h6"} marginBottom={10}>
      {template.headingScope}: {data.guaranteeScope}
    </Typography>
    <Typography variant={"h6"} marginBottom={10}>
      {template.headingProducts}: {data.productMaterials}
    </Typography>
    <Typography variant={"h1"} marginBottom={20}>
      {template.headingBeneficiary}
    </Typography>
    <Typography variant={"h6"} marginBottom={10}>
      {template.headingBuildingOwnerName}: {data.buildingParticular.name}
    </Typography>
    <Typography variant={"h6"} marginBottom={10}>
      {template.headingBuildingAddress}:
      {data.buildingParticular.buildingAddress}
    </Typography>
    <Typography variant={"h6"} marginBottom={10}>
      {template.headingRoofArea}: {data.buildingParticular.buildingRoofArea}
    </Typography>
    <Typography variant={"h1"} marginBottom={20}>
      {template.headingContractor}
    </Typography>
    <Typography variant={"h6"} marginTop={5} marginBottom={3}>
      {template.headingContractorName}: {data.installationParticular.name}
    </Typography>
    <Typography variant={"h6"} marginBottom={3}>
      {template.headingContractorId}: {data.installationParticular.intouchId}
    </Typography>
    <Typography variant={"h6"} marginBottom={5}>
      {template.headingStartDate} :
      {data.installationParticular.guaranteeStartDate}
    </Typography>
    <Typography variant={"h6"} marginBottom={5}>
      {template.headingGuaranteeId} :
      {data.installationParticular.guaranteeIssueNumber}
    </Typography>
    <Typography variant={"h6"} marginBottom={5}>
      {template.headingValidity}: {data.installationParticular.guaranteePeriod}
    </Typography>
    <Typography variant={"h6"} marginBottom={5}>
      {template.headingExpiry}:{data.installationParticular.guaranteeExpiryDate}
    </Typography>
    <Typography variant={"h6"} marginBottom={5}>
      {template.signatory}
    </Typography>
    <LessWidth>
      <Img src={data.guaranteeType.signature.image} width={20} height={20} />
    </LessWidth>
  </Document>
);
