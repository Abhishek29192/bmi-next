import { styled } from "@mui/material/styles";
import { Grid } from "@bmi-digital/components";

export const StyledDescription = styled("div")(({ theme }) => ({
  paddingBottom: "32px"
}));

export const StyledGridItem = styled(Grid)(({ theme }) => ({
  paddingTop: "12px",
  paddingBottom: "0",
  "&:last-child": {
    paddingTop: "0",
    paddingBottom: "12px"
  }
}));
