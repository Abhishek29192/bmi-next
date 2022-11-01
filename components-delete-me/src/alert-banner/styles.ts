import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      position: "relative",
      padding: "8px 0",
      fontSize: "1rem"
    },
    sticky: {
      position: "sticky"
    },
    success: {
      border: `4px solid ${theme.colours.success}`,
      "& $icon": {
        color: theme.colours.success
      }
    },
    error: {
      border: `4px solid ${theme.colours.error}`,
      "& $icon": {
        color: theme.colours.error
      }
    },
    actions: {
      color: "inherit",
      position: "absolute",
      top: "8px",
      right: "8px"
    },
    title: {
      display: "flex",
      alignContent: "center",
      margin: "16px 0 24px"
    },
    icon: {
      width: "24px",
      height: "24px",
      marginRight: "12px"
    }
  }),
  { name: "AlertBanner" }
);
