import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      position: "relative"
    },
    leftColumn: {
      padding: "60px 0 0",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints!.up!("md")]: {
        paddingBottom: "60px"
      }
    },
    selectors: {
      margin: "32px 0 8px",
      [theme.breakpoints!.up!("md")]: {
        marginBottom: "48px"
      }
    },
    selector: {
      marginTop: "8px",
      "&:first-child": {
        marginTop: 0
      }
    },
    controls: {
      display: "none",
      [theme.breakpoints!.up!("md")]: {
        display: "flex",
        marginTop: "auto",
        width: "70px",
        zIndex: 2,
        overflow: "unset",
        position: "relative",
        bottom: "auto"
      },

      // TODO: This is a temporary hack. When the vertical swiping will be
      // available, we'll revisit this.
      "&::before": {
        content: "''",
        position: "absolute",
        zIndex: 0,
        top: "1px",
        right: "-8px",
        bottom: "-8px",
        left: "-8px",
        background: `linear-gradient(
        to right,
        ${theme.colours.pearl} 80%,
        ${theme.colours.pearl}00 100%
      )`
      }
    },
    rightColumn: {
      marginBottom: "60px",
      "& $slide": {
        display: "block",
        "&::after": {
          content: "''",
          display: "block",
          clear: "both"
        }
      }
    },
    slide: {},
    image: {
      position: "relative",
      display: "block",
      width: "100%",
      maxHeight: "400px",
      backgroundPosition: "center center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      marginBottom: "32px",
      [theme.breakpoints!.up!("md")]: {
        height: "400px"
      }
    },
    withImageSource: {
      "&::before": {
        content: "''",
        width: "100%",
        display: "block",
        paddingTop: "100%",
        [theme.breakpoints!.up!("md")]: {
          "&::before": {
            content: "''"
          }
        }
      }
    },
    brandIcon: {
      position: "absolute",
      top: "10px",
      left: "10px",
      backgroundColor: theme.colours.white,
      fill: theme.colours.white,
      padding: "5px",
      height: "50px",
      zIndex: 1
    },
    description: {
      marginBottom: "32px",
      fontSize: "1rem"
    },
    button: {
      float: "right"
    }
  }),
  {
    name: "VerticalRoller"
  }
);
