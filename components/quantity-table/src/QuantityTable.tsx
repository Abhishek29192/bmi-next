import React from "react";
import classnames from "classnames";
import Icon from "@bmi/icon";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import { Delete } from "@material-ui/icons";
import UpDownSimpleNumericInput from "@bmi/up-down-simple-numeric-input";
import styles from "./QuantityTable.module.scss";

type RowProps = {
  imageSource: string;
  description: string;
  nobb: number;
  packSize: string;
  productAmount: number;
};

type BuildRowProps = {
  onDelete: (nobb: number) => void;
  onChangeQuantity: (nobb: number, newQuantity: any) => void;
  rows: RowProps[];
  packSize?: string;
  nobbNumber?: string;
  quantity?: string;
  remove?: string;
};

type HeaderProps = {
  title: string;
  packSize: string;
  nobbNumber: string;
  quantity: string;
  remove: string;
};

export type Props = {
  onDelete: (nobb: number) => void;
  onChangeQuantity: (nobb: number, newQuantity: any) => void;
  rows: RowProps[];
  title: string;
  packSize: string;
  nobbNumber: string;
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
  nobbNumber,
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
      <Typography variant="h6">{nobbNumber}</Typography>
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
  nobbNumber
}: BuildRowProps) => {
  return (
    <>
      {rows.map((row, iterator) => (
        <Table.Row
          key={Math.random() * iterator}
          className={classnames({
            [styles.greyBack]: iterator % 2 !== 0
          })}
        >
          <Table.Cell className={styles.smallCell}>
            <div className={styles.rowParent}>
              <div className={styles.cellRow}>
                <img src={row.imageSource} className={styles.picture} />
                <Typography className={styles.smallDescription}>
                  {row.description}
                </Typography>
              </div>
              <div className={styles.cellRow}>
                <Typography variant="subtitle1">{nobbNumber}:</Typography>
                <Typography className={styles.boldText}>{row.nobb}</Typography>
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
                    name={row.nobb.toString()}
                    min={0}
                    defaultValue={row.productAmount}
                    onChange={(value) => onChangeQuantity(row.nobb, value)}
                  />
                </div>
                <Icon
                  className={styles.icon}
                  source={Delete}
                  onClick={() => onDelete(row.nobb)}
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
          key={Math.random() * iterator}
          className={classnames({
            [styles.greyBack]: iterator % 2 !== 0
          })}
        >
          <Table.Cell>
            <div className={styles.cellRow}>
              <img src={row.imageSource} className={styles.picture} />
              <Typography className={styles.firstDescription}>
                {row.description}
              </Typography>
            </div>
          </Table.Cell>
          <Table.Cell className={styles.mediumCell}>
            <Typography>{row.packSize}</Typography>
          </Table.Cell>
          <Table.Cell className={styles.mediumCell}>
            <Typography>{row.nobb}</Typography>
          </Table.Cell>
          <Table.Cell
            className={classnames(styles.mediumCell, styles.iteratorCellMedium)}
          >
            <div className={styles.iteratorCellMedium}>
              <UpDownSimpleNumericInput
                name={row.nobb.toString()}
                min={0}
                defaultValue={row.productAmount}
                onChange={(value) => onChangeQuantity(row.nobb, value)}
              />
            </div>
          </Table.Cell>
          <Table.Cell className={styles.mediumCell}>
            <Icon
              className={styles.icon}
              source={Delete}
              onClick={() => onDelete(row.nobb)}
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
  nobbNumber,
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
            nobbNumber={nobbNumber}
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
            nobbNumber={nobbNumber}
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
