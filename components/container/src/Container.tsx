import React from "react";
import MUIContainer, { ContainerProps } from "@material-ui/core/Container";

export type Props = ContainerProps;

const Container = ({ className, maxWidth = "xl", ...props }: Props) => {
  return <MUIContainer maxWidth={maxWidth} className={className} {...props} />;
};

export default Container;
