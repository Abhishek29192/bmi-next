import CardCheckboxGroup from "@bmi-digital/components/card-checkbox-group";
import CardRadioGroup from "@bmi-digital/components/card-radio-group";
import { ThemeOptions } from "@bmi-digital/components/theme-provider";
import { css, styled } from "@mui/material/styles";

const PREFIX = "CardGroup";

export const classes = {
  gridContainer: `${PREFIX}-gridContainer`
};

const getSharedStyled = (theme: ThemeOptions) =>
  css({
    width: "100%",

    [`.${classes.gridContainer}`]: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      margin: "-8px 0"
    }
  });

export const StyledCardRadioGroup = styled(CardRadioGroup)(({ theme }) =>
  getSharedStyled(theme)
);
export const StyledCardCheckboxGroup = styled(CardCheckboxGroup)(({ theme }) =>
  getSharedStyled(theme)
);
