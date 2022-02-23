import React from "react";
import { Card } from "@bmi/components";
import { Icon } from "@bmi/components";
import { Typography } from "@bmi/components";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link } from "../../../Link";
import styles from "./styles.module.scss";

type UserContactCardProps = {
  href: string;
  label: string;
};

export const UserContactCard = ({ href, label }: UserContactCardProps) => (
  <Card className={styles.main}>
    <Link href={href}>
      <div className={styles.heading}>
        <Typography variant="body1" component="span" className={styles.link}>
          {label}
        </Typography>
        <Icon source={ArrowForwardIcon} className={styles.icon} />
      </div>
    </Link>
    <img src="/images/contactroof.jpg" alt="" className={styles.image} />
  </Card>
);
