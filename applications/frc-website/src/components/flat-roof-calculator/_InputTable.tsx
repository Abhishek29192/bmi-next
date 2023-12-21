import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import classnames from "classnames";
import React from "react";
import { fieldLabels } from "./FlatRoofCalculator";
import { StyledTable } from "./styles/FlatRoofCalculatorStyles";
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
    <StyledTable>
      <TableBody>
        {["guarantee", "combustible", "insulated", "color"].map((field) =>
          // eslint-disable-next-line security/detect-object-injection
          submittedValues[field as keyof FormValues] !== undefined &&
          // eslint-disable-next-line security/detect-object-injection
          treeFieldsDisplay[field].label /* Only display known fields */ ? (
            <TableRow key={field}>
              <TableCell className={classnames("cell", "cell--bold")}>
                {/* eslint-disable-next-line security/detect-object-injection */}
                {treeFieldsDisplay[field].label}:
              </TableCell>
              <TableCell className="cell">
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
        <TableRow className="row">
          <TableCell className={classnames("cell", "cell--bold")}>
            {fieldLabels.fieldArea}:
          </TableCell>
          <TableCell className="cell">
            {submittedValues.fieldArea}m<sup>2</sup>
          </TableCell>
        </TableRow>
        {submittedValues.upstandHeight && submittedValues.upstandLength ? (
          <TableRow className="row">
            <TableCell className={classnames("cell", "cell--bold")}>
              {fieldLabels.upstand}:
            </TableCell>
            <TableCell className="cell">
              {submittedValues.upstandHeight}mm x{" "}
              {submittedValues.upstandLength}m
            </TableCell>
          </TableRow>
        ) : null}
        {submittedValues.kerbHeight && submittedValues.kerbLength ? (
          <TableRow className="row">
            <TableCell className={classnames("cell", "cell--bold")}>
              {fieldLabels.kerb}:
            </TableCell>
            <TableCell className="cell">
              {submittedValues.kerbHeight}mm x {submittedValues.kerbLength}m
            </TableCell>
          </TableRow>
        ) : null}
        {submittedValues.detailHeight1 && submittedValues.detailLength1 ? (
          <TableRow className="row">
            <TableCell className={classnames("cell", "cell--bold")}>
              {fieldLabels.detail}:
            </TableCell>
            <TableCell className="cell">
              {submittedValues.detailHeight1}mm x{" "}
              {submittedValues.detailLength1}m
            </TableCell>
          </TableRow>
        ) : null}
        {submittedValues.detailHeight2 && submittedValues.detailLength2 ? (
          <TableRow className="row">
            <TableCell className={classnames("cell", "cell--bold")}>
              {fieldLabels.detail}:
            </TableCell>
            <TableCell className="cell">
              {submittedValues.detailHeight2}mm x{" "}
              {submittedValues.detailLength2}m
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </StyledTable>
  </TableContainer>
);

export default InputTable;
