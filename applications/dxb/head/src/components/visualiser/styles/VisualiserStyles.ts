import { ThemeOptions } from "@bmi-digital/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      height: "100vh",
      width: "100vw",
      [theme.breakpoints!.up!("md")]: {
        "& $detailsLogo": {
          marginBottom: "1rem"
        },

        "& $detailsTitle": {
          marginBottom: "1rem"
        }
      }
    },

    secondary: {
      boxShadow: "none"
    },

    groupTitle: {
      marginTop: "24px",
      marginBottom: "24px"
    },

    shareButton: {
      width: "48px",
      height: "48px",
      minWidth: "unset"
    },

    content: {
      overflowY: "auto",
      height: "100%",
      backgroundColor: theme.colours.pearl,
      padding: 0
    },

    contentTitle: {
      margin: "6px auto 16px 30px",
      alignSelf: "center"
    },

    progressContainer: {
      position: "absolute",
      top: "70px",
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.65)",
      borderRadius: "3px"
    },

    details: {
      display: "flex",
      gap: "40px",
      alignItems: "center",
      margin: "18px 10px",
      [theme.breakpoints!.up!("sm")]: {
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-start",

        "& $detailsActions": {
          marginLeft: "unset"
        }
      }
    },

    detailsActions: {
      display: "flex",
      gap: "12px",
      marginLeft: "auto",

      [theme.breakpoints!.up!("sm")]: {
        width: "100%"
      },

      "& button": {
        "&:first-child": {
          flex: 1
        }
      }
    },

    detailsLogo: {
      marginBottom: "0.5rem",
      [theme.breakpoints!.up!("md")]: {
        marginBottom: "1rem"
      }
    },

    detailsTitle: {
      marginBottom: "0.5rem",
      [theme.breakpoints!.up!("md")]: {
        marginBottom: "1rem"
      }
    },

    detailsText: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap"
    },

    actions: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colours.blue800,
      minHeight: "5rem",
      padding: "0.875rem"
    },

    icon: {
      fill: "rgba(255, 255, 255, 0.8)"
    },

    container: {
      [theme.breakpoints!.up!("sm")]: {
        padding: "0px 20px"
      }
    },
    viewer: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0
    },
    activeSelectionOption: {
      padding: "0px",
      border: `2px solid ${theme.colours.accent}`
    },
    VisualiserPopover: {},
    "@global": {
      [theme.breakpoints!.up!("sm")]: {
        "[class*=MuiButton-label]": {
          display: "flex",
          flexFlow: "column"
        }
      },
      "[class*=canvas:focus]": {
        outline: "none"
      },
      "[class*=MuiPaper-root]": {
        pointerEvents: "all",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        boxShadow: "none"
      },
      "[class*=MuiPopover-paper]": {
        padding: "0 10px",

        [theme.breakpoints!.down!("sm")]: {
          maxWidth: "100%",
          width: "100%",
          left: "0 !important"
        },

        "&::before": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          margin: "0 10px",
          borderTop: `1px solid ${theme.colours.pearl}`
        }
      },
      "& $viewer": {
        "[class*=canvas:focus]": {
          outline: "none"
        }
      },
      "& $details": {
        "[class*=MuiPaper-root]": {
          pointerEvents: "all",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          boxShadow: "none"
        }
      }
    }
  }),
  { name: "Visualiser" }
);
