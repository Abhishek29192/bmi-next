import React from "react";
import MUIContainer, { ContainerProps } from "@material-ui/core/Container";

const Container = (props: ContainerProps) => {
  return <MUIContainer maxWidth="xl" {...props} />;
};

export default Container;
