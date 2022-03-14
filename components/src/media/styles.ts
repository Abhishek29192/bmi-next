import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      width: "100%",
      height: "100%",
      display: "block",
      objectFit: "cover",
      objectPosition: "center",
      position: "relative"
    },
    contain: {
      objectFit: "contain"
    }
  }),
  { name: "Media" }
);
