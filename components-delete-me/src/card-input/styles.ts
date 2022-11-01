import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "block",
      height: "100%",
      "& $input:checked + $card": {
        padding: "0px",
        border: `2px solid ${theme.colours.accent}`
      }
    },
    input: {
      position: "absolute",
      clip: "rect(0 0 0 0)"
    },
    card: {
      padding: "2px",
      height: "100%"
    }
  }),
  { name: "CardInput" }
);
