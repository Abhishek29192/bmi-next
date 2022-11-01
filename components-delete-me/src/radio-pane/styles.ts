import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "block",
      "& + &": {
        marginTop: "8px"
      }
    },
    radioPaneContainer: {
      marginTop: "8px",
      display: "block"
    },
    descriptionContainer: {
      overflow: "hidden",
      transition: "height 280ms cubic-bezier(0.4, 0, 0.2, 1)"
    },
    btnContainer: {
      display: "flex",
      alignItems: "center",
      height: "60px",
      marginLeft: "8px"
    },
    iconBtn: {
      minWidth: "42px",
      width: "42px",
      height: "42px",
      borderRadius: 0
    },
    infoIcon: {
      width: "24px",
      height: "24px",
      color: theme.colours.inter
    },
    cancelIcon: {
      width: "24px",
      height: "24px",
      color: "#70706f"
    },
    collapseFeature: {
      display: "flex",
      "& $root": {
        flexGrow: 1
      }
    },
    input: {
      position: "absolute",
      clip: "rect(0 0 0 0)",
      "&:focus + $pane": {
        border: `1px solid ${theme.colours.accent}`
      },
      "&:checked + $pane": {
        border: `2px solid ${theme.colours.accent}`,
        backgroundColor: theme.colours.white,

        "& $checkedIcon": {
          display: "block"
        }
      },
      "&:not(:checked) + $pane": {
        cursor: "pointer",
        "&:hover": {
          boxShadow:
            "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
          backgroundColor: theme.colours.white,
          "& $title": {
            color: theme.colours.focus
          }
        }
      }
    },
    pane: {
      display: "flex",
      flexFlow: "column nowrap",
      alignItems: "flex-start",
      justifyContent: "stretch",
      boxShadow:
        "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      border: `1px solid ${theme.colours.storm}`,
      borderRadius: "3px",
      overflow: "hidden",
      padding: "0 30px",
      cursor: "default",
      backgroundColor: theme.colours.pearl
    },
    checkedIcon: {
      display: "none",
      height: "32px",
      color: theme.colours.accent,
      marginLeft: "16px"
    },
    header: {
      display: "flex",
      flexFlow: "row nowrap",
      justifyContent: "flex-start",
      alignItems: "center",
      height: "60px"
    },
    title: {
      color: theme.colours.inter,
      lineHeight: 1
    },
    content: {
      width: "100%",
      paddingBottom: "30px"
    },
    hr: {
      color: theme.colours.storm,
      marginBottom: "24px"
    }
  }),
  { name: "RadioPane" }
);
