import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      width: "100%",
      height: "100%",
      background: "transparent",
      boxShadow: "none",
      padding: "24px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column"
    },
    brandLogoButton: {
      background: "transparent",

      "&:hover": {
        background: "transparent"
      }
    },
    brandLogo: {
      fill: theme.colours.white,
      height: "60px",
      [theme.breakpoints!.up!("md")]: {
        height: "80px"
      }
    },
    description: {
      marginTop: "24px",
      marginBottom: "24px",
      alignItems: "center",
      textAlign: "center",
      display: "none",
      [theme.breakpoints!.up!("md")]: {
        display: "block"
      }
    },
    whiteBox: {
      backgroundColor: theme.colours.white
    },
    noPointer: {
      cursor: "default"
    }
  }),
  { name: "BrandIntroCard" }
);
