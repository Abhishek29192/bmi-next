import React from "react";
import { ClickableAction } from "@bmi-digital/components";
import { Media, AcceptedNode } from "@bmi-digital/components";
import { SVGImport } from "@bmi-digital/svg-import";
import { Typography } from "@bmi-digital/components";
import { AnchorLink } from "@bmi-digital/components";
import { MicroCopy } from "@bmi-digital/components";
import styles from "./ProductDetailsCard.module.scss";

type Props = {
  media?: React.ReactElement<AcceptedNode>;
  brandLogo: SVGImport;
  title: React.ReactNode;
  nnob: React.ReactNode;
  action?: ClickableAction;
  linkLabel: React.ReactNode;
};

const ProductDetailsCard = ({
  media,
  brandLogo,
  title,
  nnob,
  action,
  linkLabel
}: Props) => {
  const BrandLogo = brandLogo;

  return (
    <div className={styles["OverviewCard"]}>
      <Media className={styles["header-picture"]} size="contain">
        {media}
      </Media>
      <div className={styles["body"]}>
        <BrandLogo
          preserveAspectRatio="xMinYMin"
          className={styles["brand-logo"]}
        />
        <Typography variant="h5" className={styles["title"]}>
          {title}
        </Typography>
        <Typography>
          <MicroCopy path="productDetailsCard.externalRefLabel" />:{" "}
          <span className={styles["bold-nobb"]}>{nnob}</span>
        </Typography>
        <AnchorLink action={action} iconEnd className={styles["link"]}>
          {linkLabel}
        </AnchorLink>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
