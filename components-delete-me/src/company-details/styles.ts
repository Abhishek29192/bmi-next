import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      fontStyle: "normal",
      fontSize: "1rem",
      display: "flex",
      flexDirection: "column",
      maxHeight: "100%",
      flex: 1
    },
    title: {
      marginBottom: "30px",
      [theme.breakpoints!.up!("md")]: {
        marginBottom: "20px"
      }
    },
    list: {
      margin: 0
    },
    roofProLevelIcon: {
      height: "20px",
      verticalAlign: "text-bottom"
    },
    address: {
      fontStyle: "inherit"
    },
    row: {
      display: "flex",
      margin: "20px 0"
    },
    cta: {
      margin: "24px 0 36px"
    },
    icon: {
      height: "24px",
      width: "24px",
      marginRight: "12px",
      color: theme.colours.slate
    },
    term: {
      display: "contents"
    },
    description: {
      margin: 0,
      "&:last-child": {
        marginBottom: 0
      }
    },
    label: {
      flexShrink: 0,
      display: "inline-block",
      marginRight: "12px",
      "&::after": {
        content: '":"',
        display: "inline"
      },
      [theme.breakpoints!.up!("md")]: {
        marginBottom: 0
      }
    },
    button: {
      width: "100%",
      [theme.breakpoints!.up!("md")]: {
        width: "220px"
      }
    },
    accessibilityLabel: {
      display: "block",
      textIndent: "-9999px",
      overflow: "hidden",
      position: "absolute"
    },
    link: {
      fontFamily: "Effra Medium"
    }
  }),
  { name: "CompanyDetails" }
);
