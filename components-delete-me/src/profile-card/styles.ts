import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      backgroundColor: theme.colours.white,
      boxShadow:
        "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      textAlign: "center",
      position: "relative",
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      wordBreak: "break-word",
      "&::before": {
        content: "''",
        position: "absolute",
        height: "calc(30px + 75px)",
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: theme.colours.pearl,
        zIndex: 0
      }
    },
    head: {
      width: "150px",
      height: "150px",
      display: "inline-block",
      overflow: "hidden",
      position: "relative",
      zIndex: 1,
      marginTop: "30px"
    },
    profilePicture: {
      width: "150px",
      height: "150px"
    },
    title: {
      color: theme.colours.slate
    },
    body: {
      padding: "20px 30px",
      backgroundColor: theme.colours.white,
      textAlign: "center",
      color: theme.colours.charcoal,
      flex: 1
    },
    footer: {
      textAlign: "left",
      backgroundColor: theme.colours.pearl,
      padding: "15px",
      fontSize: "1rem",
      flex: 1,
      width: "100%"
    },
    row: {
      padding: "15px",
      display: "flex",
      alignItems: "flex-start",
      fontFamily: "Effra Medium"
    },
    rowIcon: {
      color: theme.colours.slate,
      width: "24px",
      height: "24px",
      marginRight: "12px"
    }
  }),
  { name: "ProfileCard" }
);
