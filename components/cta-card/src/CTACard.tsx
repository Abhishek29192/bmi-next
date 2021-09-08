import React from "react";
import Card from "@bmi/card";
import Typography from "@bmi/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ButtonBase, { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";
import Media, { AcceptedNode } from "@bmi/media";
import styles from "./CTACard.module.scss";

type Props = ButtonBaseProps & {
  buttonComponent?: React.ComponentType<any>; // TODO
  /**
   * @deprecated Use media instead.
   */
  imageSource?: string | React.ReactNode;
  media?: React.ReactElement<AcceptedNode>;
  title: React.ReactNode;
  clickableArea?: "full" | "heading";
};

const __DeprecatedImageSource = ({
  imageSource
}: Pick<Props, "imageSource">) => {
  if (!imageSource) {
    return null;
  }

  return (
    <div
      className={styles["image"]}
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

const CTACard = ({
  buttonComponent: Button = ButtonBase,
  imageSource,
  media,
  title,
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
    <Button className={className} {...rest}>
      {children}
    </Button>
  );

  const WrapperElement = clickableArea === "full" ? ClickableArea : "div";
  const HeadingElement =
    clickableArea === "heading" ? ClickableArea : "section";

  return (
    <WrapperElement className={classnames(styles["Card"], className)}>
      <Card className={styles["body"]}>
        <HeadingElement className={styles["top-box"]}>
          <Typography variant="h5" className={styles["heading"]}>
            {title}
            <ArrowForwardIcon className={styles["icon"]} />
          </Typography>
        </HeadingElement>
        <__DeprecatedImageSource imageSource={imageSource} />
        <Media className={styles["image"]}>{media}</Media>
      </Card>
    </WrapperElement>
  );
};

export default withClickable(CTACard);
