import Icon from "@bmi-digital/components/icon";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";

export const StyledDescriptionCard = styled("div")(() => ({
  marginBottom: "24px"
}));

export const StyledHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexFlow: "row nowrap",
  alignItems: "center",
  marginBottom: "24px",

  [theme.breakpoints.up("md")]: {
    marginBottom: "0"
  }
}));

export const StyledDescription = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    marginLeft: "117px"
  }
}));

export const StyledIcon = styled(Icon)(({ theme }) => ({
  width: "71px",
  height: "71px",
  marginRight: "16px",
  color: `${theme.colours.cyan400}`,

  [theme.breakpoints.up("md")]: {
    marginRight: "46px"
  }
}));
