import { styled } from "@mui/material/styles";
import { Grid } from "@bmi-digital/components";

export const StyledGridContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    margin: "0 -8px",
    "&>div": {
      padding: "12px 0"
    }
  }
}));
