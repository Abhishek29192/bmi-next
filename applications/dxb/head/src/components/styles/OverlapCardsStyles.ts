import Grid from "@bmi-digital/components/grid";
import { styled } from "@mui/material/styles";

export const OverlapCardsSection = styled("div")(({ theme }) => ({
  marginTop: "-70px",
  backgroundColor: `${theme.colours.white} !important`,
  [theme.breakpoints.up("md")]: {
    marginTop: "-35px"
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: "-75px"
  },
  [theme.breakpoints.up("xl")]: {
    marginTop: "-105px"
  }
}));

export const StyledGrid = styled(Grid)({
  zIndex: 8
});
