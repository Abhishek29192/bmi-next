import React from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@bmi/components";
import { Button } from "@bmi/components";
import { Icon, FilePDF } from "@bmi/components";
import { ProductCard } from "../ProductCard";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import styles from "./styles.module.scss";

type SystemGuaranteesProps = {
  guarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0];
};

export const SystemGuarantee = ({ guarantee }: SystemGuaranteesProps) => {
  const { t } = useTranslation(["common", "project-page"]);

  const { systemBySystemBmiRef: system, signedFileStorageUrl } = guarantee;

  const products =
    system.systemMembersBySystemBmiRef?.nodes?.map(
      (member) => member.productByProductBmiRef
    ) || [];

  return (
    <div className={styles.body}>
      <div className={styles.body__title}>
        <Typography component="h2" variant="h6">
          {system.name}
        </Typography>
      </div>
      <div>
        <Typography variant="subtitle2">{system.description}</Typography>
      </div>

      <div className={styles.body__footer}>
        <Button
          variant="outlined"
          disabled={!signedFileStorageUrl}
          action={{
            model: "htmlLink",
            href: signedFileStorageUrl,
            target: "_blank",
            rel: "noopener noreferrer"
          }}
          startIcon={<Icon className={styles.body__logo} source={FilePDF} />}
        >
          {signedFileStorageUrl
            ? t("common:SavePdf")
            : t("common:generatingPdf")}
        </Button>
      </div>

      {products.length > 0 && <ProductCard products={products} />}
    </div>
  );
};
