import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      alignItems: "center",
      color: theme.colours.slate,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      paddingTop: "16px"
    },
    title: {
      margin: "0 24px 16px 0",
      color: theme.colours.charcoal
    },
    iconList: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      listStyle: "none",
      margin: "0 0 16px",
      paddingLeft: 0
    },
    iconButton: {
      height: "42px",
      width: "42px"
    },
    icon: {
      fill: theme.colours.slate
    },
    leftAligned: {
      justifyContent: "flex-start",
      "& $iconList": {
        justifyContent: "flex-start"
      }
    }
  }),
  { name: "ShareWidget" }
);

export const useEmailDialogStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    input: {
      marginTop: "1rem"
    },
    "@global": {
      ".MuiInputBase-root": {
        backgroundColor: theme.colours.white
      }
    }
  }),
  { name: "EmailDialog" }
);
