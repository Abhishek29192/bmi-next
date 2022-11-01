import { SVGImport } from "@bmi-digital/svg-import";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import classnames from "classnames";
import React, { Fragment } from "react";
import { withClickable } from "../clickable";
import Media, { AcceptedNode } from "../media";
import Typography from "../typography/Typography";
import { transformHyphens } from "../utils/hyphenUtils";
import { useStyles } from "./styles";

export type Props = Omit<ButtonBaseProps, "action"> & {
  title: React.ReactNode;
  titleVariant?: "h4" | "h5" | "h6";
  subtitle?: React.ReactNode;
  subtitleVariant?: "h5" | "h6"; // TODO: Add h6 (from DS) smallest when needed.
  children?: React.ReactNode;
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
  const classes = useStyles();
  if (!brandImageSource) {
    return null;
  }

  const className = classnames(classes.brandLogo, media && classes.negative);

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
  const classes = useStyles();
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
      <ClickableArea className={classes.clickableArea} {...rest} />
    ) : (
      <Fragment {...rest} />
    );

  return (
    <Wrapper
      className={classnames(
        classes.root,
        isHighlighted && classes.highlighted,
        isFlat && classes.flat,
        !isFlat && clickableArea !== "none" && classes.clickable,
        className
      )}
    >
      <Media size={imageSize} className={classes.headerPicture}>
        {media}
      </Media>
      <Body className={classes.body}>
        <BrandLogo brandImageSource={brandImageSource} media={media} />
        <Typography
          variant={titleVariant}
          className={classnames(
            classes.title,
            !brandImageSource && classes.noBrandLogo
          )}
        >
          <Title>{transformHyphens(title)}</Title>
        </Typography>
        {!moreOptionsAvailable && subtitle && (
          <Typography variant={subtitleVariant} className={classes.text}>
            {transformHyphens(subtitle)}
          </Typography>
        )}
        {moreOptionsAvailable && (
          <Typography variant={subtitleVariant} className={classes.text}>
            {transformHyphens(moreOptionsAvailable)}
          </Typography>
        )}
        <div
          className={classnames(
            classes.children,
            classes.text,
            hasChildrenWithoutMargin && classes.withoutMargin
          )}
        >
          {transformHyphens(children)}
        </div>
        {footer && <div className={classes.footer}>{footer}</div>}
      </Body>
    </Wrapper>
  );
};

export default withClickable<Props>(OverviewCard);
