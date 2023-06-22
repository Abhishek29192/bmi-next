import classnames from "classnames";
import React from "react";

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
      "section",
      lessMargin && "section--less-margin",
      xLessMargin && "section--x-less-margin",
      xxLessMargin && "section--xx-less-margin",
      className
    )}
    {...rest}
  />
);

export default Section;
