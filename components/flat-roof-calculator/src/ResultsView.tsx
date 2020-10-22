import React, { useState } from "react";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import Bullets from "@bmi/bullets";
import AnchorLink from "@bmi/anchor-link";
import Section from "./Section";
import classnames from "classnames";
import Divider from "@material-ui/core/Divider";
import Button from "@bmi/button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import {
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import styles from "./FlatRoofCalculator.module.scss";
import InputTable from "./InputTable";
import { fieldLabels } from "./FlatRoofCalculator";
import { ResultsContent } from "./types/ResultsContent";
import { FormValues } from "./types/FormValues";
import { ResultProduct } from "./types/ResultProduct";
import { FieldsDisplay } from "./types/FieldsDisplay";

type Props = {
  resultsContent: ResultsContent;
  systemName: string;
  submittedValues: FormValues;
  resultProducts: ResultProduct[];
  treeFieldsDisplay: FieldsDisplay;
  link: string;
  navigate: (to: string) => void;
  calculateNewRoofButtonLabel: string;
  edit: () => void;
  editButtonLabel: string;
  downloadPdfButtonLoadingLabel: string;
  downloadPdfButtonLabel: string;
};

const ResultsView = ({
  resultsContent,
  systemName,
  submittedValues,
  resultProducts,
  treeFieldsDisplay,
  link,
  navigate,
  calculateNewRoofButtonLabel,
  edit,
  editButtonLabel,
  downloadPdfButtonLoadingLabel,
  downloadPdfButtonLabel
}: Props) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  return (
    <>
      <Section>
        <Typography variant="h1" hasUnderline className={styles["header"]}>
          {resultsContent.header}
        </Typography>
        <Typography variant="h4" className={styles["systemName"]}>
          {systemName}
        </Typography>
        <Grid container>
          <Grid item lg={9}>
            <Typography>{resultsContent.systemDescription}</Typography>
          </Grid>
        </Grid>
        <Bullets style={{ marginTop: 12 }}>
          {resultsContent.features.map((i, index) => (
            <Bullets.Item key={index}>{i}</Bullets.Item>
          ))}
        </Bullets>
        <Grid container>
          <Grid item md={8}>
            <img
              src={`${process.env.FRC_URL_PREFIX || "/"}3d/${encodeURIComponent(
                systemName
              )} ${encodeURIComponent(
                ((submittedValues || {}).color || "").replace(/\//g, ":")
              )}.jpg`}
              className={styles.img}
            />
          </Grid>
        </Grid>
      </Section>
      <Section lessMargin>
        <Typography hasUnderline variant="h4" className={styles["systemName"]}>
          {resultsContent.systemContentHeader}
        </Typography>
        <TableContainer component={"div"}>
          <Table className={styles.Table}>
            <TableHead className={styles.head}>
              <TableRow className={styles.row}>
                <TableCell
                  className={classnames(styles.cell, styles["cell--bold"])}
                >
                  {resultsContent.systemContentColumns.buildUp}
                </TableCell>
                <TableCell
                  className={classnames(styles.cell, styles["cell--bold"])}
                >
                  {resultsContent.systemContentColumns.category}
                </TableCell>
                <TableCell
                  className={classnames(styles.cell, styles["cell--bold"])}
                >
                  {resultsContent.systemContentColumns.product}
                </TableCell>
                <TableCell
                  className={classnames(styles.cell, styles["cell--bold"])}
                >
                  {resultsContent.systemContentColumns.code}
                </TableCell>
                <TableCell
                  className={classnames(styles.cell, styles["cell--bold"])}
                >
                  {resultsContent.systemContentColumns.quantity}
                </TableCell>
                <TableCell
                  className={classnames(styles.cell, styles["cell--bold"])}
                >
                  {resultsContent.systemContentColumns.unit}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultProducts.map((product) => (
                <TableRow key={product.code}>
                  <TableCell className={styles.cell}>
                    {product.buildUp}
                  </TableCell>
                  <TableCell className={styles.cell}>
                    {product.category}
                  </TableCell>
                  <TableCell className={styles.cell}>
                    {product.description}
                  </TableCell>
                  <TableCell className={styles.cell}>{product.code}</TableCell>
                  <TableCell className={styles.cell}>
                    {product.quantity}
                  </TableCell>
                  <TableCell className={styles.cell}>{product.size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
      <Section xLessMargin>
        <Typography variant="h5" className={styles["helpHeader"]}>
          {resultsContent.extraItemsHeader}
        </Typography>
        <Grid container>
          <Grid item lg={9}>
            <Typography
              variant="body1"
              className={classnames(
                styles["description"],
                styles["description--less-margin"]
              )}
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
      <Section xLessMargin>
        <Typography variant="h5" className={styles["helpHeader"]}>
          {resultsContent.inputHeader}
        </Typography>
        <Grid container>
          <Grid item lg={9}>
            <Typography variant="body1" className={styles["description"]}>
              {resultsContent.inputDescription}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item lg={6}>
            <InputTable
              submittedValues={submittedValues}
              treeFieldsDisplay={treeFieldsDisplay}
            />
          </Grid>
        </Grid>
      </Section>
      <Section lessMargin>
        <Typography variant="h5" className={styles["helpHeader"]}>
          {resultsContent.disclaimerHeader}
        </Typography>
        <Grid container>
          <Grid item lg={9}>
            <Typography variant="body1">{resultsContent.disclaimer}</Typography>
          </Grid>
        </Grid>
      </Section>
      {submittedValues &&
      (submittedValues.companyName || submittedValues.projectName) ? (
        <Section xLessMargin>
          <Typography variant="h5" className={styles["helpHeader"]}>
            {resultsContent.projectInformationHeader}
          </Typography>
          <Grid container>
            <Grid item xs={12} sm={6} lg={4}>
              <TableContainer component={"div"}>
                <Table className={styles.Table}>
                  <TableBody>
                    {submittedValues.companyName ? (
                      <TableRow className={styles.row}>
                        <TableCell
                          className={classnames(
                            styles.cell,
                            styles["cell--bold"]
                          )}
                        >
                          {fieldLabels.companyName}:
                        </TableCell>
                        <TableCell className={styles.cell}>
                          {submittedValues.companyName}
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {submittedValues.projectName ? (
                      <TableRow className={styles.row}>
                        <TableCell
                          className={classnames(
                            styles.cell,
                            styles["cell--bold"]
                          )}
                        >
                          {fieldLabels.projectName}:
                        </TableCell>
                        <TableCell className={styles.cell}>
                          {submittedValues.projectName}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Section>
      ) : null}
      <Section>
        <Typography
          variant="h4"
          hasUnderline
          className={classnames(
            styles["helpHeader"],
            styles["helpHeader--extra-margin"]
          )}
        >
          {resultsContent.shareLinkHeader}
        </Typography>
        <Typography
          variant="body2"
          className={classnames(
            styles["description"],
            styles["description--less-margin"]
          )}
        >
          {resultsContent.shareLinkDescription}
        </Typography>
        <div className={styles["linkContainer"]}>
          <AnchorLink
            action={{ model: "htmlLink", href: link }}
            className={styles["link"]}
          >
            {link}
          </AnchorLink>
        </div>
      </Section>
      <Divider className={styles["divider"]} />
      <div className={styles["spaceBetween"]}>
        <div>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate("/" + window.location.search)}
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
            className={styles["item"]}
          >
            {editButtonLabel}
          </Button>
        </div>
        <Button
          className={styles["item"]}
          endIcon={<SaveAltIcon />}
          disabled={pdfLoading}
          onClick={async () => {
            if (pdfLoading) return;
            try {
              setPdfLoading(true);
              if (typeof window !== "undefined" && window["gtag"]) {
                window["gtag"]("event", "PDF Download", {
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
                resultsContent
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
