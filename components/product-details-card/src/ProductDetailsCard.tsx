import React from "react";
import classnames from "classnames";
import { ClickableAction } from "@bmi/clickable";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
import MicroCopy from "@bmi/micro-copy";
import styles from "./ProductDetailsCard.module.scss";

type Props = {
  imageSource: string;
  brandLogo: SVGImport;
  title: React.ReactNode;
  nnob: React.ReactNode;
  action?: ClickableAction;
  linkLabel: React.ReactNode;
};

const ProductDetailsCard = ({
  imageSource,
  brandLogo,
  title,
  nnob,
  action,
  linkLabel
}: Props) => {
  const BrandLogo = brandLogo;

  return (
    <div className={styles["OverviewCard"]}>
      <div
        className={styles["header-picture"]}
        style={{ backgroundImage: `url(${imageSource})` }}
      />
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
