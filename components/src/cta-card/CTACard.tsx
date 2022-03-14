import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import Card from "../card";
import { withClickable } from "../clickable";
import Media, { AcceptedNode } from "../media";
import Typography from "../typography";
import { useStyles } from "./styles";

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
  const classes = useStyles();

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
    <WrapperElement
      data-test-class-name="card"
      className={classnames(classes.root, className)}
    >
      <Card className={classes.body}>
        <HeadingElement className={classes.topBox}>
          <Typography variant="h5" className={classes.heading}>
            {title}
            <ArrowForward className={classes.icon} />
          </Typography>
        </HeadingElement>
        <Media className={classes.image}>{media}</Media>
      </Card>
    </WrapperElement>
  );
};

export default withClickable(CTACard);
