import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    icon: {
      color: theme.colours.storm,
      height: "40px",
      width: "40px",
      marginTop: "50px"
    },
    wrapper: {
      width: "100%"
    },
    "@global": {
      "& $accordion": {
        "& .Mui-expanded": {
          marginTop: 0,
          marginBottom: 0,
          minHeight: 0
        }
      }
    },
    accordion: {
      backgroundColor: theme.colours.white,
      boxShadow: "none",
      border: `1px solid ${theme.colours.storm}`
    },
    accordionSummary: {
      color: theme.colours.slate,
      fontSize: "18px"
    },
    dropZone: {
      minHeight: "200px",
      width: "100%",
      border: `1px dashed ${theme.colours.storm}`,
      borderRadius: "3px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: -1,
      transition: "0.5s ease all"
    },
    drag: {
      borderColor: theme.colours.accent,
      backgroundColor: `${theme.colours.blue100}66`,
      transition: "0.5s ease all"
    },
    typography: {
      fontSize: "18px",
      padding: "5px",
      color: theme.colours.slate
    },
    label: {
      fontSize: "18px",
      color: theme.colours.inter,
      textDecoration: "underline",
      cursor: "pointer",
      padding: "5px"
    },
    instructions: {
      flex: 0,
      marginTop: "40px",
      marginBottom: "10px",
      fontSize: "14px",
      opacity: 0.4
    },
    mobileInstructions: {
      margin: "10px 5px",
      fontSize: "14px",
      opacity: 0.4
    },
    input: {
      display: "none"
    },
    file: {
      width: "100%",
      border: `1px solid ${theme.colours.alabaster}`,
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      margin: "10px 0",
      minHeight: "60px",
      padding: "5px"
    },
    filename: {
      fontSize: "14px",
      flex: 1,
      color: theme.colours.slate
    },
    fileSize: {
      fontSize: "14px",
      color: theme.colours.storm
    },
    fileDisplay: {
      height: "40px",
      width: "40px",
      margin: "10px",
      objectFit: "cover"
    },
    error: {
      color: theme.colours.error,
      fontSize: "14px"
    },
    deleteIcon: {
      marginRight: "6px",
      color: theme.colours.slate
    },
    fileInfoWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    },
    progress: {
      marginTop: "10px",
      marginRight: "5px"
    }
  }),
  {
    name: "Upload"
  }
);
