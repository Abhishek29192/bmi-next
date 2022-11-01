import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      background: theme.colours.blue900,
      color: theme.colours.white,
      padding: "50px 0"
    },
    listItem: {
      margin: 0,
      padding: 0,
      marginTop: "16px"
    },
    listItemIcon: {
      display: "inline-block",
      "& .MuiSvgIcon-root": {
        fontSize: "2em"
      }
    },
    iconLink: {
      fill: theme.colours.storm,
      fontSize: "16px",
      "&:first-child": {
        marginLeft: "-4px"
      }
    },
    icon: {
      width: "1.5em",
      color: "#cccccc"
    },
    link: {
      color: theme.colours.storm,
      justifyContent: "flex-start",
      width: "100%",
      fontFamily: "Effra Regular",

      [theme.breakpoints!.up!(1024)]: {
        fontFamily: "Effra Medium"
      }
    },
    list: {
      margin: "0 0 0 -8px",
      padding: 0,
      listStyleType: "none"
    },
    secondaryNavigation: {
      borderTop: `1px solid rgba(255, 255, 255, 0.25)`,
      marginTop: "30px",
      padding: "30px 0 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      [theme.breakpoints!.up!("lg")]: {
        flexDirection: "row",
        alignItems: "flex-start"
      }
    },
    logo: {
      width: "70px",
      [theme.breakpoints!.up!("sm")]: {
        width: "75px"
      },
      [theme.breakpoints!.up!("lg")]: {
        width: "50px"
      }
    },
    listInline: {
      margin: "40px 0",
      textAlign: "center",
      [theme.breakpoints!.up!("lg")]: {
        margin: "0 40px",
        textAlign: "left"
      },

      "& $listItem": {
        marginTop: 0,
        textAlign: "center",
        [theme.breakpoints!.up!("sm")]: {
          marginRight: "16px",
          display: "inline-block"
        },
        "&:last-child": {
          marginRight: 0
        }
      },
      "& $link": {
        width: "auto",
        [theme.breakpoints!.up!("sm")]: {
          width: "100%"
        }
      }
    },
    standardLogo: {
      textAlign: "right",
      flex: 1,
      fill: theme.colours.storm,
      "& > svg": {
        width: "125px"
      }
    },
    noBorder: {
      "& $secondaryNavigation": {
        border: "none"
      }
    }
  }),
  { name: "Footer" }
);
