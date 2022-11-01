import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& $li:not(:last-child)": {
        marginBottom: "12px"
      }
    },
    li: {
      "&::before": {
        display: "inline-block",
        content: '""',
        width: "9px",
        height: "9px",
        backgroundColor: theme.colours.accent,
        marginRight: "18px"
      }
    }
  }),
  { name: "Bullets" }
);
