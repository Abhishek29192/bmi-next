import React from "react";
import classnames from "classnames";
import styles from "./FlatRoofCalculator.module.scss";

export type SectionProps = {
  lessMargin?: boolean;
  xLessMargin?: boolean;
  xxLessMargin?: boolean;
} & React.HTMLProps<HTMLDivElement>;

const Section = ({
  className,
  lessMargin,
  xLessMargin,
  xxLessMargin,
  ...rest
}: SectionProps) => (
  <div
    className={classnames(
      styles["section"],
      {
        [styles["section--less-margin"]]: lessMargin,
        [styles["section--x-less-margin"]]: xLessMargin,
        [styles["section--xx-less-margin"]]: xxLessMargin
      },
      className
    )}
    {...rest}
  />
);

export default Section;
