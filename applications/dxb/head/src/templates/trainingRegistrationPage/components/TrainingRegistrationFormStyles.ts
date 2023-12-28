import ButtonRadioGroup from "@bmi-digital/components/button-radio-group";
import Form from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import { buttonClasses } from "@mui/material/Button";
import { inputBaseClasses } from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import ProgressIndicator from "../../../components/ProgressIndicator";
import RecaptchaPrivacyLinks from "../../../components/RecaptchaPrivacyLinks";
import TextField from "./TextField";

export const StyledFormFieldsSection = styled(Grid)(({ theme }) => ({
  paddingBottom: "24px",

  [theme.breakpoints.down("lg")]: {
    paddingBottom: "18px"
  }
}));

export const StyledRadioGroup = styled(ButtonRadioGroup)({
  margin: 0
});

export const StyledSubmitButtonWrapper = styled(Form.ButtonWrapper)(
  ({ theme }) => ({
    marginTop: "12px",
    "&&>div": {
      marginTop: 0,

      [theme.breakpoints.down("lg")]: {
        width: "100%",
        [`& .${buttonClasses.root}`]: {
          width: "100%"
        }
      }
    }
  })
);

export const CompetentChamberLabel = styled("label")(({ theme }) => ({
  fontSize: "1.125rem",
  lineHeight: 1.2,
  color: theme.colours.charcoal,
  fontFamily: "Effra Medium",
  width: "100%",
  marginBottom: "20px",
  display: "block"
}));

export const StyledTextArea = styled(TextField)({
  [`& .${inputBaseClasses.root}`]: {
    fontSize: "1rem",
    lineHeight: 1.2
  }
});

export const OtherOptionField = styled(TextField)({
  marginTop: "24px"
});

export const StyledRecaptchaText = styled(RecaptchaPrivacyLinks)(
  ({ theme }) => ({
    marginTop: "24px",

    [theme.breakpoints.up("lg")]: {
      textAlign: "right"
    }
  })
);

export const StyledProgressIndicator = styled(ProgressIndicator)({
  position: "relative",
  left: 0,
  right: 0,
  marginLeft: "0.5rem"
});
