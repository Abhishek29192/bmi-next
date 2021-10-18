import React from "react";
import { useTranslation } from "react-i18next";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Icon, { FilePDF } from "@bmi/icon";
import { ProjectDetailsProductFragmentFragment } from "../../../../graphql/generated/operations";
import styles from "./styles.module.scss";

type ProductGuaranteeCardProps = {
  product: ProjectDetailsProductFragmentFragment;
  guaranteeFileUrl?: String;
};
const ProductGuaranteeCard = ({
  product: { name, description, family, brand },
  guaranteeFileUrl
}: ProductGuaranteeCardProps) => {
  const { t } = useTranslation(["common", "project-page"]);

  return (
    <div className={styles.productCard}>
      <div className={styles.productCard__title}>
        <Typography component="h2" variant="h6">
          {name}
        </Typography>
      </div>
      <div className={styles.productCard__description}>
        <Typography variant="subtitle2">{description}</Typography>
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
      {guaranteeFileUrl && (
        <div
          className={styles.productCard__footer}
          data-testid="guarantee-pdf-item"
        >
          <Button
            variant="outlined"
            action={{
              model: "htmlLink",
              href: guaranteeFileUrl,
              target: "_blank",
              rel: "noopener noreferrer"
            }}
            startIcon={
              <Icon className={styles.productCard__logo} source={FilePDF} />
            }
          >
            {t("common:Download")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default ProductGuaranteeCard;
