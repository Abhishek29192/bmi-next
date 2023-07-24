import { Grid } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";

export const ProductListWrapperGrid = styled(Grid)({
  padding: 0
});

export const ProductListGrid = styled(Grid)(({ theme }) => ({
  paddingTop: "60px",
  [theme.breakpoints.down("lg")]: {
    paddingTop: 0
  }
}));
