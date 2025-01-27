import {
  Canvas,
  Document,
  Img,
  pdf,
  styled,
  SVG,
  Table,
  Text,
  View
} from "@bmi-digital/react-pdf-maker";
import React from "react";
import { isElement } from "react-is";
import { microCopy, MicroCopyValues } from "@bmi/microcopies";
import EffraBold from "./fonts/Effra_Bd.ttf";
import EffraNormal from "./fonts/Effra_Rg.ttf";
import { CONTINGENCY_PERCENTAGE_TEXT } from "./calculation/constants";
import { ResultsObject, ResultsRow } from "./types";

const PAGE_WIDTH = 595.28; /* A4 width in pt */
const MARGIN_LEFT = 25;
const MARGIN_RIGHT = 25;
const MARGIN_TOP = 35;
const MARGIN_BOTTOM = 35;
const CELL_HEIGHT = 50;
const CELL_TOP_MARGIN = 8;

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
    lineHeight: 1.33,
    bold: true
  },
  h2: {
    fontSize: 18,
    lineHeight: 1.33,
    bold: true
  },
  h4: {
    fontSize: 16,
    lineHeight: 1.625,
    bold: true
  },
  h5: {
    fontSize: 12,
    lineHeight: 1.65,
    bold: true
  },
  h6: {
    fontSize: 16,
    lineHeight: 2.7,
    bold: true
  },
  body1: {
    fontSize: 10,
    lineHeight: 1.4
  },
  body2: {
    fontSize: 12,
    lineHeight: 1.4,
    bold: true
  }
};

type TypographProps = {
  variant?: keyof typeof textStyles;
  hasUnderline?: boolean;
  center?: boolean;
  sub?: boolean;
  sup?: boolean;
  textProps?: Record<string, unknown>;
  children: React.ReactNode;
  [rest: string]: any;
};

export const Typography = ({
  variant = "body1",
  hasUnderline = variant === "h1",
  center,
  textProps = {},
  children,
  ...rest
}: TypographProps) => {
  const text = (
    <Text
      // eslint-disable-next-line security/detect-object-injection
      {...textStyles[variant]}
      alignment={center ? "center" : "left"}
      {...(hasUnderline ? {} : rest)}
      {...textProps}
    >
      {children}
    </Text>
  );

  return hasUnderline ? (
    <View {...rest}>
      {text}
      {hasUnderline ? <Underline large={variant === "h1"} /> : null}
    </View>
  ) : (
    text
  );
};

type AlertProps = {
  title?: string;
  type?: "warn" | "default";
  color?: string;
  fillColor?: string;
  children?: React.ReactNode;
  [rest: string]: any;
};

const alertStyles = {
  warn: { color: "#3B3B3B", fillColor: "#FFC72C" },
  default: { color: "#3B3B3B", fillColor: "#F0F0F0" }
};

const Alert = ({
  title,
  children,
  type = "default",
  color,
  fillColor,
  ...rest
}: AlertProps): any => {
  const cellProps = {
    // eslint-disable-next-line security/detect-object-injection
    color: alertStyles[type].color,
    // eslint-disable-next-line security/detect-object-injection
    fillColor: alertStyles[type].fillColor
  };

  return {
    table: {
      widths: [PAGE_WIDTH],
      body: [
        title && [
          {
            text: title,
            bold: true,
            margin: [MARGIN_LEFT, 15, MARGIN_RIGHT, children ? 5 : 15],
            ...cellProps
          }
        ],
        children && [
          {
            text: children,
            margin: [MARGIN_LEFT, title ? 0 : 15, MARGIN_RIGHT, 15],
            ...cellProps
          }
        ]
      ].filter(Boolean)
    },
    marginLeft: -MARGIN_LEFT,
    layout: "noBorders",
    ...rest
  };
};

type ResultsTableTemplateProps = {
  children: React.ReactNode;
  layout?: Record<string, unknown>;
  headerRows?: number;
  widths?: Array<string | number>;
  [rest: string]: any;
};

const ResultsTableTemplate = ({
  children,
  layout,
  headerRows = 1,
  ...rest
}: ResultsTableTemplateProps) => {
  const rows = React.Children.map(children, (node, i) => {
    if (!isElement(node)) {
      return node;
    }

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
        hLineColor: () => "#E0E0E0",
        vLineColor: () => "#CCCCCC",
        vLineWidth: (i: number, node: any) =>
          i === 0 || i === node.table.widths.length ? 1 : 0,
        fillColor: (i: number) =>
          i < headerRows || (i - headerRows) % 2 ? "#F7F7F7" : null,
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
  bold: ({ header }: { header: any }) => Boolean(header),
  height: CELL_HEIGHT
});

type ResultsTableTemplateCellProps = {
  children: React.ReactNode;
  hasWrapperRemoved?: boolean; // Used to for images and such, since they don't render inside a text
  first?: boolean;
  last?: boolean;
  [rest: string]: any;
};

const ResultsTableTemplateCell = ({
  children,
  hasWrapperRemoved,
  first,
  last,
  ...rest
}: ResultsTableTemplateCellProps) =>
  hasWrapperRemoved ? (
    <>{children}</>
  ) : (
    <ResultsTableCellText
      margin={[first ? 14 : 5, CELL_TOP_MARGIN, last ? 14 : 5, 10]}
      {...rest}
    >
      {children}
    </ResultsTableCellText>
  );

ResultsTableTemplate.Cell = ResultsTableTemplateCell;

ResultsTableTemplate.Row = Table.Row;

type GetMicroCopy = (
  path: MicroCopyValues,
  placeholders?: Record<string, string>
) => string;

type ResultsTableProps = {
  getMicroCopy: GetMicroCopy;
  children: React.ReactNode;
  [rest: string]: any;
};

const ResultsTable = ({
  getMicroCopy,
  children,
  ...rest
}: ResultsTableProps) => (
  <ResultsTableTemplate widths={[80, 180, 110, 70, 65]} {...rest}>
    <ResultsTableTemplate.Row>
      <ResultsTableTemplate.Cell header> </ResultsTableTemplate.Cell>
      <ResultsTableTemplate.Cell header>
        {getMicroCopy(microCopy.RESULTS_TABLE_TITLE)}
      </ResultsTableTemplate.Cell>
      <ResultsTableTemplate.Cell header>
        {getMicroCopy(microCopy.RESULTS_TABLE_PACK_SIZE)}
      </ResultsTableTemplate.Cell>
      <ResultsTableTemplate.Cell header>
        {getMicroCopy(microCopy.RESULTS_TABLE_EXTERNAL_PRODUCT_CODE)}
      </ResultsTableTemplate.Cell>
      <ResultsTableTemplate.Cell header>
        {getMicroCopy(microCopy.RESULTS_TABLE_QUANTITY)}
      </ResultsTableTemplate.Cell>
    </ResultsTableTemplate.Row>
    {children}
  </ResultsTableTemplate>
);

export const shouldAddPageBreak = (
  currentNode: any,
  followingNodesOnPage: any[],
  nodesOnNextPage: any[],
  previousNodesOnPage: any[]
): boolean => {
  const documentHeight =
    currentNode.startPosition.pageInnerHeight + MARGIN_TOP + MARGIN_BOTTOM;

  if (!previousNodesOnPage.length) {
    // Don't break if it's the first element on the page, otherwise, we'd get a blank page.
    return false;
  }

  if (currentNode.svg) {
    //Don't break header
    return false;
  }

  const elementTopPosition =
    currentNode.text && currentNode.height === CELL_HEIGHT
      ? //Decrease margin(Only text node has margin)
        currentNode.startPosition.top + CELL_HEIGHT - CELL_TOP_MARGIN
      : currentNode.startPosition.top + CELL_HEIGHT;
  if (documentHeight < elementTopPosition) {
    return true;
  }

  if (!nodesOnNextPage.length) {
    // Don't break if the rest of the content fits on this page (and it's not a headlineLevel 0).
    return false;
  }

  return false;
};

const Header = () => (
  <SVG width={40} margin={[25, 13]}>{`
<svg viewBox="0 0 250 250" class="CalculatorModal-module__headerSide--143wH CalculatorModal-module__logo--1zT3O"><path fill="#009fe3" d="M0 0h250v250H0z"></path><g fill="#fff"><path d="M155.393 86.416L144.565 131h-.212l-10.829-44.584H100.3v50.634c-.76-9.718-6.732-14.589-13.079-16.771 5.626-3.078 9.342-7.218 9.342-14.862 0-7.749-4.247-19-24.2-19H30.848v75.8h42.994c12.786 0 25.368-7.183 26.455-21.075v21.075h22.081V113.6h.212l13.164 48.62h17.41l13.163-48.62h.213v48.62h22.081v-75.8zM54.2 104.461h12.317c4.777 0 7.962 1.381 7.962 5.2 0 4.884-3.079 6.264-7.962 6.264H54.2zm13.694 39.7H54.2v-14.115h14.652c5.521 0 8.174 2.442 8.174 6.9 0 5.839-4.246 7.219-9.126 7.219zM195.798 86.416h23.355v75.797h-23.355z"></path></g></svg>
    `}</SVG>
);

type PdfDocumentProps = {
  results: ResultsObject;
  area: string;
  getMicroCopy: GetMicroCopy;
};

const mapResultsRow = ({
  image,
  description,
  packSize,
  externalProductCode,
  quantity
}: ResultsRow) => (
  <ResultsTableTemplate.Row key={externalProductCode}>
    <ResultsTableTemplate.Cell hasWrapperRemoved>
      {image ? <Img src={image} fit={[50, 50]} /> : ""}
    </ResultsTableTemplate.Cell>
    <ResultsTableTemplate.Cell>{description}</ResultsTableTemplate.Cell>
    <ResultsTableTemplate.Cell>{packSize}</ResultsTableTemplate.Cell>
    <ResultsTableTemplate.Cell>{externalProductCode}</ResultsTableTemplate.Cell>
    <ResultsTableTemplate.Cell>{quantity}</ResultsTableTemplate.Cell>
  </ResultsTableTemplate.Row>
);

const PdfDocument = ({ results, area, getMicroCopy }: PdfDocumentProps) => (
  <Document
    pageSize={"A4"} // Full list is in the type
    pageOrientation={"portrait"} // or "landscape"
    pageMargins={[
      MARGIN_LEFT,
      35 /* header */ + MARGIN_TOP,
      MARGIN_RIGHT,
      MARGIN_BOTTOM /* Bottom (should include footer space) */
    ]}
    header={<Header />}
    images={{}}
    pageBreakBefore={shouldAddPageBreak}
    defaultStyle={{
      font: "Effra"
    }}
  >
    <Typography variant="h2" hasUnderline={false} center>
      {getMicroCopy(microCopy.RESULTS_TITLE)}
    </Typography>
    <Typography variant="body2" center>
      {`${getMicroCopy(microCopy.RESULTS_AREA_LABEL)}: ${area}m`}
      <Typography sup>2</Typography>
    </Typography>
    <Typography variant="body1" center margin={[100, 0, 100, 0]}>
      {getMicroCopy(microCopy.RESULTS_SUBTITLE, {
        contingency: CONTINGENCY_PERCENTAGE_TEXT
      })}
    </Typography>
    {results.tiles.length ? (
      <>
        <Typography variant="h5" margin={[0, 25, 0, 10]} center>
          {getMicroCopy(microCopy.RESULTS_CATEGORIES_TITLES)}
        </Typography>
        <ResultsTable {...{ getMicroCopy }}>
          {results.tiles.map(mapResultsRow)}
        </ResultsTable>
      </>
    ) : null}
    {results.fixings.length ? (
      <>
        <Typography variant="h5" margin={[0, 25, 0, 10]} center>
          {getMicroCopy(microCopy.RESULTS_CATEGORIES_FIXINGS)}
        </Typography>
        <ResultsTable {...{ getMicroCopy }}>
          {results.fixings.map(mapResultsRow)}
        </ResultsTable>
      </>
    ) : null}
    {results.ventilation.length ? (
      <>
        <Typography variant="h5" margin={[0, 25, 0, 10]} center>
          {getMicroCopy(microCopy.RESULTS_CATEGORIES_VENTILATION)}
        </Typography>
        <ResultsTable {...{ getMicroCopy }}>
          {results.ventilation.map(mapResultsRow)}
        </ResultsTable>
      </>
    ) : null}
    {results.sealing.length ? (
      <>
        <Typography variant="h5" margin={[0, 25, 0, 10]} center>
          {getMicroCopy(microCopy.RESULTS_CATEGORIES_SEALING)}
        </Typography>
        <ResultsTable {...{ getMicroCopy }}>
          {results.sealing.map(mapResultsRow)}
        </ResultsTable>
      </>
    ) : null}
    {results.accessories.length ? (
      <>
        <Typography variant="h5" margin={[0, 25, 0, 10]} center>
          {getMicroCopy(microCopy.RESULTS_CATEGORIES_ACCESSORIES)}
        </Typography>
        <ResultsTable {...{ getMicroCopy }}>
          {results.accessories.map(mapResultsRow)}
        </ResultsTable>
      </>
    ) : null}
    {results.extras?.length ? (
      <>
        <Typography variant="h5" margin={[0, 25, 0, 10]} center>
          {getMicroCopy(microCopy.PDF_REPORT_EXTRAS_SECTION_TITLE)}
        </Typography>
        <ResultsTable {...{ getMicroCopy }}>
          {results.extras.map(mapResultsRow)}
        </ResultsTable>
      </>
    ) : null}
    <Alert
      title={getMicroCopy(microCopy.RESULTS_ALERTS_NEED_TO_KNOW_TITLE)}
      marginTop={40}
    >
      {getMicroCopy(microCopy.RESULTS_ALERTS_NEED_TO_KNOW_TEXT, {
        contingency: CONTINGENCY_PERCENTAGE_TEXT
      })}
    </Alert>
  </Document>
);

export const getPDF = (props: PdfDocumentProps) =>
  pdf(<PdfDocument {...props} />, undefined, {
    Effra: {
      normal: EffraNormal.startsWith("https://")
        ? EffraNormal
        : window.location.origin + "/" + EffraNormal,
      bold: EffraBold.startsWith("https://")
        ? EffraBold
        : window.location.origin + "/" + EffraBold
    }
  });

export const createPdf = (props: PdfDocumentProps) => getPDF(props);
const openPdf = (props: PdfDocumentProps) => createPdf(props).open();

export default openPdf;
