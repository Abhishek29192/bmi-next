import React from "react";
import { Document, Img } from "react-pdf-maker";
import { Guarantee, GuaranteeTemplate } from "../../../../types/GuaranteeType";
import { Typography } from "./Typography";
import { LessWidth } from "./LessWidth";

export const PdfDocument = ({
  template,
  data
}: {
  template: GuaranteeTemplate;
  data: Guarantee;
}) => {
  const address = data.project.addresses.nodes.find(
    (address) => address.addressType === "SITE"
  );
  const addressLine = `${address.firstLine} ${address.secondLine} ${address.town} ${address.country} ${address.postcode}`;

  return (
    <Document
      images={{
        signature: ``
      }}
      defaultStyle={{
        font: "Roboto"
      }}
    >
      <LessWidth>
        <Img src={template.logo.image} width={20} height={90} />
      </LessWidth>
      <Typography variant={"h1"} marginBottom={20}>
        {data.guaranteeType.displayName}
      </Typography>
      <Typography headlineLevel={2} variant={"h6"} marginBottom={10}>
        {data.guaranteeType.name}
      </Typography>
      <Typography variant={"h6"} marginBottom={10}>
        {template.headingGuarantee}: {data.project.name}
      </Typography>
      <Typography variant={"h6"} marginBottom={10}>
        {template.headingScope}: {template.guaranteeScope}
      </Typography>
      <Typography variant={"h6"} marginBottom={10}>
        {template.headingProducts}:{" "}
        {data.guaranteedProducts.nodes.map((node) => node.product.name).join()}
      </Typography>
      <Typography variant={"h1"} marginBottom={20}>
        {template.headingBeneficiary}
      </Typography>
      <Typography variant={"h6"} marginBottom={10}>
        {template.headingBuildingOwnerName}:
        {data.project.buildingOwnerFirstname}{" "}
        {data.project.buildingOwnerLastname}
      </Typography>
      <Typography variant={"h6"} marginBottom={10}>
        {template.headingBuildingAddress}:{addressLine}
      </Typography>
      <Typography variant={"h6"} marginBottom={10}>
        {template.headingRoofArea}: {data.project.roofArea}
      </Typography>
      <Typography variant={"h6"} marginBottom={10}>
        {template.headingRoofType}: {data.guaranteeType.technology}
      </Typography>
      <Typography variant={"h1"} marginBottom={20}>
        {template.headingContractor}
      </Typography>
      <Typography variant={"h6"} marginTop={5} marginBottom={3}>
        {template.headingContractorName}:{data.project.company.name}
      </Typography>
      <Typography variant={"h6"} marginBottom={3}>
        {template.headingContractorId}: {data.project.company.referenceNumber}
      </Typography>
      <Typography variant={"h6"} marginBottom={5}>
        {template.headingStartDate} :{data.startDate}
      </Typography>
      <Typography variant={"h6"} marginBottom={5}>
        {template.headingGuaranteeId} :{data.issueNumber}
      </Typography>
      <Typography variant={"h6"} marginBottom={5}>
        {template.headingValidity}:
        {new Date(data.expiry).getFullYear() -
          new Date(data.startDate).getFullYear()}
      </Typography>
      <Typography variant={"h6"} marginBottom={5}>
        {template.headingExpiry}:{data.expiry}
      </Typography>
      <Typography variant={"h6"} marginBottom={5}>
        {template.signatory}
      </Typography>
      <LessWidth>
        <Img src={data.guaranteeType.signature.image} width={20} height={20} />
      </LessWidth>
    </Document>
  );
};
