import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      padding: "0px",
      "& container": {
        display: "flex",
        flexFlow: "row wrap",
        margin: "-12px"
      }
    },
    item: {
      margin: "1px"
    }
  }),
  { name: "CardRadioGroup" }
);
