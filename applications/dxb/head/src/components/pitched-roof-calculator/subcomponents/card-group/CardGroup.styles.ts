import { styled, css } from "@mui/material/styles";
import {
  CardRadioGroup,
  ThemeOptions,
  CardCheckboxGroup
} from "@bmi-digital/components";

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
