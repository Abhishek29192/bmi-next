import { useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { useStyles } from "./styles";
import { Props } from "./types";
import MobileTwoPaneCarousel from "./_MobileTwoPaneCarousel";
import TabletTwoPaneCarousel from "./_TabletTwoPaneCarousel";

const TwoPaneCarousel = ({
  children,
  ...props
}: Props & { children?: React.ReactNode }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();

  const carousel = matches ? (
    <TabletTwoPaneCarousel {...props} />
  ) : (
    <MobileTwoPaneCarousel {...props} />
  );

  return (
    <div className={classes.root}>
      {carousel}
      {children && <div className={classes.wrapper}>{children}</div>}
    </div>
  );
};

export default TwoPaneCarousel;
