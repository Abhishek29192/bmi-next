import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    wrapper: {
      padding: "30px 0"
    },
    titleLargeScreen: { marginBottom: "24px" },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    signupLabel: {
      width: "100%"
    }
  }),
  { name: "SignupBlock" }
);
