import React from "react";
import classnames from "classnames";
import Media, { AcceptedNode } from "@bmi/media";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import Typography from "@bmi/typography";
import { withClickable } from "@bmi/clickable";
import styles from "./OverviewCard.module.scss";

export type Props = Omit<ButtonBaseProps, "action"> & {
  title: React.ReactNode;
  titleVariant?: "h4" | "h5" | "h6";
  subtitle?: React.ReactNode;
  subtitleVariant?: "h5" | "h6"; // TODO: Add h6 (from DS) smallest when needed.
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
  buttonComponent?: React.ComponentType<any>;
  component?: React.ElementType<any>;
  clickableArea?: "full" | "body";
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
  children,
  imageSource,
  imageSize = "cover",
  media,
  brandImageSource,
  footer,
  isFlat = false,
  buttonComponent: Button = ButtonBase,
  className,
  clickableArea = "full",
  ...rest
}: Props) => {
  const ClickableArea = ({
    className,
    children
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => (
    <Button {...rest} className={className}>
      {children}
    </Button>
  );

  const Wrapper = isFlat || clickableArea === "body" ? "div" : ClickableArea;
  const Body = !isFlat && clickableArea === "body" ? ClickableArea : "div";

  return (
    <Wrapper
      className={classnames(
        styles["OverviewCard"],
        styles[`OverviewCard--${isFlat ? "flat" : "clickable"}`],
        className
      )}
    >
      <__DeprecatedImageSource
        imageSource={imageSource}
        imageSize={imageSize}
      />
      <Media size={imageSize} className={styles["header-picture"]}>
        {media}
      </Media>
      <Body className={styles["body"]}>
        <BrandLogo
          brandImageSource={brandImageSource}
          imageSource={imageSource}
          media={media}
        />
        <Typography
          variant={titleVariant}
          className={classnames(
            styles["title"],
            !brandImageSource && styles["title--no-brand-logo"]
          )}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant={subtitleVariant} className={styles["text"]}>
            {subtitle}
          </Typography>
        )}
        <div className={classnames(styles["children"], styles["text"])}>
          {children}
        </div>
        {footer && <div className={styles["footer"]}>{footer}</div>}
      </Body>
    </Wrapper>
  );
};

export default withClickable<Props>(OverviewCard);
