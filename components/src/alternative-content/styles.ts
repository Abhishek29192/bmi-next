import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      display: "block",
      textIndent: "-9999px",
      overflow: "hidden",
      position: "absolute"
    }
  }),
  { name: "AlternativeContent" }
);
