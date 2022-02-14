import React from "react";
import Card from "@bmi-digital/components/card";
import Typography from "@bmi-digital/components/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ButtonBase, { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import classnames from "classnames";
import { withClickable } from "@bmi-digital/components/clickable";
import Media, { AcceptedNode } from "@bmi-digital/components/media";
import styles from "./CTACard.module.scss";

type Props = ButtonBaseProps & {
  buttonComponent?: React.ComponentType<any>; // TODO
  media?: React.ReactElement<AcceptedNode>;
  title: React.ReactNode;
  clickableArea?: "full" | "heading";
};

const CTACard = ({
  buttonComponent: Button = ButtonBase,
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
        <Media className={styles["image"]}>{media}</Media>
      </Card>
    </WrapperElement>
  );
};

export default withClickable(CTACard);
