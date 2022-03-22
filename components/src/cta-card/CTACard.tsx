import React from "react";
import { ArrowForward } from "@material-ui/icons";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import classnames from "classnames";
import Card from "../card/Card";
import { withClickable } from "../clickable/Clickable";
import Media, { AcceptedNode } from "../media/Media";
import Typography from "../typography/Typography";
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
            <ArrowForward className={styles["icon"]} />
          </Typography>
        </HeadingElement>
        <Media className={styles["image"]}>{media}</Media>
      </Card>
    </WrapperElement>
  );
};

export default withClickable(CTACard);
