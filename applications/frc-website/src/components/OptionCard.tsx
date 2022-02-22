import React from "react";
import { Typography } from "@bmi/components";
import { Grid } from "@bmi/components";
import styles from "./OptionCard.module.scss";

const OptionCard = ({ title, description, children }: any) => (
  <div className={styles["OptionCard"]}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant={"h4"} hasUnderline className={styles["title"]}>
          {title}
        </Typography>
        <Typography variant={"body2"}>{description}</Typography>
      </Grid>
      <Grid
        item
        container
        xs={12}
        md={6}
        direction={"column"}
        spacing={2}
        justify="center"
        alignItems="center"
      >
        {children}
      </Grid>
    </Grid>
  </div>
);

export default OptionCard;
