import React from "react";
import { useTranslation } from "react-i18next";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Icon, { FilePDF } from "@bmi/icon";
import { ProductRow } from "../ProductRow";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import styles from "./styles.module.scss";

type SystemGuaranteesProps = {
  guarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0];
};

export const SystemGuarantee = ({ guarantee }: SystemGuaranteesProps) => {
  const { t } = useTranslation(["common", "project-page"]);
  return (
    <div>
      <Typography component="h1" variant="h6">
        {t("project-page:guarantee.type.SYSTEM")}
      </Typography>
      <SystemGuaranteeCard guarantee={guarantee} />
    </div>
  );
};

type SystemGuaranteeCardProps = {
  guarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0];
};
const SystemGuaranteeCard = ({ guarantee }: SystemGuaranteeCardProps) => {
  const { t } = useTranslation(["common", "project-page"]);

  const { systemBySystemBmiRef: system, signedFileStorageUrl } = guarantee;

  const products =
    system.systemMembersBySystemBmiRef?.nodes?.map(
      (member) => member.productByProductBmiRef
    ) || [];

  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <div className={styles.body__title}>
          <Typography component="h2" variant="h6">
            {system.name}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" color="textSecondary">
            {system.description}
          </Typography>
        </div>
        {signedFileStorageUrl && (
          <div className={styles.body__footer}>
            <Button
              variant="outlined"
              action={{
                model: "htmlLink",
                href: signedFileStorageUrl,
                target: "_blank",
                rel: "noopener noreferrer"
              }}
              startIcon={
                <Icon className={styles.body__logo} source={FilePDF} />
              }
            >
              {t("common:SavePdf")}
            </Button>
          </div>
        )}
        <div>
          <Table>
            <Table.Body>
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};
