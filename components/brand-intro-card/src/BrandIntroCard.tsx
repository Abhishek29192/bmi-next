import React from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Card from "@bmi/card";
import Typography from "@bmi/typography";
import Button, { ClickableAction } from "@bmi/button";
import styles from "./BrandIntroCard.module.scss";

type Props = {
  logoIcon: SVGImport;
  description: React.ReactNode;
  buttonLabel: React.ReactNode;
  action?: ClickableAction;
};

const BrandIntroCard = ({
  logoIcon,
  description,
  buttonLabel,
  action
}: Props) => {
  const BrandLogo = logoIcon;

  return (
    <Card className={styles["BrandIntroCard"]}>
      <BrandLogo
        preserveAspectRatio="xMinYMin"
        className={styles["brand-logo"]}
      />
      <Typography className={styles["description"]} variant="subtitle1">
        {description}
      </Typography>
      <Button action={action} variant="text" endIcon={<ArrowForwardIcon />}>
        {buttonLabel}
      </Button>
    </Card>
  );
};

export default BrandIntroCard;
