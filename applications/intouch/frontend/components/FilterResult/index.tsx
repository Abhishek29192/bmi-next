import React from "react";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { ChevronRight } from "@material-ui/icons";
import styles from "./styles.module.scss";

export type FilterResultProps = {
  label: string;
  children: React.ReactNode | React.ReactNode[];
};

export const FilterResult = ({ label, children }: FilterResultProps) => {
  return (
    <div>
      <CardActionArea>
        <CardContent className={styles.main}>
          <Typography variant="h6" className={styles.title}>
            {label ? label : "Label"}
          </Typography>
          <div>{children}</div>
          <Icon
            source={ChevronRight}
            className={styles.chevron}
            style={{ fontSize: 36 }}
            color="disabled"
          />
        </CardContent>
      </CardActionArea>
    </div>
  );
};