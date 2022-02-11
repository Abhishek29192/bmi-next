import React from "react";
import classnames from "classnames";
import Icon from "@bmi/icon";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import { Delete } from "@material-ui/icons";
import UpDownSimpleNumericInput from "../up-down-simple-numeric-input/UpDownSimpleNumericInput";
import styles from "./QuantityTable.module.scss";

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
}: HeaderProps) => (
  <Table.Row>
    <Table.Cell className={styles.firstHeader}>
      <Typography variant="h6">{title}</Typography>
    </Table.Cell>
    <Table.Cell className={styles.header}>
      <Typography variant="h6">{packSize}</Typography>
    </Table.Cell>
    <Table.Cell className={styles.header}>
      <Typography variant="h6">{externalProductCode}</Typography>
    </Table.Cell>
    <Table.Cell className={styles.header}>
      <Typography variant="h6">{quantity}</Typography>
    </Table.Cell>
    <Table.Cell className={styles.header}>
      <Typography variant="h6">{remove}</Typography>
    </Table.Cell>
  </Table.Row>
);

const BuildSmallViewRows = ({
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
          key={row.externalProductCode}
          className={classnames(iterator % 2 !== 0 && styles.greyBack)}
        >
          <Table.Cell className={styles.smallCell}>
            <div className={styles.rowParent}>
              <div className={styles.cellRow}>
                <img src={row.image} className={styles.picture} />
                <Typography className={styles.smallDescription}>
                  {row.description}
                </Typography>
              </div>
              <div className={styles.cellRow}>
                <Typography variant="subtitle1">
                  {externalProductCode}:
                </Typography>
                <Typography className={styles.boldText}>
                  {row.externalProductCode}
                </Typography>
              </div>
              <div className={styles.cellRow}>
                <Typography variant="subtitle1">{packSize}:</Typography>
                <Typography className={styles.boldText}>
                  {row.packSize}
                </Typography>
              </div>
              <div className={classnames(styles.cellRow, styles.cellRowLast)}>
                <div className={styles.iteratorCellSmall}>
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
                  className={styles.icon}
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
  return (
    <>
      {rows.map((row, iterator) => (
        <Table.Row
          key={row.externalProductCode}
          className={classnames(iterator % 2 !== 0 && styles.greyBack)}
        >
          <Table.Cell>
            <div className={styles.cellRow}>
              <img src={row.image} className={styles.picture} />
              <Typography className={styles.firstDescription}>
                {row.description}
              </Typography>
            </div>
          </Table.Cell>
          <Table.Cell className={styles.mediumCell}>
            <Typography>{row.packSize}</Typography>
          </Table.Cell>
          <Table.Cell className={styles.mediumCell}>
            <Typography>{row.externalProductCode}</Typography>
          </Table.Cell>
          <Table.Cell
            className={classnames(styles.mediumCell, styles.iteratorCellMedium)}
          >
            <div className={styles.iteratorCellMedium}>
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
          <Table.Cell className={styles.mediumCell}>
            <Icon
              className={styles.icon}
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
  return (
    <div className={styles.QuantityTable}>
      <Table className={styles.displayIfSmall}>
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
      <Table className={styles.displayIfMedium}>
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
