import React from "react";
import Card from "@bmi/card";
import Icon from "@bmi/icon";
import Typography from "@bmi/typography";
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