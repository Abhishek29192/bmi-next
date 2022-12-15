import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import classnames from "classnames";
import React from "react";
import { fieldLabels } from "./FlatRoofCalculator";
import styles from "./FlatRoofCalculator.module.scss";
import { FieldsDisplay } from "./types/FieldsDisplay";
import { FormValues } from "./types/FormValues";

const InputTable = ({
  submittedValues,
  treeFieldsDisplay
}: {
  submittedValues: FormValues;
  treeFieldsDisplay: FieldsDisplay;
}) => (
  <TableContainer component={"div"}>
    <Table className={styles.Table}>
      <TableBody>
        {["guarantee", "combustible", "insulated", "color"].map((field) =>
          // eslint-disable-next-line security/detect-object-injection
          typeof submittedValues[field as keyof FormValues] !== undefined &&
          // eslint-disable-next-line security/detect-object-injection
          treeFieldsDisplay[field].label /* Only display known fields */ ? (
            <TableRow key={field}>
              <TableCell
                className={classnames(styles.cell, styles["cell--bold"])}
              >
                {/* eslint-disable-next-line security/detect-object-injection */}
                {treeFieldsDisplay[field].label}:
              </TableCell>
              <TableCell className={styles.cell}>
                {
                  // eslint-disable-next-line security/detect-object-injection
                  treeFieldsDisplay[field].options[
                    submittedValues[field as keyof FormValues]!
                  ].label
                }
              </TableCell>
            </TableRow>
          ) : null
        )}
        <TableRow className={styles.row}>
          <TableCell className={classnames(styles.cell, styles["cell--bold"])}>
            {fieldLabels.fieldArea}:
          </TableCell>
          <TableCell className={styles.cell}>
            {submittedValues.fieldArea}m<sup>2</sup>
          </TableCell>
        </TableRow>
        {submittedValues.upstandHeight && submittedValues.upstandLength ? (
          <TableRow className={styles.row}>
            <TableCell
              className={classnames(styles.cell, styles["cell--bold"])}
            >
              {fieldLabels.upstand}:
            </TableCell>
            <TableCell className={styles.cell}>
              {submittedValues.upstandHeight}mm x{" "}
              {submittedValues.upstandLength}m
            </TableCell>
          </TableRow>
        ) : null}
        {submittedValues.kerbHeight && submittedValues.kerbLength ? (
          <TableRow className={styles.row}>
            <TableCell
              className={classnames(styles.cell, styles["cell--bold"])}
            >
              {fieldLabels.kerb}:
            </TableCell>
            <TableCell className={styles.cell}>
              {submittedValues.kerbHeight}mm x {submittedValues.kerbLength}m
            </TableCell>
          </TableRow>
        ) : null}
        {submittedValues.detailHeight1 && submittedValues.detailLength1 ? (
          <TableRow className={styles.row}>
            <TableCell
              className={classnames(styles.cell, styles["cell--bold"])}
            >
              {fieldLabels.detail}:
            </TableCell>
            <TableCell className={styles.cell}>
              {submittedValues.detailHeight1}mm x{" "}
              {submittedValues.detailLength1}m
            </TableCell>
          </TableRow>
        ) : null}
        {submittedValues.detailHeight2 && submittedValues.detailLength2 ? (
          <TableRow className={styles.row}>
            <TableCell
              className={classnames(styles.cell, styles["cell--bold"])}
            >
              {fieldLabels.detail}:
            </TableCell>
            <TableCell className={styles.cell}>
              {submittedValues.detailHeight2}mm x{" "}
              {submittedValues.detailLength2}m
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  </TableContainer>
);

export default InputTable;
