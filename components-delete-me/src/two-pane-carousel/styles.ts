import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      [theme.breakpoints!.up!("md")]: {
        "& $leftPane": {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "504px"
        },
        "& $heading": {
          marginBottom: "32px"
        },
        "& $image": {
          maxHeight: "none",
          height: "504px",
          marginBottom: 0,
          "&::before": {
            content: "''"
          }
        },
        "& $wrapper": {
          textAlign: "left"
        }
      }
    },
    brandIcon: {
      height: "40px",
      marginBottom: "40px",
      fill: theme.colours.white
    },
    heading: {
      paddingBottom: "24px"
    },
    image: {
      backgroundSize: "cover",
      backgroundPosition: "center center",
      maxHeight: "400px",
      marginBottom: "24px"
    },
    leftPaneSlide: {
      justifyContent: "flex-start"
    },
    text: {
      fontSize: "1rem"
    },
    controls: {
      marginTop: "32px"
    },
    cta: {
      marginTop: "32px",
      minHeight: "48px"
    },
    wrapper: {
      marginTop: "48px",
      textAlign: "center"
    },
    leftPane: {}
  }),
  {
    name: "TwoPaneCarousel"
  }
);
