import React from "react";
import Typography from "@bmi/typography";
import Card, { CardContent, CardHeader } from "@bmi/card";
import Icon from "@bmi/icon";
import { Delete } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import styles from "./styles.module.scss";

export type WizardProductDetailCardProp = {
  name: string;
  description: string;
  brand: string;
  family: string;
  onDeleteClick?: () => void;
};

export const WizardProductDetailCard = ({
  name,
  description,
  brand,
  family,
  onDeleteClick
}: WizardProductDetailCardProp) => {
  return (
    <Card className={styles.main}>
      <CardHeader
        action={
          onDeleteClick && (
            <IconButton onClick={onDeleteClick}>
              <Icon source={Delete} color="primary" />
            </IconButton>
          )
        }
        title={name}
      />
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
      <div className={styles.footer}>
        <Typography>{brand}</Typography>
        <Typography>{family}</Typography>
      </div>
    </Card>
  );
};
