import { touchRippleClasses } from "@mui/material/ButtonBase";
import Button from "@bmi-digital/components/button";
import { styled, alpha } from "@mui/material/styles";
import CancelIcon from "@bmi-digital/components/icon/Cancel";

export const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: "-14px",
  position: "relative",
  "&:hover": {
    [`& .${touchRippleClasses.root}`]: {
      borderRadius: "50%",
      backgroundColor: alpha(theme.colours.black, 0.04)
    }
  }
}));

export const StyledCancelIcon = styled(CancelIcon)({
  height: "16px",
  width: "16px"
});
