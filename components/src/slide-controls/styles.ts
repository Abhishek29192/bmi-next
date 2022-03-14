import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

const $animationDuration = "0.3s";
export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      minHeight: "48px"
    },
    fullSize: {
      width: "100%",
      justifyContent: "space-between"
    },
    vertical: {
      flexDirection: "column",
      "& $middleContainer": {
        margin: "10px 0",
        padding: "10px 0",
        overflow: "hidden"
      }
    },
    hide: {
      "& $middleContainer": {
        display: "none"
      }
    },
    slidingSlot: {
      height: "28px"
    },
    middleContainer: {
      display: "flex",
      margin: "0 24px",
      userSelect: "none",
      position: "relative"
    },
    chevron: {
      width: "37px",
      height: "37px",
      color: theme.colours.slate,
      transition: "0.2s color ease-in-out",
      "&:hover": {
        color: theme.colours.charcoal
      }
    },
    numbers: {
      display: "flex",
      flexDirection: "column"
    },
    up: {
      animation: `$slide ${$animationDuration} ease-in-out both`
    },
    down: {
      animation: `$slide ${$animationDuration} ease-in-out reverse both`
    },
    total: {
      marginLeft: "2px",
      fontSize: "20px",
      color: theme.colours.slate,
      "&::before": {
        content: "'/'",
        display: "inline-block",
        marginRight: "4px"
      }
    },
    active: {},
    number: {
      fontSize: "20px",
      width: "28px",
      textAlign: "center",
      color: theme.colours.slate,
      animation: `$fade ${$animationDuration} ease-in-out reverse both`,
      "&$active": {
        animation: `$fade ${$animationDuration} ease-in-out both`
      },
      "&:first-child:last-child": {
        opacity: 1,
        animation: "none"
      }
    },
    light: {
      "& $number, & $total, & $chevron": {
        color: `${theme.colours.white}cc`,
        "&:hover": {
          color: theme.colours.white
        }
      }
    },
    "@keyframes slide": {
      "0%": {
        marginTop: 0
      },
      "100%": {
        marginTop: "-100%"
      }
    },
    "@keyframes fade": {
      "0%": {
        opacity: 0
      },
      "100%": {
        opacity: 1
      }
    }
  }),
  { name: "SlideControls" }
);
