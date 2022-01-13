import React from "react";
import { ClickableAction } from "@bmi/clickable";
import Media, { AcceptedNode } from "@bmi/media";
import { SVGImport } from "@bmi/svg-import";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
import MicroCopy from "@bmi/micro-copy";
import styles from "./ProductDetailsCard.module.scss";

type Props = {
  /**
   * @deprecated Use `media` instead.
   */
  imageSource?: string;
  media?: React.ReactElement<AcceptedNode>;
  brandLogo: SVGImport;
  title: React.ReactNode;
  nnob: React.ReactNode;
  action?: ClickableAction;
  linkLabel: React.ReactNode;
};

const __DeprecatedImageSource = ({
  imageSource
}: Pick<Props, "imageSource">) => {
  if (!imageSource) {
    return null;
  }

  return (
    <div
      className={styles["header-picture"]}
      style={{ backgroundImage: `url(${imageSource})` }}
    />
  );
};

const ProductDetailsCard = ({
  imageSource,
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
      <__DeprecatedImageSource imageSource={imageSource} />
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
