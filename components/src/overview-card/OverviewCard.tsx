import React, { Fragment } from "react";
import classnames from "classnames";
import { SVGImport } from "@bmi-digital/svg-import";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { withClickable } from "../clickable/Clickable";
import Media, { AcceptedNode } from "../media/Media";
import Typography from "../typography/Typography";
import { transformHyphens } from "../utils/commonUtils";
import styles from "./OverviewCard.module.scss";

export type Props = Omit<ButtonBaseProps, "action"> & {
  title: React.ReactNode;
  titleVariant?: "h4" | "h5" | "h6";
  subtitle?: React.ReactNode;
  subtitleVariant?: "h5" | "h6"; // TODO: Add h6 (from DS) smallest when needed.
  children: React.ReactNode;
  hasChildrenWithoutMargin?: boolean;
  imageSize?: "cover" | "contain";
  media?: React.ReactElement<AcceptedNode>;
  brandImageSource?: SVGImport | string;
  footer?: React.ReactNode;
  isFlat?: boolean;
  buttonComponent?: React.ComponentType<any>;
  clickableArea?: "full" | "body" | "none";
  isHighlighted?: boolean;
  moreOptionsAvailable?: string | boolean;
};

const BrandLogo = ({
  brandImageSource,
  media
}: Pick<Props, "brandImageSource" | "media">) => {
  if (!brandImageSource) {
    return null;
  }

  const className = classnames(styles["brand-logo"], {
    [styles["brand-logo--negative"]!]: Boolean(media)
  });

  if (typeof brandImageSource === "string") {
    return (
      <div className={className}>
        <img src={brandImageSource} alt="" />
      </div>
    );
  }

  const BrandLogo = brandImageSource;
  return (
    <div className={className}>
      <BrandLogo preserveAspectRatio="xMinYMin" />
    </div>
  );
};

const OverviewCard = ({
  title,
  titleVariant = "h4",
  subtitle,
  subtitleVariant = "h5",
  children,
  imageSize = "cover",
  media,
  brandImageSource,
  footer,
  isFlat = false,
  buttonComponent: Button = ButtonBase,
  className,
  clickableArea = "full",
  isHighlighted = false,
  hasChildrenWithoutMargin,
  moreOptionsAvailable = false,
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
      {transformHyphens(children)}
    </Button>
  );

  const Wrapper = isFlat || clickableArea === "body" ? "div" : ClickableArea;
  const Body = !isFlat && clickableArea === "body" ? ClickableArea : "div";
  const Title = ({ ...rest }): JSX.Element =>
    isFlat && title ? (
      <ClickableArea className={styles["clickable"]} {...rest} />
    ) : (
      <Fragment {...rest} />
    );

  return (
    <Wrapper
      className={classnames(
        styles["OverviewCard"],
        {
          [styles["OverviewCard--highlighted"]!]: isHighlighted
        },
        isFlat && styles[`OverviewCard--flat`],
        !isFlat &&
          clickableArea !== "none" &&
          styles[`OverviewCard--clickable`],
        className
      )}
    >
      <Media size={imageSize} className={styles["header-picture"]}>
        {media}
      </Media>
      <Body className={styles["body"]}>
        <BrandLogo brandImageSource={brandImageSource} media={media} />
        <Typography
          variant={titleVariant}
          className={classnames(
            styles["title"],
            !brandImageSource && styles["title--no-brand-logo"]
          )}
        >
          <Title>{title}</Title>
        </Typography>
        {!moreOptionsAvailable && subtitle && (
          <Typography variant={subtitleVariant} className={styles["text"]}>
            {subtitle}
          </Typography>
        )}
        {moreOptionsAvailable && (
          <Typography variant={subtitleVariant} className={styles["text"]}>
            {moreOptionsAvailable}
          </Typography>
        )}
        <div
          className={classnames(
            styles["children"],
            styles["text"],
            hasChildrenWithoutMargin && styles["children--without-margin"]
          )}
        >
          {transformHyphens(children)}
        </div>
        {footer && <div className={styles["footer"]}>{footer}</div>}
      </Body>
    </Wrapper>
  );
};

export default withClickable<Props>(OverviewCard);
