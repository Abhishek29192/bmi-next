import { alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      color: theme.colours.inter,
      textDecoration: "underline",
      textDecorationColor: "currentColor",
      fontSize: "inherit",
      display: "inline-flex",
      alignItems: "center",
      position: "relative",
      cursor: "pointer",
      "&::before": {
        content: '""',
        position: "absolute",
        height: "42px",
        top: "50%",
        marginTop: "-21px",
        left: 0,
        right: 0
      },
      "&:hover": {
        color: theme.colours.focus,
        transition: `currentColor 250ms ease-out, color 250ms ease-out`
      }
    },
    disabled: {
      opacity: 0.3,
      pointerEvents: "none"
    },
    white: {
      color: alpha(theme.colours.white, 0.8),
      "&:hover": {
        color: theme.colours.white
      }
    },
    black: {
      color: alpha(theme.colours.black, 0.8),
      "&:hover": {
        color: theme.colours.black
      }
    },
    icon: {
      width: "1.125em",
      height: "1.125em",
      fill: "currentColor",
      "&:first-child": {
        marginRight: "12px"
      },
      "&:last-child": {
        marginLeft: "12px"
      }
    },
    "icon--inverted": {
      transform: "rotate(180deg)"
    }
  }),
  { name: "AnchorLink" }
);
