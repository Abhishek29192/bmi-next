import { styled } from "@mui/material/styles";
import { buttonClasses } from "@mui/material";

export const LoginBlockStyles = styled("div")(({ theme }) => ({
  display: "flex",
  [`.${buttonClasses.root}`]: {
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
