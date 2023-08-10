import { styled } from "@mui/material/styles";

export const PromoSectionLink = styled("div")(({ theme }) => ({
  marginTop: "32px",

  [theme.breakpoints.up("md")]: {
    marginTop: "24px"
  }
}));
