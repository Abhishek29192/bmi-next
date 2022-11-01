import { SVGImport } from "@bmi-digital/svg-import";
import { ArrowForward } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import DefaultButton from "../button/Button";
import Card from "../card/Card";
import { ClickableAction } from "../clickable/Clickable";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type Props = {
  name: string;
  logoIcon: SVGImport;
  buttonComponent?: React.ComponentType<any>; // TODO
  description?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  action?: ClickableAction;
  whiteBox?: boolean;
};

const BrandIntroCard = ({
  name,
  logoIcon,
  buttonComponent: Button = DefaultButton,
  description,
  buttonLabel,
  action,
  whiteBox = false
}: Props) => {
  const classes = useStyles();
  const BrandLogo = logoIcon;

  return (
    <Card className={classes.root}>
      <Button
        className={classnames(
          classes.brandLogoButton,
          !action && classes.noPointer
        )}
        action={action}
        variant="text"
        aria-label={name}
        disableRipple
        data-testid={"brandLogoButton"}
      >
        <BrandLogo
          data-testid={"brandLogo"}
          preserveAspectRatio="xMinYMin"
          className={classnames(
            classes.brandLogo,
            whiteBox && classes.whiteBox
          )}
        />
      </Button>
      {description && (
        <Typography
          className={classes.description}
          variant="subtitle1"
          data-testid={"brandLogoDescription"}
        >
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
