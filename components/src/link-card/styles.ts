import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      boxShadow: "none",
      backgroundColor: theme.colours.white,
      color: theme.colours.slate,
      padding: "16px",
      borderRadius: "0%",
      cursor: "pointer",
      [theme.breakpoints!.up!("lg")]: {
        border: `1px solid ${theme.colours.storm}`,
        marginTop: "-1px",
        "&:hover": {
          color: theme.colours.charcoal,
          backgroundColor: theme.colours.pearl,
          "& $icon": {
            color: `${theme.colours.black}59`
          }
        }
      },
      "& + &": {
        borderTop: `1px solid ${theme.colours.storm}`
      }
    },
    open: {
      [theme.breakpoints!.up!("lg")]: {
        backgroundColor: theme.colours.alabaster,
        color: theme.colours.charcoal
      },
      "& $icon": {
        "& svg": {
          color: theme.colours.inter,
          transform: "rotate(-90deg)",
          transition: "transform ease-in-out 280ms, color ease-in-out 280ms",
          [theme.breakpoints!.up!("lg")]: {
            color: `${theme.colours.black}33`
          }
        },
        [theme.breakpoints!.up!("lg")]: {
          "& svg": {
            transform: "none"
          }
        }
      }
    },
    item: {
      flex: "2 0"
    },
    subtitle: {
      fontSize: "16px",
      lineHeight: 1.2
    },
    icon: {
      height: "24px",
      width: "24px",
      margin: "12px",
      color: `${theme.colours.black}33`,
      flex: "0 1",
      "& svg": {
        transform: "rotate(90deg)",
        transition: "transform ease-in-out 280ms, color ease-in-out 280ms",
        [theme.breakpoints!.up!("lg")]: {
          transform: "none"
        }
      }
    },
    details: {
      flex: "3 0 100%",
      [theme.breakpoints!.up!("lg")]: {
        display: "none"
      }
    }
  }),
  {
    name: "LinkCard"
  }
);
