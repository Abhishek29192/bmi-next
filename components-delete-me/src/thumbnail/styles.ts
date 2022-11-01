import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "inline-block",
      border: `1px solid ${theme.colours.white}`,
      margin: "2px",
      backgroundPosition: "center center",
      backgroundColor: theme.colours.slate,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      width: "60px",
      height: "50px",
      "&:hover": {
        boxShadow: `0 0 0 2px ${theme.colours.inter}50`
      }
    },
    disabled: {
      opacity: 0.5,
      "&:hover": {
        boxShadow: "none"
      }
    },
    selected: {
      boxShadow: `0 0 0 2px ${theme.colours.accent300}`,
      cursor: "default",
      "&:hover": {
        boxShadow: `0 0 0 2px ${theme.colours.accent300}`,
        cursor: "default"
      }
    },
    large: {
      width: "80px",
      height: "60px",
      backgroundSize: "cover"
    },
    accessibilityText: {
      textIndent: "-9999px",
      overflow: "hidden",
      display: "inline-block",
      // NOTE: This sets the Ripple's colour
      color: theme.colours.charcoal
    },
    playIcon: {
      fontSize: "2rem",
      fill: theme.colours.white,
      cursor: "pointer"
    },
    cubeIcon: {
      fontSize: "2rem",
      fill: theme.colours.white,
      cursor: "pointer",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  }),
  {
    name: "Thumbnail"
  }
);
