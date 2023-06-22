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

export const Root = styled("div")(({ theme }) => ({
  height: "100%"
}));

export const StyledHR = styled(Divider)(({ theme }) => ({
  marginTop: "52px"
}));

export const StyledStepTitle = styled(Typography)(({ theme }) => ({
  marginTop: "48px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    marginTop: "36px"
  }
}));

export const StyledContent = styled("div")(({ theme }) => ({
  padding: "64px"
}));

export const StyledComputation = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  padding: "1rem"
}));

export const StyledSubTitle = styled(Typography)(({ theme }) => ({
  marginTop: "1rem",
  textAlign: "center"
}));

export const StyledFormContent = styled("div")(({ theme }) => ({
  overflow: "hidden auto",
  padding: "0 32px 32px",
  height: "100%"
}));

export const StyledForm = styled("div")(({ theme }) => ({
  height: "100%",

  [`.${classes["form-sm-padding"]}`]: {
    paddingBottom: "96px",
    ["& .formContent"]: {
      paddingBottom: "0"
    },
    [theme.breakpoints.down("md")]: {
      paddingBottom: "76px"
    }
  },
  [`.${classes["form-md-padding"]}`]: {
    paddingBottom: "96px",
    ["& .formContent"]: {
      paddingBottom: "0"
    },
    [theme.breakpoints.down("md")]: {
      paddingBottom: "132px"
    }
  },
  [`.${classes["form-lg-padding"]}`]: {
    paddingBottom: "96px",
    ["& .formContent"]: {
      paddingBottom: "0"
    },
    [theme.breakpoints.down("md")]: {
      paddingBottom: "188px"
    }
  },
  [`.${classes.formContent}`]: {
    overflow: "hidden auto",
    padding: "0 32px 32px",
    height: "100%"
  }
}));

export const StyledSpinnerContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "calc(100vh - 100px)" /* container margins and paddings */
}));

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
  zIndex: 2,
  borderTop: `1px solid ${theme.colours.alabaster}`
}));

//skipAndNextButtons

export const StyledSkipAndNextButtons = styled("div")(({ theme }) => ({
  marginLeft: "auto"
}));

export const StyledFooterBackButton = styled(Button)(({ theme }) => ({
  height: "44px"
}));

export const StyledFooterBackButtonLink = styled(Button)(({ theme }) => ({
  height: "44px",
  marginRight: "60px",

  [theme.breakpoints.down("md")]: {
    marginRight: "0"
  }
}));

export const StyledFormSubmitButton = styled(Form.SubmitButton)(
  ({ theme }) => ({
    height: "44px"
  })
);
