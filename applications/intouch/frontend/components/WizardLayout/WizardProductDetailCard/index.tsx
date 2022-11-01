import {
  Card,
  CardContent,
  CardHeader,
  Icon,
  Typography
} from "@bmi-digital/components";
import IconButton from "@material-ui/core/IconButton";
import { Delete } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
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
