import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      padding: 0
    },
    container: {
      display: "flex",
      flexFlow: "row wrap",
      margin: "-12px"
    },
    item: {
      margin: "12px"
    }
  }),
  { name: "RadioGroup" }
);
