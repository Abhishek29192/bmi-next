import { Grid as MuiGrid, GridProps } from "@material-ui/core";
import classnames from "classnames";
import React, { forwardRef, Ref } from "react";
import { useStyles } from "./styles";

const Grid = forwardRef(
  ({ item, container, ...rest }: GridProps, ref: Ref<HTMLDivElement>) => {
    const classes = useStyles();

    if (item) {
      return <MuiGrid item className={classes.item} ref={ref} {...rest} />;
    }

    return (
      <MuiGrid
        spacing={3}
        container
        className={classnames(
          rest.justifyContent === "center" && classes.justifyContent
        )}
        ref={ref}
        {...rest}
      />
    );
  }
);

Grid.displayName = "Grid";

export default Grid;
