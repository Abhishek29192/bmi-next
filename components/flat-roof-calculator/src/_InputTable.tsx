import React from "react";
import classnames from "classnames";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import { FieldsDisplay } from "./types/FieldsDisplay";
import styles from "./FlatRoofCalculator.module.scss";
import { fieldLabels } from "./FlatRoofCalculator";
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
          typeof submittedValues[field] !== undefined &&
          treeFieldsDisplay[field].label /* Only display known fields */ ? (
            <TableRow key={field}>
              <TableCell
                className={classnames(styles.cell, styles["cell--bold"])}
              >
                {treeFieldsDisplay[field].label}:
              </TableCell>
              <TableCell className={styles.cell}>
                {treeFieldsDisplay[field].options[submittedValues[field]].label}
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
