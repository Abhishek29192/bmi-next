import React from "react";
import Table from "@bmi/table";
import { ClassificationFeature } from "./types/ProductBaseTypes";

type featureTableProps = {
  features: ClassificationFeature[];
  rowBgColorPattern?: "odd" | "even";
};

const ProductFeaturesTable = ({
  features,
  rowBgColorPattern = "odd"
}: featureTableProps) => {
  return (
    <Table hasNoBorder rowBgColorPattern={rowBgColorPattern}>
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
