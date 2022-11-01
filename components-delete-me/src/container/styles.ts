import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      /* NOTE: handle iPhone safe area when in landscape mode */
      /*paddingLeft: "env(safe-area-inset-left, 0)",*/
      /*paddingRight: "env(safe-area-inset-right, 0)"*/
    },
    fullWidth: {
      width: "100%"
    }
  }),
  { name: "Container" }
);
