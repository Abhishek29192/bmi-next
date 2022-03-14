import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      background: `${theme.colours.black}80`,
      transition: "background ease-in-out 0.25s",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      color: theme.colours.white,
      width: "42px",
      height: "60px",

      "&:hover": {
        background: `${theme.colours.black}bf`
      }
    },
    left: {
      left: 0
    },

    right: {
      right: 0
    },

    icon: {
      color: theme.colours.white,
      height: "auto",
      width: "48px"
    }
  }),
  { name: "ThumbScrollerButton" }
);
