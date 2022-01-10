import React from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Card from "@bmi/card";
import { SVGImport } from "@bmi/svg-import";
import Typography from "@bmi/typography";
import DefaultButton, { ClickableAction } from "@bmi/button";
import styles from "./BrandIntroCard.module.scss";

type Props = {
  logoIcon: SVGImport;
  buttonComponent?: React.ComponentType<any>; // TODO
  description: React.ReactNode;
  buttonLabel: React.ReactNode;
  action?: ClickableAction;
};

const BrandIntroCard = ({
  logoIcon,
  buttonComponent: Button = DefaultButton,
  description,
  buttonLabel,
  action
}: Props) => {
  const BrandLogo = logoIcon;

  return (
    <Card className={styles["BrandIntroCard"]}>
      <Button
        className={styles["brandLogoButton"]}
        action={action}
        variant="text"
        disableRipple
      >
        <BrandLogo
          preserveAspectRatio="xMinYMin"
          className={styles["brandLogo"]}
        />
      </Button>
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
