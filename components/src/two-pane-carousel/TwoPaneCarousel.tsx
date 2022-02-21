import React from "react";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core";
import { Props } from "./types";
import styles from "./TwoPaneCarousel.module.scss";
import MobileTwoPaneCarousel from "./_MobileTwoPaneCarousel";
import TabletTwoPaneCarousel from "./_TabletTwoPaneCarousel";

const TwoPaneCarousel = ({
  children,
  ...props
}: Props & { children?: React.ReactNode }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const carousel = matches ? (
    <TabletTwoPaneCarousel {...props} />
  ) : (
    <MobileTwoPaneCarousel {...props} />
  );

  return (
    <div className={styles["TwoPaneCarousel"]}>
      {carousel}
      {children && <div className={styles["wrapper"]}>{children}</div>}
    </div>
  );
};

export default TwoPaneCarousel;
