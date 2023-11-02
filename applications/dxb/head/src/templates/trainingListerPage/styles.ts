import { Grid } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";

export const CataloguesContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    marginTop: "12px"
  }
}));

export const SearchWrapper = styled("div")(({ theme }) => ({
  marginBottom: "32px",

  [theme.breakpoints.down("lg")]: {
    marginBottom: "24px"
  }
}));
