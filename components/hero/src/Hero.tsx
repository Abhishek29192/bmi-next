import React from "react";
import styles from "./Hero.module.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import classnames from "classnames";
import { Props as BreadcrumbsProps } from "@bmi/breadcrumbs";

type Props = {
  theme?: "light" | "dark"; // defaults to "light" or something. Thing is that the background is part of this too. `isLightTheme` works too, but now I'm rethinking this lol
  imageSource?: string;
  breadcrumbs?: React.ComponentType<BreadcrumbsProps>;
  title?: React.ReactNode;
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
};

const Hero = ({
  // TODO: remove/use unused props
  theme,
  imageSource,
  breadcrumbs,
  title,
  children,
  align
}: Props) => {
  const themes = useTheme();
  const matches = useMediaQuery(themes.breakpoints.up("sm"));

  return (
    <div
      className={classnames(
        styles[`hero${matches ? "--largeBreakpoint" : "--smallBreakpoint"}`]
      )}
    >
      <div className={styles["content"]}>
        <div className={styles["breadcrumbs"]}>{breadcrumbs}</div>
        <div className={styles["text"]}>{children}</div>
      </div>
      <img src={imageSource} className={styles["image"]} alt="roof" />
    </div>
  );
};

export default Hero;
