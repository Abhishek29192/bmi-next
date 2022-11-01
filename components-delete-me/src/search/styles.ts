import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      maxWidth: "800px"
    },
    helperText: {
      color: theme.colours.slate,
      margin: 0,
      fontSize: "0.75rem",
      marginTop: "3px",
      lineHeight: 1.66
    },
    clearIcon: {
      fontSize: "1.25rem",
      color: theme.colours.slate
    }
  }),
  { name: "Search" }
);
