import { styled } from "@mui/material/styles";

export const BorderItemElement = styled("div")(({ theme }) => ({
  borderTop: "1px solid #cccccc",
  paddingBottom: "32px",

  [theme.breakpoints.up("sm")]: {
    borderTop: "none",
    paddingBottom: "0"
  }
}));
