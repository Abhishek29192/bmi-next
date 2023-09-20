import { styled } from "@mui/material/styles";
import { Grid } from "@bmi-digital/components";

export const DescriptionGrid = styled(Grid)(({ theme }) => ({
  margin: "0 0 48px",
  [theme.breakpoints.up("lg")]: {
    marginBottom: "60px"
  }
}));
