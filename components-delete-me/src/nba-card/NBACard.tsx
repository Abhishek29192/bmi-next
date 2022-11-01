import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import { withClickable } from "../clickable/Clickable";
import ColorPair, { Colors } from "../color-pair/ColorPair";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

export type Props = Omit<ButtonBaseProps, "action"> & {
  theme: Colors;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  buttonComponent?: React.ComponentType<any>;
  isClickable?: boolean;
};

const NBACard = ({
  theme,
  title,
  children,
  footer,
  className,
  buttonComponent: Button = ButtonBase,
  isClickable = true,
  ...rest
}: Props) => {
  const classes = useStyles();
  return (
    <ColorPair
      markupComponent={isClickable ? Button : "div"}
      className={classnames(
        classes.root,
        isClickable && classes.clickable,
        className
      )}
      {...rest}
      theme={theme}
    >
      <Typography className={classes.title} variant="h4">
        {title}
      </Typography>
      <div className={classes.body}>{children}</div>
      {footer && <div className={classes.footer}>{footer}</div>}
    </ColorPair>
  );
};

export default withClickable<Props>(NBACard);
