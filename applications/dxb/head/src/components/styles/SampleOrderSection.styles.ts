import { styled } from "@mui/material/styles";

const PREFIX = "SampleOrderSection";

export const classes = {
  "sample-message": `${PREFIX}-sample-message`,
  "buttons-container": `${PREFIX}-buttons-container`,
  "complete-order": `${PREFIX}-complete-order`
};

export const StyledSampleOrderContainer = styled("div")(({ theme }) => ({
  margin: "18px 0px",
  paddingTop: "18px",
  overflow: "hidden",
  [theme.breakpoints.down("lg")]: {
    //original media query!!
    //@media (max-width: 1300px) {
    marginBottom: "0"
  },
  [`.${classes["sample-message"]}`]: {
    display: "flex",
    marginBottom: "12px",
    justifyContent: "flex-end",
    [theme.breakpoints.up("lg")]: {
      marginBottom: "18px"
    }
  },
  [`.${classes["buttons-container"]}`]: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: "0 -16px",
    padding: "0 8px",
    boxSizing: "content-box",

    "& button": {
      width: "100%",
      whiteSpace: "nowrap",
      fontSize: "18px",
      flexGrow: 1,
      margin: "8px",
      [theme.breakpoints.down("lg")]: {
        fontSize: "16px"
      }
    },

    [theme.breakpoints.down("lg")]: {
      //original media query!!
      //@media (max-width: 1300px) {
      flexDirection: "column",
      margin: "auto",
      boxSizing: "border-box",
      width: "auto"
    }
  },
  [`.${classes["complete-order"]}`]: {
    margin: "8px",
    flexGrow: "1"
  }
}));
