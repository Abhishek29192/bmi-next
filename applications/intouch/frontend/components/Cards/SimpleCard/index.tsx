import React from "react";
import Card from "@bmi/card";
import CardContent from "@material-ui/core/CardContent";
import styles from "./styles.module.scss";

type SimpleCardProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const SimpleCard = ({ children, style = {} }: SimpleCardProps) => (
  <Card className={styles.card} style={style}>
    <CardContent>{children}</CardContent>
  </Card>
);
