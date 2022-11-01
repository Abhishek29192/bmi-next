import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      boxShadow:
        "0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)",
      borderRadius: "3px",
      outline: "none",
      width: "calc(100% - 32px)",
      maxHeight: "calc(100% - 20px)",
      display: "flex",
      flexFlow: "column nowrap",
      [theme.breakpoints!.up!("md")]: {
        width: "calc(100% - 48px)"
      },
      [theme.breakpoints!.down!("sm")]: {
        maxHeight: "100%",
        boxShadow: "none",
        borderRadius: 0,
        height: "100%",
        width: "100%"
      },
      [theme.breakpoints!.up!("xl")]: {
        height: "100%"
      }
    },
    header: {
      display: "flex",
      flex: "0 0 auto",
      flexFlow: "row nowrap",
      justifyContent: "flex-end"
    },
    iconButton: {
      color: theme.colours.charcoal,
      margin: "6px 6px 16px 16px"
    },
    content: {
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingBottom: "10px",
      paddingTop: "0px",
      margin: "0px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints!.down!("sm")]: {
        height: "100%"
      },
      [theme.breakpoints!.up!("xl")]: {
        height: "100%"
      }
    },
    allowOverflow: {
      "&$content": {
        overflow: "auto"
      }
    },
    "bg-white": {
      backgroundColor: theme.colours.white
    },
    "bg-pearl": {
      backgroundColor: theme.colours.pearl
    },
    "bg-alabaster": {
      backgroundColor: theme.colours.alabaster
    },
    "width-sm": {
      maxWidth: theme.breakpoints!.values!.sm
    },
    "width-md": {
      maxWidth: theme.breakpoints!.values!.md
    },
    "width-lg": {
      maxWidth: theme.breakpoints!.values!.lg
    },
    "width-xl": {
      maxWidth: theme.breakpoints!.values!.xl
    }
  }),
  { name: "ContainerDialog" }
);
