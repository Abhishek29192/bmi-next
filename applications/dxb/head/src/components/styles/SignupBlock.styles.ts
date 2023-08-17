import { styled } from "@mui/material/styles";

const PREFIX = "IntegratedSignupBlock";

export const classes = {
  dialogTitle: `${PREFIX}-dialogTitle`
};

export const StyledIntegratedSignupBlock = styled("div")(({ theme }) => ({
  [`.${classes.dialogTitle}`]: {
    marginBottom: "32px"
  },
  [`.InputBanner`]: {
    [`:global(.RecaptchaPrivacyLinks)`]: {
      marginTop: "0.5rem",
      fontSize: "0.7rem"
    }
  }
}));
