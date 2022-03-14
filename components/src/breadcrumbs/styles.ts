import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      "& li:last-child:not(:first-child)": {
        "& $button:disabled": {
          color: theme.colours.slate
        }
      }
    },
    separator: {
      margin: "0 1px"
    },
    button: {
      fontSize: "16px",
      paddingLeft: "6px",
      paddingRight: "6px",
      minWidth: "auto"
    },
    link: {
      textDecoration: "none",
      display: "inline-flex"
    },
    icon: {
      fontSize: "inherit"
    },
    label: {
      maxWidth: "20ch",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    ellipsis: {
      margin: "0 6px",
      color: theme.colours.focus
    },
    darkThemed: {
      color: theme.colours.storm,
      "& $ellipsis": {
        color: "inherit"
      },
      "& $button": {
        textDecoration: "underline",
        textDecorationColor: "currentColor"
      },
      "& li:last-child:not(:first-child)": {
        "& $button": {
          color: theme.colours.storm,
          textDecoration: "none"
        },
        "& $button:disabled": {
          color: theme.colours.storm
        },
        "& $label": {
          maxWidth: "none"
        }
      }
    }
  }),
  { name: "Breadcrumbs" }
);
