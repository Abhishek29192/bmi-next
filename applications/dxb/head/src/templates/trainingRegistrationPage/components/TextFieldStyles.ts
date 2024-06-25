import IconButton from "@bmi-digital/components/icon-button";
import CancelIcon from "@bmi-digital/components/icon/Cancel";
import { touchRippleClasses } from "@mui/material/ButtonBase";
import { alpha, styled } from "@mui/material/styles";

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
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
