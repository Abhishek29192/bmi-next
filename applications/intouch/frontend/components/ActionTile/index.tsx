import React from "react";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { BMI } from "@bmi/logo";
import styles from "./styles.module.scss";

export type ActionTileProps = {
  title: string;
  description: string;
  // action?: ClickableAction;
};

export const ActionTile = ({ title, description }: ActionTileProps) => {
  return (
    <div className={styles.main}>
      <CardActionArea className={styles.clickable}>
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
