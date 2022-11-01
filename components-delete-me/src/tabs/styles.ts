import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useGlobalTabStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      position: "relative"
    },
    ContainerRoot: {
      fontSize: "1rem",
      paddingLeft: "0px",
      paddingRight: "0px"
    },
    TabsRoot: {
      fontSize: "1rem",
      marginBottom: "2px",
      "& .tabsScrollBtn": {
        position: "absolute",
        height: "100%",
        zIndex: 2,
        background: theme.colours.white,
        transition: "all 0.2s ease-out",
        "&:first-child": {
          left: 0,
          opacity: 1
        },
        "&:last-child": {
          right: 0,
          opacity: 1
        },
        "&.Mui-disabled": {
          opacity: 0,
          transition: "all 0.2s ease-out"
        }
      }
    },
    TabRoot: {
      fontSize: "1rem",
      minWidth: "initial",
      padding: "6px 15px",
      "& .Mui-selected": {
        fontFamily: "Effra Medium"
      }
    },
    TabPanel: {
      "&[hidden]": {
        position: "absolute",
        top: "-9999px",
        left: "-99999px",
        width: "100%",
        display: "block"
      }
    },
    TabPanelBox: {
      background: theme.colours.white,
      padding: "24px 24px 0 24px"
    },
    TabsBar: {
      backgroundColor: theme.colours.white,
      fontSize: "1.25rem",
      position: "relative"
    },
    secondary: {
      "& $TabsBar": {
        backgroundColor: theme.colours.pearl,
        borderBottom: `1px solid ${theme.colours.storm}`,
        borderTop: `1px solid ${theme.colours.storm}`,
        [theme.breakpoints!.up!("sm")]: {
          border: "none"
        }
      }
    },
    visibleUntilmd: {
      [theme.breakpoints!.up!("lg")]: {
        display: "flex",
        "& $TabsBar": {
          display: "none"
        },
        "& $TabPanel, & $TabPanelBox": {
          display: "initial",
          "&[hidden]": {
            position: "initial",
            left: 0,
            top: 0
          }
        }
      }
    },
    visibleUntilsm: {
      [theme.breakpoints!.up!("md")]: {
        display: "flex",
        "& $TabsBar": {
          display: "none"
        },
        "& $TabPanel, & $TabPanelBox": {
          display: "initial",
          "&[hidden]": {
            position: "initial",
            left: 0,
            top: 0
          }
        }
      }
    }
  }),
  { name: "Tabs" }
);
