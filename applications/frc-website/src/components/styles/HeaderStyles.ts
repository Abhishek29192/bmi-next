import Container from "@bmi-digital/components/container";
import Icopal from "@bmi-digital/components/logo/Icopal";
import Typography from "@bmi-digital/components/typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const StyledHeader = styled(Paper)(() => ({
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  zIndex: "10"
}));

export const StyledContainer = styled(Container)(() => ({
  display: "flex",
  flexFlow: "row nowrap",
  justifyContent: "space-between",
  alignItems: "center"
}));

export const StyledLogo = styled(Icopal)(({ theme }) => ({
  margin: "10px 10px 10px 0",
  height: "70px",
  [theme.breakpoints.up("md")]: {
    height: "80px"
  }
}));

export const StyledText = styled(Typography)(({ theme }) => ({
  color: `${theme.colours.cyan500}`
}));
