import { Icon, Table, Typography } from "@bmi-digital/components";
import { Delete } from "@mui/icons-material";

import classnames from "classnames";
import React from "react";
import { ResultsRow } from "../../../types";
import UpDownSimpleNumericInput from "../up-down-simple-numeric-input/UpDownSimpleNumericInput";
import { StyledQuantityTable, classes } from "./styles";

type BuildRowProps = {
  onDelete: (item: ResultsRow) => void;
  onChangeQuantity: (item: ResultsRow, newQuantity: number) => void;
  rows: ResultsRow[];
  packSize?: string;
  externalProductCode?: string;
  quantity?: string;
  remove?: string;
};

type HeaderProps = {
  title: string;
  packSize: string;
  externalProductCode: string;
  quantity: string;
  remove: string;
};

export type Props = {
  onDelete: (item: ResultsRow) => void;
  onChangeQuantity: (item: ResultsRow, newQuantity: number) => void;
  rows: ResultsRow[];
  title: string;
  packSize: string;
  externalProductCode: string;
  quantity: string;
  remove: string;
};

type SmallHeaderProps = {
  title: string;
};

const SmallHeader = ({ title }: SmallHeaderProps) => (
  <Table.Row>
    <Table.Cell>
      <Typography variant="h6">{title}</Typography>
    </Table.Cell>
  </Table.Row>
);

const MediumHeader = ({
  title,
  packSize,
  externalProductCode
}: Omit<HeaderProps, "remove" | "quantity">) => {
  return (
    <Table.Row>
      <Table.Cell className={classes.mediumHeaderFirstCell}>
        <Typography variant="h6">{title}</Typography>
      </Table.Cell>
      <Table.Cell className={classes.mediumHeaderCell}>
        <Typography variant="h6">{packSize}</Typography>
      </Table.Cell>
      <Table.Cell className={classes.mediumHeaderCell}>
        <Typography variant="h6">{externalProductCode}</Typography>
      </Table.Cell>
    </Table.Row>
  );
};

const LargeHeader = ({
  title,
  packSize,
  externalProductCode,
  quantity,
  remove
}: HeaderProps) => {
  return (
    <Table.Row>
      <Table.Cell className={classes.largeHeaderFirstCell}>
        <Typography variant="h6">{title}</Typography>
      </Table.Cell>
      <Table.Cell className={classes.header}>
        <Typography variant="h6">{packSize}</Typography>
      </Table.Cell>
      <Table.Cell className={classes.header}>
        <Typography variant="h6">{externalProductCode}</Typography>
      </Table.Cell>
      <Table.Cell className={classes.header}>
        <Typography variant="h6">{quantity}</Typography>
      </Table.Cell>
      <Table.Cell className={classes.header}>
        <Typography variant="h6">{remove}</Typography>
      </Table.Cell>
    </Table.Row>
  );
};

export const BuildSmallViewRows = ({
  onDelete,
  onChangeQuantity,
  rows,
  packSize,
  externalProductCode
}: BuildRowProps) => {
  return (
    <>
      {rows.map((row, iterator) => (
        <Table.Row
          key={`small-row-${row.externalProductCode}`}
          className={classnames(iterator % 2 !== 0 && classes.greyBack)}
        >
          <Table.Cell className={classes.smallCell}>
            <div>
              <div className={classes.cellRow}>
                <img src={row.image} className={classes.picture} />
                <Typography className={classes.smallDescription}>
                  {row.description}
                </Typography>
              </div>
              <div className={classes.cellRow}>
                <Typography variant="subtitle1">
                  {externalProductCode}:
                </Typography>
                <Typography className={classes.boldText}>
                  {row.externalProductCode}
                </Typography>
              </div>
              <div className={classes.cellRow}>
                <Typography variant="subtitle1">{packSize}:</Typography>
                <Typography className={classes.boldText}>
                  {row.packSize}
                </Typography>
              </div>
              <div className={classnames(classes.cellRow, classes.cellRowLast)}>
                <div className={classes.iteratorCellSmall}>
                  <UpDownSimpleNumericInput
                    name={row.externalProductCode.toString()}
                    min={0}
                    defaultValue={row.quantity}
                    onChange={(value) => onChangeQuantity(row, value)}
                  />
                </div>
                <Icon
                  aria-label={`Remove ${row.description}`}
                  role="button"
                  className={classes.icon}
                  source={Delete}
                  onClick={() => onDelete(row)}
                />
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
};

export const BuildMediumViewRows = ({
  onDelete,
  rows,
  onChangeQuantity
}: BuildRowProps) => {
  return (
    <>
      {rows.map((row, index) => (
        <Table.Row
          key={`medium-row-${row.externalProductCode}`}
          className={classnames(
            index % 2 !== 0 && classes.greyBack,
            classes.mediumTableRow
          )}
        >
          <Table.Cell>
            <div className={classes.cellRow}>
              <img src={row.image} className={classes.picture} />
              <Typography className={classes.largeDescription}>
                {row.description}
              </Typography>
            </div>
            <div className={classes.iteratorCellMedium}>
              <UpDownSimpleNumericInput
                name={row.externalProductCode.toString()}
                min={0}
                defaultValue={row.quantity}
                onChange={(value) => onChangeQuantity(row, value)}
              />
            </div>
          </Table.Cell>
          <Table.Cell className={classes.mediumCell}>{row.packSize}</Table.Cell>
          <Table.Cell className={classes.mediumCell}>
            <div className={classes.mediumCellBasketIconWrapper}>
              <Typography>{row.externalProductCode}</Typography>
              <Icon
                aria-label={`Remove ${row.description}`}
                role="button"
                className={classes.icon}
                source={Delete}
                onClick={() => onDelete(row)}
              />
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
};

export const BuildLargeViewRows = ({
  onDelete,
  onChangeQuantity,
  rows
}: BuildRowProps) => {
  return (
    <>
      {rows.map((row, iterator) => (
        <Table.Row
          key={`large-row-${row.externalProductCode}`}
          className={classnames(iterator % 2 !== 0 && classes.greyBack)}
        >
          <Table.Cell>
            <div className={classes.cellRow}>
              <img src={row.image} className={classes.picture} />
              <Typography className={classes.largeDescription}>
                {row.description}
              </Typography>
            </div>
          </Table.Cell>
          <Table.Cell className={classes.largeCell}>
            <Typography>{row.packSize}</Typography>
          </Table.Cell>
          <Table.Cell className={classes.largeCell}>
            <Typography>{row.externalProductCode}</Typography>
          </Table.Cell>
          <Table.Cell
            className={classnames(classes.largeCell, classes.iteratorCellLarge)}
          >
            <div className={classes.iteratorCellLarge}>
              <UpDownSimpleNumericInput
                name={row.externalProductCode.toString()}
                min={0}
                defaultValue={row.quantity}
                onChange={(value) => onChangeQuantity(row, value)}
              />
            </div>
          </Table.Cell>
          <Table.Cell className={classes.largeCell}>
            <Icon
              aria-label={`Remove ${row.description}`}
              role="button"
              className={classes.icon}
              source={Delete}
              onClick={() => onDelete(row)}
            />
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
};

const QuantityTable = ({
  onDelete,
  onChangeQuantity,
  rows,
  title,
  packSize,
  externalProductCode,
  quantity,
  remove
}: Props) => {
  return (
    <StyledQuantityTable>
      <Table className={classes.displayIfSmall}>
        <Table.Head>
          <SmallHeader title={title} />
        </Table.Head>
        <Table.Body>
          <BuildSmallViewRows
            onDelete={onDelete}
            onChangeQuantity={onChangeQuantity}
            rows={rows}
            packSize={packSize}
            externalProductCode={externalProductCode}
            quantity={quantity}
            remove={remove}
          />
        </Table.Body>
      </Table>
      <Table className={classes.displayIfMedium}>
        <Table.Head>
          <MediumHeader
            title={title}
            packSize={packSize}
            externalProductCode={externalProductCode}
          />
        </Table.Head>
        <Table.Body>
          <BuildMediumViewRows
            onDelete={onDelete}
            onChangeQuantity={onChangeQuantity}
            rows={rows}
          />
        </Table.Body>
      </Table>
      <Table className={classes.displayIfLarge}>
        <Table.Head>
          <LargeHeader
            title={title}
            packSize={packSize}
            externalProductCode={externalProductCode}
            quantity={quantity}
            remove={remove}
          />
        </Table.Head>
        <Table.Body>
          <BuildLargeViewRows
            onDelete={onDelete}
            onChangeQuantity={onChangeQuantity}
            rows={rows}
          />
        </Table.Body>
      </Table>
    </StyledQuantityTable>
  );
};

export default QuantityTable;
