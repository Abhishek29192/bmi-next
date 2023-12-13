import Button from "@bmi-digital/components/button";
import CardInput from "@bmi-digital/components/card-input";
import Typography from "@bmi-digital/components/typography";
import { alpha, styled } from "@mui/material/styles";
import FieldContainer from "./subcomponents/_FieldContainer";

const PREFIX = "Protrusions";

export const classes = {
  textField: `${PREFIX}-InputTextField-textField`,
  numericInput: `${PREFIX}-InputTextField-numericInput`,
  dimensionsIllustration: `${PREFIX}-fieldsContainer-dimensionsIllustration`
};

export const Root = styled(FieldContainer)(({ theme }) => ({
  [`.${classes.textField}`]: {
    backgroundColor: theme.colours.white
  },
  [`.${classes.numericInput}`]: {
    appearance: "textfield",
    ["&::-webkit-inner-spin-button"]: {
      appearance: "none"
    },
    ["&::-webkit-outer-spin-button"]: {
      appearance: "none"
    }
  }
}));

export const StyledCard = styled(CardInput)({
  "& svg": {
    height: "120px",
    width: "150px"
  }
});

export const AddAnotherButton = styled(Button)(({ theme }) => ({
  marginLeft: "24px",

  "&:disabled": {
    border: `1px solid ${alpha(theme.colours.cyan500, 0.38)}`,
    color: alpha(theme.colours.cyan500, 0.38)
  }
}));

export const StyledFieldContainer = styled(FieldContainer)({
  width: "100%",
  marginBottom: "32px"
});

export const DimensionsContainer = styled(StyledFieldContainer)(
  ({ theme }) => ({
    width: "66%",
    margin: "0 auto 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("lg")]: {
      width: "100%"
    },

    [`.${classes.dimensionsIllustration}`]: {
      marginBottom: "20px",
      maxHeight: "160px",
      width: "auto"
    }
  })
);

export const ProtrusionWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

export const StyledTitle = styled(Typography)({
  textAlign: "center",
  fontSize: "1.125rem",
  marginBottom: "24px"
});
