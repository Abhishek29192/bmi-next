import Button from "@bmi-digital/components/button";
import Container from "@bmi-digital/components/container";
import Icopal from "@bmi-digital/components/logo/Icopal";
import { styled } from "@mui/material/styles";

const PREFIX = "ListItemStyles";

export const classes = {
  "listItem--icon": `${PREFIX}-listItem--icon`
};

export const StyledFooter = styled("div")(({ theme }) => ({
  backgroundColor: `${theme.colours.blue900}`
}));

export const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexFlow: "column nowrap",
  justifyContent: "space-between",
  alignItems: "center",

  [theme.breakpoints.up("md")]: {
    flexFlow: "row nowrap"
  }
}));

export const StyledLogo = styled(Icopal)(() => ({
  margin: "35px 10px 35px 0",
  height: "50px"
}));

export const StyledList = styled("ul")(({ theme }) => ({
  display: "flex",
  flexFlow: "column nowrap",
  justifyContent: "space-between",
  alignItems: "center",

  [theme.breakpoints.up("md")]: {
    flexFlow: "row nowrap"
  }
}));

export const StyledListItem = styled(Container)(({ theme }) => ({
  margin: "0",
  padding: "0",
  textAlign: "center",

  [`.${classes["listItem--icon"]}`]: {
    display: "inline-block"
  },

  [":global(.MuiSvgIcon-root)"]: {
    fontSize: "2em"
  },

  [theme.breakpoints.up("sm")]: {
    marginRight: "16px",
    display: "inline-block"
  },
  "&:last-child": {
    marginRight: "0"
  }
}));

export const StyledLink = styled(Button)(({ theme }) => ({
  color: `${theme.colours.storm}`,
  justifyContent: "flex-start",
  fontFamily: "Effra Medium",
  width: "auto",

  [theme.breakpoints.up("sm")]: {
    width: "100%"
  }
}));
