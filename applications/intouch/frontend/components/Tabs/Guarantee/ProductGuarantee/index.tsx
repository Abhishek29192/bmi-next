import React from "react";
import { useTranslation } from "react-i18next";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Icon, { FilePDF } from "@bmi/icon";
import {
  GetProjectQuery,
  ProjectDetailsProductFragmentFragment
} from "../../../../graphql/generated/operations";
import styles from "./styles.module.scss";

type ProductGuaranteesProps = {
  guarantees: GetProjectQuery["project"]["guarantees"]["nodes"];
};

export const ProductGuarantee = ({ guarantees }: ProductGuaranteesProps) => {
  const { t } = useTranslation("project-page");
  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <Typography component="h1" variant="h6">
          {t("guarantee.type.product")}
        </Typography>
      </div>
      {guarantees.map((guarantee) => (
        <ProductGuaranteeCard
          key={guarantee.id}
          product={guarantee.productByProductBmiRef}
        />
      ))}
    </div>
  );
};

type ProductGuaranteeCardProps = {
  product: ProjectDetailsProductFragmentFragment;
};
const ProductGuaranteeCard = ({
  product: { name, description, family, brand }
}: ProductGuaranteeCardProps) => {
  const { t } = useTranslation(["common", "project-page"]);

  return (
    <div className={styles.productCard}>
      <div className={styles.productCard__title}>
        <Typography component="h2" variant="h6">
          {name}
        </Typography>
      </div>
      <div>
        <Typography variant="subtitle2" color="textSecondary">
          {description}
        </Typography>
      </div>
      <div>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>{t("project-page:productDetails.name")}</Table.Cell>
              <Table.Cell>{t("project-page:productDetails.family")}</Table.Cell>
              <Table.Cell>{t("project-page:productDetails.brand")}</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{family}</Table.Cell>
              <Table.Cell>{brand}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
      <div className={styles.productCard__footer}>
        <Button
          variant="outlined"
          startIcon={
            <Icon className={styles.productCard__logo} source={FilePDF} />
          }
        >
          {t("common:Download")}
        </Button>
      </div>
    </div>
  );
};
