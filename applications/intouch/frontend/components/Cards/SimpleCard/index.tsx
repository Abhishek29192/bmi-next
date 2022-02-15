import React from "react";
import { Card } from "@bmi-digital/components";
import CardContent from "@material-ui/core/CardContent";
import styles from "./styles.module.scss";

type SimpleCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const SimpleCard = ({ children, ...rest }: SimpleCardProps) => (
  <Card className={styles.card} {...rest}>
    <CardContent>{children}</CardContent>
  </Card>
);
