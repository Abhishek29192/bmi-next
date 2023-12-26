import Grid from "@bmi-digital/components/grid";
import { styled } from "@mui/material/styles";

export const OverlapCardsSection = styled("div")(({ theme }) => ({
  marginTop: "-70px",

  [theme.breakpoints.up("sm")]: {
    marginTop: "-112px"
  }
}));

export const StyledGrid = styled(Grid)({
  zIndex: 8
});
