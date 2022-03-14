import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      width: "inherit",
      marginLeft: "-24px" // Spacing * 3
    },
    column: {
      paddingLeft: "24px"
    }
  }),
  { name: "MasonryGrid" }
);
