import React from "react";
import Table from "@bmi/table";
import { ProjectDetailsProductFragmentFragment } from "../../../../graphql/generated/operations";

type ProductRowProps = {
  product: ProjectDetailsProductFragmentFragment;
};

export const ProductRow = ({
  product: { name, family, brand }
}: ProductRowProps) => {
  return (
    <Table.Row>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{family}</Table.Cell>
      <Table.Cell>{brand}</Table.Cell>
    </Table.Row>
  );
};
