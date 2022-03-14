import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      width: "100%",
      height: "100%",
      paddingTop: "24px",
      background: theme.colours.white,
      boxShadow:
        "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    brandLogo: {
      fill: theme.colours.white,
      border: `5px solid ${theme.colours.white}`,
      height: "50px",
      width: "fit-content"
    },
    headerPicture: {
      height: "180px",
      background: "no-repeat center center"
    },
    title: {
      margin: "24px 0 20px 0"
    },
    boldNobb: {
      fontWeight: "bold"
    },
    link: {
      marginTop: "24px",
      marginBottom: "24px"
    },
    body: {
      padding: "24px 30px",
      display: "flex",
      flexDirection: "column"
    }
  }),
  {
    name: "ProductDetailsCard"
  }
);
