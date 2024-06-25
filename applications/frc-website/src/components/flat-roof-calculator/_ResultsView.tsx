import AnchorLink from "@bmi-digital/components/anchor-link";
import Bullets from "@bmi-digital/components/bullets";
import Button from "@bmi-digital/components/button";
import Grid from "@bmi-digital/components/grid";
import ArrowBackIcon from "@bmi-digital/components/icon/ArrowBack";
import EditOutlinedIcon from "@bmi-digital/components/icon/EditOutlined";
import SaveAltIcon from "@bmi-digital/components/icon/SaveAlt";
import Typography from "@bmi-digital/components/typography";
import Divider from "@mui/material/Divider";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import classnames from "classnames";
import React, { useState } from "react";
import { fieldLabels } from "./FlatRoofCalculator";
import InputTable from "./_InputTable";
import Section from "./_Section";
import { StyledTable } from "./styles/FlatRoofCalculatorStyles";
import { FieldsDisplay } from "./types/FieldsDisplay";
import { FormValues } from "./types/FormValues";
import { ResultProduct } from "./types/ResultProduct";
import { ResultsContent } from "./types/ResultsContent";

type Props = {
  resultsContent: ResultsContent;
  systemName: string;
  submittedValues: FormValues;
  resultProducts: ResultProduct[];
  treeFieldsDisplay: FieldsDisplay;
  link: string;
  calculateNewRoofButtonLabel: string;
  edit: () => void;
  editButtonLabel: string;
  downloadPdfButtonLoadingLabel: string;
  downloadPdfButtonLabel: string;
  urlPrefix: string;
};

const ResultsView = ({
  resultsContent,
  systemName,
  submittedValues,
  resultProducts,
  treeFieldsDisplay,
  link,
  calculateNewRoofButtonLabel,
  edit,
  editButtonLabel,
  downloadPdfButtonLoadingLabel,
  downloadPdfButtonLabel,
  urlPrefix
}: Props) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  return (
    <>
      <Section data-testid="flat-roof-calculator-results-view-section">
        <Typography variant="h1" hasUnderline className="header">
          {resultsContent.header}
        </Typography>
        <Typography variant="h4" className="systemName">
          {systemName}
        </Typography>
        <Grid container>
          <Grid lg={9}>
            <Typography>{resultsContent.systemDescription}</Typography>
          </Grid>
        </Grid>
        <Bullets style={{ marginTop: 12 }}>
          {resultsContent.features.map((i, index) => (
            <Bullets.Item key={index}>{i}</Bullets.Item>
          ))}
        </Bullets>
        <Grid container>
          <Grid md={8}>
            <img
              src={`${urlPrefix}${encodeURIComponent(
                systemName
              )} ${encodeURIComponent(
                ((submittedValues || {}).color || "").replace(/\//g, "-")
              )}.jpg`}
              className="img"
              alt={systemName}
            />
          </Grid>
        </Grid>
      </Section>
      <Section
        lessMargin
        data-testid="flat-roof-calculator-results-view-content-section"
      >
        <Typography hasUnderline variant="h4" className="systemName">
          {resultsContent.systemContentHeader}
        </Typography>
        <TableContainer component={"div"}>
          <StyledTable>
            <TableHead className="head">
              <TableRow className="row">
                <TableCell className={classnames("cell", "cell--bold")}>
                  {resultsContent.systemContentColumns.buildUp}
                </TableCell>
                <TableCell className={classnames("cell", "cell--bold")}>
                  {resultsContent.systemContentColumns.category}
                </TableCell>
                <TableCell className={classnames("cell", "cell--bold")}>
                  {resultsContent.systemContentColumns.product}
                </TableCell>
                <TableCell className={classnames("cell", "cell--bold")}>
                  {resultsContent.systemContentColumns.code}
                </TableCell>
                <TableCell className={classnames("cell", "cell--bold")}>
                  {resultsContent.systemContentColumns.quantity}
                </TableCell>
                <TableCell className={classnames("cell", "cell--bold")}>
                  {resultsContent.systemContentColumns.unit}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultProducts.map((product) => (
                <TableRow key={product.code}>
                  <TableCell className={"cell"}>{product.buildUp}</TableCell>
                  <TableCell className={"cell"}>{product.category}</TableCell>
                  <TableCell className={"cell"}>
                    {product.description}
                  </TableCell>
                  <TableCell className={"cell"}>{product.code}</TableCell>
                  <TableCell className={"cell"}>{product.quantity}</TableCell>
                  <TableCell className={"cell"}>{product.size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </Section>
      <Section
        xLessMargin
        data-testid="flat-roof-calculator-results-view-extra-items-section"
      >
        <Typography variant="h5" className="helpHeader">
          {resultsContent.extraItemsHeader}
        </Typography>
        <Grid container>
          <Grid lg={9}>
            <Typography
              variant="body1"
              className={classnames("description", "description--less-margin")}
            >
              {resultsContent.extraItemsDescription}
            </Typography>
          </Grid>
        </Grid>
        <Bullets>
          {resultsContent.extraItems.map((i, index) => (
            <Bullets.Item key={index}>{i}</Bullets.Item>
          ))}
        </Bullets>
      </Section>
      <Section
        xLessMargin
        data-testid="flat-roof-calculator-results-view-inputs-section"
      >
        <Typography variant="h5" className="helpHeader">
          {resultsContent.inputHeader}
        </Typography>
        <Grid container>
          <Grid lg={9}>
            <Typography variant="body1" className={"description"}>
              {resultsContent.inputDescription}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid lg={6}>
            <InputTable
              submittedValues={submittedValues}
              treeFieldsDisplay={treeFieldsDisplay}
            />
          </Grid>
        </Grid>
      </Section>
      <Section
        lessMargin
        data-testid="flat-roof-calculator-results-view-disclaimer-section"
      >
        <Typography variant="h5" className="helpHeader">
          {resultsContent.disclaimerHeader}
        </Typography>
        <Grid container>
          <Grid lg={9}>
            <Typography variant="body1">{resultsContent.disclaimer}</Typography>
          </Grid>
        </Grid>
      </Section>
      {submittedValues &&
      (submittedValues.companyName || submittedValues.projectName) ? (
        <Section
          xLessMargin
          data-testid="flat-roof-calculator-results-view-project-information-section"
        >
          <Typography variant="h5" className="helpHeader">
            {resultsContent.projectInformationHeader}
          </Typography>
          <Grid container>
            <Grid xs={12} sm={6} lg={4}>
              <TableContainer component={"div"}>
                <StyledTable>
                  <TableBody>
                    {submittedValues.companyName ? (
                      <TableRow className="row">
                        <TableCell className={classnames("cell", "cell--bold")}>
                          {fieldLabels.companyName}:
                        </TableCell>
                        <TableCell className={"cell"}>
                          {submittedValues.companyName}
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {submittedValues.projectName ? (
                      <TableRow className="row">
                        <TableCell className={classnames("cell", "cell--bold")}>
                          {fieldLabels.projectName}:
                        </TableCell>
                        <TableCell className={"cell"}>
                          {submittedValues.projectName}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </StyledTable>
              </TableContainer>
            </Grid>
          </Grid>
        </Section>
      ) : null}
      <Section data-testid="flat-roof-calculator-results-view-share-link-section">
        <Typography
          variant="h4"
          hasUnderline
          className={classnames("helpHeader", "helpHeader--extra-margin")}
        >
          {resultsContent.shareLinkHeader}
        </Typography>
        <Typography
          variant="body2"
          className={classnames("description", "description--less-margin")}
        >
          {resultsContent.shareLinkDescription}
        </Typography>
        <div className="linkContainer">
          <AnchorLink href={link} className="link">
            {link}
          </AnchorLink>
        </div>
      </Section>
      <Divider className="divider" />
      <div className="spaceBetweens">
        <div>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            href={`/${window.location.search}`}
            className="item"
          >
            {calculateNewRoofButtonLabel}
          </Button>
          <Button
            startIcon={<EditOutlinedIcon />}
            variant="outlined"
            onClick={() => {
              edit();
              window.scrollTo(0, 0);
            }}
            className="item"
          >
            {editButtonLabel}
          </Button>
        </div>
        <Button
          className="item"
          endIcon={<SaveAltIcon />}
          disabled={pdfLoading}
          onClick={async () => {
            if (pdfLoading) {
              return;
            }
            try {
              setPdfLoading(true);
              if (typeof window !== "undefined" && "gtag" in window) {
                (window as any)["gtag"]("event", "PDF Download", {
                  event_category: "Download"
                });
              }
              const openPDF = (await import("./pdfExport")).default;
              await openPDF({
                systemName,
                resultProducts,
                link,
                submittedValues,
                treeFieldsDisplay,
                fieldLabels,
                resultsContent,
                urlPrefix
              });
            } catch (error) {
              if (process.env.NODE_ENV === "development") {
                throw error;
              }
            } finally {
              setPdfLoading(false);
            }
          }}
        >
          {pdfLoading ? downloadPdfButtonLoadingLabel : downloadPdfButtonLabel}
        </Button>
      </div>
    </>
  );
};

export default ResultsView;
