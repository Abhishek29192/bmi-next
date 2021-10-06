import React from "react";
import Table from "@bmi/table";
import { Feature } from "./types/pim";

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
          features.map(({ name, code, featureValues, featureUnit }, index) => (
            <Table.Row key={`feat-row-${name}-${code}--${index}`}>
              <Table.Cell align="left">{name}</Table.Cell>
              <Table.Cell align="right">
                {`${featureValues[0].value} ${featureUnit?.symbol || ""}`}
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default ProductFeaturesTable;
