import React from "react";
import classnames from "classnames";
import Media, { AcceptedNode } from "@bmi/media";
import Typography from "@bmi/typography";
import styles from "./OverviewCard.module.scss";

type Props = {
  title: React.ReactNode;
  titleVariant?: "h4" | "h5" | "h6";
  subtitle?: React.ReactNode;
  subtitleVariant?: "h5" | "h6"; // TODO: Add h6 (from DS) smallest when needed.
  hasTitleUnderline?: boolean;
  children: React.ReactNode;
  /**
   * @deprecated Use `media` instead.
   */
  imageSource?: string | React.ReactNode;
  imageSize?: "cover" | "contain";
  media?: React.ReactElement<AcceptedNode>;
  brandImageSource?: SVGImport | string;
  footer?: React.ReactNode;
  isFlat?: boolean;
};

const __DeprecatedImageSource = ({
  imageSource,
  imageSize
}: Pick<Props, "imageSource" | "imageSize">) => {
  if (!imageSource) {
    return null;
  }

  return (
    <div
      className={classnames(
        styles["header-picture"],
        imageSize !== "cover" && styles[`header-picture--${imageSize}`]
      )}
      style={
        typeof imageSource === "string"
          ? { backgroundImage: `url(${imageSource})` }
          : {}
      }
    >
      {typeof imageSource !== "string" && imageSource}
    </div>
  );
};

const BrandLogo = ({
  brandImageSource,
  imageSource,
  media
}: Pick<Props, "brandImageSource" | "imageSource" | "media">) => {
  if (!brandImageSource) {
    return null;
  }

  const className = classnames(styles["brand-logo"], {
    [styles["brand-logo--negative"]!]: !!(imageSource || media)
  });

  if (typeof brandImageSource === "string") {
    return <img src={brandImageSource} alt="" className={className} />;
  }

  const BrandLogo = brandImageSource;
  return <BrandLogo preserveAspectRatio="xMinYMin" className={className} />;
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
  media,
  brandImageSource,
  footer,
  isFlat = false
}: Props) => {
  return (
    <div
      className={classnames(
        styles["OverviewCard"],
        isFlat && styles["OverviewCard--flat"]
      )}
    >
      <__DeprecatedImageSource
        imageSource={imageSource}
        imageSize={imageSize}
      />
      <Media size={imageSize} className={styles["header-picture"]}>
        {media}
      </Media>
      <div className={styles["body"]}>
        <BrandLogo
          brandImageSource={brandImageSource}
          imageSource={imageSource}
          media={media}
        />
        <Typography
          variant={titleVariant}
          hasUnderline={hasTitleUnderline}
          className={classnames(
            styles["title"],
            !brandImageSource && styles["title--no-brand-logo"]
          )}
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
