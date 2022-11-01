import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {},
    rightAlignButton: {
      "& $buttonWrapper": {
        justifyContent: "flex-end"
      },
      "& $button": {
        marginRight: 0,
        marginLeft: "15px"
      }
    },
    button: { marginTop: "15px", marginRight: "15px" },
    buttonWrapper: {
      display: "flex"
    },
    row: {}
  }),
  { name: "Form" }
);
