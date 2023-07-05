import { styled } from "@mui/material/styles";

export const OverlapCardsSection = styled("div")(({ theme }) => ({
  marginTop: "-70px",

  [theme.breakpoints.down("sm")]: {
    marginTop: "-112px"
  }
}));
