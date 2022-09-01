import { Typography } from "@bmi/components";
import React from "react";
import styles from "./DescriptionCard.module.scss";

const DescriptionCard = ({ title, icon: Icon, children }: any) => (
  <div className={styles["DescriptionCard"]}>
    <div className={styles["header"]}>
      <Icon className={styles["icon"]} />
      <Typography variant={"h6"} hasUnderline className={styles["title"]}>
        {title}
      </Typography>
    </div>
    <Typography className={styles["description"]} variant={"body1"}>
      {children}
    </Typography>
  </div>
);

export default DescriptionCard;
