import { styled } from "@mui/material/styles";
import { TextField } from "@bmi-digital/components";

const PREFIX = "InputTextField";

export const classes = {
  textField: `${PREFIX}-textField`,
  numberInput: `${PREFIX}-numberInput`
};

export const Root = styled(TextField)(({ theme }) => ({
  [`.${classes.textField}`]: {
    backgroundColor: theme.colours.white
  },

  [`.${classes.numberInput}`]: {
    appearance: "textfield",
    ["&::-webkit-inner-spin-button"]: {
      appearance: "none"
    },
    ["&::-webkit-outer-spin-button"]: {
      appearance: "none"
    }
  }
}));
