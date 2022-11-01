import { Button, FilePDF, Icon, Typography } from "@bmi-digital/components";
import React from "react";
import { useTranslation } from "react-i18next";
import { ProjectDetailsProductFragmentFragment } from "../../../../graphql/generated/operations";
import { ProductCard } from "../ProductCard";
import styles from "./styles.module.scss";

type ProductGuaranteeCardProps = {
  product: ProjectDetailsProductFragmentFragment;
  guaranteeFileUrl?: string;
  guaranteeStatus: string;
};
const ProductGuaranteeCard = ({
  product,
  guaranteeFileUrl,
  guaranteeStatus
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

      {guaranteeStatus === "ISSUED" && (
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
            {guaranteeFileUrl
              ? t("common:Download")
              : t("common:generatingPdf")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default ProductGuaranteeCard;
