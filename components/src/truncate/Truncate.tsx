import classnames from "classnames";
import React from "react";
import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";
import { useStyles } from "./styles";

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

type Props = {
  /**
   * The `react-lines-ellipsis` package only accepts string.
   */
  children: string;
  lines: number;
  component?: React.ElementType;
  className?: string;
};

const Truncate = ({ children, lines, component, className }: Props) => {
  const classes = useStyles();
  return (
    <ResponsiveEllipsis
      className={classnames(className, classes.root)}
      component={component || "span"}
      text={children}
      maxLine={lines}
    />
  );
};

export default Truncate;
