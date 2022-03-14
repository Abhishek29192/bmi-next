import { Icon, Table, Typography } from "@bmi/components";
import { Delete } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import UpDownSimpleNumericInput from "../up-down-simple-numeric-input/UpDownSimpleNumericInput";
import { useStyles } from "./styles";

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
  const classes = useStyles();
  return (
    <Table.Row>
      <Table.Cell className={classes.firstHeader}>
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

const BuildSmallViewRows = ({
  onDelete,
  onChangeQuantity,
  rows,
  packSize,
  externalProductCode
}: BuildRowProps) => {
  const classes = useStyles();
  return (
    <>
      {rows.map((row, iterator) => (
        <Table.Row
          key={row.externalProductCode}
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
                  className={classnames(classes.icon, "icon")}
                  source={Delete}
                  onClick={() => onDelete(row.externalProductCode)}
                />
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
};

const BuildMediumViewRows = ({
  onDelete,
  onChangeQuantity,
  rows
}: BuildRowProps) => {
  const classes = useStyles();
  return (
    <>
      {rows.map((row, iterator) => (
        <Table.Row
          key={row.externalProductCode}
          className={classnames(iterator % 2 !== 0 && classes.greyBack)}
        >
          <Table.Cell>
            <div className={classes.cellRow}>
              <img src={row.image} className={classes.picture} />
              <Typography className={classes.firstDescription}>
                {row.description}
              </Typography>
            </div>
          </Table.Cell>
          <Table.Cell className={classes.mediumCell}>
            <Typography>{row.packSize}</Typography>
          </Table.Cell>
          <Table.Cell className={classes.mediumCell}>
            <Typography>{row.externalProductCode}</Typography>
          </Table.Cell>
          <Table.Cell
            className={classnames(
              classes.mediumCell,
              classes.iteratorCellMedium
            )}
          >
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
          <Table.Cell className={classes.mediumCell}>
            <Icon
              className={classnames(classes.icon, "icon")}
              source={Delete}
              onClick={() => onDelete(row.externalProductCode)}
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
  const classes = useStyles();
  return (
    <div className={classes.root}>
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
    </div>
  );
};

export default QuantityTable;
