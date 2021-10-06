import React from "react";
import Typography from "@bmi/typography";
import Card, { CardContent, CardHeader } from "@bmi/card";
import Icon from "@bmi/icon";
import { Delete } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import classnames from "classnames";
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
        component={(props) => (
          <span
            {...props}
            className={classnames(props.className, styles.cardHeader)}
          />
        )}
        titleTypographyProps={{ variant: "body1" }}
      />
      {description && (
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary">
            {description}
          </Typography>
        </CardContent>
      )}
      <div className={styles.footer}>
        <Typography variant="caption" className={styles.footer__inner}>
          {brand}
        </Typography>
        <Typography variant="caption" className={styles.footer__inner}>
          {family}
        </Typography>
      </div>
    </Card>
  );
};
