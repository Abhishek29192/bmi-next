import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      position: "relative",
      height: "100%",
      "@global": {
        ".MuiPaper-root": {
          display: "flex",
          flexDirection: "column",
          maxHeight: "100%",
          "& .MuiCardContent-root": {
            display: "flex",
            flex: 1,
            overflow: "hidden"
          }
        }
      }
    },
    map: {
      backgroundColor: theme.colours.pearl,
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      height: "100%"
    },
    error: {
      color: theme.colours.error
    },
    popup: {
      left: 0,
      margin: "0 auto",
      position: "absolute",
      right: 0,
      top: 0,
      height: "100%",
      maxWidth: "500px",
      padding: "32px 20px",
      pointerEvents: "none",
      "& > *": {
        pointerEvents: "all"
      }
    }
  }),
  { name: "GoogleMap" }
);
