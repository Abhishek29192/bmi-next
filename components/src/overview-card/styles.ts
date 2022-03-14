import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      background: theme.colours.white,
      boxShadow:
        "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    highlighted: {
      border: `3px solid ${theme.colours.inter}`
    },
    flat: {
      background: "transparent",
      boxShadow: "none",
      "& $body": {
        padding: "24px 0"
      },
      "& $clickableArea": {
        "&:hover": {
          color: theme.colours.focus
        }
      }
    },
    clickable: {
      /* override BaseButton styles */
      alignItems: "normal",
      textAlign: "initial",
      transition:
        "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
        "& $headerPicture": {
          opacity: 1
        },
        "& $title": {
          color: theme.colours.focus
        },
        "& $text": {
          color: theme.colours.charcoal
        }
      },
      "& $headerPicture": {
        opacity: 0.8,
        transition: "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)"
      },
      "& $title, $text": {
        transition: "color 280ms cubic-bezier(0.4, 0, 0.2, 1)"
      }
    },
    brandLogo: {
      padding: "5px",
      height: "50px",
      zIndex: 2,
      overflow: "hidden",
      "& svg, img": {
        fill: theme.colours.white,
        height: "100%",
        objectFit: "contain",
        objectPosition: "left"
      }
    },
    negative: {
      marginTop: "-50px",
      "& svg, img": {
        backgroundColor: theme.colours.white
      }
    },
    headerPicture: {
      height: "180px"
    },
    body: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      padding: "30px 24px",
      /* override BaseButton styles */
      alignItems: "normal",
      textAlign: "initial",
      [theme.breakpoints!.up!("sm")]: {
        padding: "30px"
      }
    },
    title: {
      color: theme.colours.inter,
      marginTop: "24px",
      wordWrap: "break-word"
    },
    noBrandLogo: {
      marginTop: 0
    },
    text: {
      color: theme.colours.slate,
      marginTop: "24px",
      wordWrap: "break-word"
    },
    children: {
      margin: "24px 0",
      fontSize: "16px"
    },
    withoutMargin: {
      margin: 0
    },
    footer: {
      marginTop: "auto",
      fontSize: "1rem"
    },
    clickableArea: {}
  }),
  {
    name: "OverviewCard"
  }
);
