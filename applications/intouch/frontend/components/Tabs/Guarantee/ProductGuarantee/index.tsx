import React from "react";
import { useTranslation } from "react-i18next";
import Typography from "@bmi/typography";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import styles from "./styles.module.scss";
import ProductGuaranteeCard from "./ProductGuaranteeCard";

type ProductGuaranteesProps = {
  guarantees: GetProjectQuery["project"]["guarantees"]["nodes"];
};

export const ProductGuarantee = ({ guarantees }: ProductGuaranteesProps) => {
  const { t } = useTranslation("project-page");

  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <Typography component="h1" variant="h6">
          {t("guarantee.type.PRODUCT")}
        </Typography>
      </div>
      {guarantees.map((guarantee) => (
        <ProductGuaranteeCard
          key={guarantee.id}
          product={guarantee.productByProductBmiRef}
          guaranteeFileUrl={guarantee.signedFileStorageUrl}
        />
      ))}
    </div>
  );
};
