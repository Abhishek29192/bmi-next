import AnchorLink from "@bmi-digital/components/anchor-link";
import Grid from "@bmi-digital/components/grid";
import { styled } from "@mui/material/styles";

export const ProductListWrapperGrid = styled(Grid)({
  padding: 0
});

export const FooterAnchorLink = styled(AnchorLink)({
  marginTop: "12px"
});

export const ProductListGrid = styled(Grid)(({ theme }) => ({
  paddingTop: "60px",
  [theme.breakpoints.down("lg")]: {
    paddingTop: 0
  }
}));
