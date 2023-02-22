import { Icon, Table, Typography } from "@bmi-digital/components";
import { Delete } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import classnames from "classnames";
import React from "react";
import UpDownSimpleNumericInput from "../up-down-simple-numeric-input/UpDownSimpleNumericInput";
import {
  classes,
  StyledQuantityTable,
  StyledQuantityTableLarge,
  StyledQuantityTableMedium,
  StyledQuantityTableSmall
} from "./styles";

type RowProps = {
  image: string;
  description: string;
  externalProductCode: string;
  packSize: string;
  quantity: number;
};

type BuildRowProps = {
  onDelete: (externalProductCode: string) => void;
  onChangeQuantity: (externalProductCode: string, newQuantity: any) => void;
  rows: RowProps[];
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
  onDelete: (externalProductCode: string) => void;
  onChangeQuantity: (externalProductCode: string, newQuantity: any) => void;
  rows: RowProps[];
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
  externalProductCode,
  quantity,
  remove
}: HeaderProps) => {
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
    <StyledQuantityTableSmall>
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
                    onChange={(value) =>
                      onChangeQuantity(row.externalProductCode, value)
                    }
                  />
                </div>
                <Icon
                  aria-label={`Remove ${row.description}`}
                  role="button"
                  className={classes.icon}
                  source={Delete}
                  onClick={() => onDelete(row.externalProductCode)}
                />
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </StyledQuantityTableSmall>
  );
};

export const BuildMediumViewRows = ({
  onDelete,
  onChangeQuantity,
  rows
}: BuildRowProps) => {
  return (
    <StyledQuantityTableMedium>
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
                onChange={(value) =>
                  onChangeQuantity(row.externalProductCode, value)
                }
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
                onClick={() => onDelete(row.externalProductCode)}
              />
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </StyledQuantityTableMedium>
  );
};

export const BuildLargeViewRows = ({
  onDelete,
  onChangeQuantity,
  rows
}: BuildRowProps) => {
  const theme = useTheme();

  const displayIfDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <StyledQuantityTableLarge>
      {rows.map((row, iterator) => (
        <Table.Row
          key={`large-row-${row.externalProductCode}`}
          className={classnames(iterator % 2 !== 0 && classes.greyBack)}
        >
          <Table.Cell>
            <div className={classes.cellRow}>
              <img src={row.image} className={classes.picture} />
              {displayIfDesktop && (
                <Typography className={classes.largeDescription}>
                  {row.description}
                </Typography>
              )}
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
                onChange={(value) =>
                  onChangeQuantity(row.externalProductCode, value)
                }
              />
            </div>
          </Table.Cell>
          <Table.Cell className={classes.largeCell}>
            <Icon
              aria-label={`Remove ${row.description}`}
              role="button"
              className={classes.icon}
              source={Delete}
              onClick={() => onDelete(row.externalProductCode)}
            />
          </Table.Cell>
        </Table.Row>
      ))}
    </StyledQuantityTableLarge>
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
  const theme = useTheme();
  const displayIfSmall = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const displayIfMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const displayIfLarge = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <StyledQuantityTable>
      {displayIfSmall && (
        <Table>
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
      )}
      {displayIfMedium && (
        <Table>
          <Table.Head>
            <MediumHeader
              title={title}
              packSize={packSize}
              externalProductCode={externalProductCode}
              quantity={quantity}
              remove={remove}
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
      )}
      {displayIfLarge && (
        <Table>
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
      )}
    </StyledQuantityTable>
  );
};

export default QuantityTable;
