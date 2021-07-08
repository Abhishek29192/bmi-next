import React from "react";
import Card from "@bmi/card";
import CardContent from "@material-ui/core/CardContent";
import styles from "./styles.module.scss";

export const SimpleCard = ({ children }: { children: React.ReactNode }) => (
  <Card className={styles.card}>
    <CardContent>{children}</CardContent>
  </Card>
);
