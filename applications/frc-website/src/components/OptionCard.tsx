import { Grid, Typography } from "@bmi-digital/components";
import React from "react";
import styles from "./OptionCard.module.scss";

const OptionCard = ({ title, description, children }: any) => (
  <div className={styles["OptionCard"]}>
    <Grid container spacing={3}>
      <Grid xs={12} md={6}>
        <Typography variant={"h4"} hasUnderline className={styles["title"]}>
          {title}
        </Typography>
        <Typography variant={"body2"}>{description}</Typography>
      </Grid>
      <Grid
        container
        xs={12}
        md={6}
        direction={"column"}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Grid>
    </Grid>
  </div>
);

export default OptionCard;
