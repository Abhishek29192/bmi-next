import React from "react";
import classnames from "classnames";
import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";
import styles from "./Truncate.module.scss";

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
  return (
    <ResponsiveEllipsis
      className={classnames(className, styles["Truncate"])}
      component={component || "span"}
      text={children}
      maxLine={lines}
    />
  );
};

export default Truncate;
