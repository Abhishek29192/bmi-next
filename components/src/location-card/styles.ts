import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      padding: "20px",
      boxShadow:
        "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      fontStyle: "normal",
      fontSize: "1rem",
      height: "100%",
      backgroundColor: theme.colours.white,
      [theme.breakpoints!.up!("md")]: {
        padding: "30px"
      }
    },
    flat: {
      boxShadow: "none",
      padding: 0,
      backgroundColor: "transparent",
      [theme.breakpoints!.up!("md")]: {
        padding: 0
      },
      "& $label": {
        position: "static",
        left: "auto",
        top: "auto",
        width: "auto",
        height: "auto",
        overflow: "auto",
        [theme.breakpoints!.up!("md")]: {
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden"
        }
      },
      "& $icon": {
        marginRight: 0
      }
    },
    list: {
      margin: "36px 0 0",
      [theme.breakpoints!.up!("md")]: {
        marginTop: "32px",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "23px"
      }
    },
    footNote: {
      marginTop: "36px",
      color: theme.colours.charcoal,
      fontSize: "16px"
    },
    term: {
      display: "flex",
      [theme.breakpoints!.up!("md")]: {
        gridColumn: 1
      }
    },
    icon: {
      height: "24px",
      width: "24px",
      marginRight: "12px",
      display: "none",
      color: theme.colours.slate,
      [theme.breakpoints!.up!("md")]: {
        display: "inline-block"
      }
    },
    label: {
      display: "inline-block",
      color: theme.colours.slate,
      [theme.breakpoints!.up!("md")]: {
        marginBottom: 0
      },
      "&::after": {
        content: "':'",
        display: "inline"
      }
    },
    description: {
      margin: "10px 0 24px",
      [theme.breakpoints!.up!("md")]: {
        gridColumn: 2,
        margin: 0
      },
      "&:last-child": {
        marginBottom: 0
      }
    },
    link: {
      fontFamily: "Effra Medium"
    }
  }),
  { name: "LocationCard" }
);
