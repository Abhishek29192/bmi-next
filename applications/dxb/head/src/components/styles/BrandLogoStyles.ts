import { styled } from "@mui/material/styles";
import Logo from "@bmi-digital/components/logo";

const PREFIX = "BrandLogoStyles";

export const classes = {
  whiteBox: `${PREFIX}-whiteBox`
};

export const LogoComponent = styled(Logo)(({ theme }) => ({
  fill: "#ffffff",
  height: "60px",
  width: "auto",
  [`.${classes["whiteBox"]}`]: {
    backgroundColor: theme.colours.brandRed
  }
}));
