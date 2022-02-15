import React from "react";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@bmi-digital/components";
import { Icon } from "@bmi-digital/components";
import { ChevronRight } from "@material-ui/icons";
import styles from "./styles.module.scss";

export type FilterResultProps = {
  label: string;
  onClick?: () => void;
  isSelected?: boolean;
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
};

export const FilterResult = ({
  label,
  onClick,
  isSelected = false,
  children,
  testId
}: FilterResultProps) => {
  return (
    <div data-testid={testId}>
      <CardActionArea
        onClick={onClick}
        classes={{
          root: isSelected ? styles.cardActionArea__isActive : undefined
        }}
      >
        <CardContent className={styles.main}>
          <Typography variant="h6" className={styles.title}>
            {label}
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
