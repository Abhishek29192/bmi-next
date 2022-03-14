import { alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      opacity: 1,
      transition: "visibility 280s, opacity 280ms linear",
      position: "fixed",
      right: 0,
      bottom: "100px",
      zIndex: 3,
      "& .MuiButton-root": {
        minWidth: "auto",
        width: "56px",
        height: "56px"
      }
    },
    hidden: {
      visibility: "hidden",
      opacity: 0
    },
    button: {
      cursor: "pointer",
      borderRadius: "6px 0 0 6px",
      boxShadow: `0px 8px 10px ${alpha(theme.colours.black, 0.2)}`,
      border: "none",
      backgroundColor: theme.colours.black,
      opacity: 0.5,
      "&:hover": {
        backgroundColor: theme.colours.black,
        opacity: 0.75
      }
    },
    icon: {
      fontSize: "36px",
      width: "36px",
      height: "36px",
      color: theme.colours.white
    }
  }),
  { name: "BackToTop" }
);
