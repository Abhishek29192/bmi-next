import Grid from "@bmi-digital/components/grid";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";

const PREFIX = "SearchBoxStyles";
export const classes = {
  searchBox: `${PREFIX}-searchBox`
};

export const CataloguesContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    marginTop: "12px"
  }
}));

export const StyledSearchTitle = styled(Typography)({ marginBottom: "12px" });

export const SearchWrapper = styled("div")(({ theme }) => ({
  marginBottom: "32px",

  [theme.breakpoints.down("lg")]: {
    marginBottom: "24px"
  }
}));
