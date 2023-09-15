import { styled } from "@mui/material/styles";

export const LoginBlockStyles = styled("div")(({ theme }) => ({
  display: "flex",
  "[class*=MuiButton-root]": {
    fontSize: "0.875rem",
    color: theme.colours.charcoal,
    textAlign: "end"
  },
  [`& .account`]: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.colours.storm,
      height: "24px",
      margin: "0 7px",
      width: "1px"
    }
  }
}));
