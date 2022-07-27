import { SVGImport } from "@bmi-digital/svg-import";
import { ArrowForward } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import DefaultButton from "../button/Button";
import Card from "../card/Card";
import { ClickableAction } from "../clickable/Clickable";
import Typography from "../typography/Typography";
import styles from "./BrandIntroCard.module.scss";

type Props = {
  logoIcon: SVGImport;
  buttonComponent?: React.ComponentType<any>; // TODO
  description?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  action?: ClickableAction;
  whiteBox?: boolean;
};

const BrandIntroCard = ({
  logoIcon,
  buttonComponent: Button = DefaultButton,
  description,
  buttonLabel,
  action,
  whiteBox = false
}: Props) => {
  const BrandLogo = logoIcon;

  return (
    <Card className={styles["BrandIntroCard"]}>
      <Button
        className={classnames(
          styles["brandLogoButton"],
          !action && styles["brandLogoButton-no-pointer"]
        )}
        action={action}
        variant="text"
        disableRipple
      >
        <BrandLogo
          preserveAspectRatio="xMinYMin"
          className={classnames(styles["brandLogo"], {
            [styles["brandLogo-whiteBox"]!]: whiteBox
          })}
        />
      </Button>
      {description && (
        <Typography className={styles["description"]} variant="subtitle1">
          {description}
        </Typography>
      )}

      {buttonLabel && (
        <Button action={action} variant="text" endIcon={<ArrowForward />}>
          {buttonLabel}
        </Button>
      )}
    </Card>
  );
};

export default BrandIntroCard;
