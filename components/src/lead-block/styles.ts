import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      padding: "32px 0",
      fontSize: "1rem"
    },
    leadBlockContentHeading: {
      marginBottom: "24px"
    },
    leadBlockContentSection: {
      marginBottom: "32px"
    }
  }),
  {
    name: "LeadBlock"
  }
);
