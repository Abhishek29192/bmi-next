import { BMI, Icon, Typography } from "@bmi-digital/components";
import CardActionArea from "@material-ui/core/CardActionArea";
import classnames from "classnames";
import React from "react";
import styles from "./styles.module.scss";

export type ActionTileProps = {
  title: string;
  description: string;
  disabled?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
};

export const ActionTile = ({
  title,
  description,
  disabled = false,
  onClick,
  isSelected
}: ActionTileProps) => {
  return (
    <div className={styles.main}>
      <CardActionArea
        className={classnames(styles["clickable"], {
          [styles["clickable--selected"]]: isSelected
        })}
        disabled={disabled}
        onClick={onClick}
      >
        <Icon source={BMI} className={styles.logo} />
        <div className={styles.text}>
          <Typography variant="h5" className={styles.title}>
            {title}
          </Typography>
          <Typography variant="subtitle2">{description}</Typography>
        </div>
      </CardActionArea>
    </div>
  );
};
