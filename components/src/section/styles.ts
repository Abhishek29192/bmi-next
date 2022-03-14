import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      padding: "60px 0",
      backgroundColor: "transparent",
      overflow: "hidden"
    },
    overflowVisible: {
      overflow: "visible"
    },
    alabaster: {
      backgroundColor: theme.colours.alabaster
    },
    pearl: {
      backgroundColor: theme.colours.pearl
    },
    white: {
      backgroundColor: theme.colours.white
    },
    noSpacing: {
      padding: 0
    },
    slim: {
      padding: "32px 0"
    },
    title: {
      marginBottom: "60px"
    }
  }),
  { name: "Section" }
);
