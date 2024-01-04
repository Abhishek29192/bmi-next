import Grid from "@bmi-digital/components/grid";
import { styled } from "@mui/material/styles";

export const OverlapCardsSection = styled("div")(({ theme }) => ({
  marginTop: "-70px",

  [theme.breakpoints.up("md")]: {
    marginTop: "-45px"
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: "-75px"
  }
}));

export const StyledGrid = styled(Grid)({
  zIndex: 8
});
