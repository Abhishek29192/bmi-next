import React from "react";
import { Document, Img } from "react-pdf-maker";
import { GuaranteeType } from "../../../../types/GuaranteeType";
import { Typography } from "./Typography";
import { LessWidth } from "./LessWidth";

export const PdfDocument = ({ data }: { data: GuaranteeType }) => (
  <Document
    images={{
      signature: ``
    }}
    defaultStyle={{
      font: "Roboto"
    }}
  >
    <Typography variant={"h1"} marginBottom={24}>
      {data.displayName}
    </Typography>
    <Typography headlineLevel={2} variant={"h4"} marginBottom={12}>
      {data.name}
    </Typography>
    <Typography variant={"h4"} marginBottom={10}>
      Guarantee Name: {data.guaranteeName}
    </Typography>
    <Typography variant={"h4"} marginBottom={10}>
      Scope of Guarantee: {data.guaranteeScope}
    </Typography>
    <Typography variant={"h4"} marginBottom={10}>
      Product Materials: {data.productMaterials}
    </Typography>
    <Typography variant={"h1"} marginBottom={20}>
      Beneficiary and building particulars
    </Typography>
    <Typography variant={"h4"} marginBottom={10}>
      Building owner: {data.buildingParticular.name}
    </Typography>
    <Typography variant={"h4"} marginBottom={10}>
      Building Address: {data.buildingParticular.buildingAddress}
    </Typography>
    <Typography variant={"h4"} marginBottom={10}>
      Building roof area: {data.buildingParticular.buildingRoofArea}
    </Typography>
    <Typography variant={"h1"} marginBottom={20}>
      Installation particulars
    </Typography>
    <Typography variant={"h4"} marginTop={5} marginBottom={3}>
      Name of product installer: {data.installationParticular.name}
    </Typography>
    <Typography variant={"h4"} marginBottom={3}>
      BMI InTouch ID: {data.installationParticular.intouchId}
    </Typography>
    <Typography variant={"h4"} marginBottom={13}>
      Guarantee start date : {data.installationParticular.guaranteeStartDate}
    </Typography>
    <Typography variant={"h4"} marginBottom={13}>
      Guarantee issue number :{data.installationParticular.guaranteeIssueNumber}
    </Typography>
    <Typography variant={"h4"} marginBottom={13}>
      Guarantee period: {data.installationParticular.guaranteePeriod}
    </Typography>
    <Typography variant={"h4"} marginBottom={13}>
      Guarantee expiry data: {data.installationParticular.guaranteeExpiryDate}
    </Typography>
    <LessWidth>
      <Img src={data.signature.image} width={20} height={20} />
    </LessWidth>
  </Document>
);
