import React from "react";
import Typography from "@bmi/typography";
import styles from "./styles/Header.module.scss";

interface Props {
  title: string;
}

export const Header = ({ title }: Props) => {
  return (
    <div className={styles.header}>
      <Typography variant="h3">{title}</Typography>
    </div>
  );
};
