import React from "react";
import { useStyles } from "./styles";

type Props = {
  children: React.ReactNode;
};

const AlternativeContent = ({ children }: Props) => {
  const classes = useStyles();
  return <span className={classes.root}>{children}</span>;
};

export default AlternativeContent;
