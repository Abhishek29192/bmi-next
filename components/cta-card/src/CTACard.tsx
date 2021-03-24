import React from "react";
import Card from "@bmi/card";
import Typography from "@bmi/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { ButtonBase, ButtonBaseProps, Link } from "@material-ui/core";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";
import styles from "./CTACard.module.scss";

type Props = ButtonBaseProps & {
  imageSource: string | React.ReactNode;
  title: React.ReactNode;
};

const CTACard = ({ imageSource, title, className, ...rest }: Props) => {
  const btnAction = typeof imageSource === "string" ? rest : null;
  return (
    <ButtonBase
      className={classnames(styles["Card"], className)}
      {...btnAction}
    >
      <Card className={styles["body"]}>
        <section className={styles["top-box"]}>
          <ButtonBase {...rest} disableRipple>
            <Typography variant="h5" className={styles["heading"]}>
              {title}
              <ArrowForwardIcon className={styles["icon"]} />
            </Typography>
          </ButtonBase>
        </section>
        <div
          className={styles["image"]}
          style={
            typeof imageSource === "string"
              ? { backgroundImage: `url(${imageSource})` }
              : {}
          }
        >
          {typeof imageSource !== "string" && imageSource}
        </div>
      </Card>
    </ButtonBase>
  );
};

export default withClickable(CTACard);
