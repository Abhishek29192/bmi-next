import { styled } from "@mui/material/styles";
import FieldContainer from "./subcomponents/_FieldContainer";

const PREFIX = "Protrusions";

export const classes = {
  card: `${PREFIX}-card`,
  addAnotherButton: `${PREFIX}-addAnotherButton`,
  textField: `${PREFIX}-InputTextField-textField`,
  numberInput: `${PREFIX}-InputTextField-numberInput`,
  fieldsContainer: `${PREFIX}-fieldsContainer`,
  dimensions: `${PREFIX}-fieldsContainer-dimensions`,
  dimensionsIllustration: `${PREFIX}-fieldsContainer-dimensionsIllustration`
};

export const Root = styled(FieldContainer)(({ theme }) => ({
  [`.${classes.card}`]: {
    [theme.breakpoints.down("xs")]: {
      width: "200px",
      maxWidth: "unset",
      flexBasis: "unset",
      padding: "0",
      margin: "8px"
    }
  },
  [`.${classes.addAnotherButton}`]: {
    marginLeft: "24px",

    "&:disabled": {
      border: "1px solid rgba($color-cyan-500, 0.38)",
      color: `rgba(${theme.colours.cyan500}, 0.38)`
    }
  },
  [`.${classes.textField}`]: {
    backgroundColor: theme.colours.white
  },

  [`.${classes.numberInput}`]: {
    appearance: "textfield",
    ["&::-webkit-inner-spin-button"]: {
      appearance: "none"
    },
    ["&::-webkit-outer-spin-button"]: {
      appearance: "none"
    }
  },
  [`.${classes.fieldsContainer}`]: {
    width: "100%",
    marginBottom: "32px"
  },
  [`.${classes.dimensions}`]: {
    width: "66%",
    marginBottom: "48px",

    [theme.breakpoints.down("sm")]: {
      marginBottom: "24px"
    },

    [theme.breakpoints.down("lg")]: {
      width: "100%"
    }
  },
  [`.${classes.dimensionsIllustration}`]: {
    margin: "50px 0 20px",
    maxHeight: "160px",
    width: "auto",

    [theme.breakpoints.down("sm")]: {
      marginTop: "20px"
    }
  }
}));

export const StyledTitle = styled("h6")(({ theme }) => ({
  textAlign: "center",
  fontSize: "1.125rem",
  marginBottom: "24px"
}));
