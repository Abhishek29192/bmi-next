import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      "& $link": {
        fontSize: "1rem",
        marginBottom: "20px",
        "&:first-child": {
          marginTop: "37px"
        }
      }
    },
    link: {},
    html: {
      scrollBehavior: "smooth"
    }
  }),
  { name: "TOC" }
);
