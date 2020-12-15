import React from "react";
import MuiGrid, { GridProps } from "@material-ui/core/Grid";
import classnames from "classnames";
import styles from "./Grid.module.scss";

export type Props = GridProps;

const Grid = ({ item, container, ...rest }: Props) => {
  if (item) {
    return <MuiGrid item className={styles["item"]} {...rest} />;
  }

  return (
    <MuiGrid
      spacing={3}
      container
      className={classnames(styles["Grid"], {
        [styles["Grid--justify"]]: rest.justify === "center"
      })}
      {...rest}
    />
  );
};

export default Grid;
