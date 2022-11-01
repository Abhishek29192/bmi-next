import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "inline-block",
      color: theme.colours.inter
    },
    disabled: {
      opacity: 0.38,
      color: theme.colours.black
    },
    input: {
      position: "absolute",
      clip: "rect(0 0 0 0)",
      "&:focus + $label": {
        border: "1px solid currentColor"
      },
      "&:checked + $label": {
        border: "2px solid currentColor"
      }
    },
    label: {
      display: "flex",
      flexFlow: "row nowrap",
      cursor: "pointer",
      border: `1px solid ${theme.colours.storm}`,
      borderRadius: "6px",
      overflow: "hidden"
    },
    text: {
      padding: "12px 48px",
      color: "currentColor",
      fontSize: "18px",
      lineHeight: "24px"
    }
  }),
  { name: "RadioButton" }
);
