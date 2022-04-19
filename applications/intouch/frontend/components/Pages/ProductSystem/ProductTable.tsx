import React from "react";
import { Table } from "@bmi/components";
import { useTranslation } from "next-i18next";

type ProductCardProps = {
  products: Array<{
    id: number;
    name: string;
  }>;
};

export const ProductTable = ({ products }: ProductCardProps) => {
  const { t } = useTranslation("admin-products-systems");
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{t("productData.uuid")}</Table.Cell>
          <Table.Cell>{t("productData.name")}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {products.map(({ id, name }) => (
          <Table.Row key={id}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{name}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
