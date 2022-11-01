import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      marginTop: "-24px"
    },
    heading: {
      marginRight: "24px",
      marginTop: "24px",
      flexBasis: "100%",
      [theme.breakpoints!.up!("md")]: {
        flexBasis: "auto"
      }
    },
    link: {
      marginRight: "24px",
      marginTop: "24px",
      "&:last-child": {
        marginRight: 0
      }
    }
  }),
  { name: "ExploreBar" }
);
