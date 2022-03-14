import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    option: {
      "& mark": {
        backgroundColor: "transparent",
        fontWeight: "bold"
      }
    },
    startAdornmentIcon: {
      color: theme.colours.slate,
      width: "18px",
      height: "18px",
      margin: "0 7px"
    }
  }),
  { name: "Autocomplete" }
);
