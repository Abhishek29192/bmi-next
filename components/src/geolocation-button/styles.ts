import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      textDecoration: "underline",
      "&:hover": {
        textDecoration: "underline"
      }
    }
  }),
  { name: "GeolocationButton" }
);
