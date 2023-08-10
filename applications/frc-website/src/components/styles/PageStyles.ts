import { styled } from "@mui/material/styles";

export const StyledPage = styled("div")(({ theme }) => ({
  paddingTop: "100px",
  backgroundColor: `${theme.colours.white}`,

  "& .link": {
    textDecoration: "none"
  },

  "& .hero": {
    background: `${theme.colours.white}`,
    color: `${theme.colours.charcoal}`
  }
}));
