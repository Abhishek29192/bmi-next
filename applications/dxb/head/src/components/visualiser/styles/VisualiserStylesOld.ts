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
      margin: "6px 0"
    },

    content: {
      overflowY: "auto",
      height: "100%"
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
      position: "absolute",
      top: "70px",
      left: "30px",
      pointerEvents: "none",
      right: "30px"
    },

    detailsLogo: {
      marginBottom: "0.5rem"
    },

    detailsTitle: {
      marginBottom: "0.5rem"
    },

    actions: {
      position: "absolute",
      border: 0,
      left: 0,
      bottom: 0,
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
        padding: "0px 20px 20px"
      }
    },
    viewer: {
      display: "flex",
      height: "100%",
      alignItems: "center",
      justifyContent: "center"
    },
    activeSelectionOption: {
      padding: "0px",
      border: `2px solid ${theme.colours.accent}`
    },
    VisualiserPopover: {},
    "@:global": {
      "& $VisualiserPopover": {
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
        }
      },
      "& $viewer": {
        "[class*=canvas:focus]": {
          outline: "none"
        }
      },
      "& $actions": {
        [theme.breakpoints!.up!("sm")]: {
          "[class*=MuiButton-label]": {
            display: "flex",
            flexFlow: "column"
          }
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
