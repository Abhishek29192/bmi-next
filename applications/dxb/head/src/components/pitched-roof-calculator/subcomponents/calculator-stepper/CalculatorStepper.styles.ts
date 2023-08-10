import { styled } from "@mui/material/styles";
import { Button, Form, Typography } from "@bmi-digital/components";
import Divider from "@mui/material/Divider";

const PREFIX = "CalculatorStepper";

export const classes = {
  title: `${PREFIX}-title`,
  item: `${PREFIX}-item`,
  "step-title": `${PREFIX}-step-title`,
  subtitle: `${PREFIX}-subtitle`,
  computation: `${PREFIX}-computation`,
  component: `${PREFIX}-component`,
  content: `${PREFIX}-content`,
  hr: `${PREFIX}-hr`,
  stepWithoutForm: `${PREFIX}-stepWithoutForm`,
  formContent: `${PREFIX}-stepWithoutForm`,
  "form-sm-padding": `${PREFIX}-form-sm-padding`,
  "form-md-padding": `${PREFIX}-form-md-padding`,
  "form-lg-padding": `${PREFIX}-form-lg-padding`
};

export const Root = styled("div")({
  height: "100%"
});

export const StyledHR = styled(Divider)({
  marginTop: "52px"
});

export const StyledStepTitle = styled(Typography)(({ theme }) => ({
  marginTop: "30px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    marginTop: "18px"
  }
}));

export const StyledContent = styled("div")(({ theme }) => ({
  padding: "64px 0",
  [theme.breakpoints.down("sm")]: {
    padding: "48px 0"
  }
}));

export const StyledComputation = styled(Typography)({
  textAlign: "center",
  padding: "1rem",

  [`&+.${classes.subtitle}`]: {
    marginTop: 0
  }
});

export const StyledSubTitle = styled(Typography)({
  marginTop: "1rem",
  textAlign: "center"
});

export const StyledForm = styled(Form)({
  height: "100%"
});

export const StyledFormContent = styled("div")({
  overflow: "hidden auto",
  padding: "0 30px",
  height: "100%"
});

export const StepWrapper = styled("div")(({ theme }) => ({
  height: "100%",

  [`.${classes["form-sm-padding"]}`]: {
    paddingBottom: "96px",
    ["& .formContent"]: {
      paddingBottom: "0"
    },
    [theme.breakpoints.down("lg")]: {
      paddingBottom: "76px"
    }
  },
  [`.${classes["form-md-padding"]}`]: {
    paddingBottom: "96px",
    ["& .formContent"]: {
      paddingBottom: "0"
    },
    [theme.breakpoints.down("lg")]: {
      paddingBottom: "132px"
    }
  },
  [`.${classes["form-lg-padding"]}`]: {
    paddingBottom: "96px",
    ["& .formContent"]: {
      paddingBottom: "0"
    },
    [theme.breakpoints.down("lg")]: {
      paddingBottom: "188px"
    }
  }
}));

export const StyledSpinnerContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "calc(100vh - 100px)" /* container margins and paddings */
});

export const StyledFooter = styled("div")(({ theme }) => ({
  padding: "24px 30px",
  backgroundColor: theme.colours.white,
  position: "absolute",
  left: "0",
  bottom: "0",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 3,
  borderTop: `1px solid ${theme.colours.alabaster}`,

  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    padding: "16px 24px"
  }
}));

export const FooterButton = styled(Button)(({ theme }) => ({
  height: "44px",
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    "&:not(:first-of-type)": {
      marginTop: "12px"
    }
  }
}));

export const StyledSkipAndNextButtons = styled("div")({
  marginLeft: "auto"
});

export const StyledFooterBackButtonLink = styled(FooterButton)(({ theme }) => ({
  marginRight: "60px",

  [theme.breakpoints.down("lg")]: {
    marginRight: "0"
  }
}));

export const StyledFormSubmitButton = styled(Form.SubmitButton)({
  height: "44px"
});
