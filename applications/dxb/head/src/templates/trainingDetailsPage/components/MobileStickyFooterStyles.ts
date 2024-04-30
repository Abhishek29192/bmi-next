import Button from "@bmi-digital/components/button";
import { alpha, styled } from "@mui/material/styles";

const PREFIX = "mobileStickyFooter";
export const classes = {
  sticky: `${PREFIX}-sticky`
} as const;

export const MobileStickyContainer = styled("div")(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  backgroundColor: theme.colours.white,
  padding: "18px 16px",

  [`&.${classes.sticky}`]: {
    boxShadow: `0px 0px 9px 0px ${alpha(theme.colours.black, 0.2)}`
  },

  [theme.breakpoints.up("lg")]: {
    display: "none"
  }
}));

export const SeeAllSessionButton = styled(Button)({
  width: "100%"
});
