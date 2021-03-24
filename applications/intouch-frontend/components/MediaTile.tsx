import React from "react";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import styles from "./styles/MediaTile.module.scss";

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const MediaTile = ({ children }: Props) => (
  <div>
    <TouchRipple>
      <div className={styles.mediaTileContent}>Icon</div>
    </TouchRipple>
    <div className={styles.mediaTileFooter}>
      <div className={styles.mediaTileTitle}>File Name</div>
      <div className={styles.mediaTileMeta}>FOLDER</div>
    </div>
  </div>
);

export default MediaTile;
