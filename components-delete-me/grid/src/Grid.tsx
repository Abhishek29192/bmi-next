import React, { forwardRef, Ref } from "react";
import MuiGrid, { GridProps } from "@material-ui/core/Grid";
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
          [styles["Grid--justify"]!]: rest.justify === "center"
        })}
        ref={ref}
        {...rest}
      />
    );
  }
);

Grid.displayName = "Grid";

export default Grid;
