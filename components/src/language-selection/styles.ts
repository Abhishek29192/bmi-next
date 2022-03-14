import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    heading: {
      marginTop: "2rem",
      marginBottom: "1.25rem"
    },
    container: {
      margin: "0 -12px"
    },
    item: {
      padding: "0 12px"
    },
    link: {
      justifyContent: "start",
      width: "100%",
      margin: 0
    },
    languageIcon: {
      marginRight: "10px",
      width: "20px"
    }
  }),
  {
    name: "LanguageSelection"
  }
);
