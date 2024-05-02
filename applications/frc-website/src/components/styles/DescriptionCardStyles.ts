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
