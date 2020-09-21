import React from "react";
import Card from "@bmi/card";
import Typography from "@bmi/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";
import styles from "./CTACard.module.scss";

type Props = ButtonBaseProps & {
  imageSource: string;
  title: React.ReactNode;
};

const CTACard = ({ imageSource, title, className, ...rest }: Props) => (
  <ButtonBase className={classnames(styles["Card"], className)} {...rest}>
    <Card className={styles["body"]}>
      <section className={styles["top-box"]}>
        <Typography variant="h5" className={styles["heading"]}>
          {title}
          <ArrowForwardIcon className={styles["icon"]} />
        </Typography>
      </section>
      <div
        className={styles["image"]}
        style={{ backgroundImage: `url(${imageSource})` }}
      />
    </Card>
  </ButtonBase>
);

export default withClickable(CTACard);
