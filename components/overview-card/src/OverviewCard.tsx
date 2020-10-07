import React from "react";
import classnames from "classnames";
import styles from "./OverviewCard.module.scss";
import Typography from "@bmi/typography";

type Props = {
  title: React.ReactNode;
  titleVariant?: "h4" | "h6";
  hasTitleUnderline?: boolean;
  children: React.ReactNode;
  imageSource?: string;
  brandImageSource?: SVGImport;
  footer?: React.ReactNode;
  isFlat?: boolean;
};

const OverviewCard = ({
  title,
  titleVariant = "h4",
  hasTitleUnderline,
  children,
  imageSource,
  brandImageSource,
  footer,
  isFlat = false
}: Props) => {
  const BrandLogo = brandImageSource;

  return (
    <div
      className={classnames(styles["OverviewCard"], {
        [styles["OverviewCard--flat"]]: isFlat
      })}
    >
      {imageSource ? (
        <div
          className={styles["header-picture"]}
          style={{ backgroundImage: `url(${imageSource})` }}
        />
      ) : null}
      <div
        className={classnames(styles["body"], {
          [styles["body--flat"]]: isFlat
        })}
      >
        {brandImageSource ? (
          <BrandLogo
            preserveAspectRatio="xMinYMin"
            className={classnames(styles["brand-logo"], {
              [styles["brand-logo--negative"]]: !!imageSource
            })}
          />
        ) : null}
        <Typography
          variant={titleVariant}
          hasUnderline={hasTitleUnderline}
          className={classnames(styles["title"], {
            [styles["title--no-brand-logo"]]: !brandImageSource
          })}
        >
          {title}
        </Typography>
        <div className={styles["children"]}>{children}</div>
        {footer && <div className={styles["footer"]}>{footer}</div>}
      </div>
    </div>
  );
};

export default OverviewCard;
