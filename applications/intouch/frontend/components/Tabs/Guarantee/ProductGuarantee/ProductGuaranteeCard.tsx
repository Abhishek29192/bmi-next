import React from "react";
import { useTranslation } from "react-i18next";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Icon, { FilePDF } from "@bmi/icon";
import { ProjectDetailsProductFragmentFragment } from "../../../../graphql/generated/operations";
import { ProductCard } from "../ProductCard";
import styles from "./styles.module.scss";

type ProductGuaranteeCardProps = {
  product: ProjectDetailsProductFragmentFragment;
  guaranteeFileUrl?: String;
};
const ProductGuaranteeCard = ({
  product,
  guaranteeFileUrl
}: ProductGuaranteeCardProps) => {
  const { t } = useTranslation(["common", "project-page"]);
  const { name, description } = product;
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
      <ProductCard products={[product]} />

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
          disabled={!guaranteeFileUrl}
          startIcon={
            <Icon className={styles.productCard__logo} source={FilePDF} />
          }
        >
          {guaranteeFileUrl ? t("common:Download") : t("common:generatingPdf")}
        </Button>
      </div>
    </div>
  );
};
export default ProductGuaranteeCard;
