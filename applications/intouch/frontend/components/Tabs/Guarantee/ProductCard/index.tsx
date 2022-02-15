import React from "react";
import { Table } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";

type ProductCardProps = {
  products: ReadonlyArray<{
    id: number;
    name: string;
    family: string;
    brand: string;
  }>;
};

export const ProductCard = ({ products }: ProductCardProps) => {
  const { t } = useTranslation("project-page");
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{t("productDetails.name")}</Table.Cell>
          <Table.Cell>{t("productDetails.family")}</Table.Cell>
          <Table.Cell>{t("productDetails.brand")}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {products.map(({ id, name, family, brand }) => (
          <Table.Row key={id}>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{family}</Table.Cell>
            <Table.Cell>{brand}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
