import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

export const StyledResultsGrid = styled(Grid)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "center",
  width: "448px",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    width: "100%"
  }
}));
