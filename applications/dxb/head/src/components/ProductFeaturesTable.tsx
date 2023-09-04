import { Table } from "@bmi-digital/components";
import { Feature } from "@bmi/firestore-types";
import React from "react";
import { useConfig } from "../contexts/ConfigProvider";

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
  const { enableProductClassificationAttributeOrdering } = useConfig();

  const attributes = enableProductClassificationAttributeOrdering
    ? features.sort((a, b) => a.name.localeCompare(b.name))
    : features;

  return (
    <Table hasNoBorder={hasNoBorder} rowBgColorPattern={rowBgColorPattern}>
      {HeadRow && <Table.Head>{HeadRow}</Table.Head>}
      <Table.Body>
        {attributes.map(({ name, value }, index) => (
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
