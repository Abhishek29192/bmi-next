import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      width: "100%",
      height: "100%",
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      /* Override ButtonBase styles */
      alignItems: "normal",
      textAlign: "left",
      "& .MuiLink-root": {
        textDecoration: "none"
      },
      [theme.breakpoints!.down!(420)]: {
        padding: "20px"
      }
    },
    clickable: {
      opacity: 0.8,
      boxShadow:
        "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      transition:
        "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        opacity: 1,
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
      }
    },
    title: {
      marginBottom: "24px"
    },
    body: {
      marginBottom: "16px",
      fontSize: "16px"
    },
    footer: {
      marginTop: "auto"
    }
  }),
  {
    name: "NBACard"
  }
);
