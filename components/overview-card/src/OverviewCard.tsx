import React from "react";
import classnames from "classnames";
import Typography from "@bmi/typography";
import styles from "./OverviewCard.module.scss";

type Props = {
  title: React.ReactNode;
  titleVariant?: "h4" | "h5" | "h6";
  subtitle?: React.ReactNode;
  subtitleVariant?: "h5" | "h6"; // TODO: Add h6 (from DS) smallest when needed.
  hasTitleUnderline?: boolean;
  children: React.ReactNode;
  imageSource?: string;
  imageSize?: "cover" | "contain";
  brandImageSource?: SVGImport;
  footer?: React.ReactNode;
  isFlat?: boolean;
};

const OverviewCard = ({
  title,
  titleVariant = "h4",
  subtitle,
  subtitleVariant = "h5",
  hasTitleUnderline,
  children,
  imageSource,
  imageSize = "cover",
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
          className={classnames(styles["header-picture"], {
            [styles[`header-picture--${imageSize}`]]: imageSize !== "cover"
          })}
          style={{ backgroundImage: `url(${imageSource})` }}
        />
      ) : null}
      <div className={styles["body"]}>
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
        {subtitle && (
          <Typography variant={subtitleVariant} className={styles["title"]}>
            {subtitle}
          </Typography>
        )}
        <div className={styles["children"]}>{children}</div>
        {footer && <div className={styles["footer"]}>{footer}</div>}
      </div>
    </div>
  );
};

export default OverviewCard;
