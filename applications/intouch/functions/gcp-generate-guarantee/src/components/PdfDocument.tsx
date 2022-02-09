import {
  Canvas,
  Col,
  Document,
  Img,
  Row,
  SVG,
  View
} from "@bmi-digital/react-pdf-maker";
import { ContentfulGuaranteeTemplate, Guarantee } from "@bmi/intouch-api-types";
import React from "react";
import Logo from "../svgs/BMI";
import svgMap from "../util/svgMap";
import { formatDateByLanguage } from "../util/date";
import { Field } from "./Field";
import { Typography } from "./Typography";

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
    coverage,
    guaranteeType,
    productByProductBmiRef,
    systemBySystemBmiRef,
    project,
    bmiReferenceId,
    startDate,
    expiryDate,
    languageCode = "NO"
  } = guaranteeData;

  const address = project.siteAddress;

  if (!address) {
    throw new Error("project site address can not be undefined");
  }
  const { company } = project;
  if (!company) {
    throw new Error("project company missing");
  }

  const guaranteeName =
    coverage === "PRODUCT"
      ? productByProductBmiRef?.name
      : systemBySystemBmiRef?.name;

  const products =
    coverage === "PRODUCT"
      ? productByProductBmiRef?.name
      : systemBySystemBmiRef?.systemMembersBySystemBmiRef?.nodes
          .map((member) => member.productByProductBmiRef?.name)
          .join(", ");

  return (
    <Document
      images={{
        signature: ``
      }}
      defaultStyle={{
        font: "Effra"
      }}
    >
      <Row marginBottom={20}>
        <Col width={60} marginTop={20}>
          <SVG width={50} height={50}>
            {Logo}
          </SVG>
        </Col>
        <Col width={360} marginTop={20}>
          <Typography variant="h1" marginBottom={2}>
            {template.titleLine1} {template.titleLine2}
          </Typography>
          <SVG width={20} height={20}>
            {svgMap[guaranteeType.technology]}
          </SVG>
        </Col>
        <Col width={75}>
          <Img src={logoEncoded} width={20} height={90} />
        </Col>
      </Row>
      <Row marginBottom={20}>
        <Col width={500}>
          <Canvas>
            <Canvas.Rect x={0} y={0} w={500} h={140} color="#e0f3f9" />
          </Canvas>
          <View marginTop={-135} marginLeft={10} marginBottom={20}>
            <Typography variant="h2">{template.headingGuarantee}:</Typography>
            <Typography marginBottom={8}>{guaranteeName}</Typography>

            <Typography variant="h3">{template.headingScope}:</Typography>
            <Typography marginBottom={8}>{template.guaranteeScope}</Typography>

            <Typography variant="h3">{template.headingProducts}:</Typography>
            <Typography>{products}</Typography>
          </View>
        </Col>
      </Row>
      <Row>
        <Col width={250}>
          <Typography variant="h3" marginBottom={20}>
            {template.headingBeneficiary}
          </Typography>
          <Field
            title={template.headingBuildingOwnerName}
            values={[
              `${project.buildingOwnerFirstname} ${project.buildingOwnerLastname}`
            ]}
          />
          <Field
            title={template.headingBuildingAddress}
            values={[
              address.firstLine,
              address.secondLine,
              address.town,
              address.country,
              address.postcode
            ]}
          />
          <Field
            title={template.headingRoofArea}
            values={[`${project.roofArea}`]}
          />
          <Field
            title={template.headingRoofType}
            values={[template.roofType]}
          />
        </Col>
        <Col width={250}>
          <Typography variant="h3" marginBottom={20}>
            {template.headingContractor}
          </Typography>
          <Field
            title={template.headingContractorName}
            values={[company.name]}
          />
          <Field
            title={template.headingContractorId}
            values={[`${company.referenceNumber}`]}
          />
          <Field
            title={template.headingStartDate}
            values={[formatDateByLanguage(startDate, languageCode)]}
          />
          <Field
            title={template.headingGuaranteeId}
            values={[bmiReferenceId]}
          />
          <Field
            title={template.headingValidity}
            values={[
              `${
                new Date(expiryDate).getFullYear() -
                new Date(startDate).getFullYear()
              }`
            ]}
          />
          <Field
            title={template.headingExpiry}
            values={[formatDateByLanguage(expiryDate, languageCode)]}
          />
        </Col>
      </Row>
      <View marginTop={20} marginBottom={20}>
        <Img src={signatureEncoded} width={100} />
        <Typography>{template.signatory}</Typography>
      </View>

      <Typography variant="body2">{template.footer}</Typography>
    </Document>
  );
};
