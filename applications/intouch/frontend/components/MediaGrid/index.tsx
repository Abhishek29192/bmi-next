import React from "react";
import Typography from "@bmi/typography";
import styles from "./styles.module.scss";

export type MediaGridProps = {
  children: React.ReactNode[];
};

export const MediaGrid = ({ children }: MediaGridProps) => (
  <div className={styles.mediaGrid}>
    <div className={styles.meta}>
      <Typography variant="subtitle2" display="block">
        Showing {children.length} of {children.length} items
      </Typography>
    </div>
    <div className={styles.tiles}>{children}</div>
  </div>
);
