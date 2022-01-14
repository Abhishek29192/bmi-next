import React from "react";
import { isElement } from "react-is";
import {
  pdf,
  Document,
  styled,
  View,
  Text,
  Canvas,
  Row,
  Col,
  Img,
  SVG,
  Table,
  Link,
  ContentTable,
  ComponentProps
} from "@bmi/react-pdf-maker";
import EffraNormal from "./fonts/Effra_Rg.ttf";
import EffraBold from "./fonts/Effra_Bd.ttf";
import { ResultsContent } from "./types/ResultsContent";
import { FieldsDisplay } from "./types/FieldsDisplay";
import { FieldLabels } from "./types/FieldLabels";
import { ResultProduct } from "./types/ResultProduct";
import { FormValues } from "./types/FormValues";

const PAGE_WIDTH = 595.28; /* A4 width in pt */

const Hr = ({
  width,
  thickness,
  color
}: {
  width: number;
  thickness: number;
  color: string;
}) => (
  <Canvas>
    <Canvas.Line
      lineWidth={thickness}
      lineColor={color}
      x1={0}
      y1={0}
      x2={width}
      y2={0}
    />
  </Canvas>
);

const Underline = ({ large }: { large?: boolean }) => (
  <Hr width={large ? 100 : 52} thickness={large ? 4 : 3} color={"#009FE3"} />
);

const textStyles = {
  h1: {
    fontSize: 22.5,
    lineHeight: 1.33 /* roughly 30pt */,
    bold: true // TODO: look into increasing the font weight to 900
  },
  h4: {
    fontSize: 16,
    lineHeight: 1.625 /* 26pt */,
    bold: true
  },
  h5: {
    fontSize: 12,
    lineHeight: 1.65 /* roughly 19pt */,
    bold: true // TODO: Medium
  },
  h6: {
    fontSize: 10,
    lineHeight: 2.7 /* 27pt */,
    bold: true // TODO: Medium
  },
  body1: {
    fontSize: 10,
    lineHeight: 1.4 /* 14pt */
  },
  body2: {
    fontSize: 12,
    lineHeight: 2.25 /* 27pt */,
    bold: true // TODO: Medium
  }
};

type TypographProps = {
  variant?: keyof typeof textStyles;
  hasUnderline?: boolean;
  children: React.ReactNode;
  [rest: string]: any;
};

const Typography = ({
  variant = "body1",
  hasUnderline = variant === "h1",
  children,
  ...rest
}: TypographProps) => (
  <View {...rest}>
    {/* eslint-disable-next-line security/detect-object-injection */}
    <Text {...textStyles[variant]}>{children}</Text>
    {hasUnderline ? <Underline large={variant === "h1"} /> : null}
  </View>
);

const Bullets = (props: ComponentProps) => <View {...props} />;

const BulletText = styled(Text)({
  fontSize: 10,
  lineHeight: 2,
  color: "#70706F"
});

type BulletsItemProps = {
  children: React.ReactNode;
  [rest: string]: any;
};

const BulletsItem = ({ children, ...rest }: BulletsItemProps) => (
  <Row {...rest} headlineLevel={2}>
    <Col width={15}>
      <Canvas>
        <Canvas.Rect x={0} y={3} w={7} h={7} color={"#009FE3"} />
      </Canvas>
    </Col>
    <Col>
      <BulletText>{children}</BulletText>
    </Col>
  </Row>
);

Bullets.Item = BulletsItem;

const LessWidth = ({ children }: { children: React.ReactNode }) => (
  <Row marginBottom={9}>
    <Col width={402}>{children}</Col>
  </Row>
);

type ResultsTableProps = {
  children: React.ReactNode;
  layout?: object;
  headerRows?: number;
  widths?: Array<string | number>;
  [rest: string]: any;
};

const ResultsTable = ({
  children,
  layout,
  headerRows = 1,
  ...rest
}: ResultsTableProps) => {
  const rows = React.Children.map(children, (node, i) => {
    if (!isElement(node)) return node;

    const rowChildren = React.Children.toArray(node.props.children);
    const cells = React.Children.map(rowChildren, (cellNode, i) =>
      (i === 0 || i === rowChildren.length) && isElement(cellNode)
        ? React.cloneElement(cellNode, {
            first: i === 0,
            last: i === rowChildren.length
          })
        : cellNode
    );

    return React.cloneElement(node, { children: cells });
  });

  return (
    <Table
      layout={{
        hLineColor: () => "#CCCCCC",
        vLineColor: () => "#CCCCCC",
        vLineWidth: (i: number, node: ContentTable) =>
          i === 0 || i === node.table.widths?.length ? 1 : 0,
        fillColor: (i: number) => (i < headerRows ? "#F7F7F7" : null),
        ...layout
      }}
      headerRows={headerRows}
      {...rest}
    >
      {rows}
    </Table>
  );
};

const ResultsTableCellText = styled(Text)({
  fontSize: 10,
  color: "#70706F",
  bold: ({ header }: { header: any }) => Boolean(header)
});

ResultsTable.Cell = styled(ResultsTableCellText)({
  margin: ({ first, last }: { first: boolean; last: boolean }) => [
    first ? 14 : 5,
    8,
    last ? 14 : 5,
    10
  ]
});

ResultsTable.Row = Table.Row;

type InputsTableProps = Pick<
  PdfDocumentProps,
  "submittedValues" | "treeFieldsDisplay" | "fieldLabels"
> & {
  [other: string]: any;
};

const InputsTable = ({
  submittedValues,
  treeFieldsDisplay,
  fieldLabels,
  ...rest
}: InputsTableProps) => (
  <ResultsTable headerRows={0} {...rest}>
    {/* TODO: type the input list or take this array as a prop */}
    {["guarantee", "combustible", "insulated", "color"].map((field) =>
      // eslint-disable-next-line security/detect-object-injection
      typeof submittedValues[field as keyof FormValues] !== undefined &&
      // eslint-disable-next-line security/detect-object-injection
      treeFieldsDisplay[field].label /* Only display known fields */ ? (
        <ResultsTable.Row key={field}>
          <ResultsTable.Cell header>
            {/* eslint-disable-next-line security/detect-object-injection */}
            {treeFieldsDisplay[field].label}:
          </ResultsTable.Cell>
          <ResultsTable.Cell>
            {
              // eslint-disable-next-line security/detect-object-injection
              treeFieldsDisplay[field].options[
                submittedValues[field as keyof FormValues]!
              ].label
            }
          </ResultsTable.Cell>
        </ResultsTable.Row>
      ) : null
    )}
    <ResultsTable.Row>
      <ResultsTable.Cell header>{fieldLabels.fieldArea}:</ResultsTable.Cell>
      <Row margin={[5, 8, 14, 10]}>
        <Col width={"auto"}>
          <ResultsTableCellText>
            {submittedValues.fieldArea}m
          </ResultsTableCellText>
        </Col>
        <Col width={"auto"}>
          <ResultsTableCellText fontSize={8}>2</ResultsTableCellText>
        </Col>
      </Row>
    </ResultsTable.Row>
    {submittedValues.upstandHeight && submittedValues.upstandLength ? (
      <ResultsTable.Row>
        <ResultsTable.Cell header>{fieldLabels.upstand}:</ResultsTable.Cell>
        <ResultsTable.Cell>
          {submittedValues.upstandHeight}mm x {submittedValues.upstandLength}m
        </ResultsTable.Cell>
      </ResultsTable.Row>
    ) : null}
    {submittedValues.kerbHeight && submittedValues.kerbLength ? (
      <ResultsTable.Row>
        <ResultsTable.Cell header>{fieldLabels.kerb}:</ResultsTable.Cell>
        <ResultsTable.Cell>
          {submittedValues.kerbHeight}mm x {submittedValues.kerbLength}m
        </ResultsTable.Cell>
      </ResultsTable.Row>
    ) : null}
    {submittedValues.detailHeight1 && submittedValues.detailLength1 ? (
      <ResultsTable.Row>
        <ResultsTable.Cell header>{fieldLabels.detail}:</ResultsTable.Cell>
        <ResultsTable.Cell>
          {submittedValues.detailHeight1}mm x {submittedValues.detailLength1}m
        </ResultsTable.Cell>
      </ResultsTable.Row>
    ) : null}
    {submittedValues.detailHeight2 && submittedValues.detailLength2 ? (
      <ResultsTable.Row>
        <ResultsTable.Cell header>{fieldLabels.detail}:</ResultsTable.Cell>
        <ResultsTable.Cell>
          {submittedValues.detailHeight2}mm x {submittedValues.detailLength2}m
        </ResultsTable.Cell>
      </ResultsTable.Row>
    ) : null}
  </ResultsTable>
);

const ShareableLink = styled(Link)({
  fontSize: 10,
  lineHeight: 1.4,
  color: "#007BBD"
});

const shouldAddPageBreak = (
  currentNode: any,
  followingNodesOnPage: any[],
  nodesOnNextPage: any[],
  previousNodesOnPage: any[]
): boolean => {
  if (!previousNodesOnPage.length) {
    // Don't break if it's the first element on the page, otherwise, we'd get a blank page.
    return false;
  }

  if (currentNode.headlineLevel === 0) {
    // Start important parts on a new page (e.g. new chapter, etc...)
    return true;
  }

  if (!nodesOnNextPage.length) {
    // Don't break if the rest of the content fits on this page (and it's not a headlineLevel 0).
    return false;
  }

  const fixedElement = 6; // header, footer, and background elements (including container ones).

  if (
    currentNode.headlineLevel === 1 &&
    followingNodesOnPage.length <
      fixedElement +
        3 /* at least show one more element next to the headline 1 and its underline */
  ) {
    return true;
  }

  if (
    currentNode.headlineLevel === 2 &&
    followingNodesOnPage.length <
      fixedElement +
        2 /* at least show one more element next to the headline 2 */
  ) {
    return true;
  }

  return false;
};

const HeaderText = styled(Text)({
  fontSize: 14,
  lineHeight: 1.92 /* roughly 27pt */,
  color: "#007BBD",
  bold: true,
  alignment: "right",
  margin: [0, 27, 23, 22]
});

const Header = () => (
  <>
    <Row>
      <Col>
        <SVG width={118} margin={[25, 13]}>{`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 229.724 90">
    <defs>
    <style>
    .a{fill:#009fe3}.b{fill:#fff}
    </style>
    </defs>
    <path class="a" d="M223.413 29.589h6.312v31.032h-6.312zM102.895 37.227h6.312V60.62h-6.312zM102.895 29.631h6.312v5.905h-6.312zM152.117 54.848a5.935 5.935 0 115.935-5.934 5.934 5.934 0 01-5.935 5.934m0-18.09a12.156 12.156 0 1012.157 12.157 12.156 12.156 0 00-12.157-12.157M130.594 49.88a5.927 5.927 0 11-.026-2.093h6.277a12.163 12.163 0 10.013 2.093zM219.579 48.844a12.156 12.156 0 10-12.154 12.186 11.725 11.725 0 004.507-.917v-7.418a5.9 5.9 0 111.429-3.819v10.548l.015-.007v1.205h6.21V48.845zM179.61 36.717a12.154 12.154 0 00-12.153 12.124v20.233h6.21V48.883h.012v-.009a6 6 0 111.431 3.825v7.418a11.731 11.731 0 004.5.915 12.157 12.157 0 000-24.314zM0 0h90v90H0z"/>
    <g>
    <path class="b" d="M55.954 31.339l-3.9 16.072h-.076L48.07 31.339H36.095V49.59a6.583 6.583 0 00-4.717-6.043 5.629 5.629 0 003.368-5.358c0-2.794-1.53-6.85-8.724-6.85H11.063v27.322h15.5c4.609 0 9.145-2.59 9.536-7.6v7.6h7.96V41.136h.076l4.743 17.525h6.276l4.743-17.525h.076v17.525h7.96V31.339zm-36.476 6.506h4.44c1.722 0 2.869.5 2.869 1.876 0 1.76-1.109 2.257-2.869 2.257h-4.44zm4.937 14.31h-4.937v-5.089h5.282c1.989 0 2.945.88 2.945 2.486 0 2.105-1.53 2.6-3.29 2.6M70.518 31.341h8.419v27.32h-8.419z"/>
    </g>
    </svg>
    `}</SVG>
      </Col>
      <Col>
        <HeaderText>Bitumen Flat Roof Estimator</HeaderText>
      </Col>
    </Row>
    <Hr width={PAGE_WIDTH} thickness={1} color={"#CCCCCC"} />
  </>
);

type FooterProps = {
  currentPage: number;
  pageCount: number;
};

const Footer = ({ currentPage, pageCount }: Partial<FooterProps>) => (
  <Text alignment={"center"} fontSize={10} marginTop={5}>
    {currentPage} / {pageCount}
  </Text>
);

type PdfDocumentProps = {
  systemName: string;
  resultProducts: ResultProduct[];
  link: string;
  submittedValues: FormValues;
  treeFieldsDisplay: FieldsDisplay;
  fieldLabels: FieldLabels;
  resultsContent: ResultsContent;
  urlPrefix: string;
};

const PdfDocument = ({
  systemName,
  resultProducts,
  link,
  submittedValues,
  treeFieldsDisplay,
  fieldLabels,
  resultsContent,
  urlPrefix
}: PdfDocumentProps) => (
  <Document
    pageSize={"A4"} // Full list is in the type
    pageOrientation={"portrait"} // or "landscape"
    pageMargins={[
      25 /* Left */,
      72 /* header */ + 35 /* header margin */,
      25 /* Right */,
      35 /* Bottom (should include footer space) */
    ]}
    header={<Header />}
    footer={<Footer />}
    pageBreakBefore={shouldAddPageBreak}
    images={{
      "3d": `${window.location.origin}${urlPrefix}${encodeURIComponent(
        `${systemName} ${((submittedValues || {})["color"] || "").replace(
          /\//g,
          "-"
        )}.jpg`
      )}`
    }}
    defaultStyle={{
      font: "Effra"
    }}
  >
    <Typography variant={"h1"} marginBottom={24}>
      {resultsContent.header}
    </Typography>
    <Typography headlineLevel={2} variant={"h4"} marginBottom={12}>
      {systemName}
    </Typography>
    <LessWidth>
      <Typography>{resultsContent.systemDescription}</Typography>
    </LessWidth>
    <Bullets>
      {resultsContent.features.map((i, index) => (
        <Bullets.Item key={index}>{i}</Bullets.Item>
      ))}
    </Bullets>
    <Img src={"3d"} width={(PAGE_WIDTH * 8) / 12 - 50} marginBottom={20} />
    <Typography headlineLevel={0} variant={"h4"} hasUnderline marginBottom={20}>
      {resultsContent.systemContentHeader}
    </Typography>
    <ResultsTable marginBottom={20} widths={[60, 50, 200, 70, 58, 60]}>
      <ResultsTable.Row>
        <ResultsTable.Cell header>
          {resultsContent.systemContentColumns.buildUp}
        </ResultsTable.Cell>
        <ResultsTable.Cell header>
          {resultsContent.systemContentColumns.category}
        </ResultsTable.Cell>
        <ResultsTable.Cell header>
          {resultsContent.systemContentColumns.product}
        </ResultsTable.Cell>
        <ResultsTable.Cell header>
          {resultsContent.systemContentColumns.code}
        </ResultsTable.Cell>
        <ResultsTable.Cell header>
          {resultsContent.systemContentColumns.quantity}
        </ResultsTable.Cell>
        <ResultsTable.Cell header>
          {resultsContent.systemContentColumns.unit}
        </ResultsTable.Cell>
      </ResultsTable.Row>
      {resultProducts.map((product) => (
        <ResultsTable.Row key={product.code}>
          <ResultsTable.Cell>{product.buildUp}</ResultsTable.Cell>
          <ResultsTable.Cell>{product.category}</ResultsTable.Cell>
          <ResultsTable.Cell>{product.description}</ResultsTable.Cell>
          <ResultsTable.Cell>{product.code}</ResultsTable.Cell>
          <ResultsTable.Cell>{product.quantity}</ResultsTable.Cell>
          <ResultsTable.Cell>{product.size}</ResultsTable.Cell>
        </ResultsTable.Row>
      ))}
    </ResultsTable>
    <Typography headlineLevel={2} variant={"h5"} marginBottom={5}>
      {resultsContent.extraItemsHeader}
    </Typography>
    <LessWidth>
      <Typography marginBottom={12}>
        {resultsContent.extraItemsDescription}
      </Typography>
    </LessWidth>
    <Bullets marginBottom={9}>
      {resultsContent.extraItems.map((i, index) => (
        <Bullets.Item key={index}>{i}</Bullets.Item>
      ))}
    </Bullets>
    <Typography headlineLevel={0} variant={"h5"} marginBottom={5}>
      {resultsContent.inputHeader}
    </Typography>
    <LessWidth>
      <Typography marginBottom={20}>
        {resultsContent.inputDescription}
      </Typography>
    </LessWidth>
    <InputsTable
      marginBottom={20}
      {...{ submittedValues, treeFieldsDisplay, fieldLabels }}
    />
    <Typography headlineLevel={2} variant={"h5"} marginBottom={5}>
      {resultsContent.disclaimerHeader}
    </Typography>
    <Typography marginBottom={24}>{resultsContent.disclaimer}</Typography>
    {submittedValues["companyName"] || submittedValues["projectName"] ? (
      <>
        <Typography headlineLevel={2} variant={"h5"} marginBottom={5}>
          {resultsContent.projectInformationHeader}
        </Typography>
        <ResultsTable headerRows={0} marginBottom={24}>
          {submittedValues["companyName"] ? (
            <ResultsTable.Row>
              <ResultsTable.Cell header>
                {fieldLabels["companyName"]}:
              </ResultsTable.Cell>
              <ResultsTable.Cell>
                {submittedValues["companyName"]}
              </ResultsTable.Cell>
            </ResultsTable.Row>
          ) : null}
          {submittedValues["projectName"] ? (
            <ResultsTable.Row>
              <ResultsTable.Cell header>
                {fieldLabels["projectName"]}:
              </ResultsTable.Cell>
              <ResultsTable.Cell>
                {submittedValues["projectName"]}
              </ResultsTable.Cell>
            </ResultsTable.Row>
          ) : null}
        </ResultsTable>
      </>
    ) : null}
    <Typography headlineLevel={1} variant={"h4"} hasUnderline marginBottom={14}>
      {resultsContent.shareLinkHeader}
    </Typography>
    <Typography variant={"body2"}>
      {resultsContent.shareLinkDescription}
    </Typography>
    <ShareableLink href={link}>{link.substr(0, 30)}...</ShareableLink>
  </Document>
);

const openPdf = (props: PdfDocumentProps) => {
  return pdf(<PdfDocument {...props} />, undefined, {
    Effra: {
      normal: window.location.origin + EffraNormal,
      bold: window.location.origin + EffraBold
    }
  }).open();
};

export default openPdf;
