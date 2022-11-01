import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    list: {
      padding: "10px 20px",
      display: "flex",
      flexDirection: "column"
    }
  }),
  { name: "Filters" }
);
