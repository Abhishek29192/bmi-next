import { styled } from "@mui/material/styles";
import { Typography, Button } from "@bmi-digital/components";

export const TrainingCatalogueWrapper = styled("div")(({ theme }) => ({
  "&:not(:first-of-type)": {
    marginTop: "60px",

    [theme.breakpoints.down("lg")]: {
      marginTop: "36px"
    }
  }
}));

export const Title = styled(Typography)({
  [`&::after`]: {
    marginBottom: "12px !important"
  }
});

export const Description = styled(Typography)({
  fontSize: "18px",
  marginBottom: "24px"
});

export const ItemsCount = styled(Typography)({
  marginBottom: "12px"
});

export const ShowMoreButton = styled(Button)({
  display: "flex",
  margin: "0 auto",
  marginTop: "32px"
});
