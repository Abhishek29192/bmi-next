import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      position: "relative",
      [theme.breakpoints!.up!("sm")]: {
        height: "630px"
      }
    },
    keyline: {
      borderBottom: `8px solid ${theme.colours.accent}`
    },
    image: {
      width: "100%",
      height: "100%",
      position: "relative",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    },
    video: {
      position: "absolute",
      top: 0
    },
    overlay: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 0,
      "&::after": {
        content: "''",
        position: "absolute",
        zIndex: 1,
        height: "100%",
        width: "100%",
        opacity: 0.8,
        top: 0
      }
    },
    cyan: {
      "&::after": {
        backgroundColor: theme.colours.cyan700
      }
    },
    blue: {
      "&::after": {
        backgroundColor: theme.colours.blue900
      }
    },
    charcoal: {
      "&::after": {
        backgroundColor: theme.colours.charcoal
      }
    },
    teal: {
      "&::after": {
        backgroundColor: theme.colours.teal500
      }
    },
    content: {
      position: "relative",
      zIndex: 1,
      color: theme.colours.white,
      maxWidth: "600px",
      paddingTop: "28px",
      paddingBottom: "40px",
      [theme.breakpoints!.up!("sm")]: {
        marginBottom: "auto"
      }
    },
    text: {
      minHeight: "auto",
      width: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      webkitBoxOrient: "vertical"
    },
    cta: {
      marginTop: "24px",
      display: "block",
      width: "fit-content"
    },
    header: {
      position: "relative",
      zIndex: 1,
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))",
      width: "100%"
    },
    headerContainer: {
      minHeight: "200px",
      display: "flex",
      flexDirection: "column"
    },
    title: {
      position: "relative",
      zIndex: 2,
      color: theme.colours.white,
      marginTop: "auto"
    },
    breadcrumbs: {
      marginTop: "24px"
    }
  }),
  { name: "SpotlightHero" }
);
