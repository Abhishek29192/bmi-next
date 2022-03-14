import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      fontFamily: "Effra Regular",
      background: "transparent",
      color: theme.colours.inter,
      border: "none",
      padding: "8px 15px",
      fontSize: "1.5rem",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      cursor: "pointer",
      lineHeight: "1.5em",
      textAlign: "left",
      "&:hover": {
        background: `${theme.colours.black}0d`,
        color: theme.colours.focus
      }
    },
    selected: {
      fontFamily: "Effra Medium",
      fontWeight: "bold",
      "& $icon": {
        opacity: 1
      }
    },
    icon: {
      marginLeft: "15px",
      display: "inline-block",
      width: "24px",
      height: "24px",
      opacity: 0,
      transition: "opacity ease-out 0.28s"
    }
  }),
  { name: "RollerSelector" }
);
