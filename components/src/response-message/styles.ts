import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      padding: "100px 0"
    },
    icon: {
      width: "auto",
      height: "80px",
      color: theme.colours.inter
    },
    error: {
      color: theme.colours.error
    },
    title: {
      padding: "10px 0"
    }
  }),
  { name: "ResponseMessage" }
);
