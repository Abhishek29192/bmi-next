import { Container as MUIContainer, ContainerProps } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import { useStyles } from "./styles";

export type Props = ContainerProps & {
  wrapperClassName?: string;
  fullWidth?: boolean;
};

const Container = ({
  className,
  maxWidth = "xl",
  wrapperClassName,
  fullWidth,
  ...props
}: Props) => {
  const classes = useStyles();

  return (
    <div
      className={classnames(
        classes.root,
        fullWidth && classes.fullWidth,
        wrapperClassName
      )}
    >
      <MUIContainer maxWidth={maxWidth} className={className} {...props} />
    </div>
  );
};

export default Container;
