import { buttonClasses } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const LoginBlockStyles = styled("div")(({ theme }) => ({
  display: "flex",
  [`.${buttonClasses.root}`]: {
    fontSize: "0.875rem",
    color: theme.colours.charcoal,
    textAlign: "end"
  },
  [`& .account`]: {
    marginRight: "14px",
    position: "relative",
    "&::after": {
      content: '""',
      backgroundColor: theme.colours.storm,
      display: "block",
      height: "24px",
      right: "-7px",
      width: "1px",
      position: "absolute",
      top: "50%",
      marginTop: "-12px"
    }
  }
}));
