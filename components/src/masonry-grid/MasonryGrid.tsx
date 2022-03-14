import { useTheme } from "@material-ui/core";
import React from "react";
import Masonry from "react-masonry-css";
import { useStyles } from "./styles";

type MasonryGridProps = {
  children: React.ReactNode;
};

const MasonryGrid = ({ children }: MasonryGridProps) => {
  const classes = useStyles();
  const defaultTheme = useTheme();

  const { lg, md, sm, xs } = defaultTheme.breakpoints.values;

  const breakpointColumnsObj = {
    default: 3,
    [lg]: 3,
    [md]: 2,
    [sm]: 1,
    [xs]: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={classes.root}
      columnClassName={classes.column}
    >
      {children}
    </Masonry>
  );
};

export default MasonryGrid;
