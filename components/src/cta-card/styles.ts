import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      transition: "280ms cubic-bezier(0.4, 0, 0.2, 1)",
      display: "block",
      width: "100%",
      height: "100%"
    },
    body: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      flexDirection: "row-reverse",
      boxShadow:
        "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)",
      [theme.breakpoints!.up!("sm")]: {
        flexDirection: "column",
        height: "100%"
      },
      "&:hover": {
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
      }
    },
    topBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flexGrow: 1,
      minHeight: "80px",
      padding: "20px",
      width: "100%",
      backgroundColor: theme.colours.pearl,
      transition: "background-color",
      [theme.breakpoints!.up!("sm")]: {
        justifyContent: "center"
      },
      [theme.breakpoints!.up!("lg")]: {
        minHeight: "100px"
      },
      "&:hover": {
        backgroundColor: theme.colours.white
      }
    },
    heading: {
      display: "flex",
      alignItems: "center",
      color: theme.colours.inter,
      transition: "color",
      "&:hover": {
        color: theme.colours.focus
      }
    },
    icon: {
      marginLeft: "12px",
      width: "24px",
      height: "24px"
    },
    image: {
      backgroundRepeat: "no-repeat",
      backgroundOosition: "center center",
      backgroundSize: "cover",
      maxWidth: "80px",
      width: "100%",
      height: "auto",
      opacity: 0.8,
      transition: "opacity",
      [theme.breakpoints!.up!("sm")]: {
        maxWidth: "none",
        height: "140px"
      },
      "&:hover": {
        opacity: 1
      }
    }
  }),
  { name: "CTACard" }
);
