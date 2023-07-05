import { styled } from "@mui/material/styles";
import { Typography } from "@bmi-digital/components";

export const Root = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "64px"
}));

export const StyledHead = styled("div")(({ theme }) => ({
  marginBottom: "24px",
  textAlign: "center"
}));

export const StyledHelp = styled(Typography)(({ theme }) => ({
  marginTop: "24px",
  textAlign: "center"
}));
