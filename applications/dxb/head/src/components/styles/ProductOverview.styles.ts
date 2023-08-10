import { styled } from "@mui/material/styles";
import RecaptchaPrivacyLinks from "../RecaptchaPrivacyLinks";

export const StyledProductOverview = styled("div")(({ theme }) => ({
  padding: "36px 0"
}));

export const StyledRecaptchaPrivacyLinks = styled(RecaptchaPrivacyLinks)(
  ({ theme }) => ({
    paddingTop: "18px",
    [theme.breakpoints.up("lg")]: {
      paddingTop: "24px"
    }
  })
);
