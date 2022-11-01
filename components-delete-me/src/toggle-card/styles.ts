import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "block",
      width: "100%",
      height: "100%",
      borderRadius: "4px",
      "&:hover": {
        "& $body": {
          boxShadow:
            "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
        },
        "& $topBox": {
          backgroundColor: theme.colours.white
        },
        "& $image": {
          opacity: 1
        },
        "& $illustration": {
          opacity: 1
        },
        "& $title": {
          color: theme.colours.focus
        },
        "& $paragraph": {
          color: theme.colours.charcoal
        }
      },
      "&:focus": {
        outline: `1px solid ${theme.colours.accent}`
      }
    },
    body: {
      display: "flex",
      padding: "20px",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      flexDirection: "column",
      boxShadow:
        "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
    },
    title: {
      wordWrap: "break-word",
      textAlign: "center",
      color: theme.colours.focus
    },
    only: {
      marginTop: "16px",
      marginBottom: "16px"
    },
    paragraph: {
      marginTop: "16px",
      wordWrap: "break-word",
      textAlign: "center",
      color: theme.colours.slate
    },
    image: {
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "contain",
      height: "140px",
      maxWidth: "100%",
      opacity: 0.8,
      transition: "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)",
      padding: "20px 20px 20px 20px",

      img: {
        "&:not(.png)": {
          width: "100%"
        }
      },
      [theme.breakpoints!.up!("sm")]: {
        height: "96px",
        padding: 0,
        marginBottom: "8px"
      }
    },
    contain: {
      backgroundSize: "contain"
    },
    disabled: {
      "& $body": {
        boxShadow:
          "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
      },
      "& $topBox": {
        backgroundColor: theme.colours.white
      },
      "& $image": {
        opacity: 0.35
      },
      "& $illustration": {
        opacity: 0.35
      },
      "& $title": {
        color: theme.colours.focus,
        opacity: 0.35
      },
      "& $paragraph": {
        color: theme.colours.slate,
        opacity: 0.35
      }
    }
  }),
  {
    name: "ToggleCard"
  }
);
