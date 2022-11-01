import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      padding: "48px 30px",
      [theme.breakpoints!.down!(769)]: {
        padding: "48px 20px"
      }
    },
    section: {
      "&:not(:first-child)": {
        marginTop: "48px"
      }
    },
    content: {
      marginTop: "20px"
    },
    action: {
      marginTop: "20px"
    }
  }),
  {
    name: "PostItCard"
  }
);
