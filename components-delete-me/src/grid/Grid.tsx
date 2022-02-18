import React, { forwardRef, Ref } from "react";
import { Grid as MuiGrid, GridProps } from "@material-ui/core";
import classnames from "classnames";
import styles from "./Grid.module.scss";

const Grid = forwardRef(
  ({ item, container, ...rest }: GridProps, ref: Ref<HTMLDivElement>) => {
    if (item) {
      return <MuiGrid item className={styles["item"]} ref={ref} {...rest} />;
    }

    return (
      <MuiGrid
        spacing={3}
        container
        className={classnames(styles["Grid"], {
          [styles["Grid--justifyContent"]!]: rest.justifyContent === "center"
        })}
        ref={ref}
        {...rest}
      />
    );
  }
);

Grid.displayName = "Grid";

export default Grid;
