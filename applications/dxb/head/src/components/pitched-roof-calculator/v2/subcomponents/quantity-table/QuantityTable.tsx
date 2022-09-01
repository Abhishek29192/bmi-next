import { Icon, Table, Typography } from "@bmi/components";
import { Delete } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import { ResultsRow } from "../../../types";
import UpDownSimpleNumericInput from "../up-down-simple-numeric-input/UpDownSimpleNumericInput";
import styles from "./QuantityTable.module.scss";

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
}: Omit<HeaderProps, "remove" | "quantity">) => (
  <Table.Row>
    <Table.Cell className={styles.mediumHeaderFirstCell}>
      <Typography variant="h6">{title}</Typography>
    </Table.Cell>
    <Table.Cell className={styles.mediumHeaderCell}>
      <Typography variant="h6">{packSize}</Typography>
    </Table.Cell>
    <Table.Cell className={styles.mediumHeaderCell}>
      <Typography variant="h6">{externalProductCode}</Typography>
    </Table.Cell>
  </Table.Row>
);

const LargeHeader = ({
  title,
  packSize,
  externalProductCode,
  quantity,
  remove
}: HeaderProps) => (
  <Table.Row>
    <Table.Cell className={styles.largeHeaderFirstCell}>
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
                    onChange={(value) => onChangeQuantity(row, value)}
                  />
                </div>
                <Icon
                  aria-label={`Remove ${row.description}`}
                  role="button"
                  className={styles.icon}
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
}: BuildRowProps) => (
  <>
    {rows.map((row, index) => (
      <Table.Row
        key={`medium-row-${row.externalProductCode}`}
        className={classnames(
          index % 2 !== 0 && styles.greyBack,
          styles.mediumTableRow
        )}
      >
        <Table.Cell>
          <div className={styles.cellRow}>
            <img src={row.image} className={styles.picture} />
            <Typography className={styles.largeDescription}>
              {row.description}
            </Typography>
          </div>
          <div className={styles.iteratorCellMedium}>
            <UpDownSimpleNumericInput
              name={row.externalProductCode.toString()}
              min={0}
              defaultValue={row.quantity}
              onChange={(value) => onChangeQuantity(row, value)}
            />
          </div>
        </Table.Cell>
        <Table.Cell className={styles.mediumCell}>{row.packSize}</Table.Cell>
        <Table.Cell className={styles.mediumCell}>
          <div className={styles.mediumCellBasketIconWrapper}>
            <Typography>{row.externalProductCode}</Typography>
            <Icon
              aria-label={`Remove ${row.description}`}
              role="button"
              className={styles.icon}
              source={Delete}
              onClick={() => onDelete(row)}
            />
          </div>
        </Table.Cell>
      </Table.Row>
    ))}
  </>
);

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
          className={classnames(iterator % 2 !== 0 && styles.greyBack)}
        >
          <Table.Cell>
            <div className={styles.cellRow}>
              <img src={row.image} className={styles.picture} />
              <Typography className={styles.largeDescription}>
                {row.description}
              </Typography>
            </div>
          </Table.Cell>
          <Table.Cell className={styles.largeCell}>
            <Typography>{row.packSize}</Typography>
          </Table.Cell>
          <Table.Cell className={styles.largeCell}>
            <Typography>{row.externalProductCode}</Typography>
          </Table.Cell>
          <Table.Cell
            className={classnames(styles.largeCell, styles.iteratorCellLarge)}
          >
            <div className={styles.iteratorCellLarge}>
              <UpDownSimpleNumericInput
                name={row.externalProductCode.toString()}
                min={0}
                defaultValue={row.quantity}
                onChange={(value) => onChangeQuantity(row, value)}
              />
            </div>
          </Table.Cell>
          <Table.Cell className={styles.largeCell}>
            <Icon
              aria-label={`Remove ${row.description}`}
              role="button"
              className={styles.icon}
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
      <Table className={styles.displayIfLarge}>
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
    </div>
  );
};

export default QuantityTable;
