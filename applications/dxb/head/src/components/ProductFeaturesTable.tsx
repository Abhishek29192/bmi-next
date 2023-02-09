import { Table } from "@bmi-digital/components";
import { Feature } from "@bmi/firestore-types";
import React from "react";

type featureTableProps = {
  features: Feature[];
  rowBgColorPattern?: "odd" | "even";
  HeadRow?: React.ReactNode;
  hasNoBorder: boolean;
};

const ProductFeaturesTable = ({
  features,
  rowBgColorPattern = "odd",
  HeadRow,
  hasNoBorder
}: featureTableProps) => {
  return (
    <Table hasNoBorder={hasNoBorder} rowBgColorPattern={rowBgColorPattern}>
      {HeadRow && <Table.Head>{HeadRow}</Table.Head>}
      <Table.Body>
        {features &&
          features
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map(({ name, value }, index) => (
              <Table.Row key={`feat-row-${name}--${index}`}>
                <Table.Cell align="left">{name}</Table.Cell>
                <Table.Cell align="right">{value}</Table.Cell>
              </Table.Row>
            ))}
      </Table.Body>
    </Table>
  );
};

export default ProductFeaturesTable;
